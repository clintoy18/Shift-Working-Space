# CheckIn Model - Bugs Found & Analysis 🐛

## 🎯 Critical Bugs Identified

### Bug #1: Missing Validation for User/Guest Relationship ⚠️

**Location**: `backend/src/models/CheckIn.ts` (lines 98-103)

**Issue**: The validation only checks if EITHER user OR guest exists, but doesn't validate the relationship between `checkInType` and the actual user/guest reference.

**Current Code**:
```typescript
CheckInSchema.pre("save", function (next) {
  if (!this.user && !this.guest) {
    return next(new Error("CheckIn must have either a user or guest"));
  }
  next();
});
```

**Problem Scenario**:
```typescript
// This would PASS validation but is WRONG:
const checkIn = new CheckIn({
  checkInType: "guest",      // Says it's a guest check-in
  user: userId,              // But has a user reference
  guest: undefined,          // And no guest reference
  // ... other fields
});
await checkIn.save(); // ✅ Passes validation (BUG!)

// This would also PASS validation but is WRONG:
const checkIn = new CheckIn({
  checkInType: "registered", // Says it's registered
  user: undefined,           // But no user reference
  guest: guestId,            // Has a guest reference instead
  // ... other fields
});
await checkIn.save(); // ✅ Passes validation (BUG!)
```

**Impact**:
- Data inconsistency
- Frontend expects `user` for registered check-ins but might get `guest`
- Frontend expects `guest` for guest check-ins but might get `user`
- Causes errors in CheckInManagement component when accessing `checkIn.user?.fullName` or `checkIn.guest?.guestId`

**Fix**: Add validation to ensure `checkInType` matches the actual reference:
```typescript
CheckInSchema.pre("save", function (next) {
  // Must have either user or guest
  if (!this.user && !this.guest) {
    return next(new Error("CheckIn must have either a user or guest"));
  }

  // checkInType must match the reference
  if (this.checkInType === "registered" && !this.user) {
    return next(new Error("Registered check-in must have a user reference"));
  }

  if (this.checkInType === "guest" && !this.guest) {
    return next(new Error("Guest check-in must have a guest reference"));
  }

  // Cannot have both user and guest
  if (this.user && this.guest) {
    return next(new Error("CheckIn cannot have both user and guest references"));
  }

  next();
});
```

---

### Bug #2: Missing Status Update Logic ⚠️

**Location**: `backend/src/controllers/checkin.controller.ts` (lines 341-352)

**Issue**: The `getActiveCheckIns` endpoint calculates `timeRemainingMinutes` but NEVER updates the CheckIn status from "active" to "warning" or "overtime" in the database.

**Current Code**:
```typescript
const enrichedCheckIns = checkIns.map((checkIn) => {
  const elapsedMinutes = Math.floor(
    (now.getTime() - checkIn.checkInTime.getTime()) / 60000
  );
  const timeRemainingMinutes = checkIn.allocatedDurationMinutes - elapsedMinutes;

  return {
    ...checkIn.toJSON(),
    elapsedMinutes,
    timeRemainingMinutes,  // ← Calculated but status NOT updated!
  };
});
```

**Problem Scenario**:
```
Guest checks in at 10:00 AM for 60 minutes
allocatedDurationMinutes = 60
warningThresholdMinutes = 5

At 10:55 AM (55 minutes elapsed):
- timeRemainingMinutes = 60 - 55 = 5 minutes
- Should trigger: status = "warning"
- Actually: status still = "active" ❌

At 11:01 AM (61 minutes elapsed):
- timeRemainingMinutes = 60 - 61 = -1 minutes
- Should trigger: status = "overtime"
- Actually: status still = "active" ❌
```

**Impact**:
- Frontend shows wrong status color (green instead of yellow/red)
- Cashiers don't get visual warnings
- Timeout warnings endpoint might not work correctly
- No audit trail of when status changed

**Fix**: Update status in database when time thresholds are crossed:
```typescript
const enrichedCheckIns = checkIns.map(async (checkIn) => {
  const elapsedMinutes = Math.floor(
    (now.getTime() - checkIn.checkInTime.getTime()) / 60000
  );
  const timeRemainingMinutes = checkIn.allocatedDurationMinutes - elapsedMinutes;

  // Determine new status based on time remaining
  let newStatus = checkIn.status;

  if (timeRemainingMinutes <= 0) {
    newStatus = "overtime";
  } else if (
    timeRemainingMinutes <= checkIn.warningThresholdMinutes &&
    checkIn.status === "active"
  ) {
    newStatus = "warning";
  }

  // Update status in database if changed
  if (newStatus !== checkIn.status) {
    await CheckIn.findByIdAndUpdate(checkIn._id, { status: newStatus });
  }

  return {
    ...checkIn.toJSON(),
    status: newStatus,  // Return updated status
    elapsedMinutes,
    timeRemainingMinutes,
  };
});

// Wait for all updates to complete
await Promise.all(enrichedCheckIns);
```

---

### Bug #3: Inconsistent Field Naming ⚠️

**Location**: Multiple files

**Issue**: The CheckIn model uses `checkInId` in responses but the actual MongoDB field is `_id` (transformed to `id`).

**Current Code in Controller** (line 175):
```typescript
res.status(201).json({
  checkInId: checkInRecord._id.toString(),  // ← Using checkInId
  // ...
});
```

**Current Code in CheckInManagement** (line 176):
```typescript
<tr key={checkIn.id || checkIn.checkInId} className="hover:bg-gray-50">
```

**Problem**:
- Response uses `checkInId` but model transforms to `id`
- Frontend checks both `checkIn.id` and `checkIn.checkInId` (defensive coding)
- Inconsistent naming across codebase
- Confusing for developers

**Fix**: Use consistent `id` field everywhere:
```typescript
// In controller response
res.status(201).json({
  id: checkInRecord._id.toString(),  // ← Use 'id' consistently
  checkInType,
  // ...
});

// In frontend
<tr key={checkIn.id} className="hover:bg-gray-50">
  {/* ... */}
  onClick={() => handleCheckOut(checkIn.id)}
```

---

### Bug #4: Missing Null Checks in Frontend ⚠️

**Location**: `frontend/src/components/checkin/CheckInManagement.tsx` (lines 88-93)

**Issue**: The `getIdentifier` function doesn't handle cases where both user and guest are null, or where the data structure is unexpected.

**Current Code**:
```typescript
const getIdentifier = (checkIn: ICheckIn) => {
  if (checkIn.checkInType === "guest") {
    return checkIn.guest?.guestId || "Unknown Guest";
  }
  return checkIn.user?.fullName || "Unknown User";
};
```

**Problem Scenario**:
```typescript
// If checkInType is "guest" but guest is null:
checkIn = {
  checkInType: "guest",
  guest: null,  // ← Null!
  user: { fullName: "John Doe" }
}

getIdentifier(checkIn) // Returns "Unknown Guest" ✅ (OK)

// But if checkInType is "registered" but user is null:
checkIn = {
  checkInType: "registered",
  user: null,  // ← Null!
  guest: { guestId: "GUEST-001" }
}

getIdentifier(checkIn) // Returns "Unknown User" ✅ (OK)

// But if BOTH are null (data corruption):
checkIn = {
  checkInType: "registered",
  user: null,
  guest: null
}

getIdentifier(checkIn) // Returns "Unknown User" ✅ (OK but hides bug)
```

**Impact**: Silently hides data corruption issues

**Fix**: Add explicit validation:
```typescript
const getIdentifier = (checkIn: ICheckIn) => {
  if (checkIn.checkInType === "guest") {
    if (!checkIn.guest?.guestId) {
      console.warn("Guest check-in missing guest reference:", checkIn.id);
      return "Unknown Guest";
    }
    return checkIn.guest.guestId;
  }

  if (checkIn.checkInType === "registered") {
    if (!checkIn.user?.fullName) {
      console.warn("Registered check-in missing user reference:", checkIn.id);
      return "Unknown User";
    }
    return checkIn.user.fullName;
  }

  console.error("Invalid checkInType:", checkIn.checkInType);
  return "Invalid Check-In";
};
```

---

## 📊 Bug Summary Table

| Bug # | Severity | Location | Issue | Impact |
|-------|----------|----------|-------|--------|
| #1 | 🔴 Critical | CheckIn.ts | No validation of checkInType vs reference | Data inconsistency, frontend errors |
| #2 | 🔴 Critical | checkin.controller.ts | Status not updated to warning/overtime | Wrong visual indicators, no warnings |
| #3 | 🟡 Medium | Multiple files | Inconsistent field naming (checkInId vs id) | Confusion, potential bugs |
| #4 | 🟡 Medium | CheckInManagement.tsx | Missing null checks | Silent data corruption |

---

## 🔧 Recommended Fixes (Priority Order)

### Priority 1 (Critical - Do First)
1. **Fix Bug #1**: Add checkInType validation to CheckIn model
2. **Fix Bug #2**: Update status in getActiveCheckIns endpoint

### Priority 2 (Medium - Do Soon)
3. **Fix Bug #3**: Standardize on `id` field naming
4. **Fix Bug #4**: Add explicit null checks in frontend

---

## 🧪 Testing Checklist

After fixes are applied:

- [ ] Create guest check-in with registered user reference (should fail)
- [ ] Create registered check-in with guest reference (should fail)
- [ ] Create check-in with both user and guest (should fail)
- [ ] Check-in status changes from "active" to "warning" at correct time
- [ ] Check-in status changes from "warning" to "overtime" at correct time
- [ ] Frontend displays correct identifier for guest check-ins
- [ ] Frontend displays correct identifier for registered check-ins
- [ ] No console warnings for valid check-ins
- [ ] Console warnings appear for corrupted check-ins
- [ ] All API responses use consistent `id` field

---

**Date**: February 28, 2026
**Status**: Bugs Identified - Ready for Fixes
**Severity**: 2 Critical, 2 Medium

