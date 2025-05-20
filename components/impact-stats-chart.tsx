"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedSection } from "@/components/animated-section"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

type ImpactStat = {
  id: string
  label: string
  value: string
  description?: string
  order_index: number
  active: boolean
}

interface ImpactStatsChartProps {
  stats: ImpactStat[]
}

export function ImpactStatsChart({ stats }: ImpactStatsChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  // Process data for charts
  useEffect(() => {
    if (!stats || !stats.length) return

    // Extract numeric values from stats
    const processedStats = stats.map((stat) => {
      // Remove non-numeric characters and convert to number
      const numericValue = Number.parseFloat(stat.value.replace(/[^0-9.]/g, ""))
      return {
        name: stat.label,
        value: isNaN(numericValue) ? 0 : numericValue,
        displayValue: stat.value, // Keep the original formatted value for display
      }
    })

    setChartData(processedStats)
  }, [stats])

  // Colors for the charts
  const COLORS = [
    "#3B82F6", // blue
    "#10B981", // green
    "#F97316", // orange
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#06B6D4", // cyan
    "#EAB308", // yellow
    "#EF4444", // red
  ]

  if (!stats || !stats.length) {
    return null
  }

  return (
    <AnimatedSection>
      <Card>
        <CardHeader>
          <CardTitle>Impact Visualization</CardTitle>
          <CardDescription>Visual representation of our impact statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bar" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="pie">Pie Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="bar" className="pt-4">
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name, props) => [props.payload.displayValue, name]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Impact Statistics">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="pie" className="pt-4">
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [props.payload.displayValue, name]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AnimatedSection>
  )
}
