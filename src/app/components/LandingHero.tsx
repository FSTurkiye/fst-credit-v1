"use client";

import AuthGate from "@/app/components/AuthGate";

export default function LandingHero() {
  return (
    <section className="px-6 py-6">
      {/* ÜST BAR (ESKİ HAL) */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">
          FST CREDITS
        </div>

        {/* 🔥 SAĞ ÜST BUTONLAR */}
        <AuthGate />
      </div>

      {/* İÇERİK */}
      <div className="mt-8 max-w-4xl">
        <h1 className="text-3xl font-bold">
          Global Student Collaboration Credit Network
        </h1>

        <p className="mt-4 text-gray-600">
          A collaboration-based digital credit network for student teams, sponsors, and communities.
        </p>
      </div>
    </section>
  );
}