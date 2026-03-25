"use client";

import AuthGate from "@/app/components/AuthGate";

export default function LandingHero() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-4xl">

        <h1 className="text-3xl font-bold">
          Global Student Collaboration Credit Network
        </h1>

        <p className="mt-4 text-gray-600">
          A collaboration-based digital credit network for student teams, sponsors, and communities.
        </p>

        {/* 🔥 TEK AUTH SİSTEMİ */}
        <div className="mt-8">
          <AuthGate />
        </div>

      </div>
    </section>
  );
}