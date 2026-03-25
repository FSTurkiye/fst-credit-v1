"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Wallet = {
  id: string;
  display_name: string | null;
};

export default function LoginForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");

  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletName, setWalletName] = useState("");
  const [needsWalletSetup, setNeedsWalletSetup] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSessionAndWallet = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user ?? null;

      if (!user) {
        setSessionUserId(null);
        setWallet(null);
        setNeedsWalletSetup(false);
        return;
      }

      setSessionUserId(user.id);

      const { data: existingWallet } = await supabase
        .from("wallets")
        .select("id, display_name")
        .eq("owner_user_id", user.id)
        .maybeSingle();

      if (existingWallet) {
        setWallet(existingWallet);
        setNeedsWalletSetup(false);
      } else {
        setWallet(null);
        setNeedsWalletSetup(true);
      }
    };

    checkSessionAndWallet();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;

      if (!user) {
        setSessionUserId(null);
        setWallet(null);
        setNeedsWalletSetup(false);
        return;
      }

      setSessionUserId(user.id);

      const { data: existingWallet } = await supabase
        .from("wallets")
        .select("id, display_name")
        .eq("owner_user_id", user.id)
        .maybeSingle();

      if (existingWallet) {
        setWallet(existingWallet);
        setNeedsWalletSetup(false);
      } else {
        setWallet(null);
        setNeedsWalletSetup(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(
        "No account found with these details. Please sign up first."
      );
      return;
    }

    setSuccessMessage("Logged in successfully.");
  };

  const handleSignup = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanConfirmEmail = confirmEmail.trim().toLowerCase();

    if (!cleanEmail || !cleanConfirmEmail || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (cleanEmail !== cleanConfirmEmail) {
      setErrorMessage("Email addresses do not match.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
    });

    setIsLoading(false);

    if (error) {
      const msg = error.message.toLowerCase();

      if (
        msg.includes("already registered") ||
        msg.includes("already exists") ||
        msg.includes("user already registered")
      ) {
        setErrorMessage("This email is already registered. Please log in.");
        return;
      }

      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage("You have signed up. Now you can log in and create your wallet.");
    setEmail("");
    setConfirmEmail("");
    setPassword("");
  };

  const handleCreateWallet = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!sessionUserId) {
      setErrorMessage("Please log in first.");
      return;
    }

    const cleanWalletName = walletName.trim();

    if (!cleanWalletName) {
      setErrorMessage("Please enter a wallet name.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("wallets").insert({
      owner_user_id: sessionUserId,
      name: cleanWalletName,
      display_name: cleanWalletName,
      type: "individual",
      balance: 0,
    });

    setIsLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("duplicate")) {
        setErrorMessage("This wallet name is already taken. Please choose another one.");
        return;
      }

      setErrorMessage(error.message);
      return;
    }

    const { data: newWallet } = await supabase
      .from("wallets")
      .select("id, display_name")
      .eq("owner_user_id", sessionUserId)
      .maybeSingle();

    if (newWallet) {
      setWallet(newWallet);
      setNeedsWalletSetup(false);
    }

    setSuccessMessage("Your wallet has been created successfully.");
    setWalletName("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSessionUserId(null);
    setWallet(null);
    setNeedsWalletSetup(false);
    setWalletName("");
    setEmail("");
    setConfirmEmail("");
    setPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  if (sessionUserId && needsWalletSetup) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Create Your Wallet
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Choose a wallet name to continue.
          </p>
        </div>

        <input
          type="text"
          placeholder="Wallet name"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
        />

        {errorMessage ? (
          <p className="text-sm text-red-600">{errorMessage}</p>
        ) : null}

        {successMessage ? (
          <p className="text-sm text-green-600">{successMessage}</p>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleCreateWallet}
            disabled={isLoading}
            className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {isLoading ? "Please wait..." : "Create Wallet"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-black px-4 py-3 text-sm font-medium text-black"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  if (sessionUserId && wallet?.display_name) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Wallet Ready</h3>
          <p className="mt-1 text-sm text-gray-600">
            Your wallet is ready to use.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Wallet Name</p>
          <p className="mt-1 text-base font-semibold text-gray-900">
            {wallet.display_name}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-black px-4 py-3 text-sm font-medium text-black"
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
        />

        {mode === "signup" && (
          <input
            type="email"
            placeholder="Confirm email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}

      {successMessage ? (
        <p className="text-sm text-green-600">{successMessage}</p>
      ) : null}

      {mode === "login" ? (
        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {isLoading ? "Please wait..." : "Log In"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSignup}
          disabled={isLoading}
          className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {isLoading ? "Please wait..." : "Sign Up"}
        </button>
      )}
    </div>
  );
}