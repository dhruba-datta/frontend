'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { User } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';

interface TopbarProps {
  user: User | null;
  profile: any;
  onMobileMenuToggle?: () => void;
}

export function Topbar({ user, profile, onMobileMenuToggle }: TopbarProps) {
  const isAdmin = profile?.role === 'admin';

  return (
    <header className={clsx(
      "sticky top-0 z-30 flex h-16 items-center justify-between border-b transition-colors duration-300 px-4 lg:px-6",
      isAdmin 
        ? "border-[#64748B]/20 bg-white" 
        : "border-white/5 bg-[#000000]"
    )}>
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-4">
        {/* ... (mobile menu logic remains, but maybe fix colors) ... */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className={clsx("lg:hidden", isAdmin ? "text-[#0F172A]" : "text-white")}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-[#0F172A] border-r-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Sidebar isCollapsed={false} onToggle={() => {}} role={profile?.role} user={user} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Breadcrumbs / Page Title */}
      <div className="hidden lg:flex flex-1 items-center gap-2">
        <h1 className={clsx(
          "text-lg font-semibold transition-colors",
          isAdmin ? "text-[#0F172A]" : "text-white/90"
        )}>
          {isAdmin ? "Recruitment Platform" : "Jobs"}
        </h1>
        {isAdmin && (
          <Badge variant="secondary" className="bg-[#2563EB]/10 text-[#2563EB] border-none flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        )}
      </div>

    </header>
  );
}
