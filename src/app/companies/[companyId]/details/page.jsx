"use client";
import { Building2, Globe, Users, MapPin, Briefcase, ExternalLink, ArrowLeft, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import JobCard from "../../../jobs/_components/JobCard";
import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Loader from "@/src/components/common/Loader/Loader";
import baseUrl from "@/src/app/api/baseUrl";
import Link from "next/link";
import { useJobs } from "@/src/hooks/useJob";

const CompanyDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toggleSaveJob } = useJobs();


  console.log('params:', params)

  useEffect(() => {
    const fetchCompanyData = async () => {
      const token = session?.user?.accessToken || session?.accessToken;
      if (!token) {
        setError('No authentication token found.');
        setLoading(false);
        return;
      }

      try {
        // Fetch company details
        const companyRes = await axios.get(
          `${baseUrl}/company/company-details/${params.companyId}/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setCompany(companyRes.data);

        // Fetch company jobs
        const jobsRes = await axios.get(
          `${baseUrl}/company/company/${params.companyId}/jobs/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setJobs(jobsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err.response || err.message);
        setError('Failed to load company data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchCompanyData();
    }
  }, [params.companyId, session]);


  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Company not found</p>
      </div>
    );
  }

  return (
    <div className=" min-h-screen">
      {/* Header with back button */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-brand hover:bg-brand/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Companies
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-2">
            {/* Company header */}
            {/* Company header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border-b-2 p-6 mb-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-24 h-24 rounded-lg bg-gray-50 flex items-center justify-center p-3 border border-gray-200">
                  <img
                    src={company.logo || '/default-company.png'}
                    alt={`${company.name} Logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Building2 className="w-4 h-4 mr-2" />
                    <span>{company.industry || 'Not specified'}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-brand/70 text-sm">
                      <Star className="w-4 h-4 mr-1 fill-brand text-brand/90" />
                      {company.rating || 'N/A'} Rating
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {jobs.length} Open Positions
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Company description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl border p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  {company.description || 'No description available.'}
                </p>

                {/* Hardcoded sections to match static version */}
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Our Vision</h3>
                <p className="mb-4">
                  {company.vision || 'A world where talent meets opportunity seamlessly.'}
                </p>

                <blockquote className="border-l-4 border-brand pl-4 py-2 my-4 text-gray-700 italic">
                  "At {company.name}, we're not just matching resumes to job descriptions—we're creating meaningful connections."
                </blockquote>
              </div>
            </motion.div>

            {/* Open positions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Open Positions at {company.name}</h2>
              <div className="space-y-4">
                {jobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.slice(0, 2).map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onToggleSave={() => toggleSaveJob(job.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-8 text-center">
                    <p className="text-gray-600">No open positions at this time</p>
                  </div>
                )}
              </div>
            </motion.div>

          </div>

          {/* Right column - Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-6 space-y-6"
            >
              {/* Company facts */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Company Facts</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-brand mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Employees</p>
                      <p className="font-medium">{company.employees || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-brand mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{company.location || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-brand mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Founded</p>
                      <p className="font-medium">{company.founded_year || 'Not specified'}</p>
                    </div>
                  </div>
                  {company.website && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-brand mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-brand hover:underline flex items-center"
                        >
                          {company.website.replace(/^https?:\/\//, '')}
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Culture & benefits (hardcoded to match static) */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Culture & Benefits</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 text-brand mr-2 mt-0.5">✓</span>
                    <span>Remote-first work environment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 text-brand mr-2 mt-0.5">✓</span>
                    <span>Competitive salaries & equity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 text-brand mr-2 mt-0.5">✓</span>
                    <span>Unlimited PTO & flexible schedules</span>
                  </li>
                </ul>
              </div>

              {/* Call to action */}
              <div className="bg-brand/5 rounded-xl shadow-sm p-6 border border-brand/10">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Interested in joining?</h2>
                <p className="text-gray-700 mb-4">
                  Explore all {jobs.length} open positions at {company.name} and find your perfect fit.
                </p>
                <Link className="w-full bg-brand text-white inline-block text-center p-2 rounded-lg" href={`/companies/joblisitng/${params.companyId}`}>
                  View All Jobs
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDetails;