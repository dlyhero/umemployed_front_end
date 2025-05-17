'use client'
import { useState } from 'react'
import { FileText, MessageSquare, Search, Users, CheckCircle } from 'lucide-react'
import { RecruiterTipCard } from './RecruiterTipCard'

export const RecruiterTips = ({ tips }) => {
  const [visibleTips, setVisibleTips] = useState(tips)

  const getIconForTip = (title) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('optimize') || lowerTitle.includes('postings')) {
      return <FileText className="w-5 h-5 text-[#1e90ff]" />
    } else if (lowerTitle.includes('respond') || lowerTitle.includes('engage')) {
      return <MessageSquare className="w-5 h-5 text-[#1e90ff]" />
    } else if (lowerTitle.includes('search') || lowerTitle.includes('descriptions')) {
      return <Search className="w-5 h-5 text-[#1e90ff]" />
    } else if (lowerTitle.includes('talent') || lowerTitle.includes('candidates')) {
      return <Users className="w-5 h-5 text-[#1e90ff]" />
    } else {
      return <CheckCircle className="w-5 h-5 text-[#1e90ff]" />
    }
  }

  const handleCloseTip = (index) => {
    setVisibleTips((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <section className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-bold mb-4">Recruiter Tips</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleTips.map((tip, index) => (
          <RecruiterTipCard
            key={index}
            tip={{
              title: tip.title,
              description: tip.content,
              icon: getIconForTip(tip.title),
            }}
            onClose={() => handleCloseTip(index)}
          />
        ))}
      </div>
    </section>
  )
}