"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Briefcase, UserRound, ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";

const CTA = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <div className="space-y-4">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
              >
                Take the next step in your <span className="text-brand">career journey</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg md:text-xl text-gray-600 max-w-lg"
              >
                Join thousands of professionals and companies finding perfect matches through our platform
              </motion.p>
            </div>

            <div className="space-y-6 max-w-md">
              {/* Hire Talent Button */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button className="w-full justify-between px-8 py-6 text-lg gap-4 bg-brand hover:bg-brand/70 text-white transition-all duration-300 shadow-lg hover:shadow-blue-200">
                    <Briefcase className="w-6 h-6" />
                    <span className="text-base md:text-lg font-medium">Hire Top Talent</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Get Hired Button */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Button 
                  variant="outline" 
                  className="w-full justify-between px-8 py-6 text-md gap-4 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm"
                >
                    <UserRound className="w-6 h-6" />
                    <span className="text-base md:text-md font-medium">Find Your Dream Job</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-4 flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    {/* Placeholder for company logos */}
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-sm md:text-base">
                Trusted by <span className="font-medium text-gray-700">5,000+</span> companies worldwide
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative aspect-square w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/cta.avif"
                alt="Career opportunities"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              
              {/* Floating testimonial card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg max-w-md"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">"Found my dream job in just 2 weeks!"</p>
                    <p className="text-gray-500 text-sm mt-1">- Sarah M., Product Designer</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;