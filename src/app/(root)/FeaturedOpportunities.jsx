"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FeaturedOpportunities = () => {
  // Hard-coded job data
  const jobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: {
        name: "Tech Corp",
        logo: "https://via.placeholder.com/40", // Placeholder image
      },
      job_location_type: "Remote",
      location: {
        name: "New York",
      },
      salary_range: "80,000 - 100,000",
      created_at: "2 days ago",
      is_saved: false,
      is_applied: false,
    },
    {
      id: 2,
      title: "Product Manager",
      company: {
        name: "Innovate Inc",
        logo: "https://via.placeholder.com/40", // Placeholder image
      },
      job_location_type: "On-site",
      location: {
        name: "San Francisco",
      },
      salary_range: "90,000 - 120,000",
      created_at: "1 week ago",
      is_saved: true,
      is_applied: true,
    },
    {
      id: 3,
      title: "Data Scientist",
      company: {
        name: "DataWorks",
        logo: "https://via.placeholder.com/40", // Placeholder image
      },
      job_location_type: "Hybrid",
      location: {
        name: "Chicago",
      },
      salary_range: "85,000 - 110,000",
      created_at: "3 days ago",
      is_saved: false,
      is_applied: false,
    },
    {
      id: 4,
      title: "UX Designer",
      company: {
        name: "DesignCo",
        logo: "https://via.placeholder.com/40", // Placeholder image
      },
      job_location_type: "Remote",
      location: {
        name: "Austin",
      },
      salary_range: "75,000 - 95,000",
      created_at: "5 days ago",
      is_saved: true,
      is_applied: false,
    },
  ];

  // Slick carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true, // Enable auto-play
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="container max-w-6xl px-4 lg:px-6 mx-auto py-12 overflow-hidden">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
          Featured Opportunities
        </h2>
        <p className="text-gray-600 text-lg">
          Find the best jobs tailored to your skills and preferences.
        </p>
      </div>

      {/* Job Cards Carousel */}
      <div>
        <Slider {...settings}>
          {jobs.map((job) => (
            <div key={job.id} className="px-2">
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <img
                    className="w-12 h-12 rounded-full mr-4"
                    src={job.company.logo}
                    alt="Company Logo"
                  />
                  <div>
                    <span className="text-md text-gray-500 capitalize">
                      {job.job_location_type}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-gray-600">{job.company.name}</span>
                    <span className="text-gray-500" style={{ fontSize: "16px" }}>
                      {job.created_at}
                    </span>
                  </div>
                </div>

                <p className="text-brand font-semibold text-sm p-1 bg-[rgba(30,144,250,0.1)] w-fit rounded mb-4 flex items-center">
                  <i className="fas fa-map-marker-alt mr-2"></i> {job.location.name}
                </p>

                <p className="text-gray-800 mb-4 flex items-center">
                  ${job.salary_range} / year
                </p>

                {/* Bookmark Icon */}
                <div className="flex items-center justify-between">
                  {job.is_saved ? (
                    <a className="bookmark-job flex-1" data-job-id={job.id}>
                      <i className="fas fa-bookmark text-brand text-xl order-start"></i>
                    </a>
                  ) : (
                    <a className="bookmark-job flex-1" data-job-id={job.id}>
                      <i className="far fa-bookmark text-gray-500 text-xl hover:text-brand"></i>
                    </a>
                  )}

                  {/* Apply Now Button or Already Applied */}
                  {job.is_applied ? (
                    <span className="text-green-500 py-2 px-2 ">(Already Applied)</span>
                  ) : (
                    <div className="w-[70%]">
                      <a href={`/job/${job.id}`}>
                        <button className="bg-brand text-white font-bold py-2 px-2 rounded-full hover:bg-blue-400 w-full">
                          Apply Now
                        </button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default FeaturedOpportunities;