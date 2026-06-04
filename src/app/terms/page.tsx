export async function generateMetadata() {
  return { title: "Terms of Service | RP Foods International" };
}

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      {/* Banner */}
      <div className="relative py-20 mb-12 bg-cover bg-center overflow-hidden bg-[url('/images/terms_hero.png')]">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/95 to-charcoal/40" />
        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10 text-white animate-fade-in">
          <span className="text-gold font-bold text-xs uppercase tracking-widest">
            Trading Desk Terms
          </span>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mt-1">
            Terms of Service
          </h1>
          <p className="text-gray-300 text-xs mt-1 uppercase tracking-widest font-semibold">
            Last Updated: June 2026
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        <div className="flex flex-col gap-6 text-sm text-gray-600 leading-relaxed font-normal">
          <p>
            Welcome to RP Foods International. By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.
          </p>

          <h2 className="text-lg font-bold font-heading text-charcoal mt-4">1. Export Trade Terms</h2>
          <p>
            All export pricing, consignment shipments, and trade operations are governed by Incoterms 2020 rules. Prices quoted are subject to market fluctuations and may be revised without prior notice. A formal proforma invoice will be issued upon confirmation of order specifications.
          </p>

          <h2 className="text-lg font-bold font-heading text-charcoal mt-4">2. Product Quality Standards</h2>
          <p>
            RP Foods International warrants that all exported spice powders and masalas meet the quality parameters stated in the accompanying Certificate of Analysis (COA). Claims regarding product quality must be raised within 14 days of cargo delivery at the port of discharge with supporting documentation.
          </p>

          <h2 className="text-lg font-bold font-heading text-charcoal mt-4">3. Minimum Order Quantities</h2>
          <p>
            Minimum order quantities (MOQs) vary based on product category and packaging type. Custom packaging and private labeling orders are subject to higher MOQs. Contact our export desk for specific MOQ information for your territory.
          </p>

          <h2 className="text-lg font-bold font-heading text-charcoal mt-4">4. Payment Terms</h2>
          <p>
            Payment terms are negotiated on a per-contract basis. Standard payment options include Letter of Credit (L/C), Telegraphic Transfer (T/T), and Documents against Payment (D/P). New clients may be required to provide advance payment for initial orders.
          </p>

          <h2 className="text-lg font-bold font-heading text-charcoal mt-4">5. Intellectual Property</h2>
          <p>
            All content on this website, including text, images, logos, and design elements, is the intellectual property of RP Foods International. Unauthorized reproduction or distribution of any content is strictly prohibited.
          </p>

          <h2 className="text-lg font-bold font-heading text-charcoal mt-4">6. Limitation of Liability</h2>
          <p>
            RP Foods International shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or our products. Our total liability shall not exceed the value of the specific consignment in question.
          </p>

          <h2 className="text-lg font-bold font-heading text-charcoal mt-4">7. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Dindigul, Tamil Nadu, India.
          </p>

          <h2 className="text-lg font-bold font-heading text-charcoal mt-4">8. Contact</h2>
          <p>
            For questions or clarifications regarding these terms, please contact us at <a href="mailto:rpfoodspowder@gmail.com" className="text-maroon hover:underline font-semibold">rpfoodspowder@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
