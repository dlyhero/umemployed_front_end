"use client";
import { useSession } from "next-auth/react";
import useUser from "@/src/hooks/useUser";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import baseUrl from "../../../app/api/baseUrl";
import LogoutButton from "./LogoutButton";
import UserProfileLink from "./UserProfileLink";
import NavigationLink from "./NavigationLinks";


export default function AuthenticatedNav() {
  const { data: session } = useSession();
  const user = useUser();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const axiosConfig = {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        };
        const response = await axios.get(
          `${baseUrl}/notifications/notifications/`,
          axiosConfig
        );
        const unread = response.data.filter((n) => !n.is_read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching unread notifications count:", error);
      }
    };

    if (session?.accessToken) {
      fetchUnreadCount();
    }
  }, [session?.accessToken]);

  const getNavigationPath = () => {
    if (!session?.user) return "/";
    if (session.user.role === "job_seeker") {
      return user.user.has_resume
        ? "/applicant/dashboard"
        : "/applicant/upload-resume";
    } else if (session.user.role === "recruiter") {
      return session.user.has_company
        ? `/companies/${session.user.company_id}/dashboard`
        : "/companies/create";
    }
    return "/";
  };

  const getNotificationsPath = () => {
    if (session?.user?.role === "recruiter") {
      return "/companies/notifications";
    }
    return "/notifications";
  };

  const isResumeActive = pathname.startsWith("/applicant/upload-resume");
  const isNotificationsActive =
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/companies/notifications");
  const isProfileActive = pathname === getNavigationPath();

  return (
    <>
      {session?.user?.role === "job_seeker" && (
        <NavigationLink
          href="/applicant/upload-resume"
          isActive={isResumeActive}
          text="Resume"
        />
      )}

      <div className="relative">
        <NavigationLink
          href={getNotificationsPath()}
          isActive={isNotificationsActive}
          icon={Bell}
          className="hidden lg:flex"
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {unreadCount}
          </span>
        )}
      </div>

      <UserProfileLink
        session={session}
        user={user}
        href={getNavigationPath()}
        isActive={isProfileActive}
      />
    </>
  );
}