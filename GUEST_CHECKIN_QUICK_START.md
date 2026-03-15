# Guest Check-In System - Quick Start Guide

## 🚀 Quick Setup

### 1. Run Database Migration
```bash
cd backend
npx ts-node src/utils/migrations/addGuestSupport.ts
```

### 2. Start Backend
```bash
cd backend
npm run dev
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

---

## 📋 Key Endpoints

### Check-In (Public)
```bash
POST /api/checkin
{
  "checkInType": "guest",
  "seatId": "seat-id-123",
  "pricingOptionId": 0,
  "paymentStatus": "paid",
  "email": "guest@example.com",
  "phoneNumber": "+1-555-0000"
}
```

### Check-Out (Public)
```bash
POST /api/checkin/checkout
{
  "checkInId": "checkin-id-123"
}
```

### Get Active Check-Ins (Protected)
```bash
GET /api/checkin/active?type=guest&status=warning
```

### Extend Duration (Protected)
```bash
POST /api/checkin/checkin-id-123/extend
{
  "additionalMinutes": 30,
  "additionalAmount": 7.50,
  "appliedBy": "Cashier Name"
}
```

### Apply Penalty (Protected)
```bash
POST /api/checkin/checkin-id-123/penalty
{
  "penaltyAmount": 10.00,
  "reason": "Overtime",
  "appliedBy": "Cashier Name"
}
```

---

## 🎯 Frontend Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/checkin` | Check-in form | Yes |
| `/checkin/management` | Admin dashboard | Yes (Cashier/Admin) |

---

## 💡 Common Workflows

### Guest Check-In
1. Navigate to `/checkin`
2. Select "Guest" type
3. Choose seat and pricing option
4. Enter email or phone (optional)
5. Confirm check-in
6. Guest ID auto-generated (GUEST-001, etc.)

### Registered User Check-In
1. Navigate to `/checkin`
2. Select "Registered User" type
3. Search and select user
4. Choose seat and pricing option
5. Confirm check-in

### Extend Duration
1. Go to `/checkin/management`
2. Find check-in with warning status
3. Click "Extend Duration"
4. Select additional minutes
5. Confirm extension

### Apply Penalty
1. Go to `/checkin/management`
2. Find check-in with overtime status
3. Click "Apply Penalty"
4. Enter amount and reason
5. Confirm penalty

---

## 🔍 Database Collections

### Guest
```javascript
{
  guestId: "GUEST-001",
  email: "guest@example.com",
  phoneNumber: "+1-555-0000",
  isDeleted: false,
  createdAt: ISODate(),
  updatedAt: ISODate()
}
```

### CheckIn (Updated)
```javascript
{
  checkInType: "guest",
  guest: ObjectId("..."),
  seat: ObjectId("..."),
  checkInTime: ISODate(),
  allocatedDurationMinutes: 60,
  warningThresholdMinutes: 5,
  status: "active",
  paymentAmount: 15.00,
  extensionHistory: [],
  penaltyCharges: [],
  isDeleted: false
}
```

### Seat (Updated)
```javascript
{
  seatCode: "isl-1-L-0",
  displayLabel: "R1",
  pricingOptions: [
    {
      duration: 60,
      label: "1 Hour",
      price: 15.00,
      isActive: true
    },
    {
      duration: 120,
      label: "2 Hours",
      price: 25.00,
      isActive: true
    }
  ]
}
```

---

## 🧪 Testing

### Test Guest Check-In
```bash
curl -X POST http://localhost:5000/api/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "checkInType": "guest",
    "seatId": "SEAT_ID",
    "pricingOptionId": 0,
    "paymentStatus": "paid",
    "email": "test@example.com"
  }'
```

### Test Check-Out
```bash
curl -X POST http://localhost:5000/api/checkin/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "checkInId": "CHECKIN_ID"
  }'
```

### Test Get Active Check-Ins
```bash
curl -X GET http://localhost:5000/api/checkin/active \
  -H "Authorization: Bearer TOKEN"
```

---

## 📊 Real-Time Features

### Timeout Warnings
- Automatically triggered when time remaining ≤ 5 minutes
- Status changes: active → warning → overtime
- Visual indicators: green → yellow → red

### Live Countdown
- Updates every second
- Shows minutes remaining
- Color-coded urgency

### Auto-Refresh
- Management dashboard refreshes every 10 seconds
- Real-time check-in status updates
- Automatic status transitions

---

## 🔐 Security

### Rate Limiting
- Public endpoints: 100 requests per 15 minutes
- Prevents abuse and scraping

### Authentication
- Protected endpoints require JWT token
- Token stored in sessionStorage
- Auto-logout on 401 response

### Authorization
- Cashier/Admin roles required for management endpoints
- Role-based access control enforced

### Bot Detection
- Detects and blocks common bots (curl, wget, python)
- Detects aggressive scraping patterns
- Honeypot endpoints for aggressive scrapers

---

## 📈 Performance

### Indexes
- `CheckIn`: status, checkInType, allocatedDurationMinutes
- `Seat`: status, zoneType, isActive, isDeleted
- `Reservation`: status, reservationType

### Caching
- Seat list cached for 5 minutes
- Active check-ins refreshed every 10 seconds
- Reduces database load

### Pagination
- History endpoint supports pagination
- Default limit: 50 records per page
- Prevents large data transfers

---

## 🐛 Troubleshooting

### Guest ID Not Generating
- Check MongoDB connection
- Verify Guest model pre-save hook
- Check server logs for errors

### Timeout Warnings Not Showing
- Verify `allocatedDurationMinutes` is set
- Check frontend polling interval (10 seconds)
- Verify status calculation logic

### Extensions Not Working
- Check hourly rate calculation
- Verify pricing option price
- Check API response for errors

### Rate Limiting Issues
- Adjust `apiLimiter` settings if needed
- Check rate limit headers in response
- Verify client IP is not blocked

---

## 📚 Documentation

- **Full Implementation**: See `GUEST_CHECKIN_IMPLEMENTATION.md`
- **API Reference**: See backend controller comments
- **Component Props**: See component TypeScript interfaces
- **Database Schema**: See model files in `backend/src/models/`

---

## 🎓 Learning Resources

### Key Files to Review
1. `backend/src/controllers/checkin.controller.ts` - API logic
2. `frontend/src/services/CheckInService.ts` - Frontend API calls
3. `frontend/src/components/checkin/CheckInForm.tsx` - Check-in form
4. `frontend/src/components/checkin/TimeoutWarningAlert.tsx` - Real-time alerts

### Architecture Patterns
- **Service Layer**: CheckInService handles API communication
- **Component Composition**: Modular components for reusability
- **Real-Time Updates**: Polling-based updates every 10 seconds
- **Error Handling**: Toast notifications for user feedback

---

## 🚀 Next Steps

1. ✅ Run migration script
2. ✅ Start backend and frontend
3. ✅ Test guest check-in flow
4. ✅ Test timeout warnings
5. ✅ Test extensions and penalties
6. ✅ Deploy to production

---

## 📞 Support

For issues or questions:
1. Check `GUEST_CHECKIN_IMPLEMENTATION.md` for detailed docs
2. Review component comments for usage examples
3. Check server logs for error details
4. Verify database migration completed successfully

---

**Implementation Status**: ✅ Complete and Ready for Production
