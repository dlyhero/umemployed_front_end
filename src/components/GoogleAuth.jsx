import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

export default function GoogleAuth() {
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    console.log('Sending token to backend:', idToken);
    setLoading(true);
    try {
      const res = await fetch('https://server.umemployed.com/api/users/google-auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });
      const data = await res.json();
      if (res.ok) {
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
