import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const Tips = ({ tips }) => {
  const [visibleTips, setVisibleTips] = useState(tips);

  const removeTip = (index) => {
    setVisibleTips(visibleTips.filter((_, i) => i !== index));
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {visibleTips.map((tip, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4 }}
          className="min-w-[300px] bg-white p-4 rounded-lg shadow relative"
        >
          <button
            onClick={() => removeTip(index)}
            className="absolute top-2 right-2 text-red-500"
          >
            <X size={16} />
          </button>
          <h3 className="font-semibold">{tip.title}</h3>
          <p className="text-sm text-gray-600">{tip.content}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default Tips;