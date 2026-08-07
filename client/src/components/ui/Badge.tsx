export default function Badge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full bg-white text-black text-xs font-semibold px-3 py-1">
      {children}
    </span>
  );
}