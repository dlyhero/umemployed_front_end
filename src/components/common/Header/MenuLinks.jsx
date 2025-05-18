"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  Building2, 
  Briefcase, 
  PlusCircle, 
  Mail,
  Bell,
  MessageSquare,
  Settings,
  ThumbsUp,
  Receipt,
  Loader2
} from "lucide-react";
import { useSession } from "next-auth/react";

export function MenuLinks() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname.startsWith(path);
  };

  const handleEndorsementClick = () => {
    setLoading(true);
    router.push("/companies/related-users");
  };
  
  const CommonLinks = () => (
    <>
      <Link 
        href="/notifications" 
        className={`flex items-center gap-3 p-2 rounded-lg ${
          isActive('/notifications') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'
        }`}
      >
        <Bell className="w-5 h-5" />
        <span className="font-medium">Notifications</span>
      </Link>
      <Link 
        href="/messages" 
        className={`flex items-center gap-3 p-2 rounded-lg ${
          isActive('/messages') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="font-medium">Messages</span>
      </Link>
    </>
  );

  if (role === "recruiter") {
    return (
      <div className="flex flex-col gap-2 mb-6">
        <CommonLinks />
        <Link 
          href="/settings" 
          className={`flex items-center gap-3 p-2 rounded-lg ${
            isActive('/settings') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
        <button
          onClick={handleEndorsementClick}
          className={`flex items-center gap-3 p-2 rounded-lg ${
            isActive('/companies/related-users') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'
          } w-full text-left`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ThumbsUp className="w-5 h-5" />
          )}
          <span className="font-medium">{loading ? "Loading..." : "Endorsement"}</span>
        </button>
        <Link 
          href="/transactions" 
          className={`flex items-center gap-3 p-2 rounded-lg ${
            isActive('/transactions') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="font-medium">Transaction History</span>
        </Link>
        <Link 
          href="/post-job" 
          className={`flex items-center gap-3 p-2 rounded-lg ${
            isActive('/post-job') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="font-medium">Post a Job</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mb-6">
      <CommonLinks />
      <Link 
        href="/companies/listing" 
        className={`flex items-center gap-3 p-2 rounded-lg ${
          isActive('/companies') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'
        }`}
      >
        <Building2 className="w-5 h-5" />
        <span className="font-medium">Companies</span>
      </Link>
      <Link 
        href="/jobs" 
        className={`flex items-center gap-3 p-2 rounded-lg ${
          isActive('/jobs') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'
        }`}
      >
        <Briefcase className="w-5 h-5" />
        <span className="font-medium">Browse Jobs</span>
      </Link>
     
      {!session && (
        <Link 
          href="/contact" 
          className={`flex items-center gap-3 p-2 rounded-lg ${
            isActive('/contact') ? 'bg-gray-100 text-brand' : 'hover:bg-gray-50 text-gray-600'
          }`}
        >
          <Mail className="w-5 h-5" />
          <span className="font-medium">Contact Us</span>
        </Link>
      )}
    </div>
  );
}