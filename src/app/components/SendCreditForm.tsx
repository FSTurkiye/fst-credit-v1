"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SendCreditForm() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [listingId, setListingId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fillFromMarketplace = () => {
      const stored = localStorage.getItem("fst_transfer_prefill");
      if (!stored) return;

      try {
        const data = JSON.parse(stored);

        if (data.recipient) setRecipient(data.recipient);
        if (data.amount) setAmount(String(data.amount));
        if (data.note) setNote(data.note);
        if (data.listingId) setListingId(data.listingId);
      } catch {
        return;
      }

      localStorage.removeItem("fst_transfer_prefill");
    };

    fillFromMarketplace();

    window.addEventListener("fst-prefill-transfer", fillFromMarketplace);

    return () => {
      window.removeEventListener("fst-prefill-transfer", fillFromMarketplace);
    };
  }, []);

  const handleSend = async () => {
    if (sending) return;
setSending(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Not logged in");
      return;
    }

    const amt = Number(amount);

    if (!recipient || !amt) {
      alert("Recipient and amount required");
      return;
    }

    const { data: senderWallet } = await supabase
      .from("wallets")
      .select("id, display_name")
      .eq("owner_user_id", user.id)
      .single();

    if (!senderWallet) {
      alert("Sender wallet not found");
      return;
    }

    const { error } = await supabase.rpc("transfer_credit", {
      sender_wallet_id: senderWallet.id,
      recipient_display_name: recipient,
      transfer_amount: amt,
      transfer_note: note,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (listingId) {
      const { error: orderError } = await supabase
        .from("marketplace_orders")
        .insert([
          {
            listing_id: listingId,
            buyer_user_id: user.id,
            buyer_wallet_name: senderWallet.display_name,
            seller_wallet_name: recipient,
            credit_value: amt,
            transfer_note: note,
          },
        ]);

      if (orderError) {
        alert("Transfer completed, but marketplace order record failed.");
        window.location.reload();
        return;
      }
    }

    alert("Credit sent!");
    window.location.reload();
  };

  return (
    <div id="send-credit-section" className="mt-6 space-y-4">
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
  onClick={handleSend}
  disabled={sending}
  className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-50"
>
  {sending ? "Sending..." : "Send Credit"}
</button>
    </div>
  );
}