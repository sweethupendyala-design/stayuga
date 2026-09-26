"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { apiFetch, ApiRequestError, uploadImage } from "@/lib/api";
import { ContactInfo, ContentBlocks, FaqItem, PolicyPage, Service, Testimonial } from "@/lib/types";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { IconKey } from "@/lib/addOnServices";

const ICON_OPTIONS: IconKey[] = [
  "chef", "concierge", "spa", "wellness", "transport", "housekeeping", "kitchen",
  "decor", "photography", "music", "garden", "bonfire", "fireplace", "wifi",
  "parking", "ac", "pool", "pets", "tv", "breakfast", "view", "bed", "bath", "guests",
];

const POLICY_SLUGS = [
  { slug: "terms", label: "Terms & Conditions" },
  { slug: "privacy", label: "Privacy Policy" },
  { slug: "cancellation", label: "Cancellation Policy" },
];

function HeroEditor({ token, initial }: { token: string; initial: { heading: string; subheading: string } }) {
  const [heading, setHeading] = useState(initial.heading);
  const [subheading, setSubheading] = useState(initial.subheading);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    await apiFetch("/api/content/blocks/homepage-hero", {
      method: "PUT",
      token,
      body: JSON.stringify({ value: { heading, subheading } }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <Input label="Hero heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
      <Textarea label="Hero subheading" value={subheading} onChange={(e) => setSubheading(e.target.value)} />
      <Button type="button" onClick={save} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved" : "Save"}
      </Button>
    </div>
  );
}

function AboutEditor({ token, initial }: { token: string; initial: { heading: string; body: string } }) {
  const [heading, setHeading] = useState(initial.heading);
  const [body, setBody] = useState(initial.body);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    await apiFetch("/api/content/blocks/about-mission", {
      method: "PUT",
      token,
      body: JSON.stringify({ value: { heading, body } }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <Input label="About heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
      <Textarea label="About body" value={body} onChange={(e) => setBody(e.target.value)} />
      <Button type="button" onClick={save} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved" : "Save"}
      </Button>
    </div>
  );
}

function ContactInfoEditor({ token, initial }: { token: string; initial: ContactInfo }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    await apiFetch("/api/content/blocks/contact-info", {
      method: "PUT",
      token,
      body: JSON.stringify({ value: form }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <Input label="Email address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Input label="Office / location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      <Button type="button" onClick={save} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved" : "Save"}
      </Button>
    </div>
  );
}

function FaqManager({ token, initial }: { token: string; initial: FaqItem[] }) {
  const [faqs, setFaqs] = useState(initial);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [adding, setAdding] = useState(false);

  async function addFaq(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!question || !answer) return;
    setAdding(true);
    const { faq } = await apiFetch<{ faq: FaqItem }>("/api/content/faqs", {
      method: "POST",
      token,
      body: JSON.stringify({ question, answer, order: faqs.length + 1 }),
    });
    setFaqs([...faqs, faq]);
    setQuestion("");
    setAnswer("");
    setAdding(false);
  }

  async function removeFaq(id: string) {
    await apiFetch(`/api/content/faqs/${id}`, { method: "DELETE", token });
    setFaqs(faqs.filter((f) => f._id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="divide-y divide-line/70 rounded-xl border border-line/70">
        {faqs.map((faq) => (
          <div key={faq._id} className="flex items-start justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-medium text-ink">{faq.question}</p>
              <p className="mt-1 text-sm text-ink-soft">{faq.answer}</p>
            </div>
            <button onClick={() => removeFaq(faq._id)} className="shrink-0 text-ink-soft hover:text-red-600">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {faqs.length === 0 && <p className="p-4 text-sm text-ink-soft">No FAQs yet.</p>}
      </div>

      <form onSubmit={addFaq} className="space-y-3 rounded-xl border border-dashed border-line p-4">
        <Input label="New question" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <Textarea label="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <Button type="submit" variant="outline" disabled={adding}>
          {adding ? "Adding..." : "Add FAQ"}
        </Button>
      </form>
    </div>
  );
}

function PolicyEditor({ token, slug, label, initial }: { token: string; slug: string; label: string; initial?: PolicyPage }) {
  const [title, setTitle] = useState(initial?.title ?? label);
  const [content, setContent] = useState(initial?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    await apiFetch(`/api/content/policies/${slug}`, {
      method: "PUT",
      token,
      body: JSON.stringify({ title, content }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-3 rounded-xl border border-line/70 p-4">
      <Input label={`${label} — title`} value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea label="Content" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-40" />
      <Button type="button" variant="outline" onClick={save} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved" : "Save"}
      </Button>
    </div>
  );
}

function TestimonialsManager({ token, initial }: { token: string; initial: Testimonial[] }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState({ quote: "", author: "", context: "" });
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ quote: "", author: "", context: "" });

  async function addTestimonial(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.quote || !form.author || !form.context) return;
    setAdding(true);
    const { testimonial } = await apiFetch<{ testimonial: Testimonial }>("/api/content/testimonials", {
      method: "POST",
      token,
      body: JSON.stringify({ ...form, order: items.length + 1 }),
    });
    setItems([...items, testimonial]);
    setForm({ quote: "", author: "", context: "" });
    setAdding(false);
  }

  async function saveEdit(id: string) {
    const { testimonial } = await apiFetch<{ testimonial: Testimonial }>(`/api/content/testimonials/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(editForm),
    });
    setItems(items.map((t) => (t._id === id ? testimonial : t)));
    setEditId(null);
  }

  async function remove(id: string) {
    await apiFetch(`/api/content/testimonials/${id}`, { method: "DELETE", token });
    setItems(items.filter((t) => t._id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="divide-y divide-line/70 rounded-xl border border-line/70">
        {items.map((t) => (
          <div key={t._id} className="p-4">
            {editId === t._id ? (
              <div className="space-y-2">
                <Textarea label="Quote" value={editForm.quote} onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })} />
                <Input label="Author" value={editForm.author} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} />
                <Input label="Property / context" value={editForm.context} onChange={(e) => setEditForm({ ...editForm, context: e.target.value })} />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => saveEdit(t._id)}>Save</Button>
                  <button type="button" onClick={() => setEditId(null)} className="text-sm text-ink-soft hover:text-ink">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-1 text-xs text-ink-soft">{t.author} — {t.context}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => { setEditId(t._id); setEditForm({ quote: t.quote, author: t.author, context: t.context }); }}
                    className="text-ink-soft hover:text-forest"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => remove(t._id)} className="text-ink-soft hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="p-4 text-sm text-ink-soft">No reviews yet. Add one below — or leave empty to show the default reviews.</p>}
      </div>

      <form onSubmit={addTestimonial} className="space-y-3 rounded-xl border border-dashed border-line p-4">
        <Textarea label="Quote (guest review)" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
        <Input label="Guest name / author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="e.g. Meera S." />
        <Input label="Property / context" value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} placeholder="e.g. Ananta Villa, Kasauli" />
        <Button type="submit" variant="outline" disabled={adding}>
          {adding ? "Adding..." : "Add review"}
        </Button>
      </form>
    </div>
  );
}

const EMPTY_SERVICE_FORM = {
  title: "",
  desc: "",
  category: "stay" as "stay" | "event",
  icon: "concierge" as IconKey,
  priceFrom: "",
  unit: "",
  image: "",
  promoText: "",
  comingSoon: false,
};

function ServicesManager({ token, initial }: { token: string; initial: Service[] }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState(EMPTY_SERVICE_FORM);
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_SERVICE_FORM);

  async function handleImageUpload(
    file: File | undefined,
    apply: (url: string) => void
  ) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, token);
      apply(url);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function addService(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.title || !form.desc || !form.image) {
      setError("Title, description and an image are required.");
      return;
    }
    setError("");
    setAdding(true);
    try {
      const { service } = await apiFetch<{ service: Service }>("/api/services", {
        method: "POST",
        token,
        body: JSON.stringify({
          ...form,
          priceFrom: form.priceFrom ? Number(form.priceFrom) : null,
          order: items.length + 1,
        }),
      });
      setItems([...items, service]);
      setForm(EMPTY_SERVICE_FORM);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not add service");
    } finally {
      setAdding(false);
    }
  }

  async function saveEdit(id: string) {
    try {
      const { service } = await apiFetch<{ service: Service }>(`/api/services/${id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({
          ...editForm,
          priceFrom: editForm.priceFrom ? Number(editForm.priceFrom) : null,
        }),
      });
      setItems(items.map((s) => (s._id === id ? service : s)));
      setEditId(null);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not save changes");
    }
  }

  async function remove(id: string) {
    await apiFetch(`/api/services/${id}`, { method: "DELETE", token });
    setItems(items.filter((s) => s._id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="divide-y divide-line/70 rounded-xl border border-line/70">
        {items.map((s) => (
          <div key={s._id} className="p-4">
            {editId === s._id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input label="Title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                  <Select label="Category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value as "stay" | "event" })}>
                    <option value="stay">Stay service</option>
                    <option value="event">Event service</option>
                  </Select>
                </div>
                <Textarea label="Description" value={editForm.desc} onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Select label="Icon" value={editForm.icon} onChange={(e) => setEditForm({ ...editForm, icon: e.target.value as IconKey })}>
                    {ICON_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
                  </Select>
                  <Input label="Price from (₹, optional)" type="number" value={editForm.priceFrom} onChange={(e) => setEditForm({ ...editForm, priceFrom: e.target.value })} />
                  <Input label="Unit (e.g. per guest)" value={editForm.unit} onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })} />
                </div>
                <Textarea label="Promo text (optional)" value={editForm.promoText} onChange={(e) => setEditForm({ ...editForm, promoText: e.target.value })} />
                <div className="flex items-center gap-3">
                  {editForm.image && (
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-line/70">
                      <Image src={editForm.image} alt="" fill className="object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => handleImageUpload(e.target.files?.[0], (url) => setEditForm({ ...editForm, image: url }))}
                    className="text-xs text-ink-soft"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input type="checkbox" checked={editForm.comingSoon} onChange={(e) => setEditForm({ ...editForm, comingSoon: e.target.checked })} className="h-4 w-4 accent-forest" />
                  Mark as &ldquo;Coming Soon&rdquo;
                </label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => saveEdit(s._id)}>Save</Button>
                  <button type="button" onClick={() => setEditId(null)} className="text-sm text-ink-soft hover:text-ink">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-line/70 bg-sand">
                    {s.image && <Image src={s.image} alt="" fill className="object-cover" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {s.title}{" "}
                      <span className="ml-1 text-[10px] font-normal uppercase tracking-wide text-ink-soft">
                        {s.category}
                        {s.comingSoon ? " · Coming Soon" : ""}
                      </span>
                    </p>
                    <p className="mt-1 max-w-md text-xs text-ink-soft">{s.desc}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => {
                      setEditId(s._id);
                      setEditForm({
                        title: s.title,
                        desc: s.desc,
                        category: s.category,
                        icon: s.icon as IconKey,
                        priceFrom: s.priceFrom ? String(s.priceFrom) : "",
                        unit: s.unit ?? "",
                        image: s.image,
                        promoText: s.promoText ?? "",
                        comingSoon: !!s.comingSoon,
                      });
                    }}
                    className="text-ink-soft hover:text-forest"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => remove(s._id)} className="text-ink-soft hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="p-4 text-sm text-ink-soft">No services yet. Add one below — or leave empty to show the default catalogue.</p>
        )}
      </div>

      <form onSubmit={addService} className="space-y-3 rounded-xl border border-dashed border-line p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Private Chef" />
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as "stay" | "event" })}>
            <option value="stay">Stay service</option>
            <option value="event">Event service</option>
          </Select>
        </div>
        <Textarea label="Description" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="One short line for the service card" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select label="Icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value as IconKey })}>
            {ICON_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
          </Select>
          <Input label="Price from (₹, optional)" type="number" value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: e.target.value })} placeholder="Leave blank for Included" />
          <Input label="Unit (e.g. per guest)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
        </div>
        <Textarea label="Promo text (optional)" value={form.promoText} onChange={(e) => setForm({ ...form, promoText: e.target.value })} placeholder="A short highlight shown next to the image" />
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink">Image</span>
          <div className="flex items-center gap-3">
            {form.image && (
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-line/70">
                <Image src={form.image} alt="" fill className="object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => handleImageUpload(e.target.files?.[0], (url) => setForm({ ...form, image: url }))}
              className="text-xs text-ink-soft"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={form.comingSoon} onChange={(e) => setForm({ ...form, comingSoon: e.target.checked })} className="h-4 w-4 accent-forest" />
          Mark as &ldquo;Coming Soon&rdquo; (blurs the image and shows a banner on the site)
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" variant="outline" disabled={adding || uploading}>
          {adding ? "Adding..." : uploading ? "Uploading image..." : "Add service"}
        </Button>
      </form>
    </div>
  );
}

function ContentContent() {
  const { token } = useAdminAuth();
  const [data, setData] = useState<{ blocks: ContentBlocks; faqs: FaqItem[]; policies: PolicyPage[]; testimonials: Testimonial[] } | null>(
    null
  );
  const [services, setServices] = useState<Service[] | null>(null);

  useEffect(() => {
    apiFetch<{ blocks: ContentBlocks; faqs: FaqItem[]; policies: PolicyPage[]; testimonials: Testimonial[] }>("/api/content").then(
      setData
    );
    apiFetch<{ services: Service[] }>("/api/services").then((d) => setServices(d.services));
  }, []);

  if (!token || !data || !services) return <p className="text-ink-soft">Loading...</p>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl text-ink">Content</h1>
        <p className="mt-1 text-sm text-ink-soft">Manage homepage copy, FAQs, and policy pages.</p>
      </div>

      <section className="rounded-2xl border border-line/70 bg-white p-6">
        <h2 className="font-display text-lg text-ink">Homepage hero</h2>
        <div className="mt-4">
          <HeroEditor
            token={token}
            initial={
              data.blocks["homepage-hero"] ?? {
                heading: "Curated stays where nature, comfort, and memories meet",
                subheading: "Handpicked villas and farmhouses for the moments worth slowing down for.",
              }
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-6">
        <h2 className="font-display text-lg text-ink">Contact information</h2>
        <p className="mt-1 text-sm text-ink-soft">Shown on the About page&rsquo;s Contact section and in the site footer.</p>
        <div className="mt-4">
          <ContactInfoEditor
            token={token}
            initial={
              data.blocks["contact-info"] ?? {
                email: "hello@stayuga.com",
                phone: "+91 00000 00000",
                location: "Hyderabad, India",
              }
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-6">
        <h2 className="font-display text-lg text-ink">About page</h2>
        <div className="mt-4">
          <AboutEditor
            token={token}
            initial={
              data.blocks["about-mission"] ?? {
                heading: "Our mission",
                body: "Stayuga curates a small, handpicked portfolio of luxury villas and farmhouses.",
              }
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-6">
        <h2 className="font-display text-lg text-ink">Guest reviews</h2>
        <p className="mt-1 text-sm text-ink-soft">These appear in the &ldquo;What our guests remember&rdquo; section on the homepage.</p>
        <div className="mt-4">
          <TestimonialsManager token={token} initial={data.testimonials} />
        </div>
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-6">
        <h2 className="font-display text-lg text-ink">Our Services</h2>
        <p className="mt-1 text-sm text-ink-soft">Shown on the /services page — add, edit, remove, or mark a service &ldquo;Coming Soon&rdquo;.</p>
        <div className="mt-4">
          <ServicesManager token={token} initial={services} />
        </div>
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-6">
        <h2 className="font-display text-lg text-ink">FAQs</h2>
        <div className="mt-4">
          <FaqManager token={token} initial={data.faqs} />
        </div>
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-6">
        <h2 className="font-display text-lg text-ink">Policy pages</h2>
        <div className="mt-4 space-y-4">
          {POLICY_SLUGS.map(({ slug, label }) => (
            <PolicyEditor
              key={slug}
              token={token}
              slug={slug}
              label={label}
              initial={data.policies.find((p) => p.slug === slug)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function ContentPage() {
  return (
    <AdminGuard>
      <ContentContent />
    </AdminGuard>
  );
}
