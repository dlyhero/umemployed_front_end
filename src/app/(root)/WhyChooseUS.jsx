"use client";
import React from "react";
import { FaBriefcase, FaUserTie, FaRocket } from "react-icons/fa";

const WhyChooseUs = () => {
  return (
    <section className="bg-white py-16">
      <div className="container max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Illustrative Image */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="/images/jobseek.jpg" // Replace with your illustration
              alt="Illustration"
              className="w-full max-w-md lg:max-w-lg"
            />
          </div>

          {/* Right Column: Content */}
          <div className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 text-lg">
              We provide the best tools and resources to help you find your dream
              job or the perfect candidate.
            </p>

            {/* Features List */}
            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0  text-xl mt-1.5">
                  <FaBriefcase />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Tailored Job Matches
                  </h3>
                  <p className="text-gray-600">
                    Our advanced algorithm matches you with jobs that fit your
                    skills and preferences.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0  text-xl mt-1.5">
                  <FaUserTie />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Expert Career Guidance
                  </h3>
                  <p className="text-gray-600">
                    Get personalized career advice from industry experts to help
                    you grow.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0  text-xl mt-1.5">
                  <FaRocket />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Seamless Application Process
                  </h3>
                  <p className="text-gray-600">
                    Apply to jobs with just a few clicks and track your
                    applications in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
