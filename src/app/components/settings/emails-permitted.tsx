"use client";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

interface IEmailsPermitted {
  disabled?: boolean;
  fetchedValue: string[];
  wallId: string;
}

export default function EmailsPermitted({
  disabled,
  fetchedValue,
  wallId,
}: IEmailsPermitted) {
  const [addEmail, setAddEmail] = useState<string>("");
  const [emailsPerm, setEmailsPerm] = useState<string[]>([...fetchedValue]);

  const handleEmailRemove = (email: string) => {
    const oldValues = [...emailsPerm];
    const newValues = oldValues.filter((val) => val !== email);
    setEmailsPerm(newValues);

    // Remove from the server
    fetch(`/api/wall/${wallId}/email`, {
      method: "DELETE",
      body: JSON.stringify({ email }),
    })
      .then((res) => {
        if (!res.ok) {
          setEmailsPerm(oldValues);
        }
      })
      .catch(console.error);
  };

  const handleAddEmailSubmittion = () => {
    const oldValues = [...emailsPerm];
    setEmailsPerm((prev) => [addEmail.toLowerCase(), ...prev]);
    setAddEmail("");

    fetch(`/api/wall/${wallId}/email`, {
      method: "POST",
      body: JSON.stringify({ email: addEmail }),
    }).then((res) => {
      if (!res.ok) {
        setEmailsPerm(oldValues);
      }
    });
  };

  return (
    <section>
      <div className="flex items-center gap-4 md:flex-row flex-col gap-3 md:gap-0">
        <input
          disabled={disabled}
          value={addEmail}
          onChange={(e) => setAddEmail(e.target.value.trim())}
          type="email"
          placeholder="Add email address to permit"
          className="input"
          onKeyDown={(e) => e.key === "Enter" && handleAddEmailSubmittion()}
        />
        <button
          className="button whitespace-nowrap"
          disabled={!addEmail}
          onClick={handleAddEmailSubmittion}
        >
          Add Email
        </button>
      </div>
      <article className="flex flex-wrap gap-4 justify-center text-sm text-zinc-300 my-8">
        {emailsPerm.map((email) => (
          <div
            key={email}
            role="button"
            className="bg-zinc-900 rounded-full py-1 px-2 hover:bg-zinc-900/80 ease-in-out flex items-center gap-2 duration-300"
          >
            {email}{" "}
            <IoMdClose
              onClick={() => handleEmailRemove(email)}
              className="rounded-full hover:bg-zinc-200/10 p-1 text-2xl"
            />
          </div>
        ))}
      </article>
    </section>
  );
}
