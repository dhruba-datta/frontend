'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, ArrowRight, Briefcase, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signup, login, isAuthenticated, getCurrentUser } from '@/lib/api';

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'EMPLOYER' | 'TALENT'>('TALENT');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      getCurrentUser()
        .then(user => {
          const returnUrl = searchParams.get('returnUrl');
          const dashboardUrl = user.role === 'EMPLOYER' ? '/employer/jobs' : '/talent/feed';
          
          if (returnUrl && returnUrl.startsWith(user.role === 'EMPLOYER' ? '/employer' : '/talent')) {
            router.push(returnUrl);
          } else {
            router.push(dashboardUrl);
          }
        })
        .catch(() => {});
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowSuccess(false);
    setErrorMessage('');

    try {
      let user;
      if (authMode === 'signin') {
        const response = await login({ email, password });
        user = response.user;
      } else {
        const response = await signup({ name, email, password, role });
        user = response.user;
      }

      // Redirect based on role or returnUrl
      const returnUrl = searchParams.get('returnUrl');
      const dashboardUrl = user.role === 'EMPLOYER' ? '/employer/jobs' : '/talent/feed';
      
      if (returnUrl && returnUrl.startsWith(user.role === 'EMPLOYER' ? '/employer' : '/talent')) {
        router.push(returnUrl);
      } else {
        router.push(dashboardUrl);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans selection:bg-[#2563EB]/30">
      {/* Left Column: Hero Visual */}
      <div className="relative hidden w-1/2 lg:flex overflow-hidden">
        <div className="relative h-full w-full bg-[#0B1220] flex flex-col items-center justify-center p-12">
          {/* Abstract background effects */}
          <div className="absolute top-0 right-0 h-[80%] w-[80%] rounded-full bg-[#2563EB]/10 blur-[150px]" />
          <div className="absolute bottom-0 left-0 h-[60%] w-[60%] rounded-full bg-blue-500/5 blur-[120px]" />
          
          <div className="relative z-10 w-full max-w-2xl text-left lg:pl-12">
            {/* Logo and Tagline */}
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-white">TalentX</h1>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl font-black leading-tight text-white xl:text-6xl">
                {authMode === 'signin' ? 'Welcome Back' : 'Join the'} <br/> 
                <span className="text-[#2563EB]">AI Talent Marketplace</span>
              </h2>
              <p className="text-xl text-white/50 leading-relaxed font-medium max-w-lg">
                Connect with top employers and AI talents. Find your next opportunity or hire the best.
              </p>
              <p className="text-sm font-bold text-white/30 uppercase tracking-[0.2em]">
                {authMode === 'signin' 
                  ? 'Sign in to continue your journey' 
                  : 'Create an account as Employer or Talent'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex w-full flex-col items-center justify-start p-8 lg:w-1/2 xl:p-24 overflow-y-auto lg:pt-24">
        <div className="w-full max-w-[440px] flex flex-col">
          {/* Tab Switcher */}
          <div className="mb-8 p-1 bg-slate-100 rounded-2xl flex w-full flex-none">
            <button
              onClick={() => setAuthMode('signin')}
              className={cn(
                "flex-1 py-3.5 text-sm font-bold rounded-xl transition-all duration-200",
                authMode === 'signin' 
                  ? "bg-white text-[#0F172A] shadow-sm" 
                  : "text-[#64748B] hover:text-[#0F172A]"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={cn(
                "flex-1 py-3.5 text-sm font-bold rounded-xl transition-all duration-200",
                authMode === 'signup' 
                  ? "bg-white text-[#0F172A] shadow-sm" 
                  : "text-[#64748B] hover:text-[#0F172A]"
              )}
            >
              Sign Up
            </button>
          </div>

          <div className="mb-8 flex-none">
            {showSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start space-x-3">
                <div className="mt-0.5 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center flex-none">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-900">{successMessage}</h3>
                </div>
              </div>
            )}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3">
                <div className="mt-0.5 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center flex-none">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-900">Action failed</h3>
                  <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
                </div>
              </div>
            )}
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] lg:text-4xl">
              {authMode === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="mt-3 text-base text-[#64748B]">
              {authMode === 'signin' 
                ? 'Enter your details to access your account.' 
                : 'Join TalentX to connect with opportunities.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-left flex-1 pb-10">
            {authMode === 'signup' && (
              <>
                {/* Role Selection */}
                <div className="space-y-2.5">
                  <Label className="text-sm font-bold text-[#0F172A]">I am a...</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('TALENT')}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all",
                        role === 'TALENT'
                          ? "border-[#2563EB] bg-[#2563EB]/5"
                          : "border-[#E5E7EB] hover:border-[#2563EB]/50"
                      )}
                    >
                      <UserCircle className={cn("h-8 w-8 mb-2", role === 'TALENT' ? "text-[#2563EB]" : "text-[#64748B]")} />
                      <span className={cn("font-semibold", role === 'TALENT' ? "text-[#2563EB]" : "text-[#0F172A]")}>Talent</span>
                      <span className="text-xs text-[#64748B] mt-1">Looking for jobs</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('EMPLOYER')}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all",
                        role === 'EMPLOYER'
                          ? "border-[#2563EB] bg-[#2563EB]/5"
                          : "border-[#E5E7EB] hover:border-[#2563EB]/50"
                      )}
                    >
                      <Briefcase className={cn("h-8 w-8 mb-2", role === 'EMPLOYER' ? "text-[#2563EB]" : "text-[#64748B]")} />
                      <span className={cn("font-semibold", role === 'EMPLOYER' ? "text-[#2563EB]" : "text-[#0F172A]")}>Employer</span>
                      <span className="text-xs text-[#64748B] mt-1">Hiring talent</span>
                    </button>
                  </div>
                </div>

                {/* Name Field */}
                <div className="space-y-2.5">
                  <Label htmlFor="name" className="text-sm font-bold text-[#0F172A]">
                    Full Name
                  </Label>
                  <div className="group relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 border-[#E5E7EB] bg-white pl-12 focus:border-[#2563EB] focus:ring-[#2563EB] rounded-xl"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-bold text-[#0F172A]">
                Email Address
              </Label>
              <div className="group relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-[#E5E7EB] bg-white pl-12 focus:border-[#2563EB] focus:ring-[#2563EB] rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-sm font-bold text-[#0F172A]">
                Password
              </Label>
              <div className="group relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12 border-[#E5E7EB] bg-white pl-12 focus:border-[#2563EB] focus:ring-[#2563EB] rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8] text-base font-bold rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (authMode === 'signin' ? 'Sign in' : 'Create account')}
            </Button>

            <div className="text-center pt-4">
              <Link href="/" className="text-sm text-[#64748B] hover:text-[#2563EB]">
                ← Back to public jobs
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
