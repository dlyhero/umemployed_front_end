// RecruiterTips.jsx
'use client'
import { FileText, MessageSquare, Search, Users, CheckCircle } from 'lucide-react'
import { RecruiterTipCard } from './RecruiterTipCard'

export const RecruiterTips = ({ tips }) => {
  // Function to assign an icon based on the tip's title or content
  const getIconForTip = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('optimize') || lowerTitle.includes('postings')) {
      return <FileText className="w-6 h-6 text-[#1e90ff]" />;
    } else if (lowerTitle.includes('respond') || lowerTitle.includes('engage')) {
      return <MessageSquare className="w-6 h-6 text-[#1e90ff]" />;
    } else if (lowerTitle.includes('search') || lowerTitle.includes('descriptions')) {
      return <Search className="w-6 h-6 text-[#1e90ff]" />;
    } else if (lowerTitle.includes('talent') || lowerTitle.includes('candidates')) {
      return <Users className="w-6 h-6 text-[#1e90ff]" />;
    } else {
      return <CheckCircle className="w-6 h-6 text-[#1e90ff]" />;
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Recruiter Tips</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, index) => (
          <RecruiterTipCard
            key={index}
            tip={{
              title: tip.title,
              description: tip.content,
              icon: getIconForTip(tip.title),
            }}
          />
        ))}
      </div>
    </section>
  );
};