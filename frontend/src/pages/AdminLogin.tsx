import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../lib/api/client';
import { useAuth } from '../auth/AuthProvider';
import { AuthUI } from '../components/ui/auth-ui';
import { useToast } from '../components/ui/ToastContext';

export const AdminLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await client.post('/auth/login', { email: data.email, password: data.password });
      login(response.data.accessToken);
      toast('Welcome back!', 'success');
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      const message = err.response?.data?.error?.message 
        || err.response?.data?.message 
        || err.response?.data?.error
        || 'Unable to complete the request. Please try again.';
      
      // Ensure we always pass a string to toast to avoid React crashes
      toast(typeof message === 'string' ? message : JSON.stringify(message), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: any) => {
    setIsLoading(true);
    try {
      await client.post('/auth/register', { fullName: data.name, email: data.email, password: data.password });
      toast('Account created! Please sign in.', 'success');
    } catch (err: any) {
      let message = err.response?.data?.error?.message 
        || err.response?.data?.message 
        || err.response?.data?.error
        || 'Unable to complete the request. Please try again.';

      // Extract precise Zod validation errors if present
      if (err.response?.data?.error?.code === 'VALIDATION_ERROR' && err.response?.data?.error?.fields) {
        const fields = err.response.data.error.fields;
        const firstFieldKey = Object.keys(fields)[0];
        if (firstFieldKey && Array.isArray(fields[firstFieldKey]) && fields[firstFieldKey].length > 0) {
          message = fields[firstFieldKey][0];
        }
      }
      
      toast(typeof message === 'string' ? message : JSON.stringify(message), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-50">
      <AuthUI 
        onSignIn={handleSignIn} 
        onSignUp={handleSignUp} 
        isLoading={isLoading} 
      />
    </div>
  );
};
