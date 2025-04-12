'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Briefcase, FileText, Home, Settings, Users } from 'lucide-react';

export const SidebarNav = ({ activeTab, setActiveTab, companyId }) => {
  const pathname = usePathname();

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: `/companies/${companyId}/dashboard` },
    { icon: <Users className="w-5 h-5" />, label: 'Candidates', path: `/companies/${companyId}/candidates` },
    { icon: <Briefcase className="w-5 h-5" />, label: 'Jobs', path: `/companies/${companyId}/jobs/listing` },
    { icon: <FileText className="w-5 h-5" />, label: 'Applications', path: `/companies/${companyId}/applications` },
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Analytics', path: `/companies/${companyId}/analytics` },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: `/companies/${companyId}/settings` },
  ];

  return (
    <nav className="space-y-1">
      {menuItems.map((item, index) => {
        const isActive = activeTab === item.path || pathname === item.path || pathname.startsWith(item.path.split('/listing')[0]);
        return (
          <Link key={index} href={item.path} passHref>
            <motion.button
              whileHover={{ x: 5 }}
              className={`group flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-[#1e90ff]/10 text-[#1e90ff]' : 'text-gray-600 hover:bg-[#1e90ff]/10 hover:text-[#1e90ff]'
              }`}
              onClick={() => setActiveTab(item.path)}
            >
              <span
                className={`${
                  isActive ? 'text-[#1e90ff]' : 'text-gray-600 group-hover:text-[#1e90ff]'
                } transition-colors duration-200`}
              >
                {item.icon}
              </span>
              <span className="ml-3 font-medium">{item.label}</span>
            </motion.button>
          </Link>
        );
      })}
    </nav>
  );
};