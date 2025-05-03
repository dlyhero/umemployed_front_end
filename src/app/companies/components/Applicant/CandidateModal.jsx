'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, X, Check, Mail } from 'lucide-react';

const CandidateModal = ({ isOpen, onClose, candidate, type }) => {
  // Early return if candidate is null or undefined
  if (!candidate || !candidate.profile) {
    return null;
  }

  // Destructure candidate.profile with defaults
  const {
    firstName = 'Unknown',
    lastName = '',
    location = 'Unknown',
    jobTitle = 'Unknown',
    profileImage = 'https://umemployeds1.blob.core.windows.net/umemployedcont1/resume/images/default.jpg',
    resumeLink = '#',
    coverLetter = 'No description provided',
    skills = [],
    contacts = { email: 'Unknown', phone: 'Unknown' },
    experiences = [],
    languages = []
  } = candidate.profile;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto bg-white rounded-lg shadow-2xl px-4 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">Candidate Details</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-8">
          {/* Candidate Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={profileImage}
              alt={`${firstName} ${lastName}`}
              className="w-24 h-24 rounded-full border-4 border-gray-100 shadow-sm"
            />
            <div>
              <span className="text-xl font-semibold text-gray-800">
                {firstName} {lastName}
              </span>
              <div className="text-gray-500 text-sm">{location}</div>
              <div className="text-gray-600 text-sm font-medium">{jobTitle}</div>
            </div>
          </div>

          {/* Resume Link */}
          <div>
            <a
              href={resumeLink}
              className="text-brand-600 underline flex items-center gap-2 hover:text-brand-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="w-5 h-5" />
              View Resume
            </a>
          </div>

          {/* Cover Letter */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800">Candidate Heading:</h3>
            <p className="text-gray-700 text-sm mt-2 leading-relaxed">{coverLetter}</p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              <Check className="w-5 h-5 text-brand-500" />
              Skills & Qualifications:
            </h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {Array.isArray(skills) && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <Badge key={index} className="bg-brand-100 text-brand-600 font-medium">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No skills listed.</p>
              )}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800">Contacts:</h3>
            <div className="mt-2 text-gray-700 text-sm">
              <p>Email: {contacts.email}</p>
              <p>Phone: {contacts.phone}</p>
            </div>
          </div>

          {/* Experiences */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800">Experiences:</h3>
            <div className="mt-2 text-gray-700 text-sm">
              {Array.isArray(experiences) && experiences.length > 0 ? (
                experiences.map((exp, index) => (
                  <p key={index} className="mb-1">
                    {exp.title} - {exp.duration}
                  </p>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No experiences listed.</p>
              )}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800">Languages:</h3>
            <div className="mt-2 text-gray-700 text-sm">
              {Array.isArray(languages) && languages.length > 0 ? (
                languages.join(', ')
              ) : (
                'No languages listed.'
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
          {type === 'job' && (
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto hover:bg-gray-100">
                <Mail className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" className="w-full sm:w-auto text-red-500 border-red-500 hover:bg-red-50">
                <X className="w-4 h-4 mr-2" />
                Decline
              </Button>
              <Button className="w-full sm:w-auto bg-brand-600 text-white hover:bg-brand-700">
                <Check className="w-4 h-4 mr-2" />
                Hire
              </Button>
            </div>
          )}
          <Button className="w-full sm:w-auto bg-brand-600 text-white hover:bg-brand-700" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateModal;