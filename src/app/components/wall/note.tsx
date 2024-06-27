"use client";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";

interface INote {
  content: string;
  isPublic: boolean;
  createdAt: string;
  id: string;
  isRtl: boolean;
  hideAuthor?: boolean;
  hideOptions?: boolean;
  hidePrivacy?: boolean;
  authorName?: string | null | undefined;
  authorImage?: string | null | undefined;
  deletePost: (id: string) => void;
}

export default function Note({
  content,
  isPublic,
  createdAt,
  id,
  isRtl,
  hideAuthor,
  hideOptions,
  hidePrivacy,
  authorImage,
  authorName,
  deletePost,
}: INote) {
  const [isDateFromNow, setIsDateFromNow] = useState<boolean>(true);

  const toggleDateFromNow = () => setIsDateFromNow(!isDateFromNow);

  return (
    <div className="flex flex-col w-full">
      <article className="bg-zinc-950/20 p-4">
        <div className="flex justify-between mb-3">
          <div className="flex gap-2 items-center">
            {!hideAuthor && authorImage ? (
              <Image
                width={32}
                height={32}
                src={authorImage}
                alt={authorName || "N/A"}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              ""
            )}
            {hideAuthor ? "" : <div>{authorName || "N/A"}</div>}
          </div>
          <div>
            <div
              className="text-zinc-300 text-sm"
              onClick={toggleDateFromNow}
              role="button"
            >
              {getDateString(createdAt, isDateFromNow)}
            </div>
            {hidePrivacy ? (
              ""
            ) : (
              <p className="text-[0.7rem] text-zinc-500 text-right">
                {isPublic ? "Public" : "Private"}
              </p>
            )}
          </div>
        </div>
        <p
          className={`p-3 bg-zinc-950/20 rounded-md whitespace-pre-line ${
            isRtl ? "text-right" : ""
          }`}
          style={{ direction: isRtl ? "rtl" : "ltr" }}
        >
          {content}
        </p>
      </article>
      {!hideOptions ? (
        <aside className="bg-zinc-950/10 px-4 text-sm py-1 text-zinc-400 rounded-br-xl rounded-bl-xl">
          <menu className="flex gap-3 justify-end">
            <li>
              <button
                className="hover:underline"
                onClick={() => deletePost(id)}
              >
                Delete
              </button>
            </li>
          </menu>
        </aside>
      ) : (
        ""
      )}
    </div>
  );
}

function getDateString(date: string, fromNow?: boolean) {
  try {
    const ds = new Date(date);
    if (fromNow) return moment(ds).fromNow();
    return moment(ds).format("DD/MM/yyyy - HH:mm:ss");
  } catch (error) {
    return "";
  }
}
