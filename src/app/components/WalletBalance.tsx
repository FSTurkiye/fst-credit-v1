"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WalletBalance() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const loadWallet = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        setBalance(0);
        return;
      }

      const { data: wallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("owner_user_id", user.id)
        .single();

      setBalance(wallet?.balance ?? 0);
    };

    loadWallet();
  }, []);

  return (
    <h2 className="mt-3 text-3xl font-semibold">
      {balance ?? "..."}
    </h2>
  );
}