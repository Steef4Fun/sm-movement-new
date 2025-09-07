"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ScrollProgressProps {
  sections: { id: string; label: string }[];
}

export const ScrollProgress = ({ sections }: ScrollProgressProps) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calculate the index of the section that should be active based on scroll position
      const activeIndex = Math.round(scrollPosition / windowHeight);
      
      // Ensure the index is within the bounds of the sections array
      if (activeIndex >= 0 && activeIndex < sections.length) {
        setActiveSection(sections[activeIndex].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  return (
    <div className="fixed right-0 top-1/2 z-40 -translate-y-1/2 pr-4 md:pr-8 hidden lg:block">
      <div className="flex flex-col items-end gap-4">
        {sections.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group flex items-center gap-3"
            onClick={(e) => {
              e.preventDefault();
              // Calculate the precise scroll position based on the section's index
              const targetScrollY = index * window.innerHeight;
              window.scrollTo({
                top: targetScrollY,
                behavior: "smooth",
              });
            }}
          >
            <span
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm",
                activeSection === section.id && "opacity-100 font-medium"
              )}
            >
              {section.label}
            </span>
            <div
              className={cn(
                "h-2 w-2 rounded-full bg-foreground/30 transition-all duration-300",
                activeSection === section.id ? "scale-150 bg-primary" : "group-hover:bg-foreground/60"
              )}
            />
          </a>
        ))}
      </div>
    </div>
  );
};