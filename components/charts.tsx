"use client"

import { Line, Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
)

export function LineChart({ 
  data, 
  showGrid = false, 
  showTooltip = false,
  colorOverride = undefined
}: { 
  data: number[],
  showGrid?: boolean,
  showTooltip?: boolean,
  colorOverride?: string
}) {
  const chartData = {
    labels: data.map((_, i) => i.toString()),
    datasets: [
      {
        data,
        borderColor: colorOverride || 'hsl(var(--primary))',
        backgroundColor: colorOverride ? `${colorOverride}10` : 'hsl(var(--primary) / 0.1)',
        tension: 0.4,
        pointRadius: showTooltip ? 2 : 0,
        pointHoverRadius: showTooltip ? 5 : 0,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: { enabled: showTooltip }
    },
    scales: { 
      x: { 
        display: showGrid,
        grid: {
          display: showGrid,
        }
      }, 
      y: { 
        display: showGrid,
        grid: {
          display: showGrid,
        }
      } 
    },
  }

  return <Line data={chartData} options={options} />
}

export function PieChart({ data, showLegend = false }: { data: Record<string, number>, showLegend?: boolean }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          'hsl(var(--primary))',
          'hsl(var(--secondary))',
          'hsl(var(--accent))',
          'hsl(var(--destructive))',
          'hsl(var(--success))',
          'hsl(var(--warning))',
        ],
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: showLegend,
        position: 'bottom' as const
      } 
    },
  }

  return <Pie data={chartData} options={options} />
}

export function BarChart({ 
  data 
}: { 
  data: { 
    labels: string[], 
    values: number[] 
  } 
}) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: data.values.map(value => 
          value >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'
        ),
        borderColor: data.values.map(value => 
          value >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'
        ),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return <Bar data={chartData} options={options} />
}
