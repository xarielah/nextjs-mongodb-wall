import Image from "next/image";
import EmptyNotes from "./empty-notes";

export type PostType = {
  content: string;
  isPublic: boolean;
  createdAt: string;
  _id: string;
  isRtl: boolean;
  author: [
    { name: string | null | undefined; image: string | null | undefined }
  ];
};

interface IWallNotes {
  data: PostType[];
  removeNoteFromWall?: (id: string) => void;
  setWallNotes: (notes: PostType[]) => void;
  hideOptions?: boolean;
  hidePrivacy?: boolean;
  emptyMessage?: string;
  hideAuthor?: boolean;
}

export default function WallNotes({
  removeNoteFromWall,
  setWallNotes,
  data,
  hidePrivacy,
  hideAuthor,
  hideOptions,
  emptyMessage,
}: IWallNotes) {
  if (data.length === 0) return <EmptyNotes emptyMessage={emptyMessage} />;

  const deletePost = (id: string) => {
    if (!removeNoteFromWall)
      return console.error("removeNoteFromWall is not defined");
    const oldContent = [...data];
    removeNoteFromWall(id);
    fetch(`/api/wall/post/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) {
          // reset back content;
          setWallNotes(oldContent);
        }
      })
      .catch(() => {
        // reset back content;
        setWallNotes(oldContent);
      });
  };
  return (
    <>
      {data.map((note, index) => (
        <div className="flex flex-col w-full" key={index}>
          <article className="bg-zinc-950/20 p-4">
            <div className="flex justify-between mb-3">
              <div className="flex gap-2 items-center">
                {!hideAuthor && note.author[0].image ? (
                  <Image
                    width={32}
                    height={32}
                    src={note.author[0].image}
                    alt={note.author[0].name || "N/A"}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  ""
                )}
                {hideAuthor ? "" : <div>{note.author[0].name || "N/A"}</div>}
              </div>
              <div>
                <p className="text-zinc-300 text-sm">
                  {getDateString(note.createdAt)}
                </p>
                {hidePrivacy ? (
                  ""
                ) : (
                  <p className="text-[0.7rem] text-zinc-500 text-right">
                    {note.isPublic ? "Public" : "Private"}
                  </p>
                )}
              </div>
            </div>
            <p
              className={`p-3 bg-zinc-950/20 rounded-md whitespace-pre-line ${
                note.isRtl ? "text-right" : ""
              }`}
              style={{ direction: note.isRtl ? "rtl" : "ltr" }}
            >
              {note.content}
            </p>
          </article>
          {!hideOptions ? (
            <aside className="bg-zinc-950/10 px-4 text-sm py-1 text-zinc-400 rounded-br-xl rounded-bl-xl">
              <menu className="flex gap-3 justify-end">
                <li>
                  <button
                    className="hover:underline"
                    onClick={() => deletePost(note._id)}
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
      ))}
    </>
  );
}

function getDateString(date: string) {
  try {
    const ds = new Date(date).toDateString();
    return ds;
  } catch (error) {
    return "";
  }
}
