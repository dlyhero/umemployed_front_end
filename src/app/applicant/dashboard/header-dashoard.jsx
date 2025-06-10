import { useState } from 'react'
import { Search, Bell, Menu, Mail, FileText, User } from 'lucide-react'
import AuthenticatedNav from '@/src/components/common/Header/AuthenticatedNav'

function DashboardHeader({ onClick }) {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

    const notifications = [
        {
            id: 1,
            icon: Mail,
            message: "You have 3 new mails",
            time: "3 hours ago",
            unread: true
        },
        {
            id: 2,
            icon: FileText,
            message: "You have 5 new mails",
            time: "6 hours ago",
            unread: false
        },
        {
            id: 3,
            icon: User,
            message: "You have 7 new mails",
            time: "9 hours ago",
            unread: true
        }
    ]

    const handleSearch = (e) => {
        e.preventDefault()
        // Handle search logic here
    }

    return (
        <header className="bg-blue-50 border-gray-200 px-4 md:px-8 py-4 w-full  z-40">
            <div className="flex items-center justify-end">
                <button
                    className="md:hidden mr-auto p-2 text-gray-600 hover:brand/90 transition-colors duration-300"
                    onClick={onClick}
                >
                    <Menu size={20} />
                </button>

                <div className="relative mr-5">
                    <input
                        placeholder="Search here.."
                        type="text"
                        className=" w-lg bg-blue-100  h-11 border border-gray-200 rounded-xl px-5 pr-12 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    />
                    <button
                        type="submit"
                        onClick={handleSearch}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:brand/90 transition-colors duration-300"
                    >
                        <Search size={16} />
                    </button>
                </div>
                     <div className="flex gap-4 items-center"><AuthenticatedNav /></div>
            </div>
        </header>
    )
}

export default DashboardHeader