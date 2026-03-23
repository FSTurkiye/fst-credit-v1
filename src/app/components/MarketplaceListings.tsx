"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Listing = {
  id: string;
  wallet_name: string;
  title: string;
  description: string;
  price: number;
  created_at: string;
  service_id: string | null;
};

type ServiceItem = {
  id: string;
  name: string;
  category: string;
  description: string | null;
};

export default function MarketplaceListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: listingsData } = await supabase
        .from("marketplace_listings")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .order("name", { ascending: true });

      setListings(listingsData ?? []);
      setServices(servicesData ?? []);
      setLoading(false);
    };

    loadData();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(services.map((s) => s.category))).sort();
  }, [services]);

  const filteredServices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return services.filter((service) => {
      if (selectedCategory && service.category !== selectedCategory) {
        return false;
      }

      if (!term) return true;

      const haystack = [
        service.name,
        service.category,
        service.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [services, selectedCategory, searchTerm]);

  const selectedService =
    services.find((service) => service.id === selectedServiceId) ?? null;

  const selectedServiceListings = useMemo(() => {
    if (!selectedServiceId) return [];
    return listings.filter((listing) => listing.service_id === selectedServiceId);
  }, [listings, selectedServiceId]);

  const handlePurchase = async (listing: Listing) => {
    if (purchasingId) return;

    setPurchasingId(listing.id);
    setMessage("");
    setSuccess(null);

    const confirmed = window.confirm(
      `Use service?\n\nService: ${listing.title}\nProvider: ${listing.wallet_name}\nCredit Value: ${listing.price}`
    );

    if (!confirmed) {
      setPurchasingId(null);
      return;
    }

    const { error } = await supabase.rpc("purchase_marketplace_listing", {
      listing_uuid: listing.id,
    });

    if (error) {
      setMessage(error.message);
      setSuccess(false);
      setPurchasingId(null);
      return;
    }

    setMessage(`Service purchased successfully from ${listing.wallet_name}.`);
    setSuccess(true);
    setPurchasingId(null);

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Service Library</h4>
        <p className="text-sm text-gray-600">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900">Service Library</h4>
        <p className="mt-1 text-sm text-gray-600">
          Search services first, then choose a provider.
        </p>
      </div>

      {message && (
        <p className={`text-sm ${success ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search services"
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedServiceId(null);
            }}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div className="space-y-3">
            {filteredServices.length === 0 ? (
              <p className="text-sm text-gray-600">No services found.</p>
            ) : (
              filteredServices.map((service) => {
                const providerCount = listings.filter(
                  (listing) => listing.service_id === service.id
                ).length;

                const isSelected = selectedServiceId === service.id;

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {service.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {service.category}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500">Providers</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {providerCount}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-4">
          {!selectedService ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-900">
                Select a service
              </p>
              <p className="text-sm text-gray-600">
                Choose a service from the library to see available providers.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedService.name}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {selectedService.category}
                </p>

                {selectedService.description && (
                  <p className="mt-3 text-sm text-gray-600">
                    {selectedService.description}
                  </p>
                )}
              </div>

              {selectedServiceListings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-4">
                  <p className="text-sm text-gray-600">
                    No provider has published this service yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedServiceListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="rounded-2xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {listing.wallet_name}
                          </p>

                          {listing.description && (
                            <p className="mt-2 text-sm text-gray-600">
                              {listing.description}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-xs text-gray-500">Credit Value</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {listing.price}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePurchase(listing)}
                        disabled={purchasingId === listing.id}
                        className="mt-4 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                      >
                        {purchasingId === listing.id ? "Processing..." : "Use Service"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}