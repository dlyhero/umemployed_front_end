// src/app/companies/[companyId]/detail/components/CompanyStats.jsx
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function CompanyStats({ company }) {
  const stats = [
    { icon: Calendar, label: 'Founded', value: company.founded || 'N/A' },
    { icon: Users, label: 'Employees', value: company.size || 'N/A' },
    { icon: MapPin, label: 'Headquarters', value: company.location || 'N/A' },
    {
      icon: Globe,
      label: 'Website',
      value: company.website_url ? 'Visit Site' : 'N/A',
      href: company.website_url,
    },
  ];

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
    >
      <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow rounded-xl border-none">
        <CardContent className="pt-6 grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="bg-gray-100 p-3 rounded-full mb-3">
                <stat.icon size={24} className="text-blue-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
              {stat.href && stat.value !== 'N/A' ? (
                <a
                  href={stat.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline text-sm sm:text-base flex items-center gap-2"
                >
                  {stat.value} <Globe size={16} />
                </a>
              ) : (
                <p className="text-sm sm:text-base font-semibold text-gray-800">{stat.value}</p>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}