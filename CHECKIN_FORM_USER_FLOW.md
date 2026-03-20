# Check-In Form - User Flow & Visual Guide

## Form Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CHECK-IN FORM START                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: SELECT CHECK-IN TYPE                              │
│  ┌─────────────────────────────────────────────────────────┐
│  │ ○ Guest (Walk-in)      ○ Registered User               │
│  └─────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: SELECT SEAT TYPE                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Regular    │  │   Cubicle    │  │ Meeting Room │     │
│  │   Seating    │  │   Seating    │  │              │     │
│  │              │  │              │  │              │     │
│  │ Open lounge  │  │ Private with │  │ Conference & │     │
│  │ for flexible │  │ loft for     │  │ huddle rooms │     │
│  │ work         │  │ focused work │  │ for meetings │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  (Selected: Regular Seating - Blue highlight)              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: SELECT SEAT                                       │
│  ┌─────────────────────────────────────────────────────────┐
│  │ Choose a seat...                                    ▼   │
│  │ ┌─────────────────────────────────────────────────────┐ │
│  │ │ A-01 - Zone A                                      │ │
│  │ │ A-02 - Zone A                                      │ │
│  │ │ A-03 - Zone A                                      │ │
│  │ │ B-01 - Zone B                                      │ │
│  │ └─────────────────────────────────────────────────────┘ │
│  │ (Filtered to show only Regular Seating)                 │
│  └─────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: SELECT PRICING OPTION                             │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   Nomad      │  │ Quick Shift   │                        │
│  │ 2 hours      │  │ 4 hours       │                        │
│  │ ₱145.00      │  │ ₱250.00       │                        │
│  └──────────────┘  └──────────────┘                        │
│  ┌──────────────┐                                           │
│  │ Pro (Day)    │                                           │
│  │ 8 hours      │                                           │
│  │ ₱450.00      │                                           │
│  └──────────────┘                                           │
│  (Selected: Quick Shift - Blue highlight)                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: GUEST/USER INFORMATION                            │
│  ┌─────────────────────────────────────────────────────────┐
│  │ IF GUEST:                                               │
│  │ Email: guest@example.com                                │
│  │ Phone: +1 (555) 000-0000                                │
│  │ (Optional - at least one required)                      │
│  │                                                          │
│  │ IF REGISTERED USER:                                     │
│  │ Search user by name or email...                         │
│  │ ┌─────────────────────────────────────────────────────┐ │
│  │ │ John Doe                                            │ │
│  │ │ john@example.com                                    │ │
│  │ │ Membership: Active                                  │ │
│  │ └─────────────────────────────────────────────────────┘ │
│  └─────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 6: PAYMENT STATUS                                    │
│  ┌─────────────────────────────────────────────────────────┐
│  │ Payment Status:                                         │
│  │ ┌─────────────────────────────────────────────────────┐ │
│  │ │ ✓ Paid                                              │ │
│  │ │   Pending                                           │ │
│  │ │   Refunded                                          │ │
│  │ └─────────────────────────────────────────────────────┘ │
│  └─────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 7: REVIEW SUMMARY                                    │
│  ┌─────────────────────────────────────────────────────────┐
│  │ Seat Type:        Regular Seating                       │
│  │ Seat:             A-02                                  │
│  │ Duration:         Quick Shift (4 hours)                 │
│  │ ─────────────────────────────────────────────────────── │
│  │ Total Charge:     ₱250.00                               │
│  └─────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    [Proceed to Confirmation]
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              CONFIRMATION MODAL                             │
│  ┌─────────────────────────────────────────────────────────┐
│  │ Confirm Check-In                                        │
│  │                                                          │
│  │ Guest ID:         Auto-generated                        │
│  │ Email:            guest@example.com                     │
│  │ Phone:            +1 (555) 000-0000                     │
│  │ Seat Type:        Regular Seating                       │
│  │ Seat:             A-02                                  │
│  │ Duration:         Quick Shift (4 hours)                 │
│  │ ─────────────────────────────────────────────────────── │
│  │ Charge:           ₱250.00                               │
│  │                                                          │
│  │ [Cancel]  [Confirm]                                     │
│  └─────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ✅ CHECK-IN SUCCESSFUL
                    Guest ID: GUEST-001
