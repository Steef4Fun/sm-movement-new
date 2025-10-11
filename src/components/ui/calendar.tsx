"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CaptionProps, DayPicker, useDayPicker, useNavigation } from "react-day-picker"
import { format } from "date-fns"
import { nl } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function CustomCaption(props: CaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation()
  const { fromDate, toDate, fromYear, toYear } = useDayPicker()

  const handleMonthChange = (value: string) => {
    const month = parseInt(value, 10)
    const newDate = new Date(props.displayMonth)
    newDate.setMonth(month)
    goToMonth(newDate)
  }

  const handleYearChange = (value: string) => {
    const year = parseInt(value, 10)
    const newDate = new Date(props.displayMonth)
    newDate.setFullYear(year)
    goToMonth(newDate)
  }

  const startYear = fromYear || fromDate?.getFullYear() || new Date().getFullYear() - 100
  const endYear = toYear || toDate?.getFullYear() || new Date().getFullYear() + 10

  return (
    <div className="flex items-center justify-center gap-2 px-1 pt-1">
      <button
        type="button"
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        className={cn(buttonVariants({ variant: "outline" }), "h-8 w-8 p-0")}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <Select
        value={String(props.displayMonth.getMonth())}
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className="w-[110px] h-8 text-sm focus:ring-0">
          <SelectValue>
            {format(props.displayMonth, "MMMM", { locale: nl })}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }).map((_, i) => (
            <SelectItem key={i} value={String(i)}>
              {format(new Date(2000, i), "MMMM", { locale: nl })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(props.displayMonth.getFullYear())}
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="w-[80px] h-8 text-sm focus:ring-0">
          <SelectValue>{props.displayMonth.getFullYear()}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: endYear - startYear + 1 }).map((_, i) => {
            const year = startYear + i
            return (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      <button
        type="button"
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        className={cn(buttonVariants({ variant: "outline" }), "h-8 w-8 p-0")}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const isDropdown =
    props.captionLayout === "dropdown" || props.captionLayout === "dropdown-buttons"

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: cn(
          "flex justify-center pt-1 relative items-center",
          isDropdown && "hidden"
        ),
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: isDropdown ? CustomCaption : undefined,
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }