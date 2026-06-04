"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // GSAP entry reveal animation
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
      );
    }
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden text-white pt-24 pb-32">
      {/* Background Image generated from Gemini */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/home_hero.png')" }}
      />
      {/* Gradient overlay to ensure text readability and match premium branding */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4A0A12]/95 via-[#2F060B]/90 to-[#1C1C1C]/95 mix-blend-multiply" />
      
      {/* Background World Map Vector Grid Overlay */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/banners/world-map-grid.svg')] bg-cover bg-center mix-blend-overlay scale-105"
      />

      {/* Floating subtle spice leaf/seed assets */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[10%] w-16 h-16 opacity-40 md:opacity-60 pointer-events-none hidden sm:block"
      >
        <img 
          src="/images/star_anise.png" 
          alt="Star Anise" 
          className="w-full h-full object-contain mix-blend-screen"
        />
      </motion.div>

      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-[10%] w-20 h-20 opacity-40 md:opacity-60 pointer-events-none hidden sm:block"
      >
        <img 
          src="/images/red_chilli.png" 
          alt="Red Chilli" 
          className="w-full h-full object-contain mix-blend-screen"
        />
      </motion.div>

      {/* Premium Content Overlay */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-gold text-xs uppercase tracking-widest font-semibold mb-6 shadow-2xl backdrop-blur-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse" />
          Premium Spice Exporters & Manufacturers
        </motion.div>

        <h1 
          ref={titleRef}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading tracking-tight leading-[1.1] mb-6 select-none text-white"
        >
          RP Foods <span className="text-gold block sm:inline">International</span>
        </h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-300 font-normal leading-relaxed max-w-3xl mx-auto mb-10"
        >
          Delivering Authentic Indian Spice Excellence & Export Quality Spices Across Global Markets.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link href="/products" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-maroon text-white hover:bg-maroon-dark border border-maroon hover:border-maroon-dark rounded-none font-semibold tracking-wider uppercase text-xs px-8 py-6 shadow-lg transition-all duration-300">
              Explore Our Products <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          
          <Link href="/contact" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-white/20 hover:border-white text-white hover:bg-white hover:text-charcoal bg-transparent rounded-none font-semibold tracking-wider uppercase text-xs px-8 py-6 transition-all duration-300">
              Request Export Quotation <FileText className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Floating Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-xs uppercase tracking-widest font-semibold text-gray-400"
        >
          <div className="flex flex-col gap-1 items-center">
            <span className="text-white font-bold text-sm tracking-normal">ISO 22000</span>
            <span>Food Safety</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-white font-bold text-sm tracking-normal">100% PURE</span>
            <span>Unadulterated</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-white font-bold text-sm tracking-normal">GLOBAL SHIPPING</span>
            <span>Custom Logistics</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-white font-bold text-sm tracking-normal">HALAL CERTIFIED</span>
            <span>Standard Compliance</span>
          </div>
        </motion.div>
      </div>

      {/* Elegant bottom angle divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white pointer-events-none clip-path-slant" />
    </section>
  );
}
