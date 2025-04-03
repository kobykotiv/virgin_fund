/**
 * API utilities for interacting with backend services
 */

interface Bot {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'stopped';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get a bot by its ID
 */
export async function getBotById(id: string): Promise<Bot | null> {
  try {
    // This would normally fetch from an API or database
    // For now it's a placeholder that returns mock data
    const mockBot: Bot = {
      id,
      name: `Bot ${id}`,
      description: 'This is a sample bot description',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return mockBot;
  } catch (error) {
    console.error('Failed to fetch bot:', error);
    return null;
  }
}
