import { Routes, Route } from 'react-router'
import { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'

const HomePage = lazy(() => import('./pages/HomePage'))
const JobsMarketplace = lazy(() => import('./pages/JobsMarketplace'))
const SkillsTraining = lazy(() => import('./pages/SkillsTraining'))
const TalentPool = lazy(() => import('./pages/TalentPool'))
const AboutTrust = lazy(() => import('./pages/AboutTrust'))
const AiAssistant = lazy(() => import('./pages/AiAssistant'))
const BlogResources = lazy(() => import('./pages/BlogResources'))
const EmployerEnterprise = lazy(() => import('./pages/EmployerEnterprise'))

function App() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 font-sans">
      <Navbar />
      <main>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsMarketplace />} />
            <Route path="/skills" element={<SkillsTraining />} />
            <Route path="/talent" element={<TalentPool />} />
            <Route path="/about" element={<AboutTrust />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />
            <Route path="/blog" element={<BlogResources />} />
            <Route path="/employers" element={<EmployerEnterprise />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App