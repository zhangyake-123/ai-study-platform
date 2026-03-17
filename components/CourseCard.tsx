type CourseCardProps = {
  title: string;
  description: string; 
  buttonText: string;
};

export default function CourseCard({
  title,
  description, 
  buttonText, 
}: CourseCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>
      <button className="mt-4 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100">
        {buttonText}
      </button>
    </div>
  );
}