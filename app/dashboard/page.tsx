import CourseCard from "../../components/CourseCard";

export default function DashboardPage() {
  const courses = [
    {
      title: "CPSC 213",
      description:
        "Computer systems, C programming, memory, and assembly concepts.",
      buttonText: "Open Course",
    },
    {
      title: "PHIL 220",
      description:
        "Truth tables, quantifiers, logical validity, and tree methods.",
      buttonText: "Open Course",
    },
    {
      title: "MATH 221",
      description:
        "Matrices, vector spaces, eigenvalues, and linear transformations.",
      buttonText: "Open Course",
    },
    {
      title: "DSCI 100",
      description:
        "Introduction to data science, visualization, wrangling, and basic modeling.",
      buttonText: "Open Course",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">My Courses</h1>
            <p className="mt-2 text-gray-600">
              Create and manage your AI-powered study workspaces.
            </p>
          </div>

          <button className="rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-80">
            Create Course
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.title}
              title={course.title}
              description={course.description}
              buttonText={course.buttonText}
            />
          ))}
        </div>
      </div>
    </main>
  );
}