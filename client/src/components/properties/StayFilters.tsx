"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  BedDouble,
  Calendar,
  Minus,
  PawPrint,
  Plus,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { formatPrice } from "@/lib/format";

const PRICE_MIN = 0;
const PRICE_MAX = 200000;

interface Props {
  search?: string;
  minGuests?: string;
  minBedrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  petFriendly?: string;
  checkIn?: string;
  checkOut?: string;
  sort?: string;
}

/**
 * Small anchored dropdown shared by the Guests, Bedrooms and Price filters so
 * they all look and behave like one consistent "popup" component instead of
 * three different one-off widgets.
 */
function FilterPopover({
  label,
  trigger,
  children,
}: {
  label: string;
  trigger: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={label}
        className={`flex w-full items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs text-stone-700 transition-colors ${
          open ? "border-gold bg-gold/5" : "border-stone-200 bg-white hover:border-stone-300"
        }`}
      >
        {trigger}
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+10px)] z-50 w-72 max-w-[88vw] rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl"
          role="dialog"
          aria-label={label}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/** Shared +/- counter used for both Bedrooms and Guests. 0 renders as "Any". */
function Stepper({
  value,
  onChange,
  min = 0,
  max = 20,
  unitLabel,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  unitLabel: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-stone-700">{value === 0 ? "Any" : `${value}+ ${unitLabel}`}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${unitLabel}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Minus size={14} />
        </button>
        <span className="w-4 text-center text-sm font-medium text-stone-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${unitLabel}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

export function StayFilters({
  search,
  minGuests,
  minBedrooms,
  minPrice,
  maxPrice,
  petFriendly,
  checkIn,
  checkOut,
  sort,
}: Props) {
  const router = useRouter();

  const [selSearch, setSelSearch] = useState(search ?? "");
  const [selGuests, setSelGuests] = useState(Number(minGuests) || 0);
  const [selBedrooms, setSelBedrooms] = useState(Number(minBedrooms) || 0);
  const [selMinPrice, setSelMinPrice] = useState(minPrice ?? "");
  const [selMaxPrice, setSelMaxPrice] = useState(maxPrice ?? "");
  const [priceError, setPriceError] = useState("");
  const [selPetFriendly, setSelPetFriendly] = useState(petFriendly === "true");
  const [selCheckIn, setSelCheckIn] = useState(checkIn ?? "");
  const [selCheckOut, setSelCheckOut] = useState(checkOut ?? "");
  const [selSort, setSelSort] = useState(sort ?? "recommended");

  function validatedPrices(): { min?: number; max?: number; error?: string } {
    const min = selMinPrice.trim() ? Number(selMinPrice) : undefined;
    const max = selMaxPrice.trim() ? Number(selMaxPrice) : undefined;
    if (min !== undefined && Number.isNaN(min)) return { error: "Enter a valid minimum price" };
    if (max !== undefined && Number.isNaN(max)) return { error: "Enter a valid maximum price" };
    if (min !== undefined && max !== undefined && min > max) {
      return { error: "Minimum price can't be more than the maximum" };
    }
    return { min, max };
  }

  function apply(overrides?: Partial<Record<"sort", string>>) {
    const prices = validatedPrices();
    if (prices.error) {
      setPriceError(prices.error);
      return;
    }
    setPriceError("");

    const params = new URLSearchParams();
    if (selSearch.trim()) params.set("search", selSearch.trim());
    if (selGuests > 0) params.set("minGuests", String(selGuests));
    if (selBedrooms > 0) params.set("minBedrooms", String(selBedrooms));
    if (prices.min !== undefined && prices.min > PRICE_MIN) params.set("minPrice", String(prices.min));
    if (prices.max !== undefined && prices.max < PRICE_MAX) params.set("maxPrice", String(prices.max));
    if (selPetFriendly) params.set("petFriendly", "true");
    if (selCheckIn) params.set("checkIn", selCheckIn);
    if (selCheckOut) params.set("checkOut", selCheckOut);
    const nextSort = overrides?.sort ?? selSort;
    if (nextSort && nextSort !== "recommended") params.set("sort", nextSort);
    router.push(`/stays?${params.toString()}`);
  }

  function clearAll() {
    setSelSearch("");
    setSelGuests(0);
    setSelBedrooms(0);
    setSelMinPrice("");
    setSelMaxPrice("");
    setPriceError("");
    setSelPetFriendly(false);
    setSelCheckIn("");
    setSelCheckOut("");
    setSelSort("recommended");
    router.push("/stays");
  }

  const guestsLabel =
    selGuests === 0 ? "Any" : `${selGuests}+ ${selGuests === 1 ? "Guest" : "Guests"}`;
  const bedroomsLabel =
    selBedrooms === 0 ? "Any" : `${selBedrooms}+ ${selBedrooms === 1 ? "Bedroom" : "Bedrooms"}`;
  const priceLabel =
    selMinPrice || selMaxPrice
      ? `${selMinPrice ? formatPrice(Number(selMinPrice)) : "₹0"} – ${
          selMaxPrice ? formatPrice(Number(selMaxPrice)) : "Any"
        }`
      : "Any budget";

  return (
    <div className="relative z-30 -mt-14 mx-auto max-w-7xl px-6">
      <div className="space-y-5 rounded-2xl border border-stone-200/80 bg-shell p-6 shadow-xl md:p-8">
        <p className="flex items-center gap-1.5 text-[11px] font-medium italic tracking-wide text-stone-400">
          <Sparkles size={13} className="text-gold" aria-hidden="true" />
          Weekend mood, slow stay or a lakeside celebration — start here.
        </p>

        {/* ---------------- Search + dates ---------------- */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="flex items-center gap-2.5 rounded-xl border border-stone-200 bg-white px-4 py-3">
            <Search size={16} className="shrink-0 text-stone-400" aria-hidden="true" />
            <input
              type="text"
              value={selSearch}
              onChange={(e) => setSelSearch(e.target.value)}
              placeholder="Search by location or stay name"
              aria-label="Search by location or stay name"
              className="w-full bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
            />
            {selSearch && (
              <button
                type="button"
                onClick={() => setSelSearch("")}
                aria-label="Clear search"
                className="shrink-0 text-stone-300 hover:text-stone-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-stone-200 bg-white px-4 py-3">
            <Calendar size={15} className="shrink-0 text-stone-400" aria-hidden="true" />
            <div className="flex w-full flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-widest text-stone-400">
                Check In
              </span>
              <input
                type="date"
                value={selCheckIn}
                onChange={(e) => setSelCheckIn(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-stone-200 bg-white px-4 py-3">
            <Calendar size={15} className="shrink-0 text-stone-400" aria-hidden="true" />
            <div className="flex w-full flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-widest text-stone-400">
                Check Out
              </span>
              <input
                type="date"
                value={selCheckOut}
                min={selCheckIn || undefined}
                onChange={(e) => setSelCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-stone-200" />

        {/* ---------------- Guests / Bedrooms / Price / Pet-friendly ---------------- */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-auto sm:min-w-[168px]">
            <FilterPopover
              label="Guests"
              trigger={
                <>
                  <Users size={15} className="shrink-0 text-stone-500" />
                  <span className="flex-1 text-left">{guestsLabel}</span>
                </>
              }
            >
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-stone-500">
                Guests
              </p>
              <Stepper value={selGuests} onChange={setSelGuests} unitLabel="Guests" />
            </FilterPopover>
          </div>

          <div className="w-full sm:w-auto sm:min-w-[168px]">
            <FilterPopover
              label="Bedrooms"
              trigger={
                <>
                  <BedDouble size={15} className="shrink-0 text-stone-500" />
                  <span className="flex-1 text-left">{bedroomsLabel}</span>
                </>
              }
            >
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-stone-500">
                Bedrooms
              </p>
              <Stepper value={selBedrooms} onChange={setSelBedrooms} unitLabel="Bedrooms" />
            </FilterPopover>
          </div>

          <div className="w-full sm:w-auto sm:min-w-[196px]">
            <FilterPopover
              label="Price range"
              trigger={
                <>
                  <span className="shrink-0 text-sm font-medium text-stone-500">₹</span>
                  <span className="flex-1 text-left">{priceLabel}</span>
                </>
              }
            >
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-stone-500">
                Price range (per night)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-[10px] text-stone-500">Minimum</span>
                  <div className="flex items-center gap-1 rounded-lg border border-stone-300 px-2.5 py-2">
                    <span className="text-xs text-stone-400">₹</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={selMinPrice}
                      onChange={(e) => setSelMinPrice(e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] text-stone-500">Maximum</span>
                  <div className="flex items-center gap-1 rounded-lg border border-stone-300 px-2.5 py-2">
                    <span className="text-xs text-stone-400">₹</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={selMaxPrice}
                      onChange={(e) => setSelMaxPrice(e.target.value)}
                      placeholder="No limit"
                      className="w-full bg-transparent text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none"
                    />
                  </div>
                </label>
              </div>
              {priceError && <p className="mt-2 text-[11px] text-red-600">{priceError}</p>}
            </FilterPopover>
          </div>

          <label className="flex cursor-pointer select-none items-center gap-2.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-stone-700 transition-colors hover:border-stone-300">
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

        <div className="h-px bg-stone-200" />

        {/* ---------------- Sort + Search/Clear ---------------- */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <select
            value={selSort}
            onChange={(e) => {
              setSelSort(e.target.value);
              apply({ sort: e.target.value });
            }}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs text-stone-800 focus:border-gold focus:outline-none"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <button
            type="button"
            onClick={() => apply()}
            className="flex items-center gap-2 rounded-full bg-[#181113] px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-gold hover:text-ink"
          >
            <Search size={13} /> Search
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="rounded-full border border-stone-300 px-5 py-2.5 text-xs uppercase tracking-widest text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default StayFilters;
