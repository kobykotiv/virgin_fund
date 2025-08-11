// Alpaca API integration
import axios from 'axios';

const BASE_URL = 'https://paper-api.alpaca.markets/v2';

export async function placeOrder({ symbol, qty, side, type, time_in_force, apiKey, apiSecret }) {
  const res = await axios.post(
    `${BASE_URL}/orders`,
    { symbol, qty, side, type, time_in_force },
    {
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': apiSecret,
      },
    }
  );
  return res.data;
}

export async function getAccount({ apiKey, apiSecret }) {
  const res = await axios.get(`${BASE_URL}/account`, {
    headers: {
      'APCA-API-KEY-ID': apiKey,
      'APCA-API-SECRET-KEY': apiSecret,
    },
  });
  return res.data;
}
