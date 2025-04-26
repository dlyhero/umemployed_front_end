import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export default function SeeMoreButton({ onClick, visible }) {
  if (!visible) return null;
  return (
    <div className="text-center mt-8">
      <Button
        onClick={onClick}
        className="w-48 bg-[#1e90ff] hover:bg-[#1a82e6] text-white font-semibold rounded-md py-3 flex items-center justify-center gap-2"
      >
        <ArrowDown className="w-4 h-4" />
        See More
      </Button>
    </div>
  );
}