// Sidebar.jsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Briefcase, FileText, BarChart, Settings, Zap } from 'lucide-react';

const Sidebar = ({ companyId }) => {
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: `/recruiter/company/${companyId}/dashboard` },
    { icon: Users, label: 'Candidates', path: `/recruiter/company/${companyId}/candidates` },
    { icon: Briefcase, label: 'Jobs', path: `/recruiter/company/${companyId}/jobs` },
    { icon: FileText, label: 'Applications', path: `/recruiter/company/${companyId}/applications` },
    { icon: BarChart, label: 'Analytics', path: `/recruiter/company/${companyId}/analytics` },
    { icon: Settings, label: 'Settings', path: `/recruiter/company/${companyId}/settings` },
  ];

  return (
    <aside className="w-48 bg-white border-r border-gray-200 h-[calc(100vh-72px)] rounded-lg flex flex-col">
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.label}>
                <Link href={item.path} passHref>
                  <div
                    className={`group flex items-center px-4 py-3 rounded-md cursor-pointer transition-colors duration-200 ${
                      isActive
                        ? "bg-brand-50 text-brand-600 text-1"
                        : "text-gray-600 hover:bg-blue-50/10 hover:text-blue-500"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={`${
                        isActive ? "text-brand-500" : "text-gray-600 group-hover:text-brand-500"
                      } transition-colors duration-200`}
                    />
                    <span
                      className={`ml-4 font-medium whitespace-nowrap ${
                        isActive ? "text-brand-600" : "text-gray-600 group-hover:text-brand-500"
                      } transition-colors duration-200`}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Nice Element at the Bottom */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-md">
          <Zap size={20} className="text-blue-500" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Upgrade to Pro</p>
            <p className="text-xs text-gray-600">Unlock advanced features!</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;