"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AutoCreateWallet() {
  useEffect(() => {
    const ensureWallet = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !user.email) return;

      const { data: existingWallets, error: checkError } = await supabase
        .from("wallets")
        .select("id")
        .eq("owner_user_id", user.id)
        .limit(1);

      if (checkError) return;

      if (!existingWallets || existingWallets.length === 0) {
        await supabase.from("wallets").insert([
          {
            name: user.email,
            type: "individual",
            balance: 0,
            owner_user_id: user.id,
          },
        ]);

        window.location.reload();
      }
    };

    ensureWallet();
  }, []);

  return null;
}