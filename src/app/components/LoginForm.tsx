"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginForm({
  mode = "login",
}: {
  mode?: "login" | "signup";
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      const { data: existingWallets, error: walletCheckError } = await supabase
        .from("wallets")
        .select("id")
        .eq("owner_user_id", user.id)
        .limit(1);

      if (walletCheckError) {
        setErrorMessage("Could not check wallet.");
        return;
      }

      if (!existingWallets || existingWallets.length === 0) {
        const { error: createWalletError } = await supabase.from("wallets").insert([
          {
            name: email,
            type: "individual",
            balance: 0,
            owner_user_id: user.id,
          },
        ]);

        if (createWalletError) {
          setErrorMessage("Could not create wallet.");
          return;
        }
      }
    }

    window.location.reload();
  };

  const handleSignup = async () => {
  setErrorMessage("");

  if (!email || !password) {
    setErrorMessage("Email and password required");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      setErrorMessage("This email is already registered. Please log in.");
      return;
    }

    setErrorMessage(error.message);
    return;
  }

  // Supabase bazen mevcut kullanıcı için gerçek hata yerine obfuscated/fake user dönebilir
  const identities = data?.user?.identities ?? [];

  if (identities.length === 0) {
    setErrorMessage("This email is already registered. Please log in.");
    return;
  }
await fetch("/api/notify-signup", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email }),
});
  setSignupSuccess(true);
};
  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {mode === "login" && (
        <button
          type="button"
          onClick={handleLogin}
          className="w-full rounded-xl bg-black px-4 py-3 text-white"
        >
          Log In
        </button>
      )}

      {mode === "signup" && (
        <button
          type="button"
          onClick={handleSignup}
          className="w-full rounded-xl bg-black px-4 py-3 text-white"
        >
          Sign Up
        </button>
      )}

      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}