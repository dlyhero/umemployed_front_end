"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Building2, Globe, Briefcase, ArrowRight, Star, Users, MapPin } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import baseUrl from '../../api/baseUrl';

const DEFAULT_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

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
                {company.logo ? (
                  <img
                    src={company.logo || "/placeholder.svg"}
                    alt={`${company.name} Logo`}
                    className="icon-job-small rounded-lg w-full h-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <Building2 className="text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-heading-3 text-xl font-bold text-gray-900">{company.name}</h3>
                <div className="flex items-center text-gray-500 mt-1">
                  <Building2 className="w-4 h-4 mr-1" />
                  <span className="text-sm">{company.industry || 'Industry not specified'}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-6 h-[4rem] overflow-hidden line-clamp-3">{company.description || 'No description available'}</p>
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
