export default function FullPageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center flex-col">
      <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-blue-500" />
      <div className="text-center text-black">
        <h2 className="text-2xl font-semibold">Loading...</h2>
        <p className="text-slate-400">Please wait while we fetch the data.</p>
      </div>
    </div>
  );
}