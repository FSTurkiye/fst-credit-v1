"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthStatus() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>{user.email}</span>
      <button
        onClick={handleLogout}
        className="rounded-lg bg-gray-200 px-3 py-1 text-xs hover:bg-gray-300"
      >
        Logout
      </button>
    </div>
  );
}