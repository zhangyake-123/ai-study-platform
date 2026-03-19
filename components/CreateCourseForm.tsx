"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCourseForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please enter both a title and a description.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Failed to create course.");
        return;
      }

      setTitle("");
      setDescription("");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">Create Course</h2>
      <p className="mt-2 text-gray-600">
        Add a new course workspace for your study materials and AI tools.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <input
          type="text"
          placeholder="Course title (e.g. CPSC 221)"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />

        <textarea
          placeholder="Course description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="min-h-[120px] rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />

        {errorMessage && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-fit rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}