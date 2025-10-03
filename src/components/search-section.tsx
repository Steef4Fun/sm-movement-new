"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

export const SearchSection = () => {
  const [condition, setCondition] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const handleSearch = () => {
    // Navigate to search results with filters
    const params = new URLSearchParams();
    if (condition) params.set('condition', condition);
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    
    window.location.href = `/aanbod?${params.toString()}`;
  };

  return (
    <motion.section 
      className="relative bg-background py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-3xl shadow-2xl border border-border/50 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-end">
              {/* Condition Select */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground font-medium">
                  Nieuw/Gebruikt
                </label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger className="h-12 border-border/50 bg-background/50">
                    <SelectValue placeholder="Nieuw & Gebruikt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nieuw</SelectItem>
                    <SelectItem value="used">Gebruikt</SelectItem>
                    <SelectItem value="both">Nieuw & Gebruikt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Make Select */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground font-medium">
                  Merk
                </label>
                <Select value={make} onValueChange={setMake}>
                  <SelectTrigger className="h-12 border-border/50 bg-background/50">
                    <SelectValue placeholder="Alle merken" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audi">Audi</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                    <SelectItem value="porsche">Porsche</SelectItem>
                    <SelectItem value="tesla">Tesla</SelectItem>
                    <SelectItem value="lamborghini">Lamborghini</SelectItem>
                    <SelectItem value="ferrari">Ferrari</SelectItem>
                    <SelectItem value="mclaren">McLaren</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Model Select */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground font-medium">
                  Model
                </label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="h-12 border-border/50 bg-background/50">
                    <SelectValue placeholder="Alle modellen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle modellen</SelectItem>
                    {make === "audi" && (
                      <>
                        <SelectItem value="a3">A3</SelectItem>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="a6">A6</SelectItem>
                        <SelectItem value="q5">Q5</SelectItem>
                        <SelectItem value="rs6">RS6</SelectItem>
                      </>
                    )}
                    {make === "bmw" && (
                      <>
                        <SelectItem value="3-series">3 Serie</SelectItem>
                        <SelectItem value="5-series">5 Serie</SelectItem>
                        <SelectItem value="x3">X3</SelectItem>
                        <SelectItem value="m3">M3</SelectItem>
                        <SelectItem value="m5">M5</SelectItem>
                      </>
                    )}
                    {make === "tesla" && (
                      <>
                        <SelectItem value="model-3">Model 3</SelectItem>
                        <SelectItem value="model-s">Model S</SelectItem>
                        <SelectItem value="model-x">Model X</SelectItem>
                        <SelectItem value="model-y">Model Y</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Zoeken</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
