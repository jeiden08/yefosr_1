"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

interface AuditLogDetailsProps {
  log: {
    id: string
    action: string
    resource_type: string
    resource_id: string
    previous_data: any
    new_data: any
    created_at: string
    ip_address: string
    user_agent: string
    admins: {
      name: string
      email: string
    }
  }
}

export function AuditLogDetails({ log }: AuditLogDetailsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button className="text-blue-600 hover:text-blue-800" onClick={() => setIsOpen(true)}>
        View Details
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Admin</h3>
                <p className="mt-1">
                  {log.admins?.name} ({log.admins?.email})
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                <p className="mt-1">{new Date(log.created_at).toLocaleString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Action</h3>
                <p className="mt-1 capitalize">{log.action}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Resource Type</h3>
                <p className="mt-1 capitalize">{log.resource_type.replace("_", " ")}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Resource ID</h3>
                <p className="mt-1 font-mono text-sm">{log.resource_id || "N/A"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">IP Address</h3>
                <p className="mt-1">{log.ip_address}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">User Agent</h3>
              <p className="mt-1 text-sm break-words">{log.user_agent}</p>
            </div>

            {log.action === "update" && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Previous Data</h3>
                  <pre className="mt-2 p-4 bg-gray-50 rounded-md overflow-auto text-xs">
                    {JSON.stringify(log.previous_data, null, 2)}
                  </pre>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">New Data</h3>
                  <pre className="mt-2 p-4 bg-gray-50 rounded-md overflow-auto text-xs">
                    {JSON.stringify(log.new_data, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {log.action !== "update" && log.new_data && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data</h3>
                <pre className="mt-2 p-4 bg-gray-50 rounded-md overflow-auto text-xs">
                  {JSON.stringify(log.new_data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
