"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

type UploadFileFormProps = {
  courseId: string;
};

export default function UploadFileForm({ courseId }: UploadFileFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    try {
      setIsUploading(true);
      setMessage("");

      const filePath = `${courseId}/${Date.now()}-${selectedFile.name}`;

      const { error } = await supabase.storage
        .from("course-files")
        .upload(filePath, selectedFile);

      if (error) {
        setMessage(`Upload failed: ${error.message}`);
        return;
      }

      setMessage("File uploaded successfully.");
      setSelectedFile(null);
    } catch {
      setMessage("Something went wrong during upload.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Upload File</h2>
      <p className="mt-2 text-gray-600">
        Select a study material and upload it to this course workspace.
      </p>

      <div className="mt-6 grid gap-4">
        <input
          type="file"
          onChange={(event) =>
            setSelectedFile(event.target.files?.[0] || null)
          }
          className="rounded-xl border border-gray-300 px-4 py-3"
        />

        {selectedFile && (
          <p className="text-sm text-gray-600">
            Selected file: {selectedFile.name}
          </p>
        )}

        {message && <p className="text-sm text-blue-600">{message}</p>}

        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-fit rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </button>
      </div>
    </div>
  );
}