import type { Role } from 'utils/roleUtils';

export type MembershipType = 'Regular' | 'Weekly' | 'Monthly';
export type MembershipStatus = 'Active' | 'Expired' | 'Suspended';

export interface IUser {
    UserId: string;
    Email: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Role: Role;                   // From your roleUtils
    MembershipType: MembershipType;
    MembershipStatus: MembershipStatus;
    MembershipStart?: string;
    MembershipEnd?: string;
    CreatedTime: string;
    UpdatedTime?: string;
    IsDeleted: boolean;
}