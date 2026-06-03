import Link from "next/link";
import { Phone, Mail, MapPin, Globe } from "lucide-react";
import { CompanySettings } from "@/types";

/* Inline SVG social icons — lucide-react no longer ships brand icons */
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

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
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-4">
              {settings.socialLinks.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors duration-200" aria-label="Facebook">
                  <FacebookIcon className="h-5 w-5" />
                </a>
              )}
              {settings.socialLinks.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors duration-200" aria-label="Twitter">
                  <TwitterIcon className="h-5 w-5" />
                </a>
              )}
              {settings.socialLinks.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors duration-200" aria-label="Instagram">
                  <InstagramIcon className="h-5 w-5" />
                </a>
              )}
              {settings.socialLinks.linkedin && (
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors duration-200" aria-label="LinkedIn">
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              )}
            </div>
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
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings.address}</span>
              </li>
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
