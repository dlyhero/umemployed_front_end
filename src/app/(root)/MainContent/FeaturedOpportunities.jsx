'use client';
import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import JobCard from "../../Jobs/JobCard";

// Using shadcn/ui example images
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
      company: {
        name: "Tech Corp",
        logo: companyLogos[0],
      },
      job_location_type: "Remote",
      location: "New York",
      salary_range: "80,000 - 100,000",
      created_at: "2 days ago",
      is_saved: false,
      is_applied: false,
    },
    {
      id: 2,
      title: "Product Designer",
      company: {
        name: "Design Co",
        logo: companyLogos[1],
      },
      job_location_type: "Hybrid",
      location: "San Francisco",
      salary_range: "90,000 - 120,000",
      created_at: "1 week ago",
      is_saved: false,
      is_applied: false,
    },
    {
      id: 3,
      title: "Data Scientist",
      company: {
        name: "Data Inc",
        logo: companyLogos[2],
      },
      job_location_type: "Remote",
      location: "Chicago",
      salary_range: "95,000 - 130,000",
      created_at: "3 days ago",
      is_saved: false,
      is_applied: false,
    },
    {
      id: 4,
      title: "Marketing Manager",
      company: {
        name: "Market Leaders",
        logo: companyLogos[3],
      },
      job_location_type: "On-site",
      location: "Boston",
      salary_range: "70,000 - 90,000",
      created_at: "5 days ago",
      is_saved: false,
      is_applied: false,
    },
  ]);

  const toggleSave = (jobId) => {
    setJobs(jobs.map(job =>
      job.id === jobId ? { ...job, is_saved: !job.is_saved } : job
    ));
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

  return (
    <section className="w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-16 bg-slate-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Opportunities</h2>
          <p className="text-lg text-gray-600">
            Find the best jobs tailored to your skills and preferences
          </p>
        </motion.div>

        <div className="relative">
          <Slider {...settings}>
            {jobs.map((job) => (
              <div key={job.id} className="px-2 focus:outline-none">
                <JobCard
                  job={job} 
                  onToggleSave={() => toggleSave(job.id)} 
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