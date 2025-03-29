export interface Index {
  _id: string
  name: string
  description?: string
  components: {
    asset: string
    weight: number
    criteria?: {
      field: string
      operator: '>' | '<' | '>=' | '<=' | '==' | '!='
      value: number
    }[]
  }[]
  rebalancePeriod: string // Cron expression
  lastRebalanced?: Date
  createdAt: Date
  updatedAt: Date
  performance?: {
    daily: number
    weekly: number
    monthly: number
    yearly: number
    sinceCeption: number
  }
  metadata?: Record<string, any>
}