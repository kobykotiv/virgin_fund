import React from "react";

type Props = {
  data?: any[];
  className?: string;
};

/**
 * Minimal stub for PortfolioChartOverlay used by imports/tests.
 * Real implementation lives elsewhere; this stub keeps tsc/tests happy.
 */
export const PortfolioChartOverlay: React.FC<Props> = ({ data = [], className }) => {
  return (
    <div className={className ?? ""} data-testid="portfolio-chart-overlay">
      {/* Overlay stub - real implementation omitted for tests */}
      <svg width="1" height="1" />
    </div>
  );
};

export default PortfolioChartOverlay;
