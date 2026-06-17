import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Send,
  Compass,
  FileCheck,
  Globe,
  TrendingUp,
  ShieldCheck,
  Bot,
  User,
  Loader2,
  ArrowRight,
  Zap,
  MapPin,
  BookOpen,
} from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedPrompts = [
  {
    icon: Compass,
    label: 'Career Guidance',
    prompt: 'What construction jobs are available in the UAE for someone with 5 years of site management experience?',
  },
  {
    icon: FileCheck,
    label: 'Document Help',
    prompt: 'What documents do I need to prepare for a work visa application to Germany as a nurse?',
  },
  {
    icon: TrendingUp,
    label: 'Market Insights',
    prompt: 'Which countries have the highest demand for IT professionals right now and what salaries can I expect?',
  },
  {
    icon: Globe,
    label: 'Cultural Prep',
    prompt: 'What cultural differences should I be aware of when working in Japan as a foreigner?',
  },
]

const features = [
  {
    icon: Zap,
    title: 'Instant Answers',
    description: 'Get real-time responses about jobs, visas, training, and more.',
  },
  {
    icon: MapPin,
    title: 'Smart Matching',
    description: 'AI analyzes your profile to suggest the best international opportunities.',
  },
  {
    icon: BookOpen,
    title: 'Learning Path',
    description: 'Personalized training recommendations based on your target job market.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety Alerts',
    description: 'Real-time alerts about employer compliance and destination safety updates.',
  },
]

