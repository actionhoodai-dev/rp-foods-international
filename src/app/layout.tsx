import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCompanySettings, getCategories, getProducts } from "@/lib/firebase/db";
import { CompanySettings, Category, Product } from "@/types";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const defaultSettings: CompanySettings = {
  name: "RP Foods International",
  phoneNumbers: ["+91 8778522332", "+91 9994524443"],
  email: "rpfoodspowder@gmail.com",
  address: "51B/141, Kumaran Thiru Nagar, Dindigul – 624005, Tamil Nadu, India",
  googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.3644026857134!2d77.965412!3d10.370334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00ab4358bb3c9b%3A0xc3b83ef34d3d81b8!2sDindigul%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  socialLinks: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCompanySettings() || defaultSettings;
  return {
    metadataBase: new URL("https://www.rpfoodsinternational.com"),
    title: {
      default: settings.seo.metaTitle,
      template: `%s | ${settings.name}`,
    },
    description: settings.seo.metaDescription,
    keywords: settings.seo.keywords,
    openGraph: {
      title: settings.seo.metaTitle,
      description: settings.seo.metaDescription,
      url: "https://www.rpfoodsinternational.com",
      siteName: settings.name,
      images: settings.seo.ogImage ? [{ url: settings.seo.ogImage, width: 1200, height: 630 }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo.metaTitle,
      description: settings.seo.metaDescription,
      images: settings.seo.ogImage ? [settings.seo.ogImage] : [],
    },
    verification: {
      google: settings.seo.googleVerification || undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch settings dynamically from database (SSG / SSR Safe fallback)
  const settings = await getCompanySettings() || defaultSettings;

  // Fetch active categories dynamically
  let categories: Category[] = [];
  try {
    categories = await getCategories(true);
  } catch (err) {
    console.error("Failed to load categories for root layout:", err);
  }

  // Fetch published products dynamically
  let products: Product[] = [];
  try {
    products = await getProducts(undefined, true);
  } catch (err) {
    console.error("Failed to load products for root layout:", err);
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-charcoal font-sans selection:bg-maroon selection:text-white">
        <Header 
          companyName={settings.name} 
          phone={settings.phoneNumbers[0]} 
          categories={categories}
          products={products}
        />
        <main className="flex-grow">{children}</main>
        <Footer settings={settings} categories={categories} />
      </body>
    </html>
  );
}
