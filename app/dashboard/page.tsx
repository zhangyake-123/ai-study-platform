export default function DashboardPage() {
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
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">CPSC 210</h2>
            <p className="mt-2 text-gray-600">
              Java programming, OOP, and software construction.
            </p>
            <button className="mt-4 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100">
              Open Course
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">PHIL 220</h2>
            <p className="mt-2 text-gray-600">
              Truth tables, quantifiers, validity, and tree methods.
            </p>
            <button className="mt-4 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100">
              Open Course
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">MATH 221</h2>
            <p className="mt-2 text-gray-600">
              Matrices, vectors, linear transformations, and eigenvalues.
            </p>
            <button className="mt-4 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100">
              Open Course
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}