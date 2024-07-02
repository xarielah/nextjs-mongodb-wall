"use client";

import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: string;
}) {
  console.log("🚀 ~ session:", session);
  return (
    <SessionProvider
      session={JSON.parse(session)}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}
