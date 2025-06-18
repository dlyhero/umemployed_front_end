// Test API endpoint to verify environment variables in production
// Remove this file after confirming deployment works

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Only allow this endpoint in development or for testing
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ message: 'Not found' });
  }

  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    hasNextAuthURL: !!process.env.NEXTAUTH_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    nextAuthURL: process.env.NEXTAUTH_URL ? 'Set (hidden for security)' : 'Not set',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json({
    message: 'Environment check',
    env: envCheck
  });
}
