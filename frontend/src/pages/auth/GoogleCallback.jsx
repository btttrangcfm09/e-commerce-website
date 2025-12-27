import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const profileData = searchParams.get('profile');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google authentication error:', error);
      navigate('/login?error=google_auth_failed');
      return;
    }

    if (token && profileData) {
      try {
        const profile = JSON.parse(decodeURIComponent(profileData));
        const result = handleGoogleCallback(token, profile);
        
        if (result.success) {
          // Redirect to home or dashboard after successful login
          navigate('/');
        } else {
          navigate('/login?error=callback_failed');
        }
      } catch (error) {
        console.error('Error processing Google callback:', error);
        navigate('/login?error=processing_failed');
      }
    } else {
      navigate('/login?error=missing_credentials');
    }
  }, [searchParams, navigate, handleGoogleCallback]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing Google login...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
