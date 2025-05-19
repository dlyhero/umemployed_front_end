"use client";
import Image from "next/image";
import Spinner from "../Spinner";

export default function ProfileImage({ session, user, imageLoading, setImageLoading }) {
  const DEFAULT_IMAGE = 'https://umemployeds1.blob.core.windows.net/umemployedcont1/resume/images/default.jpg';
  
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.split(' ');
    let initials = words[0][0].toUpperCase();
    if (words.length > 1) {
      initials += words[words.length - 1][0].toUpperCase();
    }
    return initials;
  };

  if (session?.user?.image && session.user.image !== DEFAULT_IMAGE) {
    return (
      <>
        {imageLoading && (
          <div className="absolute inset-0 flex flex-col p-0 items-center justify-center">
            <Spinner size="sm" />
          </div>
        )}
        <Image
          src={session.user.image}
          alt="Profile"
          width={40}
          height={40}
          className={`object-cover rounded-full ${imageLoading ? 'opacity-0' : 'opacity-100'} group-hover:text-brand transition-colors`}
          onLoadingComplete={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
      </>
    );
  }

  const initials = getInitials(user.user?.username || session?.user?.name);
  const colors = [
    'bg-blue-500 text-white',
    'bg-green-500 text-white',
    'bg-purple-500 text-white',
    'bg-brand text-white',
    'bg-yellow-500 text-white',
    'bg-indigo-500 text-white',
    'bg-pink-500 text-white',
    'bg-teal-500 text-white',
  ];

  const colorIndex = ((user.user?.email || session?.user?.name || '').charCodeAt(0) || 0) % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <div className={`w-full h-full rounded-full flex items-center justify-center ${colorClass} font-bold text-lg`}>
      {initials}
    </div>
  );
}