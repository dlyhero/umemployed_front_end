import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Briefcase } from "lucide-react";

export function NavLinks() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname.startsWith(path);
  };

  return (
    <div className="hidden lg:flex items-center gap-6">
      <Link 
        href="/companies/listing" 
        className={`flex items-center gap-2 group ${
          isActive('/companies') ? 'text-brand' : 'text-gray-600'
        }`}
      >
        <Building2 className={`w-4 h-4 group-hover:text-brand transition-colors ${
          isActive('/companies') ? 'text-brand' : 'text-gray-600'
        }`} />
        <span className={`text-sm font-semibold group-hover:text-brand transition-colors ${
          isActive('/companies') ? 'text-brand' : 'text-gray-600'
        }`}>
          Companies
        </span>
      </Link>
      <Link 
        href="/jobs" 
        className={`flex items-center gap-2 group ${
          isActive('/jobs') ? 'text-brand' : 'text-gray-600'
        }`}
      >
        <Briefcase className={`w-4 h-4 group-hover:text-brand transition-colors ${
          isActive('/jobs') ? 'text-brand' : 'text-gray-600'
        }`} />
        <span className={`text-sm font-semibold group-hover:text-brand transition-colors ${
          isActive('/jobs') ? 'text-brand' : 'text-gray-600'
        }`}>
          Browse Jobs
        </span>
      </Link>
    </div>
  );
}