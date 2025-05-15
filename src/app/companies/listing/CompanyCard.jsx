"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Building2, Globe, Briefcase, ArrowRight, Star, Users, MapPin } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import baseUrl from '../../api/baseUrl';

const CompanyCard = ({ company: initialCompany, index }) => {
  const { data: session, status } = useSession();
  const [company, setCompany] = useState(initialCompany);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const response = await axios.get(`${baseUrl}/company/company-details/${initialCompany.id}/`, {
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

  const getInitials = (name) => {
    if (!name) return '?';
    
    // Get first letters of each word in the company name
    const words = name.split(' ');
    let initials = words[0][0].toUpperCase();
    
    if (words.length > 1) {
      initials += words[words.length - 1][0].toUpperCase();
    }
    
    return initials;
  };

  const renderLogo = () => {
    if (company.logo && company.logo !== 'https://umemployeds1.blob.core.windows.net/umemployedcont1/resume/images/default.jpg') {
      return (
        <img
          src={company.logo}
          alt={`${company.name} Logo`}
          className="icon-job-small rounded-lg w-full h-full object-contain"
          loading="lazy"
        />
      );
    }
    
    const initials = getInitials(company.name);
    const colors = [
      'bg-blue-500 text-white',
      'bg-green-500 text-white',
      'bg-purple-500 text-white',
      'bg-red-500 text-white',
      'bg-yellow-500 text-white',
      'bg-indigo-500 text-white',
      'bg-pink-500 text-white',
      'bg-teal-500 text-white',
    ];
    
    // Consistent color based on company name
    const colorIndex = (company.name.charCodeAt(0) || 0) % colors.length;
    const colorClass = colors[colorIndex];
    
    return (
      <div className={`w-full h-full rounded-lg flex items-center justify-center ${colorClass} font-bold text-xl`}>
        {initials}
      </div>
    );
  };

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
    <>
      <motion.a
        key={company.id}
        href={`/companies/${company.id}/details`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="tile-elevation-one company-tile-extra w-inline-block bg-white rounded-xl overflow-hidden border"
      >
        <div className="p-6 text-sm">
          <div className="mastet-top-company">
            <div className="top-company flex items-start mb-4">
              <div className="wrap-icon-job-small w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center p-2 mr-4">
                {renderLogo()}
              </div>
              <div>
                <h3 className="text-heading-3 text-xl font-bold text-gray-900 mt-4">{company.name}</h3>
                <div className="flex items-center text-gray-500 mt-1">
                  <Building2 className="w-4 h-4 mr-1" />
                  <span className="text-sm">{company.industry || 'Industry not specified'}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-6 h-[4 rem] overflow-hidden line-clamp-3">{company.description || 'No description available'}</p>
          </div>

          <div className="bottom-company">
            <div className="divider-bottom-company border-t border-gray-200 mb-4"></div>
            <div className="wrap-company-icon-list flex justify-between">
              <div className="single-company-icon-list flex items-center">
                <Users className="icon-company-icon-list w-4 h-4 mr-2 text-brand" />
                <div className="text-sm text-gray-700">{company.employees|| "0"}</div>
              </div>
              <div className="single-company-icon-list flex items-center">
                <MapPin className="icon-company-icon-list w-4 h-4 mr-2 text-brand" />
                <div className="text-sm text-gray-700">{company.location || 'Location not specified'}</div>
              </div>
              <div className="single-company-icon-list flex items-center  px-3 py-1 rounded-full">
                <div className="text-sm font-medium ">{company.job_openings ? 'Openings available' : 'No openings'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.a>
    </>
  );
};

export default CompanyCard;