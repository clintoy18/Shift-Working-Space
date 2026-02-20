import type { Role } from 'utils/roleUtils';

// Keep these as they match your enum
export type MembershipType = 'None' | 'Regular' | 'Weekly' | 'Monthly';
export type MembershipStatus = 'Active' | 'Inactive' | 'Expired' | 'Suspended';

export interface IUser {
    id: string;                // From ret.id = ret._id.toString()
    email: string;             // Changed from Email
    firstName: string;         // Changed from FirstName
    middleName?: string;       
    lastName: string;          
    fullName: string;          // From your Mongoose Virtual
    role: Role;                // 'shifty' | 'cashier' | 'admin'
    membershipType: MembershipType;
    membershipStatus: MembershipStatus;
    isVerified: boolean;
    isDeleted: boolean;
    createdAt: string;         // Mongoose timestamps
    updatedAt?: string;
}