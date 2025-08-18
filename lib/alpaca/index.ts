import { AlpacaAdapter } from './adapter';
import { MockAdapter } from './mockAdapter';
import { AlpacaAdapterImpl } from './alpacaAdapter';

const MODE = process.env.NEXT_PUBLIC_ALPACA_MODE || process.env.ALPACA_MODE || 'mock';

let adapter: AlpacaAdapter;
if (MODE === 'mock') {
  adapter = new MockAdapter();
} else {
  adapter = new AlpacaAdapterImpl();
}

export default adapter;
