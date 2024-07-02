"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AddNote from "./components/wall/add-note";
import LoadingNotes from "./components/wall/loading-notes";
import LoadingSession from "./components/wall/loading-session";
import NotLoggedIn from "./components/wall/not-logged-in";
import WallNotes, { PostType } from "./components/wall/wall-notes";

export default function Home() {
  const { data: session, status } = useSession();
  const [wallNotes, setWallNotes] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status !== "authenticated") return;
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
  }, [status]);

  const addNoteToWall = (note: any) => {
    console.log("🚀 ~ addNoteToWall ~ note:", note);
    setWallNotes((prev: any) => [note, ...prev]);
  };

  const removeNoteFromWall = (id: string) => {
    setWallNotes((prev: any) => prev.filter((note: any) => note._id !== id));
  };

  if (status === "loading") return <LoadingSession />;
  if (status === "unauthenticated") return <NotLoggedIn />;
  if (loading) return <LoadingNotes />;
  return (
    <main className="space-y-4">
      <AddNote
        settings={session?.user.settings!}
        addNoteToWall={addNoteToWall}
      />
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
