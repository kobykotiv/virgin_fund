import { ImageResponse } from 'next/og'
import { portfolios } from '@/lib/demo-portfolios'
 
export const runtime = 'edge'
 
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get('id')
 
    const portfolio = portfolios.find(p => p.id === portfolioId)
    if (!portfolio) {
      return new Response('Portfolio not found', { status: 404 })
    }

    // Create historical data points for the sparkline
    const points = portfolio.historicalData?.map(d => d.value) || []
    const max = Math.max(...points)
    const min = Math.min(...points)
    const range = max - min
    
    // Normalize points to 0-100 range for drawing
    const normalizedPoints = points.map(p => 100 - ((p - min) / range) * 100)
    
    // Create SVG path for sparkline
    const width = 600
    const height = 200
    const pointsPerPixel = normalizedPoints.length / width
    const path = normalizedPoints.reduce((acc, point, i) => {
      const x = (i / pointsPerPixel).toFixed(2)
      const y = point.toFixed(2)
      return acc + (i === 0 ? `M ${x},${y}` : ` L ${x},${y}`)
    }, '')

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(to bottom right, #1a1b1e, #2d2e33)',
            width: '1200',
            height: '630',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          {/* Portfolio Header */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            marginBottom: '40px',
            color: 'white'
          }}>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              {portfolio.name}
            </h1>
            <p style={{ 
              fontSize: '24px',
              color: '#94a3b8'
            }}>
              {portfolio.focus}
            </p>
          </div>

          {/* Performance Graph */}
          <div style={{
            width: '800px',
            height: '300px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '20px',
            position: 'relative'
          }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
              <path
                d={path}
                stroke={portfolio.return.startsWith('+') ? '#22c55e' : '#ef4444'}
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>

          {/* Portfolio Stats */}
          <div style={{
            display: 'flex',
            gap: '40px',
            marginTop: '40px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <p style={{ color: '#94a3b8', fontSize: '20px' }}>Value</p>
              <p style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>
                {portfolio.value}
              </p>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <p style={{ color: '#94a3b8', fontSize: '20px' }}>Return</p>
              <p style={{ 
                color: portfolio.return.startsWith('+') ? '#22c55e' : '#ef4444', 
                fontSize: '32px', 
                fontWeight: 'bold' 
              }}>
                {portfolio.return}
              </p>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <p style={{ color: '#94a3b8', fontSize: '20px' }}>Risk</p>
              <p style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>
                {portfolio.risk}
              </p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e) {
    console.error(e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
