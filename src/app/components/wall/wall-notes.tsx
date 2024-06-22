import EmptyNotes from "./empty-notes";
type PostType = {
  content: string;
  isPublic: boolean;
  createdAt: string;
};

interface IWallNotes {
  data: PostType[];
  user: { name: string | null | undefined; image: string | null | undefined };
}

export default function WallNotes({ data, user }: IWallNotes) {
  if (data.length === 0) return <EmptyNotes />;
  return (
    <>
      {data.map((note, index) => (
        <div className="flex flex-col w-full" key={index}>
          <article className="bg-zinc-950/20 p-4">
            <div className="flex justify-between mb-3">
              <div className="flex gap-2 items-center">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "N/A"}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  ""
                )}
                <div>{user.name || "N/A"}</div>
              </div>
              <div>
                <p className="text-zinc-300 text-sm">
                  {getDateString(note.createdAt)}
                </p>
                <p className="text-[0.7rem] text-zinc-500 text-right">
                  {note.isPublic ? "Public" : "Private"}
                </p>
              </div>
            </div>
            <p className="p-3 bg-zinc-950/20 rounded-md whitespace-pre-line">
              {note.content}
            </p>
          </article>
          <aside className="bg-zinc-950/10 px-4 text-sm py-1 text-zinc-400 rounded-br-xl rounded-bl-xl">
            <menu className="flex gap-3 justify-end">
              <li>
                <button className="hover:underline">Delete</button>
              </li>
            </menu>
          </aside>
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
