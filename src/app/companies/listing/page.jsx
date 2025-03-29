"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Loader from "@/src/components/common/Loader/Loader";
import CompanyCard from './CompanyCard';
import axios from 'axios';
import { Building2, Bookmark, FileText, Search, ChevronLeft, ChevronRight, Users } from 'lucide-react';

const CompanyListPage = () => {
  const { data: session, status } = useSession();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const router = useRouter();

  // Fetch companies from the API
  useEffect(() => {
    const fetchCompanies = async () => {
      if (status === 'unauthenticated') {
        router.push('/api/auth/signin');
        return;
      }

      const token = session?.user?.accessToken || session?.accessToken;
      if (!token) {
        setError('No authentication token found.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          'https://umemployed-app-afec951f7ec7.herokuapp.com/api/company/companies/',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setCompanies(response.data); // Assuming API returns an array of companies
      } catch (err) {
        console.error('Error fetching companies:', err.response?.data || err.message);
        setError('Failed to load companies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') {
      fetchCompanies();
    }
  }, [status, session, router]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Filter companies based on search input
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <main className="py-16 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <section className="bg-white rounded-lg border border-gray-300 shadow-sm p-4 mb-5">
          <ul className="flex justify-start space-x-4 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <li>
              <Link
                href="/recruiter/company/list"
                className="inline-flex items-center text-gray-800 font-medium py-2 px-6 border-b-4 border-[#1e90ff] transition-all duration-300 hover:border-blue-500"
              >
                <Building2 className="text-gray-500 mr-2 h-5 w-5" />
                All Companies
              </Link>
            </li>
            {session && (
              <>
                <li>
                  <Link
                    href="/recruiter/job/saved"
                    className="inline-flex items-center text-gray-600 font-medium py-2 px-6 border-b-4 border-transparent transition-all duration-300 hover:border-[#1e90ff]"
                  >
                    <Bookmark className="text-gray-500 mr-2 h-5 w-5" />
                    Saved
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recruiter/job/applied"
                    className="inline-flex items-center text-gray-600 font-medium py-2 px-6 border-b-4 border-transparent transition-all duration-300 hover:border-[#1e90ff]"
                  >
                    <FileText className="text-gray-500 mr-2 h-5 w-5" />
                    Applied
                  </Link>
                </li>
              </>
            )}
          </ul>
        </section>

        {/* Mobile Search Bar */}
        <section className="my-3 lg:hidden">
          <div className="search-wrapper flex mx-auto bg-white px-2 py-2 border rounded-full shadow sm:shadow-none">
            <input
              className="flex-1 p-2 focus:outline-none overflow-hidden text-ellipsis"
              type="text"
              name="search"
              id="search"
              placeholder="Search companies"
              value={search}
              onChange={handleSearchChange}
            />
            <div className="border-l border-gray-300 mx-2 hidden sm:block"></div>
            <div className="button-wrap">
              <button className="text-white bg-[#1e90ff] rounded-full py-2 px-4">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Top Hiring Companies</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover exciting opportunities with industry leaders
          </p>
        </motion.div>

        {/* Company Cards */}
        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCompanies.map((company, index) => (
              <CompanyCard key={company.id} company={company} index={index} />
            ))}
          </div>
        )}

        {/* Explore All Companies Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Button className="bg-brand hover:bg-brand/90 px-8 py-4 text-lg text-white">
            <Users className="w-5 h-5 mr-2" />
            Explore All Companies
          </Button>
        </motion.div>

        {/* Pagination */}
        <section className="mt-8 flex items-center justify-center space-x-2 p-2">
          <button className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="text-gray-500 h-5 w-5" />
          </button>
          <ul className="flex items-center space-x-1">
            <li>
              <button className="w-10 h-10 flex items-center justify-center text-white bg-[#1e90ff] rounded-lg font-semibold shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                1
              </button>
            </li>
            <li>
              <button className="w-10 h-10 flex items-center justify-center text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
                2
              </button>
            </li>
            <li>
              <button className="w-10 h-10 flex items-center justify-center text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
                3
              </button>
            </li>
            <li>
              <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
            </li>
            <li>
              <button className="w-10 h-10 flex items-center justify-center text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
                10
              </button>
            </li>
          </ul>
          <button className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight className="text-gray-500 h-5 w-5" />
          </button>
        </section>
      </div>
    </main>
  );
};

export default CompanyListPage;

// Custom CSS for scrollbar hiding
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}