"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SetDisplayNameForm() {
  const [displayName, setDisplayName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = async () => {
  setErrorMessage("");
  setSuccessMessage("");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setErrorMessage("You are not logged in.");
    return;
  }

  const handle = displayName.trim().toLowerCase();

  if (!handle) {
    setErrorMessage("Wallet name is required.");
    return;
  }

  const valid = /^[a-z0-9_]+$/.test(handle);

  if (!valid) {
    setErrorMessage(
      "Wallet name can only contain lowercase letters, numbers and underscore (_)."
    );
    return;
  }

  const { error } = await supabase
    .from("wallets")
    .update({ display_name: handle })
    .eq("owner_user_id", user.id);

  if (error) {
    if (error.message.toLowerCase().includes("duplicate")) {
      setErrorMessage("This wallet name is already in use.");
      return;
    }

    setErrorMessage(error.message);
    return;
  }

  setSuccessMessage("Wallet name saved successfully.");

  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

  return (
    <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <h3 className="text-xl font-semibold">Set Wallet Name</h3>

      <input
        type="text"
        placeholder="e.g. YTU Racing"
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />

      <button
        type="button"
        onClick={handleSave}
        className="w-full rounded-xl bg-black px-4 py-3 text-white"
      >
        Save Name
      </button>

      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      {successMessage && (
        <p className="text-sm text-green-600">{successMessage}</p>
      )}
    </div>
  );
}