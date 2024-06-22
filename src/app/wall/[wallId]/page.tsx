"use client";
export default function UserWallPage({ wallId }: { wallId: string }) {
  console.log("🚀 ~ UserWallPage ~ wallId:", wallId);
  return (
    <div className="container-bg text-center text-zinc-500">
      <h1 className="text-4xl">Ariel's wall</h1>
      <p className="text-xl">This is a wall for Ariel</p>
    </div>
  );
}
