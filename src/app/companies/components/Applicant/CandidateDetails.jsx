import { Badge } from '@/components/ui/badge';

const CandidateDetails = ({ candidate, type }) => {
  return (
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
      <div className="space-y-4 w-full max-w-[300px] overflow-x-auto">
        <div className="text-base font-semibold">Qualifications:</div>
        <div className="flex flex-wrap gap-2">
          {candidate.profile.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} className="bg-brand/20 text-brand/50">
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
  );
};

export default CandidateDetails;