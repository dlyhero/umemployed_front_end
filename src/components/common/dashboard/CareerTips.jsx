'use client'
import { FileText, User } from 'lucide-react'
import { CareerTipCard } from '.'

export const CareerTips = () => (
  <section className="bg-white rounded-xl  p-6">
    <h2 className="text-xl font-bold mb-6">Career Growth Tips</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          title: "Resume Optimization",
          description: "Learn how to tailor your resume for each job application",
          icon: <FileText className="w-6 h-6 text-brand" />
        },
        {
          title: "Interview Prep",
          description: "Master the art of answering behavioral questions",
          icon: <User className="w-6 h-6 text-brand" />
        }
      ].map((tip, index) => (
        <CareerTipCard key={index} tip={tip} />
      ))}
    </div>
  </section>
)