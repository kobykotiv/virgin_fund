import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function errorHandler(
  request: NextRequest,
  response: NextResponse,
  error: Error
) {
  // Log error to monitoring service
  console.error('API Error:', error)

  // Classify error types
  if (error.name === 'ValidationError') {
    return new NextResponse(JSON.stringify({
      error: 'Validation Error',
      details: error.message
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (error.name === 'TradeExecutionError') {
    return new NextResponse(JSON.stringify({
      error: 'Trade Execution Failed',
      details: error.message
    }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (error.name === 'RateLimitError') {
    return new NextResponse(JSON.stringify({
      error: 'Rate Limit Exceeded',
      details: error.message
    }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Default error response
  return new NextResponse(JSON.stringify({
    error: 'Internal Server Error',
    requestId: request.headers.get('x-request-id')
  }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  })
}

export class TradeExecutionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TradeExecutionError'
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RateLimitError'
  }
}
