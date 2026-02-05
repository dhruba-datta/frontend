'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Github, Chrome, Facebook, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account created! You can now sign in.');
        router.push('/login');
      } else {
        const errorMessage = data.error || 'Signup failed';
        alert(`Signup Error: ${errorMessage}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Side: Sign Up Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-[40%] xl:px-24">
        <div className="mb-12">
          <Image 
            src="/logo.png" 
            alt="Astha IT" 
            width={120} 
            height={40} 
            className="h-auto w-auto brightness-0" 
          />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-brand-navy">Create account</h1>
          <p className="mt-2 text-brand-slate">Join Astha IT and find your dream career.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-brand-navy">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-slate/50" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-brand-slate/20 pl-10 focus-visible:ring-brand-purple"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" title="password" className="text-sm font-medium text-brand-navy">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-slate/50" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-brand-slate/20 pl-10 focus-visible:ring-brand-purple"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full bg-brand-navy text-white hover:bg-brand-navy/90 text-md font-semibold transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className="mt-8 flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-brand-slate/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-brand-slate/50">Or sign up with</span>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="h-12 w-12 rounded-full p-0 border-brand-slate/20 hover:bg-brand-offwhite">
              <Chrome className="h-5 w-5 text-brand-navy" />
            </Button>
            <Button variant="outline" className="h-12 w-12 rounded-full p-0 border-brand-slate/20 hover:bg-brand-offwhite">
              <Github className="h-5 w-5 text-brand-navy" />
            </Button>
            <Button variant="outline" className="h-12 w-12 rounded-full p-0 border-brand-slate/20 hover:bg-brand-offwhite">
              <Facebook className="h-5 w-5 text-brand-navy" />
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-brand-slate">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-brand-navy hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Right Side: Hero Visual */}
      <div className="relative hidden w-[60%] lg:block bg-brand-navy">
        <Image
          src="/login-hero.png"
          alt="Recruitment Platform"
          fill
          className="object-cover opacity-60"
          priority
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-20 text-white">
          <div className="mb-8">
            <Image 
              src="/logo.png" 
              alt="Astha IT" 
              width={180} 
              height={60} 
              className="h-auto w-auto brightness-200" 
            />
          </div>
          <h2 className="mb-2 text-5xl font-bold leading-tight">Start Your Journey</h2>
          <p className="mb-12 max-w-lg text-lg text-white/80">
            Join a global network of innovators. Create your profile today and get discovered by top tech teams at Astha IT.
          </p>

          {/* Floating Card Reference Piece */}
          <div className="flex w-full max-w-md flex-col space-y-6 rounded-3xl bg-black/40 p-8 backdrop-blur-xl border border-white/10">
            <h3 className="text-2xl font-semibold text-white">Unlock your potential in the right environment</h3>
            <p className="text-white/60">Astha IT is where culture meets technology. Join the frontier tech company today.</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-3">
                {[5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-[#1E293B] bg-[#334155] overflow-hidden">
                    <Image 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} 
                      alt="User avatar" 
                      width={40} 
                      height={40} 
                    />
                  </div>
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1E293B] bg-[#334155] text-xs font-bold">
                  9k+
                </div>
              </div>
              <Button size="icon" className="h-12 w-12 rounded-full bg-brand-purple text-brand-navy hover:bg-brand-purple/90">
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
