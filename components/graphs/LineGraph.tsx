import { EmptyLineGraph } from './EmptyLineGraph';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

interface LineGraphProps {
  data: any;
  options?: ChartOptions;
}

export const LineGraph = ({ data, ...props }: LineGraphProps) => {
  if (!data || !data.datasets || !data.datasets[0]?.data?.length) {
    return <EmptyLineGraph />;
  }

  return <Line data={data} {...props} />;
};