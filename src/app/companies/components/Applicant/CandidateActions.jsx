'use client';

import { Button } from '@/components/ui/button';
import { Archive, Bookmark, MessageSquare, Star, Calendar, Loader2 } from 'lucide-react';

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
  isShortlistLoading = false, // New prop for Shortlist button
  isUnshortlistLoading = false, // New prop for Unshortlist button
  isEndorseLoading = false, // Renamed from 'loading' for clarity
  isScheduleLoading = false, // New prop for Schedule button
  isGiveEndorsementLoading = false, // New prop for Give Endorsement button
  isMessageLoading = false, // New prop for Message button
  isAuthenticated = false,
}) => {
  const userId = candidate.user_id || '';

  return (
    <>
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
              onClick={() => handleUnshortlist(userId)}
              disabled={isUnshortlistLoading || !isAuthenticated}
            >
              {isUnshortlistLoading ? (
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
                className="flex-1 bg-green-500 text-white cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
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
              onClick={() => handleUnshortlist(userId)}
              disabled={isUnshortlistLoading || !isAuthenticated}
            >
              {isUnshortlistLoading ? (
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
                className="flex-1 bg-green-500 text-white cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
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