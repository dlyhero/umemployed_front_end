"use client";
import React from "react";
import { Bookmark, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Resources = () => {
  const [openAccordion, setOpenAccordion] = React.useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const resources = [
    {
      title: "Job Search Tips",
      icon: <Bookmark className="w-5 h-5" />,
      content: "Learn how to optimize your resume and ace interviews.",
      link: "#",
    },
    {
      title: "Free Online Courses",
      icon: <MapPin className="w-5 h-5" />,
      content: "Upskill with free courses to boost your employability.",
      link: "#",
    },
    {
      title: "Job Boards",
      icon: <Clock className="w-5 h-5" />,
      content: "Discover job openings tailored to your skills.",
      link: "#",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row gap-12"
        >
          <div className="w-full lg:w-1/2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Resources</h2>
            <p className="text-lg text-gray-600 mb-8">
              Tools and opportunities tailored for you.
            </p>

            <div className="space-y-4">
              {resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50"
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-brand/10 p-2 rounded-lg text-brand">
                        {resource.icon}
                      </div>
                      <h3 className="text-base md:text-lg font-semibold">{resource.title}</h3>
                    </div>
                    <ArrowRight className={`w-5 h-5 transition-transform ${openAccordion === index ? 'rotate-90' : ''}`} />
                  </button>
                  <div className={`transition-all ${openAccordion === index ? 'max-h-40' : 'max-h-0'}`}>
                    <div className="px-6 pb-6 pt-2 text-gray-600">
                      <p className="mb-4">{resource.content}</p>
                      <Button variant="link" className="text-brand p-0 h-auto">
                        Learn more <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img 
                src="/images/ue1.jpg" 
                alt="Resources" 
                className="rounded-xl shadow-sm border border-gray-200 w-full max-w-lg" 
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Resources;
