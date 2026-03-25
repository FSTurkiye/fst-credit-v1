"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthModal from "./AuthModal";

type ModalMode = "login" | "signup" | null;

export default function AuthGate() {
  const [sessionUserEmail, setSessionUserEmail] = useState<string | null>(null);
  const [openMode, setOpenMode] = useState<ModalMode>(null);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSessionUserEmail(session?.user?.email ?? null);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUserEmail(session?.user?.email ?? null);

      if (session?.user) {
        setOpenMode(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSessionUserEmail(null);
    setOpenMode(null);
  };

  if (sessionUserEmail) {
    return (
      <>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Logged in as
          </p>
          <p className="mt-2 break-all text-sm text-gray-900">
            {sessionUserEmail}
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 w-full rounded-xl border border-black px-4 py-3 text-sm font-medium text-black"
          >
            Logout
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setOpenMode("login")}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900"
        >
          Log In
        </button>

        <button
          type="button"
          onClick={() => setOpenMode("signup")}
          className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white"
        >
          Sign Up
        </button>
      </div>

      {openMode && (
        <AuthModal mode={openMode} onClose={() => setOpenMode(null)} />
      )}
    </>
  );
}