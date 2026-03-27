"use client";

import React, { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  BookOpen, 
  LayoutDashboard, 
  Search,
  PlusCircle,
  X,
  Save
} from "lucide-react";
import { Course, Mentor, User } from "@/src/types";
import { MOCK_COURSES, MOCK_MENTORS } from "@/src/mockData";
import { useAuth } from "@/src/context/AuthContext";

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"courses" | "mentors">("courses");
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [mentors, setMentors] = useState<Mentor[]>(MOCK_MENTORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);



  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data: any = Object.fromEntries(formData.entries());
    
    // Handle array fields
    if (activeTab === 'courses') {
      if (data.curriculum) data.curriculum = data.curriculum.split(",").map((s: string) => s.trim());
      if (data.mentors) data.mentors = data.mentors.split(",").map((s: string) => s.trim());
    } else {
      if (data.expertise) data.expertise = data.expertise.split(",").map((s: string) => s.trim());
      data.socials = {
        linkedin: data.linkedin,
        twitter: data.twitter
      };
      delete data.linkedin;
      delete data.twitter;
    }

    // Simulate save
    if (editingItem) {
      if (activeTab === 'courses') {
        setCourses(courses.map(c => c._id === editingItem._id ? { ...c, ...data } : c));
      } else {
        setMentors(mentors.map(m => m._id === editingItem._id ? { ...m, ...data } : m));
      }
    } else {
      const newItem = { ...data, _id: Math.random().toString(36).substr(2, 9) };
      if (activeTab === 'courses') {
        setCourses([...courses, newItem]);
      } else {
        setMentors([...mentors, newItem]);
      }
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    if (activeTab === 'courses') {
      setCourses(courses.filter(c => c._id !== id));
    } else {
      setMentors(mentors.filter(m => m._id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skill-hat Admin</h1>
          <p className="text-gray-500 mt-1">Manage your professional learning ecosystem.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-[#2563EB] text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} className="mr-2" />
          Add New {activeTab === 'courses' ? 'Course' : 'Mentor'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1.5 rounded-2xl w-fit mb-8">
        <button 
          onClick={() => setActiveTab("courses")}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center">
            <BookOpen size={18} className="mr-2" /> Courses
          </div>
        </button>
        <button 
          onClick={() => setActiveTab("mentors")}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'mentors' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center">
            <Users size={18} className="mr-2" /> Mentors
          </div>
        </button>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {activeTab === 'courses' ? 'Course Details' : 'Mentor Details'}
                </th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {activeTab === 'courses' ? 'Price' : 'Expertise'}
                </th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeTab === 'courses' ? (
                courses.map(course => (
                  <tr key={course._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <img src={course.thumbnail} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <p className="font-bold text-gray-900">{course.title}</p>
                          <p className="text-xs text-gray-500">{course.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-bold text-gray-900">${course.price}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => { setEditingItem(course); setIsModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(course._id)}
                          className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                mentors.map(mentor => (
                  <tr key={mentor._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <img src={mentor.avatar} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <p className="font-bold text-gray-900">{mentor.name}</p>
                          <p className="text-xs text-gray-500">{mentor.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {mentor.expertise.map(skill => (
                          <span key={skill} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[10px] font-bold">{skill}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Verified</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => { setEditingItem(mentor); setIsModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(mentor._id)}
                          className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Edit' : 'Add New'} {activeTab === 'courses' ? 'Course' : 'Mentor'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Title / Name</label>
                  <input 
                    name={activeTab === 'courses' ? "title" : "name"}
                    defaultValue={editingItem ? (activeTab === 'courses' ? editingItem.title : editingItem.name) : ""}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">{activeTab === 'courses' ? "Category" : "Role"}</label>
                  <input 
                    name={activeTab === 'courses' ? "category" : "role"}
                    defaultValue={editingItem ? (activeTab === 'courses' ? editingItem.category : editingItem.role) : ""}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">{activeTab === 'courses' ? "Price" : "Expertise (comma separated)"}</label>
                  <input 
                    name={activeTab === 'courses' ? "price" : "expertise"}
                    defaultValue={editingItem ? (activeTab === 'courses' ? editingItem.price : editingItem.expertise?.join(", ")) : ""}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">{activeTab === 'courses' ? "Duration" : "Avatar URL"}</label>
                  <input 
                    name={activeTab === 'courses' ? "duration" : "avatar"}
                    defaultValue={editingItem ? (activeTab === 'courses' ? editingItem.duration : editingItem.avatar) : ""}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Description / Bio</label>
                <textarea 
                  name={activeTab === 'courses' ? "description" : "bio"}
                  defaultValue={editingItem ? (activeTab === 'courses' ? editingItem.description : editingItem.bio) : ""}
                  required
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {activeTab === 'courses' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Curriculum (comma separated)</label>
                  <input 
                    name="curriculum"
                    defaultValue={editingItem?.curriculum?.join(", ")}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}

              {activeTab === 'mentors' && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">LinkedIn URL</label>
                    <input name="linkedin" defaultValue={editingItem?.socials?.linkedin} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Twitter URL</label>
                    <input name="twitter" defaultValue={editingItem?.socials?.twitter} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none" />
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#2563EB] text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center"
                >
                  <Save size={20} className="mr-2" /> Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
