"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";

interface Admin {
  _id: string;
  email: string;
  expires_at: string;
  last_login?: string;
  created_at?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_APP_URL;

export default function AdminAccessControl() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [email, setEmail] = useState("");
  const [expiry, setExpiry] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [adminToDelete, setAdminToDelete] = useState<{
    id: string;
    email: string;
  } | null>(null);

  // Fetch all admins - Updated endpoint
  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/auth/admins/`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch admins");
      }

      const data: Admin[] = await res.json();
      setAdmins(data);
    } catch (error: any) {
      console.error("Fetch admins error:", error);
      toast.error(
        error.message || "Failed to load admin list. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Add new admin - Updated endpoint to match backend
  const handleAddAdmin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage(""); // Clear previous error

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!expiry) {
      toast.error("Expiry date and time is required");
      return;
    }

    const expiryDate = new Date(expiry);
    if (expiryDate <= new Date()) {
      toast.error("Expiry date and time must be in the future");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/auth/add-admin/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          expires_at: expiry,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Handle specific backend error messages
        if (data.error?.toLowerCase().includes("already exists")) {
          setErrorMessage(`Admin with email "${email.trim()}" already exists.`);
          toast.error("This email is already registered as an admin", {
            duration: 5000,
          });
        } else {
          throw new Error(data.error || "Failed to add admin");
        }
        return;
      }

      // Success
      toast.success("Admin added successfully", {
        icon: "✅",
      });

      setEmail("");
      setExpiry("");
      setErrorMessage("");
      await fetchAdmins();
    } catch (error: any) {
      console.error("Add admin error:", error);
      const msg = error.message || "Failed to add admin";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete admin - Updated endpoint
  const handleDeleteClick = (id: string, email: string) => {
    setAdminToDelete({ id, email });
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;

    const { id, email } = adminToDelete;
    setDeletingId(id);
    setShowDeleteDialog(false);

    try {
      const res = await fetch(`${API_BASE}/auth/delete-admin/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to revoke admin access");
      }

      toast.success(`Access revoked for ${email}`, {
        duration: 4000,
        icon: "✅",
      });

      await fetchAdmins();
    } catch (error: any) {
      console.error("Delete admin error:", error);
      toast.error(error.message || "Failed to revoke admin access", {
        duration: 5000,
      });
    } finally {
      setDeletingId(null);
      setAdminToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setAdminToDelete(null);
  };

  const isExpired = (expiresAt: string): boolean => {
    return new Date(expiresAt) < new Date();
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Admin Access Control
          </h1>
          <p className="text-gray-600 mt-1">
            Manage temporary and permanent admin access with precise expiry
          </p>
        </div>
        <button
          onClick={fetchAdmins}
          disabled={isLoading}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Add Admin Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-10 shadow-sm">
        <h2 className="text-lg font-medium mb-6">Grant New Admin Access</h2>

        <form
          onSubmit={handleAddAdmin}
          className="flex flex-wrap gap-4 items-end"
        >
          <div className="flex-1 min-w-[280px]">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@company.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(""); // Clear error when user types
              }}
              required
            />
          </div>

          <div className="flex-1 min-w-[280px]">
            <label
              htmlFor="expiry"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Access Expires At (Date & Time)
            </label>
            <input
              id="expiry"
              type="datetime-local"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={expiry}
              onChange={(e) => {
                setExpiry(e.target.value);
                setErrorMessage("");
              }}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Set precise expiry including hours and minutes
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email.trim() || !expiry}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-8 py-3 rounded-xl transition-all duration-200 min-w-[140px]"
          >
            {isSubmitting ? "Adding..." : "Add Admin"}
          </button>
        </form>

        {/* Error Message Display */}
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm flex items-start gap-3">
            <span className="text-red-500 mt-0.5">⚠️</span>
            <div>
              <strong>Failed to add admin:</strong> {errorMessage}
            </div>
          </div>
        )}
      </div>

      {/* Admins Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-lg">
            Active Admins ({admins.length})
          </h2>
          <span className="text-xs text-gray-500">Max 3 admins allowed</span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-500">
            Loading admins...
          </div>
        ) : admins.length === 0 ? (
          <div className="py-20 text-center text-gray-500">No admins found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                  <th className="px-8 py-4 text-left font-medium text-gray-600">
                    Email
                  </th>
                  <th className="px-8 py-4 text-left font-medium text-gray-600">
                    Expires At
                  </th>
                  <th className="px-8 py-4 text-left font-medium text-gray-600">
                    Last Login
                  </th>
                  <th className="px-8 py-4 text-left font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-8 py-4 text-right font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.map((admin) => {
                  const expired = isExpired(admin.expires_at);
                  return (
                    <tr
                      key={admin._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-8 py-5 font-medium">{admin.email}</td>

                      <td className="px-8 py-5 text-sm text-gray-600">
                        {formatDate(admin.expires_at)}
                      </td>

                      <td className="px-8 py-5 text-sm text-gray-600">
                        {formatDate(admin.last_login)}
                      </td>

                      <td className="px-8 py-5">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            expired
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {expired ? "Expired" : "Active"}
                        </span>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() =>
                            handleDeleteClick(admin._id, admin.email)
                          }
                          disabled={deletingId === admin._id}
                          className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50 transition-colors flex items-center gap-1"
                        >
                          {deletingId === admin._id ? (
                            <>Revoking...</>
                          ) : (
                            <>
                              <span>Revoke Access</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showDeleteDialog && adminToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Revoke Admin Access?
                  </h3>
                  <p className="text-gray-600 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8">
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-gray-700">
                  You are about to revoke access for:
                </p>
                <p className="font-medium text-gray-900 mt-1">
                  {adminToDelete.email}
                </p>
              </div>

              <p className="text-sm text-gray-500">
                The admin will no longer be able to login. You can re-add them
                later if needed.
              </p>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-100 px-8 py-5 flex gap-3 bg-gray-50">
              <button
                onClick={cancelDelete}
                className="flex-1 py-3.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId === adminToDelete.id}
                className="flex-1 py-3.5 text-sm font-medium bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors disabled:bg-red-400 flex items-center justify-center gap-2"
              >
                {deletingId === adminToDelete.id
                  ? "Revoking..."
                  : "Yes, Revoke Access"}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6 text-center">
        Note: Expired admins are automatically blocked. Expiry includes precise
        date and time (minutes supported).
      </p>
    </div>
  );
}
