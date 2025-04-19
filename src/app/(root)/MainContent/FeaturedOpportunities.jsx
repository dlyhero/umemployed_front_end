'use client';
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import JobCard from "../../(Jobs)/components/JobCard";

const companyLogos = [
  "/examples/company1.png",
  "/examples/company2.png",
  "/examples/company3.png",
  "/examples/company4.png",
  "/examples/company5.png"
];

const FeaturedOpportunities = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Software Engineer",
      company: { name: "Tech Corp", logo: companyLogos[0] },
      job_location_type: "Remote",
      location: "New York",
      salary_range: "80,000 - 100,000",
      created_at: "2 days ago",
      description: "Lead the design system implementation for our flagship product with a focus on accessibility."
    },
    {
      id: 2,
      title: "Product Designer",
      company: { name: "Design Co", logo: companyLogos[1] },
      job_location_type: "Hybrid",
      location: "San Francisco",
      salary_range: "90,000 - 120,000",
      created_at: "1 week ago",
    },
    {
      id: 3,
      title: "Data Scientist",
      company: { name: "Data Inc", logo: companyLogos[2] },
      job_location_type: "Remote",
      location: "Chicago",
      salary_range: "95,000 - 130,000",
      created_at: "3 days ago",
    },
    {
      id: 4,
      title: "Marketing Manager",
      company: { name: "Market Leaders", logo: companyLogos[3] },
      job_location_type: "On-site",
      location: "Boston",
      salary_range: "70,000 - 90,000",
      created_at: "5 days ago",
      description: "Develop and execute marketing campaigns to drive brand awareness."
    },
  ]);

  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  // Load saved/applied jobs from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const applied = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    setSavedJobs(saved);
    setAppliedJobs(applied);
  }, []);

  const toggleSave = (jobId, isSaved) => {
    setSavedJobs(prev => {
      const newSavedJobs = isSaved 
        ? [...prev, jobId] 
        : prev.filter(id => id !== jobId);
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      return newSavedJobs;
    });
  };

  const handleApply = (jobId) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs(prev => {
        const newAppliedJobs = [...prev, jobId];
        localStorage.setItem('appliedJobs', JSON.stringify(newAppliedJobs));
        return newAppliedJobs;
      });
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  // Enhance jobs with saved/applied status
  const enhancedJobs = jobs.map(job => ({
    ...job,
    is_saved: savedJobs.includes(job.id),
    is_applied: appliedJobs.includes(job.id)
  }));

  return (
    <section className="w-full overflow-hidden sm:px-6 lg:px-8 py-16 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Opportunities</h2>
          <p className="text-lg md:text-xl text-gray-600">
            Find the best jobs tailored to your skills and preferences
          </p>
        </motion.div>

        <div className="relative">
          <Slider {...settings}>
            {enhancedJobs.map((job) => (
              <div key={job.id} className="focus:outline-none px-2">
                <JobCard
                  job={job}
                  onToggleSave={toggleSave}
                  onApplyJob={handleApply}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default FeaturedOpportunities;