import { DEMO_ACCOUNTS } from '@/lib/demo-data'

type ConnectionMode = 'normal' | 'demo' | 'override' | 'ignore';

export class DatabaseService {
  private static instance: DatabaseService
  private isConnected: boolean = false
  private useDemo: boolean = false
  private connectionMode: ConnectionMode = 'normal'
  private overrideConfig: any = null
  
  // Enable singleton pattern with reset capability for testing
  public static reset() {
    DatabaseService.instance = undefined as any;
  }

  private constructor() {
    // Check for environment variable that forces ignore mode
    if (process.env.DB_IGNORE === 'true') {
      this.connectionMode = 'ignore';
      this.useDemo = true;
      console.log('Database connections disabled via environment variable');
      return;
    }
    
    // Check for override mode from localStorage or URL params
    if (typeof window !== 'undefined') {
      // Check URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('db_mode') === 'ignore') {
        this.setConnectionMode('ignore');
        return;
      } else if (urlParams.get('db_mode') === 'demo') {
        this.setConnectionMode('demo');
      } else if (urlParams.get('db_mode') === 'override') {
        this.setConnectionMode('override');
        try {
          const overrideConfig = urlParams.get('db_config');
          if (overrideConfig) {
            this.overrideConfig = JSON.parse(decodeURIComponent(overrideConfig));
          }
        } catch (e) {
          console.error('Failed to parse override config', e);
        }
      }
      
      // Check localStorage
      try {
        const storedMode = localStorage.getItem('db_connection_mode');
        if (storedMode) {
          this.setConnectionMode(storedMode as ConnectionMode);
        }
        
        const storedConfig = localStorage.getItem('db_override_config');
        if (storedConfig && this.connectionMode === 'override') {
          this.overrideConfig = JSON.parse(storedConfig);
        }
      } catch (e) {
        console.error('Error reading from localStorage', e);
      }
    }
    
    // Only init connection if not in ignore mode
    if (this.connectionMode !== 'ignore') {
      this.initConnection();
    }
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  private async initConnection() {
    if (this.connectionMode === 'ignore') {
      console.log('Database connections disabled');
      this.isConnected = false;
      this.useDemo = true;
      return;
    }
    
    if (this.connectionMode === 'demo') {
      console.log('Using demo mode by configuration');
      this.isConnected = false;
      this.useDemo = true;
      return;
    }
    
    if (this.connectionMode === 'override' && this.overrideConfig) {
      try {
        // Use override configuration instead of environment variables
        console.log('Using override connection configuration');
        // Connection logic with overrideConfig
        this.isConnected = true;
        this.useDemo = false;
        return;
      } catch (error) {
        console.warn('Override connection failed, falling back to demo data:', error);
        this.isConnected = false;
        this.useDemo = true;
        return;
      }
    }
    
    try {
      // Normal connection attempt
      const dbUrl = process.env.DATABASE_URL
      if (!dbUrl) throw new Error('Database URL not configured')
      
      // Connection logic here...
      this.isConnected = true
      this.useDemo = false
      
    } catch (error) {
      console.warn('Database connection failed, falling back to demo data:', error)
      this.isConnected = false
      this.useDemo = true
    }
  }

  setConnectionMode(mode: ConnectionMode, config?: any): void {
    this.connectionMode = mode;
    
    if (mode === 'ignore') {
      this.useDemo = true;
      this.isConnected = false;
      console.log('Database connections disabled');
      
      // Store ignore mode preference
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('db_connection_mode', mode);
        } catch (e) {
          console.error('Failed to save to localStorage', e);
        }
      }
      return;
    }
    
    if (mode === 'override' && config) {
      this.overrideConfig = config;
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('db_connection_mode', mode);
          localStorage.setItem('db_override_config', JSON.stringify(config));
        } catch (e) {
          console.error('Failed to save to localStorage', e);
        }
      }
    } else if (mode === 'demo') {
      this.useDemo = true;
      this.isConnected = false;
      
      // Store demo mode preference
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('db_connection_mode', mode);
        } catch (e) {
          console.error('Failed to save to localStorage', e);
        }
      }
    }
    
    // Re-initialize connection with new settings
    this.initConnection();
  }

  async getAccounts() {
    if (this.useDemo || this.connectionMode === 'ignore') {
      return DEMO_ACCOUNTS
    }
    
    try {
      // Real database query logic
      if (this.connectionMode === 'override' && this.overrideConfig) {
        // Use override configuration for query
        console.log('Querying with override configuration');
        // Example: specific query using this.overrideConfig
      }
      
      return []
    } catch (error) {
      console.error('Error fetching accounts:', error)
      return DEMO_ACCOUNTS
    }
  }

  async reconnect() {
    if (this.connectionMode === 'ignore') {
      console.log('Reconnect ignored - database connections disabled');
      return false;
    }
    
    await this.initConnection()
    return this.isConnected
  }

  isUsingDemo() {
    return this.useDemo || this.connectionMode === 'ignore';
  }
  
  getConnectionMode(): ConnectionMode {
    return this.connectionMode;
  }
  
  clearOverride(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('db_connection_mode');
      localStorage.removeItem('db_override_config');
    }
    
    this.connectionMode = 'normal';
    this.overrideConfig = null;
    this.initConnection();
  }
}
