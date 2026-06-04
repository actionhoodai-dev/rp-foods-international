"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  companyName: string;
  phone: string;
}

export default function Header({ companyName, phone }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Check if current page is the homepage. We can make the header transparent only on the homepage Hero.
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Logic to determine text and bg colors based on scroll and page
  const headerBg = isScrolled 
    ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-4" 
    : isHome 
      ? "bg-transparent py-6" 
      : "bg-white border-b border-gray-100 py-5";

  const textColor = isScrolled
    ? "text-charcoal hover:text-maroon"
    : isHome
      ? "text-white/90 hover:text-white"
      : "text-charcoal hover:text-maroon";

  const logoColor = isScrolled
    ? "text-maroon"
    : isHome
      ? "text-white"
      : "text-maroon";

  const activeLinkClass = (href: string) => {
    const isActive = pathname === href;
    if (isActive) {
      return isScrolled || !isHome
        ? "text-maroon font-semibold border-b-2 border-maroon pb-1"
        : "text-gold font-semibold border-b-2 border-gold pb-1";
    }
    return "";
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`p-1.5 rounded bg-maroon text-gold transition-colors duration-300 ${isScrolled ? "bg-maroon" : isHome ? "bg-white/10 border border-white/20" : "bg-maroon"}`}>
              <Globe className="h-6 w-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-wider font-heading leading-tight transition-colors duration-300 ${logoColor}`}>
                {companyName}
              </span>
              <span className={`text-[9px] uppercase tracking-widest transition-colors duration-300 ${isScrolled ? "text-gray-500" : isHome ? "text-white/65" : "text-gray-500"}`}>
                Global Export Excellence
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm tracking-wide transition-all duration-300 ${textColor} ${activeLinkClass(link.href)}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/contact">
              <Button 
                className="rounded-none font-semibold tracking-wider text-xs uppercase px-6 py-5 bg-maroon text-white hover:bg-maroon-dark border-none transition-all duration-300"
              >
                Get Quotation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburguer Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className={`h-6 w-6 ${isHome && !isScrolled && !isOpen ? "text-white" : "text-charcoal"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isHome && !isScrolled ? "text-white" : "text-charcoal"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-x-0 bottom-0 top-[70px] z-50 flex flex-col p-6 animate-in fade-in slide-in-from-top duration-300 border-t border-gray-100 overflow-y-auto"
          style={{ backgroundColor: "#ffffff" }}
        >
          <nav className="flex flex-col gap-6 text-lg font-semibold text-charcoal">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`pb-2 border-b border-gray-100 hover:text-maroon ${pathname === link.href ? "text-maroon font-bold" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-8 flex flex-col gap-4">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Contact Exporters</p>
            <p className="text-sm font-bold text-maroon">{phone}</p>
            
            <Link href="/contact" onClick={() => setIsOpen(false)} className="w-full">
              <Button className="w-full bg-maroon hover:bg-maroon-dark text-white rounded-none py-6 font-semibold uppercase tracking-wider text-xs">
                Inquire Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
