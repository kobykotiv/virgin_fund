import { useState, useCallback } from 'react';
import { Bot, BotStatus } from '@/types/bot';
import { useToast } from '@/components/ui/use-toast';

export function useBots() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchBots = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bots');
      if (!response.ok) throw new Error('Failed to fetch bots');
      const data = await response.json();
      setBots(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch bots',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createBot = useCallback(async (botData: Partial<Bot>) => {
    try {
      setLoading(true);
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(botData),
      });
      if (!response.ok) throw new Error('Failed to create bot');
      const bot = await response.json();
      setBots(prev => [...prev, bot]);
      return bot;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create bot',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateBot = useCallback(async (id: string, updates: Partial<Bot>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bots/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update bot');
      const updatedBot = await response.json();
      setBots(prev => prev.map(bot => bot.id === id ? updatedBot : bot));
      return updatedBot;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update bot',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteBot = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bots/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete bot');
      setBots(prev => prev.filter(bot => bot.id !== id));
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete bot',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const toggleBotStatus = useCallback(async (id: string, status: BotStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bots/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update bot status');
      const updatedBot = await response.json();
      setBots(prev => prev.map(bot => bot.id === id ? updatedBot : bot));
      return updatedBot;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update bot status',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    bots,
    loading,
    fetchBots,
    createBot,
    updateBot,
    deleteBot,
    toggleBotStatus,
  };
}