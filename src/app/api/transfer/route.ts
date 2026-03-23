import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { from, to, amount, note } = body;

  if (!from || !to || !amount) {
    return NextResponse.json(
      { error: "Missing transfer data" },
      { status: 400 }
    );
  }

  // sender wallet
  const { data: sender } = await supabase
    .from("wallets")
    .select("*")
    .eq("name", from)
    .single();

  // receiver wallet
  const { data: receiver } = await supabase
    .from("wallets")
    .select("*")
    .eq("name", to)
    .single();

  if (!sender || !receiver) {
    return NextResponse.json(
      { error: "Wallet not found" },
      { status: 404 }
    );
  }

  if (sender.balance < amount) {
    return NextResponse.json(
      { error: "Insufficient balance" },
      { status: 400 }
    );
  }

  // update sender
  await supabase
    .from("wallets")
    .update({ balance: sender.balance - amount })
    .eq("id", sender.id);

  // update receiver
  await supabase
    .from("wallets")
    .update({ balance: receiver.balance + amount })
    .eq("id", receiver.id);

  // save transaction
  await supabase.from("transactions").insert([
    {
      from,
      to,
      amount,
      note,
    },
  ]);

  return NextResponse.json({ success: true });
}