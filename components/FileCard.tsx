type FileCardProps = {
  fileName: string;
  fileType: string;
  status: string;
};

function formatStatus(status: string) {
  if (status === "ready") return "Ready";
  if (status === "processing") return "Processing...";
  if (status === "error") return "Error";
  return "Uploaded";
}

export default function FileCard({
  fileName,
  fileType,
  status,
}: FileCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{fileName}</h3>
          <p className="mt-1 text-sm text-gray-500">{fileType}</p>
        </div>

        <span
          className={
            "rounded-full px-3 py-1 text-xs font-medium " +
            (status === "ready"
              ? "bg-green-100 text-green-700"
              : status === "processing"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-600")
          }
        >
          {formatStatus(status)}
        </span>
      </div>
    </div>
  );
}