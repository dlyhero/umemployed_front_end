// src/pages/api/auth/update-role.js
import { getToken } from 'next-auth/jwt';
import axios from 'axios';
import baseUrl from '@/src/app/api/baseUrl';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('[UpdateRoleAPI] Method not allowed:', req.method);
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    console.log('[UpdateRoleAPI] Fetching token');
    const token = await getToken({ req, secret });

    if (!token || !token.accessToken) {
      console.error('[UpdateRoleAPI] No token found');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No token provided',
      });
    }

    console.log('[UpdateRoleAPI] Sending request to backend:', {
      url: `${baseUrl}/users/choose-account-type/`,
      role: req.body.role,
    });
    const response = await axios.post(
      `${baseUrl}/users/choose-account-type/`,
      { account_type: req.body.role },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    console.log('[UpdateRoleAPI] Backend response:', {
      status: response.status,
      data: response.data,
    });

    const redirectTo =
      req.body.role === 'recruiter' ? '/companies/create' : '/applicant/upload-resume';
    console.log('[UpdateRoleAPI] Returning response with redirect:', redirectTo);
    return res.status(200).json({
      success: true,
      role: req.body.role,
      redirectTo,
    });
  } catch (error) {
    console.error('[UpdateRoleAPI] Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
    });
    const errorMessage =
      error.response?.data?.message || error.message || 'Failed to update role';
    return res.status(error.response?.status || 500).json({
      success: false,
      message: errorMessage,
      details: error.response?.data,
    });
  }
}