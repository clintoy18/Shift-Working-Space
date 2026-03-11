# Cashier Dashboard - Check-In System Integration

## Overview

The Guest Check-In System has been successfully integrated into the Cashier Dashboard. Cashiers now have dedicated tabs for managing check-ins directly from their dashboard.

---

## Integration Details

### Location
**File**: `frontend/src/utils/roleUtils.tsx`

### Cashier Dashboard Tabs

The cashier dashboard now includes three tabs:

1. **Check-In** - Create new check-ins (guest or registered user)
2. **Active Check-Ins** - Monitor and manage active check-ins in real-time
3. **Profile** - View and edit cashier profile

### Code Changes

```typescript
export const cashierTabs = [
  { label: "Check-In", content: <CheckInForm /> },
  { label: "Active Check-Ins", content: <CheckInManagement /> },
  { label: "Profile", content: <Profile /> },
];
```

---

## Cashier Workflow

### Step 1: Access Cashier Dashboard
- Login as a cashier user
- Navigate to `/dashboard`
- Dashboard automatically loads with cashier-specific tabs

### Step 2: Create Check-In (Tab 1: "Check-In")
1. Click the "Check-In" tab
2. Select check-in type:
   - **Guest**: Walk-in visitor (auto-generates ID: GUEST-001, GUEST-002, etc.)
   - **Registered User**: Existing member (search and select)
3. Select seat from available seats
4. Choose pricing option (1 Hour, 2 Hours, Half Day, Full Day, etc.)
5. Enter payment status (Paid, Pending, Refunded)
6. For guests: optionally add email/phone for receipts
7. Review confirmation modal
8. Submit check-in
9. Receive check-in confirmation with ID

### Step 3: Monitor Active Check-Ins (Tab 2: "Active Check-Ins")
1. Click the "Active Check-Ins" tab
2. View real-time table of all active check-ins
3. See:
   - Guest/User identifier
   - Seat number
   - Check-in time
   - Time remaining (color-coded)
   - Payment status
   - Amount charged
4. Filter by:
   - Type (Guest/Registered)
   - Status (Active/Warning/Overtime)
5. Quick actions:
   - **Check Out**: Immediately check out guest
   - **Extend**: Add more time with additional charge
   - **Apply Penalty**: Charge penalty for overtime/damage

### Step 4: Real-Time Monitoring
- Dashboard auto-refreshes every 10 seconds
- Timeout warnings appear when time remaining ≤ 5 minutes
- Status changes: Active → Warning → Overtime
- Color indicators: Green → Yellow → Red

---

## Features Available to Cashiers

### Check-In Management
✅ Create guest check-ins (no registration required)
✅ Create registered user check-ins
✅ Auto-generated guest IDs
✅ Flexible pricing options per seat
✅ Payment tracking (Paid/Pending/Refunded)
✅ Optional guest contact info (email/phone)

### Real-Time Monitoring
✅ View all active check-ins
✅ Real-time countdown timers
✅ Timeout warnings (5 minutes before expiry)
✅ Status indicators (Active/Warning/Overtime)
✅ Color-coded urgency (Green/Yellow/Red)

### Duration Management
✅ Extend check-in duration
✅ Preset extension options (15, 30, 60 minutes)
✅ Custom duration input
✅ Auto-calculated additional charges
✅ Extension history tracking

### Penalty System
✅ Apply penalty charges
✅ Multiple penalty reasons (Overtime, Damage, Late Checkout, Other)
✅ Auto-calculation based on overtime
✅ Manual amount entry
✅ Penalty history tracking

### Check-Out
✅ Quick check-out button
✅ Automatic charge calculation
✅ Includes base charge + extensions + penalties
✅ Final receipt generation

---

## User Interface

### Check-In Form (Tab 1)
```
┌─────────────────────────────────────┐
│ Check-In Type Selection             │
│ ○ Guest (Walk-in)                   │
│ ○ Registered User                   │
├─────────────────────────────────────┤
│ Select Seat *                       │
│ [Dropdown: Choose a seat...]        │
├─────────────────────────────────────┤
│ Duration & Price *                  │
│ [1 Hour - $15]  [2 Hours - $25]    │
│ [Half Day - $40] [Full Day - $60]  │
├─────────────────────────────────────┤
│ Guest Information (Optional)        │
│ Email: [________________]           │
│ Phone: [________________]           │
├─────────────────────────────────────┤
│ Payment Status                      │
│ [Dropdown: Paid/Pending/Refunded]  │
├─────────────────────────────────────┤
│ Summary                             │
│ Seat: Island Premium                │
│ Duration: 1 Hour                    │
│ Amount: $15.00                      │
├─────────────────────────────────────┤
│ [Cancel] [Proceed to Confirmation]  │
└─────────────────────────────────────┘
```

