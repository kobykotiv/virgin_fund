import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, TrendingUp, DollarSign, PieChart } from 'lucide-react';

interface Portfolio {
  id: string;
  name: string;
  capital: number;
  createdAt: string;
  maxDrawdown: number; // percentage
  takeProfit: number; // percentage
  stopLoss: number; // percentage
  initialBuyIn: number; // percentage of capital
  feeStructure: {
    alpacaCommission: number; // per trade
    alpacaBaseFee: number; // base fee
    estimatedSlippage: number; // percentage
  };
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  isVirtual: boolean; // true for paper trading, false for real money
  currentDrawdown?: number; // current drawdown percentage
  totalPnL?: number; // total profit/loss percentage
  riskAlerts?: RiskAlert[];
}

interface RiskAlert {
  id: string;
  type: 'drawdown' | 'take_profit' | 'stop_loss' | 'position_size';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  position?: string;
}

interface AlpacaAccount {
  buying_power: string;
  cash: string;
  portfolio_value: string;
  equity: string;
}

interface Position {
  symbol: string;
  qty: string;
  avg_entry_price: string;
  market_value: string;
  unrealized_pl: string;
  unrealized_plpc: string;
}

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [account, setAccount] = useState<AlpacaAccount | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [newPortfolioCapital, setNewPortfolioCapital] = useState('');
  const [newPortfolioMaxDrawdown, setNewPortfolioMaxDrawdown] = useState('');
  const [newPortfolioTakeProfit, setNewPortfolioTakeProfit] = useState('');
  const [newPortfolioStopLoss, setNewPortfolioStopLoss] = useState('');
  const [newPortfolioInitialBuyIn, setNewPortfolioInitialBuyIn] = useState('');
  const [newPortfolioRiskProfile, setNewPortfolioRiskProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [newPortfolioIsVirtual, setNewPortfolioIsVirtual] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchAccount();
    loadPortfolios();
  }, []);

  const fetchAccount = async () => {
    try {
      const [accountRes, positionsRes] = await Promise.all([
        fetch('/api/account'),
        fetch('/api/positions')
      ]);

      if (accountRes.ok) {
        const accountData = await accountRes.json();
        setAccount(accountData);
      }

      if (positionsRes.ok) {
        const positionsData = await positionsRes.json();
        setPositions(positionsData);

        // Update portfolio risk monitoring
        setPortfolios(currentPortfolios =>
          currentPortfolios.map(portfolio => calculatePortfolioRisk(portfolio, positionsData))
        );
      }
    } catch (error) {
      console.error('Failed to fetch account/positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolios = () => {
    // Load from localStorage for now
    const stored = localStorage.getItem('portfolios');
    if (stored) {
      setPortfolios(JSON.parse(stored));
    }
  };

  const savePortfolios = (newPortfolios: Portfolio[]) => {
    localStorage.setItem('portfolios', JSON.stringify(newPortfolios));
    setPortfolios(newPortfolios);
  };

  const createPortfolio = () => {
    if (!newPortfolioName || !newPortfolioCapital || !newPortfolioMaxDrawdown ||
        !newPortfolioTakeProfit || !newPortfolioStopLoss || !newPortfolioInitialBuyIn) return;

    const capital = parseFloat(newPortfolioCapital);
    const maxDrawdown = parseFloat(newPortfolioMaxDrawdown);
    const takeProfit = parseFloat(newPortfolioTakeProfit);
    const stopLoss = parseFloat(newPortfolioStopLoss);
    const initialBuyIn = parseFloat(newPortfolioInitialBuyIn);

    if (isNaN(capital) || capital <= 0 || isNaN(maxDrawdown) || isNaN(takeProfit) ||
        isNaN(stopLoss) || isNaN(initialBuyIn)) return;

    // Calculate estimated fees
    const estimatedFees = calculateEstimatedFees(capital, initialBuyIn);

    if (account && capital > parseFloat(account.buying_power)) {
      alert('Capital exceeds available buying power');
      return;
    }

    const portfolio: Portfolio = {
      id: Date.now().toString(),
      name: newPortfolioName,
      capital,
      createdAt: new Date().toISOString(),
      maxDrawdown,
      takeProfit,
      stopLoss,
      initialBuyIn,
      feeStructure: estimatedFees,
      riskProfile: newPortfolioRiskProfile,
      isVirtual: newPortfolioIsVirtual,
    };

    const updated = [...portfolios, portfolio];
    savePortfolios(updated);
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const calculateEstimatedFees = (capital: number, initialBuyIn: number) => {
    // Alpaca fee structure (approximate)
    const alpacaCommission = 0.0; // Free for now, but can change
    const alpacaBaseFee = 0.0;
    const estimatedSlippage = 0.05; // 0.05% estimated slippage

    return {
      alpacaCommission,
      alpacaBaseFee,
      estimatedSlippage,
    };
  };

  const resetForm = () => {
    setNewPortfolioName('');
    setNewPortfolioCapital('');
    setNewPortfolioMaxDrawdown('');
    setNewPortfolioTakeProfit('');
    setNewPortfolioStopLoss('');
    setNewPortfolioInitialBuyIn('');
    setNewPortfolioRiskProfile('moderate');
    setNewPortfolioIsVirtual(true);
  };

  // Risk monitoring functions
  const calculatePortfolioRisk = (portfolio: Portfolio, positions: Position[]): Portfolio => {
    if (positions.length === 0) {
      return { ...portfolio, currentDrawdown: 0, totalPnL: 0, riskAlerts: [] };
    }

    // Calculate total P/L
    const totalPnL = positions.reduce((sum, pos) => sum + parseFloat(pos.unrealized_pl), 0);
    const totalPnLPercent = (totalPnL / portfolio.capital) * 100;

    // Calculate current drawdown (negative P/L as percentage)
    const currentDrawdown = totalPnLPercent < 0 ? Math.abs(totalPnLPercent) : 0;

    // Generate risk alerts
    const alerts: RiskAlert[] = [];

    // Drawdown alert
    if (currentDrawdown >= portfolio.maxDrawdown * 0.8) {
      alerts.push({
        id: `drawdown-${portfolio.id}`,
        type: 'drawdown',
        message: `Portfolio drawdown (${currentDrawdown.toFixed(2)}%) approaching limit (${portfolio.maxDrawdown}%)`,
        severity: currentDrawdown >= portfolio.maxDrawdown ? 'high' : 'medium',
        timestamp: new Date().toISOString()
      });
    }

    // Take profit alert
    if (totalPnLPercent >= portfolio.takeProfit * 0.9) {
      alerts.push({
        id: `take-profit-${portfolio.id}`,
        type: 'take_profit',
        message: `Portfolio P/L (${totalPnLPercent.toFixed(2)}%) approaching take profit target (${portfolio.takeProfit}%)`,
        severity: totalPnLPercent >= portfolio.takeProfit ? 'high' : 'medium',
        timestamp: new Date().toISOString()
      });
    }

    // Position size alerts
    positions.forEach(pos => {
      const positionValue = parseFloat(pos.market_value);
      const positionSizePercent = (positionValue / portfolio.capital) * 100;

      // Risk profile based position size limits
      const maxPositionSize = portfolio.riskProfile === 'conservative' ? 5 :
                             portfolio.riskProfile === 'moderate' ? 10 : 20;

      if (positionSizePercent > maxPositionSize) {
        alerts.push({
          id: `position-size-${portfolio.id}-${pos.symbol}`,
          type: 'position_size',
          message: `${pos.symbol} position (${positionSizePercent.toFixed(2)}%) exceeds recommended size (${maxPositionSize}%) for ${portfolio.riskProfile} risk profile`,
          severity: positionSizePercent > maxPositionSize * 1.5 ? 'high' : 'medium',
          timestamp: new Date().toISOString(),
          position: pos.symbol
        });
      }
    });

    return {
      ...portfolio,
      currentDrawdown,
      totalPnL: totalPnLPercent,
      riskAlerts: alerts
    };
  };

  const getRiskStatusColor = (portfolio: Portfolio) => {
    if (!portfolio.riskAlerts) return 'text-green-600';

    const highAlerts = portfolio.riskAlerts.filter(alert => alert.severity === 'high');
    if (highAlerts.length > 0) return 'text-red-600';

    const mediumAlerts = portfolio.riskAlerts.filter(alert => alert.severity === 'medium');
    if (mediumAlerts.length > 0) return 'text-yellow-600';

    return 'text-green-600';
  };

  const getRiskStatusText = (portfolio: Portfolio) => {
    if (!portfolio.riskAlerts) return 'Low Risk';

    const highAlerts = portfolio.riskAlerts.filter(alert => alert.severity === 'high');
    if (highAlerts.length > 0) return 'High Risk';

    const mediumAlerts = portfolio.riskAlerts.filter(alert => alert.severity === 'medium');
    if (mediumAlerts.length > 0) return 'Medium Risk';

    return 'Low Risk';
  };

  const getRiskBasedRecommendations = (portfolio: Portfolio, positions: Position[]) => {
    const recommendations: string[] = [];

    if (!portfolio.currentDrawdown || !portfolio.totalPnL) return recommendations;

    // Drawdown-based recommendations
    if (portfolio.currentDrawdown > portfolio.maxDrawdown * 0.7) {
      recommendations.push(`⚠️ High drawdown detected. Consider reducing position sizes by 20-30%.`);
    }

    // Take profit recommendations
    if (portfolio.totalPnL > portfolio.takeProfit * 0.8) {
      recommendations.push(`🎯 Portfolio approaching take profit target. Consider taking partial profits.`);
    }

    // Position size recommendations based on risk profile
    const maxPositionSize = portfolio.riskProfile === 'conservative' ? 5 :
                           portfolio.riskProfile === 'moderate' ? 10 : 20;

    positions.forEach(pos => {
      const positionValue = parseFloat(pos.market_value);
      const positionSizePercent = (positionValue / portfolio.capital) * 100;

      if (positionSizePercent > maxPositionSize * 1.2) {
        recommendations.push(`📊 ${pos.symbol} position (${positionSizePercent.toFixed(1)}%) exceeds recommended size. Consider reducing by ${((positionSizePercent - maxPositionSize) / positionSizePercent * 100).toFixed(0)}%.`);
      }
    });

    // Stop loss recommendations
    if (portfolio.totalPnL < -portfolio.stopLoss * 0.5) {
      recommendations.push(`🛑 Portfolio loss approaching stop loss level. Monitor closely and consider exit strategy.`);
    }

    return recommendations;
  };

  const getPortfolioRiskScore = (portfolio: Portfolio): number => {
    if (!portfolio.riskAlerts) return 0;

    let score = 0;
    portfolio.riskAlerts.forEach(alert => {
      if (alert.severity === 'high') score += 3;
      else if (alert.severity === 'medium') score += 1;
    });

    return Math.min(score, 10); // Cap at 10
  };

  const selectPortfolio = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading account...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchAccount}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Refresh Data & Risk Analysis
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Portfolio
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Portfolio</DialogTitle>
                  <DialogDescription>
                    Configure your portfolio with advanced risk management and fee estimation.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Portfolio Name</Label>
                      <Input
                        id="name"
                        value={newPortfolioName}
                        onChange={(e) => setNewPortfolioName(e.target.value)}
                        placeholder="e.g., Growth Portfolio"
                      />
                    </div>
                    <div>
                      <Label htmlFor="capital">Initial Capital ($)</Label>
                      <Input
                        id="capital"
                        type="number"
                        value={newPortfolioCapital}
                        onChange={(e) => setNewPortfolioCapital(e.target.value)}
                        placeholder={`Max: $${account?.buying_power || '0'}`}
                      />
                    </div>
                  </div>

                  {/* Risk Management */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Risk Management</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="maxDrawdown">Max Drawdown (%)</Label>
                        <Input
                          id="maxDrawdown"
                          type="number"
                          step="0.1"
                          value={newPortfolioMaxDrawdown}
                          onChange={(e) => setNewPortfolioMaxDrawdown(e.target.value)}
                          placeholder="e.g., 10.0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="initialBuyIn">Initial Buy-in (%)</Label>
                        <Input
                          id="initialBuyIn"
                          type="number"
                          step="0.1"
                          value={newPortfolioInitialBuyIn}
                          onChange={(e) => setNewPortfolioInitialBuyIn(e.target.value)}
                          placeholder="e.g., 5.0"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="takeProfit">Take Profit (%)</Label>
                        <Input
                          id="takeProfit"
                          type="number"
                          step="0.1"
                          value={newPortfolioTakeProfit}
                          onChange={(e) => setNewPortfolioTakeProfit(e.target.value)}
                          placeholder="e.g., 15.0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                        <Input
                          id="stopLoss"
                          type="number"
                          step="0.1"
                          value={newPortfolioStopLoss}
                          onChange={(e) => setNewPortfolioStopLoss(e.target.value)}
                          placeholder="e.g., 5.0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trading Configuration */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Trading Configuration</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="riskProfile">Risk Profile</Label>
                        <Select value={newPortfolioRiskProfile} onValueChange={(value) => setNewPortfolioRiskProfile(value as 'conservative' | 'moderate' | 'aggressive')}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select risk profile" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conservative">Conservative</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="aggressive">Aggressive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tradingMode">Trading Mode</Label>
                        <Select value={newPortfolioIsVirtual ? 'virtual' : 'real'} onValueChange={(value) => setNewPortfolioIsVirtual(value === 'virtual')}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select trading mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="virtual">Virtual Trading</SelectItem>
                            <SelectItem value="real">Real Trading</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Fee Estimation */}
                  {newPortfolioCapital && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Fee Estimation</h4>
                      <Card className="bg-muted/50">
                        <CardContent className="pt-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Alpaca Commission:</span>
                              <span>${calculateEstimatedFees(parseFloat(newPortfolioCapital), parseFloat(newPortfolioInitialBuyIn || '0')).alpacaCommission.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Base Fee:</span>
                              <span>${calculateEstimatedFees(parseFloat(newPortfolioCapital), parseFloat(newPortfolioInitialBuyIn || '0')).alpacaBaseFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Estimated Slippage:</span>
                              <span>${calculateEstimatedFees(parseFloat(newPortfolioCapital), parseFloat(newPortfolioInitialBuyIn || '0')).estimatedSlippage.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium border-t pt-2">
                              <span>Total Estimated Fees:</span>
                              <span>${(calculateEstimatedFees(parseFloat(newPortfolioCapital), parseFloat(newPortfolioInitialBuyIn || '0')).alpacaCommission + calculateEstimatedFees(parseFloat(newPortfolioCapital), parseFloat(newPortfolioInitialBuyIn || '0')).alpacaBaseFee + calculateEstimatedFees(parseFloat(newPortfolioCapital), parseFloat(newPortfolioInitialBuyIn || '0')).estimatedSlippage).toFixed(2)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <Button onClick={createPortfolio} className="w-full" disabled={!newPortfolioName || !newPortfolioCapital}>
                    Create Portfolio
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>        {account && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Buying Power</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${parseFloat(account.buying_power).toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${parseFloat(account.portfolio_value).toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${parseFloat(account.cash).toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Portfolios</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolios.length === 0 ? (
                <p className="text-muted-foreground">No portfolios created yet.</p>
              ) : (
                <div className="space-y-2">
                  {portfolios.map((portfolio) => (
                    <div
                      key={portfolio.id}
                      className={`p-4 border rounded cursor-pointer hover:bg-muted/50 ${
                        selectedPortfolio?.id === portfolio.id ? 'border-primary' : ''
                      }`}
                      onClick={() => selectPortfolio(portfolio)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{portfolio.name}</div>
                        <div className="flex gap-2">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            portfolio.isVirtual
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {portfolio.isVirtual ? 'Virtual' : 'Real'}
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getRiskStatusColor(portfolio)} bg-current bg-opacity-10`}>
                            {getRiskStatusText(portfolio)}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                        <div>Capital: ${portfolio.capital.toFixed(2)}</div>
                        <div>Risk: {portfolio.riskProfile}</div>
                        <div>Max DD: {portfolio.maxDrawdown}%</div>
                        <div>Take Profit: {portfolio.takeProfit}%</div>
                        <div>Stop Loss: {portfolio.stopLoss}%</div>
                        <div>Buy-in: {portfolio.initialBuyIn}%</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div className={portfolio.totalPnL && portfolio.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                          P/L: {(portfolio.totalPnL || 0).toFixed(2)}%
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={portfolio.currentDrawdown && portfolio.currentDrawdown > 0 ? 'text-red-600' : 'text-green-600'}>
                            DD: {(portfolio.currentDrawdown || 0).toFixed(2)}%
                          </span>
                          <div className="flex items-center gap-1 ml-2">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <span className="text-xs">Risk: {getPortfolioRiskScore(portfolio)}/10</span>
                          </div>
                        </div>
                      </div>
                      {portfolio.riskAlerts && portfolio.riskAlerts.length > 0 && (
                        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                          <div className="font-medium text-yellow-800 dark:text-yellow-200">Risk Alerts:</div>
                          {portfolio.riskAlerts.slice(0, 2).map(alert => (
                            <div key={alert.id} className={`mt-1 ${
                              alert.severity === 'high' ? 'text-red-600' :
                              alert.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              • {alert.message}
                            </div>
                          ))}
                          {portfolio.riskAlerts.length > 2 && (
                            <div className="mt-1 text-muted-foreground">
                              +{portfolio.riskAlerts.length - 2} more alerts
                            </div>
                          )}
                        </div>
                      )}
                      <div className="mt-2 text-xs text-muted-foreground">
                        Created: {new Date(portfolio.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPortfolio ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded">
                      <div className="text-sm font-medium">Portfolio Risk Status</div>
                      <div className={`text-lg font-bold ${getRiskStatusColor(selectedPortfolio)}`}>
                        {getRiskStatusText(selectedPortfolio)}
                      </div>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <div className="text-sm font-medium">Current Drawdown</div>
                      <div className={`text-lg font-bold ${(selectedPortfolio.currentDrawdown || 0) > selectedPortfolio.maxDrawdown * 0.8 ? 'text-red-600' : 'text-green-600'}`}>
                        {(selectedPortfolio.currentDrawdown || 0).toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded">
                      <div className="text-sm font-medium">Total P/L</div>
                      <div className={`text-lg font-bold ${(selectedPortfolio.totalPnL || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(selectedPortfolio.totalPnL || 0).toFixed(2)}%
                      </div>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <div className="text-sm font-medium">Risk Profile</div>
                      <div className="text-lg font-bold capitalize">{selectedPortfolio.riskProfile}</div>
                    </div>
                  </div>

                  {selectedPortfolio.riskAlerts && selectedPortfolio.riskAlerts.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Active Risk Alerts</h4>
                      {selectedPortfolio.riskAlerts.map(alert => (
                        <div key={alert.id} className={`p-3 rounded border-l-4 ${
                          alert.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                          alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                          'border-green-500 bg-green-50 dark:bg-green-900/20'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium capitalize">{alert.type.replace('_', ' ')}</div>
                              <div className="text-sm text-muted-foreground">{alert.message}</div>
                              {alert.position && (
                                <div className="text-sm font-medium mt-1">Position: {alert.position}</div>
                              )}
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                              alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {alert.severity.toUpperCase()}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {new Date(alert.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Risk Recommendations */}
                  {(() => {
                    const recommendations = getRiskBasedRecommendations(selectedPortfolio, positions);
                    return recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Risk-Based Recommendations</h4>
                        {recommendations.map((rec, index) => (
                          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                            <div className="text-sm text-blue-800 dark:text-blue-200">{rec}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {(!selectedPortfolio.riskAlerts || selectedPortfolio.riskAlerts.length === 0) && getRiskBasedRecommendations(selectedPortfolio, positions).length === 0 && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <div className="text-green-800 dark:text-green-200 font-medium">✅ All Risk Parameters Within Limits</div>
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Portfolio is operating within safe risk boundaries.
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Select a portfolio to view risk monitoring details.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
