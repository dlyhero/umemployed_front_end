import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const Tips = ({ tips }) => {
  const [visibleTips, setVisibleTips] = useState(tips);

  const removeTip = (index) => {
    setVisibleTips(visibleTips.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Tips</h3>
      <div
        className="flex space-x-4 overflow-x-auto  scrollbar-none "
        style={{ maxWidth: '900px' }} // 3 tips * ~300px each
      >
        {visibleTips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="min-w-[300px] bg-gray-50 p-4 rounded-lg relative"
          >
            <button
              onClick={() => removeTip(index)}
              className="absolute top-2 right-2 text-red-500"
            >
              <X size={16} />
            </button>
            <h4 className="font-semibold">{tip.title}</h4>
            <p className="text-sm text-gray-600">{tip.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Tips;