'use client';

import { Star, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Endorsement = ({ endorsement }) => {
  const {
    recruiter_name = 'Anonymous',
    recruiter_company = 'Unknown Company',
    recruiter_position = 'Unknown Position',
    professionalism = 'Not rated',
    skills = 'Not rated',
    communication = 'Not rated',
    teamwork = 'Not rated',
    reliability = 'Not rated',
    stars = 0,
    review = 'No comments provided',
    created_at = new Date().toISOString(),
    skills: skillList = [], // Rename to avoid conflict with 'skills' rating
  } = endorsement;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800">{recruiter_name}</h3>
              <p className="text-sm text-gray-600">
                {recruiter_position} at {recruiter_company}
              </p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1">{stars}.0</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-gray-800">{review}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><strong>Professionalism:</strong> {professionalism}</p>
              <p><strong>Skills:</strong> {skills}</p>
              <p><strong>Communication:</strong> {communication}</p>
            </div>
            <div>
              <p><strong>Teamwork:</strong> {teamwork}</p>
              <p><strong>Reliability:</strong> {reliability}</p>
            </div>
          </div>
          {Array.isArray(skillList) && skillList.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {skillList.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
          <div className="mt-4 text-sm text-gray-500">
            <span>
              {new Date(created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Endorsement;