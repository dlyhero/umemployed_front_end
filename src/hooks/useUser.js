import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import baseUrl from "../app/api/baseUrl";

export default function useUser() {
  const { data: session, update } = useSession();
  const [userData, setUserData] = useState({});
  const [userError, setUserError] = useState(null);
  const [loading, setLoading] = useState(false);
  const accessToken = session?.accessToken;

  const fetchUserProfile = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/users/profile/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      // Update both local state and session
      setUserData(response.data);
      setUserError(null);
      
      // Sync with NextAuth session
      if (response.data?.role && session?.user?.role !== response.data.role) {
        await update({
          ...session,
          user: {
            ...session.user,
            ...response.data
          }
        });
      }
      
      return response.data;
    } catch (error) {
      console.error("User fetch error:", error);
      setUserError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [accessToken, session, update]);

  const mutateUser = useCallback(async (newData) => {
    try {
      // Complete state replacement rather than merging
      setUserData(prev => ({
        ...prev,
        ...newData
      }));
      
      // Update session as well
      if (session) {
        await update({
          ...session,
          user: {
            ...session.user,
            ...newData
          }
        });
      }
      
      // Refetch to ensure consistency with backend
      return await fetchUserProfile();
    } catch (error) {
      console.error("Mutation error:", error);
      throw error;
    }
  }, [fetchUserProfile, session, update]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    user: {
      ...session?.user,
      ...userData,
    },
    mutateUser,
    userError,
    loading,
    refetch: fetchUserProfile
  };
}