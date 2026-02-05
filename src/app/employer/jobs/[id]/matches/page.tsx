'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getMatches, getJob, inviteTalent, MatchedTalent, Job } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, UserCircle, Send, CheckCircle, Loader2 } from 'lucide-react';

export default function MatchesPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [matches, setMatches] = useState<MatchedTalent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviting, setInviting] = useState<string | null>(null);
  const [invited, setInvited] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, [jobId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobData, matchesData] = await Promise.all([
        getJob(jobId),
        getMatches(jobId),
      ]);
      setJob(jobData);
      setMatches(matchesData);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (talentId: string) => {
    try {
      setInviting(talentId);
      await inviteTalent(jobId, talentId);
      setInvited(prev => new Set([...prev, talentId]));
    } catch (err: any) {
      // If already invited, mark as invited
      if (err.message?.includes('already')) {
        setInvited(prev => new Set([...prev, talentId]));
      } else {
        alert(err.message || 'Failed to send invitation');
      }
    } finally {
      setInviting(null);
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
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-[#2563EB]" />
          <h1 className="text-2xl font-bold text-[#0F172A]">AI Matched Talents</h1>
        </div>
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
      {matches.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
          <Sparkles className="h-12 w-12 text-[#64748B] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0F172A] mb-2">No matches yet</h3>
          <p className="text-[#64748B]">
            AI is working on finding the best talent for your job
          </p>
        </div>
      ) : (
        /* Matches List */
        <div className="space-y-3">
          {matches.map((match) => (
            <div 
              key={match.id} 
              className="bg-white rounded-xl p-5 border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#0F172A]">{match.name}</h3>
                  <p className="text-sm text-[#64748B]">{match.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Match Score */}
                <div className={`px-3 py-1.5 rounded-lg font-semibold ${getScoreColor(match.score)}`}>
                  {match.score}% Match
                </div>

                {/* Invite Button */}
                {invited.has(match.id) ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Invited</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleInvite(match.id)}
                    disabled={inviting === match.id}
                    className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white gap-1"
                  >
                    {inviting === match.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Invite
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
