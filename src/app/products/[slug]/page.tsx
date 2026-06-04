import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Shield, Award, Package, Clock } from "lucide-react";
import { getProductBySlug, getProducts, getCategories } from "@/lib/firebase/db";
import ProductInquiryForm from "@/components/products/ProductInquiryForm";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.seo.title || product.name} - Exporter`,
    description: product.seo.description || product.shortDescription,
    keywords: product.seo.keywords || `${product.name}, indian spices export, pure spices`,
    openGraph: {
      title: product.seo.title || product.name,
      description: product.seo.description || product.shortDescription,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    }
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  // 1. Resolve params asynchronously (Next.js 15 Requirement)
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // 2. Fetch categories and related products for cross-linking
  const categories = await getCategories(true);
  const category = categories.find(c => c.id === product.categoryId);
  
  const allRelated = await getProducts(product.categoryId, true);
  const relatedProducts = allRelated
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  // Fallback image
  const defaultImage = "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600";
  const mainImage = product.images?.[0] || defaultImage;

  // JSON-LD structured data for SEO (Product Schema & Breadcrumb Schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [defaultImage],
    "description": product.shortDescription,
    "category": category?.name || "Spices",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "offeredBy": {
        "@type": "Organization",
        "name": "RP Foods International",
        "email": "rpfoodspowder@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "51B/141, Kumaran Thiru Nagar",
          "addressLocality": "Dindigul",
          "addressRegion": "Tamil Nadu",
          "postalCode": "624005",
          "addressCountry": "India"
        }
      }
    }
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      {/* Inject SEO JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-8">
          <Link href="/" className="hover:text-maroon transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-maroon transition-colors">Products</Link>
          <ChevronRight className="h-3 w-3" />
          {category && (
            <>
              <Link href={`/products?category=${category.slug}`} className="hover:text-maroon transition-colors">
                {category.name}
              </Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="text-gray-600 truncate">{product.name}</span>
        </div>

        {/* Product Core Intro Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-20">
          
          {/* Left Column: Image display */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden bg-gray-50 border border-gray-100 shadow-md">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-maroon text-white text-[9px] uppercase tracking-widest font-extrabold px-3 py-1.5 shadow-md">
                Certified Export Grade
              </div>
            </div>

            {/* Thumbnail preview list (if multiple images exist) */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <div key={idx} className="aspect-square border border-gray-200 overflow-hidden bg-gray-50 cursor-pointer hover:border-maroon transition-colors">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Brief information & Action triggers */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-gold font-bold text-xs uppercase tracking-widest">
                {category?.name || "Pure Blend"}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal leading-tight">
                {product.name}
              </h1>
            </div>

            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Micro badges of credentials */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-maroon shrink-0" />
                <span className="text-xs font-semibold text-gray-700">100% Pure, Untouched</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-maroon shrink-0" />
                <span className="text-xs font-semibold text-gray-700">Premium Export Quality</span>
              </div>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-maroon shrink-0" />
                <span className="text-xs font-semibold text-gray-700">Export Pouches & Sacks</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-maroon shrink-0" />
                <span className="text-xs font-semibold text-gray-700">12 Months Shelf Life</span>
              </div>
            </div>

            {/* Quick specifications summary */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Quick specifications</span>
              <ul className="flex flex-col gap-2">
                {product.specifications?.slice(0, 3).map((spec) => (
                  <li key={spec.label} className="text-xs font-medium text-gray-600">
                    <strong className="text-charcoal font-bold">{spec.label}:</strong> {spec.value}
                  </li>
                ))}
              </ul>
            </div>

            <a href="#inquiry-form-section">
              <button className="bg-maroon hover:bg-maroon-dark text-white rounded-none uppercase font-semibold text-xs tracking-wider px-8 py-5 w-full sm:w-auto shadow-md">
                Request Specifications Sheet
              </button>
            </a>
          </div>

        </div>

        {/* Detailed Information Tabs / Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-gray-100 pt-16 mb-20">
          
          {/* Main Content Columns: Desc, Applications, Benefits (8 cols equiv in a 3-col layout) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Description */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-bold font-heading text-maroon border-b border-gray-100 pb-2">
                Product Overview
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {product.fullDescription}
              </p>
            </div>

            {/* Benefits & Applications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="flex flex-col gap-3">
                <h4 className="text-base font-bold font-heading text-charcoal border-b border-gray-100 pb-2">
                  Key Culinary Applications
                </h4>
                <ul className="list-disc pl-5 text-xs text-gray-600 leading-relaxed flex flex-col gap-2">
                  {product.applications?.map((app, i) => (
                    <li key={i}>{app}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-base font-bold font-heading text-charcoal border-b border-gray-100 pb-2">
                  Key Benefits & Highlights
                </h4>
                <ul className="list-disc pl-5 text-xs text-gray-600 leading-relaxed flex flex-col gap-2">
                  {product.benefits?.map((ben, i) => (
                    <li key={i}>{ben}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Packaging Standards */}
            <div className="flex flex-col gap-3 pt-4">
              <h3 className="text-xl font-bold font-heading text-maroon border-b border-gray-100 pb-2">
                Export Packaging Standards
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed mb-2">
                To guarantee maximum shelf-life and prevention of flavor migration during transit, we pack our spices in modern high-barrier laminates:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.packagingDetails?.map((pkg, idx) => (
                  <div key={idx} className="p-3 bg-neutral-bg text-xs font-semibold text-gray-700 border-l-2 border-gold">
                    {pkg}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Tech Specs table (4 cols equiv in a 3-col layout) */}
          <div className="lg:col-span-1 bg-neutral-bg p-8 border border-gray-200">
            <h3 className="text-lg font-bold font-heading text-charcoal border-b border-gray-200 pb-3 mb-4 uppercase tracking-wider">
              Technical Specifications
            </h3>
            
            <Table>
              <TableBody>
                {product.specifications?.map((spec) => (
                  <TableRow key={spec.label} className="border-b border-gray-200/60 hover:bg-transparent">
                    <TableCell className="font-bold text-xs text-charcoal py-3 px-1">
                      {spec.label}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 text-right py-3 px-1 font-medium">
                      {spec.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="bg-white p-4 border border-gray-200/80 mt-6 text-[10px] text-gray-400 leading-relaxed">
              * Official certificate of analysis (COA) is enclosed with every export consignment shipment. Specific client tolerances can be accommodated upon request.
            </div>
          </div>

        </div>

        {/* Inquiry Section Form */}
        <div id="inquiry-form-section" className="mb-20 max-w-4xl mx-auto scroll-mt-28">
          <ProductInquiryForm productName={product.name} productSlug={product.slug} />
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-100 pt-16">
            <h3 className="text-2xl font-bold font-heading text-charcoal mb-8 text-center">
              Related Spices & Blends
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => {
                const img = rel.images?.[0] || defaultImage;
                return (
                  <div key={rel.id} className="group bg-white border border-gray-100 flex flex-col hover:shadow-lg transition-all duration-300 relative">
                    <div className="aspect-square overflow-hidden bg-gray-50 border-b border-gray-100">
                      <img src={img} alt={rel.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4 flex flex-col gap-1">
                      <h4 className="text-sm font-bold font-heading text-charcoal group-hover:text-maroon transition-colors">
                        {rel.name}
                      </h4>
                      <p className="text-gray-500 text-[10px] line-clamp-1 leading-relaxed">
                        {rel.shortDescription}
                      </p>
                    </div>
                    <Link href={`/products/${rel.slug}`} className="absolute inset-0 z-10" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
