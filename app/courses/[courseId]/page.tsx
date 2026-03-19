import Link from "next/link";
import FileCard from "../../../components/FileCard";
import UploadFileForm from "../../../components/UploadFileForm";
import { supabase } from "../../../lib/supabase";

type CoursePageProps = {
  params?:
    | {
        courseId?: string;
      }
    | Promise<{
        courseId?: string;
      }>;
};

type CourseFile = {
  id: number;
  file_name: string;
  file_type: string;
  upload_status: string;
};

function formatCourseName(courseId?: string) {
  if (!courseId) {
    return "Course Workspace";
  }

  return courseId
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");
}

export default async function CoursePage({ params }: CoursePageProps) {
  const resolvedParams = params ? await params : undefined;
  const courseId = resolvedParams?.courseId;
  const courseName = formatCourseName(courseId);

  const { data: files, error } = await supabase
    .from("course_files")
    .select("id, file_name, file_type, upload_status")
    .eq("course_slug", courseId ?? "")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 transition hover:text-black"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-gray-500">Course Workspace</p>
          <h1 className="mt-2 text-4xl font-bold">{courseName}</h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            This workspace helps you organize course materials, ask AI
            questions, and generate personalized practice from your own
            documents.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl border border-gray-300 px-5 py-3 transition hover:bg-gray-100">
              Open AI Chat
            </button>
            <button className="rounded-xl border border-gray-300 px-5 py-3 transition hover:bg-gray-100">
              Generate Quiz
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Study Materials</h2>
              <p className="mt-2 text-gray-600">
                Upload and manage your course documents here.
              </p>
            </div>

            <UploadFileForm courseId={courseId ?? ""} />

            <div className="mt-6 grid gap-4">
              {error && (
                <p className="text-sm text-red-600">
                  Failed to load files: {error.message}
                </p>
              )}

              {!error && files && files.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-gray-500">
                  No files uploaded yet.
                </div>
              )}

              {!error &&
                files?.map((file: CourseFile) => (
                  <FileCard
                    key={file.id}
                    fileName={file.file_name}
                    fileType={file.file_type}
                    status={file.upload_status}
                  />
                ))}
            </div>
          </section>

          <div className="grid gap-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">AI Chat</h2>
              <p className="mt-2 text-gray-600">
                Ask course-specific questions based on your notes, slides, and
                uploaded files.
              </p>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Quizzes</h2>
              <p className="mt-2 text-gray-600">
                Generate review questions, practice sets, and quiz sessions.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
