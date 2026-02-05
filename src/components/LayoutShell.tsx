'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { clsx } from 'clsx';
import { User } from '@supabase/supabase-js';

interface LayoutShellProps {
  children: React.ReactNode;
  user: User | null;
  profile: any;
}

export function LayoutShell({ children, user, profile }: LayoutShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-300',
      profile?.role === 'admin' ? 'bg-gray-50' : 'bg-[#000000]'
    )}>
      {/* Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          role={profile?.role}
          user={user}
        />
      </div>

      {/* Main Content */}
      <div
        className={clsx(
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
