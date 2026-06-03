import { Leaf, ShieldCheck, Truck, RotateCcw, HeartHandshake, Globe } from "lucide-react";

export default function WhyChooseUs() {
  const points = [
    {
      icon: Leaf,
      title: "Premium Ingredients",
      desc: "We source raw spices directly from verified regional cultivators in Erode (Turmeric), Salem, and Guntur (Chillies), ensuring top quality batches."
    },
    {
      icon: ShieldCheck,
      title: "Export Quality Standards",
      desc: "Our processing facilities adhere to ISO 22000, HACCP, and Halal certifications, passing strict microbiological & heavy metal checks."
    },
    {
      icon: Truck,
      title: "Reliable Logistics",
      desc: "We offer end-to-end global supply chain fulfillment, offering customized shipping documentation, port coordination, and tracking."
    },
    {
      icon: RotateCcw,
      title: "Consistent Product Quality",
      desc: "By grinding at controlled cold temperatures, we prevent loss of volatile essential oils, maintaining uniform taste, aroma, and color."
    },
    {
      icon: HeartHandshake,
      title: "Customer Focus",
      desc: "We offer tailored packaging options, private labeling services, and flexible minimum order quantities (MOQs) for corporate clients."
    },
    {
      icon: Globe,
      title: "Global Reach",
      desc: "Exporting across Europe, Asia, North America, and the Middle East, we understand regional custom regulations and standards."
    }
  ];

  return (
    <section className="py-24 bg-neutral-bg">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-bold text-xs uppercase tracking-widest block mb-2">
            Why RP Foods International
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-charcoal mb-4">
            Our Pillars of Export Excellence
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            We are dedicated to building long-term trading partnerships with global distributors and food brands by maintaining integrity, safety, and sensory quality.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((pt, i) => {
            const Icon = pt.icon;
            
            return (
              <div 
                key={i} 
                className="bg-white p-8 border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4 relative group"
              >
                {/* Accent border on hover */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div className="p-3 rounded-full bg-maroon/5 text-maroon w-fit">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-bold font-heading text-charcoal group-hover:text-maroon transition-colors duration-300">
                  {pt.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
