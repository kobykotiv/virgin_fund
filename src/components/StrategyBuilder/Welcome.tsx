// import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, ArrowRight } from 'lucide-react';

interface WelcomeProps {
  onNext: () => void;
}

export function Welcome({ onNext }: WelcomeProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-primary" />
          <div>
            <CardTitle>Welcome to Strategy Builder</CardTitle>
            <CardDescription>Create your personalized investment strategy in 4 simple steps</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <Clock className="w-5 h-5 mt-1 text-muted-foreground" />
          <div>
            <h3 className="font-medium">Estimated Time: 5-10 minutes</h3>
            <p className="text-sm text-muted-foreground">
              Take your time to carefully consider each step. Your progress will be saved automatically.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">What you'll do:</h3>
          <ol className="space-y-3 list-decimal list-inside text-sm">
            <li>Select assets for your portfolio (stocks, ETFs, etc.)</li>
            <li>Choose your strategy type and customize parameters</li>
            <li>Add technical indicators for better timing</li>
            <li>Set up risk management rules</li>
          </ol>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">What is a trading strategy?</h3>
          <p className="text-sm text-muted-foreground">
            A trading strategy is a systematic approach to buying and selling assets. It defines what to buy,
            when to buy, and how much to invest. A well-defined strategy helps remove emotion from trading
            and provides clear rules to follow.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onNext} className="w-full">
          Let's Get Started
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}