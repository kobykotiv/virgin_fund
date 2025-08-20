import { OrderForm } from "./trading/OrderForm";

// Minimalist TradingPanel for dashboard layout

export default function TradingPanel() {
  return (
    <aside className="w-full border-t p-4 bg-background">
      <div className="p-2">
        <h2 className="text-lg font-semibold mb-2">Trade</h2>
        <OrderForm />
      </div>
    </aside>
  );
}
