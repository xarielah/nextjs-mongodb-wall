import Spinner from "../spinner";

export default function LoadingNotes() {
  return (
    <div className="w-full flex items-center justify-center text-2xl text-zinc-500">
      <Spinner />
      <p className="text-sm ml-3 font-bold">Loading your notes...</p>
    </div>
  );
}
