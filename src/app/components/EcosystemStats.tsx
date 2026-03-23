"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EcosystemStats() {
  const [walletCount, setWalletCount] = useState<number | null>(null);
  const [transferCount, setTransferCount] = useState<number | null>(null);
  const [treasuryBalance, setTreasuryBalance] = useState<number | null>(null);
  const [circulatingSupply, setCirculatingSupply] = useState<number | null>(null);

  const TOTAL_SUPPLY = 1000000;

  useEffect(() => {
    const loadStats = async () => {
      const { count: walletsTotal } = await supabase
        .from("wallets")
        .select("*", { count: "exact", head: true });

      const { count: transfersTotal } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true });

      const { data: treasuryWallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("display_name", "fst_treasury")
        .single();

      const treasury = treasuryWallet?.balance ?? 0;

      setWalletCount(walletsTotal ?? 0);
      setTransferCount(transfersTotal ?? 0);
      setTreasuryBalance(treasury);
      setCirculatingSupply(TOTAL_SUPPLY - treasury);
    };

    loadStats();
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <p className="text-sm text-gray-500">Ecosystem Stats</p>
      <h3 className="mt-2 text-xl font-semibold text-gray-900">
        Network Overview
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        A simple snapshot of activity and circulation across the credit network.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Active Wallets</p>
          <h4 className="mt-1 text-2xl font-semibold">{walletCount ?? "..."}</h4>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Transfers</p>
          <h4 className="mt-1 text-2xl font-semibold">{transferCount ?? "..."}</h4>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Treasury Balance</p>
          <h4 className="mt-1 text-2xl font-semibold">{treasuryBalance ?? "..."}</h4>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Circulating Supply</p>
          <h4 className="mt-1 text-2xl font-semibold">{circulatingSupply ?? "..."}</h4>
        </div>
      </div>
    </div>
  );
}