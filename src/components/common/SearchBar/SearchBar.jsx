'use client';
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "@/src/hooks/useClickOutside";
import { Search, Briefcase, DollarSign, X, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/src/hooks/useDebounce";
import axios from "axios";
import { useRouter } from "next/navigation";
import baseUrl from "@/src/app/api/baseUrl";
import { useSession } from "next-auth/react";

const SearchBar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("job"); // 'job' or 'salary'
  const [salaryRange, setSalaryRange] = useState({ min: "", max: "" });
  const [showSalaryInputs, setShowSalaryInputs] = useState(false);

  const dropdownRef = useRef(null);
  const mobileModalRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 500);

  useClickOutside(dropdownRef, () => setIsOpen(false));
  useClickOutside(mobileModalRef, () => setIsMobileOpen(false));

  const fetchSearchResults = async () => {
    if ((!searchQuery && searchType !== 'salary') || 
        (searchType === 'salary' && !salaryRange.min && !salaryRange.max)) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const api = axios.create({
        baseURL: baseUrl,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      const params = new URLSearchParams();
      
      if (searchType === 'job') {
        params.append("search", searchQuery);
      } else if (searchType === 'salary') {
        if (salaryRange.min) params.append("min_salary", salaryRange.min);
        if (salaryRange.max) params.append("max_salary", salaryRange.max);
      }

      const response = await api.get(`/job/jobs/search/?${params.toString()}`);
      const results = Array.isArray(response.data) ? response.data : 
                     (response.data.data || []);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchType === 'salary') {
      fetchSearchResults();
    } else if (debouncedQuery) {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery, searchType, salaryRange.min, salaryRange.max]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    
    if (searchType === 'job' && searchQuery.trim()) {
      queryParams.append("search", searchQuery);
    } else if (searchType === 'salary') {
      if (salaryRange.min) queryParams.append("min_salary", salaryRange.min);
      if (salaryRange.max) queryParams.append("max_salary", salaryRange.max);
    }
    
    if (Array.from(queryParams).length > 0) {
      router.push(`/jobs?${queryParams.toString()}`);
      setIsOpen(false);
      setIsMobileOpen(false);
    }
  };

  const handleResultClick = (result) => {
    router.push(`/jobs/${result.id}`);
    setIsOpen(false);
    setIsMobileOpen(false);
    setSearchQuery("");
  };

  const toggleMobileSearch = () => {
    setIsMobileOpen(!isMobileOpen);
    if (!isMobileOpen) {
      setTimeout(() => {
        document.getElementById("mobile-search-input")?.focus();
      }, 100);
    }
  };

  const toggleSearchType = () => {
    setSearchType(prev => prev === 'job' ? 'salary' : 'job');
    setSearchQuery("");
    setSearchResults([]);
    setShowSalaryInputs(prev => !prev);
  };

  const renderResult = (result, index, prefix = "result") => (
    <motion.div
      key={`${prefix}-${index}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => handleResultClick(result)}
      className="p-3 hover:bg-gray-100 cursor-pointer flex items-start gap-3 transition-all"
    >
      <div className="flex-shrink-0 rounded-full bg-blue-50 p-2">
        <Briefcase className="h-5 w-5 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm truncate">{result.title}</h4>
        <div className="text-gray-500 text-xs flex flex-wrap items-center gap-2 mt-1">
          <span>{result.company?.name || 'Unknown company'}</span>
          {result.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {result.location}
            </span>
          )}
          {result.salary_range && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {result.salary_range}
            </span>
          )}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-gray-400 mt-1" />
    </motion.div>
  );

  return (
    <>
      {/* Desktop Search */}
      <div className="relative hidden md:block  flex-1">
        <form onSubmit={handleSearchSubmit} className="relative w-full ">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 w-full ">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={
                  searchType === "job" 
                    ? "Search for jobs" 
                    : "Enter salary range"
                }
                className="w-full flex-1 pl-10 pr-4 bg-blue-50"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(e.target.value.length > 0);
                }}
                onFocus={() => searchQuery.length > 0 && setIsOpen(true)}
              />
              <button
                type="button"
                onClick={toggleSearchType}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {searchType === 'job' ? (
                  <DollarSign className="h-4 w-4" />
                ) : (
                  <Briefcase className="h-4 w-4" />
                )}
              </button>
            </div>
       
          </div>

       
        </form>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, type: "spring" }}
              className="absolute z-50 mt-2 w-full bg-white border border-gray-200 shadow-xl rounded-lg max-h-96 overflow-y-auto"
            >
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 text-sm text-center text-gray-500"
                >
                  Searching...
                </motion.div>
              ) : searchResults.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="divide-y"
                >
                  {searchResults.map((result, index) => renderResult(result, index))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 text-center text-sm text-gray-500"
                >
                  {searchType === 'salary' 
                    ? "Enter salary range to see matching jobs" 
                    : searchQuery 
                    ? "No results found" 
                    : "Start typing to search"}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Search Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden p-4 bg-gray-200" 
        onClick={toggleMobileSearch}
      >
        <Search className="h-5 w-5 text-gray-700" />
      </Button>

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 md:hidden"
          >
            <motion.div
              ref={mobileModalRef}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-2 border-b flex justify-end">
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleSearchSubmit} className="p-4 space-y-4">
                <div className="flex gap-2">
                  <Button
                    className={`border hover:bg-brand hover:text-white  ${searchType === "job" ? "bg-brand text-white" : "bg-transparent"}`}
                    size="sm"
                    onClick={() => {
                      setSearchType("job");
                      setShowSalaryInputs(false);
                    }}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Jobs
                  </Button>
                  <Button
                    size="sm"
                    className={`border hover:bg-brand hover:text-white  ${searchType === "salary" ? "bg-brand text-white" : "bg-transparent"}`}
                    onClick={() => {
                      setSearchType("salary");
                      setShowSalaryInputs(true);
                    }}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Salary
                  </Button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={
                      searchType === "job" 
                        ? "Search for jobs" 
                        : "Enter salary range"
                    }
                    className="w-full pl-10 pr-4"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsOpen(e.target.value.length > 0);
                    }}
                    id="mobile-search-input"
                  />
                </div>
                
                {searchType === 'salary' && (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min salary"
                      className="flex-1"
                      value={salaryRange.min}
                      onChange={(e) => setSalaryRange({...salaryRange, min: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Max salary"
                      className="flex-1"
                      value={salaryRange.max}
                      onChange={(e) => setSalaryRange({...salaryRange, max: e.target.value})}
                    />
                  </div>
                )}
              </form>

              <div className="max-h-[60vh] overflow-y-auto border-t">
                {isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 text-center text-sm text-gray-500"
                  >
                    Searching...
                  </motion.div>
                ) : searchResults.length > 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="divide-y"
                  >
                    {searchResults.map((result, index) => renderResult(result, index, "mobile"))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 text-center text-sm text-gray-500"
                  >
                    {searchType === 'salary' 
                      ? "Enter salary range to see matching jobs" 
                      : searchQuery 
                      ? "No results found" 
                      : "Start typing to search"}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchBar;