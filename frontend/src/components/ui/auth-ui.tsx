"use client";

import * as React from "react";
import { useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, Mail, X } from "lucide-react";
import { cn } from "../../lib/utils";

// --- Radix UI Components ---
const labelVariants = cva(
  "text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#1F2937]"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#F87171] text-white hover:bg-[#ef4444] shadow-md shadow-[#F87171]/30",
        outline: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
        link: "text-gray-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 shadow-sm transition-shadow placeholder:text-gray-400 focus-visible:border-[#F87171] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F87171] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";


// --- Auth Forms ---

interface AuthFormProps {
  onSignIn: (data: any) => Promise<void>;
  onSignUp: (data: any) => Promise<void>;
  isLoading: boolean;
}

function SocialLoginButtons() {
    return (
        <div className="flex justify-center gap-4 mt-6">
            <button type="button" className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
            </button>
            <button type="button" className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm text-[#1877F2]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073C24 5.449 18.627 0 12 0S0 5.449 0 12.073C0 18.055 4.388 23.016 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.005 1.792-4.669 4.533-4.669 1.312 0 2.686.233 2.686.233v2.932h-1.514c-1.49 0-1.956.918-1.956 1.86v2.304h3.328l-.532 3.49h-2.796V24C19.612 23.016 24 18.055 24 12.073z"/>
                </svg>
            </button>
            <button type="button" className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.62-1.49 3.6-2.912 1.13-1.636 1.582-3.223 1.608-3.314-.033-.013-3.106-1.193-3.132-4.786-.026-3.004 2.45-4.43 2.516-4.482-1.438-2.096-3.666-2.383-4.453-2.42-1.996-.192-3.905 1.187-4.954 1.187zM14.73 4.368c.803-.984 1.34-2.348 1.193-3.71-.19.008-.4.048-.59.1-.568.15-1.15.438-1.635.83-1.096.883-1.745 2.29-1.572 3.633.208.016.438.016.634.016 1.32-.016 2.502-.871 3.163-1.875z"/>
                </svg>
            </button>
        </div>
    );
}

function FormDivider() {
    return (
        <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-500 font-medium">Or Continue With</span>
            </div>
        </div>
    );
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
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#1a2b4b]">Login</h1>
        </div>
        <form onSubmit={handleSignIn} className="flex flex-col gap-5">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative flex items-center border border-gray-300 rounded-lg focus-within:ring-1 focus-within:ring-[#F87171] focus-within:border-[#F87171] bg-white overflow-hidden h-12">
                    <div className="pl-4 pr-3 text-gray-500">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <input 
                        id="email" 
                        type="email" 
                        required 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="daniel21fisher@gmail.com"
                        className="flex-1 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative flex items-center border border-gray-300 rounded-lg focus-within:ring-1 focus-within:ring-[#F87171] focus-within:border-[#F87171] bg-white overflow-hidden h-12">
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="pl-4 pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        required 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="••••••••"
                        className="flex-1 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                    />
                </div>
                <div className="flex justify-end mt-1">
                    <a href="#" className="text-sm font-semibold text-[#D4AF37] hover:underline">Forgot Password?</a>
                </div>
            </div>

            <Button type="submit" size="lg" className="mt-4 w-full" disabled={isLoading}>
                {isLoading ? "Logging In..." : "Log In"}
            </Button>
        </form>

        <FormDivider />
        <SocialLoginButtons />

        <div className="mt-12 text-center text-sm text-gray-600 font-medium">
            Don't have an account?{" "}
            <button onClick={onToggle} className="text-[#87CEEB] hover:underline font-bold">
                Sign Up here
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
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#1a2b4b]">Sign Up</h1>
        </div>
        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative flex items-center border border-gray-300 rounded-lg focus-within:ring-1 focus-within:ring-[#F87171] focus-within:border-[#F87171] bg-white overflow-hidden h-12">
                    <input 
                        id="name" 
                        type="text" 
                        required 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="John Doe"
                        className="flex-1 px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative flex items-center border border-gray-300 rounded-lg focus-within:ring-1 focus-within:ring-[#F87171] focus-within:border-[#F87171] bg-white overflow-hidden h-12">
                    <div className="pl-4 pr-3 text-gray-500">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <input 
                        id="email" 
                        type="email" 
                        required 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="daniel21fisher@gmail.com"
                        className="flex-1 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative flex items-center border border-gray-300 rounded-lg focus-within:ring-1 focus-within:ring-[#F87171] focus-within:border-[#F87171] bg-white overflow-hidden h-12">
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="pl-4 pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        required 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="••••••••"
                        className="flex-1 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                    />
                </div>
            </div>

            <Button type="submit" size="lg" className="mt-4 w-full" disabled={isLoading}>
                {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
        </form>

        <FormDivider />
        <SocialLoginButtons />

        <div className="mt-12 text-center text-sm text-gray-600 font-medium">
            Already have an account?{" "}
            <button onClick={onToggle} className="text-[#87CEEB] hover:underline font-bold">
                Log In here
            </button>
        </div>
    </div>
  );
}

// --- Main Auth UI Component ---

export function AuthUI({ onSignIn, onSignUp, isLoading }: AuthFormProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const toggleForm = () => setIsSignIn((prev) => !prev);

  // We are forcing the text to be gray-900 overall in the right panel to override global dark mode text color
  return (
    <div className="w-full min-h-screen flex bg-white font-sans text-gray-900 relative">
      
      {/* Left side Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#ffe5d9] flex-col items-center justify-center p-8 overflow-hidden rounded-r-[40px]">
        
        {/* Top left Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-1 z-20">
            <span className="text-2xl font-bold text-[#b5179e]">Eventure</span>
            <span className="w-2 h-2 rounded-full bg-[#F87171] mt-1"></span>
        </div>

        {/* Hero Illustration */}
        <div className="relative w-full h-full max-w-2xl flex items-center justify-center">
            <img 
                src="/auth_hero_illustration.jpg" 
                alt="Playful character illustration" 
                className="w-full object-contain drop-shadow-2xl z-10"
                style={{ mixBlendMode: 'multiply' }}
            />
        </div>
      </div>

      {/* Right side Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative lg:w-1/2 bg-white">
        
        {/* Close Button */}
        <button className="absolute top-8 right-8 text-gray-500 hover:text-gray-800 transition-colors">
            <X className="w-8 h-8" strokeWidth={1.5} />
        </button>

        {/* Form Container */}
        <div className="w-full max-w-[450px] px-4 py-8">
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
