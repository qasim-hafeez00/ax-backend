import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, Line } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend)

export function AdminAnalytics({ report }) {
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 3000, 5000, 2000, 3000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [50, 60, 70, 80, 90, 100],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={revenueData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={userGrowthData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span>Total Revenue:</span>
              <span className="font-bold">${report.totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Orders:</span>
              <span className="font-bold">{report.totalOrders}</span>
            </div>
            <div className="flex justify-between">
              <span>New Users:</span>
              <span className="font-bold">{report.newUsers}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Order Value:</span>
              <span className="font-bold">${(report.totalRevenue / report.totalOrders).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

