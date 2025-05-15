"use client";
import { motion } from "framer-motion";
import { Users, Briefcase, Globe, Award, Heart } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="about-pagemax-w-7xl mx-auto">
     

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-brand font-medium mb-4">OUR MISSION</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Connecting talent with opportunity
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe finding the right job shouldn't be a full-time job itself. Our AI-powered platform removes the friction from job searching by matching candidates with roles that truly fit their skills and aspirations.
              </p>
              <div className="space-y-4">
                {[
                  "AI-powered matching that actually works",
                  "Transparent salary and benefit information",
                  "Personalized career recommendations",
                  "Employer insights to help you stand out"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <Heart className="w-5 h-5 text-brand mt-0.5 mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-brand/10 rounded-2xl p-4 aspect-square flex items-center justify-center">
                <img 
                  src="https://umemployeds1.blob.core.windows.net/umemployedcont1/company/logos/logo-white_nOWQZ0i.png" 
                  alt="UmEmployed platform" 
                  className="rounded-xl shadow-lg w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-brand font-medium mb-4">OUR VALUES</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                What drives us every day
              </h2>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Candidate First",
                description: "We design every feature with job seekers' needs at the center.",
                icon: <Users className="w-8 h-8 text-brand" />
              },
              {
                title: "Radical Transparency",
                description: "No hidden fees, no misleading listings - just honest opportunities.",
                icon: <Globe className="w-8 h-8 text-brand" />
              },
              {
                title: "Continuous Innovation",
                description: "We never stop improving our matching algorithms and user experience.",
                icon: <Briefcase className="w-8 h-8 text-brand" />
              },
              {
                title: "Community Impact",
                description: "We measure success by careers transformed, not just profits.",
                icon: <Heart className="w-8 h-8 text-brand" />
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-brand font-medium mb-4">OUR TEAM</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The people behind UmEmployed
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A diverse team of technologists, recruiters, and career coaches united by a common mission.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "CEO & Founder",
                image: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Maria Garcia",
                role: "Head of Product",
                image: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "James Wilson",
                role: "Lead Engineer",
                image: "https://randomuser.me/api/portraits/men/22.jpg"
              },
              {
                name: "Sarah Lee",
                role: "UX Designer",
                image: "https://randomuser.me/api/portraits/women/63.jpg"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-gray-100 rounded-full w-48 h-48 mx-auto mb-6 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-brand">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to transform your job search?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Join thousands of professionals who found their dream jobs through UmEmployed.
            </p>
            <button className="bg-white text-brand px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Get Started Now
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;