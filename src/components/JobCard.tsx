'use client';

import Link from 'next/link';
import { Users, Calendar } from 'lucide-react';
import { Job } from '@/lib/api';

/**
 * JobCard Component
 * Displays a job listing card with title, company, tech stack, and meta info.
 * Clicking navigates to the job detail page.
 */
interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:border-[#2563EB] hover:shadow-md transition-all cursor-pointer h-full">
        {/* Job Title */}
        <h3 className="text-lg font-semibold text-[#0F172A] mb-2 line-clamp-2">
          {job.title}
        </h3>
        
        {/* Company Name */}
        <p className="text-[#2563EB] font-medium mb-4">
          {job.company_name}
        </p>
        
        {/* Meta Info: Applicants and Deadline */}
        <div className="flex items-center gap-4 text-sm text-[#64748B]">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{job.applications_count} applicants</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(job.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Tech Stack Tags */}
        {job.tech_stack && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tech_stack.split(',').slice(0, 3).map((tech, i) => (
              <span 
                key={i}
                className="px-2 py-1 bg-[#F1F5F9] text-[#64748B] text-xs rounded-md"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
