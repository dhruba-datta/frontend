'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTalentFeed, applyToJob, Job } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Sparkles, Briefcase, Calendar, Users, CheckCircle, Loader2 } from 'lucide-react';

export default function TalentFeedPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const data = await getTalentFeed();
      setJobs(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      setApplying(jobId);
      await applyToJob(jobId);
      setApplied(prev => new Set([...prev, jobId]));
    } catch (err: any) {
      if (err.message?.includes('already')) {
        setApplied(prev => new Set([...prev, jobId]));
      } else {
        alert(err.message || 'Failed to apply');
      }
    } finally {
      setApplying(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="h-6 w-6 text-[#2563EB]" />
          <h1 className="text-2xl font-bold text-[#0F172A]">AI Job Feed</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-[#E5E7EB] animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-6 w-6 text-[#2563EB]" />
        <h1 className="text-2xl font-bold text-[#0F172A]">AI Job Feed</h1>
      </div>
      <p className="text-[#64748B] mb-8">Jobs ranked by AI based on your profile match</p>

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
          <h3 className="text-lg font-medium text-[#0F172A] mb-2">No jobs in your feed</h3>
          <p className="text-[#64748B] mb-4">Check back later for new opportunities</p>
          <Link href="/jobs">
            <Button variant="outline">Browse All Jobs</Button>
          </Link>
        </div>
      ) : (
        /* Jobs List */
        <div className="space-y-4">
          {jobs.map((job) => {
            const isDeadlinePassed = new Date(job.deadline) < new Date();
            const hasApplied = applied.has(job.id);

            return (
              <div 
                key={job.id} 
                className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link href={`/jobs/${job.id}`}>
                        <h3 className="text-lg font-semibold text-[#0F172A] hover:text-[#2563EB]">
                          {job.title}
                        </h3>
                      </Link>
                      {job.match_score !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getScoreColor(job.match_score)}`}>
                          {job.match_score}% Match
                        </span>
                      )}
                    </div>
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

                  {/* Apply Button */}
                  <div className="ml-4">
                    {hasApplied ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Applied</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleApply(job.id)}
                        disabled={isDeadlinePassed || applying === job.id}
                        className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                      >
                        {applying === job.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isDeadlinePassed ? (
                          'Closed'
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
