import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

export default function GoogleAuth() {
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/google-auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });
      const data = await res.json();
      if (res.ok) {
        // Store tokens securely
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        // Optionally, redirect or update UI
      } else {
        alert(data.message || 'Authentication failed.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          alert('Google Login Failed');
        }}
        useOneTap
      />
      {loading && <div>Authenticating...</div>}
    </GoogleOAuthProvider>
  );
}
