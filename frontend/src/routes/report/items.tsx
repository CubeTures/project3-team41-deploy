import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { API_URL } from "@/lib/constants"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'


// components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface TopItem {
  item: string
  times_ordered: number
}


export const Route = createFileRoute('/report/items')({
  component: RouteComponent,
})



function RouteComponent() {
  const [data, setData] = useState<TopItem[]>([])

  useEffect(() => {
    fetch(`${API_URL}/report/TopItems`)
      .then(res => res.json())
      .then(data => setData(data))
  }, [])

  const chartData = {
    labels: data.map(item => item.item),
    datasets: [
      {
        label: 'Times Ordered',
        data: data.map(item => item.times_ordered),
        backgroundColor: 'rgba(136, 132, 216, 0.8)',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Times Ordered'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Item Names'
        }
      }
    }
  }


  return (
    <div className="px-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Top Selling Items</h1>
      <div className="w-full h-[500px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}