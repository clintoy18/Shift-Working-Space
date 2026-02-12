import type { Role } from "utils/roleUtils";

export interface IUser {
    UserId: string;
    FirstName: string
    MiddleName: string
    LastName: string 
    Email: string
    CreatedTime: string
    Role: Role
}