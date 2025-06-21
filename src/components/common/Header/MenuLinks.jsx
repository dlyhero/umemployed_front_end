"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart2,
  Building2,
  Briefcase,
  FileText,
  Home,
  PlusCircle,
  Mail,
  Bell,
  MessageSquare,
  Settings,
  ThumbsUp,
  Users,
  Receipt,
  Loader2,
  Bookmark,
  RefreshCw
} from "lucide-react";
import { useSession } from "next-auth/react";

export function MenuLinks({ onLinkClick }) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path.split('/listing')[0]);
  };

  const handleEndorsementClick = () => {
    setLoading(true);
    router.push("/companies/related-users");
    onLinkClick && onLinkClick(); // Call onLinkClick if provided
  };

  const CommonLinks = () => (
    <>
      <Link
        href="/notifications"
        onClick={onLinkClick} // Trigger close action
        className={`flex items-center gap-3 p-2 rounded-lg font-semibold ${isActive('/notifications') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'}`}
      >
        <Bell className="w-5 h-5" />
        <span>Notifications</span>
      </Link>
      <Link
        href="/messages"
        onClick={onLinkClick} // Trigger close action
        className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/messages') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'}`}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="font-semibold">Messages</span>
      </Link>
      <Link
        href="/settings"
        onClick={onLinkClick} // Trigger close action
        className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/settings') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'}`}
      >
        <Settings className="w-5 h-5" />
        <span className="font-semibold">Settings</span>
      </Link>
    </>
  );

  if (role === "recruiter") {
    const companyId = session?.user?.company_id;
    const recruiterLinks = [
      { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: `/companies/${companyId}/dashboard` },
      { icon: <Users className="w-5 h-5" />, label: 'Candidates', path: `/companies/${companyId}/candidates` },
      { icon: <Briefcase className="w-5 h-5" />, label: 'Jobs', path: `/companies/${companyId}/jobs/listing` },
      { icon: <FileText className="w-5 h-5" />, label: 'Applications', path: `/companies/${companyId}/applications` },
      { icon: <BarChart2 className="w-5 h-5" />, label: 'Analytics', path: `/companies/${companyId}/analytics` },
      { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: `/companies/settings` },
      { icon: <RefreshCw className="w-5 h-5" />, label: 'Update', path: `/companies/${companyId}/update` },

    ];

    return (
      <div className="flex flex-col gap-2 mb-6">
        {/* Only show CommonLinks on desktop (md and above) */}
        <div className="hidden md:block">
          <CommonLinks />
        </div>
        {/* Recruiter-specific links for mobile */}
        {recruiterLinks.map((item, index) => (
          <Link
            key={index}
            href={item.path}
            onClick={onLinkClick} // Trigger close action
            className={`md:hidden flex items-center gap-3 p-2 rounded-lg ${isActive(item.path) ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'}`}
          >
            {item.icon}
            <span className="font-semibold">{item.label}</span>
          </Link>
        ))}
        {/* <Link
          href="/post-job"
          onClick={onLinkClick} // Trigger close action
          className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/post-job') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'}`}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="font-semibold">Post a Job</span>
        </Link> */}
        <button
          onClick={handleEndorsementClick}
          className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/companies/related-users') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'} w-full text-left`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ThumbsUp className="w-5 h-5" />
          )}
          <span className="font-semibold">{loading ? "Loading..." : "Endorsement"}</span>
        </button>
        <Link
          href="/companies/transaction"
          onClick={onLinkClick} // Trigger close action
          className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/transactions') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'}`}
        >
          <Receipt className="w-5 h-5" />
          <span className="font-semibold">Transaction History</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mb-6">
      <Link
        href="/companies/listing"
        onClick={onLinkClick} // Trigger close action
        className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/companies') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'}`}
      >
        <Building2 className="w-5 h-5" />
        <span className="font-semibold">Companies</span>
      </Link>
      <Link
        href="/jobs"
        onClick={onLinkClick} // Trigger close action
        className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/jobs') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'}`}
      >
        <Briefcase className="w-5 h-5" />
        <span className="font-semibold">Browse Jobs</span>
      </Link>
      {!session && (
        <Link
          href="/contact"
          onClick={onLinkClick} // Trigger close action
          className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/contact') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'}`}
        >
          <Mail className="w-5 h-5" />
          <span className="font-semibold">Contact Us</span>
        </Link>
      )}
      {session && (
        <Link
          href="/applicant/resume-enhancer"
          onClick={onLinkClick} // Trigger close action
          className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/applicant/shortlistedJobs') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'}`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="font-semibold">Shortlisted Jobs</span>
        </Link>
      )}
      <CommonLinks />
    </div>
  );
}