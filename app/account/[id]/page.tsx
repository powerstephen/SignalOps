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
  const foundAccount = accounts.find((a) => a.id === params.id);

  if (!foundAccount) {
    notFound();
  }

  const account = foundAccount;

  const [contacts, setContacts] = useState<Contact[] | undefined>(account.contacts);
  const [status, setStatus] = useState(account.status);

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
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_260px]">
        <div className="space-y-10">
          <div>
            <h3 className="text-sm font-medium uppercase text-gray-500">
              Summary
            </h3>
            <p className="mt-2 text-base text-gray-900">{account.summary}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase text-gray-500">
              Signals
            </h3>
            <ul className="mt-3 space-y-2">
              {account.signals.map((signal) => (
                <li key={signal} className="text-gray-700">
                  {signal}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase text-gray-500">
              Contacts
            </h3>

            {!contacts ? (
              <div className="mt-4 text-sm text-gray-500">
                No contacts yet. Generate to find the best people to reach.
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Priority</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <tr key={contact.id}>
                        <td className="px-4 py-4">{contact.name}</td>
                        <td className="px-4 py-4 text-gray-600">{contact.role}</td>
                        <td className="px-4 py-4 text-gray-600">{contact.email}</td>
                        <td className="px-4 py-4">
                          {contact.recommended ? (
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

        <div className="space-y-6">
          <div>
            <div className="text-xs uppercase text-gray-500">Score</div>
            <div className="mt-2 text-xl font-semibold text-gray-900">
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
            <div className="mt-2 text-gray-900">{account.recommendedPlay}</div>
          </div>

          {account.lastTouched ? (
            <div>
              <div className="text-xs uppercase text-gray-500">Last touched</div>
              <div className="mt-2 text-gray-900">{account.lastTouched}</div>
            </div>
          ) : null}
        </div>
      </div>
    </PageContainer>
  );
}
