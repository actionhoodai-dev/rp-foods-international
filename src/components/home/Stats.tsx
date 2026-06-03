"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItemProps {
  targetValue: number;
  suffix: string;
  label: string;
}

function StatCounter({ targetValue, suffix, label }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000; // ms
    const increment = targetValue / (duration / 16); // ~60fps
    let timer: NodeJS.Timeout;

    const updateCounter = () => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
      } else {
        setCount(Math.ceil(start));
        timer = setTimeout(updateCounter, 16);
      }
    };

    updateCounter();
    return () => clearTimeout(timer);
  }, [isInView, targetValue]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 text-center border-r last:border-r-0 border-gray-100 last:border-none md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-extrabold font-heading text-maroon mb-2"
      >
        {count}
        <span className="text-gold">{suffix}</span>
      </motion.div>
      <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  const stats = [
    { targetValue: 15, suffix: "+", label: "Countries Served" },
    { targetValue: 50, suffix: "+", label: "Products Exported" },
    { targetValue: 120, suffix: "+", label: "Global Clients" },
    { targetValue: 500, suffix: "+", label: "Export Shipments" }
  ];

  return (
    <section className="relative z-20 bg-white py-12 -mt-16 sm:-mt-20 max-w-6xl mx-auto px-4">
      <div className="bg-white shadow-2xl border border-gray-100 rounded-none grid grid-cols-2 md:grid-cols-4 py-8">
        {stats.map((stat, index) => (
          <StatCounter
            key={index}
            targetValue={stat.targetValue}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>
    </section>
  );
}
