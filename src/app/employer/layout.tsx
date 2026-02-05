'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { useEffect } from 'react';
import { Briefcase, Users, Plus, LogOut, Sparkles, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function EmployerLayoutContent({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'EMPLOYER')) {
      router.push('/login?returnUrl=' + pathname);
    }
  }, [user, loading, router, pathname]);

  if (loading || !user || user.role !== 'EMPLOYER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  const navItems = [
    { href: '/employer/jobs', label: 'My Jobs', icon: Briefcase },
    { href: '/employer/jobs/new', label: 'Create Job', icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation */}
      <nav className="bg-[#0B1220] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-[#2563EB]" />
              <span className="text-xl font-bold text-white">TalentX</span>
              <span className="text-xs bg-[#2563EB] text-white px-2 py-0.5 rounded-full ml-2">
                Employer
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors",
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-white/70 text-sm">{user?.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-[#0B1220] border-t border-white/10 p-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium py-2 transition-colors",
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/70 mb-3 px-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <EmployerLayoutContent>{children}</EmployerLayoutContent>
    </AuthProvider>
  );
}
