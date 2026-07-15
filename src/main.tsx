import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from '@/components/guards/ErrorBoundary'
import { ErrorBoundaryTest } from '@/components/guards/ErrorBoundaryTest'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
      {/* DEV-ONLY: floating button to deliberately trigger a render error.
          Automatically removed (tree-shaken) in production builds. */}
      <ErrorBoundaryTest />
    </BrowserRouter>
  </ErrorBoundary>,
)
