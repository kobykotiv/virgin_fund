import { Line } from 'react-chartjs-2';

export const EmptyLineGraph = () => {
  const emptyData = {
    labels: Array(7).fill(''),
    datasets: [{
      data: Array(7).fill(null),
      borderColor: '#e5e7eb',
      borderDashed: [5, 5],
      tension: 0.4
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    },
    interaction: {
      enabled: false
    }
  };

  return (
    <div className="relative min-h-[200px] flex items-center justify-center">
      <Line data={emptyData} options={options} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-gray-400">No data available</span>
      </div>
    </div>
  );
};
