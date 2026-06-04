import Link from "next/link";
import { Phone, Mail, Globe } from "lucide-react";
import { CompanySettings } from "@/types";


interface FooterProps {
  settings: CompanySettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1C1C1C] text-white/80 pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Company Brief */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-maroon text-gold">
                <Globe className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-wider font-heading text-white">
                {settings.name}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mt-2">
              {settings.footer.text}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-heading font-semibold tracking-wider text-base uppercase relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gold">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-gold transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold transition-colors duration-200">Our Products</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors duration-200">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors duration-200">Contact Exporters</Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-heading font-semibold tracking-wider text-base uppercase relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gold">
              Categories
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/products?category=spice-powders" className="hover:text-gold transition-colors duration-200">Spice Powders</Link>
              </li>
              <li>
                <Link href="/products?category=masalas" className="hover:text-gold transition-colors duration-200">Masalas</Link>
              </li>
              <li>
                <Link href="/products?category=non-veg-blends" className="hover:text-gold transition-colors duration-200">Non-Veg Blends</Link>
              </li>
            </ul>
          </div>

          {/* Address & Contact info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-heading font-semibold tracking-wider text-base uppercase relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gold">
              Contact Details
            </h3>
            <ul className="flex flex-col gap-3.5 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold shrink-0" />
                <div>
                  {settings.phoneNumbers.map((num, i) => (
                    <span key={num} className="block hover:text-white transition-colors">
                      {num} {i < settings.phoneNumbers.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors truncate">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex flex-col gap-1">
            <p>{settings.footer.copyright}</p>
            <p className="text-[10px] text-gray-600 font-semibold tracking-wide uppercase">Developed by Actionhood AI</p>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
