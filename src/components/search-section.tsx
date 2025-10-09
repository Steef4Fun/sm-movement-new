"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export const SearchSection = () => {
  const router = useRouter();
  const [condition, setCondition] = useState("");
  const [make, setMake] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (condition && condition !== "all") params.set("condition", condition);
    if (make && make !== "all") params.set("brand", make);

    router.push(`/aanbod?${params.toString()}`);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-end">
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
                    <SelectItem value="all">Nieuw & Gebruikt</SelectItem>
                    <SelectItem value="nieuw">Nieuw</SelectItem>
                    <SelectItem value="gebruikt">Gebruikt</SelectItem>
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
                    <SelectItem value="all">Alle merken</SelectItem>
                    <SelectItem value="Audi">Audi</SelectItem>
                    <SelectItem value="BMW">BMW</SelectItem>
                    <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                    <SelectItem value="Porsche">Porsche</SelectItem>
                    <SelectItem value="Tesla">Tesla</SelectItem>
                    <SelectItem value="Lamborghini">Lamborghini</SelectItem>
                    <SelectItem value="Ferrari">Ferrari</SelectItem>
                    <SelectItem value="McLaren">McLaren</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="h-12 w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" />
                <span>Zoeken</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};