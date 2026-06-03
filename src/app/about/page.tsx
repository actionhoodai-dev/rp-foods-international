import { Globe, Award, ShieldCheck, HeartHandshake, Leaf, Ship, ChevronRight } from "lucide-react";
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
  hero: {
    title: "",
    subtitle: ""
  },
  about: {
    title: "Pioneering Indian Food Export Since Inception",
    story: "RP Foods International is a premier exporter and manufacturer of high-quality spice powders and masalas based in Dindigul, Tamil Nadu. Committed to delivering the rich heritage of Indian flavors to kitchens worldwide, we maintain rigorous processing quality, authentic taste profiles, and modern hygienic packaging standards to satisfy global expectations.",
    mission: "To process and supply premium, hygienic, and pure spice blends across international borders, establishing Indian agricultural and manufacturing excellence globally.",
    vision: "To become the preferred global partner for authentic Indian spices, trusted by importers, supermarkets, and food services worldwide for consistency, quality, and food safety standards."
  },
  footer: {
    copyright: "",
    text: ""
  },
  seo: {
    metaTitle: "About RP Foods International - Certified Spice Manufacturers",
    metaDescription: "Learn more about RP Foods International based in Dindigul, Tamil Nadu. Premium certified food exporters shipping turmeric, chilli, sambar, and non-veg blends.",
    keywords: ""
  }
};

export async function generateMetadata() {
  return {
    title: "About Us - International Spice Exporter Credentials",
    description: "Learn more about RP Foods International: our quality standards, hygienic milling processes, global footprints, and commitments to food safety.",
  };
}

export default async function AboutPage() {
  const settings = await getCompanySettings() || defaultSettings;

  const highlights = [
    { icon: Leaf, title: "Clean Sourcing", desc: "We purchase turmeric fingers and dried red chillies directly from agricultural auctions in Salem, Erode, and Guntur, selecting only premium quality crop." },
    { icon: Award, title: "Hygienic Dehydration & Milling", desc: "Our materials are washed, steam-sterilized, and milled in clean dust-free facilities at low temperatures, retaining natural volatile oils." },
    { icon: ShieldCheck, title: "Microbiological Cleared", desc: "Every batch is audited for Aflatoxin, Ochratoxin, Salmonella, and heavy metals to ensure compliance with strict FDA and GSO boundaries." },
    { icon: Ship, title: "Global Sea Logistics", desc: "Located near Southern Indian sea channels (Tuticorin & Cochin), we ship FCL and LCL shipments across container terminals worldwide." }
  ];

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      
      {/* Banner */}
      <div className="relative py-24 mb-16 bg-cover bg-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1600')]">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/40" />
        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col gap-2 text-white">
            <span className="text-gold font-bold text-xs uppercase tracking-widest">
              Who We Are
            </span>
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-white">
              About RP Foods International
            </h1>
            <p className="text-gray-300 text-sm max-w-2xl mt-1 leading-relaxed">
              Serving international food buyers, importers, and retail supermarket chains with certified Indian spice excellence.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Core Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-maroon">
              {settings.about.title}
            </h2>
            
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {settings.about.story}
            </p>

            <p className="text-gray-600 text-sm leading-relaxed">
              We leverage Dindigul’s ideal regional proximity to major red chilli cultivation clusters in Guntur and Salem’s turmeric processing auctions to procure prime quality raw material. Our team manages washing, hygienic sun-drying/solar-dehydration, and multi-stage pulverizing processes to maintain sensory purity.
            </p>

            <div className="border-l-4 border-gold bg-neutral-bg p-6 my-2 italic text-gray-700 text-xs font-semibold">
              &quot;We don&apos;t just export products; we export the authentic culinary heritage of India with verified international food safety standards.&quot;
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -top-4 -left-4 w-72 h-72 border-8 border-maroon/10 -z-10" />
            <div className="overflow-hidden border border-gray-100 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800" 
                alt="Spice processing & hygiene sorting" 
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

        </div>

        {/* Highlight pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24 border-t border-gray-100 pt-16">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex flex-col gap-3">
                <div className="p-3 bg-maroon/5 text-maroon w-fit rounded-full">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold font-heading text-charcoal">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Mission and Vision: Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-gray-100 py-16 mb-16">
          <div className="bg-neutral-bg p-8 border-l-4 border-maroon flex flex-col gap-3">
            <h3 className="text-lg font-bold font-heading uppercase text-maroon tracking-wider">
              Our Corporate Mission
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {settings.about.mission}
            </p>
          </div>

          <div className="bg-neutral-bg p-8 border-l-4 border-gold flex flex-col gap-3">
            <h3 className="text-lg font-bold font-heading uppercase text-gold-dark tracking-wider">
              Our Corporate Vision
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {settings.about.vision}
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-charcoal text-white p-8 sm:p-12 text-center flex flex-col items-center gap-4 border border-gray-800 relative">
          <h3 className="text-xl sm:text-2xl font-bold font-heading">Ready to Source Verified Quality Spices?</h3>
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
            Request official specification certificates, microbiological sheets, crop reports, or sample shipments to verify our manufacturing quality before ordering.
          </p>
          <Link href="/contact" className="mt-2">
            <button className="bg-maroon hover:bg-maroon-dark text-white rounded-none uppercase font-semibold text-xs tracking-wider px-8 py-4 shadow-md flex items-center gap-1.5 transition-colors">
              Contact Trading Desk <ChevronRight className="h-4 w-4" />
            </button>
          </Link>
        </div>

      </div>

    </div>
  );
}
