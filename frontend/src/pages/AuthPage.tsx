import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    console.log(isLogin ? 'Logging in' : 'Signing up', { email, password, name });
    
    // Redirect back to where they came from (e.g. event details) or home
    const from = (location.state as any)?.from?.pathname || '/my-events';
    navigate(from, { replace: true });
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
            {!isLogin && (
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

            <button type="submit" className="neo-button w-full py-4 text-xl flex justify-center items-center gap-2 bg-[#FFD23F] hover:bg-[#FF3366] hover:text-white mt-4">
              {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'} <ArrowRight strokeWidth={3} />
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
