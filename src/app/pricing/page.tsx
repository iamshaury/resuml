"use client";

import { motion } from "framer-motion";
import { Check } from "@phosphor-icons/react";

export default function PricingPage() {
  const plans = [
    {
      name: "Open Source",
      price: "$0",
      period: "forever",
      desc: "For local development and basic resume generation.",
      features: [
        "Local PDF export",
        "Basic resume parsing",
        "Standard layout templates",
        "Zero-storage parsing"
      ],
      isPro: false,
      cta: "View Source",
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      desc: "For serious professionals optimizing their career trajectory.",
      features: [
        "1536D Vector job matching",
        "Priority Gemini AI processing",
        "Unlimited parsed resumes",
        "Advanced embedding analytics"
      ],
      isPro: true,
      cta: "Upgrade to Pro",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen relative pt-32 pb-24 px-6 max-w-[1000px] mx-auto w-full">
      <div className="mb-20 text-center">
        <h1 className="font-serif text-5xl md:text-7xl mb-6">Transparent. Simple.</h1>
        <p className="text-text-muted text-xl max-w-2xl mx-auto font-light">
          Choose the plan that fits your professional trajectory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
            className={`p-10 flex flex-col h-full bg-surface/30 backdrop-blur-sm ${
              plan.isPro 
                ? 'border border-accent/50 relative' 
                : 'border border-border/50'
            }`}
          >
            {plan.isPro && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg px-4">
                <span className="monolabel text-accent uppercase tracking-widest text-[10px]">Recommended</span>
              </div>
            )}
            
            <div className="mb-8">
              <h3 className={`font-serif text-3xl mb-2 ${plan.isPro ? 'text-accent' : 'text-text-primary'}`}>
                {plan.name}
              </h3>
              <p className="text-text-muted text-sm">{plan.desc}</p>
            </div>

            <div className="mb-8 border-b border-border/50 pb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-sans font-light tracking-tight">{plan.price}</span>
                <span className="text-text-muted text-sm">/{plan.period}</span>
              </div>
            </div>

            <ul className="flex flex-col gap-4 mb-12 flex-1">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-3">
                  <Check className={`w-5 h-5 shrink-0 ${plan.isPro ? 'text-accent' : 'text-text-muted'}`} />
                  <span className="text-sm text-text-primary/90">{feature}</span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 text-sm font-medium transition-colors ${
              plan.isPro 
                ? 'bg-accent text-bg hover:bg-accent/90' 
                : 'bg-transparent border border-border hover:border-text-muted text-text-primary'
            }`}>
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
