"use client"

import { useRouter } from "next/navigation";
import { useParams } from "react-router";
import { useData } from "@/src/context/DataContext";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { MdArrowBack } from "react-icons/md";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function AddInternship() {
  const { id } = useParams();
  const navigate = useRouter();
  const { addInternship, updateInternship, getInternship } = useData();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    duration: "",
    stipend: "",
    description: "",
    requirements: "",
    status: "Active" as "Active" | "Inactive",
  });

  useEffect(() => {
    if (isEdit && id) {
      const internship = getInternship(id);
      if (internship) {
        setFormData({
          title: internship.title,
          company: internship.company,
          location: internship.location,
          duration: internship.duration,
          stipend: internship.stipend,
          description: internship.description,
          requirements: internship.requirements,
          status: internship.status,
        });
      }
    }
  }, [id, isEdit, getInternship]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && id) {
      updateInternship(id, formData);
      toast.success("Internship updated successfully!");
    } else {
      addInternship(formData);
      toast.success("Internship added successfully!");
    }
    
    navigate.push("/admin/internships");
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2 hover:bg-gray-100"
        onClick={() => navigate.push("/admin/internships")}
      >
        <MdArrowBack className="w-5 h-5" />
        Back to Internships
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEdit ? "Edit Internship" : "Add New Internship"}
        </h1>
        <p className="text-gray-600 mb-8">
          {isEdit ? "Update internship details" : "Fill in the details to create a new internship listing"}
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-sm">
          <div>
            <Label htmlFor="title">Internship Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Frontend Developer Intern"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="e.g. Tech Corp"
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g. Mumbai, India"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                placeholder="e.g. 3 months"
                required
              />
            </div>
            <div>
              <Label htmlFor="stipend">Stipend *</Label>
              <Input
                id="stipend"
                value={formData.stipend}
                onChange={(e) => handleChange("stipend", e.target.value)}
                placeholder="e.g. ₹15,000/month"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the internship role and responsibilities..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="requirements">Requirements *</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              placeholder="List the skills and qualifications required..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              {isEdit ? "Update Internship" : "Add Internship"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate.push("/admin/internships")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}