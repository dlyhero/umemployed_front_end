import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Menu, Home, Users, Briefcase, FileText, BarChart, Settings } from 'lucide-react';

const Sidebar = ({ companyId }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: <Home />, label: 'Dashboard', path: `/recruiter/company/${companyId}/dashboard` },
    { icon: <Users />, label: 'Candidates', path: `/recruiter/company/${companyId}/candidates` },
    { icon: <Briefcase />, label: 'Jobs', path: `/recruiter/company/${companyId}/jobs` },
    { icon: <FileText />, label: 'Applications', path: `/recruiter/company/${companyId}/applications` },
    { icon: <BarChart />, label: 'Analytics', path: `/recruiter/company/${companyId}/analytics` },
    { icon: <Settings />, label: 'Settings', path: `/recruiter/company/${companyId}/settings` },
  ];

  return (
    <motion.aside
      initial={{ width: '16rem' }}
      animate={{ width: isOpen ? '16rem' : '4rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white h-screen sticky top-0 shadow"
    >
      <div className="p-4 flex justify-between items-center">
        {isOpen && <h2 className="text-xl font-bold">Menu</h2>}
        <button onClick={toggleSidebar} className="text-gray-600">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <nav className="mt-4">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.path}
            className="flex items-center p-4 hover:bg-gray-100 transition"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-gray-600"
            >
              {item.icon}
            </motion.span>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="ml-4 text-gray-800"
              >
                {item.label}
              </motion.span>
            )}
          </a>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;