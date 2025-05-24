'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Archive, Bookmark, MessageSquare, Star, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const CandidateActions = ({
  candidate = {},
  activeTab = '',
  isShortlisted = false,
  handleViewDetails = () => {},
  handleShortlist = () => {},
  handleUnshortlist = () => {},
  handleEndorse = () => {},
  handleSchedule = () => {},
  handleGiveEndorsement = () => {},
  isShortlistLoading = false,
  isUnshortlistLoading = false,
  isEndorseLoading = false,
  isScheduleLoading = false,
  isGiveEndorsementLoading = false,
  isMessageLoading = false,
  isAuthenticated = false,
  jobId = '',
  companyId = '',
  accessToken = '', // Kept as fallback, though session.accessToken is preferred
}) => {
  const { data: session, status: sessionStatus } = useSession();
  const userId = candidate.user_id || '';
  const baseUrl = 'https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api';
  const [isUnshortlistButtonLoading, setIsUnshortlistButtonLoading] = useState(false);

  const handleUnshortlistAction = async (userId) => {
    if (!companyId || !jobId || !userId) {
      toast.error('Missing company, job, or user information');
      return;
    }

    if (sessionStatus !== 'authenticated' || !session?.accessToken) {
      toast.error('Please sign in to unshortlist a candidate');
      return;
    }

    setIsUnshortlistButtonLoading(true);
    try {
      console.log('Unshortlist request:', { companyId, jobId, candidate_id: userId, accessToken: session.accessToken });
      const response = await fetch(`${baseUrl}/company/company/${companyId}/job/${jobId}/unshortlist/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ candidate_id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          throw new Error(errorData.message || 'Invalid request. Please check the candidate or job details.');
        } else if (response.status === 404) {
          throw new Error(errorData.message || 'Job or candidate not found.');
        } else {
          throw new Error(errorData.message || `Failed to unshortlist candidate: ${response.status}`);
        }
      }

      toast.success('Candidate unshortlisted successfully');
      handleUnshortlist(userId);
    } catch (error) {
      console.error('Error unshortlisting candidate:', error);
      toast.error(error.message || 'Failed to unshortlist candidate. Please try again.');
    } finally {
      setIsUnshortlistButtonLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex md:hidden flex-row flex-nowrap gap-2 w-full">
        <Button variant="outline" size="icon" className="bg-gray-100 min-w-0 px-4 py-2">
          <Archive className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon" className="bg-gray-100 min-w-0 px-4 py-2">
          <Bookmark className="w-5 h-5" />
        </Button>
        {activeTab === 'shortlist' ? (
          <>
            <Button
              variant="outline"
              className="flex-1 border-brand/50 text-brand/50 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleEndorse(userId)}
              disabled={isMessageLoading || !isAuthenticated}
            >
              {isMessageLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                <MessageSquare className="w-5 h-5 mr-1" />
              )}
              Message
            </Button>
            <Button
              className="flex-1 bg-yellow-500 text-white cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleEndorse(userId)}
              disabled={isEndorseLoading || !isAuthenticated}
            >
              {isEndorseLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                <Star className="w-5 h-5 mr-1" />
              )}
              See Endorsements
            </Button>
            <Button
              className="flex-1 bg-brand/50 text-white cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleSchedule(userId)}
              disabled={isScheduleLoading || !isAuthenticated}
            >
              {isScheduleLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                <Calendar className="w-5 h-5 mr-1" />
              )}
              Schedule Interview
            </Button>
            <Button
              className="flex-1 bg-red-500 text-white hover:bg-red-600 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleUnshortlistAction(userId)}
              disabled={isUnshortlistLoading || isUnshortlistButtonLoading || !isAuthenticated}
            >
              {isUnshortlistButtonLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                'Unshortlist'
              )}
            </Button>
            <Button
              className="flex-1 bg-brand/600 text-white hover:bg-brand/700 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleGiveEndorsement(userId)}
              disabled={isGiveEndorsementLoading || !isAuthenticated}
            >
              {isGiveEndorsementLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                'Give Endorsement'
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="flex-1 border-brand/50 text-brand/50 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleEndorse(userId)}
              disabled={isMessageLoading || !isAuthenticated}
            >
              {isMessageLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                <MessageSquare className="w-5 h-5 mr-1" />
              )}
              Message
            </Button>
            {isShortlisted ? (
              <Button
                className="flex-1 bg-gray-400 text-white cursor-not-allowed min-w-0 px-4 py-2 text-sm truncate"
                disabled
              >
                Shortlisted
              </Button>
            ) : (
              <Button
                className="flex-1 bg-green-500 text-white hover:bg-green-600 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
                onClick={() => handleShortlist(userId)}
                disabled={isShortlistLoading || !isAuthenticated}
              >
                {isShortlistLoading ? (
                  <Loader2 className="w-5 h-5 mr-1 animate-spin" />
                ) : (
                  'Shortlist'
                )}
              </Button>
            )}
            <Button
              className="flex-1 bg-brand/50 text-white cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleViewDetails(candidate)}
            >
              View Details
            </Button>
            <Button
              className="flex-1 bg-brand/600 text-white hover:bg-brand/700 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleGiveEndorsement(userId)}
              disabled={isGiveEndorsementLoading || !isAuthenticated}
            >
              {isGiveEndorsementLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                'Give Endorsement'
              )}
            </Button>
          </>
        )}
      </div>
      <div className="hidden md:flex flex-row flex-nowrap gap-2 w-full">
        <Button variant="outline" size="icon" className="bg-gray-100 min-w-0 px-4 py-2">
          <Archive className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon" className="bg-gray-100 min-w-0 px-4 py-2">
          <Bookmark className="w-5 h-5" />
        </Button>
        {activeTab === 'shortlist' ? (
          <>
            <Button
              variant="outline"
              className="flex-1 border-brand/50 text-brand/50 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleEndorse(userId)}
              disabled={isMessageLoading || !isAuthenticated}
            >
              {isMessageLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                <MessageSquare className="w-5 h-5 mr-1" />
              )}
              Message
            </Button>
            <Button
              className="flex-1 bg-yellow-500 text-white cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleEndorse(userId)}
              disabled={isEndorseLoading || !isAuthenticated}
            >
              {isEndorseLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                <Star className="w-5 h-5 mr-1" />
              )}
              See Endorsements
            </Button>
            <Button
              className="flex-1 bg-brand/50 text-white cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleSchedule(userId)}
              disabled={isScheduleLoading || !isAuthenticated}
            >
              {isScheduleLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                <Calendar className="w-5 h-5 mr-1" />
              )}
              Schedule Interview
            </Button>
            <Button
              className="flex-1 bg-red-500 text-white hover:bg-red-600 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleUnshortlistAction(userId)}
              disabled={isUnshortlistLoading || isUnshortlistButtonLoading || !isAuthenticated}
            >
              {isUnshortlistButtonLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                'Unshortlist'
              )}
            </Button>
            <Button
              className="flex-1 bg-brand/600 text-white hover:bg-brand/700 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleGiveEndorsement(userId)}
              disabled={isGiveEndorsementLoading || !isAuthenticated}
            >
              {isGiveEndorsementLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                'Give Endorsement'
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="flex-1 border-brand/50 text-brand/50 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleEndorse(userId)}
              disabled={isMessageLoading || !isAuthenticated}
            >
              {isMessageLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                <MessageSquare className="w-5 h-5 mr-1" />
              )}
              Message
            </Button>
            {isShortlisted ? (
              <Button
                className="flex-1 bg-gray-400 text-white cursor-not-allowed min-w-0 px-4 py-2 text-sm truncate"
                disabled
              >
                Shortlisted
              </Button>
            ) : (
              <Button
                className="flex-1 bg-green-500 text-white hover:bg-green-600 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
                onClick={() => handleShortlist(userId)}
                disabled={isShortlistLoading || !isAuthenticated}
              >
                {isShortlistLoading ? (
                  <Loader2 className="w-5 h-5 mr-1 animate-spin" />
                ) : (
                  'Shortlist'
                )}
              </Button>
            )}
            <Button
              className="flex-1 bg-brand/50 text-white cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleViewDetails(candidate)}
            >
              View Details
            </Button>
            <Button
              className="flex-1 bg-brand/600 text-white hover:bg-brand/700 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleGiveEndorsement(userId)}
              disabled={isGiveEndorsementLoading || !isAuthenticated}
            >
              {isGiveEndorsementLoading ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : (
                'Give Endorsement'
              )}
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default CandidateActions;