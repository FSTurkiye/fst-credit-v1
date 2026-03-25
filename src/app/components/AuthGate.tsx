"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthModal from "./AuthModal";

type ModalMode = "login" | "signup" | null;

export default function AuthGate() {
  const [sessionUserEmail, setSessionUserEmail] = useState<string | null>(null);
  const [openMode, setOpenMode] = useState<ModalMode>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSessionUserEmail(session?.user?.email ?? null);
      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUserEmail(session?.user?.email ?? null);
      setOpenMode(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSessionUserEmail(null);
  };

  if (loading) return null;

  if (sessionUserEmail) {
    return (
      <div className="rounded-2xl border p-4">
        <p className="text-sm">{sessionUserEmail}</p>
        <button onClick={handleLogout} className="mt-2 border px-3 py-1">
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2">
        <button onClick={() => setOpenMode("login")}>Log In</button>
        <button onClick={() => setOpenMode("signup")}>Sign Up</button>
      </div>

      {openMode && (
        <AuthModal mode={openMode} onClose={() => setOpenMode(null)} />
      )}
    </>
  );
}