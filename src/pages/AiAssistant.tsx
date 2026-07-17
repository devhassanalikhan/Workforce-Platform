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
import { supabase } from '@/lib/supabase'

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

// How long to wait for the assistant before showing a timeout message. The
// underlying request isn't cancelled (functions.invoke has no abort hook in
// the installed supabase-js version) — this just bounds how long the UI waits.
const RESPONSE_TIMEOUT_MS = 30_000

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

    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setIsTyping(true)

    let replyContent: string
    try {
      const { data, error } = await Promise.race([
        supabase.functions.invoke<{ reply?: string; error?: string }>('chat-ai', {
          body: {
            messages: history.map(({ role, content }) => ({ role, content })),
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), RESPONSE_TIMEOUT_MS)
        ),
      ])

      if (error) throw error
      if (!data?.reply) throw new Error(data?.error ?? 'Empty response')

      replyContent = data.reply
    } catch (err) {
      replyContent =
        err instanceof Error && err.message === 'timeout'
          ? "That's taking longer than expected — the assistant may be busy. Please try again in a moment."
          : "I ran into a problem reaching the assistant just now. Please try again — if this keeps happening, contact support."
    }

    const assistantMsg: Message = {
      id: history.length + 1,
      role: 'assistant',
      content: replyContent,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, assistantMsg])
    setIsTyping(false)
  }

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt)
  }

  return (
    <div className="pt-[60px] min-h-screen bg-background">
      {/* Header */}
      <section className="relative py-12 lg:py-16 bg-muted/40 border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-[11px] font-medium text-brand-gold uppercase tracking-wider">
                  AI-Powered
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Mobility <span className="text-gradient">Assistant</span>
              </h1>
              <p className="text-muted-foreground text-sm max-w-xl">
                Your personal AI guide for ethical workforce mobility. Get instant
                answers about jobs, visas, training, and cultural preparation.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] dark:text-emerald-400 text-emerald-600 font-medium">
                  Online
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border">
                <Zap className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-[11px] text-muted-foreground">
                  Gemini-Powered
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 h-[calc(100vh-240px)] min-h-[500px]">
          {/* Chat Area */}
          <div className="flex flex-col rounded-2xl bg-card border border-border overflow-hidden">
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
                        ? 'bg-muted text-foreground border border-border'
                        : 'bg-brand-teal/10 text-foreground border border-brand-teal/20'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div
                      className={`text-[10px] mt-2 ${
                        msg.role === 'assistant'
                          ? 'text-muted-foreground/60'
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
                  <div className="p-4 rounded-2xl bg-muted border border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                      Analyzing your query...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                  placeholder="Ask about jobs, visas, training..."
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-gold/50 transition-all"
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
            <div className="p-5 rounded-2xl bg-card border border-border">
              <h3 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                Quick Questions
              </h3>
              <div className="space-y-2">
                {suggestedPrompts.map(prompt => (
                  <button
                    key={prompt.label}
                    onClick={() => handlePromptClick(prompt.prompt)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border transition-all text-left group"
                  >
                    <prompt.icon className="w-4 h-4 text-brand-teal flex-shrink-0" />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      {prompt.label}
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-brand-gold ml-auto transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div
              ref={featuresRef}
              className="p-5 rounded-2xl bg-card border border-border flex-1"
            >
              <h3 className="text-sm font-semibold text-card-foreground mb-4">
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
                      <div className="text-xs font-medium text-card-foreground">
                        {feature.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
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
