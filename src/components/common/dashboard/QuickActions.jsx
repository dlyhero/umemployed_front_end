import { motion } from 'framer-motion';
import { Briefcase, Users } from 'lucide-react';

const QuickActions = ({ companyId }) => {
  const actions = [
    { icon: <Briefcase />, label: 'Post a Job', path: `/recruiter/company/${companyId}/post-job` },
    { icon: <Users />, label: 'View Applications', path: `/recruiter/company/${companyId}/applications` },
  ];

  return (
    <div className="flex space-x-4">
      {actions.map((action, index) => (
        <motion.a
          key={index}
          href={action.path}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.5, ease: 'easeOut' }}
          whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
          className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition"
        >
          <span className="text-blue-500">{action.icon}</span>
          <span className="mt-2 text-sm font-medium text-gray-700">{action.label}</span>
        </motion.a>
      ))}
    </div>
  );
};

export default QuickActions;