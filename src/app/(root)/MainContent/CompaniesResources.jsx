"use client";
import { Users, Handshake, Wallet, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Seamless Payouts",
      description: "Easy payment system with multiple options for global teams.",
      cta: "Payment Options",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">For Companies</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Streamline your hiring process with our powerful tools designed for employers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:-translate-y-1 transition-transform"
            >
              <div className="p-6 h-full flex flex-col">
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{feature.description}</p>
                
                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                  {feature.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompaniesSection;