'use client';

import { useState, useEffect } from 'react';
import { getTalentInvitations, respondToInvitation, Invitation } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Mail, Briefcase, Calendar, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responding, setResponding] = useState<string | null>(null);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const data = await getTalentInvitations();
      setInvitations(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (invitationId: string, status: 'ACCEPTED' | 'DECLINED') => {
    try {
      setResponding(invitationId);
      await respondToInvitation(invitationId, status);
      // Update local state
      setInvitations(prev => 
        prev.map(inv => 
          inv.id === invitationId 
            ? { ...inv, status, responded_at: new Date().toISOString() } 
            : inv
        )
      );
    } catch (err: any) {
      alert(err.message || 'Failed to respond');
    } finally {
      setResponding(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            Accepted
          </span>
        );
      case 'DECLINED':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <XCircle className="h-4 w-4" />
            Declined
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <Clock className="h-4 w-4" />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Mail className="h-6 w-6 text-[#2563EB]" />
          <h1 className="text-2xl font-bold text-[#0F172A]">Invitations</h1>
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
        <Mail className="h-6 w-6 text-[#2563EB]" />
        <h1 className="text-2xl font-bold text-[#0F172A]">Invitations</h1>
      </div>
      <p className="text-[#64748B] mb-8">Job invitations from employers</p>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Empty State */}
      {invitations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
          <Mail className="h-12 w-12 text-[#64748B] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0F172A] mb-2">No invitations yet</h3>
          <p className="text-[#64748B]">
            Employers will send you invitations when your profile matches their jobs
          </p>
        </div>
      ) : (
        /* Invitations List */
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div 
              key={invitation.id} 
              className="bg-white rounded-xl p-6 border border-[#E5E7EB]"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-[#0F172A]">
                      {invitation.title}
                    </h3>
                    {getStatusBadge(invitation.status)}
                  </div>
                  <p className="text-[#2563EB] font-medium mb-3">
                    {invitation.company_name}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-[#64748B]">
                    {invitation.employer_name && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>From: {invitation.employer_name}</span>
                      </div>
                    )}
                    {invitation.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {new Date(invitation.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {invitation.status === 'PENDING' && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      onClick={() => handleRespond(invitation.id, 'DECLINED')}
                      disabled={responding === invitation.id}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      {responding === invitation.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Decline'
                      )}
                    </Button>
                    <Button
                      onClick={() => handleRespond(invitation.id, 'ACCEPTED')}
                      disabled={responding === invitation.id}
                      className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                    >
                      {responding === invitation.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Accept'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
