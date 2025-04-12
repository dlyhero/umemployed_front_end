import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";

export const HeroSection = () => {
  const { data: session, status } = useSession();

  return (
    <motion.section
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 3,
          }}
        >
          <User className="w-8 h-8 text-brand" strokeWidth={1.5} />
        </motion.div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-brand to-brand/60 bg-clip-text text-transparent">
          Welcome back,{" "}
          <span className="text-gray-800">
            {session?.user?.name || "Guest"}!
          </span>
        </h1>
      </div>
      <p className="text-gray-600 mt-2">
        Let's complete your profile to unlock all features
      </p>
    </motion.section>
  );
};