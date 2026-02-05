'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getApplicants, getJob, Applicant, Job } from '@/lib/api';
import { ArrowLeft, Users, UserCircle, Mail } from 'lucide-react';

export default function ApplicantsPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [jobId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobData, applicantsData] = await Promise.all([
        getJob(jobId),
        getApplicants(jobId),
      ]);
      setJob(jobData);
      setApplicants(applicantsData);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-8 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-[#E5E7EB] animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Link */}
      <Link href="/employer/jobs" className="inline-flex items-center text-[#64748B] hover:text-[#0F172A] mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Applicants</h1>
        {job && (
          <p className="text-[#64748B]">
            For: <span className="text-[#2563EB] font-medium">{job.title}</span> at {job.company_name}
          </p>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Empty State */}
      {applicants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
          <Users className="h-12 w-12 text-[#64748B] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0F172A] mb-2">No applicants yet</h3>
          <p className="text-[#64748B]">
            Share your job posting to attract talent
          </p>
        </div>
      ) : (
        /* Applicants List */
        <div className="space-y-3">
          {applicants.map((applicant) => (
            <div 
              key={applicant.id} 
              className="bg-white rounded-xl p-5 border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#0F172A]">{applicant.name}</h3>
                  <p className="text-sm text-[#64748B] flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {applicant.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  applicant.source === 'invitation' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {applicant.source === 'invitation' ? 'Via Invitation' : 'Direct Apply'}
                </span>
                <span className="text-xs text-[#64748B]">
                  {new Date(applicant.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
