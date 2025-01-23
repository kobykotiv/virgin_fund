import { ChartDataset } from "chart.js";

export interface ChartDatasetWithBorderDash extends ChartDataset<"line", number[]> {
  borderDash?: number[];
  yAxisID?: string;
}

export interface ChartDatasetWithBorderDashAndYAxis extends ChartDatasetWithBorderDash {
  yAxisID?: string;
}
