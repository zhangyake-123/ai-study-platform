export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          AI Study Platform
        </h1>

        <p className="mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
          Create your own courses, upload study materials, ask AI questions,
          and generate practice quizzes.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="rounded-xl bg-black px-6 py-3 text-white transition hover:opacity-80">
            Get Started
          </button>

          <button className="rounded-xl border border-gray-300 px-6 py-3 transition hover:bg-gray-100">
            Learn More
          </button>
        </div>
      </div>
    </main>
  );
}
