"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { MdArrowBack } from "react-icons/md";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function AddInternship({
  initialData,
  isEditMode,
}: {
  initialData?: any;
  isEditMode?: boolean;
}) {
  const navigate = useRouter();
  const [image, setImge] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];

  const isEdit = isEditMode;
  const internshipId = Array.isArray(id) ? id[0] : id;

  const handleImageChange = (file: File) => {
    setImge(file);
    setPreview(URL.createObjectURL(file));
  };

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    duration: "",
    stipend: "",
    description: "",
    requirements: "",
    status: "Active" as "Active" | "Inactive",
    imageUrl: "",
    public_id: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        company: initialData.company,
        location: initialData.location,
        duration: initialData.duration,
        stipend: initialData.stipend,
        description: initialData.description,
        requirements: initialData.requirements,
        status: initialData.status,
        imageUrl: initialData.imageUrl,
        public_id: initialData.public_id,
      });

      setPreview(initialData.imageUrl);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = formData.imageUrl || null;
      let public_id = formData.public_id || null;

      // ✅ STEP 1: Upload image (ONLY if new image selected)
      if (image) {
        const formDataImg = new FormData();
        formDataImg.append("image", image);

        const res = await fetch(
          "http://localhost:8000/upload/internship/images/",
          {
            method: "POST",
            body: formDataImg,
          },
        );

        if (!res.ok) throw new Error("Image upload failed");

        const data = await res.json();
        imageUrl = data.imageUrl;
        public_id = data.publicId;
      }

      // ✅ STEP 2: Prepare final data
      const finalData = {
        ...formData,
        imageUrl,
        public_id,
      };

      // ✅ STEP 3: CREATE
      if (!isEdit) {
        const res = await fetch("http://localhost:8000/upload/internship/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        });

        if (!res.ok) throw new Error("Create failed");

        toast.success("Internship created!");
      }

      // ✅ STEP 4: UPDATE
      else {
        const res = await fetch(
          `http://localhost:8000/update_internship/${internshipId}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(finalData),
          },
        );

        if (!res.ok) throw new Error("Update failed");

        toast.success("Internship updated!");
      }

      // ✅ STEP 5: Redirect
      navigate.push("/admin/internships");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {isEdit ? "Edit Internship" : "Add New Internship"}
        </h1>
        <p className="text-gray-600 mb-8">
          {isEdit
            ? "Update internship details"
            : "Fill in the details to create a new internship listing"}
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6 shadow-lg"
        >
          <div className="space-y-3">
            <Label>Internship Banner</Label>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imageUpload"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageChange(e.target.files[0]);
                  }
                }}
              />

              <label htmlFor="imageUpload" className="cursor-pointer">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto h-40 rounded-lg object-cover"
                  />
                ) : (
                  <div className="text-gray-500">
                    <p className="font-medium">Click to upload image</p>
                    <p className="text-sm">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>
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
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
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
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
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
