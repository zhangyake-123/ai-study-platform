type CoursePageProps = {
  params: {
    courseId: string;
  };
};

export default function CoursePage({ params }: CoursePageProps) {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm text-gray-500">Course ID</p>
        <h1 className="mt-2 text-4xl font-bold">{params.courseId}</h1>

        <p className="mt-4 text-lg text-gray-600">
          This is the course workspace page. Later, you will upload files, ask
          AI questions, and generate quizzes here.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold">Files</h2>
            <p className="mt-2 text-gray-600">
              Uploaded study materials will appear here.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold">AI Chat</h2>
            <p className="mt-2 text-gray-600">
              Ask course-specific questions based on your materials.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold">Quizzes</h2>
            <p className="mt-2 text-gray-600">
              Generate practice questions and review exercises.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}