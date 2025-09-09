"use client";

import React from "react";
import DatePicker from "react-datepicker";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { nl } from "date-fns/locale";

interface DatePickerInputProps {
  selected: Date | null | undefined;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
}

export const DatePickerInput = ({
  selected,
  onChange,
  placeholderText = "Kies een datum",
  className,
  disabled,
  minDate,
}: DatePickerInputProps) => {
  return (
    <div className="relative">
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        locale={nl}
        placeholderText={placeholderText}
        customInput={
          <Input
            className={cn("pl-10", className)}
            readOnly
            disabled={disabled}
          />
        }
        dayClassName={() => "text-sm"}
        className="w-full"
        wrapperClassName="w-full"
        popperClassName="z-50" // Ensure it's above other elements
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        minDate={minDate}
      />
      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
};