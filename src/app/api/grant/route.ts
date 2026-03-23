import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { recipient_display_name, amount, note } = body;

  if (!recipient_display_name || !amount) {
    return NextResponse.json(
      { error: "Recipient and amount are required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.rpc("grant_credit_from_treasury", {
    recipient_display_name,
    grant_amount: Number(amount),
    grant_note: note || "Treasury grant",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
