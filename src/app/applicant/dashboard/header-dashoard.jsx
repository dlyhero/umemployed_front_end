import { useState } from 'react'
import { Search, Bell, Menu, Mail, FileText, User } from 'lucide-react'
import AuthenticatedNav from '@/src/components/common/Header/AuthenticatedNav'
import SearchBar from '@/src/components/common/SearchBar/SearchBar'
import { Logo } from '@/src/components/common/Header/Logo'

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
        <header className="bg-white  px-4 md:px-8 py-4 w-fullz-40">
            <div className="flex items-center justify-end">
            <div className='md:hidden'>
                <Logo />
            </div>
                <div className="relative mr-5 flex-1">
                    <SearchBar />
                </div>
                <div className="flex gap-10  items-center"><AuthenticatedNav /></div>
                <button
                    className="md:hidden mr-auto p-2 text-gray-600 hover:brand/90 transition-colors duration-300"
                    onClick={onClick}
                >
                    <Menu size={20} />
                </button>
            </div>
        </header>
    )
}

export default DashboardHeader