```

---

## Component Hierarchy

```
CheckInForm
├── Check-In Type Selection (Radio Buttons)
│   ├── Guest (Walk-in)
│   └── Registered User
│
├── Seat Type Selection (3-Button Grid)
│   ├── Regular Seating
│   ├── Cubicle Seating
│   └── Meeting Rooms
│
├── Seat Selection (Dropdown - Filtered by Type)
│   └── [Seats filtered to selected type]
│
├── Pricing Options (2-Column Grid)
│   ├── Option 1 (Label, Duration, Price)
│   ├── Option 2 (Label, Duration, Price)
│   └── Option N (Label, Duration, Price)
│
├── Guest-Specific Fields (Conditional)
│   ├── Email Input
│   └── Phone Number Input
│
├── Registered User Selection (Conditional)
│   ├── User Search Input
│   └── Selected User Display
│
├── Payment Status (Dropdown)
│   ├── Paid
│   ├── Pending
│   └── Refunded
│
├── Summary Section (Conditional)
│   ├── Seat Type
│   ├── Seat
│   ├── Duration
│   └── Total Charge
│
├── Submit Button
│   └── "Proceed to Confirmation"
│
└── Confirmation Modal (Conditional)
    ├── Guest/User Info
    ├── Seat Details
    ├── Duration & Pricing
    ├── Cancel Button
    └── Confirm Button
