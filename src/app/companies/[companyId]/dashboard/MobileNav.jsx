'use client';
import { useRouter, usePathname } from 'next/navigation';
import { BarChart2, Briefcase, FileText, Home, Settings, Users } from 'lucide-react';

export const MobileNav = ({ companyId, closeMenu, activeTab, setActiveTab }) => {
  const router = useRouter();
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
    <nav className="flex flex-col space-y-2">
      {menuItems.map((item, index) => {
        const isActive = activeTab === item.path || pathname === item.path || pathname.startsWith(item.path.split('/listing')[0]);
        return (
          <button
            key={index}
            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
              isActive
                ? 'bg-[#1e40af]/10 text-[#1e40af]'
                : 'text-gray-900 hover:bg-[#1e40af]/10 hover:text-[#1e40af]'
            }`}
            onClick={() => {
              router.push(item.path);
              setActiveTab(item.path);
              closeMenu();
            }}
          >
            <span className={isActive ? 'text-[#1e40af]' : 'text-gray-600'}>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};