/** @format */
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import DashboardHeading from "@/components/DashboardHeading";
import {
  getPlatformUsers,
  updateUserStatus,
  deleteUser,
} from "@/lib/api/adminActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBan,
  faTrashCan,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = {
        search: search.trim(),
        role: roleFilter,
        status: statusFilter,
      };
      const res = await getPlatformUsers(queryParams);

      if (res && Array.isArray(res.result)) {
        setUsers(res.result);
      } else if (res && Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res && Array.isArray(res)) {
        setUsers(res);
      } else {
        // Fallback fake data for UI testing if DB is empty/unconnected
        setUsers([
          {
            _id: "u1",
            name: "John Doe",
            email: "john@example.com",
            role: "buyer",
            status: "active",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "u2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "seller",
            status: "blocked",
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    if (!window.confirm(`Are you sure you want to ${newStatus} this user?`))
      return;

    try {
      const res = await updateUserStatus(userId, newStatus);
      if (res && res.success !== false) {
        toast.success(`User ${newStatus} successfully!`);
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, status: newStatus } : user
          )
        );
      } else {
        toast.error(`Failed to update status: ${res?.message || "Error"}`);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (userId) => {
    if (
      !window.confirm(
        "Are you absolutely sure you want to permanently delete this user? This action cannot be undone."
      )
    )
      return;

    try {
      const res = await deleteUser(userId);
      if (res && res.success !== false) {
        toast.success("User deleted successfully!");
        setUsers((prev) => prev.filter((user) => user._id !== userId));
      } else {
        toast.error(`Failed to delete user: ${res?.message || "Error"}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-8 mt-6 pb-12 text-white max-w-6xl mx-auto px-4 sm:px-0">
      <DashboardHeading
        title="Manage Users"
        description="View, search, block, or remove users from the platform. Maintain platform safety and integrity."
      />

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-lg">
        <div className="relative flex items-center col-span-1 md:col-span-2">
          <span className="absolute left-4 text-slate-500">
            <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-800 bg-slate-950/40 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="relative flex items-center">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-800 bg-slate-950/40 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <div className="relative flex items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-800 bg-slate-950/40 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* 👥 Users Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-lg">No users found matching the criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-800 bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 sm:p-5">User Info</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4 sm:p-5 flex items-center gap-4">
                    <div className="w-10 h-10 relative rounded-full border border-slate-700 overflow-hidden shrink-0 bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">
                        {user.name}
                      </div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full border font-bold uppercase ${
                        user.role === "seller"
                          ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full border font-bold ${
                        user.status === "blocked"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                      }`}
                    >
                      {user.status === "blocked" ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="p-4 text-slate-400 font-mono text-xs">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleStatusToggle(user._id, user.status)}
                        className={`p-2 rounded-lg border border-transparent transition-all ${
                          user.status === "blocked"
                            ? "text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20"
                            : "text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/20"
                        }`}
                        title={user.status === "blocked" ? "Unblock User" : "Block User"}
                      >
                        <FontAwesomeIcon
                          icon={user.status === "blocked" ? faCheckCircle : faBan}
                          className="w-4 h-4"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition-all"
                        title="Delete User"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
