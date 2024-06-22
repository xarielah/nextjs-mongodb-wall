"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  console.log("🚀 ~ Header ~ session:", session);
  const loggedIn = session && session?.user;

  return (
    <header className="container-bg flex justify-end">
      {loggedIn ? (
        <div className="flex items-center gap-4">
          <ShowUser user={session?.user} />
          <button onClick={() => signOut()}>Logout</button>
        </div>
      ) : (
        ""
      )}
      {!loggedIn ? (
        <button onClick={() => signIn("google")}>Google Login</button>
      ) : (
        ""
      )}
    </header>
  );
}

function ShowUser({ user }: any) {
  console.log("🚀 ~ ShowUser ~ user:", user);
  return (
    <div className="flex items-center gap-3">
      <img className="w-8 h-8 rounded-full" src={user.image} alt={user.name} />
      <span>{user.name}</span>
    </div>
  );
}
