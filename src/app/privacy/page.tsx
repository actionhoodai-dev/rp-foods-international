export async function generateMetadata() {
  return { title: "Privacy Policy | RP Foods International" };
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      {/* Banner */}
      <div className="relative py-20 mb-12 bg-cover bg-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1600')]">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/95 to-charcoal/40" />
        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10 text-white animate-fade-in">
          <span className="text-gold font-bold text-xs uppercase tracking-widest">
            Corporate Trust
          </span>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mt-1">
            Privacy Policy
          </h1>
          <p className="text-gray-300 text-xs mt-1 uppercase tracking-widest font-semibold">
            Last Updated: June 2026
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        <div className="flex flex-col gap-6 text-sm text-gray-600 leading-relaxed font-normal">
          <p>
            At RP Foods International, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by RP Foods International and how we use it.
          </p>

          <h2 className="text-lg font-bold font-heading text-charcoal mt-4">1. Information We Collect</h2>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information. When you submit an export inquiry via our forms, we collect details including your name, email, phone number, company name, country of discharge, and packaging requirements to coordinate shipments.
          </p>

          <h2 className="text-lg font-bold font-heading text-charcoal mt-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Process and reply to bulk spice export inquiries.</li>
            <li>Coordinate sea freight shipping arrangements and export clearance documentation.</li>
            <li>Provide official crop analysis certificates, pricing sheets, or sample consignments.</li>
            <li>Send commercial notifications and updates regarding pricing fluctuations.</li>
          </ul>

          <h2 className="text-lg font-bold font-heading text-charcoal mt-4">3. Log Files & Analytics</h2>
          <p>
            RP Foods International follows a standard procedure of using log files and standard website analytics to monitor traffic. These logs collect IP addresses, browser types, ISPs, timestamps, and page visits. This data is not linked to any personally identifiable information and is used solely to study regional traffic trends.
          </p>

          <h2 className="text-lg font-bold font-heading text-charcoal mt-4">4. GDPR and CCPA Data Protection Rights</h2>
          <p>
            We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to request access to, correction of, or erasure of their personal inquiry logs. If you would like to exercise any of these rights, please contact our export desk at rpfoodspowder@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
}
