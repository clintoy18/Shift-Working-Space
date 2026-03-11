# Guest Check-In System & Database Normalization - Implementation Plan

## 📋 Executive Summary

This plan implements a **guest check-in system** for walk-in visitors with **real-time timeout warnings**, **duration extensions**, and **penalty tracking**. Guests are identified by auto-generated IDs (GUEST-001, GUEST-002, etc.) without requiring registration.

**Key Features**:
- ✅ Walk-in guests check in without registration
- ✅ Auto-generated guest IDs (GUEST-001, GUEST-002, etc.)
- ✅ Configurable duration allocation (15, 30, 60, 120 minutes)
- ✅ Real-time timeout warnings (yellow/amber alerts)
- ✅ Duration extension with additional charges
- ✅ Penalty tracking for overtime usage
- ✅ Complete audit trail for all transactions
- ✅ Backward compatible with existing registered user check-ins

---

## 🗂️ Database Schema Changes

### New Model: Guest
```typescript
{
  guestId: "GUEST-001",      // Auto-generated
  email?: string,            // Optional
  phoneNumber?: string,      // Optional
  isDeleted: boolean,
  timestamps: true
}
```

### Modified: Seat Model
**New Fields**:
- `pricingOptions: Array` - Flexible pricing per seat
  ```typescript
  {
    duration: number,        // Duration in minutes (60, 120, 240, 480)
    label: string,          // "1 Hour", "2 Hours", "Half Day", "Full Day"
    price: number,          // Price for this duration
    isActive: boolean       // Enable/disable this option
  }
  ```
**Example**:
```typescript
pricingOptions: [
  { duration: 60, label: "1 Hour", price: 15, isActive: true },
  { duration: 120, label: "2 Hours", price: 25, isActive: true },
  { duration: 240, label: "Half Day", price: 40, isActive: true },
  { duration: 480, label: "Full Day", price: 60, isActive: true }
]
```

### Modified: CheckIn Model
**New Fields**:
- `guest?: ObjectId` - Reference to Guest (optional, mutually exclusive with user)
- `checkInType: "registered" | "guest"` - Quick filtering
- `allocatedDurationMinutes: number` - Duration from selected pricing option
- `warningThresholdMinutes: number` - When to warn (default: 5 min)
- `status: "active" | "warning" | "overtime" | "completed"` - Real-time status
- `extensionHistory: Array` - Track all extensions with timestamps
- `penaltyCharges: Array` - Track all penalties with reasons
- `pricingOptionLabel: string` - Label of selected pricing (e.g., "1 Hour", "Half Day")

**Validation**:
- Exactly one of `user` or `guest` must be present
- `allocatedDurationMinutes > 0`
- `warningThresholdMinutes < allocatedDurationMinutes`

### Modified: Reservation Model
**New Fields**:
- `guest?: ObjectId` - Reference to Guest (optional)
- `reservationType: "registered" | "guest"` - Quick filtering

---

## 🔌 Backend API Endpoints

### Public Endpoints (No Auth Required)
```
POST   /api/checkin/checkin            - Unified check-in (guest or registered)
POST   /api/checkin/checkout           - Unified check-out
GET    /api/checkin/:checkInId         - Get check-in details
```

### Protected Endpoints (Cashier/Admin Only)
```
GET    /api/checkin/active             - Get active check-ins with status
GET    /api/checkin/warnings           - Get timeout warnings (yellow/red alerts)
GET    /api/checkin/history            - Get check-in history with filters
PATCH  /api/checkin/:checkInId         - Update check-in
POST   /api/checkin/:checkInId/extend  - Extend duration (select new pricing option)
POST   /api/checkin/:checkInId/penalty - Apply penalty charge
```

---

## 🎨 Frontend Components

### New Components
1. **CheckInForm** - Unified form for guest and registered user check-in
   - User type selection (Guest or Registered User)
   - Seat selection with pricing display
   - Dynamic pricing options based on selected seat
   - Auto-calculated charge from pricing option
   - Optional email/phone for guests
   - Receipt display with guest ID or user name

