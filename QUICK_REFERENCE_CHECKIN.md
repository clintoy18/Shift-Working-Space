# Check-In System - Quick Reference Guide

## 🚀 Quick Start

### For Developers

#### View the Check-In Form
```
File: frontend/src/components/checkin/CheckInForm.tsx
Lines: 1-461
Status: ✅ Production Ready (0 TypeScript errors)
```

#### Update Pricing
```
File: frontend/src/config/pricingConfig.ts
Edit: regularSeatsPricing, cubicleSeatingPricing, meetingRoomsPricing arrays
Changes: Automatically reflect in CheckInForm and Pricing.tsx
```

#### Add New Seat Type
```
File: frontend/src/config/seatTypesConfig.ts
Edit: SEAT_TYPES object
Add: New key with SeatTypeConfig properties
Changes: Automatically appear in seat type selector
```

#### Test Guest Check-In
```
1. Start backend: cd backend && npm run dev
2. Start frontend: cd frontend && npm run dev
3. Login as cashier
4. Navigate to Dashboard → Check-In tab
5. Select "Guest (Walk-in)"
6. Select seat type, seat, and pricing
7. Enter email or phone
8. Confirm check-in
9. ✅ Success: Guest ID auto-generated
```

#### Test Registered User Check-In
```
1. Same as above but select "Registered User"
2. Search and select user
3. Confirm check-in
4. ✅ Success: User name displayed
```

---

## 📋 Form Structure

### Step 1: Check-In Type
```
Guest (Walk-in) | Registered User
```

### Step 2: Seat Type
```
Regular Seating | Cubicle Seating | Meeting Rooms
```

### Step 3: Seat Selection
```
Dropdown filtered by selected seat type
```

### Step 4: Pricing Option
```
Grid of pricing options with:
- Label (e.g., "Nomad")
- Duration (e.g., "2 hours")
- Price (e.g., "₱145.00")
```

### Step 5: Guest/User Info
```
IF GUEST:
  - Email (optional)
  - Phone (optional)
  - At least one required

IF REGISTERED:
  - User search
  - User selection
```

### Step 6: Payment Status
```
Paid | Pending | Refunded
```

### Step 7: Summary
```
Seat Type: Regular Seating
Seat: A-02
Duration: Quick Shift (4 hours)
Total Charge: ₱250.00
```

### Step 8: Confirmation
```
Modal showing all details
[Cancel] [Confirm]
```

---

## 💰 Pricing Quick Reference

### Regular Seats
| Option | Duration | Price |
|--------|----------|-------|
| Nomad | 2 hours | ₱145 |
| Quick Shift | 4 hours | ₱250 |
| Pro (Day Pass) | 8 hours | ₱450 |

### Cubicle Seating
| Option | Duration | Price |
|--------|----------|-------|
| Focus | 1 hour | ₱175 |
| Focus | 4 hours | ₱600 |
| Focus | Full Day | ₱1,000 |

### Meeting Rooms
| Option | Duration | Price |
|--------|----------|-------|
| Power Huddle | 1 hour | ₱270 |
| Power Huddle | 2 hours | ₱500 |
| Conference | 1 hour | ₱420 |
| Conference | 4 hours | ₱1,400 |

---

## 🔧 Common Tasks

### Update Pricing
```typescript
// File: frontend/src/config/pricingConfig.ts

export const regularSeatsPricing: PricingOption[] = [
  {
    duration: 120,
    label: "Nomad",
    price: 150,  // Changed from 145
    period: "first 2 hrs",
    description: "₱60 succeeding hours",
    isActive: true,
  },
  // ... other options
];
```

### Add New Seat Type
```typescript
// File: frontend/src/config/seatTypesConfig.ts

export const SEAT_TYPES: Record<SeatTypeKey, SeatTypeConfig> = {
  // ... existing types
  "vip": {
    key: "vip",
    name: "VIP Seating",
    displayName: "VIP Premium",
    description: "Exclusive VIP seating area",
    color: "bg-yellow-50 border-yellow-200",
    pricingTier: "vip",
    features: ["VIP lounge", "Priority support", "Complimentary beverages"],
  },
};
```

### Modify Timeout Threshold
```typescript
// File: backend/src/models/CheckIn.ts

warningThresholdMinutes: {
  type: Number,
  default: 5,  // Change to desired minutes
  required: true,
}
```

### Change Extension Options
```typescript
// File: frontend/src/components/checkin/ExtensionModal.tsx

const presetOptions = [
  { minutes: 15, label: "15 minutes" },
  { minutes: 30, label: "30 minutes" },
  { minutes: 60, label: "1 hour" },
  // Add more options here
];
```

---

## 🐛 Troubleshooting

### Issue: Form not loading
**Solution**: Check that pricingConfig.ts and seatTypesConfig.ts are imported correctly

### Issue: Pricing not displaying
**Solution**: Verify getPricingForSeatType() is returning data for selected seat type

