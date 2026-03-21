"use client";

import { useState } from "react";

type AIChatBoxProps = {
  courseSlug: string;
};

type MatchItem = {
  id: number;
  course_slug: string;
  course_file_id: number;
  document_text_id: number;
  chunk_index: number;
  content: string;
  similarity: number;
};

type AskResponse = {
  status: string;
  answer?: string;
  message?: string;
  matches?: MatchItem[];
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  matches?: MatchItem[];
};

export default function AIChatBox({ courseSlug }: AIChatBoxProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAsk() {
    if (!question.trim()) {
      setErrorMessage("Please enter a question.");
      return;
    }

    const userQuestion = question.trim();

    try {
      setIsLoading(true);
      setErrorMessage("");

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: userQuestion,
        },
      ]);

      setQuestion("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: userQuestion,
            course_slug: courseSlug,
            match_count: 3,
          }),
        }
      );

      const result: AskResponse = await response.json();

      if (!response.ok || result.status !== "ok") {
        setErrorMessage(result.message || "Failed to get AI answer.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: result.answer || "No answer returned.",
          matches: result.matches || [],
        },
      ]);
    } catch {
      setErrorMessage("Something went wrong while contacting the AI service.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">AI Chat</h2>
      <p className="mt-2 text-gray-600">
        Ask course-specific questions based on your uploaded files.
      </p>

      <div className="mt-6 grid gap-4">
        <textarea
          placeholder="Ask a question about this course..."
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="min-h-30 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />

        <button
          onClick={handleAsk}
          disabled={isLoading}
          className="w-fit rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Asking..." : "Ask AI"}
        </button>

        {errorMessage && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        {messages.length > 0 && (
          <div className="grid gap-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "rounded-xl border border-gray-200 bg-blue-50 p-4"
                    : "rounded-xl border border-gray-200 bg-gray-50 p-4"
                }
              >
                <p className="mb-2 text-sm font-medium text-gray-500">
                  {message.role === "user" ? "You" : "AI Answer"}
                </p>

                <p className="whitespace-pre-wrap text-gray-800">
                  {message.text}
                </p>

                {message.role === "assistant" &&
                  message.matches &&
                  message.matches.length > 0 && (
                    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                      <p className="mb-3 text-sm font-medium text-gray-500">
                        Retrieved Sources
                      </p>

                      <div className="grid gap-3">
                        {message.matches.map((match) => (
                          <div
                            key={match.id}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                          >
                            <p className="text-xs text-gray-500">
                              Chunk #{match.chunk_index} · Similarity:{" "}
                              {match.similarity.toFixed(4)}
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                              {match.content.length > 300
                                ? `${match.content.slice(0, 300)}...`
                                : match.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}