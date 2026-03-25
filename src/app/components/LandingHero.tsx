"use client";

import AuthGate from "@/app/components/AuthGate";

export default function LandingHero() {
  return (
    <div className="px-6 py-6">

      {/* ÜST BAR */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">
          FST CREDITS
        </div>

        {/* 🔥 BUTONLAR BURADA */}
        <AuthGate />
      </div>

      {/* ANA BAŞLIK */}
      <div className="mt-8">
        <h1 className="text-3xl font-bold">
          Global Student Collaboration Credit Network
        </h1>

        <p className="mt-4 text-gray-600">
          A collaboration-based digital credit network for student teams, sponsors, and communities.
        </p>
      </div>

    </div>
  );
}