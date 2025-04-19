"use client";
import { Briefcase, User, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const WhyChooseUs = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-end">
            <img
              src="/images/why.avif"
              alt="Job seeker illustration"
              className="w-full max-w-md lg:max-w-lg rounded-xl"
            />
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Why Choose Us?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We provide the best tools and resources to help you find your dream job.
              </p>
            </motion.div>

            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="bg-brand/10 p-3 rounded-lg text-brand">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-2">
                    Tailored Job Matches
                  </h3>
                  <p className="text-gray-600">
                    Our advanced algorithm matches you with perfect jobs.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="bg-brand/10 p-3 rounded-lg text-brand">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-2">
                    Expert Career Guidance
                  </h3>
                  <p className="text-gray-600">
                    Get personalized career advice from experts.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="bg-brand/10 p-3 rounded-lg text-brand">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-2">
                    Seamless Application
                  </h3>
                  <p className="text-gray-600">
                    Apply to jobs with just a few clicks.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
