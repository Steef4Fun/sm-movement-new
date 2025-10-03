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
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      let currentSectionId = sections[0].id;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSectionId = section.id;
        }
      }

      if (activeSection !== currentSectionId) {
        setActiveSection(currentSectionId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections, activeSection]);

  return (
    <div className="fixed right-0 top-1/2 z-40 -translate-y-1/2 pr-4 md:pr-8 hidden lg:block">
      <div className="flex flex-col items-end gap-4">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group flex items-center gap-3"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(section.id);
              if (element) {
                window.scrollTo({
                  top: element.offsetTop,
                  behavior: "smooth",
                });
              }
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