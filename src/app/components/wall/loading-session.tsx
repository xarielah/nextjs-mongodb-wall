import Spinner from "../spinner";

export default function LoadingSession() {
  return (
    <div className="w-full flex items-center justify-center text-2xl">
      <Spinner />
    </div>
  );
}
