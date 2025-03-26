import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Search, Briefcase } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

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
    <section id="Hero-section" className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
            >
              Unlock Your <span className="text-brand">Dream Job</span> –<br />
              The Future Starts Now!
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600"
            >
              Browse thousands of job listings and seize the opportunity<br />
              to advance your career with our platform.
            </motion.p>

            <motion.div 
  variants={itemVariants}
  className="flex flex-col sm:flex-row gap-4 pt-2"
>
  {status === "loading" ? (
    <>
      <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
    </>
  ) : session ? ( // Simple session check - no need for status check
    <>
      <Button asChild className="h-12 px-6 bg-brand hover:bg-brand/90 text-white">
        <Link href="/jobs">
          Browse Jobs
          <Search className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button variant="outline" className="h-12 px-6 border-brand text-brand hover:bg-brand/5" asChild>
        <Link href="/profile">
          Get Started
          <Briefcase className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </>
  ) : (
    <>
      <Button asChild className="h-12 px-6 bg-brand hover:bg-brand/90 text-white">
        <Link href="/signup">
          Sign Up Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button 
        variant="outline" 
        className="h-12 px-6 border-brand text-brand hover:bg-brand/5" 
        onClick={() => signIn()}
      >
        Log In
      </Button>
    </>
  )}
</motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-4 pt-6"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((item) => (
                  <img
                    key={item}
                    src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item + 20}.jpg`}
                    className="w-10 h-10 rounded-full border-2 border-white"
                    alt="User"
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">5,000+</span> professionals hired last month
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Your Image with Enhancements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative lg:ml-12"
          >
            <div className="relative rounded-xl overflow-hidden  border border-gray-100">
              {/* Your original image with parallax effect */}
              <motion.img 
                src="/images/ue3.avif" 
                alt="Professionals networking" 
                className="w-full h-auto object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
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
                    <p className="text-xs text-brand     mt-1">$120k - $150k • Remote</p>
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
    </section>
  );
};

export default HeroSection;