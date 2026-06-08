"use client";

import { useEffect, useRef } from "react";
import { useReportWebVitals } from "next/web-vitals";

const THRESHOLDS: Record<string, string> = {
  LCP: "good <2500ms, poor >4000ms",
  FCP: "good <1800ms, poor >3000ms",
  TTFB: "good <800ms, poor >1800ms",
  CLS: "good <0.1, poor >0.25",
  INP: "good <200ms, poor >500ms",
  FID: "good <100ms, poor >300ms",
};

export function WebVitals() {
  const vitals = useRef<Record<string, { value: number; rating: string; threshold: string }>>({});

  useReportWebVitals((metric) => {
    vitals.current[metric.name] = {
      value: metric.value,
      rating: metric.rating,
      threshold: THRESHOLDS[metric.name] ?? "",
    };
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    let sent = false;

    const send = () => {
      if (sent || Object.keys(vitals.current).length === 0) return;
      sent = true;
      const body = JSON.stringify(vitals.current);
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/web-vitals", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/web-vitals", { method: "POST", body, keepalive: true });
      }
    };

    const onHidden = () => {
      if (document.visibilityState === "hidden") send();
    };

    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", send);

    return () => {
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", send);
    };
  }, []);

  return null;
}
