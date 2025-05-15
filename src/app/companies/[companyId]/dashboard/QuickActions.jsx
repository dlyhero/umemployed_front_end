'use client';

import { motion } from 'framer-motion';
import { Briefcase, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

const QuickActions = ({ companyId }) => {
  const router = useRouter();

  const actions = [
    {
      icon: <Briefcase />,
      label: 'Post a Job',
      route: `/companies/jobs`,
    },
    {
      icon: <Users />,
      label: 'View Applications',
      route: `/companies/${companyId}/applications`,
    },
  ];

  const handleNavigate = (route) => {
    router.push(route);
  };

  return (
    <div className="flex space-x-4">
      {actions.map((action, index) => (
        <motion.div
          key={index}
          onClick={() => handleNavigate(action.route)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.5, ease: 'easeOut' }}
          whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
          className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition cursor-pointer"
        >
          <span className="text-blue-500">{action.icon}</span>
          <span className="mt-2 text-sm font-medium text-gray-700">{action.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickActions;
