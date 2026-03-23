
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

type TreasuryTransfer = {
  id: string;
  amount: number;
  note: string | null;
  created_at: string;
  from_display_name: string;
  to_display_name: string;
};

export default function TreasuryTransfersPanel() {
  const [transfers, setTransfers] = useState<TreasuryTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const loadTransfers = async () => {
      const { data, error } = await supabase.rpc("get_treasury_transfers");

      if (!error && data) {
        setTransfers(data);
      }

      setLoading(false);
    };

    loadTransfers();
  }, []);

  const filteredTransfers = useMemo(() => {
    return transfers.filter((tx) => {
      const txDate = tx.created_at.slice(0, 10);

      if (dateFrom && txDate < dateFrom) return false;
      if (dateTo && txDate > dateTo) return false;

      return true;
    });
  }, [transfers, dateFrom, dateTo]);

  const exportToExcel = () => {
    const rows = filteredTransfers.map((tx) => ({
      Date: new Date(tx.created_at).toLocaleString(),
      From: tx.from_display_name,
      To: tx.to_display_name,
      Amount: tx.amount,
      Note: tx.note || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Treasury Transfers");
    XLSX.writeFile(workbook, "treasury-transfers.xlsx");
  };

  if (loading) {
    return (
      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <p className="text-sm text-gray-500">Treasury Transfers</p>
        <p className="mt-4 text-sm text-gray-600">Loading treasury transfers...</p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Treasury Transfers</p>
        <h3 className="mt-2 text-xl font-semibold text-gray-900">
          Treasury Distribution History
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Filter treasury transfers by date and export them to Excel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <input
          type="date"
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />

        <input
          type="date"
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />

        <button
          type="button"
          onClick={exportToExcel}
          className="w-full rounded-xl bg-black px-4 py-3 text-white"
        >
          Export to Excel
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {filteredTransfers.length === 0 ? (
          <p className="text-sm text-gray-600">No treasury transfers found.</p>
        ) : (
          filteredTransfers.map((tx) => (
            <div
              key={tx.id}
              className="rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {tx.from_display_name} → {tx.to_display_name}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {tx.note || "No note"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {tx.amount} credits
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}