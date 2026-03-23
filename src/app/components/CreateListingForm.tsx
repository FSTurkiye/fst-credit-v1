"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ServiceItem = {
  id: string;
  name: string;
  category: string;
  description: string | null;
};

export default function CreateListingForm() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [description, setDescription] = useState("");
  const [creditValue, setCreditValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        setServices(data);
      }
    };

    loadServices();
  }, []);

  const handleCreate = async () => {
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in.");
      return;
    }

    if (!serviceId || !creditValue) {
      setMessage("Service and credit value are required.");
      return;
    }

    const { data: wallet } = await supabase
      .from("wallets")
      .select("display_name")
      .eq("owner_user_id", user.id)
      .single();

    if (!wallet?.display_name) {
      setMessage("Wallet name not found.");
      return;
    }

    const selectedService = services.find((s) => s.id === serviceId);

    if (!selectedService) {
      setMessage("Selected service not found.");
      return;
    }

    const { error } = await supabase.from("marketplace_listings").insert([
      {
        owner_user_id: user.id,
        wallet_name: wallet.display_name,
        service_id: serviceId,
        title: selectedService.name,
        description: description.trim(),
        price: Number(creditValue),
      },
    ]);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Service listing published successfully.");
    setServiceId("");
    setDescription("");
    setCreditValue("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold text-gray-900">
          Publish a Service
        </h4>
      </div>

      <select
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
      >
        <option value="">Select a service</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name} — {service.category}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Describe your offer"
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Credit Value"
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
        value={creditValue}
        onChange={(e) => setCreditValue(e.target.value)}
      />

      <button
        type="button"
        onClick={handleCreate}
        className="w-full rounded-xl bg-black px-4 py-3 text-white"
      >
        Publish Service
      </button>

      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}