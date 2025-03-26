"use client";
import React, { useState, useRef } from "react";
import { 
  FaSearch, 
  FaBriefcase, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaUserTie,
  FaMoneyBillWave,
  FaClock
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "@/src/hooks/useClickOutside";

// Mock data for different search categories
const mockData = {
  jobs: [
    { 
      text: "Software Engineer", 
      icon: <FaBriefcase className="text-gray-600" />,
      company: "Tech Corp Inc.", 
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120,000 - $150,000"
    },
    { 
      text: "Product Manager", 
      icon: <FaBriefcase className="text-gray-600" />,
      company: "Product Labs", 
      location: "Remote",
      type: "Contract",
      salary: "$90 - $120/hr"
    }
  ],
  companies: [
    { 
      text: "Tech Corp Inc.", 
      icon: <FaBuilding className="text-gray-600" />,
      info: "Information Technology • 10,001+ employees",
      followers: "1,234,567 followers"
    },
    { 
      text: "Design Hub", 
      icon: <FaBuilding className="text-gray-600" />,
      info: "Design Services • 501-1,000 employees",
      followers: "56,789 followers"
    }
  ],
  locations: [
    { 
      text: "San Francisco, California", 
      icon: <FaMapMarkerAlt className="text-gray-600" />,
      info: "1,234,567+ members"
    },
    { 
      text: "Remote", 
      icon: <FaMapMarkerAlt className="text-gray-600" />,
      info: "5,678,901+ members"
    }
  ],
  jobTypes: [
    { 
      text: "Full-time", 
      icon: <FaClock className="text-gray-600" />,
      count: "1,234,567+ jobs"
    },
    { 
      text: "Part-time", 
      icon: <FaClock className="text-gray-600" />,
      count: "456,789+ jobs"
    }
  ],
  salaries: [
    { 
      text: "$100,000+", 
      icon: <FaMoneyBillWave className="text-gray-600" />,
      count: "234,567+ jobs"
    },
    { 
      text: "$150,000+", 
      icon: <FaMoneyBillWave className="text-gray-600" />,
      count: "123,456+ jobs"
    }
  ],
  people: [
    { 
      text: "John Doe", 
      icon: <FaUserTie className="text-gray-600" />,
      info: "CTO at Tech Corp Inc.",
      connections: "500+ connections"
    },
    { 
      text: "Jane Smith", 
      icon: <FaUserTie className="text-gray-600" />,
      info: "Product Manager at Design Hub",
      connections: "Mutual Connection"
    }
  ]
};

function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsOpen(query.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setIsOpen(false);
  };

  const filteredData = {
    jobs: mockData.jobs.filter(item => 
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    companies: mockData.companies.filter(item => 
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    locations: mockData.locations.filter(item => 
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    jobTypes: mockData.jobTypes.filter(item => 
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    salaries: mockData.salaries.filter(item => 
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    people: mockData.people.filter(item => 
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.info.toLowerCase().includes(searchQuery.toLowerCase())
    )
  };

  const hasResults = Object.values(filteredData).some(category => category.length > 0);

  const renderCategory = (category, title, icon) => {
    if (filteredData[category].length === 0 && activeCategory !== "all") return null;
    
    return (
      <div className="mb-4">
        <div className="flex items-center text-sm font-semibold text-gray-500 px-3 py-2">
          {icon}
          <span className="ml-2">{title}</span>
        </div>
        {filteredData[category].map((item, index) => (
          <div
            key={`${category}-${index}`}
            className="hover:bg-gray-50 px-3 py-2 cursor-pointer transition-all"
            onClick={() => handleSuggestionClick(item)}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.text}</div>
                {item.company && (
                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <FaBuilding className="mr-1 text-gray-500" size={12} />
                    {item.company}
                  </div>
                )}
                {item.info && (
                  <div className="text-sm text-gray-600 mt-1">
                    {item.info}
                  </div>
                )}
                {item.location && (
                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <FaMapMarkerAlt className="mr-1 text-gray-500" size={12} />
                    {item.location}
                  </div>
                )}
                {(item.type || item.salary) && (
                  <div className="flex space-x-4 mt-2">
                    {item.type && (
                      <span className="text-xs text-gray-500">{item.type}</span>
                    )}
                    {item.salary && (
                      <span className="text-xs text-gray-500">{item.salary}</span>
                    )}
                  </div>
                )}
                {(item.followers || item.count || item.connections) && (
                  <div className="text-xs text-gray-500 mt-1">
                    {item.followers || item.count || item.connections}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="search-wrapper w-full max-w-lg hidden lg:flex mx-auto bg-[#F3F2EF] py-1 rounded-full relative">
      <form method="get" action="/search/" className="flex flex-1 mx-4">
        <input
          className="flex-1 pl-4 pr-5 py-2 focus:outline-none overflow-hidden text-ellipsis bg-transparent"
          type="text"
          name="query"
          id="search"
          placeholder="Search for jobs, people, companies, or more"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => searchQuery.length > 0 && setIsOpen(true)}
        />
      </form>
      <button 
        type="submit" 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
      >
        <FaSearch />
      </button>

      {/* LinkedIn-style Multi-category Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-md z-50 border border-gray-200 max-h-[70vh] overflow-y-auto"
          >
            <div className="p-2">
              {/* Category Filters */}
              <div className="flex space-x-2 px-2 py-1 border-b border-gray-200 overflow-x-auto">
                <button 
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${activeCategory === "all" ? "bg-gray-200 font-medium" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveCategory("all")}
                >
                  All
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${activeCategory === "jobs" ? "bg-gray-200 font-medium" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveCategory("jobs")}
                >
                  Jobs
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${activeCategory === "companies" ? "bg-gray-200 font-medium" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveCategory("companies")}
                >
                  Companies
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${activeCategory === "people" ? "bg-gray-200 font-medium" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveCategory("people")}
                >
                  People
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${activeCategory === "locations" ? "bg-gray-200 font-medium" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveCategory("locations")}
                >
                  Locations
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${activeCategory === "salaries" ? "bg-gray-200 font-medium" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveCategory("salaries")}
                >
                  Salaries
                </button>
              </div>

              {hasResults ? (
                <>
                  {(activeCategory === "all" || activeCategory === "jobs") && 
                    renderCategory("jobs", "Jobs", <FaBriefcase size={14} />)}
                  
                  {(activeCategory === "all" || activeCategory === "companies") && 
                    renderCategory("companies", "Companies", <FaBuilding size={14} />)}
                  
                  {(activeCategory === "all" || activeCategory === "people") && 
                    renderCategory("people", "People", <FaUserTie size={14} />)}
                  
                  {(activeCategory === "all" || activeCategory === "locations") && 
                    renderCategory("locations", "Locations", <FaMapMarkerAlt size={14} />)}
                  
                  {(activeCategory === "all" || activeCategory === "jobTypes") && 
                    renderCategory("jobTypes", "Job Types", <FaClock size={14} />)}
                  
                  {(activeCategory === "all" || activeCategory === "salaries") && 
                    renderCategory("salaries", "Salaries", <FaMoneyBillWave size={14} />)}
                </>
              ) : (
                <div className="px-3 py-4 text-center text-gray-500">
                  <span>No results found for "{searchQuery}"</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;