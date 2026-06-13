"use client";

import { useEffect } from "react";

// Adds .visible to .fade-up elements as they enter the viewport.
export function ScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}