### Active Check-Ins Table (Tab 2)
```
┌──────────────────────────────────────────────────────────────────┐
│ Filters: [Type: All] [Status: All] [Refresh]                    │
├──────────────────────────────────────────────────────────────────┤
│ Identifier │ Seat │ Check-In │ Time Remaining │ Status │ Amount │
├──────────────────────────────────────────────────────────────────┤
│ GUEST-001  │ R1   │ 10:30 AM │ 45 min (🟢)    │ Active │ $15.00 │
│ John Doe   │ R2   │ 10:45 AM │ 5 min (🟡)     │ Warn   │ $25.00 │
│ GUEST-002  │ R3   │ 09:00 AM │ -10 min (🔴)   │ Over   │ $40.00 │
├──────────────────────────────────────────────────────────────────┤
│ [Check Out] [Extend] [Penalty]                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Permissions & Access Control

### Cashier Role
- ✅ Can create check-ins (guest and registered)
- ✅ Can view active check-ins
- ✅ Can extend check-in duration
- ✅ Can apply penalty charges
- ✅ Can check out guests
- ✅ Can view check-in history
- ✅ Can update payment status

### Admin Role
- ✅ All cashier permissions
- ✅ Can view all check-ins across all cashiers
- ✅ Can generate reports
- ✅ Can manage seat pricing

### Shifty/User Role
- ❌ Cannot access check-in features
- ✅ Can view own check-in history

---

## API Integration

### Endpoints Used by Cashier

**Public Endpoints** (Rate-Limited):
- `POST /api/checkin` - Create check-in
- `POST /api/checkin/checkout` - Check out
- `GET /api/checkin/:checkInId` - Get check-in details

**Protected Endpoints** (Cashier/Admin):
- `GET /api/checkin/active` - Get active check-ins
- `GET /api/checkin/warnings` - Get timeout warnings
- `GET /api/checkin/history` - Get check-in history
- `PATCH /api/checkin/:checkInId` - Update check-in
- `POST /api/checkin/:checkInId/extend` - Extend duration
- `POST /api/checkin/:checkInId/penalty` - Apply penalty

---

## Real-Time Features

### Auto-Refresh
- Active check-ins list refreshes every 10 seconds
- Real-time status updates
- Automatic status transitions (Active → Warning → Overtime)

### Live Countdown
- Countdown timer updates every second
- Shows minutes remaining
- Color changes based on urgency
- Automatic alerts when approaching timeout

### Status Indicators
- **Green (Active)**: Time remaining > threshold
- **Yellow (Warning)**: Time remaining ≤ 5 minutes
- **Red (Overtime)**: Time exceeded

---

## Example Scenarios

### Scenario 1: Guest Walk-In (1 Hour)
1. Guest arrives at facility
2. Cashier clicks "Check-In" tab
3. Selects "Guest" type
4. Chooses seat "Island Premium"
5. Selects "1 Hour - $15" pricing
6. Enters guest email (optional)
7. Confirms check-in
8. System generates: **GUEST-001**
9. Guest receives receipt with ID and time limit
10. Cashier monitors in "Active Check-Ins" tab
11. At 55 minutes: Status changes to "Warning" (yellow)
12. Cashier can extend or apply penalty
13. At 60 minutes: Guest checks out
14. Final charge: $15.00

### Scenario 2: Registered User (Half Day with Extension)
1. Registered user arrives
2. Cashier clicks "Check-In" tab
3. Selects "Registered User" type
4. Searches for user "John Doe"
5. Chooses seat "Wall Premium"
6. Selects "Half Day (4 Hours) - $40" pricing
7. Confirms check-in
8. User occupies seat for 4 hours
9. At 3:55 hours: Status changes to "Warning"
10. User requests 1 more hour
11. Cashier clicks "Extend Duration"
12. Adds 60 minutes for $15
13. New total: $55.00
14. User continues for 1 more hour
15. At 5 hours: Guest checks out
16. Final charge: $55.00 (base $40 + extension $15)

### Scenario 3: Overtime Penalty
1. Guest checks in for 1 hour ($15)
2. At 60 minutes: Status changes to "Overtime" (red)
3. Guest is still using seat
4. Cashier clicks "Apply Penalty"
5. Selects reason: "Overtime"
6. System auto-calculates: $15/hour = $0.25/minute
7. 10 minutes overtime = $2.50 penalty
8. Cashier confirms penalty
9. New total: $17.50 ($15 base + $2.50 penalty)
10. Guest checks out
11. Final charge: $17.50

---

## Benefits for Cashiers

✅ **Unified Interface**: One place to manage all check-ins
✅ **Real-Time Monitoring**: Know exactly when guests are approaching timeout
✅ **Flexible Pricing**: Support multiple duration options per seat
✅ **Guest Support**: No registration required for walk-in visitors
✅ **Audit Trail**: Complete history of all check-ins, extensions, and penalties
✅ **Quick Actions**: Fast check-out, extend, and penalty buttons
✅ **Auto-Calculations**: Charges calculated automatically
✅ **Visual Alerts**: Color-coded urgency indicators
✅ **Mobile-Friendly**: Works on tablets and mobile devices

---

## Technical Details

### Components Used
- `CheckInForm.tsx` - Unified check-in form
- `CheckInManagement.tsx` - Active check-ins dashboard
- `TimeoutWarningAlert.tsx` - Real-time countdown (used in management)
- `ExtensionModal.tsx` - Duration extension dialog
- `PenaltyModal.tsx` - Penalty application dialog

### Services Used
- `CheckInService.ts` - API calls for all check-in operations

### State Management
- React hooks (useState, useEffect)
- Context API for authentication and toasts

### Real-Time Updates
- Polling-based updates every 10 seconds
- Live countdown timer (updates every second)
- Automatic status transitions

---

## Deployment Checklist

- [x] Check-In components created
- [x] CheckInService created
- [x] Cashier tabs configured in roleUtils.tsx
- [x] TypeScript errors fixed
- [x] Integration tested
- [x] Documentation created

---

## Next Steps

1. ✅ Run database migration
2. ✅ Start backend and frontend
3. ✅ Login as cashier user
4. ✅ Navigate to dashboard
5. ✅ Test check-in creation
6. ✅ Test active check-ins monitoring
7. ✅ Test extensions and penalties
8. ✅ Deploy to production

---

## Support

For detailed information about the check-in system:
- See `GUEST_CHECKIN_IMPLEMENTATION.md` for comprehensive guide
- See `GUEST_CHECKIN_QUICK_START.md` for quick reference
- See component comments for usage examples

---

**Status**: ✅ **INTEGRATED AND READY FOR USE**

Cashiers can now manage all check-ins directly from their dashboard with real-time monitoring and comprehensive audit trails.
