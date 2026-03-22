"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

/* ---------------- TYPES ---------------- */

type Signal = { label: string; value: string };
type ContactScore = "High Intent" | "Warm" | "Monitor";
type Tone = "Direct" | "Consultative" | "Executive";

type Contact = {
  id: string;
  name: string;
  title: string;
  score: ContactScore;
};

type Account = {
  id: string;
  name: string;
  segment: string;
  fitScore: number;
  triggerScore: number;
  whyNow: string;
  signals: Signal[];
  contacts: Contact[];
  sent?: Contact[];
};

type SequenceStep = {
  id: string;
  stepNumber: number;
  label: string;
  subject: string;
  body: string;
};

type SequenceBundle = { steps: SequenceStep[] };

/* ---------------- DATA ---------------- */

const MOCK_ACCOUNTS: Account[] = [
  {
    id: "acc_1",
    name: "RevScale",
    segment: "Pipeline Expansion",
    fitScore: 94,
    triggerScore: 91,
    whyNow: "Hiring across revenue roles suggests pipeline pressure.",
    signals: [
      { label: "Hiring", value: "5 SDRs + 2 AEs" },
      { label: "Intent", value: "Pricing pages" },
      { label: "Funding", value: "Series A" },
      { label: "Tech", value: "HubSpot + SF" },
    ],
    contacts: [
      { id: "c1", name: "Sarah Chen", title: "Head of Sales", score: "High Intent" },
      { id: "c2", name: "Marcus Lee", title: "VP RevOps", score: "High Intent" },
      { id: "c3", name: "Elena Park", title: "Director Growth", score: "Warm" },
    ],
    sent: [],
  },
];

/* ---------------- HELPERS ---------------- */

function cx(...c: any[]) {
  return c.filter(Boolean).join(" ");
}

function scoreStyle(score: ContactScore) {
  if (score === "High Intent") return "bg-[#3157e0] text-white";
  if (score === "Warm") return "bg-[#fff6df] text-[#c97700]";
  return "bg-slate-100 text-slate-500";
}

function buildSequence(account: Account, contact: Contact): SequenceBundle {
  return {
    steps: [
      {
        id: "1",
        stepNumber: 1,
        label: "Initial",
        subject: `Quick question about ${account.name}`,
        body: `Hi ${contact.name.split(" ")[0]},

Noticed signals like ${account.signals[0].value}.

We help teams prioritise contacts faster.

Open to 15 mins this week?

Best,
Stephen`,
      },
      {
        id: "2",
        stepNumber: 2,
        label: "Follow-up",
        subject: `Re: ${account.name}`,
        body: `Quick follow-up here.

Happy to share examples if useful.`,
      },
      {
        id: "3",
        stepNumber: 3,
        label: "Breakup",
        subject: "Closing the loop",
        body: `Final note from me.

If not relevant, no problem at all.`,
      },
    ],
  };
}

/* ---------------- PAGE ---------------- */

export default function Page() {
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [expanded, setExpanded] = useState("acc_1");
  const [selected, setSelected] = useState<string | null>(null);

  const account = useMemo(
    () => accounts.find((a) => a.id === expanded),
    [accounts, expanded]
  );

  useEffect(() => {
    if (!account) return;
    if (!account.contacts.find((c) => c.id === selected)) {
      setSelected(account.contacts[0]?.id ?? null);
    }
  }, [account, selected]);

  function send(contact: Contact) {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === account?.id
          ? {
              ...a,
              contacts: a.contacts.filter((c) => c.id !== contact.id),
              sent: [...(a.sent || []), contact],
            }
          : a
      )
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">

      {/* ACCOUNT */}
      <div className="bg-white border rounded-xl p-4">
        <div className="text-sm text-slate-400 mb-2">Signals</div>

        <div className="grid grid-cols-2 gap-2">
          {account?.signals.map((s) => (
            <div key={s.label} className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-400">{s.label}</div>
              <div className="text-[15px] font-medium">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACTS */}
      <div className="bg-white border rounded-xl p-4">
        <div className="text-sm text-slate-400 mb-2">Best entry points</div>

        {account?.contacts.map((c) => {
          const active = selected === c.id;

          return (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={cx(
                "w-full flex justify-between py-2",
                active && "bg-[#f5f8ff]"
              )}
            >
              <div>
                <div className={cx("font-semibold", active && "text-[#3157e0]")}>
                  {c.name}
                </div>
                <div className="text-sm text-slate-500">{c.title}</div>
              </div>

              <span className={cx("px-2 py-1 text-xs rounded", scoreStyle(c.score))}>
                {c.score}
              </span>
            </button>
          );
        })}
      </div>

      {/* SENT QUEUE */}
      {account?.sent?.length ? (
        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-2">Sent</div>

          {account.sent.map((c) => (
            <div key={c.id} className="text-sm text-slate-600 py-1">
              ✓ {c.name}
            </div>
          ))}
        </div>
      ) : null}

      {/* SEQUENCE */}
      <Sequence
        account={account}
        contact={account?.contacts.find((c) => c.id === selected) || null}
        onSend={send}
      />
    </div>
  );
}

/* ---------------- SEQUENCE ---------------- */

function Sequence({
  account,
  contact,
  onSend,
}: {
  account?: Account;
  contact: Contact | null;
  onSend: (c: Contact) => void;
}) {
  const [sequence, setSequence] = useState<SequenceBundle | null>(null);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    if (!account || !contact) return;
    setSequence(buildSequence(account, contact));
    setIndex(0);
    setStatus("idle");
  }, [account, contact]);

  if (!contact) {
    return (
      <div className="bg-white border rounded-xl p-4 text-sm text-slate-500">
        No contact selected
      </div>
    );
  }

  if (!sequence) return null;

  const step = sequence.steps[index];

  function handleSend() {
    setStatus("sending");

    setTimeout(() => {
      setStatus("sent");
      onSend(contact);
    }, 800);
  }

  return (
    <div className="bg-white border rounded-xl p-4 space-y-3">

      {/* TOP BAR */}
      <div className="flex justify-between">
        <div className="flex gap-3">
          {sequence.steps.map((s, i) => (
            <button key={s.id} onClick={() => setIndex(i)}>
              <span
                className={cx(
                  "px-2 py-1 rounded text-sm",
                  i === index ? "bg-[#3157e0] text-white" : "bg-slate-100"
                )}
              >
                {i + 1}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleSend}
          disabled={status !== "idle"}
          className={cx(
            "px-3 py-1 text-sm rounded",
            status === "idle" && "bg-[#3157e0] text-white",
            status === "sending" && "bg-slate-300",
            status === "sent" && "bg-green-500 text-white"
          )}
        >
          {status === "idle" && "Send"}
          {status === "sending" && "Sending..."}
          {status === "sent" && "Sent ✓"}
        </button>
      </div>

      {/* EMAIL */}
      <div className="border rounded-lg">
        <div className="p-3 border-b font-semibold">{step.subject}</div>
        <div className="p-3 whitespace-pre-wrap text-sm text-slate-700">
          {step.body}
        </div>
      </div>
    </div>
  );
}
