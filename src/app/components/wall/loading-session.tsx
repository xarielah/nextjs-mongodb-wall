import { AiOutlineLoading } from "react-icons/ai";

export default function LoadingSession() {
  return (
    <div className="w-full flex items-center justify-center text-2xl">
      <AiOutlineLoading className="animate-spin" />
    </div>
  );
}
