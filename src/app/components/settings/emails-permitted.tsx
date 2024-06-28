"use client";
import { AddAlert } from "@/app/hooks/use-alerts";
import * as emailValidator from "email-validator";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface IEmailsPermitted {
  disabled?: boolean;
  fetchedValue: string[];
  wallId: string;
  addAlert: AddAlert;
}

export default function EmailsPermitted({
  disabled,
  fetchedValue,
  wallId,
  addAlert,
}: IEmailsPermitted) {
  const [addEmail, setAddEmail] = useState<string>("");
  const [emailsPerm, setEmailsPerm] = useState<string[]>([...fetchedValue]);

  const [emailOkay, setEmailOkay] = useState<boolean>(false);

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
    const addEmailCached = addEmail;
    setEmailsPerm((prev) => [addEmail.toLowerCase(), ...prev]);
    setAddEmail("");

    fetch(`/api/wall/${wallId}/email`, {
      method: "POST",
      body: JSON.stringify({ email: addEmail }),
    })
      .then((res) => {
        if (!res.ok) {
          setEmailsPerm(oldValues);
          addAlert({
            message: `Failed to add \"${addEmailCached}\" to permitted list`,
            type: "error",
            ttl: 10,
            toast: false,
          });
        }
      })
      .catch(() => {
        setEmailsPerm(oldValues);
        addAlert({
          message: `Failed to add ${addEmailCached} to permitted list`,
          type: "error",
          ttl: 10,
          toast: false,
        });
      });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddEmail(e.target.value.trim());
  };

  useEffect(() => {
    setEmailOkay(emailValidator.validate(addEmail));
  }, [addEmail]);

  return (
    <section>
      <div className="flex items-center md:flex-row flex-col gap-3 md:gap-0">
        <input
          disabled={disabled}
          value={addEmail}
          onChange={handleEmailChange}
          type="email"
          placeholder="Add email address to permit"
          className="input"
          onKeyDown={(e) => e.key === "Enter" && handleAddEmailSubmittion()}
        />
        <button
          className="button whitespace-nowrap"
          disabled={!addEmail || !emailOkay}
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
