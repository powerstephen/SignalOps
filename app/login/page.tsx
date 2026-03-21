export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-12 md:px-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_0_0_1px_rgba(17,24,39,0.06)]">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
          Log in
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Placeholder login screen for the demo flow.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
          />
          <button className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90">
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
