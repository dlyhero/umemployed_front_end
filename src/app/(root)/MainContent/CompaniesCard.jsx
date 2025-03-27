"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building2, Globe, Users, ArrowRight, Star, Briefcase } from "lucide-react";

const Companies = () => {
  const companies = [
    {
      id: 661,
      name: "UmEmployed",
      logo: "https://umemployeds1.blob.core.windows.net/umemployedcont1/company/logos/logo-white_nOWQZ0i.png",
      industry: "Technology",
      description: "Innovative tech solutions provider with global reach",
      jobs: 42,
      rating: 4.8,
      link: "/company/info/661/",
    },
    {
      id: 662,
      name: "Nexus Labs",
      logo: "https://example.com/nexus-labs.png",
      industry: "Biotech",
      description: "Pioneering biomedical research and development",
      jobs: 28,
      rating: 4.6,
      link: "/company/info/662/",
    },
    {
      id: 663,
      name: "GreenFuture",
      logo: "https://example.com/greenfuture.png",
      industry: "Sustainability",
      description: "Leading the renewable energy revolution",
      jobs: 35,
      rating: 4.9,
      link: "/company/info/663/",
    },
    {
      id: 664,
      name: "DataSphere",
      logo: "https://example.com/datasphere.png",
      industry: "AI & Analytics",
      description: "Transforming businesses with data intelligence",
      jobs: 51,
      rating: 4.7,
      link: "/company/info/664/",
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Top Hiring Companies</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover exciting opportunities with industry leaders
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <a href={company.link} className="block h-full">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center p-2">
                      <img
                        src={company.logo}
                        alt={`${company.name} Logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-yellow-700">{company.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{company.name}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <Building2 className="w-4 h-4 mr-1" />
                    <span className="text-sm">{company.industry}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-5 flex-grow">{company.description}</p>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-4 h-4 mr-1" />
                      <span className="text-sm">{company.jobs} openings</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe className="w-4 h-4 mr-1" />
                      <span className="text-sm">Global</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 group">
                    <span>View Jobs</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Button className="bg-brand hover:bg-brand/90 px-8 py-4 text-lg text-white">
            <Users className="w-5 h-5 mr-2" />
            Explore All Companies
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Companies;