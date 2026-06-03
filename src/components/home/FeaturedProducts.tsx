"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  // Take first 4 products for showcase if list is long
  const featured = products.slice(0, 4);

  const defaultImages: Record<string, string> = {
    "sambar-powder": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400",
    "chilli-powder": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400",
    "chicken-65-powder": "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400",
    "garam-masala": "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=400",
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col gap-2">
            <span className="text-gold font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> High-Demand Selection
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-charcoal">
              Featured Export Products
            </h2>
          </div>
          <Link href="/products">
            <Button variant="outline" className="border-maroon text-maroon hover:bg-maroon hover:text-white rounded-none uppercase font-semibold text-xs tracking-wider px-6 py-5">
              View Full Catalog <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((prod, i) => {
            const imageSrc = prod.images?.[0]?.startsWith("http") 
              ? prod.images[0] 
              : (defaultImages[prod.slug] || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400");

            return (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-square bg-gray-50 border-b border-gray-100">
                  <img 
                    src={imageSrc} 
                    alt={prod.name} 
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-maroon text-white font-bold text-[9px] uppercase tracking-wider px-2 py-1">
                    Premium Quality
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-6 flex flex-col flex-grow gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold-dark">
                    {prod.categoryId === "cat_spice_powders" ? "Spice Powder" : prod.categoryId === "cat_masalas" ? "Masala Blend" : "Non-Veg Blend"}
                  </span>
                  
                  <h3 className="text-lg font-bold font-heading text-charcoal group-hover:text-maroon transition-colors duration-300">
                    {prod.name}
                  </h3>

                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                    {prod.shortDescription}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      Export Packings
                    </span>
                    <span className="text-xs font-semibold text-charcoal">
                      100g - Bulk PP Bags
                    </span>
                  </div>
                </div>

                {/* Clickable Area */}
                <Link href={`/products/${prod.slug}`} className="absolute inset-0 z-10" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
