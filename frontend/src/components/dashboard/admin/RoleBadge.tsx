import React from "react";
import { User, Shield, CreditCard } from "lucide-react";
import type { IUser } from "@interfaces";

const roleConfig: Record<IUser["role"], { color: string; icon: React.ReactNode }> = {
  shifty: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: <User className="w-4 h-4 text-green-600" />
  },
  cashier: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <CreditCard className="w-4 h-4 text-blue-600" />
  },
  admin: {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: <Shield className="w-4 h-4 text-red-600" />
  },
};

export function RoleBadge({ role }: { role: IUser["role"] }) {
  const { color, icon } = roleConfig[role];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${color} whitespace-nowrap`}>
      {icon}
      {role}
    </span>
  );
}
