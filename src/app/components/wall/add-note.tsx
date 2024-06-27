"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaLock, FaLockOpen, FaLongArrowAltRight } from "react-icons/fa";
import LoadingSession from "./loading-session";

export default function AddNote({
  addNoteToWall,
}: {
  addNoteToWall: (note: any) => void;
}) {
  const { data: session } = useSession();

  const [text, setText] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

  const [loadingPref, setLoadingPref] = useState<boolean>(true);

  useEffect(() => {
    if (session?.user?.wallId) {
      fetch(`/api/wall/${session.user.wallId}/settings`)
        .then((res) => res.json())
        .then((res) => {
          const pref = res.preferences || {};
          setDirection(pref.defaultRTL ? "rtl" : "ltr");
          setIsPublic(pref.defaultPublic || false);
        })
        .finally(() => setLoadingPref(false));
    }
  }, []);

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
            author: [
              { name: session?.user?.name, image: session?.user?.image },
            ],
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

  if (loadingPref) return <LoadingSession />;
  return (
    <div className="container-bg mb-16 flex flex-col gap-2 items-start">
      <EditorOptions
        className="md:hidden"
        {...{ isPublic, direction, toggleDirection, togglePrivacy }}
      />
      <textarea
        value={text}
        rows={4}
        onChange={handleChange}
        style={{ direction: direction }}
        className={`input my-2 ${direction === "rtl" ? "text-right " : ""}`}
        placeholder={
          isPublic ? "Write something public" : "Write something private"
        }
      />
      <div className="flex justify-between items-center w-full md:flex-row flex-col gap-3 md:gap-0">
        <EditorOptions
          className="hidden md:flex"
          {...{ isPublic, direction, toggleDirection, togglePrivacy }}
        />
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

interface IEditorOptions {
  isPublic: boolean;
  direction: "ltr" | "rtl";
  togglePrivacy: () => void;
  toggleDirection: () => void;
  className?: string;
}

function EditorOptions({
  isPublic,
  direction,
  toggleDirection,
  togglePrivacy,
  className,
}: IEditorOptions) {
  return (
    <menu
      className={`flex items-center gap-6 text-zinc-300 text-sm ${
        className || ""
      }`}
    >
      <li
        role="button"
        onClick={togglePrivacy}
        className="hover-white-element button"
      >
        {isPublic ? (
          <span className="flex items-center gap-2 text-green-400">
            <FaLockOpen className="text-sm" />
            PUBLIC
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <FaLock className="text-sm" />
            PRIVATE
          </span>
        )}
      </li>
      <li
        role="button"
        onClick={toggleDirection}
        className="hover-white-element button flex items-center gap-2"
      >
        <FaLongArrowAltRight
          className={`text-sm ease-in-out duration-300 ${
            direction === "ltr" ? "" : "rotate-180"
          }`}
        />
        {direction.toUpperCase()}
      </li>
    </menu>
  );
}
