"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface FullPageSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const FullPageSection = ({
  children,
  className,
}: FullPageSectionProps) => {
  return (
    <section
      className={cn(
        "h-screen w-full snap-start flex items-center justify-center relative",
        className
      )}
    >
      {children}
    </section>
  );
};