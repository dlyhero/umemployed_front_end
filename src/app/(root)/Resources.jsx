"use client"
import React, { useState } from "react";

const Resources = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const resources = [
    {
      title: "Job Search Tips",
      content: "Learn how to optimize your resume, ace interviews, and network effectively.",
      link: "#",
      linkText: "Explore Tips",
    },
    {
      title: "Free Online Courses",
      content: "Upskill with free courses in tech, business, and more to boost your employability.",
      link: "#",
      linkText: "Browse Courses",
    },
    {
      title: "Job Boards",
      content: "Discover job openings tailored to your skills and experience.",
      link: "#",
      linkText: "Find Jobs",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className=" max-w-6xl mx-auto px-4 space-x-10">
        <div className="">
          <h2 className="text-2xl md:tex-3xl font-bold text-brand mb-6">Resources for Job Seekers</h2>
          <p className="text-gray-600 mb-8">
            Navigate your job search with confidence. Explore tools, tips, and opportunities tailored for you.
          </p>

          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-4 text-left text-brand font-semibold hover:bg-indigo-50"
                  onClick={() => toggleAccordion(index)}
                >
                  <span>{resource.title}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transform transition-transform duration-300 ${openAccordion === index ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === index ? "max-h-40" : "max-h-0"
                    }`}
                >
                  <div className="p-4 pt-0 text-gray-600">
                    <p>{resource.content}</p>
                    <a href={resource.link} className="mt-2 inline-block text-brand hover:underline">
                      {resource.linkText}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;