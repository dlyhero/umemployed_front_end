// hooks/useUser.js
import { useSession } from "next-auth/react";

export default function useUser() {
  const { data: session } = useSession();
  
  if (!session) return null;
  
  return {
    name: session.user?.name,
    email: session.user?.email,
    image: session.user?.image,
    role: session.user?.role,
    userId: session.user?.user_id,
    companyId: session.user?.company_id,
    accessToken: session.accessToken,
    decodedToken: session.decodedToken,
    rawSession: session
  };
}