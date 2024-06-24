"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AddNote from "./components/wall/add-note";
import LoadingNotes from "./components/wall/loading-notes";
import LoadingSession from "./components/wall/loading-session";
import NotLoggedIn from "./components/wall/not-logged-in";
import WallNotes, { PostType } from "./components/wall/wall-notes";

export default function Home() {
  const { data: session } = useSession();
  const [wallNotes, setWallNotes] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadingSession = session === undefined;
  const loggedIn = session && session?.user;

  useEffect(() => {
    if (!loggedIn) return;
    setLoading(true);
    fetch("/api/wall")
      .then((res) => res.json())
      .then((res) => {
        if (res.count) {
          setWallNotes(res.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loggedIn]);

  const addNoteToWall = (note: any) => {
    setWallNotes((prev: any) => [note, ...prev]);
  };

  const removeNoteFromWall = (id: string) => {
    setWallNotes((prev: any) => prev.filter((note: any) => note._id !== id));
  };

  if (loadingSession) return <LoadingSession />;
  if (!loggedIn) return <NotLoggedIn />;
  if (loading) return <LoadingNotes />;
  return (
    <main className="space-y-4">
      <AddNote addNoteToWall={addNoteToWall} />
      <section className="p-2 w-full space-y-6">
        <WallNotes
          setWallNotes={(notes: PostType[]) => setWallNotes(notes)}
          data={wallNotes}
          removeNoteFromWall={(id: string) => removeNoteFromWall(id)}
        />
      </section>
    </main>
  );
}
