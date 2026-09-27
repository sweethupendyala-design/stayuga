import type { Metadata } from "next";
import Image from "next/image";
import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import { emptyContent, getContent } from "@/lib/data";
import { ValueProps } from "@/components/about/ValueProps";
import { Testimonials } from "@/components/about/Testimonials";
import { ContactForm } from "@/components/contact/ContactForm";
import { DEFAULT_CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About",
  description:
    "Stayuga is Hyderabad's one-stop farmhouse company — premium stays, dining, décor and full event management under a single point of contact.",
};

export default async function AboutPage() {
  const { blocks, faqs, testimonials } = await getContent().catch(emptyContent);
  const contact = blocks["contact-info"] ?? DEFAULT_CONTACT;
  const mission = blocks["about-mission"] ?? {
    heading: "A family anniversary, and far too many phone calls.",
    body: "The farmhouse was beautiful. Everything else — the caterer, the decorator, the coordinator — was six separate conversations and one long, anxious week.\n\nStayuga exists so that week never happens to anyone else. One number, one team, and a day you get to actually attend.",
  };
  const missionParagraphs = mission.body.split("\n\n");

  return (
    <div className="min-h-screen bg-cream pt-20 text-ink">
      {/* ---------------- 1 · PHILOSOPHY ---------------- */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <span className="eyebrow mb-3 text-ink-soft">Our Philosophy</span>
        <h1 className="font-display mb-6 text-4xl font-light text-ink md:text-5xl">
          Focus on the celebration.
          <br />
          Leave the coordination to us.
        </h1>
        <p className="text-base font-light leading-relaxed text-ink-soft">
          Stayuga is Hyderabad&rsquo;s one-stop farmhouse company — stay, table, styling and event,
          arranged by a single team.
        </p>
      </section>

      {/* ---------------- 2 · ORIGIN ---------------- */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 md:grid-cols-2">
        <div className="relative h-96 w-full overflow-hidden border border-line">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
            alt="Interior of a Stayuga farmhouse"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <span className="eyebrow mb-3 text-gold">How it started</span>
          <h2 className="font-display mb-4 text-3xl font-light text-ink">{mission.heading}</h2>
          {missionParagraphs.map((p, i) => (
            <p key={i} className="mb-4 text-sm font-light leading-relaxed text-ink-soft last:mb-0">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ---------------- 4 · WHY STAYUGA ---------------- */}
      <section className="border-t border-line">
        <ValueProps />
      </section>

      {/* ---------------- 5 · FAQ ---------------- */}
      {faqs.length > 0 && (
        <section className="mx-auto max-w-3xl border-t border-line px-6 py-16">
          <div className="mb-10 text-center">
            <span className="eyebrow mb-2 text-ink-soft">Common questions</span>
            <h2 className="font-display text-3xl font-light text-ink">Before you ask</h2>
          </div>

          {/*
            Native <details> rather than useState — this keeps the page a server
            component, works without JS, and gives us open/close semantics for
            screen readers for free.
          */}
          <div className="divide-y divide-line border border-line bg-shell">
            {faqs.map((faq) => (
              <details key={faq._id} className="group p-5">
                <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-4 text-base text-ink">
                  {faq.question}
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-gold transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-sm font-light leading-relaxed text-ink-soft">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- 6 · CONCIERGE QUICK-CONTACT ---------------- */}
      <section className="bg-ink py-16 text-cream">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="eyebrow mb-3 text-gold">Get in touch</span>
          <h2 className="font-display mb-8 text-3xl font-light">Talk to a concierge</h2>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <a
              href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
              className="flex items-center gap-2.5 text-sm transition-colors hover:text-gold-light"
            >
              <Phone size={15} className="text-gold" aria-hidden="true" />
              {contact.phone}
            </a>

            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2.5 text-sm transition-colors hover:text-gold-light"
            >
              <Mail size={15} className="text-gold" aria-hidden="true" />
              {contact.email}
            </a>
          </div>

          <a
            href="#contact"
            className="mt-10 inline-flex items-center gap-3 bg-gold px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
          >
            <span>Send an enquiry</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>

      {/* ---------------- 7 · CONTACT US (moved here from the old /contact page) ---------------- */}
      <section id="contact" className="scroll-mt-24 border-t border-line px-6 py-16 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow mb-3 text-ink-soft">Contact us</span>
            <h2 className="font-display text-3xl font-light text-ink sm:text-4xl">
              We&rsquo;d love to help you plan your stay
            </h2>
            <p className="mt-4 text-sm font-light leading-relaxed text-ink-soft">
              Share a few details and our team will respond within a day — or reach us directly below.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <div className="rounded-2xl border border-line/70 bg-shell p-6">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-ink">Email</p>
                    <p className="text-sm text-ink-soft">{contact.email}</p>
                  </div>
                </div>
                <div className="mt-5 flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-ink">Phone</p>
                    <p className="text-sm text-ink-soft">{contact.phone}</p>
                  </div>
                </div>
                <div className="mt-5 flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-ink">Office</p>
                    <p className="text-sm text-ink-soft">{contact.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line/70 bg-white p-8 lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 8 · GUEST STORIES ---------------- */}
      <Testimonials testimonials={testimonials} />
    </div>
  );
}
