'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulerClient } from '@/lib/api/apiClients';
import { queryKeys } from '@/components/ReactQueryProvider';
import { CreateJob } from '@/lib/schemas/schemas';
import { Clock, Plus, Play, Pause, Trash2, Calendar, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

/**
 * Scheduler Page - Automated Trading Jobs
 * 
 * Features:
 * - View scheduled trading jobs
 * - Create new automated strategies
 * - Monitor job execution status
 * - Manage recurring tasks
 */

export default function SchedulerPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch scheduled jobs
  const { 
    data: jobs, 
    isLoading: jobsLoading,
    error: jobsError 
  } = useQuery({
    queryKey: queryKeys.scheduler.jobs(),
    queryFn: schedulerClient.getJobs,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: (jobId: string) => schedulerClient.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scheduler.jobs() });
    },
  });

  const handleDeleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      deleteJobMutation.mutate(jobId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Job Scheduler</h1>
              <p className="text-muted-foreground mt-1">
                Automate your trading strategies and portfolio management
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>New Job</span>
            </button>
          </div>
        </div>

        {/* Create Job Form */}
        {showCreateForm && (
          <div className="mb-8">
            <CreateJobForm 
              onSuccess={() => setShowCreateForm(false)}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {/* Jobs Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Jobs"
            value={jobs?.length.toString() || '0'}
            icon={Calendar}
            loading={jobsLoading}
          />
          <StatCard
            title="Active"
            value={jobs?.filter(job => job.enabled).length.toString() || '0'}
            icon={CheckCircle}
            color="green"
            loading={jobsLoading}
          />
          <StatCard
            title="Completed Today"
            value={jobs?.filter(job => job.status === 'success').length.toString() || '0'}
            icon={CheckCircle}
            color="blue"
            loading={jobsLoading}
          />
          <StatCard
            title="Failed"
            value={jobs?.filter(job => job.status === 'failed').length.toString() || '0'}
            icon={XCircle}
            color="red"
            loading={jobsLoading}
          />
        </div>

        {/* Jobs List */}
        <div className="trading-card p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Scheduled Jobs</h2>
              <p className="text-sm text-muted-foreground">
                Manage your automated trading tasks
              </p>
            </div>
          </div>

          {jobsLoading ? (
            <JobsSkeleton />
          ) : jobsError ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to Load Jobs</h3>
              <p className="text-muted-foreground">Unable to fetch scheduled jobs</p>
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onDelete={handleDeleteJob}
                  isDeleting={deleteJobMutation.isPending}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Scheduled Jobs</h3>
              <p className="text-muted-foreground mb-4">
                Create your first automated trading job to get started
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Create Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Create Job Form Component
 */
interface CreateJobFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function CreateJobForm({ onSuccess, onCancel }: CreateJobFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    schedule: '0 9 * * 1-5', // 9 AM weekdays
    type: 'rebalance' as 'rebalance' | 'analysis' | 'report',
  });

  const queryClient = useQueryClient();

  const createJobMutation = useMutation({
    mutationFn: (job: CreateJob) => schedulerClient.createJob(job),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scheduler.jobs() });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJobMutation.mutate(formData);
  };

  return (
    <div className="trading-card p-6">
      <h3 className="text-lg font-semibold mb-4">Create New Job</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Job Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Daily Portfolio Rebalance"
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Job Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="rebalance">Portfolio Rebalance</option>
              <option value="analysis">Market Analysis</option>
              <option value="report">Generate Report</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Schedule (Cron Expression)</label>
          <input
            type="text"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            placeholder="0 9 * * 1-5"
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
          <p className="text-xs text-muted-foreground">
            Examples: "0 9 * * 1-5" (9 AM weekdays), "0 */4 * * *" (every 4 hours)
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={createJobMutation.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {createJobMutation.isPending ? 'Creating...' : 'Create Job'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted/50"
          >
            Cancel
          </button>
        </div>

        {createJobMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              Failed to create job: {(createJobMutation.error as any)?.message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

/**
 * Job Card Component
 */
interface JobCardProps {
  job: any;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function JobCard({ job, onDelete, isDeleting }: JobCardProps) {
  const getStatusIcon = () => {
    switch (job.status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (job.status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${job.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {job.enabled ? 'Active' : 'Disabled'}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium">{job.name}</h4>
          <p className="text-sm text-muted-foreground">
            Schedule: {job.schedule}
          </p>
          {job.nextRun && (
            <p className="text-xs text-muted-foreground">
              Next run: {new Date(job.nextRun).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {job.status && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {job.status}
          </span>
        )}
        
        <button
          onClick={() => onDelete(job.id)}
          disabled={isDeleting}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Stat Card Component
 */
interface StatCardProps {
  title: string;
  value: string;
  icon: any;
  color?: 'green' | 'blue' | 'red' | 'gray';
  loading?: boolean;
}

function StatCard({ title, value, icon: Icon, color = 'gray', loading }: StatCardProps) {
  const colorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  };

  if (loading) {
    return (
      <div className="metric-card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${colorClasses[color]}`} />
      </div>
    </div>
  );
}

/**
 * Loading Skeleton
 */
function JobsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}