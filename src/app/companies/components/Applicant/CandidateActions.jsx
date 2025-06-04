
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Bookmark, MessageSquare, Star, Calendar, Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const CandidateActions = ({
  candidate = {},
  activeTab = '',
  isShortlisted = false,
  handleViewDetails = () => {},
  handleShortlist = () => {},
  handleEndorse = () => {},
  handleSchedule = () => {},
  handleGiveEndorsement = () => {},
  handleMessage = () => {},
  isShortlistLoading = false,
  isEndorseLoading = false,
  isScheduleLoading = false,
  isGiveEndorsementLoading = false,
  isMessageLoading = false,
  isAuthenticated = false,
  jobId = '',
  companyId = '',
  accessToken = '',
}) => {
  const { data: session } = useSession();
  const userId = candidate.user_id || '';

  return (
    <>
      <Toaster />
      <div className="grid grid-cols-2 gap-3 w-full">
        {activeTab === 'shortlist' ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-brand text-brand hover:bg-brand/10 transition-colors"
              onClick={() => handleMessage(userId)}
              disabled={isMessageLoading || !isAuthenticated}
            >
              {isMessageLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <MessageSquare className="w-4 h-4 mr-2" />
              )}
              Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              size="sm"
              className="w-full bg-brand text-white hover:bg-brand/90 transition-colors"
              onClick={() => handleSchedule(userId)}
              disabled={isScheduleLoading || !isAuthenticated}
            >
              {isScheduleLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              Schedule Interview
            </Button>
            <Button
              size="sm"
              className="w-full bg-brand/80 text-white hover:bg-brand transition-colors"
              onClick={() => handleGiveEndorsement(userId)}
              disabled={isGiveEndorsementLoading || !isAuthenticated}
            >
              {isGiveEndorsementLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                'Give Endorsement'
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-brand text-brand hover:bg-brand/10 transition-colors"
              onClick={() => handleMessage(userId)}
              disabled={isMessageLoading || !isAuthenticated}
            >
              {isMessageLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <MessageSquare className="w-4 h-4 mr-2" />
              )}
              Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
            {isShortlisted ? (
              <Button
                size="sm"
                className="w-full bg-gray-400 text-white cursor-not-allowed"
                disabled
              >
                Shortlisted
              </Button>
            ) : (
              <Button
                size="sm"
                className="w-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                onClick={() => handleShortlist(userId)}
                disabled={isShortlistLoading || !isAuthenticated}
              >
                {isShortlistLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Star className="w-4 h-4 mr-2" />
                )}
                Shortlist
              </Button>
            )}
            <Button
              size="sm"
              className="w-full bg-brand text-white hover:bg-brand/90 transition-colors"
              onClick={() => handleViewDetails(candidate)}
            >
              View Details
            </Button>
            <Button
              size="sm"
              className="w-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
              onClick={() => handleEndorse(userId)}
              disabled={isEndorseLoading || !isAuthenticated}
            >
              {isEndorseLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Star className="w-4 h-4 mr-2" />
              )}
              See Endorsements
            </Button>
            <Button
              size="sm"
              className="w-full bg-brand/80 text-white hover:bg-brand transition-colors"
              onClick={() => handleGiveEndorsement(userId)}
              disabled={isGiveEndorsementLoading || !isAuthenticated}
            >
              {isGiveEndorsementLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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