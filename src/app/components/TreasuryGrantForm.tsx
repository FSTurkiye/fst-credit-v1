"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TreasuryGrantForm() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [sending, setSending] = useState(false);

  const handleGrant = async () => {
    if (sending) return;

    setSending(true);
    setMessage("");
    setSuccess(null);

    const amt = Number(amount);

    if (!recipient || !amt) {
      setMessage("Recipient and amount required.");
      setSuccess(false);
      setSending(false);
      return;
    }

    const { error } = await supabase.rpc("grant_credit_from_treasury", {
      recipient_display_name: recipient,
      grant_amount: amt,
      grant_note: reason ? `Treasury Grant – ${reason}` : "Treasury Grant",
    });

    if (error) {
      setMessage(error.message);
      setSuccess(false);
      setSending(false);
      return;
    }

    setMessage(`✅ ${amt} credits granted to ${recipient}`);
    setSuccess(true);

    setRecipient("");
    setAmount("");
    setReason("");
    setSending(false);

    // 2 saniye sonra sayfayı yenile
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Recipient wallet"
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      <input
        type="number"
        placeholder="Credit amount"
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="text"
        placeholder="Reason"
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <button
        type="button"
        onClick={handleGrant}
        disabled={sending}
        className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-50"
      >
        {sending ? "Granting..." : "Grant Credit"}
      </button>

      {message && (
        <p
          className={`text-sm ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}