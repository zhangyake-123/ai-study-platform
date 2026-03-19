"use client";

import { useState } from "react";
import CourseCard from "../../components/CourseCard";

type Course = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
};

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "cpsc-213",
      title: "CPSC 213",
      description:
        "Computer systems, C programming, memory, and assembly concepts.",
      buttonText: "Open Course",
    },
    {
      id: "phil-220",
      title: "PHIL 220",
      description:
        "Truth tables, quantifiers, logical validity, and tree methods.",
      buttonText: "Open Course",
    },
    {
      id: "math-221",
      title: "MATH 221",
      description:
        "Matrices, vector spaces, eigenvalues, and linear transformations.",
      buttonText: "Open Course",
    },
    {
      id: "dsci-100",
      title: "DSCI 100",
      description:
        "Introduction to data science, visualization, wrangling, and basic modeling.",
      buttonText: "Open Course",
    },
    {
      id: "cpsc-210",
      title: "CPSC 210",
      description: "Java programming, OOP, and software construction.",
      buttonText: "Open Course",
    },
  ]);

  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");

  function handleCreateCourse() {
    if (!newCourseTitle.trim() || !newCourseDescription.trim()) {
      return;
    }

    const newCourse = {
      id: newCourseTitle.toLowerCase().replaceAll(" ", "-"),
      title: newCourseTitle,
      description: newCourseDescription,
      buttonText: "Open Course",
    };

    setCourses([newCourse, ...courses]);
    setNewCourseTitle("");
    setNewCourseDescription("");
  }

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">My Courses</h1>
            <p className="mt-2 text-gray-600">
              Create and manage your AI-powered study workspaces.
            </p>
          </div>
        </div>

        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Create Course</h2>
          <p className="mt-2 text-gray-600">
            Add a new course workspace for your study materials and AI tools.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              type="text"
              placeholder="Course title (e.g. CPSC 221)"
              value={newCourseTitle}
              onChange={(event) => setNewCourseTitle(event.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />

            <textarea
              placeholder="Course description"
              value={newCourseDescription}
              onChange={(event) =>
                setNewCourseDescription(event.target.value)
              }
              className="min-h-[120px] rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />

            <button
              onClick={handleCreateCourse}
              className="w-fit rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-80"
            >
              Create Course
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              buttonText={course.buttonText}
            />
          ))}
        </div>
      </div>
    </main>
  );
}