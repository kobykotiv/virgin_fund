import { z } from "zod";

/**
 * Ensures a value is safe to store as JSON by removing any non-serializable data
 */
export function ensureJsonSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export interface ExecutionHistoryRecord {
  timestamp: string;
  action: 'BUY' | 'SELL';
  amount: number;
  status: 'success' | 'failed';
  orderId?: string;
  filledQty?: number;
  filledPrice?: number;
  error?: string;
}

// Zod schema for validating execution records
export const executionHistoryRecordSchema = z.object({
  timestamp: z.string(),
  action: z.enum(['BUY', 'SELL']),
  amount: z.number(),
  status: z.enum(['success', 'failed']),
  orderId: z.string().optional(),
  filledQty: z.number().optional(),
  filledPrice: z.number().optional(),
  error: z.string().optional()
});

/**
 * Validates that a value is an array of ExecutionHistoryRecord
 */
export function isExecutionHistoryArray(value: unknown): value is ExecutionHistoryRecord[] {
  return Array.isArray(value) && value.every(item => 
    typeof item === 'object' && item !== null &&
    typeof (item as any).timestamp === 'string' &&
    ['BUY', 'SELL'].includes((item as any).action) &&
    typeof (item as any).amount === 'number' &&
    ['success', 'failed'].includes((item as any).status)
  );
}

/**
 * Validates an execution record using zod schema
 */
export function validateExecutionRecord(record: unknown): record is ExecutionHistoryRecord {
  const result = executionHistoryRecordSchema.safeParse(record);
  return result.success;
}
