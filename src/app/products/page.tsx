import { getCategories, getProducts } from "@/lib/firebase/db";
import ProductGrid from "@/components/products/ProductGrid";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata() {
  return {
    title: "Our Premium Spice Powders & Masalas Range",
    description: "Explore the comprehensive export catalog of RP Foods International including Sambar Powder, Chilli Powder, Turmeric, Garam Masala, and Chicken 65 mixes.",
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // 1. Resolve searchParams asynchronously (Next.js 15 Requirement)
  const resolvedSearchParams = await searchParams;
  const initialCategorySlug = resolvedSearchParams.category || null;

  // 2. Fetch categories and products from Firestore
  const categories = await getCategories(true); // only active categories
  const products = await getProducts(undefined, true); // only published products

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      
      {/* Banner / Header */}
      <div className="relative py-24 mb-12 bg-cover bg-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1596790011462-843069609025?auto=format&fit=crop&q=80&w=1600')]">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/40" />
        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col gap-2 text-white">
            <span className="text-gold font-bold text-xs uppercase tracking-widest">
              RP Foods International Catalog
            </span>
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-white">
              Export Product Registry
            </h1>
            <p className="text-gray-300 text-sm max-w-2xl mt-1 leading-relaxed">
              We process and mill our whole spices at low temperatures to ensure consistent volatile oil retention, offering customized moisture barrier pouches and multi-layer bulk packs.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Controls & Registry */}
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <ProductGrid 
          products={products} 
          categories={categories} 
          initialCategorySlug={initialCategorySlug} 
        />
      </div>

    </div>
  );
}
