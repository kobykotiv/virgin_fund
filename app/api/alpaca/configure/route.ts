import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { keyId, secretKey, baseUrl } = await request.json()

    if (!keyId || !secretKey) {
      return NextResponse.json({ message: "Key ID and Secret Key are required" }, { status: 400 })
    }

    // Validate the API keys by attempting to fetch account information
    const response = await fetch(`${baseUrl}/v2/account`, {
      headers: {
        'APCA-API-KEY-ID': keyId,
        'APCA-API-SECRET-KEY': secretKey
      }
    })

    if (!response.ok) {
      return NextResponse.json({ 
        success: false,
        message: "Invalid API keys. Please check your credentials." 
      }, { status: 401 })
    }

    const accountData = await response.json()

    // Return account information along with success message
    return NextResponse.json({
      success: true,
      message: "API keys configured successfully",
      account: {
        id: accountData.id,
        status: accountData.status,
        currency: accountData.currency,
        buying_power: accountData.buying_power,
        cash: accountData.cash,
        portfolio_value: accountData.portfolio_value,
        trading_blocked: accountData.trading_blocked,
        pattern_day_trader: accountData.pattern_day_trader
      }
    })
  } catch (error) {
    console.error("Error configuring API keys:", error)
    return NextResponse.json({ 
      success: false,
      message: "Failed to configure API keys. Please try again." 
    }, { status: 500 })
  }
}

