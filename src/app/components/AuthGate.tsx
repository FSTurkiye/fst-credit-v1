"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LoginForm from "./LoginForm";
import CreateWalletForm from "./CreateWalletForm";
import WalletBalance from "./WalletBalance";
import TotalTransfers from "./TotalTransfers";
import SetDisplayNameForm from "./SetDisplayNameForm";

export default function AuthGate() {
  const [user, setUser] = useState<any>(null);
const [wallet, setWallet] = useState<any>(null);
  useEffect(() => {
  const loadUserAndWallet = async () => {
    const { data } = await supabase.auth.getUser();
    const currentUser = data.user;

    setUser(currentUser);

    if (!currentUser) return;

    const { data: walletData } = await supabase
      .from("wallets")
      .select("*")
      .eq("owner_user_id", currentUser.id)
      .single();

    setWallet(walletData);
  };

  loadUserAndWallet();
}, []);

  if (!user) {
  return (
    <section className="mt-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <LoginForm />
      </div>
    </section>
  );
}
if (user && wallet && !wallet.display_name) {
  return (
    <section className="mt-12">
      <SetDisplayNameForm />
    </section>
  );
}
  return (
    <section className="mt-12 flex gap-8">
      <div className="w-1/2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <p className="text-sm text-gray-500">Your Balance</p>
        <WalletBalance />
        <p className="mt-1 text-sm text-gray-500">FST Credits</p>
      </div>

      <div className="w-1/2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <p className="text-sm text-gray-500">Total Transfers</p>
        <TotalTransfers />
        <p className="mt-1 text-sm text-gray-500">Transactions</p>
      </div>
    </section>
  );
}