import Link from "next/link";
import { ArrowRight, Mail, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InquiryCTA() {
  const segments = [
    { name: "Importers & Wholesalers", desc: "Container load shipments of single spices and customized masalas with complete customs and phytosanitary certificates." },
    { name: "Retail & Supermarket Chains", desc: "Premium stand-up pouches and box packaging with barcode registration (UPC/EAN) and private labeling support." },
    { name: "Food Manufacturers & Processors", desc: "Bulk spice ingredients shipped in heavy-duty multi-layer PP bags for commercial culinary production." }
  ];

  return (
    <section className="bg-gradient-to-br from-[#4A0A12] to-[#2F060B] text-white py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/banners/world-map-grid.svg')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Block (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-gold font-bold text-xs uppercase tracking-widest">
              Global Partnerships
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white leading-tight">
              Partner With a Trusted Indian Export Manufacturer
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Whether you are looking to source spices under our established brand name, distribute our packaged products, or custom-mill raw materials for your processing plant, we have the manufacturing scale and compliance capability to deliver.
            </p>

            <div className="flex flex-col gap-4 mt-4">
              {segments.map((seg) => (
                <div key={seg.name} className="flex gap-4 border-l-2 border-gold/40 pl-6 py-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-bold font-heading text-gold">{seg.name}</h3>
                    <p className="text-xs text-gray-300 leading-normal">{seg.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Block (5 cols): Elegant Contact Details & Action Widget */}
          <div className="lg:col-span-5 bg-white text-charcoal p-8 sm:p-10 border border-gray-100 shadow-2xl flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-bold font-heading text-maroon mb-2">Export Desk Inquiry</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Connect directly with our international trading representatives. We reply to official inquiries within 1 business day.
              </p>
            </div>

            <div className="flex flex-col gap-4 py-4 border-y border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-maroon/5 rounded text-maroon shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">Call Exporter Desk</span>
                  <span className="text-sm font-bold text-charcoal hover:text-maroon transition-colors">+91 8778522332</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 bg-maroon/5 rounded text-maroon shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">Email Inquiry</span>
                  <a href="mailto:rpfoodspowder@gmail.com" className="text-sm font-bold text-charcoal hover:text-maroon transition-colors">rpfoodspowder@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 bg-maroon/5 rounded text-maroon shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">Operating Hours</span>
                  <span className="text-xs font-semibold text-gray-600">09:00 AM – 06:00 PM (IST)</span>
                </div>
              </div>
            </div>

            <Link href="/contact" className="w-full">
              <Button className="w-full bg-maroon hover:bg-maroon-dark text-white rounded-none py-6 font-semibold uppercase tracking-wider text-xs shadow-lg">
                Submit Inquiry Form <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
