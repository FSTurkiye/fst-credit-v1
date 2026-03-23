"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/lib/supabase";

type ActivityPoint = {
  day_label: string;
  total_volume: number;
};

export default function CreditActivityChart() {
  const [data, setData] = useState<ActivityPoint[]>([]);

  useEffect(() => {
    const loadActivity = async () => {
      const { data, error } = await supabase.rpc("get_weekly_credit_activity");

      if (error) {
        console.error(error);
        return;
      }

      setData(data ?? []);
    };

    loadActivity();
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <p className="text-sm text-gray-500">Ecosystem Trend</p>
      <h3 className="mt-2 text-xl font-semibold text-gray-900">
        Weekly Credit Activity
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        Transfer volume across the network over the last 7 days.
      </p>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day_label" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total_volume"
              stroke="#111827"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}