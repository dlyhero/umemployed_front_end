"use client";
import { Users, Handshake, Wallet, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CompaniesSection = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Hire Top Talent",
      description: "Access our pool of vetted professionals ready to join your team.",
      cta: "Browse Candidates",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: "Request Introductions",
      description: "Get personalized candidate matches from our network.",
      cta: "Get Matched",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Advanced Search",
      description: "Filter candidates by skills, experience, and availability.",
      cta: "Start Searching",
      color: "bg-green-100 text-green-600"
    },

  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
        className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">For Companies</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
            Streamline your hiring process with our powerful tools designed for employers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:-translate-y-1 transition-transform"
            >
              <div className="p-6 h-full flex flex-col">
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{feature.description}</p>
                
                <Button variant="outline" className="w-full border-none bg-brand text-white  hover:bg-brand hover:text-white">
                  {feature.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompaniesSection;
