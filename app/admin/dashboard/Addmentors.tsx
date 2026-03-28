import { useNavigate, useParams } from "react-router";
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

export function AddMentor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addMentor, updateMentor, getMentor } = useData();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    expertise: "",
    bio: "",
    experience: "",
    rating: 4.5,
    status: "Active" as "Active" | "Inactive",
  });

  useEffect(() => {
    if (isEdit && id) {
      const mentor = getMentor(id);
      if (mentor) {
        setFormData({
          name: mentor.name,
          email: mentor.email,
          expertise: mentor.expertise,
          bio: mentor.bio,
          experience: mentor.experience,
          rating: mentor.rating,
          status: mentor.status,
        });
      }
    }
  }, [id, isEdit, getMentor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && id) {
      updateMentor(id, formData);
      toast.success("Mentor updated successfully!");
    } else {
      addMentor(formData);
      toast.success("Mentor added successfully!");
    }
    
    navigate("/mentors");
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2 hover:bg-gray-100"
        onClick={() => navigate("/mentors")}
      >
        <MdArrowBack className="w-5 h-5" />
        Back to Mentors
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEdit ? "Edit Mentor" : "Add New Mentor"}
        </h1>
        <p className="text-gray-600 mb-8">
          {isEdit ? "Update mentor profile details" : "Fill in the details to create a new mentor profile"}
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-sm">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Rahul Sharma"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="e.g. rahul@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="expertise">Expertise *</Label>
            <Input
              id="expertise"
              value={formData.expertise}
              onChange={(e) => handleChange("expertise", e.target.value)}
              placeholder="e.g. Web Development, JavaScript, React"
              required
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Write a brief bio about the mentor..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience">Experience *</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                placeholder="e.g. 5 years"
                required
              />
            </div>
            <div>
              <Label htmlFor="rating">Rating (0-5) *</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => handleChange("rating", parseFloat(e.target.value))}
                required
              />
            </div>
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
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              {isEdit ? "Update Mentor" : "Add Mentor"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/mentors")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}