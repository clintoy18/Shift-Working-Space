/**
 * Pricing Configuration
 * Shared pricing structure used across the application
 * Aligns with Pricing.tsx and Check-In system
 */

export interface PricingOption {
  duration: number; // Duration in minutes
  label: string; // Display label
  price: number; // Price in PHP
  period?: string; // Period description (e.g., "first 2 hrs")
  description?: string; // Additional description
  isActive: boolean; // Enable/disable this option
}

export interface SeatPricingTier {
  name: string;
  type: "regular" | "cubicle" | "meeting-room";
  pricingOptions: PricingOption[];
}

// Regular Seats Pricing (from Pricing.tsx)
export const regularSeatsPricing: PricingOption[] = [
  {
    duration: 120, // 2 hours
    label: "Nomad",
    price: 145,
    period: "first 2 hrs",
    description: "₱60 succeeding hours",
    isActive: true,
  },
  {
    duration: 240, // 4 hours
    label: "Quick Shift",
    price: 250,
    period: "4 hours",
    description: "₱60 succeeding hour",
    isActive: true,
  },
  {
    duration: 480, // 8 hours
    label: "Pro (Day Pass)",
    price: 450,
    period: "8 hours",
    description: "₱60 succeeding hour",
    isActive: true,
  },
];

// Cubicle Seating Pricing
export const cubicleSeatingPricing: PricingOption[] = [
  {
    duration: 60, // 1 hour
    label: "Focus (1 Hour)",
    price: 175,
    isActive: true,
  },
  {
    duration: 240, // 4 hours
    label: "Focus (4 Hours)",
    price: 600,
    isActive: true,
  },
  {
    duration: 480, // 8 hours
    label: "Focus (Full Day)",
    price: 1000,
    isActive: true,
  },
];

// Meeting Rooms Pricing
export const meetingRoomsPricing: PricingOption[] = [
  {
    duration: 60, // 1 hour
    label: "Power Huddle",
    price: 270,
    isActive: true,
  },
  {
    duration: 120, // 2 hours
    label: "Power Huddle (2 Hours)",
    price: 500,
    isActive: true,
  },
  {
    duration: 60, // 1 hour
    label: "Conference",
    price: 420,
    isActive: true,
  },
  {
    duration: 240, // 4 hours
    label: "Conference (4 Hours)",
    price: 1400,
    isActive: true,
  },
];

// Membership Pricing (Weekly)
export const weeklyMembershipPricing: PricingOption[] = [
  {
    duration: 10080, // 7 days in minutes
    label: "Platinum (Weekly) - Regular",
    price: 1799,
    isActive: true,
  },
  {
    duration: 10080, // 7 days in minutes
    label: "Platinum (Weekly) - Cubicle",
    price: 2499,
    isActive: true,
  },
];

// Membership Pricing (Monthly)
export const monthlyMembershipPricing: PricingOption[] = [
  {
    duration: 43200, // 30 days in minutes
    label: "Diamond (Monthly) - Regular",
    price: 5999,
    isActive: true,
  },
  {
    duration: 43200, // 30 days in minutes
    label: "Diamond (Monthly) - Cubicle",
    price: 7999,
    isActive: true,
  },
];

// All pricing tiers
export const allPricingTiers: SeatPricingTier[] = [
  {
    name: "Regular Seats",
    type: "regular",
    pricingOptions: regularSeatsPricing,
  },
  {
    name: "Cubicle Seating",
    type: "cubicle",
    pricingOptions: cubicleSeatingPricing,
  },
  {
    name: "Meeting Rooms",
    type: "meeting-room",
    pricingOptions: meetingRoomsPricing,
  },
];

/**
 * Get pricing options for a specific seat type
 */
export function getPricingForSeatType(
  seatType: "regular" | "cubicle" | "meeting-room"
): PricingOption[] {
  const tier = allPricingTiers.find((t) => t.type === seatType);
  return tier?.pricingOptions || [];
}

/**
 * Get pricing option by duration
 */
export function getPricingByDuration(
  duration: number,
  seatType: "regular" | "cubicle" | "meeting-room"
): PricingOption | undefined {
  const options = getPricingForSeatType(seatType);
  return options.find((opt) => opt.duration === duration);
}

/**
 * Format duration to readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format price to PHP currency
 */
export function formatPrice(price: number): string {
  return `₱${price.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Calculate hourly rate from pricing option
 */
export function calculateHourlyRate(pricingOption: PricingOption): number {
  return (pricingOption.price / pricingOption.duration) * 60;
}
