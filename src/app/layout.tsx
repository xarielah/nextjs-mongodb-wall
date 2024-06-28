import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Header from "./components/header";
import SessionWrapper from "./components/session-wrapper/session-wrapper";
import "./globals.css";

const font = Roboto({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Wall",
  description: "Your own personal shareable temporary notes wall app.",
  authors: {
    name: "Ariel Aharon",
    url: "https://xarielah.dev",
  },
  keywords: ["wall", "notes", "share", "temporary", "nextjs"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body
          className={
            font.className +
            " bg-zinc-900 text-white min-h-screen px-2 md:px-4 lg:px-0"
          }
        >
          <div className="w-full max-w-3xl space-y-10 pt-16 flex flex-col mx-auto">
            <Header />
            {children}
            <footer className="text-zinc-500 text-sm p-4">
              The Wall &copy; {new Date().getFullYear()}
            </footer>
          </div>
        </body>
      </html>
    </SessionWrapper>
  );
}