```

---

## State Management

### Form State
```typescript
checkInType: "guest" | "registered"          // User type
selectedSeatType: SeatTypeKey                 // "regular" | "cubicle" | "meeting-room"
selectedSeat: ISeat | null                    // Selected seat object
selectedPricingOption: PricingOption | null   // Selected pricing option
paymentStatus: "pending" | "paid" | "refunded"
email: string                                 // Guest email
phoneNumber: string                           // Guest phone
selectedUser: IUser | null                    // Registered user
userSearchQuery: string                       // User search input
```

### Data State
```typescript
seats: ISeat[]                                // All available seats
loading: boolean                              // Loading state
submitting: boolean                           // Submission state
showConfirmation: boolean                     // Modal visibility
```

### Computed Values
```typescript
pricingOptions: PricingOption[]               // From getPricingForSeatType()
seatTypeConfig: SeatTypeConfig                // From SEAT_TYPES[selectedSeatType]
```

---

## Pricing Option Structure

```typescript
interface PricingOption {
  duration: number;        // Duration in minutes (e.g., 120, 240, 480)
  label: string;          // Display label (e.g., "Nomad", "Quick Shift")
  price: number;          // Price in PHP (e.g., 145, 250, 450)
  period?: string;        // Period description (e.g., "first 2 hrs")
  description?: string;   // Additional description
  isActive: boolean;      // Enable/disable option
}
```

### Example Pricing Options for Regular Seats
```typescript
[
  {
    duration: 120,
    label: "Nomad",
    price: 145,
    period: "first 2 hrs",
    description: "₱60 succeeding hours",
    isActive: true
  },
  {
    duration: 240,
    label: "Quick Shift",
    price: 250,
    period: "4 hours",
    description: "₱60 succeeding hour",
    isActive: true
  },
  {
    duration: 480,
    label: "Pro (Day Pass)",
    price: 450,
    period: "8 hours",
    description: "₱60 succeeding hour",
    isActive: true
  }
]
```

---

## Validation Rules

### Form Submission Validation
1. **Pricing Option**: Must select a pricing option
2. **Guest Check-In**: Must provide email OR phone number
3. **Registered Check-In**: Must select a user
4. **Seat Selection**: Must select a seat (implicit - dropdown required)

### API Submission
```typescript
const checkInData: ICheckInRequest = {
  checkInType: "guest" | "registered",
  seatId: string,
  pricingOptionId: number,              // Index of selected pricing option
  paymentStatus: "pending" | "paid" | "refunded",
  processedBy: string,
  email?: string,                       // For guests
  phoneNumber?: string,                 // For guests
  userId?: string                       // For registered users
}
```

---

## User Interactions

### Seat Type Selection
- **Action**: Click seat type button
- **Effect**:
  - Updates `selectedSeatType`
  - Clears `selectedSeat` and `selectedPricingOption`
  - Seat dropdown filters to show only seats of selected type
  - Pricing options update to match seat type

### Seat Selection
- **Action**: Select seat from dropdown
- **Effect**:
  - Updates `selectedSeat`
  - Clears `selectedPricingOption`
  - Pricing options display (if available)

### Pricing Option Selection
- **Action**: Click pricing option button
- **Effect**:
  - Updates `selectedPricingOption` with full PricingOption object
  - Summary section displays
  - Button shows blue highlight

### Form Submission
- **Action**: Click "Proceed to Confirmation"
- **Effect**:
  - Validates form
  - Shows confirmation modal
  - Displays all details for review

### Confirmation
- **Action**: Click "Confirm" in modal
- **Effect**:
  - Submits check-in to API
  - Shows success toast with Guest ID or User name
  - Resets form
  - Calls onSuccess callback

---

## Responsive Design

### Desktop (1024px+)
- 3-column grid for seat types
- 2-column grid for pricing options
- Full-width form layout

### Tablet (768px - 1023px)
- 3-column grid for seat types (responsive)
- 2-column grid for pricing options
- Adjusted padding and spacing

### Mobile (< 768px)
- Stack seat type buttons vertically or 2-column
- Stack pricing options vertically or 2-column
- Full-width inputs and buttons
- Adjusted modal width

---

## Accessibility Features

- ✅ Semantic HTML (form, label, button, input)
- ✅ ARIA labels on form fields
- ✅ Keyboard navigation support
- ✅ Focus indicators on interactive elements
- ✅ Color contrast compliance
- ✅ Error messages for validation
- ✅ Toast notifications for feedback

---

## Performance Optimizations

- ✅ Memoized pricing options calculation
- ✅ Filtered seat list (only shows relevant seats)
- ✅ Conditional rendering (only show relevant fields)
- ✅ Efficient state updates
- ✅ No unnecessary re-renders

---

## Error Handling

### Validation Errors
- Missing pricing option → "Please select a pricing option"
- Guest without contact → "Guest check-in requires email or phone number"
- Registered without user → "Please select a registered user"

### API Errors
- No seats available → "No seats available for selected type"
- Check-in failure → "Error during check-in"
- Network error → "Error loading seats"

### Toast Notifications
- Success: Green toast with check-in details
- Error: Red toast with error message
- Auto-dismiss after 3 seconds

---

## Testing Scenarios

### Scenario 1: Guest Check-In
1. Select "Guest (Walk-in)"
2. Select "Regular Seating"
3. Select seat "A-02"
4. Select "Quick Shift" (₱250)
5. Enter email: guest@example.com
6. Select payment status: "Paid"
7. Review summary
8. Confirm check-in
9. ✅ Success: "Check-in successful! Guest ID: GUEST-001"

### Scenario 2: Registered User Check-In
1. Select "Registered User"
2. Select "Cubicle Seating"
3. Select seat "C-05"
4. Select "Focus (4 Hours)" (₱600)
5. Search and select user: "John Doe"
6. Select payment status: "Paid"
7. Review summary
8. Confirm check-in
9. ✅ Success: "Check-in successful! User: John Doe"

### Scenario 3: Meeting Room Check-In
1. Select "Guest (Walk-in)"
2. Select "Meeting Rooms"
3. Select seat "M-01"
4. Select "Conference (1 Hour)" (₱420)
5. Enter phone: +1 (555) 000-0000
6. Select payment status: "Pending"
7. Review summary
8. Confirm check-in
9. ✅ Success: "Check-in successful! Guest ID: GUEST-002"

---

## Summary

The Check-In Form provides a seamless, intuitive experience for both guest and registered user check-ins with:
- ✅ Clear, logical flow
- ✅ Real-time validation
- ✅ Formatted pricing display
- ✅ Comprehensive summary
- ✅ Confirmation before submission
- ✅ Responsive design
- ✅ Accessibility support
- ✅ Error handling

**Status**: ✅ Production Ready
