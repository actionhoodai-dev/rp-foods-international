import { seedInitialData, getCompanySettings, getCategories, getProducts } from "@/lib/firebase/db";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import AboutSection from "@/components/home/AboutSection";
import CategoriesShowcase from "@/components/home/CategoriesShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ExportMap from "@/components/home/ExportMap";
import InquiryCTA from "@/components/home/InquiryCTA";
import { CompanySettings } from "@/types";

const defaultSettings: CompanySettings = {
  name: "RP Foods International",
  phoneNumbers: ["8778522332", "9994524443"],
  email: "rpfoodspowder@gmail.com",
  address: "51B/141, Kumaran Thiru Nagar, Dindigul – 624005, Tamil Nadu, India",
  googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.3644026857134!2d77.965412!3d10.370334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00ab4358bb3c9b%3A0xc3b83ef34d3d81b8!2sDindigul%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  socialLinks: {},
  hero: {
    title: "Delivering Authentic Indian Spice Excellence Across Global Markets",
    subtitle: "Premium Spice Powders, Masalas, and Culinary Blends Manufactured to International Quality Standards.",
  },
  about: {
    title: "Pioneering Indian Food Export Since Inception",
    story: "RP Foods International is a premier exporter and manufacturer of high-quality spice powders and masalas based in Dindigul, Tamil Nadu. Committed to delivering the rich heritage of Indian flavors to kitchens worldwide, we maintain rigorous processing quality, authentic taste profiles, and modern hygienic packaging standards to satisfy global expectations.",
    mission: "To process and supply premium, hygienic, and pure spice blends across international borders, establishing Indian agricultural and manufacturing excellence globally.",
    vision: "To become the preferred global partner for authentic Indian spices, trusted by importers, supermarkets, and food services worldwide for consistency, quality, and food safety standards.",
  },
  footer: {
    copyright: "© 2026 RP Foods International. All Rights Reserved.",
    text: "Premium Exporter of Pure Spice Powders and Authentic Blends from Tamil Nadu, India.",
  },
  seo: {
    metaTitle: "Premium Spice Powders & Masalas Exporter - RP Foods International",
    metaDescription: "RP Foods International is a premium exporter of authentic Indian spice powders, masalas, and blends based in Dindigul, Tamil Nadu. Delivering quality standard spices globally.",
    keywords: "RP Foods, Spice Exporter, Indian Masala, Sambar Powder, Chilli Powder, Turmeric Powder, Curry Powder, Export Masala Dindigul, Tamil Nadu Spices",
  },
};

export default async function Home() {
  // 1. Auto-seed if database settings do not exist
  await seedInitialData();

  // 2. Query Firestore data for Homepage sections
  const settings = await getCompanySettings() || defaultSettings;
  const rawCategories = await getCategories(true); // only active categories
  const rawProducts = await getProducts(undefined, true); // only published products

  // 3. Enrich categories with their active product counts
  const categoriesWithCounts = rawCategories.map(cat => ({
    ...cat,
    productCount: rawProducts.filter(prod => prod.categoryId === cat.id).length
  }));

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {/* SECTION 1: Hero Banner */}
      <Hero />

      {/* SECTION 2: Scroll counters */}
      <Stats />

      {/* SECTION 3: About details & Quality stats */}
      <AboutSection settings={settings} />

      {/* SECTION 4: Categories Grid */}
      <CategoriesShowcase categories={categoriesWithCounts} />

      {/* SECTION 5: Featured Products list */}
      <FeaturedProducts products={rawProducts} />

      {/* SECTION 6: Company Strengths / Why Us cards */}
      <WhyChooseUs />

      {/* SECTION 7: Route details interactive map */}
      <ExportMap />

      {/* SECTION 8: Inquiry Call to Action */}
      <InquiryCTA />
    </div>
  );
}
