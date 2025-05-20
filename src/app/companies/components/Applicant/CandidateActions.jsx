'use client';

import { Button } from '@/components/ui/button';
import { Archive, Bookmark, MessageSquare, Star, Calendar } from 'lucide-react';

const CandidateActions = ({
  candidate = {},
  activeTab = '',
  isShortlisted = false,
  handleViewDetails = () => {},
  handleShortlist = () => {},
  handleEndorse = () => {},
  handleSchedule = () => {},
  handleGiveEndorsement = () => {}, // New prop
  loading = false,
  isAuthenticated = false, // New prop for auth check
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
            >
              <MessageSquare className="w-5 h-5 mr-1" />
              Message
            </Button>
            <Button
              className="flex-1 bg-yellow-500 text-white cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleEndorse(userId)}
              disabled={loading || !isAuthenticated}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Star className="w-5 h-5 mr-1" />
              )}
              See Endorsements
            </Button>
            <Button
              className="flex-1 bg-brand/50 text-white cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleSchedule(userId)}
              disabled={!isAuthenticated}
            >
              <Calendar className="w-5 h-5 mr-1" />
              Schedule Interview
            </Button>
            <Button
              className="flex-1 bg-brand/600 text-white hover:bg-brand/700 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleGiveEndorsement(userId)}
              disabled={!isAuthenticated}
            >
              Give Endorsement
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="flex-1 border-brand/50 text-brand/50 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleEndorse(userId)}
            >
              <MessageSquare className="w-5 h-5 mr-1" />
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
                disabled={!isAuthenticated}
              >
                Shortlist
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
              disabled={!isAuthenticated}
            >
              Give Endorsement
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
            >
              <MessageSquare className="w-5 h-5 mr-1" />
              Message
            </Button>
            <Button
              className="flex-1 bg-yellow-500 text-white cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleEndorse(userId)}
              disabled={loading || !isAuthenticated}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Star className="w-5 h-5 mr-1" />
              )}
              See Endorsements
            </Button>
            <Button
              className="flex-1 bg-brand/50 text-white cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleSchedule(userId)}
              disabled={!isAuthenticated}
            >
              <Calendar className="w-5 h-5 mr-1" />
              Schedule Interview
            </Button>
            <Button
              className="flex-1 bg-brand/600 text-white hover:bg-brand/700 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleGiveEndorsement(userId)}
              disabled={!isAuthenticated}
            >
              Give Endorsement
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="flex-1 border-brand/50 text-brand/50 cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleEndorse(userId)}
            >
              <MessageSquare className="w-5 h-5 mr-1" />
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
                disabled={!isAuthenticated}
              >
                Shortlist
              </Button>
            )}
            <Button
              className="flex-1 bg-brand/50 text-white cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleViewDetails(candidate)}
            >
              View Details
            </Button>
            <Button
              className="flex-1 bg-brand text-white  cursor-pointer min-w-0 px-4 py-2 text-sm truncate"
              onClick={() => handleGiveEndorsement(userId)}
              disabled={!isAuthenticated}
            >
              Give Endorsement
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default CandidateActions;