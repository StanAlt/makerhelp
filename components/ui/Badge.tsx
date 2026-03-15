type BadgeVariant = 'expert' | 'vetted' | 'new' | 'live'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
}

const styles: Record<BadgeVariant, string> = {
  expert:
    'bg-ember/15 text-ember border border-ember/25',
  vetted:
    'bg-forest-mid text-sage border border-steel',
  new:
    'bg-amber/15 text-amber border border-amber/25',
  live:
    'bg-ember/[0.08] text-ember border border-ember/25',
}

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-badge ${styles[variant]}`}
    >
      {variant === 'live' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-ember" />
        </span>
      )}
      {children}
    </span>
  )
}
