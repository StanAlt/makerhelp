import ExpertCard from '@/components/ui/ExpertCard'
import Button from '@/components/ui/Button'

const experts = [
  {
    name: 'Marcus Chen',
    initials: 'MC',
    specialty: 'LightBurn & xTool specialist',
    rate: 65,
    rating: 4.9,
    reviews: 127,
    badges: ['expert', 'vetted'] as const,
  },
  {
    name: 'Sarah Kovalenko',
    initials: 'SK',
    specialty: 'Glowforge & material testing',
    rate: 55,
    rating: 4.8,
    reviews: 84,
    badges: ['vetted', 'live'] as const,
  },
  {
    name: 'James Whitford',
    initials: 'JW',
    specialty: 'CO₂ laser calibration & CNC routing',
    rate: 75,
    rating: 5.0,
    reviews: 43,
    badges: ['expert', 'new'] as const,
  },
]

const steps = [
  {
    num: '01',
    title: 'Find Your Expert',
    description:
      'Browse vetted laser engraving and CNC specialists. Filter by machine, software, or material.',
  },
  {
    num: '02',
    title: 'Book a Live Session',
    description:
      'Pick a time that works. Sessions run 30–60 minutes over video with screen share.',
  },
  {
    num: '03',
    title: 'Get Unstuck, Fast',
    description:
      'Walk through your exact issue with a pro who has solved it before. Pay only for the time you use.',
  },
]

export default function HomePage() {
  return (
    <main>
      {/* ─── Hero ─── */}
      <section className="relative bg-charcoal py-24 px-4 overflow-hidden">
        {/* Subtle ember radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF4D1A 0%, transparent 70%)' }}
        />

        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
          {/* Eyebrow */}
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ember">
            Expert laser help, live
          </span>

          {/* Display heading */}
          <h1 className="font-display text-[60px] font-medium leading-[1.0] tracking-[-0.02em] text-ivory">
            Get the <em className="text-ember">answers</em> your<br />
            laser projects need
          </h1>

          {/* Subheading */}
          <p className="font-ui text-lg font-light text-sage max-w-xl leading-relaxed">
            Book a live video call with a vetted maker expert. LightBurn, xTool,
            Glowforge, CO₂ calibration — real help from people who have done it.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center gap-4">
            <Button>Book a Session</Button>
            <Button variant="secondary">Browse Experts</Button>
          </div>

          {/* Stat counters */}
          <div className="flex items-center gap-12 mt-4">
            <div className="text-center">
              <span className="font-display text-3xl font-medium text-ivory">50+</span>
              <span className="block font-ui text-xs text-sage mt-1">Vetted Experts</span>
            </div>
            <div className="text-center">
              <span className="font-display text-3xl font-medium text-ivory">$45–95</span>
              <span className="block font-ui text-xs text-sage mt-1">Per Session</span>
            </div>
            <div className="text-center">
              <span className="font-display text-3xl font-medium text-ivory">4.9</span>
              <span className="block font-ui text-xs text-sage mt-1">Avg Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Expert Grid ─── */}
      <section className="bg-forest py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ember">
              Featured Experts
            </span>
            <h2 className="font-ui text-2xl font-semibold text-ivory mt-3">
              Top-rated laser specialists, ready now
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <ExpertCard key={expert.name} {...expert} badges={[...expert.badges]} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="bg-charcoal py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ember">
              How It Works
            </span>
            <h2 className="font-ui text-2xl font-semibold text-ivory mt-3">
              Three steps to expert help
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col gap-4">
                <span className="font-mono text-3xl font-medium text-ember">
                  {step.num}
                </span>
                <h3 className="font-ui text-lg font-semibold text-ivory">
                  {step.title}
                </h3>
                <p className="font-ui text-sm font-light text-sage leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="bg-forest py-24 px-4">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="font-display text-4xl font-medium text-ivory tracking-tight">
            Stop guessing. Start <em className="text-ember">making</em>.
          </h2>
          <p className="font-ui text-base font-light text-sage max-w-lg">
            Your next project deserves expert eyes. Book a live session and get
            unstuck in minutes, not days.
          </p>
          <Button>Book Your First Session</Button>
        </div>
      </section>
    </main>
  )
}
