"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type TransactionItem = {
  id: string;
  amount: number;
  note: string | null;
  created_at: string;
  from_display_name: string;
  to_display_name: string;
};

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [myDisplayName, setMyDisplayName] = useState("");
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");

  useEffect(() => {
    const loadTransactions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: wallet } = await supabase
        .from("wallets")
        .select("display_name")
        .eq("owner_user_id", user.id)
        .single();

      const myName = wallet?.display_name ?? "";
      setMyDisplayName(myName);

      const { data, error } = await supabase.rpc("get_my_transactions");

      if (error) {
        console.error(error);
        return;
      }

      setTransactions(data ?? []);
    };

    loadTransactions();
  }, []);

  const filtered = transactions.filter((tx) => {
    const outgoing = tx.from_display_name === myDisplayName;

    if (filter === "sent") return outgoing;
    if (filter === "received") return !outgoing;

    return true;
  });

  if (transactions.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
        No transactions yet.
      </div>
    );
  }

  return (
    <>
      {/* FILTER */}
      <div className="mt-4 flex gap-4 text-sm">
        <button
          onClick={() => setFilter("all")}
          className={`font-medium ${
            filter === "all" ? "text-black" : "text-gray-400"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("sent")}
          className={`font-medium ${
            filter === "sent" ? "text-black" : "text-gray-400"
          }`}
        >
          Sent
        </button>

        <button
          onClick={() => setFilter("received")}
          className={`font-medium ${
            filter === "received" ? "text-black" : "text-gray-400"
          }`}
        >
          Received
        </button>
      </div>

      {/* LIST */}
      <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
        {filtered.map((tx) => {
          const isOutgoing = tx.from_display_name === myDisplayName;

          return (
            <div
              key={tx.id}
              className="mb-4 border-b pb-2 last:mb-0 last:border-b-0"
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="font-medium text-gray-800">
                  {tx.from_display_name} → {tx.to_display_name}
                </p>

                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    isOutgoing
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {isOutgoing ? "Sent" : "Received"}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                {tx.amount} Credit – {tx.note || "No note"}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}