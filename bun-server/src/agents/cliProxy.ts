import { spawn, ChildProcess } from 'child_process';
import { z } from 'zod';

// Schema for analysis job parameters
const AnalysisJobSchema = z.object({
  jobId: z.string(),
  symbol: z.string(),
  strategy: z.enum(['momentum', 'mean_reversion', 'trend_following', 'custom']),
  parameters: z.record(z.any()).optional(),
  timeframe: z.enum(['1m', '5m', '15m', '1h', '4h', '1d']).default('1h'),
  lookback: z.number().min(1).max(1000).default(100),
});

export type AnalysisJob = z.infer<typeof AnalysisJobSchema>;

interface JobProcess {
  process: ChildProcess;
  jobId: string;
  startTime: Date;
  status: 'running' | 'completed' | 'failed';
}

/**
 * CLI Proxy for integrating with Python TradingAgents package
 * 
 * This class provides a bridge between the Bun server and the Python CLI,
 * allowing execution of analysis jobs as child processes with progress streaming.
 */
export class CLIProxy {
  private runningJobs = new Map<string, JobProcess>();
  private cliPath: string;
  private wsManager: any; // Will be injected

  constructor(cliPath?: string) {
    // Default CLI path - will check if tradingagents is available in PATH
    this.cliPath = cliPath || 'tradingagents';
  }

  /**
   * Set WebSocket manager for progress updates
   */
  setWSManager(wsManager: any) {
    this.wsManager = wsManager;
  }

  /**
   * Check if TradingAgents CLI is available
   */
  async isCliAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      const child = spawn(this.cliPath, ['--version'], { stdio: 'pipe' });
      
      child.on('close', (code) => {
        resolve(code === 0);
      });
      
      child.on('error', () => {
        resolve(false);
      });
      
