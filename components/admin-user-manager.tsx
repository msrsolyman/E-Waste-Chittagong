"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Shield,
  UserCheck,
  AlertCircle,
  Check,
  X,
  Edit2,
  Trash2,
  KeyRound,
  Search,
  Sparkles,
  Copy,
  FileClock,
  User,
  ShieldAlert,
  PowerOff,
  Power,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAdminLocale } from "@/lib/admin-i18n";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string | Date;
}

function generateSecurePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const special = "!@#$%^&*";
  const all = upper + lower + digits + special;

  let pwd = "";
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];
  pwd += special[Math.floor(Math.random() * special.length)];

  for (let i = 4; i < 16; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }

  return pwd.split("").sort(() => 0.5 - Math.random()).join("");
}

export function AdminUserManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: UserItem[];
  currentUserId?: string;
}) {
  const { t, locale } = useAdminLocale();
  const [users, setUsers] = React.useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<"ALL" | "SUPER_ADMIN" | "CONTENT_MANAGER">("ALL");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const [isAdding, setIsAdding] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Deletion Modal
  const [userToDelete, setUserToDelete] = React.useState<UserItem | null>(null);

  // Status Toggle Modal
  const [userToToggleStatus, setUserToToggleStatus] = React.useState<UserItem | null>(null);

  // Edit/Password Reset Modal
  const [editingUser, setEditingUser] = React.useState<UserItem | null>(null);
  const [editForm, setEditForm] = React.useState({
    name: "",
    role: "CONTENT_MANAGER",
    newPassword: "",
  });

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "CONTENT_MANAGER",
  });

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleGeneratePasswordForNew = () => {
    const pwd = generateSecurePassword();
    setFormData((prev) => ({ ...prev, password: pwd }));
    copyToClipboard(pwd, "new-pwd");
  };

  const handleGeneratePasswordForEdit = () => {
    const pwd = generateSecurePassword();
    setEditForm((prev) => ({ ...prev, newPassword: pwd }));
    copyToClipboard(pwd, "edit-pwd");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password.length < 12) {
      setError("Password must be at least 12 characters long with uppercase and numeric characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");

      setUsers([data.user, ...users]);
      setIsAdding(false);
      setFormData({ name: "", email: "", password: "", role: "CONTENT_MANAGER" });
      setNotice(`User ${data.user.email} created successfully.`);
      setTimeout(() => setNotice(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating user";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const executeToggleUserActive = async () => {
    if (!userToToggleStatus) return;
    const target = userToToggleStatus;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: target.id, isActive: !target.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setUsers(users.map((u) => (u.id === target.id ? { ...u, isActive: !target.isActive } : u)));
      setNotice(`Account status for ${target.email} updated.`);
      setUserToToggleStatus(null);
      setTimeout(() => setNotice(null), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Status change failed");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (u: UserItem) => {
    setEditingUser(u);
    setEditForm({
      name: u.name,
      role: u.role,
      newPassword: "",
    });
    setError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setLoading(true);
    setError(null);

    const payload: Record<string, string> = {
      id: editingUser.id,
      name: editForm.name,
      role: editForm.role,
    };
    if (editForm.newPassword) {
      payload.password = editForm.newPassword;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");

      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...data.user } : u)));
      setEditingUser(null);
      setNotice(`Administrator ${editingUser.email} updated successfully.`);
      setTimeout(() => setNotice(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!userToDelete) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users?id=${userToDelete.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      setUsers(users.filter((item) => item.id !== userToDelete.id));
      setNotice(`User ${userToDelete.email} removed successfully.`);
      setUserToDelete(null);
      setTimeout(() => setNotice(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setLoading(false);
    }
  };

  // Filter calculations
  const superAdminCount = users.filter((u) => u.role === "SUPER_ADMIN").length;
  const contentManagerCount = users.filter((u) => u.role === "CONTENT_MANAGER").length;
  const activeCount = users.filter((u) => u.isActive).length;
  const inactiveCount = users.filter((u) => !u.isActive).length;

  const filteredUsers = users.filter((u) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      if (!match) return false;
    }
    // Role filter
    if (roleFilter !== "ALL" && u.role !== roleFilter) {
      return false;
    }
    // Status filter
    if (statusFilter === "ACTIVE" && !u.isActive) return false;
    if (statusFilter === "INACTIVE" && u.isActive) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 shadow-sm animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{notice}</span>
        </div>
      )}

      {error && !editingUser && !userToDelete && !userToToggleStatus && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-700 dark:text-red-300 flex items-center gap-2 shadow-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Control Bar: Search, Filters, and Add Button */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("users.search_placeholder", "Search administrators by name or email...")}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setRoleFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                roleFilter === "ALL"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {locale === "bn" ? `সব রোল (${users.length})` : `All Roles (${users.length})`}
            </button>
            <button
              onClick={() => setRoleFilter("SUPER_ADMIN")}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                roleFilter === "SUPER_ADMIN"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-purple-600"
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>
                {locale === "bn"
                  ? `সুপার অ্যাডমিন (${superAdminCount})`
                  : `Super Admin (${superAdminCount})`}
              </span>
            </button>
            <button
              onClick={() => setRoleFilter("CONTENT_MANAGER")}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                roleFilter === "CONTENT_MANAGER"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-blue-600"
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>
                {locale === "bn"
                  ? `কনটেন্ট (${contentManagerCount})`
                  : `Content (${contentManagerCount})`}
              </span>
            </button>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {locale === "bn" ? "সব স্ট্যাটাস" : "All Status"}
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer ${
                statusFilter === "ACTIVE"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-emerald-600"
              }`}
            >
              {locale === "bn" ? `সক্রিয় (${activeCount})` : `Active (${activeCount})`}
            </button>
            <button
              onClick={() => setStatusFilter("INACTIVE")}
              className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer ${
                statusFilter === "INACTIVE"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-red-600"
              }`}
            >
              {locale === "bn" ? `নিষ্ক্রিয় (${inactiveCount})` : `Suspended (${inactiveCount})`}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              {isAdding
                ? (locale === "bn" ? "নিবন্ধন বাতিল" : "Cancel Registration")
                : (locale === "bn" ? "কর্মকর্তা নিবন্ধন" : "Register Administrator")}
            </span>
          </button>
        </div>
      </div>

      {/* Register User Collapsible Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 text-xs animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Register New System Administrator</span>
            </h3>
            <span className="text-[11px] text-slate-400">All registered credentials are protected by argon2 hashing</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Operations Director"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Official Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="officer@ewastechittagong.com"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Initial Password * (Min. 12 chars)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleGeneratePasswordForNew}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Auto-Generate</span>
                  </button>
                  {formData.password && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(formData.password, "new-pwd")}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      {copiedKey === "new-pwd" ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedKey === "new-pwd" ? "Copied!" : "Copy"}</span>
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Click Auto-Generate or type min. 12 characters"
                className="w-full p-2.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Assigned Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              >
                <option value="CONTENT_MANAGER">Content Manager (Restricted to Catalogue, Inquiries & Gallery)</option>
                <option value="SUPER_ADMIN">Super Admin (Unrestricted System, Users & Audit Access)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50 shadow-sm"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </div>
        </form>
      )}

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="p-3.5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            {locale === "bn" ? (
              <>
                মোট <strong>{users.length}</strong> টির মধ্যে <strong>{filteredUsers.length}</strong> টি অ্যাকাউন্ট প্রদর্শিত হচ্ছে
              </>
            ) : (
              <>
                Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> registered accounts
              </>
            )}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-emerald-600 hover:underline text-[11px] cursor-pointer"
            >
              {t("inq.reset_filters", "Clear search filter")}
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">{locale === "bn" ? "কর্মকর্তা ও ইমেইল" : "Name & Email"}</th>
                <th className="py-3 px-4">{locale === "bn" ? "পদবী ও অনুমতি" : "Role Privileges"}</th>
                <th className="py-3 px-4">{locale === "bn" ? "অ্যাকাউন্ট স্ট্যাটাস" : "Account Status"}</th>
                <th className="py-3 px-4">{locale === "bn" ? "নিবন্ধন তারিখ" : "Registered Date"}</th>
                <th className="py-3 px-4 text-right">{locale === "bn" ? "অ্যাকশন" : "Administrative Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium">No administrative accounts matched your filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.id === currentUserId;
                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition ${
                        isCurrent ? "bg-emerald-50/20 dark:bg-emerald-950/10" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                                  You (Active)
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === "SUPER_ADMIN"
                              ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                              : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          }`}
                        >
                          {u.role === "SUPER_ADMIN" ? (
                            <Shield className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          ) : (
                            <UserCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          )}
                          <span>{u.role === "SUPER_ADMIN" ? "Super Admin" : "Content Officer"}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            u.isActive
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-red-500"}`}
                          />
                          <span>{u.isActive ? "Active" : "Suspended"}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Audit Logs Shortcut */}
                          <Link
                            href={`/admin/audit-logs?search=${encodeURIComponent(u.email)}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition"
                            title={`View Audit Log History for ${u.email}`}
                          >
                            <FileClock className="w-3.5 h-3.5" />
                          </Link>

                          {/* Status Toggle Button */}
                          {isCurrent ? (
                            <button
                              type="button"
                              disabled
                              className="px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-300 dark:text-slate-600 cursor-not-allowed"
                              title="Cannot suspend your own active session"
                            >
                              Locked
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setUserToToggleStatus(u)}
                              className={`p-1.5 rounded-lg transition ${
                                u.isActive
                                  ? "text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                                  : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                              }`}
                              title={u.isActive ? "Suspend Account" : "Activate Account"}
                            >
                              {u.isActive ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          {/* Edit / Password Reset Button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition"
                            title="Edit Role or Reset Password"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          {isCurrent ? (
                            <span
                              className="p-1.5 rounded-lg text-slate-200 dark:text-slate-700 cursor-not-allowed"
                              title="Cannot delete your own active account"
                            >
                              <Trash2 className="w-3.5 h-3.5 opacity-30" />
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setUserToDelete(u)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                              title="Delete Administrator"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User & Reset Password Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                <span>Edit Administrator</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-500 font-mono bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
              Target: <strong className="text-slate-900 dark:text-white">{editingUser.email}</strong>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role Assignment
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                >
                  <option value="CONTENT_MANAGER">Content Manager (Restricted Catalogue & Inquiries)</option>
                  <option value="SUPER_ADMIN">Super Admin (Unrestricted System Operations)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    <span>Reset Password (Optional)</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleGeneratePasswordForEdit}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Auto-Generate</span>
                    </button>
                    {editForm.newPassword && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(editForm.newPassword, "edit-pwd")}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        {copiedKey === "edit-pwd" ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedKey === "edit-pwd" ? "Copied!" : "Copy"}</span>
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                  placeholder="Leave blank to keep existing password, or min. 12 chars"
                  className="w-full p-2.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 shadow-sm"
                >
                  {loading ? "Saving Changes..." : "Update Administrator"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suspend / Activate Confirmation Modal */}
      {userToToggleStatus && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl ${
                  userToToggleStatus.isActive
                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600"
                    : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600"
                }`}
              >
                {userToToggleStatus.isActive ? (
                  <PowerOff className="w-5 h-5" />
                ) : (
                  <Power className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {userToToggleStatus.isActive ? "Suspend Administrator" : "Activate Administrator"}
                </h3>
                <p className="text-xs text-slate-500">{userToToggleStatus.email}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              {userToToggleStatus.isActive
                ? `Suspending this account will immediately revoke all dashboard and API access for ${userToToggleStatus.name}. All assigned audit logs will remain intact.`
                : `Reactivating this account will restore full ${userToToggleStatus.role} access privileges.`}
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setUserToToggleStatus(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={executeToggleUserActive}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition shadow-sm ${
                  userToToggleStatus.isActive
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {loading
                  ? "Processing..."
                  : userToToggleStatus.isActive
                  ? "Confirm Suspension"
                  : "Confirm Activation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Permanently Delete Administrator
                </h3>
                <p className="text-xs text-slate-500">{userToDelete.email}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Are you sure you want to delete administrator <strong>{userToDelete.name}</strong> ({userToDelete.email})?
              This operation cannot be undone. System safeguards will prevent deletion if this is the last remaining Super Admin.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={executeDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition shadow-sm"
              >
                {loading ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