const mockResponses: Record<string, string> = {
  'What construction jobs are available in the UAE for someone with 5 years of site management experience?':
    "Based on your experience, I found several excellent opportunities in the UAE:\n\n**Top Matches:**\n1. **Senior Construction Supervisor** at Al Rashid Group - Dubai ($3,500-$4,500/mo) - 94% match\n2. **Site Manager** at EMAR Properties - Abu Dhabi ($4,000-$5,500/mo) - 91% match\n3. **Project Coordinator** at Arabtec Construction - Dubai ($3,200-$4,200/mo) - 88% match\n\nYour 5 years of site management experience qualifies you for senior roles. I recommend applying to the first two positions as they offer the best compensation and have excellent employer ratings on our platform.\n\nWould you like me to help you prepare your application or check what additional certifications might boost your profile?",

  'What documents do I need to prepare for a work visa application to Germany as a nurse?':
    "For a German work visa as a nurse, you will need these documents:\n\n**Required Documents:**\n- Valid passport (minimum 6 months validity)\n- Anerkennung (recognition) of your nursing qualification from German authorities\n- B2 level German language certificate (Goethe/Telc)\n- Employment contract from a German healthcare facility\n- Proof of professional liability insurance\n- Clean criminal record certificate\n- Health clearance certificate\n\n**Processing Timeline:** 8-12 weeks\n\n**Pro Tip:** Start the Anerkennung process early - it can take 3-6 months. Our training partner offers a B2 German course specifically for healthcare workers.\n\nWould you like me to connect you with our visa documentation support team?",

  'Which countries have the highest demand for IT professionals right now and what salaries can I expect?':
    "Here is the current demand landscape for IT professionals:\n\n**Highest Demand Markets (2025):**\n1. **Germany** - 12,400 open positions - 50,000-85,000 EUR/year\n2. **Canada** - 8,900 open positions - CAD 65,000-110,000/year\n3. **UAE** - 6,700 open positions - $45,000-95,000/year\n4. **Australia** - 5,200 open positions - AUD 75,000-130,000/year\n5. **Japan** - 4,800 open positions - JPY 5,000,000-10,000,000/year\n\n**Trending Specializations:**\n- Cloud Architecture (+34% YoY)\n- Cybersecurity (+28% YoY)\n- AI/ML Engineering (+41% YoY)\n- DevOps (+22% YoY)\n\nGermany and Canada currently have the fastest visa processing for IT workers. Would you like a personalized assessment based on your specific tech stack?",

  'What cultural differences should I be aware of when working in Japan as a foreigner?':
    "Great question! Japan has a unique workplace culture. Here are key things to know:\n\n**Workplace Culture:**\n- **Punctuality** is extremely important - arrive 10-15 minutes early\n- **Hierarchy** matters - show respect to senior colleagues (senpai/kohai system)\n- **Consensus-building** (nemawashi) is preferred over direct confrontation\n- **Overtime culture** exists but is improving with new labor laws\n\n**Social Etiquette:**\n- Bow when greeting (slight nod is fine for foreigners)\n- Exchange business cards with both hands\n- Remove shoes when entering homes and some offices\n- Avoid loud phone conversations on public transport\n\n**Practical Tips:**\n- Learn basic Japanese phrases - effort is highly appreciated\n- Join company social events (nomikai) - important for bonding\n- Healthcare is excellent but learn the clinic system\n\nOur pre-departure program includes a 2-week cultural orientation. Would you like to enroll?",
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      content:
        "Hello! I'm your AI Workforce Mobility Assistant. I can help you find jobs, understand visa requirements, explore training programs, and prepare for your international career journey. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      id: messages.length + 1,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const response =
        mockResponses[text] ||
        `Thank you for your question about "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}". \n\nI'm analyzing your query against our global job database and training resources. Here's what I found:\n\nBased on current market data, I recommend exploring opportunities in the GCC region and Europe, which show the strongest demand patterns for your profile. Our platform has 2,400+ verified positions that match similar queries.\n\nWould you like me to:\n1. Show specific job listings\n2. Recommend training programs\n3. Provide visa guidance\n4. Connect you with a mobility counselor`

      const assistantMsg: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMsg])
      setIsTyping(false)
    }, 1500)
  }

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt)
  }

  return (
    <div className="pt-[60px] min-h-screen bg-navy-950">
      {/* Header */}
      <section className="relative py-12 lg:py-16 bg-gradient-to-b from-navy-900/50 to-navy-950 border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-[11px] font-medium text-brand-gold uppercase tracking-wider">
                  AI-Powered
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Mobility <span className="text-gradient">Assistant</span>
              </h1>
              <p className="text-slate-400 text-sm max-w-xl">
                Your personal AI guide for ethical workforce mobility. Get instant
                answers about jobs, visas, training, and cultural preparation.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-400 font-medium">
                  Online
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Zap className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-[11px] text-slate-400">
                  GPT-4 Powered
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 h-[calc(100vh-240px)] min-h-[500px]">
          {/* Chat Area */}
          <div className="flex flex-col rounded-2xl bg-surface-elevated border border-white/5 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 scrollbar-hide">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'assistant'
                        ? 'bg-brand-gold/10'
                        : 'bg-brand-teal/10'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <Bot className="w-4 h-4 text-brand-gold" />
                    ) : (
                      <User className="w-4 h-4 text-brand-teal" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'assistant'
                        ? 'bg-white/5 text-slate-300 border border-white/5'
                        : 'bg-brand-teal/10 text-slate-200 border border-brand-teal/10'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div
                      className={`text-[10px] mt-2 ${
                        msg.role === 'assistant'
                          ? 'text-slate-600'
                          : 'text-brand-teal/60'
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-brand-gold" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                      Analyzing your query...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                  placeholder="Ask about jobs, visas, training..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-gold/50 transition-all"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-3 bg-brand-gold text-navy-950 rounded-xl hover:bg-brand-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:flex flex-col gap-4 overflow-y-auto scrollbar-hide">
            {/* Quick Prompts */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-white/5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                Quick Questions
              </h3>
              <div className="space-y-2">
                {suggestedPrompts.map(prompt => (
                  <button
                    key={prompt.label}
                    onClick={() => handlePromptClick(prompt.prompt)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left group"
                  >
                    <prompt.icon className="w-4 h-4 text-brand-teal flex-shrink-0" />
                    <span className="text-xs text-slate-300 group-hover:text-slate-100 transition-colors">
                      {prompt.label}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-brand-gold ml-auto transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div
              ref={featuresRef}
              className="p-5 rounded-2xl bg-surface-elevated border border-white/5 flex-1"
            >
              <h3 className="text-sm font-semibold text-slate-200 mb-4">
                Capabilities
              </h3>
              <div className="space-y-3">
                {features.map((feature, i) => (
                  <div
                    key={feature.title}
                    className="flex gap-3"
                    style={{
                      opacity: featuresVisible ? 1 : 0,
                      transform: featuresVisible
                        ? 'translateX(0)'
                        : 'translateX(12px)',
                      transition: `all 0.4s ease ${i * 0.08}s`,
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-brand-gold" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-200">
                        {feature.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
