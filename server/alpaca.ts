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

interface AlpacaCredentials {
  apiKey: string;
  apiSecret: string;
}

interface OrderParams extends AlpacaCredentials {
  orderId: string;
}

interface CalendarParams extends AlpacaCredentials {
  start: string;
  end: string;
}

export async function getPositions({ apiKey, apiSecret }: AlpacaCredentials) {
  const res = await axios.get(`${BASE_URL}/positions`, {
    headers: {
      'APCA-API-KEY-ID': apiKey,
      'APCA-API-SECRET-KEY': apiSecret,
    },
  });
  return res.data;
}

export async function getOrders({ apiKey, apiSecret }: AlpacaCredentials) {
  const res = await axios.get(`${BASE_URL}/orders`, {
    headers: {
      'APCA-API-KEY-ID': apiKey,
      'APCA-API-SECRET-KEY': apiSecret,
    },
  });
  return res.data;
}

export async function getOrderById({ orderId, apiKey, apiSecret }: OrderParams) {
  const res = await axios.get(`${BASE_URL}/orders/${orderId}`, {
    headers: {
      'APCA-API-KEY-ID': apiKey,
      'APCA-API-SECRET-KEY': apiSecret,
    },
  });
  return res.data;
}

export async function cancelOrder({ orderId, apiKey, apiSecret }: OrderParams) {
  const res = await axios.delete(`${BASE_URL}/orders/${orderId}`, {
    headers: {
      'APCA-API-KEY-ID': apiKey,
      'APCA-API-SECRET-KEY': apiSecret,
    },
  });
  return res.data;
}

export async function getAssets({ apiKey, apiSecret }: AlpacaCredentials) {
  const res = await axios.get(`${BASE_URL}/assets`, {
    headers: {
      'APCA-API-KEY-ID': apiKey,
      'APCA-API-SECRET-KEY': apiSecret,
    },
  });
  return res.data;
}

export async function getMarketClock({ apiKey, apiSecret }: AlpacaCredentials) {
  const res = await axios.get(`${BASE_URL}/clock`, {
    headers: {
      'APCA-API-KEY-ID': apiKey,
      'APCA-API-SECRET-KEY': apiSecret,
    },
  });
  return res.data;
}

export async function getCalendar({ start, end, apiKey, apiSecret }: CalendarParams) {
  const res = await axios.get(`${BASE_URL}/calendar`, {
    params: { start, end },
    headers: {
      'APCA-API-KEY-ID': apiKey,
      'APCA-API-SECRET-KEY': apiSecret,
    },
  });
  return res.data;
}
