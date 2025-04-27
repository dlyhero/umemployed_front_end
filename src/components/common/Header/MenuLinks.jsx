"use client";
import Link from "next/link";
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

  const handleEndorsementClick = () => {
    setLoading(true);
    router.push("/companies/related-users");
  };

  if (role === "recruiter") {
    return (
      <div className="flex flex-col gap-2 mb-6">
        <Link href="/notifications" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Notifications</span>
        </Link>
        <Link href="/messages" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Messages</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Settings</span>
        </Link>
        <button
          onClick={handleEndorsementClick}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 w-full text-left"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
          ) : (
            <ThumbsUp className="w-5 h-5 text-gray-600" />
          )}
          <span className="font-medium">{loading ? "Loading..." : "Endorsement"}</span>
        </button>
        <Link href="/transactions" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <Receipt className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Transaction History</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mb-6">
      <Link href="/companies" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
        <Building2 className="w-5 h-5 text-gray-600" />
        <span className="font-medium">Companies</span>
      </Link>
      <Link href="/jobs" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
        <Briefcase className="w-5 h-5 text-gray-600" />
        <span className="font-medium">Browse Jobs</span>
      </Link>
      <Link href="/post-job" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
        <PlusCircle className="w-5 h-5 text-gray-600" />
        <span className="font-medium">Post a Job</span>
      </Link>
      {!session && (
        <Link href="/contact" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <Mail className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Contact Us</span>
        </Link>
      )}
    </div>
  );
}
