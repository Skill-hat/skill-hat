"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { Camera, Save, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_APP_URL;

export default function EditProfile() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    gender: "",
    college: "",
    course: "",
    branch: "",
    graduation_year: "",        // Changed from 'year'
    state: "",
    city: "",
    linkedin: "",

  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================= FETCH USER =================
  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || "",
        phone: user.phone || "",
        gender: user.gender || "",
        college: user.college || "",
        course: user.course || "",
        branch: user.branch || "",
        graduation_year: user.graduation_year || "",
        state: user.state || "",
        city: user.city || "",
        linkedin: user.linkedin || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login again");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API}/api/users/profile/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      // Refresh user data
      const profileRes = await fetch(`${API}/api/users/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = await profileRes.json();

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess("Profile updated successfully!");

      setTimeout(() => router.push("/profile"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-lg">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-2 text-lg">Keep your profile up to date</p>
          </div>
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition"
          >
            <X size={22} /> Cancel
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-2xl">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 border border-green-300 text-green-700 rounded-2xl">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Profile Picture */}

          {/* Personal Information */}
          <div className="bg-white rounded-3xl p-8 border shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input name="full_name" value={form.full_name} onChange={handleChange} className="w-full px-5 py-3.5 border rounded-2xl focus:outline-none focus:border-blue-500" placeholder="Aarav Sharma" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-5 py-3.5 border rounded-2xl focus:outline-none focus:border-blue-500" placeholder="+91 98765 43210" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-5 py-3.5 border rounded-2xl focus:outline-none focus:border-blue-500">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-3xl p-8 border shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">College / University</label>
                <input name="college" value={form.college} onChange={handleChange} className="w-full px-5 py-3.5 border rounded-2xl" placeholder="MANIT Bhopal" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Course</label>
                <select name="course" value={form.course} onChange={handleChange} className="w-full px-5 py-3.5 border rounded-2xl">
                  <option value="">Select Course</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.E.">B.E.</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MBA">MBA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Branch / Specialization</label>
                <select name="branch" value={form.branch} onChange={handleChange} className="w-full px-5 py-3.5 border rounded-2xl">
                  <option value="">Select Branch</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics & Communication</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                  <option value="Civil">Civil Engineering</option>
                  <option value="Electrical">Electrical Engineering</option>
                  <option value="AI & ML">AI & Machine Learning</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Expected Graduation Year</label>
                <select name="graduation_year" value={form.graduation_year} onChange={handleChange} className="w-full px-5 py-3.5 border rounded-2xl">
                  <option value="">Select Year</option>
                  {Array.from({ length: 8 }, (_, i) => 2025 + i).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-3xl p-8 border shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <select name="state" value={form.state} onChange={handleChange} className="w-full px-5 py-3.5 border rounded-2xl">
                  <option value="">Select State</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  {/* Add more states as needed */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input name="city" value={form.city} onChange={handleChange} className="w-full px-5 py-3.5 border rounded-2xl" placeholder="Bhopal" />
              </div>
            </div>
          </div>

          {/* About */}


          {/* Social Links */}
          <div className="bg-white rounded-3xl p-8 border shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Social Profiles</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn Profile</label>
                <input name="linkedin" value={form.linkedin} onChange={handleChange} className="w-full px-5 py-3.5 border rounded-2xl" placeholder="https://linkedin.com/in/yourprofile" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold px-10 py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/30 text-lg"
            >
              <Save size={24} />
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}