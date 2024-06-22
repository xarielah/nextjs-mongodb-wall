"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { CiLogin, CiLogout } from "react-icons/ci";

export default function Header() {
  const { data: session } = useSession();
  const loggedIn = session && session?.user;

  return (
    <header className="container-bg flex justify-end">
      {loggedIn ? (
        <div className="flex items-center gap-4">
          <ShowUser user={session?.user} />
          <button className="text-xl" onClick={() => signOut()}>
            <CiLogout />
          </button>
        </div>
      ) : (
        ""
      )}
      {!loggedIn ? (
        <button className="text-xl" onClick={() => signIn("google")}>
          <CiLogin />
        </button>
      ) : (
        ""
      )}
    </header>
  );
}

function ShowUser({ user }: any) {
  return (
    <div className="flex items-center gap-3">
      <img className="w-8 h-8 rounded-full" src={user.image} alt={user.name} />
      <span>{user.name}</span>
    </div>
  );
}
