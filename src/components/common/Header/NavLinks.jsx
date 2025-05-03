'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Briefcase } from "lucide-react";

export function NavLinks() {
  const pathname = usePathname();
  
  const isCompaniesActive = pathname.startsWith("/companies/listing");
  const isJobsActive = pathname.startsWith("/jobs");

  return (
    <div className="hidden lg:flex items-center gap-10">
      <Link 
        href="/companies/listing" 
        className={`flex flex-col items-center gap-0 p-0 group ${
          isCompaniesActive ? 'border-b-2 border-brand rounded-none' : ''
        }`}
      >
        <Building2 className={`w-4 h-4 group-hover:text-brand transition-colors ${
          isCompaniesActive ? 'text-brand' : 'text-gray-600'
        }`} />
        <span className={`text-sm font-medium group-hover:text-brand transition-colors ${
          isCompaniesActive ? 'text-brand' : ''
        }`}>
          Companies
        </span>
      </Link>
      <Link 
        href="/jobs" 
        className={`flex flex-col items-center gap-0 p-0 group ${
          isJobsActive ? 'border-b-2 border-brand rounded-none' : ''
        }`}
      >
        <Briefcase className={`w-4 h-4 group-hover:text-brand transition-colors ${
          isJobsActive ? 'text-brand' : 'text-gray-600'
        }`} />
        <span className={`text-sm font-medium group-hover:text-brand transition-colors text-nowrap ${
          isJobsActive ? 'text-brand' : ''
        }`}>
          Browse Jobs
        </span>
      </Link>
    </div>
  );
}