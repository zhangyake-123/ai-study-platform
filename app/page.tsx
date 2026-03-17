import FeatureCard from "../components/FeatureCard";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <nav className="border-b border-gray-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">AI Study Platform</h1>
          <div className="flex gap-3">
            <button className="rounded-lg px-4 py-2 text-sm hover:bg-gray-100">
              Log In
            </button>
            <button className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-80">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center">
        <h2 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Build your own AI-powered study workspace
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
          Create courses, upload study materials, ask AI questions, and generate
          quizzes based on your own learning content.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-xl bg-black px-6 py-3 text-white transition hover:opacity-80"
          >
            Start Building
          </Link>
          <button className="rounded-xl border border-gray-300 px-6 py-3 transition hover:bg-gray-100">
            View Features
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h3 className="mb-8 text-center text-2xl font-semibold">
          Core Features
        </h3>

        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="Create Courses"
            description="Organize your learning into separate courses like math, CS, or exam prep."
          />

          <FeatureCard
            title="Ask AI Questions"
            description="Get answers grounded in your uploaded notes, lectures, and study materials."
          />

          <FeatureCard
            title="Generate Practice"
            description="Turn your documents into quizzes, review questions, and study prompts automatically."
          />
        </div>
      </section>
    </main>
  );
}
