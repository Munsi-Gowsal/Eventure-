import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { client } from '../lib/api/client';
import { useAuth } from '../auth/AuthProvider';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'ATTENDEE' | 'ADMIN'>('ATTENDEE');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await client.post('/auth/login', { email, password });
        login(res.data.data.accessToken);
      } else {
        const res = await client.post('/auth/register', { 
          fullName: name, 
          email, 
          password,
          role 
        });
        login(res.data.data.accessToken);
      }
      
      const from = (location.state as any)?.from?.pathname || (role === 'ADMIN' ? '/admin' : '/my-events');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] flex flex-col justify-center items-center p-6 relative selection:bg-[#FF3366] selection:text-white">
      {/* Decorative background shapes */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-[#FFD23F] border-[3px] border-black shadow-[8px_8px_0px_0px_#000] rotate-12 hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#00E5FF] border-[3px] border-black shadow-[12px_12px_0px_0px_#000] rounded-full -rotate-12 hidden lg:block" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 font-bold uppercase mb-8 hover:bg-black hover:text-white border-2 border-transparent hover:border-black px-3 py-1 transition-colors">
          <ArrowLeft size={20} strokeWidth={3} />
          Back to Events
        </Link>

        <div className="neo-card p-10 bg-white">
          <h1 className="text-4xl font-black font-display uppercase mb-2">
            {isLogin ? 'Welcome Back.' : 'Join Us.'}
          </h1>
          <p className="font-bold text-gray-500 mb-8 uppercase text-sm border-l-[4px] border-[#FF3366] pl-3">
            {isLogin ? 'Sign in to access your tickets.' : 'Create an account to book events.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#FF3366] text-white font-bold p-3 border-[3px] border-black text-sm">
                {error}
              </div>
            )}
            {!isLogin && (
              <>
                <div>
                  <label className="block font-black font-display uppercase mb-2">Account Type</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setRole('ATTENDEE')}
                      className={`flex-1 py-3 border-[3px] border-black font-black uppercase text-sm transition-colors ${role === 'ATTENDEE' ? 'bg-[#00E5FF] shadow-[4px_4px_0px_0px_#000]' : 'bg-white hover:bg-gray-50'}`}
                    >
                      Attend Events
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole('ADMIN')}
                      className={`flex-1 py-3 border-[3px] border-black font-black uppercase text-sm transition-colors ${role === 'ADMIN' ? 'bg-[#00E5FF] shadow-[4px_4px_0px_0px_#000]' : 'bg-white hover:bg-gray-50'}`}
                    >
                      Host Events
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block font-black font-display uppercase mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="neo-input w-full p-4 font-bold"
                    placeholder="JOHN DOE"
                    required={!isLogin}
                  />
                </div>
              </>
            )}
            <div>
              <label className="block font-black font-display uppercase mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neo-input w-full p-4 font-bold"
                placeholder="HELLO@EVENTURE.COM"
                required
              />
            </div>
            <div>
              <label className="block font-black font-display uppercase mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neo-input w-full p-4 font-bold"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="neo-button w-full py-4 text-xl flex justify-center items-center gap-2 bg-[#FFD23F] hover:bg-[#FF3366] hover:text-white mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" strokeWidth={3} />
              ) : (
                <>
                  {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'} <ArrowRight strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t-[3px] border-black pt-6">
            <p className="font-bold uppercase text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="mt-2 font-black font-display uppercase text-lg text-[#00E5FF] hover:text-[#FF3366] hover:underline decoration-[3px] underline-offset-4 transition-colors"
            >
              {isLogin ? 'Sign Up Now' : 'Log In Instead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
