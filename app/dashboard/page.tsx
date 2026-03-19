import CreateCourseForm from "../../components/CreateCourseForm";

export const dynamic = "force-dynamic";

import CourseCard from "../../components/CourseCard";
import { supabase } from "../../lib/supabase";

type Course = {
  id: number;
  slug: string;
  title: string;
  description: string;
};

export default async function DashboardPage() {
  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, slug, title, description")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12 text-black">
        <p className="text-red-600">Failed to load courses: {error.message}</p>
      </main>
    );
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

        <CreateCourseForm />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses?.map((course) => (
            <CourseCard
              key={course.id}
              id={course.slug}
              title={course.title}
              description={course.description}
              buttonText="Open Course"
            />
          ))}
        </div>
      </div>
    </main>
  );
}