
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, X, Mail } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import baseUrl from '../../../api/baseUrl';

const CandidateModal = ({ isOpen, onClose, candidate, type }) => {
  const { data: session } = useSession();
  const router = useRouter();

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
    languages = [],
  } = candidate.profile;

  const handleMessage = async () => {
    if (!session?.accessToken) {
      toast.error('Please sign in to send a message');
      router.push('/auth/signin');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/messages/conversations/start/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ recipient_id: candidate.user_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start conversation.');
      }

      const { conversation_id } = await response.json();
      toast.success('Conversation started');
      router.push(`/messages/conversations/${conversation_id}`);
    } catch (error) {
      console.error('handleMessage: Error:', error);
      toast.error(error.message || 'Failed to start conversation.');
    }
  };

  return (
    <>
      <Toaster />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg no-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Candidate Details</DialogTitle>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <img
                src={profileImage}
                alt={`${firstName} ${lastName}`}
                className="w-24 h-24 rounded-full border-2 border-gray-100"
              />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {firstName} {lastName}
                </h2>
                <p className="text-gray-600">{jobTitle}</p>
                <p className="text-gray-500">{location}</p>
                <p className="text-gray-500">Status: {candidate.status || 'Unknown'}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">About</h3>
                <p className="text-gray-700 text-sm whitespace-pre-line">{coverLetter}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-brand/10 text-brand">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills listed</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Experience</h3>
                <div className="space-y-3">
                  {experiences.length > 0 ? (
                    experiences.map((exp, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium text-gray-800">{exp.title}</p>
                        <p className="text-gray-500">{exp.duration}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No experience listed</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Contact</h3>
                <div className="text-sm space-y-1">
                  <p>Email: {contacts.email}</p>
                  <p>Phone: {contacts.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {languages.length > 0 ? (
                    languages.map((lang, index) => (
                      <Badge key={index} variant="outline" className="bg-brand/10 text-brand">
                        {lang}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No languages listed</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <div className="flex flex-wrap gap-3 w-full">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 text-gray-700 hover:bg-gray-100"
                onClick={onClose}
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <a
                href={resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-brand border-brand hover:bg-brand/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Resume
                </Button>
              </a>
              <Button
                size="lg"
                className="flex-1 bg-brand text-white hover:bg-brand/90"
                onClick={handleMessage}
              >
                <Mail className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CandidateModal;
