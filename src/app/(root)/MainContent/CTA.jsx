"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Briefcase, UserRound, ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
          {/* Right Column - Descriptive Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <img
              src="/images/cta.avif"
              alt="Career opportunities"
              className="w-full  object-cover rounded-xl"
            />
          </motion.div>

          {/* Left Column - CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Take control of your career path
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands who've found their perfect match through our platform
              </p>
            </div>

            <div className="space-y-6 max-w-md">
              {/* Hire Talent Button */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <Button className="w-full justify-between px-8 py-6 text-lg gap-4 bg-brand text-white hover:bg-brand/70">
                  <Briefcase className="w-6 h-6" />
                  <span className="flex-grow text-center">Hire Top Talent</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Get Hired Button */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <Button 
                  variant="outline" 
                  className="w-full justify-between px-8 py-6 text-lg gap-4 border-gray-300 hover:bg-gray-50"
                >
                  <UserRound className="w-6 h-6" />
                  <span className="flex-grow text-center">Get Hired</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4"
            >
              <p className="text-gray-500">
                Trusted by 5,000+ companies worldwide
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;