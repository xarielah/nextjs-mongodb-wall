"use client";

import { useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function SettingsPage() {
  const [emailsPermitted, setEmailsPermitted] = useState<string[]>([]);
  const [addEmail, setAddEmail] = useState<string>("");

  // This handles the CHANGE but not the add it self.
  const handleChangeAddEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddEmail(e.target.value.trim());
  };

  const handleAddEmailSubmittion = () => {
    if (!addEmail) return;
    const oldEmailsPermitted = [...emailsPermitted];
    setEmailsPermitted((prev) => [addEmail, ...prev]);
    setAddEmail("");
  };

  const handleSavedChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddEmail("");
  };

  const handleEmailRemove = (email: string) => {};

  return (
    <section className="container-bg">
      <h1 className="text-4xl font-bold mb-4">Settings</h1>
      <form className="w-full flex flex-col">
        <div className="flex items-center gap-4">
          <input
            value={addEmail}
            onChange={handleChangeAddEmail}
            type="email"
            placeholder="Add an email address to access your wall"
            className="input"
          />
          <button
            className="button whitespace-nowrap"
            disabled={!addEmail}
            onClick={handleAddEmailSubmittion}
          >
            Add Email
          </button>
        </div>
        <section className="flex flex-wrap gap-4 justify-center text-sm text-zinc-300 my-8">
          <div
            role="button"
            className="bg-zinc-900 rounded-full py-1 px-2 hover:bg-zinc-800 ease-in-out duration-300"
          >
            arielahr45@gmail.com{" "}
            <IoMdClose
              onClick={() => handleEmailRemove("arielahr45@gmail.com")}
            />
          </div>
          <div
            role="button"
            className="bg-zinc-900 rounded-full py-1 px-2 hover:bg-zinc-800 ease-in-out duration-300"
          >
            noybenhamo12345@gmail.com x
          </div>
          <div
            role="button"
            className="bg-zinc-900 rounded-full py-1 px-2 hover:bg-zinc-800 ease-in-out duration-300"
          >
            tonybenhamo12345@gmail.com x
          </div>
          <div
            role="button"
            className="bg-zinc-900 rounded-full py-1 px-2 hover:bg-zinc-800 ease-in-out duration-300"
          >
            tonybenhamo12345@gmail.com x
          </div>
          <div
            role="button"
            className="bg-zinc-900 rounded-full py-1 px-2 hover:bg-zinc-800 ease-in-out duration-300"
          >
            tonybenhamo12345@gmail.com x
          </div>
        </section>
        <button role="submit" className="button mx-auto">
          Save Changes
        </button>
      </form>
    </section>
  );
}
