import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { EVENT_SERVICES, STAY_SERVICES, type ServiceItem } from "@/lib/services";
import { getServices } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { ICONS } from "@/components/properties/amenityIcons";
import type { IconKey } from "@/lib/addOnServices";
import type { Service } from "@/lib/types";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Stay services and event services at Stayuga farmhouses — dining, wellness, décor, catering and full event management, arranged by one team.",
};

function priceLabel(service: ServiceItem) {
  if (service.priceFrom === null) return "Included";
  return `From ${formatPrice(service.priceFrom)}${service.unit ? ` ${service.unit}` : ""}`;
}

/** Maps an admin-managed API record onto the same shape the page already renders. */
function toServiceItem(service: Service): ServiceItem {
  return {
    title: service.title,
    desc: service.desc,
    // Falls back to a neutral icon if an admin picks a key that isn't in the
    // shared map yet — never lets a bad icon key break the page.
    icon: ICONS[service.icon as IconKey] ?? Sparkles,
    category: service.category,
    priceFrom: service.priceFrom,
    unit: service.unit,
    image: service.image,
    promoText: service.promoText,
    comingSoon: service.comingSoon,
  };
}

function ServiceGrid({ items }: { items: ServiceItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {items.map((service) => (
        <article
          key={service.title}
          className="group flex flex-col overflow-hidden border border-line bg-shell transition-shadow hover:shadow-lg sm:flex-row"
        >
          <div className="relative h-44 shrink-0 sm:h-auto sm:w-2/5">
            <Image
              src={service.image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 20vw"
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                service.comingSoon ? "blur-[3px] scale-105" : ""
              }`}
            />
            {service.comingSoon && (
              <>
                <div className="absolute inset-0 bg-ink/15" aria-hidden="true" />
                <span className="absolute left-0 top-4 bg-ink px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-light shadow-md">
                  Coming Soon
                </span>
              </>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              <service.icon
                size={20}
                strokeWidth={1.4}
                className="mb-3 text-gold"
                aria-hidden="true"
              />
              <h3 className="font-display mb-2 text-xl font-normal text-ink">{service.title}</h3>
              <p className="text-sm font-light leading-relaxed text-ink-soft">{service.desc}</p>
              {service.promoText && (
                <p className="mt-2 text-xs font-medium italic leading-relaxed text-gold">
                  {service.promoText}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
              <span className="text-xs font-medium tracking-wide text-gold">
                {priceLabel(service)}
              </span>
              {service.comingSoon ? (
                <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-soft/60">
                  Not yet available
                </span>
              ) : (
                <Link
                  href="/stays"
                  className="link-inline text-[11px] font-semibold uppercase tracking-widest text-ink transition-colors hover:text-gold"
                >
                  Enquire &rarr;
                </Link>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default async function ServicesPage() {
  const apiServices = await getServices().catch(() => []);

  // Prefer the admin-managed catalogue; only fall back to the static list
  // (kept in lib/services.ts) if the API hasn't been seeded yet or is briefly
  // unreachable, so the page is never empty.
  const stayServices =
    apiServices.length > 0
      ? apiServices.filter((s) => s.category === "stay").map(toServiceItem)
      : STAY_SERVICES;
  const eventServices =
    apiServices.length > 0
      ? apiServices.filter((s) => s.category === "event").map(toServiceItem)
      : EVENT_SERVICES;

  return (
    <div className="min-h-screen bg-cream pt-20 text-ink">
      {/* ---------------- Intro ---------------- */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <span className="eyebrow mb-3 text-ink-soft">Everything, one team</span>
        <h1 className="font-display mb-5 text-4xl font-light text-ink md:text-5xl">
          Our Services
        </h1>
        <p className="text-sm font-light leading-relaxed text-ink-soft">
          Two ways we work: around your stay, and around your occasion.
        </p>
      </section>

      {/* ---------------- Stay services ----------------
          Split by intent rather than one long list — guests booking a
          weekend and clients booking a wedding want different shelves. */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <header className="mb-10 border-b border-line pb-5">
          <span className="eyebrow mb-2 text-gold">01</span>
          <h2 className="font-display text-3xl font-light text-ink md:text-4xl">Stay Services</h2>
          <p className="mt-2 max-w-xl text-sm font-light text-ink-soft">
            Arranged around a booked farmhouse, from the first morning to the last.
          </p>
        </header>

        <ServiceGrid items={stayServices} />
      </section>

      {/* ---------------- Event services ---------------- */}
      <section className="bg-sand/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <header className="mb-10 border-b border-line pb-5">
            <span className="eyebrow mb-2 text-gold">02</span>
            <h2 className="font-display text-3xl font-light text-ink md:text-4xl">
              Event Services
            </h2>
            <p className="mt-2 max-w-xl text-sm font-light text-ink-soft">
              When the farmhouse is the venue — venue, food, décor and management in one contract.
            </p>
          </header>

          <ServiceGrid items={eventServices} />
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="bg-ink py-16 text-center text-cream">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display mb-4 text-2xl font-light md:text-3xl">
            Tell us the occasion. We&rsquo;ll take it from there.
          </h2>
          <Link
            href="/events"
            className="mt-4 inline-flex items-center gap-3 bg-gold px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
          >
            <span>Plan an event</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
