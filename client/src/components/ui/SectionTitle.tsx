interface Props {
  subtitle?: string;
  title: string;
  description?: string;
}

export default function SectionTitle({
  subtitle,
  title,
  description,
}: Props) {
  return (
    <div className="text-center mb-14">

      {subtitle && (
        <p className="uppercase tracking-[0.35em] text-zinc-500 text-sm">
          {subtitle}
        </p>
      )}

      <h2 className="text-5xl font-bold mt-4">
        {title}
      </h2>

      {description && (
        <p className="mt-5 max-w-2xl mx-auto text-zinc-400">
          {description}
        </p>
      )}

    </div>
  );
}