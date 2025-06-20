"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  Bell,
  BellOff,
  Search,
  Briefcase,
  UserCheck,
  Gift,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import baseUrl from "../../api/baseUrl";

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Axios config with authorization headers
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  };

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseUrl}/notifications/notifications/`,
          axiosConfig
        );
        // Sort notifications by timestamp in descending order (latest first)
        const sortedNotifications = response.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setNotifications(sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchNotifications();
    }
  }, [session?.accessToken]);

  const toggleReadStatus = async (id, isRead) => {
    try {
      await axios.post(
        `${baseUrl}/notifications/notifications/${id}/read/`,
        {},
        axiosConfig
      );
      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, is_read: !isRead } : n
        )
      );
    } catch (error) {
      console.error("Error toggling notification read status:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.is_read)
          .map((n) =>
            axios.post(
              `${baseUrl}/notifications/notifications/${n.id}/read/`,
              {},
              axiosConfig
            )
          )
      );
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread" && notification.is_read) return false;
    if (activeTab === "jobs" && notification.notification_type !== "new_job_posted" && notification.notification_type !== "job_application") return false;
    if (activeTab === "offers" && notification.notification_type !== "special_offer") return false;

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesMessage = notification.message?.toLowerCase().includes(searchLower);
      return matchesMessage;
    }

    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_job_posted":
        return <Briefcase size={18} className="text-blue-600" />;
      case "job_application":
        return <UserCheck size={18} className="text-green-600" />;
      case "special_offer":
        return <Gift size={18} className="text-purple-600" />;
      default:
        return <Bell size={18} className="text-gray-600" />;
    }
  };

  const getNotificationStyle = (type, isRead) => {
    const baseStyles = {
      new_job_posted: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
      },
      job_application: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
      },
      special_offer: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-800",
      },
    };

    const defaultStyles = {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-800",
    };

    const styles = baseStyles[type] || defaultStyles;

    return {
      ...styles,
      bg: isRead ? "bg-gray-100" : styles.bg,
      text: isRead ? "text-gray-600" : styles.text,
      opacity: isRead ? "opacity-70" : "opacity-100",
    };
  };

  return (
    <div className="w-full mx-auto px-2 sm:px-4 md:px-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notifications</h1>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs sm:text-sm px-2 sm:px-3"
            disabled={notifications.filter((n) => !n.is_read).length === 0}
          >
            Mark all as read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            <BellOff size={16} className="mr-1" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 sm:mb-6">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search notifications"
          className="pl-10 text-sm sm:text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="mb-4 sm:mb-6 overflow-x-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 min-w-[300px]">
            <TabsTrigger
              value="all"
              onClick={() => setActiveTab("all")}
              className="text-xs sm:text-sm px-2 py-1"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              onClick={() => setActiveTab("jobs")}
              className="text-xs sm:text-sm px-2 py-1"
            >
              Jobs
            </TabsTrigger>
            <TabsTrigger
              value="offers"
              onClick={() => setActiveTab("offers")}
              className="text-xs sm:text-sm px-2 py-1"
            >
              Offers
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Notifications List */}
      <div className="grid gap-3 max-h-[calc(100vh-200px)] overflow-y-auto hide-scrollbar">

        {isLoading ? (
          <div className="text-center py-8 sm:py-10">
            <p className="text-gray-500 text-sm sm:text-base">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8 sm:py-10">
            <p className="text-gray-500 text-sm sm:text-base">
              {activeTab === "unread"
                ? "No unread notifications"
                : activeTab === "jobs"
                ? "No job-related notifications"
                : activeTab === "offers"
                ? "No special offer notifications"
                : "No notifications found"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const styles = getNotificationStyle(notification.notification_type, notification.is_read);
            return (
              <div
                key={notification.id}
                className={`p-3 sm:p-4 rounded-lg border ${styles.bg} ${styles.border} ${styles.opacity} min-h-[100px] flex flex-col cursor-pointer hover:bg-gray-200 transition-colors`}
                onClick={() => toggleReadStatus(notification.id, notification.is_read)}
                title={notification.is_read ? "Mark as unread" : "Mark as read"}
              >
                <div className="flex items-start gap-2 sm:gap-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-1 sm:p-2 rounded-full bg-white">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs text-gray-500 truncate`}>
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 sm:mt-2 flex-1">
                      <p className={`text-xs sm:text-sm ${styles.text} line-clamp-2`}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}