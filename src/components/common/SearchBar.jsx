"use client";
import React, { useState, useRef } from "react";
import { FaSearch, FaBriefcase } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "@/src/hooks/useClickOutside";

// Mock data with job images
const mockSuggestions = [
  { text: "Software Engineer", icon: <FaBriefcase />},
  { text: "Product Manager", icon: <FaBriefcase />},
  { text: "Data Scientist", icon: <FaBriefcase />},
  { text: "UX Designer", icon: <FaBriefcase /> },
  { text: "Frontend Developer", icon: <FaBriefcase />},
  { text: "Backend Developer", icon: <FaBriefcase />},
  { text: "Full Stack Developer", icon: <FaBriefcase />},
  { text: "DevOps Engineer", icon: <FaBriefcase />},
  { text: "Mobile App Developer", icon: <FaBriefcase />},
  { text: "Cloud Architect", icon: <FaBriefcase />},
];

function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filteredSuggestions = mockSuggestions.filter((suggestion) =>
      suggestion.text.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredSuggestions);

    setIsOpen(query.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setIsOpen(false);
  };

  return (
    <div className="search-wrapper w-full max-w-sm hidden lg:flex mx-auto bg-white py-1 border rounded-full  relative">
      <form method="get" action="/jobs/" className="flex flex-1 mx-4">
        <input
          className="flex-1 pl-1 pr-5 py-2 focus:outline-none overflow-hidden text-ellipsis"
          type="text"
          name="search_query"
          id="search"
          placeholder="Search jobs, companies, or keywords"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
      </form>
      <FaSearch className="absolute right-4 top-4 text-gray-800" />

      {/* Dropdown Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-lg z-50 p-4"
          >
            <div className="grid grid-cols-2 gap-4S">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="border  rounded-lg overflow-hidden cursor-pointer transition-all"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    
                    <div className="p-1 flex items-center space-x-2">
                      <span className="p-2 bg-blue-100 rounded-full">{suggestion.icon}</span>
                      <span className="font-medium">{suggestion.text}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-500">
                  <FaSearch className="inline text-gray-600" />
                  <span>No suggestions found</span>
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
