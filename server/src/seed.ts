import bcrypt from "bcryptjs";
import { connectDb } from "./config/db";
import { PropertyModel } from "./models/Property";
import { ExperienceModel } from "./models/Experience";
import { AdminUserModel } from "./models/AdminUser";
import { ContentBlockModel, FaqItemModel, PolicyPageModel } from "./models/ContentBlock";
import { ServiceModel } from "./models/Service";
import mongoose from "mongoose";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600",
];

async function seed() {
  await connectDb();

  await Promise.all([
    PropertyModel.deleteMany({}),
    ExperienceModel.deleteMany({}),
    AdminUserModel.deleteMany({}),
    ContentBlockModel.deleteMany({}),
    FaqItemModel.deleteMany({}),
    PolicyPageModel.deleteMany({}),
    ServiceModel.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("Stayuga@123", 10);
  await AdminUserModel.create({
    name: "Stayuga Admin",
    email: "admin@stayuga.com",
    passwordHash,
  });

  await PropertyModel.insertMany([
    {
      title: "Ananta Villa",
      slug: "ananta-villa",
      type: "villa",
      tagline: "A private hillside retreat above the valley",
      description:
        "Ananta Villa is a secluded four-bedroom hillside estate framed by pine forest, with an infinity pool overlooking the valley, a private chef's kitchen, and sunset-facing decks designed for slow mornings and long dinners.",
      images: PLACEHOLDER_IMAGES,
      amenities: ["Private pool", "Chef on call", "Wi-Fi", "Bonfire deck", "Home theatre", "Power backup"],
      location: {
        address: "Ridge Road, Kasauli Hills",
        city: "Kasauli",
        state: "Himachal Pradesh",
        mapEmbedUrl: "https://www.google.com/maps?q=Kasauli&output=embed",
      },
      pricing: { basePrice: 28000, weekendPrice: 34000, currency: "INR" },
      capacity: { maxGuests: 10, bedrooms: 4, bathrooms: 4 },
      featured: true,
      status: "published",
    },
    {
      title: "Meadow House Farmstay",
      slug: "meadow-house-farmstay",
      type: "farmhouse",
      tagline: "Open meadows, mango orchards, and quiet mornings",
      description:
        "A whitewashed farmhouse set inside a working mango orchard, Meadow House pairs rustic charm with modern comfort — a wraparound veranda, an open lawn for events, and a farm-to-table breakfast sourced from the property.",
      images: PLACEHOLDER_IMAGES,
      amenities: ["Private lawn", "Bonfire", "Farm breakfast", "Wi-Fi", "Board games", "Parking"],
      location: {
        address: "Orchard Lane, Karjat Countryside",
        city: "Karjat",
        state: "Maharashtra",
        mapEmbedUrl: "https://www.google.com/maps?q=Karjat&output=embed",
      },
      pricing: { basePrice: 18000, weekendPrice: 22000, currency: "INR" },
      capacity: { maxGuests: 16, bedrooms: 5, bathrooms: 5 },
      featured: true,
      status: "published",
    },
    {
      title: "Blue Lagoon Farmhouse",
      slug: "blue-lagoon-farmhouse",
      type: "farmhouse",
      tagline: "Lakeside farmhouse built for celebrations",
      description:
        "Blue Lagoon sits on the edge of a private lake, with a landscaped lawn built for weddings and retreats, an outdoor bar deck, and rooms styled with warm minimalist interiors overlooking the water.",
      images: PLACEHOLDER_IMAGES,
      amenities: ["Lake view", "Event lawn", "Outdoor bar", "Private pool", "Wi-Fi", "Generator backup"],
      location: {
        address: "Lakeview Road, Sonipat Outskirts",
        city: "Sonipat",
        state: "Haryana",
        mapEmbedUrl: "https://www.google.com/maps?q=Sonipat&output=embed",
      },
      pricing: { basePrice: 32000, weekendPrice: 38000, currency: "INR" },
      capacity: { maxGuests: 24, bedrooms: 6, bathrooms: 6 },
      featured: false,
      status: "published",
    },
  ]);

  await ExperienceModel.insertMany([
    {
      title: "Full Moon Wellness Retreat",
      slug: "full-moon-wellness-retreat",
      type: "retreat",
      description:
        "A guided two-day wellness retreat at Ananta Villa featuring sunrise yoga, sound healing, and a curated slow-food menu under the stars.",
      images: PLACEHOLDER_IMAGES,
      location: "Ananta Villa, Kasauli",
      scheduleNote: "Monthly, on the weekend nearest the full moon",
      featured: true,
    },
    {
      title: "Harvest Table Dinner",
      slug: "harvest-table-dinner",
      type: "event",
      description:
        "A long-table farm dinner at Meadow House Farmstay, celebrating the orchard's seasonal harvest with a multi-course menu and live acoustic music.",
      images: PLACEHOLDER_IMAGES,
      location: "Meadow House Farmstay, Karjat",
      scheduleNote: "Seasonal — announced quarterly",
      featured: true,
    },
  ]);

  await ContentBlockModel.insertMany([
    {
      key: "homepage-hero",
      value: {
        heading: "Curated stays where nature, comfort, and memories meet",
        subheading:
          "Handpicked villas and farmhouses for the moments worth slowing down for.",
      },
    },
    {
      key: "about-mission",
      value: {
        heading: "Our mission",
        body:
          "Stayuga curates a small, handpicked portfolio of luxury villas and farmhouses, each personally vetted for design, service, and setting — so every stay feels considered, not generic.",
      },
    },
  ]);

  await FaqItemModel.insertMany([
    {
      question: "How do I book a property?",
      answer:
        "Submit an enquiry from any property page with your preferred dates and guest count. Our team confirms availability and shares payment details over WhatsApp or email within a few hours.",
      order: 1,
    },
    {
      question: "Is there a minimum stay requirement?",
      answer: "Most properties require a minimum 1-night stay on weekdays and 2 nights on weekends and holidays.",
      order: 2,
    },
    {
      question: "Can I host an event or celebration at these properties?",
      answer: "Yes — several of our farmhouses are event-friendly. Mention your headcount and occasion in your enquiry and we'll confirm suitability.",
      order: 3,
    },
  ]);

  await PolicyPageModel.insertMany([
    {
      slug: "terms",
      title: "Terms & Conditions",
      content:
        "By submitting a booking enquiry you agree to be contacted by our team to confirm availability, pricing, and property rules. Final booking confirmation is subject to payment and a signed booking agreement.",
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      content:
        "We collect the contact and stay details you submit through enquiry forms solely to process bookings and respond to enquiries. We do not sell your data to third parties.",
    },
    {
      slug: "cancellation",
      title: "Cancellation Policy",
      content:
        "Cancellations made 7+ days before check-in receive a full refund. Cancellations within 7 days are subject to the individual property's policy, shared at the time of booking confirmation.",
    },
  ]);

  await ServiceModel.insertMany([
    // ---------------- Stay services ----------------
    {
      title: "Private Chef",
      desc: "A menu written around your table, cooked in your kitchen.",
      icon: "chef",
      category: "stay",
      priceFrom: 1200,
      unit: "per guest",
      image: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?q=80&w=800&auto=format&fit=crop",
      order: 1,
    },
    {
      title: "Concierge",
      desc: "One number. Any hour of your stay.",
      icon: "concierge",
      category: "stay",
      priceFrom: null,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
      order: 2,
    },
    {
      title: "Wellness & Spa",
      desc: "Sunrise yoga, therapists who come to you.",
      icon: "spa",
      category: "stay",
      priceFrom: 2500,
      unit: "per session",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop",
      order: 3,
    },
    {
      title: "Chauffeur",
      desc: "Airport to gate, and everywhere between.",
      icon: "transport",
      category: "stay",
      priceFrom: 4500,
      unit: "per day",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop",
      order: 4,
    },
    {
      title: "Housekeeping",
      desc: "Discreet, twice daily.",
      icon: "housekeeping",
      category: "stay",
      priceFrom: null,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
      order: 5,
    },
    {
      title: "Excursions",
      desc: "Lakes, trails and temples worth the early start.",
      icon: "garden",
      category: "stay",
      priceFrom: 3000,
      unit: "per group",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
      order: 6,
      comingSoon: true,
      promoText: "Launching with our Himachal and Western Ghats properties first.",
    },
    // ---------------- Event services ----------------
    {
      title: "Event Management",
      desc: "One team from first walkthrough to last guest.",
      icon: "decor",
      category: "event",
      priceFrom: 75000,
      unit: "per event",
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&auto=format&fit=crop",
      order: 1,
    },
    {
      title: "Décor & Theming",
      desc: "Built to your occasion, not pulled off a shelf.",
      icon: "decor",
      category: "event",
      priceFrom: 35000,
      unit: "per event",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
      order: 2,
    },
    {
      title: "Catering & Bar",
      desc: "Regional, continental or entirely your own.",
      icon: "kitchen",
      category: "event",
      priceFrom: 950,
      unit: "per guest",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
      order: 3,
    },
    {
      title: "Photography & Film",
      desc: "The day, kept properly.",
      icon: "photography",
      category: "event",
      priceFrom: 25000,
      unit: "per event",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
      order: 4,
    },
    {
      title: "Entertainment",
      desc: "Live sets, DJs and sound, tuned to the space.",
      icon: "music",
      category: "event",
      priceFrom: 18000,
      unit: "per event",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
      order: 5,
    },
    {
      title: "Celebrations",
      desc: "Anniversaries, birthdays, reunions — handled.",
      icon: "decor",
      category: "event",
      priceFrom: 20000,
      unit: "per event",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop",
      order: 6,
    },
  ]);

  console.log("[seed] done — admin login: admin@stayuga.com / Stayuga@123");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[seed] failed", err);
  process.exit(1);
});
