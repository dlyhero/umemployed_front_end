"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import {
  Bell,
  BellOff,
  Check,
  X,
  MoreHorizontal,
  Search,
  MessageSquare,
  ThumbsUp,
  UserPlus,
  Users,
  Briefcase,
  Hash,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import baseUrl from "../api/baseUrl"

// Base URL for API endpoints

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Axios config with authorization headers
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`
    }
  }

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${baseUrl}/notifications/notifications/`, axiosConfig)
        setNotifications(response.data)
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.accessToken) {
      fetchNotifications()
    }
  }, [session?.accessToken])

  const markAsRead = async (id) => {
    try {
      await axios.post(
        `${baseUrl}/notifications/notifications/${id}/read/`,
        {},
        axiosConfig
      )
      
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      // This assumes your API has a bulk read endpoint
      // If not, you would need to loop through unread notifications
      await Promise.all(
        notifications
          .filter(n => !n.read)
          .map(n => 
            axios.post(
              `${baseUrl}/notifications/notifications/${n.id}/read/`,
              {},
              axiosConfig
            )
          )
      )
      
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "unread" && notification.read) return false
    if (activeTab === "messages" && notification.type !== "message") return false
    if (activeTab === "jobs" && notification.type !== "job") return false
    
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const matchesUser = notification.user?.name.toLowerCase().includes(searchLower)
      const matchesCompany = notification.company?.name.toLowerCase().includes(searchLower)
      const matchesPost = notification.post?.toLowerCase().includes(searchLower)
      const matchesPosition = notification.position?.toLowerCase().includes(searchLower)
      
      return matchesUser || matchesCompany || matchesPost || matchesPosition
    }
    
    return true
  })

  const getNotificationIcon = (type) => {
    switch (type) {
      case "connection": return <UserPlus size={18} className="text-brand" />
      case "reaction": return <ThumbsUp size={18} className="text-brand" />
      case "message": return <MessageSquare size={18} className="text-brand" />
      case "job": return <Briefcase size={18} className="text-brand" />
      case "mention": return <Hash size={18} className="text-brand" />
      default: return <Users size={18} className="text-brand" />
    }
  }

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
            disabled={notifications.filter(n => !n.read).length === 0}
          >
            Mark all as read
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <BellOff size={16} className="mr-1" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[150px]">
              <DropdownMenuItem className="text-xs sm:text-sm">
                Notification settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs sm:text-sm">
                Email preferences
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs sm:text-sm">
                Mute notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <TabsList className="grid w-full grid-cols-4 min-w-[300px]">
            <TabsTrigger 
              value="all" 
              onClick={() => setActiveTab("all")}
              className="text-xs sm:text-sm px-2 py-1"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="unread" 
              onClick={() => setActiveTab("unread")}
              className="text-xs sm:text-sm px-2 py-1"
            >
              Unread
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              onClick={() => setActiveTab("messages")}
              className="text-xs sm:text-sm px-2 py-1"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger 
              value="jobs" 
              onClick={() => setActiveTab("jobs")}
              className="text-xs sm:text-sm px-2 py-1"
            >
              Jobs
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Notifications List */}
      <div className="grid gap-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8 sm:py-10">
            <p className="text-gray-500 text-sm sm:text-base">
              {activeTab === "unread" ? "No unread notifications" : "No notifications found"}
            </p>
          </div>    
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 sm:p-4 rounded-lg border ${
                notification.read ? "bg-white" : "bg-blue-50 border-blue-200"
              } min-h-[120px] flex flex-col`}
            >
              <div className="flex items-start gap-2 sm:gap-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-1 sm:p-2 rounded-full bg-blue-50">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      {notification.user && (
                        <div className="flex items-center">
                          <Avatar className="h-7 sm:h-8 w-7 sm:w-8 mr-2">
                            <AvatarImage src={notification.user.avatar} />
                            <AvatarFallback>
                              {notification?.user?.name?.charAt(0) ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                              {notification.user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {notification.user.position}
                            </p>
                          </div>
                        </div>
                      )}
                      {notification.company && (
                        <div className="flex items-center">
                          <Avatar className="h-7 sm:h-8 w-7 sm:w-8 mr-2">
                            <AvatarImage src={notification.company.avatar} />
                            <AvatarFallback>
                              {notification.company.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                              {notification.company.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              Posted: {notification.position}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {notification.time}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-full hover:bg-gray-100">
                            <MoreHorizontal size={14} className="text-gray-500" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[150px]">
                          <DropdownMenuItem 
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs sm:text-sm"
                          >
                            {notification.read ? (
                              <>
                                <Check size={14} className="mr-2" />
                                Mark unread
                              </>
                            ) : (
                              <>
                                <Check size={14} className="mr-2" />
                                Mark read
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs sm:text-sm">
                            <X size={14} className="mr-2" />
                            Hide
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="mt-1 sm:mt-2 flex-1">
                    {notification.type === "reaction" && (
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {notification.user.name} {notification.reaction} your post: "{notification.post}"
                      </p>
                    )}
                    {notification.type === "message" && (
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        "{notification.preview}"
                      </p>
                    )}
                    {notification.type === "mention" && (
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        Mentioned you: "{notification.post}"
                      </p>
                    )}
                  </div>

                  {(notification.type === "connection" || notification.type === "job") && (
                    <div className="mt-2 sm:mt-3 flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-brand hover:bg-brand/80 text-xs text-white sm:text-sm px-2 sm:px-3"
                      >
                        {notification.type === "connection" ? "Accept" : "View job"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs sm:text-sm px-2 sm:px-3"
                      >
                        {notification.type === "connection" ? "Ignore" : "Save"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}