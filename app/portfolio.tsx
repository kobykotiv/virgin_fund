import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';
import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <AppLayout>
        <Card>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading account...</div>
          </div>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Card>
        <h1 className="text-2xl font-bold mb-2">Portfolio</h1>
        <div className="text-muted">Charts for asset allocation, PnL, ROI.</div>
        {/* Chart placeholder */}
        <div className="mt-4 h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center text-muted">TradingView-style chart stub</div>
      </Card>
    </AppLayout>
  );
}
