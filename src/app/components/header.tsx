"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiLogin, CiLogout } from "react-icons/ci";
import { PiGearSix } from "react-icons/pi";
import { CopyButton } from "./copy-button";

export default function Header() {
  const { data: session } = useSession();
  const loggedIn = session && session?.user;
  const pathname = usePathname();

  return (
    <header
      className={`container-bg flex items-center ${
        session ? "justify-between" : "justify-end"
      }`}
    >
      {pathname !== "/" ? (
        <Link href="/" className="text-sm text-zinc-500">
          ← Back to wall
        </Link>
      ) : (
        ""
      )}

      {pathname === "/" && session ? (
        <OptionsForLoggedUsers wallId={(session?.user as any)?.wallId || ""} />
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

function OptionsForLoggedUsers({ wallId }: { wallId: string }) {
  let windowLoc = typeof window !== undefined ? window.location.origin : "";
  return (
    <menu className="text-zinc-500 text-2xl flex items-center gap-6">
      <li role="button" className="hover-white-element">
        <Link href="/wall/settings">
          <PiGearSix />
        </Link>
      </li>
      <li role="button" className="text-xl hover-white-element">
        <CopyButton stringToCopy={`${windowLoc}/wall/${wallId}`} />
      </li>
    </menu>
  );
}

function ShowUser({ user }: any) {
  return (
    <div className="flex items-center gap-3">
      <Image
        width={32}
        height={32}
        className="w-8 h-8 rounded-full"
        src={user.image}
        alt={user.name}
      />
      <span>{user.name}</span>
    </div>
  );
}
