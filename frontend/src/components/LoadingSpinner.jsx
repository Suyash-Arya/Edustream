export default function LoadingSpinner({
  message = "Loading your experience...",
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.16),_transparent_35%)] px-4 py-12">
      <div className="flex flex-col items-center rounded-2xl border border-indigo-100 bg-white/80 px-8 py-8 shadow-lg backdrop-blur">
        <div className="relative mb-4 h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
        <p className="text-lg font-semibold text-slate-800">{message}</p>
        <p className="mt-1 text-sm text-slate-500">
          Preparing the course details for you
        </p>
      </div>
    </div>
  );
}
