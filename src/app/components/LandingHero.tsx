"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthModal from "./AuthModal";

export default function LandingHero() {
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  useEffect(() => {
    const loadSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  setUser(session?.user ?? null);
};

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAuthMode(null);
    window.location.reload();
  };

  return (
    <>
      <section className="flex items-start justify-between gap-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            FST Credits
          </p>

          <h1 className="mt-2 max-w-3xl text-5xl font-bold tracking-tight text-gray-900">
            Global Student Collaboration Credit Network
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            A collaboration-based digital credit network for student teams,
            sponsors, and communities.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3">
          {!user ? (
            <>
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900"
              >
                Log In
              </button>

              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white"
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="min-w-[240px] rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Logged in as
              </p>
              <p className="mt-1 break-all text-sm font-medium text-gray-900">
                {user.email}
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 w-full rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </section>

      {authMode && (
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
      )}
    </>
  );
}