export default function EmptyNotes({
  emptyMessage,
}: {
  emptyMessage?: string;
}) {
  return (
    <section className="container-bg text-center text-zinc-500">
      {emptyMessage ? emptyMessage : "Added notes will be shown here"}
    </section>
  );
}
