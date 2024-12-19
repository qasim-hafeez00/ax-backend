"use client"

import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getRealTimeData } from '@/lib/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

type DashboardData = {
  orders: number[]
  revenue: number[]
  traffic: number[]
  labels: string[]
}

export function RealTimeDashboard({ userId, isSeller }: { userId: string; isSeller: boolean }) {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    orders: [],
    revenue: [],
    traffic: [],
    labels: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRealTimeData(userId, isSeller)
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to fetch real-time data:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [userId, isSeller])

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            options={chartOptions}
            data={{
              labels: dashboardData.labels,
              datasets: [
                {
                  label: 'Orders',
                  data: dashboardData.orders,
                  borderColor: 'rgb(53, 162, 235)',
                  backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
              ],
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            options={chartOptions}
            data={{
              labels: dashboardData.labels,
              datasets: [
                {
                  label: 'Revenue',
                  data: dashboardData.revenue,
                  borderColor: 'rgb(75, 192, 192)',
                  backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
              ],
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            options={chartOptions}
            data={{
              labels: dashboardData.labels,
              datasets: [
                {
                  label: 'Traffic',
                  data: dashboardData.traffic,
                  borderColor: 'rgb(255, 99, 132)',
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
              ],
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

