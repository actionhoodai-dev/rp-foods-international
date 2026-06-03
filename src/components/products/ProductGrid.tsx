"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Grid, List, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product, Category } from "@/types";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  initialCategorySlug?: string | null;
}

export default function ProductGrid({ products, categories, initialCategorySlug }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(initialCategorySlug || "all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Calculate filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // 1. Category Filter
      let matchesCategory = true;
      if (selectedCategorySlug !== "all") {
        const cat = categories.find(c => c.slug === selectedCategorySlug);
        matchesCategory = cat ? prod.categoryId === cat.id : true;
      }

      // 2. Search Filter
      const matchesSearch = 
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prod.specifications || []).some(spec => spec.value.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [products, categories, selectedCategorySlug, searchQuery]);

  // Default images lookup
  const defaultImages: Record<string, string> = {
    "sambar-powder": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400",
    "chilli-powder": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400",
    "chicken-65-powder": "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400",
    "garam-masala": "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=400",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Controls (Mobile Collapsed, Desktop Visible) */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Search */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase font-bold tracking-wider text-gray-400">Search Products</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search spices, masalas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-none border-gray-200 focus-visible:ring-maroon focus-visible:border-maroon"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Product Categories
          </label>
          <div className="flex flex-wrap lg:flex-col gap-2">
            <button
              onClick={() => setSelectedCategorySlug("all")}
              className={`text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider border transition-all duration-200 rounded-none flex justify-between items-center ${
                selectedCategorySlug === "all"
                  ? "bg-maroon text-white border-maroon"
                  : "bg-white text-charcoal border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span>All Products</span>
              <span className={`text-[10px] px-1.5 py-0.5 ${selectedCategorySlug === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {products.length}
              </span>
            </button>
            {categories.map((cat) => {
              const catProdCount = products.filter(p => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategorySlug(cat.slug)}
                  className={`text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider border transition-all duration-200 rounded-none flex justify-between items-center ${
                    selectedCategorySlug === cat.slug
                      ? "bg-maroon text-white border-maroon"
                      : "bg-white text-charcoal border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 ${selectedCategorySlug === cat.slug ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {catProdCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Grid Content Area (3 cols) */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        
        {/* Results Toolbar */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Showing {filteredProducts.length} of {products.length} Products
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 border transition-colors ${viewMode === "grid" ? "bg-maroon text-white border-maroon" : "bg-white text-gray-400 border-gray-200"}`}
              aria-label="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 border transition-colors ${viewMode === "list" ? "bg-maroon text-white border-maroon" : "bg-white text-gray-400 border-gray-200"}`}
              aria-label="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Products Results */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 bg-white">
            <p className="text-gray-400 text-sm font-semibold">No products matches your search filter.</p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategorySlug("all");
              }}
              variant="link"
              className="text-maroon text-xs uppercase font-bold mt-2 hover:no-underline"
            >
              Reset Filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              const imageSrc = prod.images?.[0]?.startsWith("http") 
                ? prod.images[0] 
                : (defaultImages[prod.slug] || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400");
              const categoryName = categories.find(c => c.id === prod.categoryId)?.name || "Spice Blend";

              return (
                <div key={prod.id} className="group bg-white border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300 relative">
                  <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-100">
                    <img
                      src={imageSrc}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-gold-dark font-extrabold">{categoryName}</span>
                    <h3 className="text-base font-bold font-heading text-charcoal group-hover:text-maroon transition-colors duration-300">
                      {prod.name}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
                      {prod.shortDescription}
                    </p>
                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Specifications
                      </span>
                      <span className="text-xs font-semibold text-charcoal flex items-center gap-1 group-hover:text-maroon">
                        Specs <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                  <Link href={`/products/${prod.slug}`} className="absolute inset-0 z-10" />
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Layout */
          <div className="flex flex-col gap-4">
            {filteredProducts.map((prod) => {
              const imageSrc = prod.images?.[0]?.startsWith("http") 
                ? prod.images[0] 
                : (defaultImages[prod.slug] || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400");
              const categoryName = categories.find(c => c.id === prod.categoryId)?.name || "Spice Blend";

              return (
                <div key={prod.id} className="group bg-white border border-gray-100 flex flex-col sm:flex-row hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="relative w-full sm:w-48 aspect-square sm:aspect-auto shrink-0 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-100">
                    <img
                      src={imageSrc}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-gold-dark font-extrabold">{categoryName}</span>
                      <h3 className="text-xl font-bold font-heading text-charcoal group-hover:text-maroon transition-colors duration-300">
                        {prod.name}
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed max-w-xl">
                        {prod.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-xs border-t border-gray-100 pt-4 mt-2">
                      <div>
                        <span className="text-gray-400 font-bold uppercase tracking-wider block text-[9px] mb-0.5">Origins</span>
                        <span className="font-semibold text-gray-700">Dindigul, Tamil Nadu</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold uppercase tracking-wider block text-[9px] mb-0.5">Packaging</span>
                        <span className="font-semibold text-gray-700">Custom Pouches / PP Bulk Bags</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/products/${prod.slug}`} className="absolute inset-0 z-10" />
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
