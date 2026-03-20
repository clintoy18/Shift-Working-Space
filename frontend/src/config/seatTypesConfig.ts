/**
 * Seat Types Configuration
 * Defines all seat types available in the facility
 * Aligns with Pricing.tsx and Check-In system
 */

export type SeatTypeKey = "regular" | "cubicle" | "meeting-room";

export interface SeatTypeConfig {
  key: SeatTypeKey;
  name: string;
  displayName: string;
  description: string;
  icon?: string;
  color: string;
  pricingTier: "regular" | "cubicle" | "meeting-room";
  features: string[];
}

export const SEAT_TYPES: Record<SeatTypeKey, SeatTypeConfig> = {
  regular: {
    key: "regular",
    name: "Regular Seats",
    displayName: "Regular Seating",
    description: "Open lounge seating for flexible work",
    color: "bg-blue-50 border-blue-200",
    pricingTier: "regular",
    features: [
      "Access to open lounge",
      "Fiber Wi-Fi",
      "Power Outlets",
      "Ergonomic Seats",
      "Complimentary Beverage",
    ],
  },
  cubicle: {
    key: "cubicle",
    name: "Cubicle Seating",
    displayName: "Cubicle Seating",
    description: "Private cubicles with loft for focused work",
    color: "bg-purple-50 border-purple-200",
    pricingTier: "cubicle",
    features: [
      "Cubicles with loft",
      "Fiber Wi-Fi",
      "Power Outlets",
      "Ergonomic Seats",
      "Complimentary Beverage",
      "Personal Locker",
    ],
  },
  "meeting-room": {
    key: "meeting-room",
    name: "Meeting Rooms",
    displayName: "Meeting Rooms",
    description: "Conference and huddle rooms for team meetings",
    color: "bg-green-50 border-green-200",
    pricingTier: "meeting-room",
    features: [
      "Conference/Huddle Rooms",
      "Fiber Wi-Fi",
      "Power Outlets",
      "Meeting Equipment",
      "Complimentary Beverage",
      "Whiteboard & Markers",
    ],
  },
};

/**
 * Get seat type configuration by key
 */
export function getSeatTypeConfig(key: SeatTypeKey): SeatTypeConfig {
  return SEAT_TYPES[key];
}

/**
 * Get all seat types
 */
export function getAllSeatTypes(): SeatTypeConfig[] {
  return Object.values(SEAT_TYPES);
}

/**
 * Get seat type by name
 */
export function getSeatTypeByName(name: string): SeatTypeConfig | undefined {
  return Object.values(SEAT_TYPES).find((type) => type.name === name);
}
