import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { getCompanySettings } from "@/lib/firebase/db";
import ProductInquiryForm from "@/components/products/ProductInquiryForm";
import { CompanySettings } from "@/types";
import type { Metadata } from "next";

const defaultSettings: CompanySettings = {
  name: "RP Foods International",
  phoneNumbers: ["+91 8778522332", "+91 9994524443"],
  email: "rpfoodspowder@gmail.com",
  address: "51B/141, Kumaran Thiru Nagar, Dindigul – 624005, Tamil Nadu, India",
  googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.3644026857134!2d77.965412!3d10.370334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00ab4358bb3c9b%3A0xc3b83ef34d3d81b8!2sDindigul%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  socialLinks: {},
  hero: {
    title: "",
    subtitle: ""
  },
  about: {
    title: "",
    story: "",
    mission: "",
    vision: ""
  },
  footer: {
    copyright: "",
    text: ""
  },
  seo: {
    metaTitle: "Contact Our Export Desk - RP Foods International",
    metaDescription: "Contact RP Foods International for bulk spice powder orders and masalas. Address and coordinates in Kumaran Thiru Nagar, Dindigul, Tamil Nadu, India.",
    keywords: ""
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCompanySettings() || defaultSettings;
  const titleText = "Contact Spice Export House - RP Foods International";
  const descText = `Connect with RP Foods International. Reach our export coordinates: Phone ${settings.phoneNumbers.join(", ")}, Email ${settings.email}. Location Dindigul, Tamil Nadu, India.`;
  return {
    title: titleText,
    description: descText,
    alternates: {
      canonical: "https://www.rpfoodsinternational.com/contact",
    },
    openGraph: {
      title: titleText,
      description: descText,
      url: "https://www.rpfoodsinternational.com/contact",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
    },
  };
}

export default async function ContactPage() {
  const settings = await getCompanySettings() || defaultSettings;

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      
      {/* Page header banner */}
      <div className="relative py-24 mb-12 bg-cover bg-center overflow-hidden bg-[url('/images/contact_hero.png')]">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/40" />
        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col gap-2 text-white">
            <span className="text-gold font-bold text-xs uppercase tracking-widest">
              Get in Touch
            </span>
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-white">
              Contact Exporter Desk
            </h1>
            <p className="text-gray-300 text-sm max-w-2xl mt-1 leading-relaxed">
              Have questions about certificates, pricing lists, custom blends, packaging MOQs, or shipping schedules? Contact our trade team directly.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Left Column: Direct Contacts & Maps (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Contact details cards */}
            <div className="bg-neutral-bg p-8 border border-gray-200 flex flex-col gap-6">
              <h3 className="text-lg font-bold font-heading text-charcoal uppercase tracking-wider border-b border-gray-200 pb-3">
                Corporate Address
              </h3>

              <div className="flex flex-col gap-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white text-maroon border border-gray-200 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Office & Factory Location</span>
                    <span className="font-semibold text-gray-700 leading-relaxed">{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white text-maroon border border-gray-200 shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Phone Line Channels</span>
                    <div className="flex flex-col">
                      {settings.phoneNumbers.map((num) => (
                        <span key={num} className="font-semibold text-gray-700">{num}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white text-maroon border border-gray-200 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Email Communications</span>
                    <a href={`mailto:${settings.email}`} className="font-semibold text-charcoal hover:underline">{settings.email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white text-maroon border border-gray-200 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Operating Hours</span>
                    <span className="font-semibold text-gray-700">Monday – Saturday: 09:00 AM to 06:00 PM (IST)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps iFrame */}
            {settings.googleMapsUrl && (
              <div className="border border-gray-200 h-[280px] w-full overflow-hidden relative shadow-sm">
                <iframe
                  src={settings.googleMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RP Foods International Office Map"
                />
              </div>
            )}

          </div>

          {/* Right Column: Inquiry Form Component (7 cols) */}
          <div className="lg:col-span-7">
            <ProductInquiryForm />
          </div>

        </div>
      </div>

    </div>
  );
}
