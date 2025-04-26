
import { motion } from "framer-motion";
import Link from "next/link";
import { User, LayoutDashboard, Briefcase, HelpCircle } from "lucide-react";

export default function SidebarLinks() {
  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:block w-[25%] bg-white rounded-lg p-6 border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-4">
        <HelpCircle className="w-6 h-6" /> Quick Links
      </h2>
      <ul className="space-y-3">
        <li>
          <Link
            href="/profile"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <User className="w-5 h-5" /> Your Profile
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/recommendations"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <Briefcase className="w-5 h-5" /> Recommended Jobs
          </Link>
        </li>
        <li>
          <Link
            href="/help"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <HelpCircle className="w-5 h-5" /> Help Center
          </Link>
        </li>
      </ul>
    </motion.aside>
  );
}
