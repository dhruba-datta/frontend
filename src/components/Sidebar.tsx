'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User } from '@supabase/supabase-js';
import { signOut } from '@/app/(public)/login/actions';
import { AuthService } from '@/lib/auth-service';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  role?: string;
  user: User | null;
}

const adminNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/dashboard/candidates', label: 'Candidates', icon: Users },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const userNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/dashboard/notifications', label: 'Notifications', icon: ShieldCheck }, // Placeholder icon
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/payments', label: 'Payments', icon: BarChart3 }, // Placeholder icon
  { href: '/dashboard/community', label: 'Community', icon: Briefcase }, // Placeholder icon
  { href: '/dashboard/talent', label: 'Talent programs', icon: ShieldCheck }, // Placeholder icon
];

export function Sidebar({ isCollapsed, onToggle, role, user }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = AuthService.isAdmin(user);
  const navItems = isAdmin ? adminNavItems : userNavItems;
  const brandName = isAdmin ? 'Astha IT' : 'OptiHire';

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300 border-r',
        isAdmin 
          ? 'bg-[#0F172A] border-white/10 w-64' // Admin Theme
          : 'bg-[#000000] border-purple-500/10 w-64', // AIT Premium Theme
        isCollapsed && 'w-16'
      )}
    >
      {/* Logo Section */}
      <div className={clsx(
        "flex h-16 items-center justify-center px-4 border-b",
        isAdmin ? "border-white/10" : "border-white/5"
      )}>
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Astha IT"
              width={120}
              height={36}
              className={clsx("h-8 w-auto", !isAdmin && "brightness-200")}
              priority
            />
          </Link>
        )}
        {isCollapsed && (
          <Link href="/" className="flex items-center justify-center w-full">
            <div className={clsx(
              "h-8 w-8 rounded-lg flex items-center justify-center",
              isAdmin ? "bg-[#2563EB]" : "bg-white/10"
            )}>
              <span className="text-white font-bold text-sm">A</span>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2 mt-2">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard' 
            ? pathname === '/dashboard' 
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-300',
                isActive
                  ? isAdmin 
                    ? 'bg-[#3B82F6]/10 text-[#3B82F6]' // Admin Active
                    : 'bg-purple-500/10 text-purple-400 shadow-[0_0_35px_-5px_rgba(168,85,247,0.3)] border border-purple-500/20' // AIT Active (Glowing)
                  : isAdmin
                    ? 'text-white/70 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className={clsx(
                'h-[22px] w-[22px] shrink-0 transition-all duration-300',
                isActive 
                  ? isAdmin ? 'text-[#3B82F6]' : 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                  : 'text-white/50'
              )} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Separator className="mb-4 bg-white/10" />
        
        {user ? (
          <div className={clsx(
            "flex items-center gap-3 transition-all duration-300 group",
            isCollapsed ? "flex-col" : "px-1"
          )}>
            <Link 
              href="/dashboard/profile"
              className="flex items-center gap-3 flex-1 overflow-hidden hover:bg-white/5 p-1 rounded-xl transition-colors"
            >
              <div className="h-10 w-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-white/20">
                <UserIcon className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-1 flex-col overflow-hidden">
                  <span className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                    {user.user_metadata?.name || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-white/40 truncate group-hover:text-white/60 transition-colors">
                    {user.email}
                  </span>
                </div>
              )}
            </Link>

            <form action={signOut} className={clsx(isCollapsed && "mt-2")}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-white/40 hover:text-white hover:bg-white/10"
                title="Log Out"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log Out</span>
              </Button>
            </form>
          </div>
        ) : (
          <div className="rounded-lg bg-white/5 p-3">
             <p className="text-xs text-white/50">Not Signed In</p>
          </div>
        )}
      </div>
    </aside>
  );
}
