"use client";

import { FaRegCopy } from "react-icons/fa";

export function CopyButton({ stringToCopy }: { stringToCopy: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(stringToCopy);
    alert("Copied to clipboard");
  };
  return (
    <button onClick={handleCopy}>
      <FaRegCopy />
    </button>
  );
}
