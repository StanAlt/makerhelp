'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const STARTERS = [
  'What settings for 3mm basswood on xTool D1 Pro?',
  'Best power/speed for cutting 3mm acrylic on a 60W CO2?',
  'How do I engrave leather without burning edges?',
]

export default function MaikaChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/maika', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I had trouble processing that. Try again.' },
        ])
        setLoading(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setLoading(false)
        return
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      const decoder = new TextDecoder()
      let done = false
      while (!done) {
        const { value, done: streamDone } = await reader.read()
        done = streamDone
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          setMessages((prev) => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            updated[updated.length - 1] = { ...last, content: last.content + chunk }
            return updated
          })
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please try again.' },
      ])
    }
    setLoading(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-ember flex items-center justify-center transition-transform duration-200 hover:scale-110"
        aria-label="Ask Maika"
      >
        {/* Spark icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill="#F5F0E8" />
          <circle cx="12" cy="12" r="8" fill="#FF4D1A" opacity="0.3" />
          <circle cx="12" cy="12" r="4" fill="#F5F0E8" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] flex flex-col bg-charcoal border border-steel rounded-card overflow-hidden"
      style={{ height: '520px' }}
    >
      {/* Header */}
      <div className="bg-forest px-4 py-3 flex items-center justify-between shrink-0">
        <div>
          <p className="font-display text-lg font-medium text-ivory">Maika</p>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
            Laser Settings AI
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-sage hover:text-ivory text-xl leading-none"
        >
          &times;
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2">
            <p className="font-ui text-sm text-sage mb-2">Try asking:</p>
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-left px-3 py-2 bg-forest border border-steel rounded-btn font-ui text-xs text-ivory hover:border-ember transition-colors duration-200"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] px-3 py-2 rounded-card font-ui text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'self-end bg-ivory text-charcoal'
                : 'self-start bg-forest text-ivory'
            }`}
          >
            {msg.content}
            {msg.role === 'assistant' && msg.content === '' && loading && (
              <span className="text-sage animate-pulse">Thinking...</span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-steel shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage(input)
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about laser settings..."
            className="flex-1 bg-charcoal border border-steel rounded-btn px-3 py-2 font-ui text-sm text-ivory placeholder:text-sage focus:outline-none focus:border-ember transition-colors duration-200"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-btn bg-ember flex items-center justify-center shrink-0 disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M9 3l5 5-5 5" stroke="#F5F0E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
