"use client";
import { Building2, Globe, Users, MapPin, Briefcase, ExternalLink, ArrowLeft, Star, Play, Plus } from "lucide-react";
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
  const [showVideoModal, setShowVideoModal] = useState(false);

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

  const getInitials = (name) => {
    if (!name) return '?';

    const words = name.split(' ');
    let initials = words[0][0].toUpperCase();

    if (words.length > 1) {
      initials += words[words.length - 1][0].toUpperCase();
    }

    return initials;
  };

  const renderLogo = () => {
    if (company?.logo && company.logo !== 'https://umemployeds1.blob.core.windows.net/umemployedcont1/resume/images/default.jpg') {
      return (
        <img
          src={company.logo}
          alt={`${company.name} Logo`}
          className="w-full h-full object-contain"
        />
      );
    }

    const initials = getInitials(company?.name);
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

    const colorIndex = (company.name.charCodeAt(0) || 0) % colors.length;
    const colorClass = colors[colorIndex];

    return (
      <div className={`w-full h-full rounded-lg flex items-center justify-center ${colorClass} font-bold text-2xl`}>
        {initials}
      </div>
    );
  };

  const isRecruiter = session?.user?.role === 'recruiter';

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
    <div className="min-h-screen">
      {/* Header with back button */}
      <header className="bg-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-700"
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border-b-2 p-6 mb-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-24 h-24 rounded-lg bg-gray-50 flex items-center justify-center p-3 border border-gray-200">
                  {renderLogo()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mt-4">{company.name}</h1>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Building2 className="w-4 h-4 mr-2" />
                    <span>{company.industry || 'Not specified'}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-brand/70 text-sm">
                      <Star className="w-4 h-4 mr-1 fill-brand text-brand/90" />
                      {company.rating || 'N/A'} Rating
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {jobs.length} open positions
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Video Introduction */}
            {company.video_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl border p-6 mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Introduction</h2>
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer" onClick={() => setShowVideoModal(true)}>
                  {company.video_introduction ? (
                    <img
                      src={company.video_introduction}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Play className="w-12 h-12 text-brand" fill="currentColor" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white drop-shadow-lg" fill="currentColor" />
                  </div>
                </div>
              </motion.div>
            )}



            {/* Company description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl border p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  {company.description || 'No description available.'}
                </p>
                {company.mission_statement && (<>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-6">Our Mission</h2>
                  <div className="prose max-w-none text-gray-700">
                    <p className="mb-4">
                      {company.mission_statement || `${company.name} is committed to ${company.industry ? `revolutionizing the ${company.industry} industry` : 'delivering exceptional value'} through innovation, integrity, and a relentless focus on customer satisfaction.`}
                    </p>

                  </div></>)}
                {
                  company.vision && (<> <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Our Vision</h3>
                    <p className="mb-4">
                      {company.vision}
                    </p></>)
                }

                <blockquote className="border-l-4 border-brand pl-4 py-2 my-4 text-gray-700 italic">
                  "At {company.name}, we're not just matching resumes to job descriptions—we're creating meaningful connections."
                </blockquote>

              </div>
            </motion.div>

            {/* Open positions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-white p-6 border rounded-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Open Positions at {company.name}</h2>
                {isRecruiter && (
                  <Link href={`/jobs/new?company=${company.id}`}>
                    <Button variant="outline" className="text-brand border-brand hover:bg-brand/10">
                      <Plus className="w-4 h-4 mr-2" />
                      Post Job
                    </Button>
                  </Link>
                )}
              </div>
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
                    {isRecruiter && (
                      <Link href={`/jobs/new?company=${company.id}`} className="mt-4 inline-block">
                        <Button className="bg-brand text-white hover:bg-brand/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Post Your First Job
                        </Button>
                      </Link>
                    )}
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
              {/* Post Job Card for Recruiters */}
              {isRecruiter && (
                <div className="bg-white rounded-xl border border-brand/20 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Manage Your Company</h3>
                  <p className="text-gray-600 mb-4">
                    As a recruiter for {company.name}, you can post new job openings and manage existing ones.
                  </p>
                  <Link href={`/jobs/new?company=${company.id}`} className="w-full">
                    <Button className="w-full bg-brand text-white hover:bg-brand/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Post New Job
                    </Button>
                  </Link>
                  <Link href={`/companies/${company.id}/edit`} className="w-full mt-3">
                    <Button variant="outline" className="w-full text-brand border-brand hover:bg-brand/10">
                      Edit Company Profile
                    </Button>
                  </Link>
                </div>
              )}

              {/* Company facts */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Company Facts</h2>
                <div className="space-y-4">
                  {company.contact_email && (
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-brand mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <a
                          href={`mailto:${company.contact_email}`}
                          className="font-medium text-brand hover:underline"
                        >
                          {company.contact_email}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-brand mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Employees</p>
                      <p className="font-medium">{company.size || 'Not specified'}</p>
                    </div>
                  </div>
                  {company.location && <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-brand mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{company.location} {company.country}</p>
                    </div>
                  </div>
                  }
                  {company.founded && <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-brand mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Founded</p>
                      <p className="font-medium">{company.founded || 'Not specified'}</p>
                    </div>
                  </div>}
                  {company.website_url && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-brand mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a
                          href={company.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-brand hover:underline flex items-center"
                        >
                          {company.website_url.replace(/^https?:\/\//, '')}
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Culture & benefits */}
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
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 text-brand mr-2 mt-0.5">✓</span>
                    <span>Professional development budget</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 text-brand mr-2 mt-0.5">✓</span>
                    <span>Comprehensive health benefits</span>
                  </li>
                </ul>
              </div>

              {/* Call to action */}
              {jobs.length > 0 && (
                <div className="bg-brand/5 rounded-xl shadow-sm p-6 border border-brand/10">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Interested in joining?</h2>
                  <p className="text-gray-700 mb-4">
                    Explore all {jobs.length} open positions at {company.name} and find your perfect fit.
                  </p>
                  <Link className="w-full bg-brand text-white inline-block text-center p-2 rounded-lg" href={`/companies/joblisitng/${params.companyId}`}>
                    View All Jobs
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Video Modal */}
      {showVideoModal && company.video_url && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowVideoModal(false)}>
          <div className="relative w-full max-w-4xl aspect-video" onClick={e => e.stopPropagation()}>
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              onClick={() => setShowVideoModal(false)}
            >
              Close
            </button>
            <iframe
              src={company.video_url}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;