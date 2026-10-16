"use client";

import * as React from "react";
import { Plus, Shield, UserCheck, AlertCircle, Check, X, Edit2, Trash2, KeyRound } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string | Date;
}

export function AdminUserManager({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = React.useState<UserItem[]>(initialUsers);
  const [isAdding, setIsAdding] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

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

  const toggleUserActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setUsers(users.map((u) => (u.id === id ? { ...u, isActive: !currentActive } : u)));
      setNotice("Account status updated.");
      setTimeout(() => setNotice(null), 3000);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Status change failed");
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
      setNotice("User updated successfully.");
      setTimeout(() => setNotice(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (u: UserItem) => {
    if (!confirm(`Are you sure you want to permanently delete administrator "${u.email}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${u.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      setUsers(users.filter((item) => item.id !== u.id));
      setNotice(`User ${u.email} removed.`);
      setTimeout(() => setNotice(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Deletion failed");
    }
  };

  return (
    <div className="space-y-6">
      {notice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Showing {users.length} registered administrative accounts
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? "Cancel" : "Add Administrative User"}</span>
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 text-xs animate-in fade-in"
        >
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Register New Administrator
          </h3>

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
                placeholder="e.g. Tariqul Islam"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Initial Password * (Min. 12 characters)
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min. 12 chars (upper, lower, digit, symbol)"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Assigned Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="CONTENT_MANAGER">Content Manager (Restricted to Catalogue & Inquiries)</option>
                <option value="SUPER_ADMIN">Super Admin (Unrestricted System Operations)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </div>
        </form>
      )}

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Name & Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
                          : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {u.role === "SUPER_ADMIN" ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      <span>{u.role === "SUPER_ADMIN" ? "Super Admin" : "Content Officer"}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        u.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                      }`}
                    >
                      {u.isActive ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleUserActive(u.id, u.isActive)}
                        className={`text-[11px] font-semibold hover:underline ${
                          u.isActive ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        className="p-1 text-slate-400 hover:text-blue-600 transition"
                        title="Edit User / Reset Password"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(u)}
                        className="p-1 text-slate-400 hover:text-red-600 transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                <span>Edit Administrator: {editingUser.email}</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  <option value="CONTENT_MANAGER">Content Manager</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  <span>Reset Password (Leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                  placeholder="Min. 12 characters"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Update Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
