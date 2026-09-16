"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Users, Home, BedDouble, PawPrint } from "lucide-react";
import { formatPrice } from "@/lib/format";

const PRICE_MIN = 5000;
const PRICE_MAX = 100000;
const PRICE_STEP = 1000;

interface Props {
  type?: string;
  city?: string;
  minGuests?: string;
  minBedrooms?: string;
  maxPrice?: string;
  petFriendly?: string;
  checkIn?: string;
  checkOut?: string;
  sort?: string;
}

export function StayFilters({
  type,
  city,
  minGuests,
  minBedrooms,
  maxPrice,
  petFriendly,
  checkIn,
  checkOut,
  sort,
}: Props) {
  const router = useRouter();

  const [selType, setSelType] = useState(type ?? "");
  const [selCity, setSelCity] = useState(city ?? "");
  const [selGuests, setSelGuests] = useState(minGuests ?? "");
  const [selBedrooms, setSelBedrooms] = useState(minBedrooms ?? "");
  const [selMaxPrice, setSelMaxPrice] = useState(Number(maxPrice) || PRICE_MAX);
  const [selPetFriendly, setSelPetFriendly] = useState(petFriendly === "true");
  const [selCheckIn, setSelCheckIn] = useState(checkIn ?? "");
  const [selCheckOut, setSelCheckOut] = useState(checkOut ?? "");
  const [selSort, setSelSort] = useState(sort ?? "recommended");

  function apply(overrides?: Partial<Record<"sort", string>>) {
    const params = new URLSearchParams();
    if (selType) params.set("type", selType);
    if (selCity) params.set("city", selCity);
    if (selGuests) params.set("minGuests", selGuests);
    if (selBedrooms) params.set("minBedrooms", selBedrooms);
    if (selMaxPrice < PRICE_MAX) params.set("maxPrice", String(selMaxPrice));
    if (selPetFriendly) params.set("petFriendly", "true");
    if (selCheckIn) params.set("checkIn", selCheckIn);
    if (selCheckOut) params.set("checkOut", selCheckOut);
    const nextSort = overrides?.sort ?? selSort;
    if (nextSort && nextSort !== "recommended") params.set("sort", nextSort);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <div className="relative z-30 -mt-14 mx-auto max-w-7xl px-6">
      <div className="space-y-6 rounded-md border border-stone-200/80 bg-shell p-6 shadow-xl md:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-b border-stone-300 pb-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-stone-500">
              Location
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-800">
              <MapPin size={15} className="shrink-0 text-stone-500" />
              <input
                type="text"
                value={selCity}
                onChange={(e) => setSelCity(e.target.value)}
                placeholder="Any city"
                className="w-full bg-transparent text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-b border-stone-300 pb-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-stone-500">
              Check In
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-700">
              <Calendar size={15} className="shrink-0 text-stone-500" />
              <input
                type="date"
                value={selCheckIn}
                onChange={(e) => setSelCheckIn(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-b border-stone-300 pb-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-stone-500">
              Check Out
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-700">
              <Calendar size={15} className="shrink-0 text-stone-500" />
              <input
                type="date"
                value={selCheckOut}
                min={selCheckIn || undefined}
                onChange={(e) => setSelCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-stone-500">
              Guests
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-800">
              <Users size={15} className="shrink-0 text-stone-500" />
              <input
                type="number"
                min={1}
                value={selGuests}
                onChange={(e) => setSelGuests(e.target.value)}
                placeholder="Any number"
                className="w-full bg-transparent text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-stone-200" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-stone-500">
              Property Type
            </span>
            <div className="flex items-center gap-4">
              {[
                { value: "", label: "Any" },
                { value: "villa", label: "Villa" },
                { value: "farmhouse", label: "Farmhouse" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-1.5 text-xs text-stone-700">
                  <input
                    type="radio"
                    name="stay-type"
                    checked={selType === opt.value}
                    onChange={() => setSelType(opt.value)}
                    className="accent-gold"
                  />
                  <Home size={13} className="text-stone-500" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-stone-500">
              Bedrooms
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-800">
              <BedDouble size={15} className="shrink-0 text-stone-500" />
              <select
                value={selBedrooms}
                onChange={(e) => setSelBedrooms(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-800 focus:outline-none"
              >
                <option value="">Any</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>
          </div>

          <div className="flex items-end pb-0.5">
            <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs text-stone-700">
              <input
                type="checkbox"
                checked={selPetFriendly}
                onChange={(e) => setSelPetFriendly(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-stone-300 accent-gold"
              />
              <PawPrint size={15} className="shrink-0 text-stone-500" />
              Pet-friendly
            </label>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-widest text-stone-500">
                Price Range
              </span>
              <span className="text-[11px] text-stone-600">
                {selMaxPrice >= PRICE_MAX ? "Any" : `Up to ${formatPrice(selMaxPrice)}`}
              </span>
            </div>
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={selMaxPrice}
              onChange={(e) => setSelMaxPrice(Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-stone-300 accent-gold"
            />
          </div>
        </div>

        <div className="h-px bg-stone-200" />

        <div className="flex flex-wrap items-center justify-end gap-3">
          <select
            value={selSort}
            onChange={(e) => {
              setSelSort(e.target.value);
              apply({ sort: e.target.value });
            }}
            className="rounded border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 focus:outline-none"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <button
            type="button"
            onClick={() => apply()}
            className="rounded-full bg-[#181113] px-6 py-2 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-[#8c7456]"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => {
              setSelType("");
              setSelCity("");
              setSelGuests("");
              setSelBedrooms("");
              setSelMaxPrice(PRICE_MAX);
              setSelPetFriendly(false);
              setSelCheckIn("");
              setSelCheckOut("");
              setSelSort("recommended");
              router.push("/properties");
            }}
            className="rounded-full border border-stone-300 px-5 py-2 text-xs uppercase tracking-widest text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default StayFilters;
