"use client";

import TreasuryGrantForm from "./TreasuryGrantForm";
import TreasuryTransfersPanel from "./TreasuryTransfersPanel";

export default function AdminTreasuryPanel({
  isAdmin,
}: {
  isAdmin: boolean;
}) {
  if (!isAdmin) return null;

  return (
    <section className="mt-8 space-y-8">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="mb-6">
          <p className="text-sm text-gray-500">Admin Tools</p>
          <h3 className="mt-2 text-xl font-semibold text-gray-900">
            Treasury Controls
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Manage treasury credit distribution across the ecosystem.
          </p>
        </div>

        <TreasuryGrantForm />
      </section>

      <TreasuryTransfersPanel />
    </section>
  );
}