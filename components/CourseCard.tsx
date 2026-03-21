import Link from "next/link";

type CourseCardProps = {
  slug: string;
  title: string;
  description: string;
  buttonText: string;
  disabled?: boolean;
};

export default function CourseCard({
  slug,
  title,
  description,
  buttonText,
  disabled = false,
}: CourseCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>

      {disabled ? (
        <p className="mt-4 inline-block rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-500">
          Course slug is missing
        </p>
      ) : (
        <Link
          href={`/courses/${slug}`}
          className="mt-4 inline-block rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}
