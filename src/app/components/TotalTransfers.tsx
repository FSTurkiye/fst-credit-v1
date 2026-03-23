"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TotalTransfers() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const loadTransfers = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCount(0);
        return;
      }

      const { data: wallet } = await supabase
        .from("wallets")
        .select("id")
        .eq("owner_user_id", user.id)
        .single();

      if (!wallet) {
        setCount(0);
        return;
      }

      const { count, error } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true })
        .or(
          `from_wallet_id.eq.${wallet.id},to_wallet_id.eq.${wallet.id}`
        );

      if (error) {
        setCount(0);
        return;
      }

      setCount(count ?? 0);
    };

    loadTransfers();
  }, []);

  return <h2 className="mt-3 text-3xl font-semibold">{count ?? "..."}</h2>;
}