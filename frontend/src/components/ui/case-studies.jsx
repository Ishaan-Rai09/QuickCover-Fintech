"use client";

import { useEffect, useState } from "react";
import { Monitor, LayoutDashboard, Users } from "lucide-react";

// Use standard import for Vite instead of next/dynamic
import CountUp from "react-countup";

/** Hook: respects user's motion preferences */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

/** Utility: parse a metric like "98%", "3.8x", "$1,200+", "1.5M", "€23.4k" */
function parseMetricValue(raw) {
  const value = (raw ?? "").toString().trim();
  const m = value.match(
    /^([^\d\-+]*?)\s*([\-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([^\d\s]*)$/
  );
  if (!m) {
    return { prefix: "", end: 0, suffix: value, decimals: 0 };
  }
  const [, prefix, num, suffix] = m;
  const normalized = num.replace(/,/g, "");
  const end = parseFloat(normalized);
  const decimals = (normalized.split(".")[1]?.length ?? 0);
  return {
    prefix: prefix ?? "",
    end: isNaN(end) ? 0 : end,
    suffix: suffix ?? "",
    decimals,
  };
}

/** Small component: one animated metric */
function MetricStat({ value, label, sub, duration = 1.6 }) {
  const reduceMotion = usePrefersReducedMotion();
  const { prefix, end, suffix, decimals } = parseMetricValue(value);

  return (
    <div className="flex flex-col gap-2 text-left p-6">
      <p
        className="text-2xl font-medium text-gray-900 dark:text-white sm:text-4xl"
        aria-label={`${label} ${value}`}
      >
        {prefix}
        {reduceMotion ? (
          <span>
            {end.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </span>
        ) : (
          <CountUp
            end={end}
            decimals={decimals}
            duration={duration}
            separator=","
            enableScrollSpy
            scrollSpyOnce
          />
        )}
        {suffix}
      </p>
      <p className="font-medium text-gray-900 dark:text-white text-left">
        {label}
      </p>
      {sub && (
        <p className="text-gray-600 dark:text-gray-400 text-left">{sub}</p>
      )}
    </div>
  );
}

export default function Casestudies() {
  const caseStudies = [
    {
      id: 1,
      quote:
        "The model accuracy is game-changing. Our underwriters assess risk dynamically and we issue policies 40% faster.",
      name: "Aarav Mehta",
      role: "Lead Underwriter",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
      icon: Monitor,
      metrics: [
        { value: "40%", label: "Faster Issuance", sub: "Policy approval speed" },
        { value: "95%", label: "Risk Precision", sub: "Based on validation set" },
      ],
    },
    {
      id: 2,
      quote:
        "QuickCover gave us a comprehensive dashboard experience. Our risk analysts reduced time spent on manual premium calculation and improved clarity.",
      name: "Sophia Patel",
      role: "Risk Operations Manager",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
      icon: LayoutDashboard,
      metrics: [
        { value: "3.5x", label: "Efficiency Gain", sub: "Across quoting workflows" },
        { value: "70%", label: "Reduced Losses", sub: "Through accurate pricing" },
      ],
    },
    {
      id: 3,
      quote:
        "The predictive models in QuickCover fundamentally shifted our market strategy. Everything is transparent and scaling is seamless.",
      name: "David Liu",
      role: "Strategy Director",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
      icon: Users,
      metrics: [
        { value: "2x", label: "Revenue Growth", sub: "Via targeted cohorts" },
        { value: "88%", label: "Customer Retention", sub: "Due to fair pricing" },
      ],
    },
  ];

  return (
    <section
      className="py-32 bg-background z-10 relative"
      aria-labelledby="case-studies-heading"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <h2
            id="case-studies-heading"
            className="text-4xl font-semibold md:text-5xl text-foreground"
          >
            Real results with QuickCover AI
          </h2>
          <p className="text-muted-foreground">
            From risk assessment to operations—QuickCover powers insurers with speed,
            clarity, and precision.
          </p>
        </div>

        {/* Cases */}
        <div className="mt-20 flex flex-col gap-20">
          {caseStudies.map((study, idx) => {
            const reversed = idx % 2 === 1;
            return (
              <div
                key={study.id}
                className="grid gap-12 lg:grid-cols-3 xl:gap-24 items-center border-b border-gray-200 dark:border-gray-800 pb-12"
              >
                {/* Left: Image + Quote */}
                <div
                  className={[
                    "flex flex-col sm:flex-row gap-10 lg:col-span-2 lg:border-r lg:pr-12 xl:pr-16 text-left",
                    reversed
                      ? "lg:order-2 lg:border-r-0 lg:border-l border-gray-200 dark:border-gray-800 lg:pl-12 xl:pl-16 lg:pr-0"
                      : "border-gray-200 dark:border-gray-800",
                  ].join(" ")}
                >
                  <img
                    src={study.image}
                    alt={`${study.name} portrait`}
                    width={300}
                    height={400}
                    className="aspect-[29/35] h-auto w-full max-w-60 rounded-2xl object-cover ring-1 ring-border hover:scale-105 transition-all duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                  <figure className="flex flex-col justify-between gap-8 text-left">
                    <blockquote className="text-lg sm:text-xl text-foreground leading-relaxed text-left">
                      <h3 className="text-lg sm:text-xl lg:text-xl font-normal text-gray-900 dark:text-white leading-relaxed text-left">
                        Data-Driven Insurance Experience{" "}
                        <span className="block text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-lg mt-2">
                          {study.quote}
                        </span>
                      </h3>
                    </blockquote>
                    <figcaption className="flex items-center gap-6 mt-4 text-left">
                      <div className="flex flex-col gap-1">
                        <span className="text-md font-medium text-foreground">
                          {study.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {study.role}
                        </span>
                      </div>
                    </figcaption>
                  </figure>
                </div>

                {/* Right: Metrics */}
                <div
                  className={[
                    "grid grid-cols-1 gap-10 self-center text-left",
                    reversed ? "lg:order-1" : "",
                  ].join(" ")}
                >
                  {study.metrics.map((metric, i) => (
                    <MetricStat
                      key={`${study.id}-${i}`}
                      value={metric.value}
                      label={metric.label}
                      sub={metric.sub}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
