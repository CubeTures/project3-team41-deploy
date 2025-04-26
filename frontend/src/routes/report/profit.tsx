import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { API_URL } from "@/lib/constants"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { CalendarDaysIcon } from '@heroicons/react/24/solid'

// components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

interface ProfitData {
  date: string
  cumulative_profit: number
}

export const Route = createFileRoute('/report/profit')({
  component: RouteComponent,
})

function RouteComponent() {
  const [data, setData] = useState<ProfitData[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (startDate && endDate) {
      fetch(`${API_URL}/report/SalesOverTime`)
        .then(res => res.json())
        .then(data => {
          // bound by date range
          const filteredData = data.filter((item: ProfitData) => {
            const itemDate = new Date(item.date).toISOString().split('T')[0]
            return itemDate >= startDate && itemDate <= endDate
          })
          setData(filteredData)
        })
    }
  }, [startDate, endDate])

  const chartData = {
    labels: data.map(item => item.date.split('T')[0]), // yyyy-MM-dd
    datasets: [
      {
        label: 'Cumulative Profit',
        data: data.map(item => item.cumulative_profit),
        borderColor: 'rgba(75, 192, 192, 0.8)',
        fill: false,
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
        title: {
          display: true,
          text: 'Cumulative Profit'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Dates'
        }
      }
    }
  }

  return (
    <div className="px-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Profit Over Time</h1>


      <div className="flex gap-2 items-center">
        {/* start date */}
        <div className="flex items-center border rounded p-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            className="border-none focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [&::-webkit-datetime-edit-text]:hidden appearance-none"
            style={{ WebkitAppearance: 'none' }}
            id="start-date"
            readOnly
          />
          <button
            onClick={() => {
              const input = document.getElementById('start-date') as HTMLInputElement;
              input?.showPicker();
            }}
            className="p-1 cursor-pointer"
          >
            <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* end date */}
        <div className="flex items-center border rounded p-2">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            className="border-none focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [&::-webkit-datetime-edit-text]:hidden appearance-none"
            style={{ WebkitAppearance: 'none' }}
            id="end-date"
            readOnly
          />
          <button
            onClick={() => {
              const input = document.getElementById('end-date') as HTMLInputElement;
              input?.showPicker();
            }}
            className="p-1 cursor-pointer"
          >
            <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>



      <div className="w-full h-[500px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
