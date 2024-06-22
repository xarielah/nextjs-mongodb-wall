"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AddNote({
  addNoteToWall,
}: {
  addNoteToWall: (note: any) => void;
}) {
  const [text, setText] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const { data: session } = useSession();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const togglePrivacy = () => {
    setIsPublic(!isPublic);
  };

  const handleSubmit = () => {
    const content = text.toString().trim();

    fetch("/api/wall", {
      method: "POST",
      body: JSON.stringify({
        content: content,
        isPublic: isPublic,
      }),
    }).then((res) => {
      console.log(res);
      const wallPost = {
        author: session?.user?.name || "N/A",
        createdAt: new Date().toISOString(),
        content: content,
        isPublic: isPublic,
      };

      addNoteToWall(wallPost);
      setText("");
    });
  };

  return (
    <div className="container-bg mb-16 flex flex-col gap-2 items-end">
      <textarea
        value={text}
        onChange={handleChange}
        className="input"
        placeholder="Add what you need."
      />
      <button
        className="button px-4 text-sm"
        onClick={handleSubmit}
        type="submit"
      >
        Pin on the wall
      </button>
    </div>
  );
}
