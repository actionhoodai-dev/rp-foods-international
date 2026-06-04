import { Ship, Plane, ShieldCheck, MapPin, Globe2, Compass, Layers, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getCompanySettings } from "@/lib/firebase/db";
import { CompanySettings } from "@/types";

const defaultSettings: CompanySettings = {
  name: "RP Foods International",
  phoneNumbers: ["8778522332", "9994524443"],
  email: "rpfoodspowder@gmail.com",
  address: "51B/141, Kumaran Thiru Nagar, Dindigul – 624005, Tamil Nadu, India",
  googleMapsUrl: "",
  socialLinks: {},
  hero: { title: "", subtitle: "" },
  about: { title: "", story: "", mission: "", vision: "" },
  footer: { copyright: "", text: "" },
  seo: {
    metaTitle: "Global Reach & Spice Export Logistics - RP Foods International",
    metaDescription: "We export authentic Indian spices, turmeric, chilli powders, and blends to global terminals including the Middle East, US, Europe, and Asia.",
    keywords: ""
  }
};

export async function generateMetadata() {
  return {
    title: "Global Reach - Export Logistics & Shipping Footprint",
    description: "Explore our global export supply chain: container ports, shipping transit times, packaging materials, and international custom compliance.",
  };
}

export default async function ReachPage() {
  const settings = await getCompanySettings() || defaultSettings;

  const markets = [
    {
      region: "Middle East & GCC",
      ports: "Jebel Ali (UAE), Jeddah (Saudi Arabia), Hamad (Qatar), Shuwaikh (Kuwait)",
      transit: "8 - 12 Days from Tuticorin / Cochin Ports",
      intensity: "High Volume (Sambar, Curry & Chilli Powders)",
      color: "border-maroon/20 bg-maroon/[0.02]"
    },
    {
      region: "Europe & UK",
      ports: "Rotterdam (Netherlands), Hamburg (Germany), Felixstowe (UK)",
      transit: "20 - 25 Days from Southern Ports",
      intensity: "Strict Compliance (Salem Turmeric Fingers & Mild Masalas)",
      color: "border-gold/30 bg-gold/[0.02]"
    },
    {
      region: "North America",
      ports: "New York/New Jersey (USA), Los Angeles (USA), Toronto (Canada)",
      transit: "28 - 32 Days (Transshipment options)",
      intensity: "Premium Quality (Custom Blends, Retail Packaging)",
      color: "border-maroon/20 bg-maroon/[0.02]"
    },
    {
      region: "Southeast Asia",
      ports: "Port Klang (Malaysia), Singapore, Tanjung Priok (Indonesia)",
      transit: "5 - 7 Days (Express shipping channels)",
      intensity: "Frequent LCL/FCL (Bulk Turmeric & Raw Spice Grinds)",
      color: "border-gold/30 bg-gold/[0.02]"
    }
  ];

  const packages = [
    {
      title: "Bulk PP Woven Bags",
      capacity: "25kg / 50kg capacity",
      suitability: "Best for wholesale raw spice powders & turmeric fingers",
      desc: "Double-walled PP bags with inner food-grade LDPE liner (min 50-micron thickness) to protect dry powders from external moisture and prevent flavor leakage.",
      image: "https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/products/turmeric-powder.jpg", // reuse seeded assets
    },
    {
      title: "Multi-Layer Kraft Sacks",
      capacity: "15kg / 20kg / 25kg capacity",
      suitability: "Recommended for high-value ground masalas & culinary blends",
      desc: "Made from multi-ply organic kraft paper with internal barrier coatings to lock in natural volatile oils and aroma profiles during long ocean voyages.",
      image: "https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/products/chilli-powder.jpg",
    },
    {
      title: "Retail Vacuum Stand-up Pouches",
      capacity: "100g / 250g / 500g / 1kg capacity",
      suitability: "Ideal for grocery chains, supermarkets & private labels",
      desc: "Premium metallized polyester-laminated stand-up pouches with zip lock features. Vacuum packed or nitrogen flushed for superior fresh shelf-life.",
      image: "https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/products/sambar-powder.jpg",
    }
  ];

  const compliances = [
    { title: "Phytosanitary Certification", desc: "Every export container is inspected and certified by the Plant Quarantine department, ensuring pest-free dry crops." },
    { title: "Container Fumigation", desc: "Rigorous 48-hour container fumigation using approved agents with standard ventilation and residue checkups before vessel loading." },
    { title: "Curcumin & Aflatoxin Audits", desc: "Batches undergo lab tests for Sudan Dyes, Aflatoxins B1/G1/B2/G2, and Curcumin percentage using HPLC testing." },
    { title: "Hygienic Custom Palletization", desc: "Pallets are heat-treated (ISPM 15 standards) and shrink-wrapped with corner boards to guarantee damage-free transit." }
  ];

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      
      {/* Banner using Custom Generated Logistics Image */}
      <div className="relative py-24 mb-16 bg-cover bg-center overflow-hidden bg-[url('/images/reach_hero.png')]">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/95 to-charcoal/40" />
        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col gap-2 text-white">
            <span className="text-gold font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <Globe2 className="h-4 w-4 animate-spin-slow" /> Global Logistics & Supply Chain
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-heading tracking-tight mt-1 text-white">
              Global Reach
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl font-light leading-relaxed mt-2">
              Seamlessly exporting premium, custom-packaged Indian spice powders and masalas to retail networks, food service companies, and container terminals worldwide.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Section 1: Logistics Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 flex flex-col gap-5">
            <span className="text-xs uppercase font-extrabold tracking-wider text-maroon">Supply Chain Excellence</span>
            <h2 className="text-3xl font-bold font-heading text-charcoal tracking-tight leading-tight">
              Export Logistics Sourced Near Southern India Sea Channels
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our factory head office is situated strategically in Dindigul, Tamil Nadu, granting us immediate access to Southern India&apos;s premier commercial sea hubs: **Tuticorin Port (V.O. Chidambaranar Port)** and **Cochin Port**.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              By placing our warehousing and dry milling facility close to these shipping container terminals, we minimize internal freight times, coordinate container stuffing within 24 hours of clearing QC audits, and secure competitive ocean freight rates for all global destinations.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div className="flex gap-3">
                <div className="p-2 rounded bg-maroon/5 text-maroon shrink-0 h-fit">
                  <Ship className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-charcoal">Sea Freight Hubs</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Tuticorin & Cochin Sea Ports (FCL & LCL consolidations)</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-2 rounded bg-gold/10 text-gold-dark shrink-0 h-fit">
                  <Plane className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-charcoal">Air Freight Hubs</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Madurai, Trichy, and Chennai International Cargo Hubs</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative border-4 border-gray-100 p-4 bg-gray-50 overflow-hidden shadow-lg group">
              <img 
                src="https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/banners/world-map-grid.svg" 
                alt="Global Shipping Routes Map" 
                className="w-full h-auto object-cover opacity-75 group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-maroon/5 mix-blend-multiply" />
              <div className="absolute bottom-6 left-6 right-6 bg-white p-4 shadow-xl border border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-maroon">Export Loading Port</span>
                  <span className="text-xs font-bold text-charcoal mt-0.5">Tuticorin (V.O.C) Port, India</span>
                </div>
                <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 font-bold uppercase tracking-wider">Active Routes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Regional Hubs Grid */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-maroon">Global Distribution Map</span>
            <h2 className="text-3xl font-bold font-heading text-charcoal tracking-tight">Active International Port Routing</h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
              We manage custom clearances, document authentications, and container shipping schedules for partners globally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {markets.map((market) => (
              <div 
                key={market.region} 
                className={`p-6 border flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${market.color}`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Compass className="h-5 w-5 text-maroon" />
                    <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">{market.region}</h3>
                  </div>
                  <ul className="flex flex-col gap-3 text-xs">
                    <li>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Destination Terminals:</span>
                      <span className="text-gray-700 font-medium leading-relaxed">{market.ports}</span>
                    </li>
                    <li>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Average Transit Duration:</span>
                      <span className="text-gray-700 font-semibold">{market.transit}</span>
                    </li>
                  </ul>
                </div>
                <div className="border-t border-gray-150 pt-4 mt-6">
                  <span className="block text-[10px] uppercase font-bold text-maroon">Core Exports:</span>
                  <span className="text-[11px] font-semibold text-gray-600 leading-relaxed">{market.intensity}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Custom Packaging Visual Grid */}
        <section className="mb-24 bg-gray-50/50 border border-gray-100 p-8 sm:p-12">
          <div className="flex flex-col lg:flex-row gap-12 items-center justify-between mb-12">
            <div className="max-w-xl">
              <span className="text-xs uppercase font-extrabold tracking-wider text-maroon">Hygienic Packing Standards</span>
              <h2 className="text-3xl font-bold font-heading text-charcoal tracking-tight mt-2">
                Export Grade Packaging Sinks Moisture & Preserves Freshness
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium leading-relaxed">
                Spices naturally lose volatile oils and capture humidity if exposed. We inspect every sealing batch using food-safe laminated lining.
              </p>
            </div>
            <Link href="/contact">
              <button className="bg-maroon hover:bg-maroon-dark text-white rounded-none uppercase font-semibold text-xs tracking-wider px-6 py-4 transition-all">
                Request Packaging Specifications
              </button>
            </Link>
          </div>

          {/* Visual Showcase (Consisting of products images showing custom packaging cases) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.title} className="bg-white border border-gray-200/80 shadow-sm flex flex-col group overflow-hidden">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/0 transition-all duration-300" />
                  <div className="absolute bottom-4 left-4 bg-maroon text-white font-heading font-extrabold text-xs px-3 py-1 uppercase tracking-wider">
                    {pkg.capacity}
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-base font-bold text-charcoal">{pkg.title}</h3>
                    <span className="block text-[10px] text-gold-dark font-bold uppercase tracking-wider mt-1">{pkg.suitability}</span>
                    <p className="text-xs text-gray-500 leading-relaxed mt-3">{pkg.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Export Compliance */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-xs uppercase font-extrabold tracking-wider text-maroon">Quality Clearance</span>
            <h2 className="text-3xl font-bold font-heading text-charcoal tracking-tight">
              Strict Adherence to Global Food Safety Regulations
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every country enforces distinct limits regarding microbiology, pesticide levels, and chemical properties. We ensure complete transparency by auditing shipments before they leave Tuticorin harbor.
            </p>
            <div className="flex flex-col gap-3 mt-2 border-t border-gray-150 pt-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-gold-dark" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">ISO 22000 & HACCP Compliant Facilities</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-gold-dark" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Halal Certified Ingredients</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-gold-dark" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Spices Board of India Registered Exporter</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {compliances.map((item, index) => (
              <div key={index} className="p-5 border border-gray-100 bg-gray-55/20 flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase font-bold text-charcoal">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
