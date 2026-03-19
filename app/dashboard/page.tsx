import CreateCourseForm from "../../components/CreateCourseForm";

export const dynamic = "force-dynamic";

import CourseCard from "../../components/CourseCard";
import { supabase } from "../../lib/supabase";

type Course = {
  id: number;
  slug: string | null;
  title: string;
  description: string | null;
};

export default async function DashboardPage() {
  let { data: courses, error }: { data: Course[] | null; error: Error | null } =
    await supabase
    .from("courses")
    .select("id, slug, title, description")
    .order("created_at", { ascending: false });

  if (error) {
    const fallbackQuery = await supabase
      .from("courses")
      .select("id, slug, title, description");

    courses = fallbackQuery.data;
    error = fallbackQuery.error;
  }

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

        {courses && courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-gray-500">
            No courses yet. Create your first course to get started.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses?.map((course) => (
            <CourseCard
              key={course.id}
              id={course.slug || String(course.id)}
              title={course.title}
              description={course.description || "No description provided yet."}
              buttonText="Open Course"
            />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
