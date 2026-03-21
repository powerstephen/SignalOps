"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import PageContainer from "@/components/page-container";
import WorkspaceSourceBanner from "@/components/workspace-source-banner";
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
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[variant]}`}
    >
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
        name: "Sarah Turner",
        role: "Head of Sales",
        seniority: "high",
        email: `sales@${account.id}.com`,
        recommended: true,
      },
      {
        id: "2",
        name: "James Murphy",
        role: "RevOps Manager",
        seniority: "mid",
        email: `revops@${account.id}.com`,
        recommended: false,
      },
      {
        id: "3",
        name: "Emma Smith",
        role: "VP Marketing",
        seniority: "high",
        email: `marketing@${account.id}.com`,
        recommended: false,
      },
    ];

    setContacts(mock);
    setStatus("ready");
  }

  function generateMessage(contact: Contact) {
    const msg: Message = {
      reason: `${contact.role} is closely tied to pipeline, conversion and GTM execution at ${account.name}.`,
      email: `Hi ${contact.name},

Noticed recent activity from ${account.name.toLowerCase()} across pricing and integrations, alongside broader GTM signals.

Teams in a similar position often struggle to turn that intent into focused pipeline action.

SignalOps helps prioritise the right accounts and contacts based on real buying signals.

Worth a quick look?`,
      linkedin: `Hi ${contact.name} — noticed some recent activity from ${account.name} and thought this might be relevant. Curious if pipeline is a focus right now and whether this sits with you?`,
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
      <WorkspaceSourceBanner />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_280px]">
        <div className="space-y-10">
          <div>
            <div className="text-xs uppercase text-gray-500">Summary</div>
            <p className="mt-2 text-base text-gray-900">{account.summary}</p>
          </div>

          <div>
            <div className="text-xs uppercase text-gray-500">Signals</div>
            <ul className="mt-3 space-y-2">
              {account.signals.map((signal) => (
                <li key={signal} className="text-gray-700">
                  {signal}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase text-gray-500">Contacts</div>

            {!contacts ? (
              <div className="mt-4 text-sm text-gray-500">
                No contacts yet. Generate to find the best people to reach.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="rounded-xl border border-gray-200 bg-white p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {contact.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.role} • {contact.email}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {contact.recommended ? (
                          <Badge label="Primary" variant="green" />
                        ) : null}

                        <button
                          onClick={() => generateMessage(contact)}
                          className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50"
                        >
                          Generate message
                        </button>
                      </div>
                    </div>

                    {messages[contact.id] ? (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        <div>
                          <div className="text-xs uppercase text-gray-500">
                            Why this person
                          </div>
                          <p className="mt-1 text-sm text-gray-700">
                            {messages[contact.id].reason}
                          </p>
                        </div>

                        <div>
                          <div className="text-xs uppercase text-gray-500">
                            Email
                          </div>
                          <pre className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                            {messages[contact.id].email}
                          </pre>
                        </div>

                        <div>
                          <div className="text-xs uppercase text-gray-500">
                            LinkedIn
                          </div>
                          <p className="mt-1 text-sm text-gray-900">
                            {messages[contact.id].linkedin}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
              {status === "ready" && <Badge label="Ready" variant="green" />}
              {status === "needs_contacts" && (
                <Badge label="Needs contacts" variant="yellow" />
              )}
              {status === "review" && <Badge label="Review" variant="default" />}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase text-gray-500">Play</div>
            <div className="mt-2">{account.recommendedPlay}</div>
          </div>

          {account.lastTouched ? (
            <div>
              <div className="text-xs uppercase text-gray-500">
                Last touched
              </div>
              <div className="mt-2">{account.lastTouched}</div>
            </div>
          ) : null}
        </div>
      </div>
    </PageContainer>
  );
}
