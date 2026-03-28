"use client"

import { createContext, useContext, useState, ReactNode } from "react";



export interface Course {
  id: string;
  title: string;
  instructor: string;
  mentorId: string;
  category: string;
  duration: string;
  price: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  status: "Active" | "Inactive";
  enrollmentCount: number;
  createdAt: string;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  expertise: string;
  bio: string;
  experience: string;
  rating: number;
  totalStudents: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentName: string;
  studentEmail: string;
  enrolledDate: string;
  status: "Active" | "Completed" | "Cancelled";
}

interface DataContextType {
  courses: Course[];
  mentors: Mentor[];
  enrollments: Enrollment[];
  deleteInternship: (id: string) => void;
  addCourse: (course: Omit<Course, "id" | "createdAt" | "enrollmentCount">) => void;
  updateCourse: (id: string, course: Omit<Course, "id" | "createdAt" | "enrollmentCount">) => void;
  deleteCourse: (id: string) => void;
  getCourse: (id: string) => Course | undefined;
  addMentor: (mentor: Omit<Mentor, "id" | "createdAt" | "totalStudents">) => void;
  updateMentor: (id: string, mentor: Omit<Mentor, "id" | "createdAt" | "totalStudents">) => void;
  deleteMentor: (id: string) => void;
  getMentor: (id: string) => Mentor | undefined;
  getCourseEnrollments: (courseId: string) => Enrollment[];
  getTotalRevenue: () => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialMentors: Mentor[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    expertise: "Web Development, JavaScript, React",
    bio: "Senior Full Stack Developer with 8+ years of experience in web technologies.",
    experience: "8 years",
    rating: 4.8,
    totalStudents: 156,
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya@example.com",
    expertise: "Python, Data Science, Machine Learning",
    bio: "Data Science expert specializing in ML and AI applications.",
    experience: "6 years",
    rating: 4.9,
    totalStudents: 203,
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "amit@example.com",
    expertise: "Mobile Development, Flutter, React Native",
    bio: "Mobile app developer passionate about creating beautiful user experiences.",
    experience: "5 years",
    rating: 4.7,
    totalStudents: 124,
    status: "Active",
    createdAt: new Date().toISOString(),
  },
];



const initialCourses: Course[] = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    instructor: "Rahul Sharma",
    mentorId: "1",
    category: "Web Development",
    duration: "12 weeks",
    price: "₹4,999",
    description: "Master HTML, CSS, JavaScript, React, Node.js and become a full-stack developer.",
    level: "Beginner",
    status: "Active",
    enrollmentCount: 89,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Advanced Python Programming",
    instructor: "Priya Patel",
    mentorId: "2",
    category: "Programming",
    duration: "8 weeks",
    price: "₹3,499",
    description: "Deep dive into Python with advanced concepts, OOP, and real-world projects.",
    level: "Advanced",
    status: "Active",
    enrollmentCount: 67,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Mobile App Development with Flutter",
    instructor: "Amit Kumar",
    mentorId: "3",
    category: "Mobile Development",
    duration: "10 weeks",
    price: "₹5,499",
    description: "Build beautiful cross-platform mobile apps using Flutter and Dart.",
    level: "Intermediate",
    status: "Active",
    enrollmentCount: 53,
    createdAt: new Date().toISOString(),
  },
];

const initialEnrollments: Enrollment[] = [
  {
    id: "1",
    courseId: "1",
    studentName: "Vikram Singh",
    studentEmail: "vikram@example.com",
    enrolledDate: "2026-03-15T10:30:00Z",
    status: "Active",
  },
  {
    id: "2",
    courseId: "1",
    studentName: "Neha Gupta",
    studentEmail: "neha@example.com",
    enrolledDate: "2026-03-16T14:20:00Z",
    status: "Active",
  },
  {
    id: "3",
    courseId: "2",
    studentName: "Arjun Reddy",
    studentEmail: "arjun@example.com",
    enrolledDate: "2026-03-14T09:15:00Z",
    status: "Completed",
  },
  {
    id: "4",
    courseId: "3",
    studentName: "Sneha Iyer",
    studentEmail: "sneha@example.com",
    enrolledDate: "2026-03-20T11:45:00Z",
    status: "Active",
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [mentors, setMentors] = useState<Mentor[]>(initialMentors);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments);


  const addCourse = (course: Omit<Course, "id" | "createdAt" | "enrollmentCount">) => {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      enrollmentCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (id: string, course: Omit<Course, "id" | "createdAt" | "enrollmentCount">) => {
    setCourses(
      courses.map((item) =>
        item.id === id ? { ...course, id, createdAt: item.createdAt, enrollmentCount: item.enrollmentCount } : item
      )
    );
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter((item) => item.id !== id));
  };

  const getCourse = (id: string) => {
    return courses.find((item) => item.id === id);
  };

  const addMentor = (mentor: Omit<Mentor, "id" | "createdAt" | "totalStudents">) => {
    const newMentor: Mentor = {
      ...mentor,
      id: Date.now().toString(),
      totalStudents: 0,
      createdAt: new Date().toISOString(),
    };
    setMentors([...mentors, newMentor]);
  };

  const updateMentor = (id: string, mentor: Omit<Mentor, "id" | "createdAt" | "totalStudents">) => {
    setMentors(
      mentors.map((item) =>
        item.id === id ? { ...mentor, id, createdAt: item.createdAt, totalStudents: item.totalStudents } : item
      )
    );
  };

  const deleteMentor = (id: string) => {
    setMentors(mentors.filter((item) => item.id !== id));
  };

  const getMentor = (id: string) => {
    return mentors.find((item) => item.id === id);
  };

  const getCourseEnrollments = (courseId: string) => {
    return enrollments.filter((enrollment) => enrollment.courseId === courseId);
  };

  const getTotalRevenue = () => {
    let total = 0;
    courses.forEach((course) => {
      const price = parseInt(course.price.replace(/[^0-9]/g, ""));
      total += price * course.enrollmentCount;
    });
    return total;
  };

  return (
    <DataContext.Provider
      value={{
        courses,
        mentors,
        enrollments,
        addCourse,
        updateCourse,
        deleteCourse,
        getCourse,
        addMentor,
        updateMentor,
        deleteMentor,
        getMentor,
        getCourseEnrollments,
        getTotalRevenue,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}