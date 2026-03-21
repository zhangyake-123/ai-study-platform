"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { extractTextFromFile } from "../lib/extractText";
import { chunkText } from "../lib/chunkText";

type UploadFileFormProps = {
  courseSlug: string;
};

function getFileType(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension === "pdf") return "PDF";
  if (extension === "md") return "Markdown";
  if (extension === "txt") return "Text";
  if (extension === "doc" || extension === "docx") return "Word";
  return "File";
}

export default function UploadFileForm({ courseSlug }: UploadFileFormProps) {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!courseSlug) {
      setMessage("Missing course slug. Please reopen this course from the dashboard.");
      return;
    }

    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    try {
      setIsUploading(true);
      setMessage("");

      const filePath = `${courseSlug}/${Date.now()}-${selectedFile.name}`;
      const fileType = getFileType(selectedFile.name);

      const { error: storageError } = await supabase.storage
        .from("course-files")
        .upload(filePath, selectedFile);

      if (storageError) {
        setMessage(`Upload failed: ${storageError.message}`);
        return;
      }

      const { data: insertedFile, error: dbError } = await supabase
        .from("course_files")
        .insert([
          {
            course_slug: courseId,
            course_slug: courseSlug,
            file_name: selectedFile.name,
            file_path: filePath,
            file_type: fileType,
            upload_status: "processing",
          },
        ])
        .select()
        .single();

      if (dbError || !insertedFile) {
        setMessage(`Database save failed: ${dbError?.message ?? "Unknown error"}`);
        return;
      }

      const extractedText = await extractTextFromFile(selectedFile);

      if (extractedText !== null) {
        const { data: insertedText, error: textError } = await supabase
          .from("document_texts")
          .insert([
            {
              course_slug: courseSlug,
              course_file_id: insertedFile.id,
              file_name: selectedFile.name,
              raw_text: extractedText,
            },
          ])
          .select()
          .single();

        if (textError || !insertedText) {
          await supabase
            .from("course_files")
            .update({ upload_status: "error" })
            .eq("id", insertedFile.id);

          setMessage(
            `Text extraction save failed: ${textError?.message ?? "Unknown error"}`
          );
          router.refresh();
          return;
        }

        const chunks = chunkText(extractedText);

        if (chunks.length > 0) {
          const chunkRows = chunks.map((chunk, index) => ({
            course_slug: courseSlug,
            course_file_id: insertedFile.id,
            document_text_id: insertedText.id,
            chunk_index: index,
            content: chunk,
          }));

          const { error: chunkError } = await supabase
            .from("document_chunks")
            .insert(chunkRows);

          if (chunkError) {
            await supabase
              .from("course_files")
              .update({ upload_status: "error" })
              .eq("id", insertedFile.id);

            setMessage(`Chunk save failed: ${chunkError.message}`);
            router.refresh();
            return;
          }
        }
      }

      const finalStatus = extractedText !== null ? "ready" : "uploaded";

      await supabase
        .from("course_files")
        .update({ upload_status: finalStatus })
        .eq("id", insertedFile.id);

      setMessage(
        extractedText !== null
          ? "File uploaded, text extracted, and chunks created successfully."
          : "File uploaded successfully. Text extraction is not supported for this file type yet."
      );

      setSelectedFile(null);
      router.refresh();
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
