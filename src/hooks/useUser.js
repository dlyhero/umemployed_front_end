// hooks/useUser.js
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function useUser() {
  const { data: session } = useSession();

  const [userData, setUserData] = useState({});
  const [userError, setUserError] = useState(null);
  const [loading, setLoading] = useState(false);

  const accessToken = session?.accessToken;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.accessToken) return;

      setLoading(true);
      try {
        const response = await axios.get(
          "https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/profile/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUserData(response.data)
        setUserError(null);
      } catch (error) {
        console.error("user error:", error);
        setUserError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [accessToken]);


  if (!session) return null;

  return {
    name: session.user?.name,
    image: session.user?.image,
    coverImage: session.user?.coverImage,
    role: session.user?.role,
     ...userData,  // Profile data from your API
    userError,     // Any error from profile fetch
    loading        // Loading state for profile fetch
  };
}
