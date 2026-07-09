// src/App.tsx

import { Routes, Route } from 'react-router'
import { Suspense, lazy } from 'react'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import { ThemeProvider } from './components/ThemeProvider'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/guards/ProtectedRoute'

// ── Public pages ───────────────────────────────────────────────────────────────
const HomePage         = lazy(() => import('./pages/HomePage'))
const JobsMarketplace  = lazy(() => import('./pages/JobsMarketplace'))
const SkillsTraining   = lazy(() => import('./pages/SkillsTraining'))
const AboutTrust       = lazy(() => import('./pages/AboutTrust'))
const AiAssistant      = lazy(() => import('./pages/AiAssistant'))
const BlogResources    = lazy(() => import('./pages/BlogResources'))
const LoginPage        = lazy(() => import('./pages/LoginPage'))
const SignupPage       = lazy(() => import('./pages/SignupPage'))

// ── Auth-gated pages ───────────────────────────────────────────────────────────
const ApplicantDashboard    = lazy(() => import('./pages/Dashboard'))
const TalentPool            = lazy(() => import('./pages/TalentPool'))
const EmployerEnterprise    = lazy(() => import('./pages/EmployerEnterprise'))
const EmployerPortal        = lazy(() => import('./pages/EmployerPortal'))
const PlacementDashboard    = lazy(() => import('./pages/PlacementDashboard'))
const WaslDashboard         = lazy(() => import('./pages/WaslDashboard'))
const AdminEmployersOverview = lazy(() => import('./pages/admin/AdminEmployersOverview'))

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="workforcex-theme">
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
          <Navbar />
          <main>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                {/* ── Public ─────────────────────────────────────────────── */}
                <Route path="/"            element={<HomePage />} />
                <Route path="/jobs"        element={<JobsMarketplace />} />
                <Route path="/skills"      element={<SkillsTraining />} />
                <Route path="/about"       element={<AboutTrust />} />
                <Route path="/ai-assistant" element={<AiAssistant />} />
                <Route path="/blog"        element={<BlogResources />} />
                <Route path="/employers"   element={<EmployerEnterprise />} />
                <Route path="/login"       element={<LoginPage />} />
                <Route path="/signup"      element={<SignupPage />} />

                {/* ── applicant+ ─────────────────────────────────────────── */}
                <Route path="/dashboard/*" element={
                  <ProtectedRoute requiredRole="applicant">
                    <ApplicantDashboard />
                  </ProtectedRoute>
                } />

                {/* ── admin+ ─────────────────────────────────────────────── */}
                <Route path="/talent" element={
                  <ProtectedRoute requiredRole="admin">
                    <TalentPool />
                  </ProtectedRoute>
                } />

                {/* Admin-only oversight view — NOT the same page an employer
                    uses. See exactRole note on /employer-portal below for why
                    admins don't just fall through into that page instead. */}
                <Route path="/admin/employers" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminEmployersOverview />
                  </ProtectedRoute>
                } />

                {/* ── employer (exact role) ──────────────────────────────── */}
                {/* exactRole=true: without this, hasRole('admin','employer')
                    is true (admin outranks employer in the hierarchy), so an
                    admin could land on the employer's own "add your company"
                    setup screen instead of their dedicated oversight page
                    above. This route is deliberately NOT elevation-accessible. */}
                <Route path="/employer-portal" element={
                  <ProtectedRoute requiredRole="employer" exactRole>
                    <EmployerPortal />
                  </ProtectedRoute>
                } />

                <Route path="/placement" element={
                  <ProtectedRoute requiredRole="admin">
                    <PlacementDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/wasl" element={
                  <ProtectedRoute requiredRole="admin">
                    <WaslDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Toaster position="bottom-right" richColors />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