2. **CheckInManagement** - Admin/Cashier dashboard
   - Active check-ins list
   - Real-time duration tracking
   - Quick check-out button
   - Payment status updates

3. **TimeoutWarningAlert** - Real-time warning component
   - Countdown timer
   - Color-coded status (green → yellow → red)
   - Action buttons (Extend, Penalty, Checkout)
   - Extension history display

4. **ExtensionModal** - Duration extension dialog
   - Additional minutes input
   - Auto-calculated charge
   - Confirmation button

5. **PenaltyModal** - Penalty application dialog
   - Overtime duration display
   - Penalty amount input
   - Reason dropdown
   - Audit trail

---

## 🔄 Check-In Flow (Guest & Registered)

```
1. Guest/User arrives
   ↓
2. Cashier opens unified CheckInForm
   - Selects user type: "Guest" or "Registered User"
   - Selects seat (e.g., "Island Premium")
   - System displays pricing options:
     * 1 Hour: $15
     * 2 Hours: $25
     * Half Day (4 hrs): $40
     * Full Day (8 hrs): $60
   - Cashier selects pricing option (e.g., "1 Hour: $15")
   - Selects payment status (Paid/Pending/Free)
   - If guest: optionally collects email/phone
   ↓
3. System creates CheckIn record
   - Auto-generates guestId: "GUEST-001" (if guest)
   - Or uses userId (if registered)
   - Sets allocatedDurationMinutes: 60 (from pricing)
   - Sets paymentAmount: 15 (from pricing)
   - Sets pricingOptionLabel: "1 Hour"
   - Sets warningThresholdMinutes: 5
   - Sets status: "active"
   ↓
4. Cashier displays receipt
   - Guest ID: GUEST-001 (or User: John Doe)
   - Seat: Island Premium
   - Duration: 1 Hour (60 minutes)
   - Charge: $15
   ↓
5. Guest/User occupies seat (real-time monitoring)
   - Frontend polls every 10 seconds
   - At 55 min: Status → "warning" (5 min remaining)
   - Cashier sees yellow/amber alert
   ↓
6. Cashier chooses action:

   Option A - EXTEND:
   - Click "Extend Duration"
   - Select new pricing option (e.g., "1 Hour: $15")
   - Duration updated to 120 min
   - Charge added to total

   Option B - PENALTY:
   - Click "Apply Penalty"
   - Confirm penalty charge
   - Status stays "warning"

   Option C - CHECKOUT:
   - Click "Check Out"
   - Immediate checkout
   ↓
7. If no action and time expires:
   - Status → "overtime"
   - Cashier sees red alert
   - Penalty charges accumulate per minute
   ↓
8. Cashier processes checkout:
   - System calculates: $15 + $15 + $X = Total
   - Updates checkOutTime
   - Calculates durationMinutes
   - Updates paymentAmount
   - Changes seat status to "available"
   ↓
9. Record persists for analytics
```

---

## 📊 Real-Time Status Indicators

| Status | Color | Meaning | Action |
|--------|-------|---------|--------|
| **active** | 🟢 Green | Time remaining > threshold | Monitor |
| **warning** | 🟡 Yellow/Amber | Time remaining ≤ threshold | Extend or Penalty |
| **overtime** | 🔴 Red | Time exceeded | Penalty accumulating |
| **completed** | ⚪ Gray | Check-out processed | View history |

---

## 🛠️ Implementation Steps

### Phase 1: Database Models (Backend)
1. Create `backend/src/models/Guest.ts`
2. Update `backend/src/models/CheckIn.ts` (add timeout fields)
3. Update `backend/src/models/Reservation.ts` (add guest field)

### Phase 2: Backend API
4. Create `backend/src/controllers/checkin.controller.ts`
5. Create `backend/src/routes/checkin.routes.ts`
6. Update `backend/src/server.ts` (mount routes)
7. Create migration script `backend/src/utils/migrations/addGuestSupport.ts`

### Phase 3: Frontend Interfaces
8. Create `frontend/src/interfaces/requests/IGuestCheckInRequest.ts`
9. Update `frontend/src/interfaces/models/ICheckIn.ts`

