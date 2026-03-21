"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import PageContainer from "@/components/page-container";
import { accounts, Contact } from "@/lib/accounts";

type Props = {
  params: { id: string };
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
  const baseAccount = accounts.find((a) => a.id === params.id);

  if (!baseAccount) notFound();

  const [contacts, setContacts] = useState<Contact[] | undefined>(
    baseAccount.contacts
  );

  const [status, setStatus] = useState(baseAccount.status);

  function generateContacts() {
    const mock: Contact[] = [
      {
        id: "1",
        name: "Head of Sales",
        role: "Head of Sales",
        seniority: "high",
        email: "sales@" + baseAccount.id + ".com",
        recommended: true,
      },
      {
        id: "2",
        name: "RevOps Manager",
        role: "Revenue Operations Manager",
        seniority: "mid",
        email: "revops@" + baseAccount.id + ".com",
        recommended: false,
      },
    ];

    setContacts(mock);
    setStatus("ready");
  }

  return (
    <PageContainer
      title={baseAccount.name}
      subtitle={baseAccount.whyNow}
      action={
        <button
          onClick={generateContacts}
          className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white"
        >
          Generate contacts
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_260px]">
        
        {/* LEFT */}
        <div className="space-y-10">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">
              Summary
            </h3>
            <p className="mt-2 text-base text-gray-900">
              {baseAccount.summary}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">
              Signals
            </h3>
            <ul className="mt-3 space-y-2">
              {baseAccount.signals.map((s) => (
                <li key={s} className="text-gray-700">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACTS */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">
              Contacts
            </h3>

            {!contacts ? (
              <div className="mt-4 text-sm text-gray-500">
                No contacts yet. Generate to find the best people to reach.
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Role</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Priority</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {contacts.map((c) => (
                      <tr key={c.id}>
                        <td className="px-4 py-4">{c.name}</td>
                        <td className="px-4 py-4 text-gray-600">{c.role}</td>
                        <td className="px-4 py-4 text-gray-600">{c.email}</td>
                        <td className="px-4 py-4">
                          {c.recommended ? (
                            <Badge label="Primary" variant="green" />
                          ) : (
                            <Badge label="Secondary" variant="default" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div>
            <div className="text-xs text-gray-500 uppercase">Score</div>
            <div className="mt-2 text-xl font-semibold">
              {baseAccount.score}/100
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase">Status</div>
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
            <div className="text-xs text-gray-500 uppercase">Play</div>
            <div className="mt-2 text-gray-900">
              {baseAccount.recommendedPlay}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
