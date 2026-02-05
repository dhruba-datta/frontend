'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Briefcase, LogOut, User, Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  return (
    <nav className="bg-[#0B1220] border-b border-[#E5E7EB]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-[#2563EB]" />
            <span className="text-xl font-bold text-white">TalentX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {loading ? (
              <div className="w-20 h-9 bg-white/10 rounded animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link 
                  href={user.role === 'EMPLOYER' ? '/employer/jobs' : '/talent/feed'}
                  className="text-white/70 hover:text-white font-medium transition-colors"
                >
                  Dashboard
                </Link>
                
                <div className="flex items-center gap-2 text-white/70">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user.name}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
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
          {!loading && (
            user ? (
              <>
                <Link 
                  href={user.role === 'EMPLOYER' ? '/employer/jobs' : '/talent/feed'}
                  className="block text-white/70 hover:text-white font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 text-white/70 py-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 px-0"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="space-y-3 pt-2">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </nav>
  );
}
