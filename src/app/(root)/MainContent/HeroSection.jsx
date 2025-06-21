import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Search, Briefcase } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import MobileSearchBar from "@/src/components/common/SearchBar/MobileSearchBar";
import SearchBar from "@/src/components/common/SearchBar/SearchBar";
import { Header } from "@/src/components/common/Header";
import HeroHeader from "@/src/components/common/Header/HeroHeader";

const HeroSection = ({ session, status }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
   <>
    <section id="Hero-section" className="relative overflow-hidden bg-brand">
      <HeroHeader/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content - Text and CTA */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6 md:space-y-8"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-brand text-sm font-medium">
                <Rocket className="mr-2 h-4 w-4" />
                New opportunities waiting
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-center md:text-start"
            >
              Unlock Your <span className="text-brand Herotitle">Dream Job</span> <br />
              The Future Starts Now!
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white text-center md:text-start"
            >
              Browse thousands of job listings <br className="lg:hidden"/> and seize the opportunity<br />
              to advance your career with our platform.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="hidden lg:flex flex-col gap-4 pt-6"
            >
              <SearchBar />
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4 pt-6 items-center md:items-start"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((item) => (
                  <img
                    key={item}
                    src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item + 20}.jpg`}
                    className="w-14 h-14 rounded-full border-2 border-white"
                    alt="User"
                  />
                ))}
              </div>
              <div className="text-white text-lg flex ">
                <span className="font-bold">5,000+</span> professionals hired last month
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Your Image with Enhancements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden">
              {/* Your original image with parallax effect */}
              <img 
                className="bg-cover w-full max-w-[2000px] h-auto" 
                src="/hero.webp" 
                alt="Hero" 
              />

              {/* Floating job card overlay */}
              <motion.div
                className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-md max-w-xs"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Briefcase className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Senior Developer</h4>
                    <p className="text-sm text-gray-600">Tech Company Inc.</p>
                    <p className="text-xs text-brand mt-1">$120k - $150k • Remote</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats badges */}
            <motion.div
              className="absolute -bottom-4 -right-4 bg-green-100 rounded-lg p-3 shadow-lg border border-green-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-green-700 font-medium text-sm">1,000+ Companies Hiring</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-50 rounded-full filter blur-3xl opacity-40"></div>
      </div>

      {/* Wave SVG positioned at the bottom */}
      
    </section>
    <div className="left-0 w-full">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 283.5 27.8" 
      preserveAspectRatio="none"
      className="w-full h-auto"
      style={{ display: 'block' }}
    >
      <path 
        className="fill-brand" 
        d="M283.5,9.7c0,0-7.3,4.3-14,4.6c-6.8,0.3-12.6,0-20.9-1.5c-11.3-2-33.1-10.1-44.7-5.7s-12.1,4.6-18,7.4c-6.6,3.2-20,9.6-36.6,9.3C131.6,23.5,99.5,7.2,86.3,8c-1.4,0.1-6.6,0.8-10.5,2c-3.8,1.2-9.4,3.8-17,4.7c-3.2,0.4-8.3,1.1-14.2,0.9c-1.5-0.1-6.3-0.4-12-1.6c-5.7-1.2-11-3.1-15.8-3.7C6.5,9.2,0,10.8,0,10.8V0h283.5V9.7z M260.8,11.3c-0.7-1-2-0.4-4.3-0.4c-2.3,0-6.1-1.2-5.8-1.1c0.3,0.1,3.1,1.5,6,1.9C259.7,12.2,261.4,12.3,260.8,11.3z M242.4,8.6c0,0-2.4-0.2-5.6-0.9c-3.2-0.8-10.3-2.8-15.1-3.5c-8.2-1.1-15.8,0-15.1,0.1c0.8,0.1,9.6-0.6,17.6,1.1c3.3,0.7,9.3,2.2,12.4,2.7C239.9,8.7,242.4,8.6,242.4,8.6z M185.2,8.5c1.7-0.7-13.3,4.7-18.5,6.1c-2.1,0.6-6.2,1.6-10,2c-3.9,0.4-8.9,0.4-8.8,0.5c0,0.2,5.8,0.8,11.2,0c5.4-0.8,5.2-1.1,7.6-1.6C170.5,14.7,183.5,9.2,185.2,8.5z M199.1,6.9c0.2,0-0.8-0.4-4.8,1.1c-4,1.5-6.7,3.5-6.9,3.7c-0.2,0.1,3.5-1.8,6.6-3C197,7.5,199,6.9,199.1,6.9z M283,6c-0.1,0.1-1.9,1.1-4.8,2.5s-6.9,2.8-6.7,2.7c0.2,0,3.5-0.6,7.4-2.5C282.8,6.8,283.1,5.9,283,6z M31.3,11.6c0.1-0.2-1.9-0.2-4.5-1.2s-5.4-1.6-7.8-2C15,7.6,7.3,8.5,7.7,8.6C8,8.7,15.9,8.3,20.2,9.3c2.2,0.5,2.4,0.5,5.7,1.6S31.2,11.9,31.3,11.6z M73,9.2c0.4-0.1,3.5-1.6,8.4-2.6c4.9-1.1,8.9-0.5,8.9-0.8c0-0.3-1-0.9-6.2-0.3S72.6,9.3,73,9.2z M71.6,6.7C71.8,6.8,75,5.4,77.3,5c2.3-0.3,1.9-0.5,1.9-0.6c0-0.1-1.1-0.2-2.7,0.2C74.8,5.1,71.4,6.6,71.6,6.7z M93.6,4.4c0.1,0.2,3.5,0.8,5.6,1.8c2.1,1,1.8,0.6,1.9,0.5c0.1-0.1-0.8-0.8-2.4-1.3C97.1,4.8,93.5,4.2,93.6,4.4z M65.4,11.1c-0.1,0.3,0.3,0.5,1.9-0.2s2.6-1.3,2.2-1.2s-0.9,0.4-2.5,0.8C65.3,10.9,65.5,10.8,65.4,11.1z M34.5,12.4c-0.2,0,2.1,0.8,3.3,0.9c1.2,0.1,2,0.1,2-0.2c0-0.3-0.1-0.5-1.6-0.4C36.6,12.8,34.7,12.4,34.5,12.4z M152.2,21.1c-0.1,0.1-2.4-0.3-7.5-0.3c-5,0-13.6-2.4-17.2-3.5c-3.6-1.1,10,3.9,16.5,4.1C150.5,21.6,152.3,21,152.2,21.1z"
      />
      <path 
        className="fill-brand" 
        d="M269.6,18c-0.1-0.1-4.6,0.3-7.2,0c-7.3-0.7-17-3.2-16.6-2.9c0.4,0.3,13.7,3.1,17,3.3C267.7,18.8,269.7,18,269.6,18z"
      />
      <path 
        className="fill-brand" 
        d="M227.4,9.8c-0.2-0.1-4.5-1-9.5-1.2c-5-0.2-12.7,0.6-12.3,0.5c0.3-0.1,5.9-1.8,13.3-1.2S227.6,9.9,227.4,9.8z"
      />
      <path 
        className="fill-brand" 
        d="M204.5,13.4c-0.1-0.1,2-1,3.2-1.1c1.2-0.1,2,0,2,0.3c0,0.3-0.1,0.5-1.6,0.4C206.4,12.9,204.6,13.5,204.5,13.4z"
      />
      <path 
        className="fill-brand" 
        d="M201,10.6c0-0.1-4.4,1.2-6.3,2.2c-1.9,0.9-6.2,3.1-6.1,3.1c0.1,0.1,4.2-1.6,6.3-2.6S201,10.7,201,10.6z"
      />
      <path 
        className="fill-brand" 
        d="M154.5,26.7c-0.1-0.1-4.6,0.3-7.2,0c-7.3-0.7-17-3.2-16.6-2.9c0.4,0.3,13.7,3.1,17,3.3C152.6,27.5,154.6,26.8,154.5,26.7z"
      />
      <path 
        className="fill-brand" 
        d="M41.9,19.3c0,0,1.2-0.3,2.9-0.1c1.7,0.2,5.8,0.9,8.2,0.7c4.2-0.4,7.4-2.7,7-2.6c-0.4,0-4.3,2.2-8.6,1.9c-1.8-0.1-5.1-0.5-6.7-0.4S41.9,19.3,41.9,19.3z"
      />
      <path 
        className="fill-brand" 
        d="M75.5,12.6c0.2,0.1,2-0.8,4.3-1.1c2.3-0.2,2.1-0.3,2.1-0.5c0-0.1-1.8-0.4-3.4,0C76.9,11.5,75.3,12.5,75.5,12.6z"
      />
      <path 
        className="fill-brand" 
        d="M15.6,13.2c0-0.1,4.3,0,6.7,0.5c2.4,0.5,5,1.9,5,2c0,0.1-2.7-0.8-5.1-1.4C19.9,13.7,15.7,13.3,15.6,13.2z"
      />
    </svg>
  </div></>
  );
};

export default HeroSection; 