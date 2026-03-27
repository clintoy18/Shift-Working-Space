import { useEffect, useMemo, useState } from "react";
import { fetchAllUsersAdmin } from "@services";
import type { IUser, MembershipType } from "@interfaces";

import Loader from "@/components/ui/loader";
import { RoleBadge } from "./RoleBadge";

const membershipOptions: (MembershipType | "All")[] = [
  "All",
  "None",
  "Regular",
  "Weekly",
  "Monthly",
  "Premium",
  "Platinum",
];

const Membership = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [membershipType, setMembershipType] = useState<(typeof membershipOptions)[number]>("All");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const rawData = await fetchAllUsersAdmin();

        const parsedUsers: IUser[] = rawData
          .map((user: any): IUser | null => {
            if (!user.role) {
              console.warn("Missing role for user:", user.id);
              return null;
            }

            return {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              middleName: user.middleName,
              lastName: user.lastName,
              fullName: user.fullName,
              role: user.role,
              membershipType: user.membershipType,
              membershipStatus: user.membershipStatus,
              isVerified: user.isVerified,
              isDeleted: user.isDeleted,
              termsAccepted: user.termsAccepted ?? false,
              privacyPolicyAccepted: user.privacyPolicyAccepted ?? false,
              createdAt: user.createdAt,
            };
          })
          .filter((user): user is IUser => user !== null);

        setUsers(parsedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      // Exclude users with membershipType 'None'
      if (user.membershipType === "None") return false;

      const matchesSearch =
        !query ||
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      const matchesMembership =
        membershipType === "All" || user.membershipType === membershipType;

      return matchesSearch && matchesMembership;
    });
  }, [users, search, membershipType]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-semibold text-slate-800 mb-2">
          Membership
        </h2>
        <p className="text-sm text-slate-600">
          Search members and filter by membership type.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 min-w-[220px]">
          <label className="text-xs font-semibold text-slate-600">Search</label>
          <input
            type="text"
            placeholder="Search by name, email, or ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none"
          />
        </div>
        <div className="min-w-[200px]">
          <label className="text-xs font-semibold text-slate-600">Membership Type</label>
          <select
            value={membershipType}
            onChange={(event) => setMembershipType(event.target.value as MembershipType | "All")}
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none"
          >
            {membershipOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-10">
          <Loader />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Member</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Membership Type</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{user.fullName}</div>
                        <div className="text-xs text-slate-500">{user.id}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                          {user.membershipType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full border px-2 py-1 text-xs font-semibold ${
                            user.membershipStatus === "Active"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {user.membershipStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="px-4 py-6 text-sm text-slate-500">
              No members match the selected filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Membership;