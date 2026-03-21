"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import PageContainer from "@/components/page-container";
import { accounts, Contact } from "@/lib/accounts";

type Props = {
  params: { id: string };
};

type Message = {
  email: string;
  linkedin: string;
  reason: string;
};

function Badge({
  label,
  variant,
}: {
  label: string;
  variant: "default" | "green" | "blue" | "yellow";
}) {
  const styles = {
    default: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[variant]}`}>
      {label}
    </span>
  );
}

export default function AccountPage({ params }: Props) {
  const found = accounts.find((a) => a.id === params.id);
  if (!found) notFound();

  const account = found;

  const [contacts, setContacts] = useState<Contact[] | undefined>(
    account.contacts
  );
  const [status, setStatus] = useState(account.status);

  const [messages, setMessages] = useState<Record<string, Message>>({});

  function generateContacts() {
    const mock: Contact[] = [
      {
        id: "1",
        name: "Head of Sales",
        role: "Head of Sales",
        seniority: "high",
        email: `sales@${account.id}.com`,
        recommended: true,
      },
      {
        id: "2",
        name: "RevOps Manager",
        role: "Revenue Operations Manager",
        seniority: "mid",
        email: `revops@${account.id}.com`,
        recommended: false,
      },
    ];

    setContacts(mock);
    setStatus("ready");
  }

  function generateMessage(contact: Contact) {
    const msg: Message = {
      reason: `${contact.role} is directly responsible for ${account.recommendedPlay.toLowerCase()} outcomes`,
      email: `Hi ${contact.name},\n\nNoticed ${account.whyNow.toLowerCase()}. Teams in a similar position typically struggle to convert this into pipeline efficiently.\n\nWe help identify and prioritise the right accounts and contacts automatically.\n\nWorth a quick look?\n`,
      linkedin: `Hi ${contact.name}, saw you're leading ${contact.role.toLowerCase()} at ${account.name}. Curious how you're approaching pipeline with recent changes.`,
    };

    setMessages((prev) => ({
      ...prev,
      [contact.id]: msg,
    }));
  }

  return (
    <PageContainer
      title={account.name}
      subtitle={account.whyNow}
      action={
        <button
          onClick={generateContacts}
          className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white"
        >
          Generate contacts
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_280px]">
        {/* LEFT */}
        <div className="space-y-10">
          {/* Summary */}
          <div>
            <div className="text-xs uppercase text-gray-500">Summary</div>
            <p className="mt-2 text-base text-gray-900">{account.summary}</p>
          </div>

          {/* Signals */}
          <div>
            <div className="text-xs uppercase text-gray-500">Signals</div>
            <ul className="mt-3 space-y-2">
              {account.signals.map((s) => (
                <li key={s} className="text-gray-700">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACTS */}
          <div>
            <div className="text-xs uppercase text-gray-500">Contacts</div>

            {!contacts ? (
              <div className="mt-4 text-sm text-gray-500">
                No contacts yet. Generate to find the best people to reach.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-gray-200 bg-white p-5"
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {c.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {c.role} • {c.email}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {c.recommended && (
                          <Badge label="Primary" variant="green" />
                        )}

                        <button
                          onClick={() => generateMessage(c)}
                          className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50"
                        >
                          Generate message
                        </button>
                      </div>
                    </div>

                    {/* MESSAGE PANEL */}
                    {messages[c.id] && (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        <div>
                          <div className="text-xs uppercase text-gray-500">
                            Why this person
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {messages[c.id].reason}
                          </p>
                        </div>

                        <div>
                          <div className="text-xs uppercase text-gray-500">
                            Email
                          </div>
                          <pre className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                            {messages[c.id].email}
                          </pre>
                        </div>

                        <div>
                          <div className="text-xs uppercase text-gray-500">
                            LinkedIn
                          </div>
                          <p className="text-sm text-gray-900 mt-1">
                            {messages[c.id].linkedin}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div>
            <div className="text-xs uppercase text-gray-500">Score</div>
            <div className="mt-2 text-xl font-semibold">
              {account.score}/100
            </div>
          </div>

          <div>
            <div className="text-xs uppercase text-gray-500">Status</div>
            <div className="mt-2">
              {status === "ready" && (
                <Badge label="Ready" variant="green" />
              )}
              {status === "needs_contacts" && (
                <Badge label="Needs contacts" variant="yellow" />
              )}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase text-gray-500">Play</div>
            <div className="mt-2">{account.recommendedPlay}</div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
