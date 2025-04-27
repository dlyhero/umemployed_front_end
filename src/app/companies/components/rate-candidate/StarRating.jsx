import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function StarRating({ rating, onRatingChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex justify-center space-x-2 mb-6">
      {stars.map((star) => (
        <motion.div
          key={star}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Star
            className={`w-10 h-10 cursor-pointer transition-colors ${
              rating && star <= rating
                ? "text-brand/800 fill-blue-600"
                : "text-yellow-400"
            }`}
            onClick={() => onRatingChange(star)}
          />
        </motion.div>
      ))}
    </div>
  );
}