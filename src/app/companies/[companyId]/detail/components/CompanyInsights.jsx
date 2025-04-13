// src/app/companies/[companyId]/detail/components/CompanyInsights.jsx
import { motion } from 'framer-motion';
import { Users, Leaf, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CompanyInsights({ company }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
    >
      <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow rounded-xl border-none">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl sm:text-3xl font-semibold text-gray-800">
            <BarChart size={28} className="text-blue-600" />
            Company Insights
          </CardTitle>
          <p className="text-gray-600 text-sm sm:text-base">
            Discover what makes <span className="font-medium">{company.name || 'us'}</span> unique.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <Users size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Culture & Work Environment
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                At <span className="font-medium">{company.name || 'our company'}</span>, we foster innovation,
                collaboration, and growth with flexible work policies and continuous learning.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-green-50 to-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                <Leaf size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Sustainability Initiatives
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                We’re dedicated to sustainability, reducing our carbon footprint through innovative practices.
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}