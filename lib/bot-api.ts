import { Bot } from "@/app/(dashboard)/bots/page";

export async function createBot(botData: Omit<Bot, 'id'>) {
  const response = await fetch('/api/bots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(botData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create bot');
  }

  return response.json();
}

export async function updateBot(id: string, botData: Partial<Bot>) {
  const response = await fetch(`/api/bots/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(botData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update bot');
  }

  return response.json();
}

export async function deleteBot(id: string) {
  const response = await fetch(`/api/bots/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete bot');
  }

  return response.json();
}

export async function toggleBotStatus(id: string, active: boolean) {
  const response = await fetch(`/api/bots/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update bot status');
  }

  return response.json();
}

export async function getBots() {
  const response = await fetch('/api/bots');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch bots');
  }

  return response.json();
}

export async function getBot(id: string) {
  const response = await fetch(`/api/bots/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch bot');
  }

  return response.json();
}
