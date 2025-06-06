"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Building2, Globe, Briefcase, ArrowRight, Star, Users, MapPin } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import baseUrl from '../../api/baseUrl';
import { cleanDescription, CompanyLogo } from '@/src/utils/jobFormater';

const CompanyCard = ({ company: initialCompany, index }) => {
  const [company, setCompany] = useState(initialCompany);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {

      try {
        if (typeof window !== 'undefined') {
          const response = await axios.get(`${baseUrl}/company/company-details/${initialCompany.id}/`, {

          });
          setCompany(response.data);
        }
        setCompany(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load company details');
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [initialCompany.id,]);

 

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
                {CompanyLogo(company)}
              </div>
              <div>
                <h3 className="text-heading-3 text-xl font-bold text-gray-900 mt-4 truncate line-clamp-1">{company.name}</h3>
                <div className="flex items-center text-gray-500 mt-1">
                  <Building2 className="w-4 h-4 mr-1" />
                  <span className="text-sm">{company.industry || 'Industry not specified'}</span>
                </div>
              </div>
            </div>
            {company.description ?
              <p className="text-gray-600 mb-4 h-[3.6rem] overflow-hidden line-clamp-3 ">{cleanDescription(company.description)}</p> :
              <p className="text-gray-600 mb-4 h-[3.6rem] overflow-hidden line-clamp-3 flex justify-center items-center">No description available</p>}
          </div>

          <div className="bottom-company">
            <div className="divider-bottom-company border-t border-gray-200 mb-4"></div>
            <div className="wrap-company-icon-list flex justify-between">
              {company.size && <div className="single-company-icon-list flex items-center  overflow-hidden mr-2">
                <Users className="icon-company-icon-list w-4 h-4 mr-1 text-brand " />
                <div className="text-sm text-gray-700 truncate text-nowrap">{company.size}+</div>
              </div>}
              <div className="single-company-icon-list flex items-center text-nowrap mr-2 overflow-hidden">
                <MapPin className="icon-company-icon-list w-4 h-4 mr-1 text-brand" />
                <div className="text-sm text-gray-700 runcate text-nowrap">{company.location || 'Location not specified'}</div>
              </div>
              <div className="single-company-icon-list flex items-center  px-3 py-1 rounded-full  text-nowrap">
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