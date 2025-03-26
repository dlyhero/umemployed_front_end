import Link from "next/link";
import { Building2, Briefcase } from "lucide-react";

// 7. NavLinks.js
export function NavLinks() {
  return (
    <div className="hidden md:flex items-center gap-6">
      <Link href="/companies" className="flex items-center gap-2 group">
        <Building2 className="w-4 h-4 text-gray-600 group-hover:text-brand transition-colors" />
        <span className="text-sm font-medium group-hover:text-brand transition-colors">
          Companies
        </span>
      </Link>
      <Link href="/jobs" className="flex items-center gap-2 group">
        <Briefcase className="w-4 h-4 text-gray-600 group-hover:text-brand transition-colors" />
        <span className="text-sm font-medium group-hover:text-brand transition-colors">
          Browse Jobs
        </span>
      </Link>
    </div>
  );
}