      // Timeout after 5 seconds
      setTimeout(() => {
        child.kill();
        resolve(false);
      }, 5000);
    });
  }

  /**
   * Start analysis job
   */
  async startAnalysis(jobData: AnalysisJob, tenantId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate job data
      const job = AnalysisJobSchema.parse(jobData);
      
      // Check if CLI is available
      const isAvailable = await this.isCliAvailable();
      if (!isAvailable) {
        // Fall back to simulated analysis
        return this.runSimulatedAnalysis(job, tenantId);
      }

      // Run real CLI analysis
      return this.runCliAnalysis(job, tenantId);
      
    } catch (error) {
      console.error('Error starting analysis:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Run analysis using Python CLI
   */
  private async runCliAnalysis(job: AnalysisJob, tenantId: string): Promise<{ success: boolean; message: string }> {
    const args = [
      'analyze',
      '--symbol', job.symbol,
      '--strategy', job.strategy,
      '--timeframe', job.timeframe,
      '--lookback', job.lookback.toString(),
      '--format', 'json',
      '--progress'
    ];

    // Add custom parameters if provided
    if (job.parameters) {
      args.push('--params', JSON.stringify(job.parameters));
    }

    console.log(`Starting CLI analysis: ${this.cliPath} ${args.join(' ')}`);

    const child = spawn(this.cliPath, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PYTHONUNBUFFERED: '1' }
    });

    const jobProcess: JobProcess = {
      process: child,
      jobId: job.jobId,
      startTime: new Date(),
      status: 'running'
    };

    this.runningJobs.set(job.jobId, jobProcess);

    // Handle stdout (progress and results)
    child.stdout?.on('data', (data) => {
      const output = data.toString();
      this.handleCliOutput(job.jobId, tenantId, output);
    });

    // Handle stderr (errors and warnings)
    child.stderr?.on('data', (data) => {
      const error = data.toString();
      console.error(`CLI stderr [${job.jobId}]:`, error);
      
      if (this.wsManager) {
        this.wsManager.broadcastAnalysisProgress(tenantId, job.jobId, {
          type: 'warning',
          message: error.trim()
        });
      }
    });

    // Handle process completion
    child.on('close', (code) => {
      const jobProcess = this.runningJobs.get(job.jobId);
      if (jobProcess) {
        jobProcess.status = code === 0 ? 'completed' : 'failed';
        
        if (this.wsManager) {
          this.wsManager.broadcastAnalysisProgress(tenantId, job.jobId, {
            type: 'completed',
            success: code === 0,
            exitCode: code,
            duration: Date.now() - jobProcess.startTime.getTime()
          });
        }
        
        // Clean up after 5 minutes
        setTimeout(() => {
          this.runningJobs.delete(job.jobId);
        }, 5 * 60 * 1000);
      }
    });

    // Handle process errors
    child.on('error', (error) => {
      console.error(`CLI process error [${job.jobId}]:`, error);
      
      const jobProcess = this.runningJobs.get(job.jobId);
      if (jobProcess) {
        jobProcess.status = 'failed';
      }
      
      if (this.wsManager) {
        this.wsManager.broadcastAnalysisProgress(tenantId, job.jobId, {
          type: 'error',
          message: error.message
        });
      }
    });

    return {
      success: true,
      message: `Analysis job ${job.jobId} started successfully`
    };
  }

  /**
   * Run simulated analysis when CLI is not available
   */
  private async runSimulatedAnalysis(job: AnalysisJob, tenantId: string): Promise<{ success: boolean; message: string }> {
    console.log(`Running simulated analysis for job ${job.jobId} (CLI not available)`);

    // Simulate progress updates
    const progressSteps = [
      { step: 'Fetching market data', progress: 10 },
      { step: 'Calculating indicators', progress: 30 },
      { step: 'Running strategy analysis', progress: 60 },
      { step: 'Generating signals', progress: 80 },
      { step: 'Finalizing results', progress: 100 }
    ];

    // Send initial progress
    if (this.wsManager) {
      this.wsManager.broadcastAnalysisProgress(tenantId, job.jobId, {
        type: 'started',
        strategy: job.strategy,
        symbol: job.symbol
      });
    }

    // Simulate progress over time
    for (let i = 0; i < progressSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      if (this.wsManager) {
        this.wsManager.broadcastAnalysisProgress(tenantId, job.jobId, {
          type: 'progress',
          ...progressSteps[i]
        });
      }
    }

    // Send final results
    const mockResults = this.generateMockAnalysisResults(job);
    
    if (this.wsManager) {
      this.wsManager.broadcastAnalysisProgress(tenantId, job.jobId, {
        type: 'completed',
        success: true,
        results: mockResults,
        duration: 5000 + Math.random() * 3000
      });
    }

    return {
      success: true,
      message: `Simulated analysis job ${job.jobId} completed`
    };
  }

  /**
   * Handle CLI output and parse progress/results
   */
  private handleCliOutput(jobId: string, tenantId: string, output: string) {
    const lines = output.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      try {
        // Try to parse as JSON progress update
        const data = JSON.parse(line);
        
        if (this.wsManager) {
          this.wsManager.broadcastAnalysisProgress(tenantId, jobId, {
            type: 'progress',
            ...data
          });
        }
      } catch {
        // Not JSON, treat as regular log output
        console.log(`CLI output [${jobId}]:`, line);
        
        if (this.wsManager) {
          this.wsManager.broadcastAnalysisProgress(tenantId, jobId, {
            type: 'log',
            message: line
          });
        }
      }
    }
  }

  /**
   * Generate mock analysis results for simulation
   */
  private generateMockAnalysisResults(job: AnalysisJob) {
    const signals = ['BUY', 'SELL', 'HOLD'];
    const randomSignal = signals[Math.floor(Math.random() * signals.length)];
    
    return {
      symbol: job.symbol,
      strategy: job.strategy,
      timeframe: job.timeframe,
      signal: randomSignal,
      confidence: Math.random() * 0.4 + 0.6, // 60-100%
      indicators: {
        rsi: Math.random() * 100,
        sma_20: 150 + Math.random() * 50,
        sma_50: 148 + Math.random() * 54,
        macd: (Math.random() - 0.5) * 10,
        volume_ratio: 0.8 + Math.random() * 0.4
      },
      risk_metrics: {
        volatility: Math.random() * 0.3 + 0.1,
        sharpe_ratio: Math.random() * 2 - 0.5,
        max_drawdown: Math.random() * 0.2,
        beta: Math.random() * 2
      },
      recommendations: [
        `${randomSignal} signal generated for ${job.symbol}`,
        `Strategy: ${job.strategy} shows ${randomSignal === 'BUY' ? 'bullish' : randomSignal === 'SELL' ? 'bearish' : 'neutral'} outlook`,
        `Risk level: ${Math.random() > 0.5 ? 'Moderate' : 'Low'}`
      ]
    };
  }

  /**
   * Get status of running jobs
   */
  getJobStatus(jobId: string) {
    const job = this.runningJobs.get(jobId);
    if (!job) {
      return { status: 'not_found' };
    }

    return {
      status: job.status,
      startTime: job.startTime,
      duration: Date.now() - job.startTime.getTime()
    };
  }

  /**
   * Cancel running job
   */
  cancelJob(jobId: string): boolean {
    const job = this.runningJobs.get(jobId);
    if (job && job.status === 'running') {
      job.process.kill('SIGTERM');
      job.status = 'failed';
      this.runningJobs.delete(jobId);
      return true;
    }
    return false;
  }

  /**
   * Get list of all jobs
   */
  getAllJobs() {
    return Array.from(this.runningJobs.entries()).map(([jobId, job]) => ({
      jobId,
      status: job.status,
      startTime: job.startTime,
      duration: Date.now() - job.startTime.getTime()
    }));
  }
}