### Issue: Seat dropdown empty
**Solution**: Ensure seats are fetched and filtered by selectedSeatType

### Issue: TypeScript errors
**Solution**: Run `npm run lint` and check for type mismatches

### Issue: Check-in fails
**Solution**: Verify API endpoint is accessible and backend is running

---

## 📊 State Management

### Form State Variables
```typescript
checkInType: "guest" | "registered"
selectedSeatType: "regular" | "cubicle" | "meeting-room"
selectedSeat: ISeat | null
selectedPricingOption: PricingOption | null
paymentStatus: "pending" | "paid" | "refunded"
email: string
phoneNumber: string
selectedUser: IUser | null
userSearchQuery: string
```

### Data State Variables
```typescript
seats: ISeat[]
loading: boolean
submitting: boolean
showConfirmation: boolean
```

---

## 🔗 Related Files

### Configuration
- `frontend/src/config/pricingConfig.ts` - Pricing configuration
- `frontend/src/config/seatTypesConfig.ts` - Seat types entity

### Components
- `frontend/src/components/checkin/CheckInForm.tsx` - Main form
- `frontend/src/components/checkin/CheckInManagement.tsx` - Dashboard
- `frontend/src/components/checkin/TimeoutWarningAlert.tsx` - Countdown
- `frontend/src/components/checkin/ExtensionModal.tsx` - Extension dialog
- `frontend/src/components/checkin/PenaltyModal.tsx` - Penalty dialog

### Services
- `frontend/src/services/CheckInService.ts` - API methods

### Interfaces
- `frontend/src/interfaces/requests/ICheckInRequest.ts` - Request/response types
- `frontend/src/interfaces/models/ICheckIn.ts` - Check-in model
- `frontend/src/interfaces/models/ISeat.ts` - Seat model

### Backend
- `backend/src/models/Guest.ts` - Guest model
- `backend/src/models/CheckIn.ts` - Check-in model
- `backend/src/controllers/checkin.controller.ts` - API logic
- `backend/src/routes/checkin.routes.ts` - API routes

---

## ✅ Validation Rules

### Guest Check-In
- ✅ Email OR phone number required
- ✅ Pricing option must be selected
- ✅ Seat must be selected

### Registered User Check-In
- ✅ User must be selected
- ✅ Pricing option must be selected
- ✅ Seat must be selected

### Payment Status
- ✅ Must select: Paid, Pending, or Refunded

---

## 🎯 API Endpoints

### Public Endpoints (Rate Limited)
```
POST /api/checkin/checkin
POST /api/checkin/checkout
GET /api/checkin/:checkInId
```

### Protected Endpoints (Auth + Role Required)
```
GET /api/checkin/active
GET /api/checkin/warnings
GET /api/checkin/history
PATCH /api/checkin/:checkInId
POST /api/checkin/:checkInId/extend
POST /api/checkin/:checkInId/penalty
```

---

## 📱 Responsive Breakpoints

### Desktop (1024px+)
- 3-column grid for seat types
- 2-column grid for pricing options
- Full-width form

### Tablet (768px - 1023px)
- 3-column grid for seat types
- 2-column grid for pricing options
- Adjusted spacing

### Mobile (< 768px)
- Responsive grid for seat types
- Responsive grid for pricing options
- Full-width inputs

---

## 🔐 Security Checklist

- ✅ Rate limiting enabled
- ✅ Bot detection enabled
- ✅ JWT authentication required
- ✅ Role-based access control
- ✅ Input validation on all fields
- ✅ CORS configured
- ✅ Soft deletes enabled

---

## 📈 Performance Tips

1. **Optimize Seat Loading**: Filter seats by type to reduce data
2. **Cache Pricing**: Pricing configuration is static, cache in browser
3. **Lazy Load Components**: Load modals only when needed
4. **Debounce Search**: Debounce user search input
5. **Memoize Calculations**: Memoize pricing options calculation

---

## 🧪 Testing Checklist

- ✅ Guest check-in flow
- ✅ Registered user check-in flow
- ✅ Seat type selection
- ✅ Seat filtering
- ✅ Pricing option selection
- ✅ Form validation
- ✅ Summary display
- ✅ Confirmation modal
- ✅ API submission
- ✅ Error handling
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Accessibility

---

## 📞 Support

### For Questions
- Check `GUEST_CHECKIN_IMPLEMENTATION.md` for detailed technical guide
- Review `CHECKIN_FORM_USER_FLOW.md` for visual flows
- See `PRICING_INTEGRATION.md` for pricing details

### For Issues
- Check browser console for errors
- Verify backend is running
- Check network tab for API calls
- Review server logs for backend errors

---

## 🎉 Status

**Overall Status**: ✅ PRODUCTION READY

- ✅ All features implemented
- ✅ All tests passed
- ✅ Zero TypeScript errors
- ✅ Comprehensive documentation
- ✅ Ready for deployment

---

**Last Updated**: February 28, 2026
**Status**: Complete
**Quality**: Production Ready
