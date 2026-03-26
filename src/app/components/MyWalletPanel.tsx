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
  const [walletName, setWalletName] = useState("");
  const [walletError, setWalletError] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async (sessionUser?: any) => {
      const currentUser =
  sessionUser ??
  (await supabase.auth.getSession()).data.session?.user ??
  null;

      setUser(currentUser ?? null);

      if (!currentUser) {
        setWallet(null);
        setLoading(false);
        return;
      }

      const { data: existingWallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("owner_user_id", currentUser.id)
        .maybeSingle();

      setWallet(existingWallet ?? null);
      setLoading(false);
    };

    loadData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      await loadData(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCreateWallet = async () => {
    if (!user) return;

    const cleanName = walletName.trim();

    if (!cleanName) {
      setWalletError("Please enter a wallet name.");
      return;
    }

    setWalletError("");
    setWalletLoading(true);

    const { error } = await supabase.from("wallets").upsert(
      {
        owner_user_id: user.id,
        name: cleanName,
        display_name: cleanName,
        type: "individual",
        balance: 0,
      },
      { onConflict: "owner_user_id" }
    );

    setWalletLoading(false);

    if (error) {
      setWalletError(error.message);
      return;
    }

    const { data: newWallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("owner_user_id", user.id)
      .maybeSingle();

    setWallet(newWallet ?? null);
    setWalletName("");
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (!wallet || !wallet.display_name) {
    return (
      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Wallet Setup</p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            Create Your Wallet
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your account is ready. Please choose a wallet name to continue.
          </p>
        </div>

        <input
          type="text"
          placeholder="Wallet name"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />

        {walletError ? (
          <p className="text-sm text-red-600">{walletError}</p>
        ) : null}

        <button
          type="button"
          onClick={handleCreateWallet}
          disabled={walletLoading}
          className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {walletLoading ? "Please wait..." : "Create Wallet"}
        </button>
      </section>
    );
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
          <p className="mt-1 text-sm text-gray-500">FST Credits</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <p className="text-sm text-gray-500">Total Transfers</p>
          <TotalTransfers />
          <p className="mt-1 text-sm text-gray-500">Transactions</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h3 className="text-xl font-semibold">Send Credits</h3>
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