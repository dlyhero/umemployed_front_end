
import { motion } from "framer-motion";
import { Lightbulb, CheckCircle } from "lucide-react";

export default function SidebarWhyEndorse() {
  return (
    <motion.aside
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:block w-[25%] bg-white rounded-lg p-6 border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-4">
        <Lightbulb className="w-6 h-6" /> Why Endorse?
      </h2>
      <p className="text-gray-600 mb-4">
        Endorsing a candidate helps highlight their strengths and achievements.
        Your input can make a big difference in their job application process.
      </p>
      <ul className="space-y-3 text-gray-700">
        <li className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          Showcase their unique skills.
        </li>
        <li className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          Strengthen their professional profile.
        </li>
        <li className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          Support career advancements.
        </li>
      </ul>
    </motion.aside>
  );
}
