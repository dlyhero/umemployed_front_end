import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BrainCircuit, CalendarDays, PenTool } from "lucide-react";
import { motion } from "framer-motion";

const Resources = () => {
  const items = [
    {
      id: 1,
      icon: <PenTool className="w-6 h-6" />,
      title: "Your essential professional guides to UK salaries and benefits in 2025",
      description: "Discover the latest salary trends in the UK for 2025 with our comprehensive guides.",
      tag: "Tool",
      label: "Benefits",
      imageUrl: "https://picsum.photos/800/800?random=1"
    },
    {
      id: 2,
      icon: <CalendarDays className="w-6 h-6" />,
      title: "Championing mental health: building workplaces that thrive",
      description: "Join us for a vital and inspiring webinar on championing mental health at work.",
      tag: "Event",
      label: "Wellbeing",
      imageUrl: "https://picsum.photos/800/800?random=2"
    },
    {
      id: 3,
      icon: <BrainCircuit className="w-6 h-6" />,
      title: "Interview question generator for smarter recruiting",
      description: "Make interview prep easy with our AI-powered interview question generator tool.",
      tag: "Tool",
      label: "Interviewing",
      imageUrl: "https://fastly.picsum.photos/id/342/800/800.jpg?hmac=s7TzMTZ38j0Sj9iwYptmvsmgjSx-ADX7bPkMCqYFE0c"
    }
  ];

  return (
    <section className="py-16 bg-white" aria-label="What's happening">
      <div className="container max-w-6xl px-6 mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 relative inline-block pl-8">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-brand rounded-full"></span>
            What's happening
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {items.map((item, index) => (
            <motion.Card key={item.id} className="overflow-hidden group pt-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            >
              <div className="relative h-48">
                <Image
                  src={item.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center justify-center w-12 h-12 bg-brand rounded-full text-white">
                    {item.icon}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-brand rounded-full">
                    {item.tag}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {item.label}
                  </span>
                </div>
                
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mb-4 text-gray-600">
                  {item.description}
                </p>
                
                <Button variant="link" className="px-0 text-brand hover:no-underline group-hover:underline">
                  Read more
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>
            </motion.Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;