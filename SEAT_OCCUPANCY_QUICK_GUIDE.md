# Seat Occupancy Validation - Quick Guide ⚡

## 🎯 What It Does

When someone tries to check in to a seat that already has an active check-in:
1. ✅ System detects the existing check-in
2. ✅ Rejects the new check-in
3. ✅ Returns error with existing check-in details
4. ✅ Prevents double-bookings

---

## 📍 Where It's Implemented

**File**: `backend/src/controllers/checkin.controller.ts`
**Function**: `checkIn` (lines 72-93)

---

## 🔄 How It Works

### Step 1: Check for Existing Check-In
```typescript
const existingCheckIn = await CheckIn.findOne({
  seat: seatId,
  status: { $in: ["active", "warning", "overtime"] },
  isDeleted: false,
});
```

### Step 2: If Found, Reject with Error
```typescript
if (existingCheckIn) {
  return res.status(409).json({
    message: `Seat is currently occupied. ${identifier} is still checked in.`,
    existingCheckInId: existingCheckIn._id.toString(),
    existingCheckInType: existingCheckIn.checkInType,
    checkInTime: existingCheckIn.checkInTime,
    status: existingCheckIn.status,
  });
}
```

### Step 3: If Not Found, Proceed with Check-In
```typescript
// Create new check-in record
const checkInRecord = new CheckIn({...});
await checkInRecord.save();

// Update seat status
seat.status = "occupied";
await seat.save();
```

---

## 📊 Example Scenarios

### Scenario 1: Seat Available ✅
```
Guest A checks in to Seat A-01
  ↓
System finds no existing check-in
  ↓
Check-in succeeds
  ✅ Status: 201 Created
```

### Scenario 2: Seat Occupied ❌
```
Guest A is checked in to Seat A-01 (status: active)
Guest B tries to check in to Seat A-01
  ↓
System finds existing check-in for Guest A
  ↓
Check-in rejected with error:
{
  "message": "Seat is currently occupied. Guest GUEST-001 is still checked in.",
  "existingCheckInId": "507f1f77bcf86cd799439011",
  "existingCheckInType": "guest",
  "checkInTime": "2026-02-28T10:00:00.000Z",
  "status": "active"
}
  ❌ Status: 409 Conflict
```

### Scenario 3: Seat Available After Checkout ✅
```
Guest A checks in to Seat A-01
Guest A checks out
  ↓
Seat status: available
  ↓
Guest B checks in to Seat A-01
  ✅ Status: 201 Created
```

---

## ✅ Key Features

| Feature | Benefit |
|---------|---------|
| Occupancy Detection | Prevents double-bookings |
| Clear Error Messages | Cashier knows what's wrong |
| Existing Check-In Details | Helps identify who's using seat |
| Proper HTTP Status | 409 Conflict for occupied seats |
| Data Integrity | One guest per seat |

---

## 🧪 Testing Checklist

- [ ] Check in Guest A to Seat A-01
- [ ] Try to check in Guest B to same Seat A-01
- [ ] Verify error response (409 Conflict)
- [ ] Verify error message is clear
- [ ] Verify existing check-in details are returned
- [ ] Check out Guest A
- [ ] Try to check in Guest B again
- [ ] Verify check-in succeeds

---

## 🚀 Next Steps

1. **Restart Backend**
   ```bash
   cd backend && npm run dev
   ```

2. **Test the Feature**
   - Create first check-in on a seat
   - Try to create second check-in on same seat
   - Verify error is returned
   - Check out first guest
   - Try second check-in again
   - Verify it succeeds

3. **Verify Error Response**
   - Check HTTP status is 409
   - Check error message is clear
   - Check existing check-in details are provided

---

## 📋 Error Response Format

```json
{
  "message": "Seat is currently occupied. Guest GUEST-001 is still checked in.",
  "existingCheckInId": "507f1f77bcf86cd799439011",
  "existingCheckInType": "guest",
  "checkInTime": "2026-02-28T10:00:00.000Z",
  "status": "active"
}
```

---

**Status**: ✅ IMPLEMENTED AND READY FOR TESTING

