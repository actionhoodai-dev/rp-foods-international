import { Check } from "lucide-react";
import { CompanySettings } from "@/types";

interface AboutSectionProps {
  settings: CompanySettings;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  const standards = [
    "HACCP Food Safety Guidelines Certified",
    "ISO 22000 Quality Management Compliance",
    "100% Traceable Farming Source Premium Quality",
    "Pesticide & Heavy-Metal Cleared Batches",
    "State-of-the-Art Hygienic Dehydration & Milling",
    "Custom High-Barrier Export Grade Packaging"
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Storytelling Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left Column: Image/Badge Layout */}
          <div className="relative group">
            <div className="absolute -top-4 -left-4 w-72 h-72 border-8 border-gold/10 -z-10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2" />
            <div className="overflow-hidden border border-gray-100 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800" 
                alt="Indian Spice Plantation and Processing" 
                className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute bottom-6 -right-6 bg-maroon text-white p-6 shadow-2xl max-w-xs border border-maroon-dark">
              <p className="text-gold font-bold text-2xl mb-1">100% Pure</p>
              <p className="text-xs uppercase tracking-widest text-white/80 font-semibold leading-relaxed">
                Directly from source farms in Erode & Salem, processed under strict supervision.
              </p>
            </div>
          </div>

          {/* Right Column: About Details */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-gold font-bold text-xs uppercase tracking-widest">
                Our Story & Commitment
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-charcoal">
                {settings.about.title}
              </h2>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-base font-normal">
              {settings.about.story}
            </p>

            <p className="text-gray-600 leading-relaxed text-base font-normal">
              Based in Dindigul, Tamil Nadu, we bridge the gap between Indian agricultural producers and global food operators. We sanitize and grade our raw materials, milling them at controlled low temperatures to ensure the natural volatile essential oils and rich colors are fully preserved.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {standards.map((std) => (
                <div key={std} className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-maroon/5 text-maroon mt-0.5 shrink-0">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{std}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission and Vision: Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-16">
          <div className="bg-neutral-bg p-8 border-l-4 border-maroon">
            <h3 className="text-lg font-bold font-heading uppercase text-maroon tracking-wider mb-3">
              Our Mission
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {settings.about.mission}
            </p>
          </div>

          <div className="bg-neutral-bg p-8 border-l-4 border-gold">
            <h3 className="text-lg font-bold font-heading uppercase text-gold-dark tracking-wider mb-3">
              Our Vision
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {settings.about.vision}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
