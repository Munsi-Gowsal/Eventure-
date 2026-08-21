"use client";

import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff, Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  onSignIn: (data: any) => Promise<void>;
  onSignUp: (data: any) => Promise<void>;
  isLoading: boolean;
}

function SignInForm({ onSubmit, isLoading, onToggle }: { onSubmit: (data: any) => Promise<void>; isLoading: boolean, onToggle: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ email, password });
  };
  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
        <div className="text-left mb-10">
            <h1 className="text-5xl font-black font-display uppercase mb-4 tracking-tighter">Admin Login</h1>
            <p className="font-bold border-l-[4px] border-[#FFD23F] pl-3 uppercase">Enter your credentials to manage events.</p>
        </div>
        <form onSubmit={handleSignIn} className="flex flex-col gap-6">
            <div>
                <label className="block font-black font-display uppercase mb-2">Email</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Mail className="w-5 h-5 text-black" strokeWidth={3} />
                    </div>
                    <input 
                        id="email" 
                        type="email" 
                        required 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="ADMIN@EVENTURE.COM"
                        className="neo-input w-full pl-12 pr-4 py-4 font-bold uppercase"
                    />
                </div>
            </div>

            <div>
                <div className="flex justify-between items-end mb-2">
                    <label className="font-black font-display uppercase">Password</label>
                    <a href="#" className="font-bold text-[#FF3366] hover:underline uppercase text-sm">Forgot?</a>
                </div>
                <div className="relative">
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 focus:outline-none text-black"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={3} /> : <Eye className="w-5 h-5" strokeWidth={3} />}
                    </button>
                    <input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        required 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="••••••••"
                        className="neo-input w-full pl-12 pr-4 py-4 font-bold"
                    />
                </div>
            </div>

            <button type="submit" className="neo-button w-full py-4 text-xl flex justify-center items-center gap-2 mt-4 bg-[#00E5FF] hover:bg-[#FFD23F]" disabled={isLoading}>
                {isLoading ? "LOGGING IN..." : "LOG IN"} <ArrowRight strokeWidth={3} />
            </button>
        </form>

        <div className="mt-8 pt-8 border-t-[3px] border-black text-center font-bold uppercase">
            New Organizer?{" "}
            <button onClick={onToggle} className="text-[#FF3366] hover:underline decoration-[3px] underline-offset-4 font-black font-display text-lg">
                Sign Up
            </button>
        </div>
    </div>
  );
}

function SignUpForm({ onSubmit, isLoading, onToggle }: { onSubmit: (data: any) => Promise<void>; isLoading: boolean, onToggle: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ name, email, password });
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
        <div className="text-left mb-10">
            <h1 className="text-5xl font-black font-display uppercase mb-4 tracking-tighter">Become Admin</h1>
            <p className="font-bold border-l-[4px] border-[#00E5FF] pl-3 uppercase">Join Eventure to host events.</p>
        </div>
        <form onSubmit={handleSignUp} className="flex flex-col gap-6">
            <div>
                <label className="block font-black font-display uppercase mb-2">Full Name</label>
                <input 
                    id="name" 
                    type="text" 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="JANE DOE"
                    className="neo-input w-full px-4 py-4 font-bold uppercase"
                />
            </div>

            <div>
                <label className="block font-black font-display uppercase mb-2">Email</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Mail className="w-5 h-5 text-black" strokeWidth={3} />
                    </div>
                    <input 
                        id="email" 
                        type="email" 
                        required 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="ADMIN@EVENTURE.COM"
                        className="neo-input w-full pl-12 pr-4 py-4 font-bold uppercase"
                    />
                </div>
            </div>

            <div>
                <label className="block font-black font-display uppercase mb-2">Password</label>
                <div className="relative">
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 focus:outline-none text-black"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={3} /> : <Eye className="w-5 h-5" strokeWidth={3} />}
                    </button>
                    <input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        required 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="••••••••"
                        className="neo-input w-full pl-12 pr-4 py-4 font-bold"
                    />
                </div>
            </div>

            <button type="submit" className="neo-button w-full py-4 text-xl flex justify-center items-center gap-2 mt-4 bg-[#FFD23F] hover:bg-[#00E5FF]" disabled={isLoading}>
                {isLoading ? "SIGNING UP..." : "SIGN UP"} <ArrowRight strokeWidth={3} />
            </button>
        </form>

        <div className="mt-8 pt-8 border-t-[3px] border-black text-center font-bold uppercase">
            Already an Admin?{" "}
            <button onClick={onToggle} className="text-[#FF3366] hover:underline decoration-[3px] underline-offset-4 font-black font-display text-lg">
                Log In
            </button>
        </div>
    </div>
  );
}

// --- Main Auth UI Component ---

export function AuthUI({ onSignIn, onSignUp, isLoading }: AuthFormProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const toggleForm = () => setIsSignIn((prev) => !prev);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#f4f4f0] flex flex-col justify-center items-center p-6 relative">
      <div className="absolute top-10 left-10 w-24 h-24 bg-[#FF3366] border-[3px] border-black shadow-[6px_6px_0px_0px_#000] rotate-45 hidden md:block" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#FFD23F] border-[3px] border-black shadow-[8px_8px_0px_0px_#000] rounded-full hidden md:block" />
      
      <div className="w-full max-w-md relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 font-bold uppercase mb-8 hover:bg-black hover:text-white border-2 border-transparent hover:border-black px-3 py-1 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={3} /> Back to Events
        </button>

        <div className="neo-card p-10 bg-white shadow-[12px_12px_0px_0px_#000]">
          {isSignIn ? (
              <SignInForm onSubmit={onSignIn} isLoading={isLoading} onToggle={toggleForm} />
          ) : (
              <SignUpForm onSubmit={onSignUp} isLoading={isLoading} onToggle={toggleForm} />
          )}
        </div>
      </div>
    </div>
  );
}
