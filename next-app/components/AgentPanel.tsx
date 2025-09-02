'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analysisClient } from '@/lib/api/apiClients';
import { queryKeys } from '@/components/ReactQueryProvider';
import { AnalysisRequest } from '@/lib/schemas/schemas';
import { Bot, Activity, AlertTriangle, CheckCircle, Clock, Play } from 'lucide-react';

/**
 * Agent Panel Component
 * Shows agent status and provides quick analysis controls
 */

export function AgentPanel() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [selectedStrategy, setSelectedStrategy] = useState<'momentum' | 'mean_reversion' | 'trend_following'>('momentum');
  const queryClient = useQueryClient();

  // Fetch agent status
  const { 
    data: agentStatus, 
    isLoading: statusLoading,
    refetch: refetchStatus 
  } = useQuery({
    queryKey: queryKeys.analysis.status(),
    queryFn: analysisClient.getAgentStatus,
    refetchInterval: 5000, // Check every 5 seconds
  });

  // Start analysis mutation
  const startAnalysisMutation = useMutation({
    mutationFn: (request: AnalysisRequest) => analysisClient.startAnalysis(request),
    onSuccess: () => {
      // Refresh agent status
      refetchStatus();
      queryClient.invalidateQueries({ queryKey: queryKeys.analysis.status() });
    },
  });

  const handleStartAnalysis = () => {
    const request: AnalysisRequest = {
      symbol: selectedSymbol,
      strategy: selectedStrategy,
      timeframe: '1h',
      lookback: 100,
    };

    startAnalysisMutation.mutate(request);
  };

  const isAnalysisRunning = startAnalysisMutation.isPending;
  const hasActiveJobs = agentStatus?.activeJobs > 0;

  return (
    <div className="trading-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Trading Agent</h2>
            <p className="text-sm text-muted-foreground">
              Analysis & automation
            </p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          {statusLoading ? (
            <div className="flex items-center space-x-1 text-yellow-600">
              <Clock className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : agentStatus?.cliAvailable ? (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Online</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Simulation</span>
            </div>
          )}
        </div>
      </div>

      {/* Agent Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Activity className="h-4 w-4 text-primary mr-1" />
            <span className="text-sm font-medium text-muted-foreground">Active Jobs</span>
          </div>
          <p className="text-xl font-bold">{agentStatus?.activeJobs || 0}</p>
        </div>

        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Bot className="h-4 w-4 text-primary mr-1" />
            <span className="text-sm font-medium text-muted-foreground">Total Jobs</span>
          </div>
          <p className="text-xl font-bold">{agentStatus?.totalJobs || 0}</p>
        </div>
      </div>

      {/* Quick Analysis */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Quick Analysis</h3>
        
        {/* Symbol Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Symbol</label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="w-full p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="AAPL">AAPL - Apple Inc.</option>
            <option value="GOOGL">GOOGL - Alphabet Inc.</option>
            <option value="MSFT">MSFT - Microsoft Corp.</option>
            <option value="TSLA">TSLA - Tesla Inc.</option>
            <option value="AMZN">AMZN - Amazon.com Inc.</option>
          </select>
        </div>

        {/* Strategy Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Strategy</label>
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value as any)}
            className="w-full p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="momentum">Momentum Trading</option>
            <option value="mean_reversion">Mean Reversion</option>
            <option value="trend_following">Trend Following</option>
          </select>
        </div>

        {/* Start Analysis Button */}
        <button
          onClick={handleStartAnalysis}
          disabled={isAnalysisRunning}
          className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg font-medium transition-colors ${
            isAnalysisRunning
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isAnalysisRunning ? (
            <>
              <Clock className="h-4 w-4 animate-spin" />
              <span>Starting Analysis...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Start Analysis</span>
            </>
          )}
        </button>

        {/* Analysis Result */}
        {startAnalysisMutation.isSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Analysis started successfully
              </span>
            </div>
            {startAnalysisMutation.data?.jobId && (
              <p className="text-xs text-green-600 mt-1">
                Job ID: {startAnalysisMutation.data.jobId}
              </p>
            )}
          </div>
        )}

        {/* Analysis Error */}
        {startAnalysisMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                Analysis failed to start
              </span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              {(startAnalysisMutation.error as any)?.message || 'Unknown error occurred'}
            </p>
          </div>
        )}
      </div>

      {/* Recent Jobs */}
      {agentStatus?.jobs && agentStatus.jobs.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Jobs</h4>
          <div className="space-y-2">
            {agentStatus.jobs.slice(0, 3).map((job, index) => (
              <div key={job.jobId || index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    job.status === 'running' ? 'bg-blue-500 animate-pulse' :
                    job.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-mono">{job.jobId?.slice(-8) || 'Unknown'}</span>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{job.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLI Status */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">CLI Status:</span>
          <span className={`font-medium ${
            agentStatus?.cliAvailable ? 'text-green-600' : 'text-orange-600'
          }`}>
            {agentStatus?.cliAvailable ? 'Available' : 'Simulation Mode'}
          </span>
        </div>
        {!agentStatus?.cliAvailable && (
          <p className="text-xs text-muted-foreground mt-1">
            TradingAgents CLI not found - using simulated responses
          </p>
        )}
      </div>
    </div>
  );
}