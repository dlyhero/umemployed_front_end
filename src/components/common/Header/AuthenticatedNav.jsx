
"use client";
import { useSession } from "next-auth/react";
import useUser from "@/src/hooks/useUser";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import LogoutButton from "./LogoutButton";
import UserProfileLink from "./UserProfileLink";
import NavigationLink from "./NavigationLinks";

export default function AuthenticatedNav() {
  const { data: session } = useSession();
  const user = useUser();
  const pathname = usePathname();

  const getNavigationPath = () => {
    if (!session?.user) return "/";
    if (session.user.role === "job_seeker") {
      return user.user.has_resume
        ? "/applicant/dashboard"
        : "/applicant/upload-resume";
    } else if (user.user.role === "recruiter") {
      return user.user.has_company
        ? `/companies/${session.user.company_id}/dashboard`
        : "/companies/create";
    }
    return "/";
  };

  const isResumeActive = pathname.startsWith("/applicant/upload-resume");
  const isNotificationsActive = pathname.startsWith("/notifications");
  const isProfileActive = pathname === getNavigationPath();

  return (
    <>
      {session.user.role === 'job_seeker' && (
        <NavigationLink
          href="/applicant/upload-resume" 
          isActive={isResumeActive}
          text="Resume"
        />
      )}
      
      <NavigationLink 
        href="/notifications" 
        isActive={isNotificationsActive}
        icon={Bell}
        className="hidden lg:flex"
      />
      
      <UserProfileLink
        session={session}
        user={user}
        href={getNavigationPath()}
        isActive={isProfileActive}
      />

      <LogoutButton />
    </>
  );
}
