import Link from "next/link";
import { Building2, Briefcase } from "lucide-react";

export function NavLinks() {
  return (
    <div className="hidden md:flex items-center gap-6">
      <Link href="/companies/listing" className="flex items-center gap-2 group">
        <Building2 className="w-4 h-4 text-gray-600 group-hover:text-brand transition-colors" />
        <span className="text-sm font-medium group-hover:text-brand transition-colors">
          Companies
        </span>
      </Link>
      <Link href="/companies/jobs/listing" className="flex items-center gap-2 group">
        <Briefcase className="w-4 h-4 text-gray-600 group-hover:text-brand transition-colors" />
        <span className="text-sm font-medium group-hover:text-brand transition-colors">
          Browse Jobs
        </span>
      </Link>
    </div>
  );
}
