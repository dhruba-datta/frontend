'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTalentApplications, Application } from '@/lib/api';
import { FileText, Briefcase, Calendar, ExternalLink } from 'lucide-react';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await getTalentApplications();
      setApplications(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-8">
          <FileText className="h-6 w-6 text-[#2563EB]" />
          <h1 className="text-2xl font-bold text-[#0F172A]">My Applications</h1>
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
        <FileText className="h-6 w-6 text-[#2563EB]" />
        <h1 className="text-2xl font-bold text-[#0F172A]">My Applications</h1>
      </div>
      <p className="text-[#64748B] mb-8">Track your job applications</p>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
          <FileText className="h-12 w-12 text-[#64748B] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0F172A] mb-2">No applications yet</h3>
          <p className="text-[#64748B] mb-4">Start applying to jobs to see them here</p>
          <Link href="/talent/feed">
            <button className="text-[#2563EB] hover:underline font-medium">
              Browse Job Feed →
            </button>
          </Link>
        </div>
      ) : (
        /* Applications List */
        <div className="space-y-4">
          {applications.map((application) => (
            <div 
              key={application.id} 
              className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link href={`/jobs/${application.job_id}`}>
                      <h3 className="text-lg font-semibold text-[#0F172A] hover:text-[#2563EB]">
                        {application.title}
                      </h3>
                    </Link>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      application.source === 'invitation' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {application.source === 'invitation' ? 'Via Invitation' : 'Direct Apply'}
                    </span>
                  </div>
                  <p className="text-[#2563EB] font-medium mb-3">
                    {application.company_name}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-[#64748B]">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Applied: {new Date(application.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>Deadline: {new Date(application.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* View Job Link */}
                <Link 
                  href={`/jobs/${application.job_id}`}
                  className="ml-4 flex items-center gap-1 text-[#2563EB] hover:underline text-sm font-medium"
                >
                  View Job
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
