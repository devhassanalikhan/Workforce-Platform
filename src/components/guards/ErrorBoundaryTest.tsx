// src/components/guards/ErrorBoundaryTest.tsx
//
// DEV-ONLY helper — renders a toggle button that deliberately throws a render
// error so you can verify that <ErrorBoundary> intercepts it correctly.
//
// Usage: drop <ErrorBoundaryTest /> anywhere inside your tree in development,
// click "Trigger Test Error", and confirm the ErrorBoundary recovery UI appears.
//
// ⚠️  This component is tree-shaken out of production bundles automatically
// because it reads import.meta.env.DEV and returns null in prod.

import { useState } from 'react'
import { Bug } from 'lucide-react'

function Bomb(): never {
  // This intentionally throws during render to exercise the boundary.
  throw new Error('[ErrorBoundaryTest] Deliberate render error — boundary is working correctly ✓')
}

export function ErrorBoundaryTest() {
  const [explode, setExplode] = useState(false)

  // No-op in production — zero impact on bundle UX.
  if (!import.meta.env.DEV) return null

  if (explode) {
    // Mounting <Bomb /> will throw synchronously during React's render phase,
    // which is exactly the class of error an ErrorBoundary is designed to catch.
    return <Bomb />
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        type="button"
        onClick={() => setExplode(true)}
        title="Trigger a deliberate render error to test the ErrorBoundary"
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-destructive text-destructive-foreground text-[11px] font-semibold shadow-lg hover:opacity-90 transition-opacity"
      >
        <Bug className="w-3.5 h-3.5" />
        Test Error Boundary
      </button>
    </div>
  )
}

export default ErrorBoundaryTest
