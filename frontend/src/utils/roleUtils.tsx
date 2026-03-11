import Profile from '../components/dashboard/Profile';
import AdminOverView from '../components/dashboard/admin/AdminOverview';
import UserTable from '../components/dashboard/user-management/Table';
import { CustomerDashboard } from "../components/dashboard/customer/CustomerDashboard";
import CheckInForm from '../components/checkin/CheckInForm';
import CheckInManagement from '../components/checkin/CheckInManagement';

// ✅ 1. Match your Node.js backend lowercase strings
export type Role = 'shifty' | 'cashier' | 'admin';

export type UserId = string;

// ✅ 2. Cleaned up tab definitions (Removed "Student/Teacher" legacy names)
export const shiftyTabs = (shiftyUserId?: string) => [
  {
    label: "Dashboard",
    content: <CustomerDashboard shiftyUserId={shiftyUserId} />,
  },
  { label: "Profile", content: <Profile /> },
];

export const cashierTabs = [
  { label: "Check-In", content: <CheckInForm /> },
  { label: "Active Check-Ins", content: <CheckInManagement /> },
  { label: "Profile", content: <Profile /> },
];

export const adminTabs = [
  { label: "Overview", content: <AdminOverView /> },
  { label: "Users", content: <UserTable /> },
  { label: "Profile", content: <Profile /> },
];

// ✅ 3. Updated switch case to use lowercase roles
export function getRoleConfig(role: Role, shiftyUserId?: string) {
  switch (role) {
    case "admin":
      return {
        tabs: adminTabs,
        description: "Manage users, oversee reports, and configure settings.",
      };

    case "cashier":
      return {
        tabs: cashierTabs,
        description: "Manage check-ins, reservations and payments.",
      };

    case "shifty":
      return {
        tabs: shiftyTabs(shiftyUserId),
        description: "View your check-in history and progress tracking.",
      };

    default:
      return {
        tabs: [],
        description: "No role configuration found.",
      };
  }
}

// ✅ 4. Updated validation logic
export const isValidRole = (role: string): role is Role => {
  return ['shifty', 'cashier', 'admin'].includes(role.toLowerCase() as Role);
};

export function parseRole(maybeRole: string): Role | null {
  const normalized = maybeRole?.toLowerCase();
  if (isValidRole(normalized)) {
    return normalized as Role;
  }
  return null;
}

// ✅ 5. Removed parseNumericRole (Unless your Node backend specifically sends 0, 1, 2)