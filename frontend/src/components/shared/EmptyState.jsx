export default function EmptyState({ title, description = "No records found." }) {
  return (
    <div className="rounded-2xl border border-dashed bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">⌁</div>
      <h3 className="mt-4 font-medium">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
