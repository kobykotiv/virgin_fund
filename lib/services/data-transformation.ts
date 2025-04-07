import { DatabaseType } from '../auth/types'

export class DataTransformationService {
  async transformMarketData(data: any, targetType: DatabaseType) {
    return targetType === 'sql' ? 
      this.transformForSQL(data) : 
      this.transformForNoSQL(data)
  }

  private transformForSQL(data: any) {
    return {
      symbol: data.symbol,
      timestamp: new Date(data.t),
      open: data.o,
      high: data.h,
      low: data.l,
      close: data.c,
      volume: data.v,
      vwap: data.vw || null,
      trade_count: data.n || null
    }
  }

  private transformForNoSQL(data: any) {
    return {
      symbol: data.symbol,
      data: {
        t: new Date(data.t),
        o: data.o,
        h: data.h,
        l: data.l,
        c: data.c,
        v: data.v,
        vw: data.vw,
        n: data.n
      },
      metadata: {
        source: data.source,
        processed: new Date()
      }
    }
  }

  async transformBatch(dataArray: any[], targetType: DatabaseType) {
    return Promise.all(
      dataArray.map(data => this.transformMarketData(data, targetType))
    )
  }
}

export class DataTransformationPipeline {
  private transformers: Map<string, (data: any) => any> = new Map()

  constructor() {
    this.registerDefaultTransformers()
  }

  private registerDefaultTransformers() {
    this.transformers.set('sql', this.transformForSQL)
    this.transformers.set('nosql', this.transformForNoSQL)
  }

  async transform(data: any, targetType: string): Promise<any> {
    const transformer = this.transformers.get(targetType)
    if (!transformer) throw new Error(`No transformer found for type: ${targetType}`)
    
    return transformer(data)
  }

  private transformForSQL(data: any) {
    return {
      id: data._id,
      symbol: data.symbol,
      timestamp: new Date(data.timestamp),
      open: parseFloat(data.open),
      high: parseFloat(data.high),
      low: parseFloat(data.low),
      close: parseFloat(data.close),
      volume: parseInt(data.volume),
      created_at: new Date(),
      updated_at: new Date()
    }
  }

  private transformForNoSQL(data: any) {
    return {
      _id: data.id || data._id,
      symbol: data.symbol,
      data: {
        t: new Date(data.timestamp),
        o: data.open,
        h: data.high,
        l: data.low,
        c: data.close,
        v: data.volume
      },
      metadata: {
        source: data.source,
        processed: new Date()
      }
    }
  }
}
