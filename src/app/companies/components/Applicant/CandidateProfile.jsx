import Image from 'next/image';

const CandidateProfile = ({ candidate }) => {
  return (
    <div className="flex gap-x-4">
      <div className="relative">
        <Image
          src={candidate.profile.profileImage}
          alt={`${candidate.profile.firstName} ${candidate.profile.lastName}`}
          width={64}
          height={64}
          className="rounded-full border-2 border-white"
        />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <span className="text-lg font-semibold">
          {candidate.profile.firstName} {candidate.profile.lastName}
        </span>
        <div className="text-gray-500">{candidate.profile.location}</div>
        <div className="text-gray-600 line-clamp-2">{candidate.profile.jobTitle}</div>
      </div>
    </div>
  );
};

export default CandidateProfile;