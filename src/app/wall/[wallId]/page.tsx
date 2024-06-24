"use client";

import WallNotes, { PostType } from "@/app/components/wall/wall-notes";
import Image from "next/image";
import { useEffect, useState } from "react";

interface UserWallPage {
  wallId: string;
}

export default function UserWallPage({
  params: { wallId },
}: {
  params: { wallId: string };
}) {
  const [wallNotes, setWallNotes] = useState<PostType[]>([]);
  const [wallOwner, setWallOwner] = useState<{
    name: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/wall/${wallId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.count) {
          setWallNotes(res.data);

          const wallOwner = {
            name: res.data[0].author[0].name,
            image: res.data[0].author[0].image,
          };
          setWallOwner(wallOwner);
        }
      });
  }, [wallId]);

  return (
    <section className="space-y-8">
      <div className="container-bg text-center text-zinc-500 space-y-3">
        {wallOwner && wallOwner.image ? (
          <Image
            width={64}
            height={64}
            src={wallOwner.image}
            alt={wallOwner.name}
            className="w-32 h-32 rounded-full mx-auto"
          />
        ) : (
          <div className="w-32 h-32 bg-zinc-950/70 text-5xl flex items-center justify-center mx-auto rounded-full">
            👋
          </div>
        )}
        <h1 className="text-3xl">{wallOwner ? wallOwner.name : "Anonymous"}</h1>
      </div>

      <WallNotes
        hidePrivacy={true}
        hideOptions={true}
        hideAuthor={true}
        setWallNotes={(notes: PostType[]) => setWallNotes(notes)}
        data={wallNotes}
        emptyMessage="User haven't added any public notes yet."
      />
    </section>
  );
}
