// import React from 'react';
import { Link } from 'react-router-dom';
import { Strategy } from '../types';
import { ArrowUpRight, Calendar, DollarSign, Repeat, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';

interface Props {
  strategies: Strategy[];
}

export function StrategyList({ strategies }: Props) {
  return (
    <div className="space-y-4">
      {strategies.map((strategy) => (
        <Card key={strategy.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                {strategy.name}
                {/* Mock performance indicator */}
                {Math.random() > 0.5 ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
              </CardTitle>
              <Button variant="ghost" asChild>
                <Link to={`/strategy/${strategy.id}`} className="flex items-center">
                  <span className="hidden sm:block mr-2">View Details</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center text-sm">
                <DollarSign className="w-4 h-4 mr-2 text-primary" />
                <div>
                  <p className="text-muted-foreground">Investment</p>
                  <p className="font-medium">${strategy.initial_investment.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Repeat className="w-4 h-4 mr-2 text-primary" />
                <div>
                  <p className="text-muted-foreground">Frequency</p>
                  <p className="font-medium capitalize">{strategy.frequency}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                <div>
                  <p className="text-muted-foreground">Started</p>
                  <p className="font-medium">{new Date(strategy.start_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Mock performance chart */}
            <div className="mt-4 h-16">
              <div className="w-full h-full bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}