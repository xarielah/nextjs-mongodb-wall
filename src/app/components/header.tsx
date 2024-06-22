"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiLogin, CiLogout } from "react-icons/ci";

export default function Header() {
  const { data: session } = useSession();
  const loggedIn = session && session?.user;
  const pathname = usePathname();
  console.log("🚀 ~ Header ~ pathname:", pathname);

  return (
    <header
      className={`container-bg flex items-center ${
        pathname === "/" ? "justify-end" : "justify-between"
      }`}
    >
      {pathname !== "/" ? (
        <Link href="/" className="text-sm text-zinc-500">
          ← Go to your wall
        </Link>
      ) : (
        ""
      )}
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
