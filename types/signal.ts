/**
 * Signal domain types for the Signal Builder feature.
 *
 * These types are intentionally compact and suitable for localStorage persistence
 * as well as future server-sync. Adjust or extend fields (ownerId, botId, tags)
 * later if you want additional metadata.
 */

/** Comparison operator used to evaluate a numeric threshold against a value. */
export type ComparisonOperator = '>' | '<' | '>=' | '<=' | '=';

/** High-level condition source for the signal. */
export type ConditionType = 'price' | 'indicator' | 'volume';

/** Signal lifecycle/status. */
export type SignalStatus = 'active' | 'paused' | 'inactive';

/**
 * Main Signal model.
 *
 * - id: stable unique id (uuid recommended)
 * - name: human readable
 * - symbol: uppercase market symbol (e.g. "AAPL")
 * - conditionType: what kind of condition (price / indicator / volume)
 * - operator / threshold / timeWindow: core rule definition
 * - status: whether the signal is active
 * - createdAt / updatedAt: ISO date strings
 * - lastTriggered*: optional runtime metadata (used in history & table)
 */
export interface Signal {
  id: string;
  name: string;
  symbol: string;
  conditionType: ConditionType;
  operator: ComparisonOperator;
  threshold: number;
  timeWindow: number;
  description?: string;
  status: SignalStatus;
  createdAt: string;
  updatedAt?: string;
  lastTriggeredAt?: string;
  lastTriggeredValue?: number;
  // Optional metadata for future integration
  ownerId?: string;
  botId?: string | null;
  tags?: string[];
}

/**
 * Values used by the Create / Edit form (react-hook-form).
 * Note: numeric inputs may come in as strings from HTML input, conversion handled in code.
 */
export interface SignalFormValues {
  name: string;
  symbol: string;
  conditionType: ConditionType;
  operator: ComparisonOperator;
  threshold: number | string;
  timeWindow: number | string;
  description?: string;
}

/** Row in the signal history table. */
export interface SignalHistoryRow {
  id: string;
  signalId: string;
  signalName: string;
  symbol: string;
  triggeredAt: string; // ISO date string
  triggeredValue: number;
  actionTaken?: string; // e.g. "Alert sent", "Order placed", etc.
}
