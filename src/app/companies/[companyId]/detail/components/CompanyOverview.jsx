// src/app/companies/[companyId]/detail/components/CompanyOverview.jsx
import { motion } from 'framer-motion';
import { Building, Info, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CompanyOverview({ company }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
    >
      <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow rounded-xl border-none">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl sm:text-3xl font-semibold text-gray-800">
            <Building size={28} className="text-blue-600" />
            Company Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              <Info size={20} className="text-blue-600" />
              About Us
            </h3>
            <p
              className="text-gray-600 text-sm sm:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: company.description || 'No description available.' }}
            />
          </div>
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              <Target size={20} className="text-blue-600" />
              Our Mission
            </h3>
            <p
              className="text-gray-600 text-sm sm:text-base leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: company.mission_statement || 'No mission statement provided.',
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}