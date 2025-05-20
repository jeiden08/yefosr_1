"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download, Search, X } from "lucide-react"
import { format } from "date-fns"
import { AuditLogDetails } from "@/components/admin/audit-log-details"
import { useToast } from "@/hooks/use-toast"

interface Admin {
  id: string
  name: string
  email: string
}

interface AuditLog {
  id: string
  admin_id: string
  action: string
  resource_type: string
  resource_id: string
  previous_data: any
  new_data: any
  ip_address: string
  user_agent: string
  created_at: string
  admins?: {
    name: string
    email: string
  }
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState({
    adminId: "",
    resourceType: "",
    action: "",
    startDate: "",
    endDate: "",
    searchTerm: "",
  })
  const { toast } = useToast()

  // Fetch audit logs
  useEffect(() => {
    async function fetchLogs() {
      setIsLoading(true)
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        })

        if (filters.adminId) queryParams.append("adminId", filters.adminId)
        if (filters.resourceType) queryParams.append("resourceType", filters.resourceType)
        if (filters.action) queryParams.append("action", filters.action)
        if (filters.startDate) queryParams.append("startDate", filters.startDate)
        if (filters.endDate) queryParams.append("endDate", filters.endDate)
        if (filters.searchTerm) queryParams.append("search", filters.searchTerm)

        const response = await fetch(`/api/admin/audit-logs?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch audit logs")
        }

        const data = await response.json()
        setLogs(data.logs)
        setTotalCount(data.count)
      } catch (error) {
        console.error("Error fetching audit logs:", error)
        toast({
          title: "Error",
          description: "Failed to load audit logs",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [page, pageSize, filters, toast])

  // Fetch admins for filter dropdown
  useEffect(() => {
    async function fetchAdmins() {
      try {
        const response = await fetch("/api/admin/users")
        if (!response.ok) {
          throw new Error("Failed to fetch admins")
        }

        const data = await response.json()
        setAdmins(data)
      } catch (error) {
        console.error("Error fetching admins:", error)
      }
    }

    fetchAdmins()
  }, [])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1) // Reset to first page when filters change
  }

  const clearFilters = () => {
    setFilters({
      adminId: "",
      resourceType: "",
      action: "",
      startDate: "",
      endDate: "",
      searchTerm: "",
    })
    setPage(1)
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const queryParams = new URLSearchParams()

      if (filters.adminId) queryParams.append("adminId", filters.adminId)
      if (filters.resourceType) queryParams.append("resourceType", filters.resourceType)
      if (filters.action) queryParams.append("action", filters.action)
      if (filters.startDate) queryParams.append("startDate", filters.startDate)
      if (filters.endDate) queryParams.append("endDate", filters.endDate)
      if (filters.searchTerm) queryParams.append("search", filters.searchTerm)

      const response = await fetch(`/api/admin/audit-logs/export?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to export audit logs")
      }

      // Create a blob from the response
      const blob = await response.blob()

      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "Audit logs exported successfully",
      })
    } catch (error) {
      console.error("Error exporting audit logs:", error)
      toast({
        title: "Error",
        description: "Failed to export audit logs",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <Button onClick={handleExport} disabled={isExporting || isLoading}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </>
          )}
        </Button>
      </div>

      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Filters</h2>
            {Object.values(filters).some(Boolean) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adminId">Admin</Label>
              <Select value={filters.adminId} onValueChange={(value) => handleFilterChange("adminId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Admins" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Admins</SelectItem>
                  {admins.map((admin) => (
                    <SelectItem key={admin.id} value={admin.id}>
                      {admin.name} ({admin.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resourceType">Resource Type</Label>
              <Select value={filters.resourceType} onValueChange={(value) => handleFilterChange("resourceType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Resources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Resources</SelectItem>
                  <SelectItem value="program">Programs</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                  <SelectItem value="resource">Resources</SelectItem>
                  <SelectItem value="blog_post">Blog Posts</SelectItem>
                  <SelectItem value="gallery_item">Gallery Items</SelectItem>
                  <SelectItem value="partner">Partners</SelectItem>
                  <SelectItem value="impact_stat">Impact Stats</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="role">Roles</SelectItem>
                  <SelectItem value="permission">Permissions</SelectItem>
                  <SelectItem value="setting">Settings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select value={filters.action} onValueChange={(value) => handleFilterChange("action", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                  <SelectItem value="upload">Upload</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="searchTerm">Search</Label>
              <div className="relative">
                <Input
                  id="searchTerm"
                  type="text"
                  placeholder="Search in resource ID or details..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date & Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Admin
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Resource Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Resource ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      IP Address
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(log.created_at), "MMM d, yyyy h:mm a")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.admins?.name || "Unknown"} <br />
                        <span className="text-xs text-gray-400">{log.admins?.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(
                            log.action,
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatResourceType(log.resource_type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.resource_id ? (
                          <span className="font-mono text-xs">{log.resource_id}</span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip_address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <AuditLogDetails log={log} />
                      </td>
                    </tr>
                  ))}

                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                        No audit logs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(page * pageSize, totalCount)}</span> of{" "}
                  <span className="font-medium">{totalCount}</span> results
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function getActionColor(action: string): string {
  switch (action) {
    case "create":
      return "bg-green-100 text-green-800"
    case "update":
      return "bg-blue-100 text-blue-800"
    case "delete":
      return "bg-red-100 text-red-800"
    case "login":
      return "bg-purple-100 text-purple-800"
    case "logout":
      return "bg-gray-100 text-gray-800"
    case "view":
      return "bg-yellow-100 text-yellow-800"
    case "download":
      return "bg-indigo-100 text-indigo-800"
    case "upload":
      return "bg-pink-100 text-pink-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function formatResourceType(resourceType: string): string {
  return resourceType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
