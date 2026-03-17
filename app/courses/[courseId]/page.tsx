import Link from "next/link";

type CoursePageProps = {
  params?: {
    courseId?: string;
  };
};

function formatCourseName(courseId?: string) {
  if (!courseId) {
    return "Course";
  }

  return courseId
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");
}

export default function CoursePage({ params }: CoursePageProps) {
  const courseName = formatCourseName(params?.courseId);

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
            This is your course workspace. Later, you will upload files, ask AI
            questions based on your materials, and generate practice quizzes
            here.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-80">
              Upload Materials
            </button>
            <button className="rounded-xl border border-gray-300 px-5 py-3 transition hover:bg-gray-100">
              Open AI Chat
            </button>
            <button className="rounded-xl border border-gray-300 px-5 py-3 transition hover:bg-gray-100">
              Generate Quiz
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Files</h2>
            <p className="mt-2 text-gray-600">
              Uploaded study materials will appear here.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">AI Chat</h2>
            <p className="mt-2 text-gray-600">
              Ask course-specific questions based on your notes, slides, and
              documents.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Quizzes</h2>
            <p className="mt-2 text-gray-600">
              Generate review questions, practice sets, and quiz sessions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}