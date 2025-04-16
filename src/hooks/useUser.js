import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import baseUrl from "../app/api/baseUrl";

export default function useUser() {
  const { data: session } = useSession();
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
      setUserData(response.data);
      setUserError(null);
      return response.data;
    } catch (error) {
      console.error("User fetch error:", error);
      setUserError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const mutateUser = useCallback(async (newData) => {
    try {
      // Optimistic update
      if (newData) {
        setUserData(prev => ({
          ...prev,
          ...newData,
          personalInfo: { ...prev.personalInfo, ...newData.personalInfo }
        }));
      }
      
      // Always refetch to ensure consistency
      return await fetchUserProfile();
    } catch (error) {
      console.error("Mutation error:", error);
      throw error;
    }
  }, [fetchUserProfile]);

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