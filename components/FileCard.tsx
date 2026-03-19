type FileCardProps = {
    fileName: string;
    fileType: string;
    status: string;
  };
  
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
  
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {status}
          </span>
        </div>
      </div>
    );
}