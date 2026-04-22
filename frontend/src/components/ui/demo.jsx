import React from 'react';
import { BrainCircuit, Gauge, ShieldCheck, SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FeatureCard } from '@/components/ui/grid-feature-cards';

const features = [
  {
    title: 'Instant Quotes',
    icon: Gauge,
    description: 'Generate premium estimates in seconds so underwriting teams can respond while customer intent is still high.',
  },
  {
    title: 'Risk Intelligence',
    icon: BrainCircuit,
    description: 'Blend multiple ML models into one decision layer to reduce guesswork and improve pricing confidence.',
  },
  {
    title: 'Reliable Controls',
    icon: SlidersHorizontal,
    description: 'Tune age, BMI, smoker status, region, dependents, and conditions with a fluid control surface built for analysts.',
  },
  {
    title: 'Built-In Trust',
    icon: ShieldCheck,
    description: 'Compare each model output side by side so your team can explain how a premium was formed before it reaches a customer.',
  },
  {
    title: 'Growth Visibility',
    icon: TrendingUp,
    description: 'See how premium bands shift across profiles and turn raw predictions into strategy-ready operational insight.',
  },
  {
    title: 'AI Ready UX',
    icon: Sparkles,
    description: 'A polished dark interface gives your insurance product a modern, high-signal experience from first visit to final quote.',
  },
];

function AnimatedContainer({ className, delay = 0.1, children }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function DemoOne() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_30%),linear-gradient(180deg,rgba(9,18,32,0.55),rgba(6,17,31,0))]" />

      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 md:px-6">
        <AnimatedContainer className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-cyan-200">
            Insurance AI Features
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-wide text-balance text-white md:text-4xl lg:text-5xl xl:font-extrabold">
            Power. Speed. Control.
          </h2>
          <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
            Everything your team needs to quote faster, explain premiums clearly, and deliver a sharper digital insurance experience.
          </p>
        </AnimatedContainer>

        <AnimatedContainer
          delay={0.35}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] shadow-[0_30px_80px_rgba(2,8,23,0.45)] backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 divide-y divide-dashed divide-white/10 sm:grid-cols-2 sm:divide-x md:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
