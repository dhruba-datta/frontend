'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    tech_stack: '',
    deadline: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createJob(formData);
      router.push('/employer/jobs');
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  // Set minimum deadline to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-2xl">
      {/* Back Link */}
      <Link href="/employer/jobs" className="inline-flex items-center text-[#64748B] hover:text-[#0F172A] mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </Link>

      {/* Header */}
      <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Create New Job</h1>
      <p className="text-[#64748B] mb-8">
        Fill in the details below to create a new job posting. AI will generate the job description.
      </p>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-[#E5E7EB] space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-[#0F172A]">
            Job Title *
          </Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="e.g., Senior Machine Learning Engineer"
            value={formData.title}
            onChange={handleChange}
            required
            className="h-11 border-[#E5E7EB]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_name" className="text-sm font-medium text-[#0F172A]">
            Company Name *
          </Label>
          <Input
            id="company_name"
            name="company_name"
            type="text"
            placeholder="e.g., TechCorp Inc."
            value={formData.company_name}
            onChange={handleChange}
            required
            className="h-11 border-[#E5E7EB]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tech_stack" className="text-sm font-medium text-[#0F172A]">
            Tech Stack *
          </Label>
          <Input
            id="tech_stack"
            name="tech_stack"
            type="text"
            placeholder="e.g., Python, TensorFlow, PyTorch, AWS"
            value={formData.tech_stack}
            onChange={handleChange}
            required
            className="h-11 border-[#E5E7EB]"
          />
          <p className="text-xs text-[#64748B]">Comma-separated list of technologies</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline" className="text-sm font-medium text-[#0F172A]">
            Application Deadline *
          </Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            min={minDate}
            value={formData.deadline}
            onChange={handleChange}
            required
            className="h-11 border-[#E5E7EB]"
          />
        </div>

        <div className="pt-4 border-t border-[#E5E7EB]">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-11"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Job'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
