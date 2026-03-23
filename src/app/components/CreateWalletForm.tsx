"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreateWalletForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState("individual");

  const handleCreate = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      alert("You must be logged in");
      return;
    }

    const { error } = await supabase.from("wallets").insert([
      {
        name: name,
        type: type,
        balance: 0,
        owner_user_id: user.id,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Wallet created!");
    window.location.reload();
  };

  return (
    <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <h3 className="text-xl font-semibold">Create Wallet</h3>

      <input
        type="text"
        placeholder="Wallet name (e.g. YTU Racing)"
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="individual">Individual</option>
        <option value="team">Team</option>
        <option value="sponsor">Sponsor</option>
        <option value="organizer">Organizer</option>
      </select>

      <button
        onClick={handleCreate}
        className="w-full rounded-xl bg-black px-4 py-3 text-white"
      >
        Create Wallet
      </button>
    </div>
  );
}