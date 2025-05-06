// src/app/companies/components/Applicant/CandidateModal.jsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, X, Check, Mail } from 'lucide-react';

const CandidateModal = ({ isOpen, onClose, candidate, type }) => {
  if (!candidate || !candidate.profile) {
    return null;
  }

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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">Candidate Details</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={profileImage}
              alt={`${firstName} ${lastName}`}
              className="w-20 h-20 rounded-full border-2 border-gray-100"
            />
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">
                {firstName} {lastName}
              </h2>
              <p className="text-gray-600 text-sm">{jobTitle}</p>
              <p className="text-gray-500 text-sm">{location}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">About</h3>
              <p className="text-gray-700 text-sm whitespace-pre-line">{coverLetter}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-brand/10 text-brand">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">Experience</h3>
              <div className="space-y-2">
                {experiences.map((exp, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{exp.title}</p>
                    <p className="text-gray-500">{exp.duration}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">Contact</h3>
              <div className="text-sm space-y-1">
                <p>Email: {contacts.email}</p>
                <p>Phone: {contacts.phone}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <div className="flex flex-wrap gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
            <a
              href={resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Resume
              </Button>
            </a>
            <Button className="flex-1 bg-brand hover:bg-brand/90">
              <Mail className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateModal;