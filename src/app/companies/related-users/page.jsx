'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import UserCard from './components/UserCard';
import SearchBar from './components/SearchBar';
import SeeMoreButton from './components/SeeMoreButton';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function RelatedUsers() {
  const { data: session, status } = useSession();
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedUsers = async () => {
      if (status === 'loading' || !session) {
        return; // Wait for session
      }

      if (!session.accessToken) {
        setError('Unauthorized: No access token available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch related users directly from backend
        const baseUrl = 'https://umemployed-app-afec951f7ec7.herokuapp.com';
        const relatedUsersResponse = await fetch(`${baseUrl}/api/company/related-users/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });

        if (!relatedUsersResponse.ok) {
          throw new Error(`Failed to fetch related users: ${relatedUsersResponse.status}`);
        }

        const relatedUsers = await relatedUsersResponse.json();
        console.log('Related users response:', relatedUsers); // For debugging

        // Fetch user profiles
        const userProfiles = await Promise.all(
          relatedUsers.map(async (user) => {
            try {
              const userId = user.id; // Use 'id' from response
              if (!userId || isNaN(userId)) {
                console.warn(`Invalid user ID:`, user);
                return null;
              }

              const profileResponse = await fetch(
                `${baseUrl}/api/resume/user-profile/${userId}/`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.accessToken}`,
                  },
                }
              );

              if (!profileResponse.ok) {
                console.warn(`Failed to fetch profile for user ID ${userId}: ${profileResponse.status}`);
                return null;
              }

              const profile = await profileResponse.json();
              const [firstName, ...lastNameParts] = profile.contact_info.name.split(' ');
              return {
                id: userId,
                firstName: firstName || 'Unknown',
                lastName: lastNameParts.join(' ') || '',
                email: profile.contact_info.email,
                profileImage: profile.profile_image,
              };
            } catch (err) {
              console.warn(`Error fetching profile for user ID ${user.id}: ${err.message}`);
              return null;
            }
          })
        );

        // Filter out null profiles
        const validUsers = userProfiles.filter((user) => user !== null);
        setUsers(validUsers);

        if (validUsers.length === 0 && relatedUsers.length > 0) {
          setError('No valid user profiles found.');
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message || 'Failed to load related users.');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchRelatedUsers();
    }
  }, [session, status]);

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleUsers = filteredUsers.slice(0, visibleCount);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setVisibleCount(6);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-[#1e90ff]" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-600">Please log in to view related users.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#1e90ff] mb-6">
            People Related to Your Company
          </h1>

          <SearchBar onSearch={handleSearch} />

          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#1e90ff] mx-auto" />
              <p className="text-gray-600 mt-2">Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {visibleUsers.length > 0 ? (
                visibleUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))
              ) : (
                <p className="text-gray-600 col-span-full text-center text-lg">
                  No users found.
                </p>
              )}
            </div>
          )}

          <SeeMoreButton
            onClick={handleSeeMore}
            visible={visibleCount < filteredUsers.length}
          />
        </div>
      </div>
    </div>
  );
}