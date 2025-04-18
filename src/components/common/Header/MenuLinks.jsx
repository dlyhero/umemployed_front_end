"use client";
import Link from "next/link";
import { Building2, Briefcase, PlusCircle, Mail } from "lucide-react";
import { useSession } from "next-auth/react";

export function MenuLinks() {
  const {data: session, status} = useSession();

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
        {(session === null || session.user?.role === "recruiter") && <Link href="/post-job" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <PlusCircle className="w-5 h-5 text-gray-600" />
           <span className="font-medium">Post a Job</span>
        </Link>}
        {!session?.role && <Link href="/contact" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <Mail className="w-5 h-5 text-gray-600" />
         <span className="font-medium">Contact Us</span>
        </Link>}
      </div>
    );
  }