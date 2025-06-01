import { getToken } from "next-auth/jwt";
import axios from "axios";
import baseUrl from "@/src/app/api/baseUrl";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false,
      message: "Method not allowed" 
    });
  }

  try {
    // Get the token directly using getToken instead of getSession
    const token = await getToken({ req, secret });
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized" 
      });
    }

    // Update role on backend
    const response = await axios.post(
      `${baseUrl}/users/choose-account-type/`,
      { account_type: req.body.role },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.accessToken}`
        }
      }
    );

    // Return success with the new role
    return res.status(200).json({ 
      success: true,
      role: req.body.role,
      redirectTo: req.body.role === 'recruiter' 
        ? '/companies/create' 
        : '/applicant/upload-resume'
    });

  } catch (error) {
    console.error('Role update error:', error);
    const errorMessage = error.response?.data?.message || 
                       error.message || 
                       'Failed to update role';
    
    return res.status(500).json({ 
      success: false,
      message: errorMessage 
    });
  }
}