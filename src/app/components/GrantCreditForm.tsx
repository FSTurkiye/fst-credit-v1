"use client";

import { useState } from "react";

export default function GrantCreditForm() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleGrant = async () => {
    if (!recipient || !amount) {
      alert("Recipient and amount are required");
      return;
    }

    const res = await fetch("/api/grant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient_display_name: recipient,
        amount: Number(amount),
        note,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Grant failed");
      return;
    }

    alert("Credit granted!");
    window.location.reload();
  };

  return (
    <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <h3 className="text-xl font-semibold">Grant Credit</h3>

      <input
        type="text"
        placeholder="Recipient wallet name"
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="text"
        placeholder="Note"
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        type="button"
        onClick={handleGrant}
        className="w-full rounded-xl bg-black px-4 py-3 text-white"
      >
        Grant Credit
      </button>
    </div>
  );
}