### Phase 4: Frontend Services
10. Create `frontend/src/services/CheckInService.ts`

### Phase 5: Frontend Components
11. Create `frontend/src/components/checkin/GuestCheckInForm.tsx`
12. Create `frontend/src/components/checkin/CheckInManagement.tsx`
13. Create `frontend/src/components/checkin/TimeoutWarningAlert.tsx`
14. Create `frontend/src/components/checkin/ExtensionModal.tsx`
15. Create `frontend/src/components/checkin/PenaltyModal.tsx`

### Phase 6: Integration
16. Update `frontend/src/App.tsx` (add routes)
17. Update rate limiting middleware for guest endpoints

### Phase 7: Testing
18. Test guest check-in flow
19. Test timeout warnings
20. Test extensions and penalties
21. Test checkout and final calculations

---

## 🧪 Testing Checklist

### Backend Tests
- [ ] Guest check-in creates record with auto-generated ID
- [ ] Seat status changes to "occupied"
- [ ] Check-in status starts as "active"
- [ ] Warning threshold triggers status change to "warning"
- [ ] Extension adds to allocatedDurationMinutes
- [ ] Penalty records are tracked
- [ ] Check-out calculates total correctly
- [ ] Seat status changes back to "available"

### Frontend Tests
- [ ] GuestCheckInForm displays available seats
- [ ] Duration selection works (15, 30, 60, 120 min)
- [ ] Charge auto-calculates based on hourly rate
- [ ] Receipt displays guest ID (GUEST-001)
- [ ] TimeoutWarningAlert shows countdown timer
- [ ] Color changes from green → yellow → red
- [ ] Extension modal calculates new charge
- [ ] Penalty modal tracks reason
- [ ] Check-out displays final receipt

### End-to-End Tests
- [ ] Complete guest check-in → warning → extension → checkout flow
- [ ] Complete guest check-in → warning → penalty → checkout flow
- [ ] Complete guest check-in → overtime → checkout with penalties
- [ ] Multiple guests checking in simultaneously
- [ ] Guest check-in with optional email/phone

---

## 📝 Key Implementation Notes

### Guest ID Generation
- Auto-generated sequential IDs: GUEST-001, GUEST-002, etc.
- No manual input required from guest
- Stored in Guest model with optional email/phone

### Timeout Warning Logic
- Frontend polls active check-ins every 10 seconds
- Compares `currentTime - checkInTime` against `allocatedDurationMinutes`
- When remaining time ≤ `warningThresholdMinutes`, status changes to "warning"
- Cashier sees visual alert and countdown timer

### Extension Tracking
- Each extension logged with:
  - `addedMinutes`: How many minutes added
  - `addedAmount`: Charge for extension
  - `appliedAt`: Timestamp
  - `appliedBy`: Cashier name/ID

### Penalty Tracking
- Each penalty logged with:
  - `amount`: Penalty charge
  - `reason`: Why penalty applied (Overtime, Damage, Other)
  - `appliedAt`: Timestamp
  - `appliedBy`: Cashier name/ID

### Backward Compatibility
- Existing registered user check-ins continue to work
- New `guest` field is optional
- Validation ensures exactly one of `user` or `guest` is present
- Migration script updates existing records

---

## 🔐 Security Considerations

- Guest endpoints are rate-limited to prevent abuse
- Bot detection middleware applied to guest endpoints
- No authentication required for guest check-in (public endpoint)
- Cashier/Admin endpoints require authentication + role check
- All transactions logged with `processedBy` for audit trail
- Soft deletes preserve data for compliance

---

## 📈 Future Enhancements

- SMS/Email notifications for timeout warnings
- Guest reservation system
- Recurring guest discounts
- Analytics dashboard for guest check-in patterns
- Integration with payment gateway for automatic charging
- QR code generation for guest receipts

---

## 📞 Support

For questions or clarifications, refer to the detailed plan at:
`C:\Users\Full Scale\.claude\plans\enumerated-brewing-valley.md`

