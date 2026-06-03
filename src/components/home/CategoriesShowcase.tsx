"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Category } from "@/types";

interface CategoriesShowcaseProps {
  categories: Category[];
}

export default function CategoriesShowcase({ categories }: CategoriesShowcaseProps) {
  // Fallback images in case seeded Cloudinary assets aren't yet populated
  const defaultImages: Record<string, string> = {
    "spice-powders": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    "masalas": "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=600",
    "non-veg-blends": "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600"
  };

  return (
    <section className="py-24 bg-neutral-bg">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col gap-2">
            <span className="text-gold font-bold text-xs uppercase tracking-widest">
              Export Range
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-charcoal">
              Product Categories
            </h2>
          </div>
          <p className="text-gray-500 text-sm max-w-md font-medium leading-relaxed">
            Our product lines are scaled to meet strict international phytosanitary rules and custom packaging specifications for global importers.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => {
            const imageSrc = cat.image?.startsWith("http") ? cat.image : (defaultImages[cat.slug] || defaultImages["spice-powders"]);
            
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative h-[400px] overflow-hidden bg-charcoal border border-gray-200 shadow-lg cursor-pointer"
              >
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-90" />
                
                <img 
                  src={imageSrc} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end gap-3 text-white">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs uppercase tracking-widest text-gold font-bold">
                      {cat.productCount || 0} Products
                    </span>
                    <div className="p-1.5 rounded-full bg-white/10 text-white group-hover:bg-gold group-hover:text-charcoal transition-all duration-300">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold font-heading group-hover:text-gold transition-colors duration-300">
                    {cat.name}
                  </h3>

                  <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cat.description}
                  </p>

                  <Link href={`/products?category=${cat.slug}`} className="absolute inset-0 z-30" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
