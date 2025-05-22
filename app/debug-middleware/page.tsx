export default function DebugMiddlewarePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Middleware Debug Page</h1>
      <p className="mb-4">This page is used to test if the middleware is working correctly.</p>
      <div className="p-4 bg-green-100 rounded-md">
        <p>If you can see this page without redirects, the middleware is working correctly for non-admin routes.</p>
      </div>
    </div>
  )
}
