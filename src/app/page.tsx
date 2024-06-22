"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AddNote from "./components/wall/add-note";
import WallNotes from "./components/wall/wall-notes";

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

  return (
    <main className="space-y-4">
      {!loggedIn ? "" : <AddNote addNoteToWall={addNoteToWall} />}
      <section className="p-2 w-full space-y-6">
        {!loggedIn ? (
          "Not logged in"
        ) : (
          <WallNotes
            data={wallNotes}
            user={{ name: session.user?.name, image: session.user?.image }}
          />
        )}
      </section>
    </main>
  );
}
