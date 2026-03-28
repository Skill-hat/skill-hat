export interface Mentor {
  _id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  expertise: string[];
  socials: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  thumbnail: string;
  mentors: Mentor[];
  curriculum: string[];
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  enrolledCourses?: string[];
  certificates?: {
    courseId: string;
    issueDate: string;
    certificateId: string;
  }[];
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  description: string;
  requirements: string;
  status: "Active" | "Inactive";
  createdAt: string;

  // ✅ ADD THESE
  imageUrl?: string;
  public_id?: string;
}