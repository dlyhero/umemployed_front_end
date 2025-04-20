"use client";
import Link from "next/link";
import { 
  Building2, 
  Briefcase, 
  PlusCircle, 
  Mail,
  Bell,
  MessageSquare,
  Settings,
  ThumbsUp,
  Receipt
} from "lucide-react";
import { useSession } from "next-auth/react";

export function MenuLinks() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  // If the user is logged in as a recruiter, show only recruiter links.
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
        <Link href="/companies/related-users" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <ThumbsUp className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Endorsement</span>
        </Link>
        <Link href="/transactions" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <Receipt className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Transaction History</span>
        </Link>
      </div>
    );
  }

  // For job seekers or guests (user not logged in)
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
      {/* Only show Post a Job if you consider it as a job seeker feature or for guests, otherwise remove it */}
      <Link href="/post-job" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
        <PlusCircle className="w-5 h-5 text-gray-600" />
        <span className="font-medium">Post a Job</span>
      </Link>
      {/* Optionally, if you want to show a contact link for guests */}
      {!session && (
        <Link href="/contact" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <Mail className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Contact Us</span>
        </Link>
      )}
    </div>
  );
}
