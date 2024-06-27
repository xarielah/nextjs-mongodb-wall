import EmptyNotes from "./empty-notes";
import Note from "./note";

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
        <Note
          key={index}
          hideAuthor={hideAuthor}
          hideOptions={hideOptions}
          hidePrivacy={hidePrivacy}
          deletePost={deletePost}
          createdAt={note.createdAt}
          content={note.content}
          id={note._id}
          isPublic={note.isPublic}
          isRtl={note.isRtl}
          authorImage={note.author[0].image}
          authorName={note.author[0].name}
        />
      ))}
    </>
  );
}
