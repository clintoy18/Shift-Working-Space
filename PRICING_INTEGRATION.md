# Check-In System - Pricing Integration

## Overview

The Check-In System now uses a unified pricing configuration that aligns with the existing Pricing.tsx component. This ensures consistency across the application.

---

## Pricing Configuration File

**Location**: `frontend/src/config/pricingConfig.ts`

This file contains all pricing tiers and options used throughout the application:

### Regular Seats Pricing
- **Nomad**: ₱145 for first 2 hours (₱60 succeeding hours)
- **Quick Shift**: ₱250 for 4 hours (₱60 succeeding hour)
- **Pro (Day Pass)**: ₱450 for 8 hours (₱60 succeeding hour)

### Cubicle Seating Pricing
- **Focus (1 Hour)**: ₱175
- **Focus (4 Hours)**: ₱600
- **Focus (Full Day)**: ₱1,000

### Meeting Rooms Pricing
- **Power Huddle (1 Hour)**: ₱270
- **Power Huddle (2 Hours)**: ₱500
- **Conference (1 Hour)**: ₱420
- **Conference (4 Hours)**: ₱1,400

### Membership Pricing

**Weekly (Platinum)**:
- Regular Seating: ₱1,799 (was ₱2,828)
- Cubicle Seating: ₱2,499 (was ₱3,938)

**Monthly (Diamond)**:
- Regular Seating: ₱5,999 (was ₱6,478)
- Cubicle Seating: ₱7,999 (was ₱8,999)

---

## How It Works

### 1. Pricing Configuration Structure

```typescript
interface PricingOption {
  duration: number;        // Duration in minutes
  label: string;          // Display label
  price: number;          // Price in PHP
  period?: string;        // Period description
  description?: string;   // Additional description
  isActive: boolean;      // Enable/disable
}
```

### 2. Using Pricing in Check-In Form

The CheckInForm component can now:
- Display pricing options based on seat type
- Calculate charges automatically
- Show formatted prices (₱ currency)
- Calculate hourly rates for penalties

### 3. Helper Functions

```typescript
// Get pricing for a seat type
getPricingForSeatType(seatType: "regular" | "cubicle" | "meeting-room")

// Get pricing by duration
getPricingByDuration(duration: number, seatType: string)

// Format duration to readable string
formatDuration(minutes: number) // "1 hour", "4 hours", etc.

// Format price to PHP currency
formatPrice(price: number) // "₱145.00"

// Calculate hourly rate
calculateHourlyRate(pricingOption: PricingOption)
```

---

## Integration with Check-In System

### Cashier Check-In Workflow

1. **Select Seat Type**
   - Regular Seats
   - Cubicle Seating
   - Meeting Rooms

2. **View Available Pricing Options**
   - System loads pricing from `pricingConfig.ts`
   - Displays all active options for selected seat type
   - Shows formatted prices (₱)

3. **Select Duration**
   - Cashier selects from available options
   - System calculates charge automatically
   - Shows breakdown: Duration × Rate = Total

4. **Confirm Check-In**
   - Guest/User receives receipt with:
     - Check-In ID
     - Seat details
     - Duration and price
     - Time limit

5. **Monitor & Manage**
   - Real-time countdown timer
   - Timeout warnings at 5 minutes
   - Extension options with auto-calculated charges
   - Penalty system based on hourly rate

---

## Example: Guest Check-In Flow

### Scenario: Guest selects "Quick Shift" (4 hours)

```
1. Cashier selects seat type: "Regular Seats"
2. System displays pricing options:
   - Nomad: ₱145 (2 hours)
   - Quick Shift: ₱250 (4 hours) ← Selected
   - Pro (Day Pass): ₱450 (8 hours)

3. Cashier selects "Quick Shift"
4. System calculates:
   - Duration: 240 minutes (4 hours)
   - Price: ₱250
   - Hourly Rate: ₱62.50/hour

5. Guest checks in
6. At 3:55 hours: Warning (5 min remaining)
7. Guest requests 1 more hour
8. System calculates extension:
   - Additional: 60 minutes
   - Rate: ₱62.50/hour
   - Charge: ₱62.50
   - New Total: ₱312.50

9. Guest checks out after 5 hours
10. Final charge: ₱312.50
```

---

## Benefits

✅ **Consistency**: Same pricing across Pricing page and Check-In system
✅ **Flexibility**: Easy to update pricing in one place
✅ **Accuracy**: Automatic calculations prevent errors
✅ **Transparency**: Clear pricing display for guests
✅ **Scalability**: Easy to add new pricing tiers
✅ **Maintainability**: Centralized pricing configuration

---

## How to Update Pricing

To update pricing, simply modify `frontend/src/config/pricingConfig.ts`:

```typescript
// Example: Update Regular Seats pricing
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

Changes automatically reflect in:
- Pricing page (Pricing.tsx)
- Check-In form (CheckInForm.tsx)
- Active check-ins (CheckInManagement.tsx)
- Extension calculations
- Penalty calculations

---

## Pricing Tiers Summary

| Seat Type | Duration | Label | Price |
|-----------|----------|-------|-------|
| Regular | 2 hrs | Nomad | ₱145 |
| Regular | 4 hrs | Quick Shift | ₱250 |
| Regular | 8 hrs | Pro (Day Pass) | ₱450 |
| Cubicle | 1 hr | Focus | ₱175 |
| Cubicle | 4 hrs | Focus | ₱600 |
| Cubicle | 8 hrs | Focus | ₱1,000 |
| Meeting | 1 hr | Power Huddle | ₱270 |
| Meeting | 2 hrs | Power Huddle | ₱500 |
| Meeting | 1 hr | Conference | ₱420 |
| Meeting | 4 hrs | Conference | ₱1,400 |

---

## Technical Details

### File Structure
```
frontend/src/
├── config/
│   └── pricingConfig.ts          (NEW - Pricing configuration)
├── components/
│   ├── landing/
│   │   └── Pricing.tsx           (Uses pricingConfig)
│   └── checkin/
│       ├── CheckInForm.tsx       (Uses pricingConfig)
│       └── CheckInManagement.tsx (Uses pricingConfig)
└── utils/
    └── roleUtils.tsx            (Integrates check-in tabs)
```

### Dependencies
- No external dependencies
- Pure TypeScript configuration
- Easily imported and used throughout the app

---

## Future Enhancements

1. **Dynamic Pricing**: Load pricing from backend API
2. **Promotional Pricing**: Apply discounts/promotions
3. **Membership Discounts**: Apply member rates automatically
4. **Time-Based Pricing**: Different rates for peak/off-peak hours
5. **Bulk Pricing**: Discounts for longer durations
6. **Package Deals**: Combine multiple services

---

## Status

✅ **Pricing Configuration Created**
✅ **Integrated with Check-In System**
✅ **Aligned with Pricing.tsx**
✅ **Ready for Production**

---

**Note**: The pricing configuration is now centralized and can be easily updated to reflect any changes in your pricing strategy.
