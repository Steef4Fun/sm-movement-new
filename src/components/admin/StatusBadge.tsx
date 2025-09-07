import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const lowerCaseStatus = status.toLowerCase();

  const statusStyles: { [key: string]: string } = {
    // General
    "in afwachting": "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
    "bevestigd": "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
    "geaccepteerd": "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
    "geannuleerd": "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
    "geweigerd": "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
    // Listings
    "beschikbaar": "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
    "gereserveerd": "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100",
    "verkocht": "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        statusStyles[lowerCaseStatus] || "bg-gray-100 text-gray-800 border-gray-200",
        className
      )}
    >
      {status}
    </Badge>
  );
};