'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEmployerJobs, Job } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, Users, Calendar, Eye, Sparkles } from 'lucide-react';

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getEmployerJobs();
      setJobs(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">My Jobs</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-[#E5E7EB] animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">My Jobs</h1>
        <Link href="/employer/jobs/new">
          <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white gap-2">
            <Plus className="h-4 w-4" />
            Create Job
          </Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Empty State */}
      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
          <Briefcase className="h-12 w-12 text-[#64748B] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0F172A] mb-2">No jobs yet</h3>
          <p className="text-[#64748B] mb-4">Create your first job posting to start attracting talent</p>
          <Link href="/employer/jobs/new">
            <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white gap-2">
              <Plus className="h-4 w-4" />
              Create Job
            </Button>
          </Link>
        </div>
      ) : (
        /* Jobs List */
        <div className="space-y-4">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-1">
                    {job.title}
                  </h3>
                  <p className="text-[#2563EB] font-medium mb-3">
                    {job.company_name}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-[#64748B]">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{job.applications_count} applicants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  {job.tech_stack && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.tech_stack.split(',').slice(0, 4).map((tech, i) => (
                        <span 
                          key={i}
                          className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-xs rounded"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <Link href={`/employer/jobs/${job.id}/applicants`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Users className="h-4 w-4" />
                      Applicants
                    </Button>
                  </Link>
                  <Link href={`/employer/jobs/${job.id}/matches`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Sparkles className="h-4 w-4" />
                      Matches
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
