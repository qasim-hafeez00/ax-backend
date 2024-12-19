"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserList } from "@/components/admin/user-list"
import { TransactionList } from "@/components/admin/transaction-list"
import { AdminAnalytics } from "@/components/admin/admin-analytics"
import { getAllUsers, getFlaggedTransactions, generatePlatformReport } from "@/lib/api"

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([])
  const [flaggedTransactions, setFlaggedTransactions] = useState([])
  const [report, setReport] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, transactionsResponse, reportResponse] = await Promise.all([
          getAllUsers(),
          getFlaggedTransactions(),
          generatePlatformReport(new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0])
        ])
        setUsers(usersResponse.data)
        setFlaggedTransactions(transactionsResponse.data)
        setReport(reportResponse.data)
      } catch (error) {
        console.error("Failed to fetch admin data:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{users.length}</p>
                <Button className="mt-4" onClick={() => document.querySelector('[data-value="users"]')?.click()}>Manage Users</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Flagged Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{flaggedTransactions.length}</p>
                <Button className="mt-4" onClick={() => document.querySelector('[data-value="transactions"]')?.click()}>Review Transactions</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Platform Report</CardTitle>
              </CardHeader>
              <CardContent>
                {report && (
                  <>
                    <p>New Users: {report.newUsers}</p>
                    <p>Total Orders: {report.totalOrders}</p>
                    <p>Total Revenue: US ${report.totalRevenue.toFixed(2)}</p>
                  </>
                )}
                <Button className="mt-4" onClick={() => document.querySelector('[data-value="analytics"]')?.click()}>View Detailed Report</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="users">
          <UserList users={users} />
        </TabsContent>
        <TabsContent value="transactions">
          <TransactionList transactions={flaggedTransactions} />
        </TabsContent>
        <TabsContent value="analytics">
          <AdminAnalytics report={report} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

