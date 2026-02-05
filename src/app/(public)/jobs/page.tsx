'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { getJob, applyToJob, Job, isAuthenticated } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, Users, Calendar, Clock, CheckCircle } from 'lucide-react';

function JobDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const data = await getJob(jobId);
      setJob(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  const isDeadlinePassed = job ? new Date(job.deadline) < new Date() : false;

  const handleApply = async () => {
    // If not authenticated, redirect to login with returnUrl
    if (!isAuthenticated()) {
      router.push(`/login?returnUrl=/jobs/${jobId}`);
      return;
    }

    // If employer, they can't apply
    if (user?.role === 'EMPLOYER') {
      setApplyError('Employers cannot apply to jobs');
      return;
    }

    try {
      setApplying(true);
      setApplyError('');
      await applyToJob(jobId);
      setApplied(true);
      // Refresh job to update application count
      loadJob();
    } catch (err: any) {
      setApplyError(err.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="h-40 bg-gray-200 rounded mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error || 'Job not found'}
          </div>
          <Link href="/" className="mt-4 inline-flex items-center text-[#2563EB] hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-[#64748B] hover:text-[#0F172A] mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="bg-white rounded-xl p-8 border border-[#E5E7EB] mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
                {job.title}
              </h1>
              <p className="text-[#2563EB] font-medium text-lg">
                {job.company_name}
              </p>
            </div>
            
            {/* Apply Button - UI gating based on auth state */}
            <div className="flex flex-col items-end">
              {applied ? (
                // Successfully applied state
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Applied!</span>
                </div>
              ) : isDeadlinePassed ? (
                // Deadline passed - applications closed
                <Button disabled className="bg-gray-400 text-white px-8 cursor-not-allowed">
                  Applications Closed
                </Button>
              ) : !isAuthenticated() ? (
                // Guest user - redirect to login
                <Button
                  onClick={() => router.push(`/login?returnUrl=/jobs/${jobId}`)}
                  className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8"
                >
                  Login to Apply
                </Button>
              ) : (
                // Authenticated user - can apply
                <Button
                  onClick={handleApply}
                  disabled={applying}
                  className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </Button>
              )}
              {applyError && (
                <p className="text-red-500 text-sm mt-2">{applyError}</p>
              )}
            </div>
          </div>

          {/* Job Meta */}
          <div className="flex flex-wrap gap-6 text-[#64748B] border-t border-[#E5E7EB] pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{job.applications_count} applicants</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
            </div>
            {isDeadlinePassed && (
              <div className="flex items-center gap-2 text-red-500">
                <Clock className="h-5 w-5" />
                <span>Applications closed</span>
              </div>
            )}
          </div>
        </div>

        {/* Tech Stack */}
        {job.tech_stack && (
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mb-6">
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {job.tech_stack.split(',').map((tech, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 bg-[#2563EB]/10 text-[#2563EB] rounded-lg font-medium"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Job Description */}
        {job.jd_text && (
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Job Description</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-[#64748B] whitespace-pre-wrap">{job.jd_text}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobDetailPage() {
  return (
    <AuthProvider>
      <JobDetailContent />
    </AuthProvider>
  );
}
