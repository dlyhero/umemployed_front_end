'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Archive, Bookmark, MessageSquare, Star, Calendar } from 'lucide-react';

const CandidateCard = ({
  candidate,
  type,
  handleViewDetails,
  handleShortlist,
  handleEndorse,
  handleSchedule,
  activeTab,
  isShortlisted = false,
}) => {
  return (
    <Card className="hover:bg-gray-50 transition-colors border">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-4 md:w-[50%] lg:w-[28%]">
            <div className="flex gap-x-4">
              <div className="relative">
                <img
                  src={candidate.profile.profileImage}
                  alt={`${candidate.profile.firstName} ${candidate.profile.lastName}`}
                  className="w-16 h-16 rounded-full border-2 border-white"
                />
                {/* <span
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                    type === 'job' && activeTab !== 'candidates' ? 'bg-gray-400' : 'bg-green-400'
                  }`}
                ></span> */}
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-lg font-semibold">
                  {candidate.profile.firstName} {candidate.profile.lastName}
                </span>
                <div className="text-gray-500">{candidate.profile.location}</div>
                <div className="text-gray-600 line-clamp-2">{candidate.profile.jobTitle}</div>
              </div>
            </div>
            <div className="flex md:hidden items-start space-x-2">
              <Button variant="outline" size="icon" className="bg-gray-100">
                <Archive className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="bg-gray-100">
                <Bookmark className="w-5 h-5" />
              </Button>
              {activeTab === 'shortlist' ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1 border-brand text-brand cursor-pointer"
                    onClick={() => handleEndorse(candidate.user_id)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button
                    className="flex-1 bg-yellow-500 text-white cursor-pointer"
                    onClick={() => handleEndorse(candidate.user_id)}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Endorse
                  </Button>
                  <Button
                    className="flex-1 bg-blue-500 text-white cursor-pointer"
                    onClick={() => handleSchedule(candidate.user_id)}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Schedule Interview
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="flex-1 border-blue-500 text-blue-500 cursor-pointer"
                  >
                    Message
                  </Button>
                  {isShortlisted ? (
                    <Button
                      className="flex-1 bg-gray-400 text-white cursor-not-allowed"
                      disabled
                    >
                      Shortlisted
                    </Button>
                  ) : (
                    <Button
                      className="flex-1 bg-green-500 text-white cursor-pointer"
                      onClick={() => handleShortlist(candidate.user_id)}
                    >
                      Shortlist
                    </Button>
                  )}
                  <Button
                    className="flex-1 bg-blue-500 text-white cursor-pointer"
                    onClick={() => handleViewDetails(candidate)}
                  >
                    View Details
                  </Button>
                </>
              )}
            </div>
            <div className="hidden md:flex items-start space-x-2">
              <Button variant="outline" size="icon" className="bg-gray-100">
                <Archive className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="bg-gray-100">
                <Bookmark className="w-5 h-5" />
              </Button>
              {activeTab === 'shortlist' ? (
                <>
                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-500 cursor-pointer"
                    onClick={() => handleEndorse(candidate.user_id)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button
                    className="bg-yellow-500 text-white cursor-pointer"
                    onClick={() => handleEndorse(candidate.user_id)}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Endorse
                  </Button>
                  <Button
                    className="bg-blue-500 text-white cursor-pointer"
                    onClick={() => handleSchedule(candidate.user_id)}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Schedule Interview
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-500 cursor-pointer"
                  >
                    Message
                  </Button>
                  {isShortlisted ? (
                    <Button
                      className="bg-gray-400 text-white cursor-not-allowed"
                      disabled
                    >
                      Shortlisted
                    </Button>
                  ) : (
                    <Button
                      className="bg-green-500 text-white cursor-pointer"
                      onClick={() => handleShortlist(candidate.user_id)}
                    >
                      Shortlist
                    </Button>
                  )}
                  <Button
                    className="bg-blue-500 text-white cursor-pointer"
                    onClick={() => handleViewDetails(candidate)}
                  >
                    View Details
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:w-[80%]">
            <div className="space-y-4 w-full md:w-[250px]">
              <div className="flex flex-col gap-2">
                {type === 'company' ? (
                  <>
                    <span className="text-lg text-green-500 font-semibold truncate">
                      {candidate.job.title}
                    </span>
                    <span className="text-lg font-semibold">
                      Resume match: {candidate.matchingPercentage}%
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-semibold truncate">
                    Assessment Score: {candidate.matchingPercentage}%
                  </span>
                )}
                <span className="text-gray-600">Quiz Score: {candidate.quizScore}%</span>
              </div>
            </div>
            <div className="space-y-4 w-full md:w-[300px]">
              <div className="text-base font-semibold">About Candidate:</div>
              <div className="text-gray-700 line-clamp-2">{candidate.profile.coverLetter}</div>
            </div>
            <div className="space-y-4 w-full">
              <div className="text-base font-semibold">Qualifications:</div>
              <div className="flex flex-wrap gap-2">
                {candidate.profile.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-500">
                    {skill}
                  </Badge>
                ))}
                {candidate.profile.skills.length > 3 && (
                  <Badge className="bg-gray-200 text-gray-700">
                    ...and {candidate.profile.skills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;