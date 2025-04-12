"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Building2, Globe, Briefcase, ArrowRight, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const DEFAULT_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const CompanyCard = ({ company: initialCompany, index }) => {
  const { data: session, status } = useSession();
  const [company, setCompany] = useState(initialCompany);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'https://umemployed-app-afec951f7ec7.herokuapp.com';

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (status === 'loading') return;
      if (status === 'unauthenticated') {
        setError('Please log in to view company details');
        setLoading(false);
        return;
      }

      const token = session?.user?.accessToken || session?.accessToken;
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/company/company-details/${initialCompany.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompany(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching company details:', err);
        setError('Failed to load company details');
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [initialCompany.id, session, status]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-center h-64">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
    >
      <Link href={`/recruiter/company/${company.id}`} className="block h-full">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center p-2">
              <img
                src={company.logo || DEFAULT_LOGO}
                alt={`${company.name} Logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = DEFAULT_LOGO;
                }}
              />
            </div>
            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-400 mr-1" />
              <span className="text-sm font-medium text-yellow-700">
                {company.rating || 'N/A'}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-1">{company.name}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Building2 className="w-4 h-4 mr-1" />
            <span className="text-sm">{company.industry || 'Industry not specified'}</span>
          </div>

          <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
            {company.description || 'No description available'}
          </p>

          <div className="flex justify-between items-center mb-6 text-gray-600">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {company.job_openings ? 'Openings available' : 'No openings'}
              </span>
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              <span className="text-sm">{company.location || 'Location not specified'}</span>
            </div>
          </div>

          <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 group">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};

export default CompanyCard;