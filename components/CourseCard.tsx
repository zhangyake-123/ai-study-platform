import Link from "next/link";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
};

export default function CourseCard({
  id,
  title,
  description,
  buttonText,
}: CourseCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>

      <Link
        href={`/courses/${id}`}
        className="mt-4 inline-block rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
      >
        {buttonText}
      </Link>
    </div>
  );
}