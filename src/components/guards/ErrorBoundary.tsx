// src/components/guards/ErrorBoundary.tsx
//
// Global React Error Boundary — catches all unhandled render errors beneath it
// and shows a premium WorkforceX-branded recovery UI instead of a blank screen.

import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Globe, RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    }
  }

  // Triggered during render — update state so the next render shows the fallback UI.
  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  // Triggered after the render phase — log diagnostics, send to monitoring etc.
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    console.group('[ErrorBoundary] Unhandled render error')
    console.error('Error:  ', error)
    console.error('Stack:  ', error.stack)
    console.error('Component stack:', errorInfo.componentStack)
    console.groupEnd()
  }

  handleReload = () => window.location.reload()

  toggleDetails = () =>
    this.setState(prev => ({ showDetails: !prev.showDetails }))

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    const { error, errorInfo, showDetails } = this.state
    const isDev = import.meta.env.DEV

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">

          {/* ── Brand mark ── */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-4">
              <Globe className="w-7 h-7 text-brand-gold" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Workforce<span className="text-brand-gold">X</span>
            </h1>
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] mt-1">
              Ethical Mobility Platform
            </p>
          </div>

          {/* ── Error card ── */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">

            {/* Header strip */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-destructive/5">
              <div className="w-9 h-9 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4.5 h-4.5 text-destructive" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Something went wrong</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  An unexpected error prevented this page from rendering.
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Error message pill */}
              {error && (
                <div className="px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border text-[12px] font-mono text-destructive break-all">
                  {error.message || 'Unknown error'}
                </div>
              )}

              <p className="text-[13px] text-muted-foreground leading-relaxed">
                The page encountered an unexpected error. You can try reloading — if the problem
                persists, please contact support.
              </p>

              {/* Dev-only collapsible stack trace */}
              {isDev && errorInfo?.componentStack && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={this.toggleDetails}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showDetails
                      ? <ChevronUp className="w-3.5 h-3.5" />
                      : <ChevronDown className="w-3.5 h-3.5" />}
                    {showDetails ? 'Hide' : 'Show'} component stack (dev only)
                  </button>

                  {showDetails && (
                    <pre className="text-[10px] font-mono text-muted-foreground bg-muted/30 border border-border rounded-xl p-3 overflow-x-auto max-h-48 whitespace-pre-wrap break-all">
                      {errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={this.handleReload}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-black text-[13px] font-semibold hover:opacity-90 transition-opacity"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reload Page
                </button>
                <a
                  href="/"
                  className="px-4 py-2.5 rounded-xl border border-border text-[13px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                >
                  Go Home
                </a>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-[11px] text-muted-foreground mt-6">
            Error reference:{' '}
            <span className="font-mono">{new Date().toISOString()}</span>
          </p>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
