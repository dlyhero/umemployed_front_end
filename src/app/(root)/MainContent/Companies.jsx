"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Companies = () => {
  const companies = [
    {
      id: 661,
      name: "UmEmployed",
      logo: "https://umemployeds1.blob.core.windows.net/umemployedcont1/company/logos/logo-white_nOWQZ0i.png",
      industry: "Technology",
      link: "/company/info/661/",
    },
  ];

  return (
    <section className="py-16 bg-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Companies</h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Discover opportunities from top hiring companies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company) => (
            <motion.div
              key={company.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md"
            >
              <a href={company.link} className="block h-full">
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="mb-6 w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center p-2">
                    <img
                      src={company.logo}
                      alt={`${company.name} Logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{company.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{company.industry}</p>
                  <Button variant="outline" className="border-brand text-brand">
                    View Jobs
                  </Button>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button className="bg-brand hover:bg-brand/90 text-white">
            Explore All Companies
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Companies;