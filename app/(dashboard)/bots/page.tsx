"use client";

import { useState, useEffect } from 'react';
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
// We will create BotList and BotForm components next
import BotList from '@/components/bot-list'; // Corrected import for default export
import BotForm from '@/components/bot-form'; // Import BotForm
import { Skeleton } from '@/components/ui/skeleton';

// Define a basic Bot type for now, refine later based on actual data
export interface Bot {
  id: string;
  name: string;
  type: string;
  status: string;
  active: boolean;
  createdAt: string;
  strategy?: string; // Added strategy field
  settings?: any; // Added settings field (optional for now)
  description?: string | null; // Added optional description field
  // Add other relevant fields later
}


export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [editingBot, setEditingBot] = useState<Bot | null>(null); // State for editing

  const fetchBots = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/bots');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch bots');
      }
      const data: Bot[] = await response.json();
      setBots(data);
    } catch (err) {
      console.error("Error fetching bots:", err);
      setError(err instanceof Error ? err.message : "Could not load bots.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const handleFormSubmit = () => {
    // After form submission (create or update), close form and refresh list
    setShowForm(false);
    setEditingBot(null);
    fetchBots(); 
  };

  const handleEdit = (bot: Bot) => {
    setEditingBot(bot);
    setShowForm(true);
  };
  
  const handleDelete = async (botId: string) => {
     if (!confirm('Are you sure you want to delete this bot?')) {
       return;
     }
     try {
       const response = await fetch(`/api/bots/${botId}`, { method: 'DELETE' });
       if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || 'Failed to delete bot');
       }
       fetchBots(); // Refresh list after delete
       // Add toast notification for success
     } catch (err) {
       console.error("Error deleting bot:", err);
       // Add toast notification for error
     }
  };
  
   const handleToggleStatus = async (bot: Bot) => {
     try {
       const response = await fetch(`/api/bots/${bot.id}/status`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ active: !bot.active }), // Send the desired new state
       });
       if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || 'Failed to toggle bot status');
       }
       fetchBots(); // Refresh list
       // Add toast notification
     } catch (err) {
       console.error("Error toggling bot status:", err);
       // Add toast notification for error
     }
   };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Trading Bots"
        text="Create, manage, and monitor your automated trading strategies."
      >
        <Button onClick={() => { setEditingBot(null); setShowForm(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Bot
        </Button>
      </DashboardHeader>
      
      {/* Conditional rendering for the form */}
      {showForm && (
        <div className="mb-6">
          <BotForm
            bot={editingBot}
            onSuccess={handleFormSubmit}
            onCancel={() => { setShowForm(false); setEditingBot(null); }}
            availableAssets={[
              'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA',
              'BTC/USD', 'ETH/USD', 'SOL/USD'
            ]}
            botTypes={[
              { value: "dca", label: "DCA" },
              { value: "grid", label: "Grid Trading" },
              { value: "indicator", label: "Indicator" },
              { value: "basket", label: "Basket" },
            ]}
          />
        </div>
      )}

      {/* Display area for the list of bots */}
      <div className="grid gap-6">
        {isLoading && (
           // Simple skeleton loader for the list area
           <div className="space-y-4">
             <Skeleton className="h-20 w-full" />
             <Skeleton className="h-20 w-full" />
             <Skeleton className="h-20 w-full" />
           </div>
        )}
        {error && <p className="text-red-500">Error loading bots: {error}</p>}
        {!isLoading && !error && (
          bots.length > 0 ? (
            // Uncommented BotList usage
             <BotList 
               bots={bots} 
               onEdit={handleEdit} 
               onDelete={handleDelete}
               onToggleStatus={handleToggleStatus} // Keep this prop
             /> 
          ) : (
            <div className="text-center py-10 border border-dashed rounded-lg">
              <p className="text-muted-foreground">You haven't created any bots yet.</p>
              <Button 
                 variant="link" 
                 className="mt-2" 
                 onClick={() => { setEditingBot(null); setShowForm(true); }}
              >
                 Create your first bot
              </Button>
            </div>
          )
        )}
      </div>
    </DashboardShell>
  );
}
