import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Job {
  id: string;
  title: string;
  company: string;
  job_type: string;
  location: string;
  description: string;
  requirements?: string;
  salary_range?: string;
  posted_date: string;
  is_active: boolean;
}

export const useJobs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('is_active', true)
        .order('posted_date', { ascending: false });

      if (error) throw error;
      return data as Job[];
    },
  });

  const applyToJob = useMutation({
    mutationFn: async ({ jobId, coverLetter }: { jobId: string; coverLetter?: string }) => {
      if (!user) throw new Error('Must be logged in to apply');

      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          applicant_id: user.id,
          cover_letter: coverLetter,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast.success('Application submitted successfully!');
    },
    onError: (error: any) => {
      if (error.message?.includes('duplicate')) {
        toast.error('You have already applied to this job');
      } else {
        toast.error(error.message || 'Failed to submit application');
      }
    },
  });

  return { jobs, isLoading, applyToJob: applyToJob.mutate };
};
