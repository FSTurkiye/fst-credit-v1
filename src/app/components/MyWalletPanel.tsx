"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import WalletBalance from "./WalletBalance";
import SendCreditForm from "./SendCreditForm";
import RecentTransactions from "./RecentTransactions";
import TotalTransfers from "./TotalTransfers";
import CreateListingForm from "./CreateListingForm";
import MarketplaceListings from "./MarketplaceListings";
import AdminTreasuryPanel from "./AdminTreasuryPanel";


export default function MyWalletPanel() {
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (!user) return;

      const { data: wallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("owner_user_id", user.id)
        .single();

      setWallet(wallet);
    };

    loadData();
  }, []);

  if (!user || !wallet || !wallet.display_name) {
    return null;
  }

const isAdmin = wallet?.role === "admin";
  return (
    <section className="mt-8 space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          My Wallet
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          {wallet.display_name}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <p className="text-sm text-gray-500">Balance</p>
          <WalletBalance />
          <p className="mt-1 text-sm text-gray-500">FST Credit</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <p className="text-sm text-gray-500">Total Transfers</p>
          <TotalTransfers />
          <p className="mt-1 text-sm text-gray-500">Transactions</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h3 className="text-xl font-semibold">Send Credit</h3>
          <p className="mt-2 text-sm text-gray-600">
            Transfer credits to another wallet by using its wallet name.
          </p>
          <SendCreditForm />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h3 className="text-xl font-semibold">Recent Transactions</h3>
          <p className="mt-2 text-sm text-gray-600">
            Review your sent and received credits.
          </p>
          <RecentTransactions />
        </div>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-6">
        <div>
          <p className="text-sm text-gray-500">Marketplace</p>
          <h3 className="mt-2 text-xl font-semibold text-gray-900">
            Offer or Find Services
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Publish services and browse available providers across the network.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-5">
            <CreateListingForm />
          </div>

          <div className="rounded-xl border border-gray-200 p-5">
            <MarketplaceListings />
          </div>
        </div>
      </section>

      <AdminTreasuryPanel isAdmin={isAdmin} />
    </section>
  );
}