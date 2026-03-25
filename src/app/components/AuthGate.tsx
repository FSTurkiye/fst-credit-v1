"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthModal from "./AuthModal";

type ModalMode = "login" | "signup" | null;

export default function AuthGate() {
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [openMode, setOpenMode] = useState<ModalMode>(null);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSessionUserId(session?.user?.id ?? null);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUserId(session?.user?.id ?? null);

      if (session?.user) {
        setOpenMode(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSessionUserId(null);
    setOpenMode(null);
  };

  if (sessionUserId) {
    return (
      <div className="flex flex-col gap-3">
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
        <AuthModal
          mode={openMode}
          onClose={() => setOpenMode(null)}
        />
      )}
    </>
  );
}