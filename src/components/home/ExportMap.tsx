"use"
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ship, Anchor, Globe, CheckCircle } from "lucide-react";

interface RegionInfo {
  name: string;
  countries: string[];
  ports: string[];
  transitTime: string;
  description: string;
}

export default function ExportMap() {
  const [activeRegion, setActiveRegion] = useState<string>("Middle East");

  const regions: Record<string, RegionInfo> = {
    "Middle East": {
      name: "Middle East",
      countries: ["United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain"],
      ports: ["Jebel Ali Port (Dubai)", "Dammam Port", "Hamad Port (Doha)", "Shuaiba Port"],
      transitTime: "7 - 12 Days (FCL / LCL)",
      description: "Our largest export market. We supply clean spice powders and premium masalas certified for GSO standard compliance."
    },
    "Europe": {
      name: "Europe",
      countries: ["United Kingdom", "Germany", "France", "Netherlands", "Italy", "Belgium"],
      ports: ["Port of Rotterdam", "Port of Felixstowe", "Port of Hamburg", "Port of Antwerp"],
      transitTime: "22 - 28 Days (FCL / LCL)",
      description: "Highly regulated market. All spice batches undergo strict validation for microbiological limits and pesticide residue checks before sailing."
    },
    "Asia": {
      name: "Asia",
      countries: ["Singapore", "Malaysia", "Maldives", "Sri Lanka", "Vietnam"],
      ports: ["Port of Singapore", "Port Klang (Kuala Lumpur)", "Port of Colombo", "Male Port"],
      transitTime: "5 - 8 Days (FCL / LCL)",
      description: "Fast transit routes connecting Tamil Nadu to ASEAN markets. Custom high-barrier packaging prevents moisture ingress."
    },
    "Africa": {
      name: "Africa",
      countries: ["South Africa", "Mauritius", "Seychelles", "Kenya"],
      ports: ["Port of Durban", "Port Louis", "Port of Mombasa"],
      transitTime: "14 - 18 Days (FCL)",
      description: "Growing demand for ethnic blends. We supply Indian non-veg mixes and sambar powders to retail packaging standards."
    },
    "North America": {
      name: "North America",
      countries: ["United States", "Canada"],
      ports: ["Port of New York & New Jersey", "Port of Los Angeles", "Port of Vancouver", "Port of Montreal"],
      transitTime: "28 - 35 Days (FCL / LCL)",
      description: "Compliance with FDA requirements. We support custom labeling, UPC coding, and private brand packaging."
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-16">
          <span className="text-gold font-bold text-xs uppercase tracking-widest">
            International Trade Routes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-charcoal">
            Export Markets & Ports Served
          </h2>
          <p className="text-gray-500 text-sm max-w-2xl mt-2 leading-relaxed">
            Strategically located near major southern ports (Tuticorin, Chennai, and Cochin), we offer swift and competitive sea freight connections across all major global continents.
          </p>
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Regions Selector List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {Object.keys(regions).map((key) => {
              const isActive = activeRegion === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveRegion(key)}
                  className={`text-left p-6 border transition-all duration-300 flex items-center justify-between rounded-none ${
                    isActive 
                      ? "bg-maroon text-white border-maroon shadow-md" 
                      : "bg-neutral-bg text-charcoal border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe className={`h-5 w-5 ${isActive ? "text-gold" : "text-gray-400"}`} />
                    <span className="font-heading font-semibold text-base uppercase tracking-wide">
                      {key}
                    </span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-1 ${isActive ? "bg-white/15 text-gold" : "bg-gray-200 text-gray-500"}`}>
                    Active Route
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Display Info Card & World Map visualization (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-bg border border-gray-200 p-8 sm:p-10 flex flex-col gap-6 relative min-h-[420px] justify-between">
            
            {/* Background Slanted Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full pointer-events-none" />

            <motion.div
              key={activeRegion}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h3 className="text-2xl font-bold font-heading text-maroon mb-2">
                  {regions[activeRegion].name} Export Operations
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {regions[activeRegion].description}
                </p>
              </div>

              {/* Transit & Port Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                
                {/* Ports */}
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-dark">
                    <Anchor className="h-4 w-4" /> Primary Destination Ports
                  </span>
                  <ul className="flex flex-col gap-1.5">
                    {regions[activeRegion].ports.map((port) => (
                      <li key={port} className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-maroon shrink-0" /> {port}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Transit time & Countries */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-dark">
                      <Ship className="h-4 w-4" /> Average Sea Transit
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      {regions[activeRegion].transitTime}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Target Nations
                    </span>
                    <p className="text-[11px] text-gray-600 leading-normal font-medium">
                      {regions[activeRegion].countries.join(", ")}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Quick logistics note */}
            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider border-t border-gray-200 pt-4">
              * FOB, CFR, CIF shipping options supported based on Incoterms 2020 rules.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
