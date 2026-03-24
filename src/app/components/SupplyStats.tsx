"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SupplyStats() {
  const [treasuryBalance, setTreasuryBalance] = useState<number | null>(null);
  const [circulatingSupply, setCirculatingSupply] = useState<number | null>(null);
const [ecosystemValue, setEcosystemValue] = useState<number | null>(null);

  const TOTAL_SUPPLY = 1000000;
const INITIAL_REFERENCE_VALUE = 0.01;

  useEffect(() => {
    const loadStats = async () => {
      const { data: treasuryWallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("display_name", "fst_treasury")
        .single();

      const treasury = treasuryWallet?.balance ?? 0;
      setTreasuryBalance(treasury);
      setCirculatingSupply(TOTAL_SUPPLY - treasury);
      const ecosystemValue = (TOTAL_SUPPLY - treasury) * INITIAL_REFERENCE_VALUE;

    };

    loadStats();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <p className="text-sm text-gray-500">Total Supply</p>
        <h2 className="mt-3 text-3xl font-semibold">{TOTAL_SUPPLY}</h2>
        <p className="mt-1 text-sm text-gray-500">FST Credits</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <p className="text-sm text-gray-500">Treasury Balance</p>
        <h2 className="mt-3 text-3xl font-semibold">
          {treasuryBalance ?? "..."}
        </h2>
        <p className="mt-1 text-sm text-gray-500">FST Credits</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <p className="text-sm text-gray-500">Circulating Supply</p>
        <h2 className="mt-3 text-3xl font-semibold">
          {circulatingSupply ?? "..."}
        </h2>
        <p className="mt-1 text-sm text-gray-500">FST Credits</p>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
  <p className="text-sm text-gray-500">Initial Reference Value</p>
  <h2 className="mt-3 text-3xl font-semibold">${INITIAL_REFERENCE_VALUE}</h2>
  <p className="mt-1 text-sm text-gray-500">Per FST Credits</p>
</div>
<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
  <p className="text-sm text-gray-500">Estimated Ecosystem Value</p>
  <h2 className="mt-3 text-3xl font-semibold">
  {ecosystemValue ?? "..."}
</h2>

  <p className="mt-1 text-sm text-gray-500">Launch reference basis</p>
</div>


    </div>
  );
}
