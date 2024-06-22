"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AddNote({
  addNoteToWall,
}: {
  addNoteToWall: (note: any) => void;
}) {
  const { data: session } = useSession();

  const [text, setText] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

  const toggleDirection = () => {
    setDirection(direction === "ltr" ? "rtl" : "ltr");
  };

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const togglePrivacy = () => {
    setIsPublic(!isPublic);
  };

  const handleSubmit = () => {
    setLoading(true);

    const content = text.toString().trim();
    const oldContent = text;
    setText("");

    fetch("/api/wall", {
      method: "POST",
      body: JSON.stringify({
        content: content,
        isPublic: isPublic,
        isRtl: direction === "rtl",
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          console.error("Failed to add note to wall");
          return;
        }

        if (res.ok) {
          const response = await res.json();
          const wallPost = {
            author: session?.user?.name || "N/A",
            createdAt: new Date().toISOString(),
            content: content,
            isPublic: isPublic,
            isRtl: direction === "rtl",
            _id: response.postId.toString(),
          };

          addNoteToWall(wallPost);
        } else {
          // We dont want the user to lost their content if the request fails
          setText(oldContent);
        }
      })
      .catch(() => {
        // We dont want the user to lost their content if the request fails
        setText(oldContent);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container-bg mb-16 flex flex-col gap-2 items-end">
      <textarea
        value={text}
        onChange={handleChange}
        style={{ direction: direction }}
        className={`input ${direction === "rtl" ? "text-right " : ""}`}
        placeholder="Add what you need."
      />
      <div className="flex justify-between items-center w-full">
        <menu className="flex items-center gap-6 text-zinc-300">
          <li role="button" onClick={togglePrivacy}>
            {isPublic ? "PUBLIC" : "PRIVATE"}
          </li>
          <li role="button" onClick={toggleDirection}>
            {direction.toUpperCase()}
          </li>
        </menu>
        <button
          className="button px-4 text-sm"
          onClick={handleSubmit}
          type="submit"
          disabled={loading || text.trim().length === 0}
        >
          {loading ? "Writing to wall..." : "Pin on the wall"}
        </button>
      </div>
    </div>
  );
}
