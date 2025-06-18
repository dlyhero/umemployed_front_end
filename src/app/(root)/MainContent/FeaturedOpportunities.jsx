'use client';
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import JobCard from "../../jobs/_components/JobCard";
import { useJobs } from "@/src/hooks/useJob";

const FeaturedOpportunities = () => {
  const { allJobs, toggleSaveJob, saveJobs, loading } = useJobs();
  const [displayJobs, setDisplayJobs] = useState([]);

  // Set jobs from allJobs
  useEffect(() => {
    if (Array.isArray(allJobs)) {
      setDisplayJobs(allJobs);
    }
  }, [allJobs]);

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
    <section className="w-full overflow-hidden sm:px-6 lg:px-8 py-16">
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

        {displayJobs.length > 0 ? (
          <div className="relative">
            <Slider {...settings}>
              {displayJobs.slice(0, 6).map((job) => (
                <div key={job.id} className="focus:outline-none px-2">
                  <JobCard
                        key={job.id}
                        job={job}
                        loading={loading}
                        onToggleSave={() => toggleSaveJob(job.id)}
                      />
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured opportunities available at this time</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedOpportunities;
