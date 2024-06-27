import cn from "@/lib/cn";

export default function SupBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <sup
      style={{
        boxShadow: "-0.5px 2px 1px rgba(0, 0, 0, 0.2)",
      }}
      className={cn(
        "bg-zinc-800 text-white rounded-md p-1 text-sm",
        className || ""
      )}
    >
      {children}
    </sup>
  );
}
