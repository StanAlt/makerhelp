import Badge from './Badge'
import Button from './Button'

interface ExpertCardProps {
  name: string
  initials: string
  specialty: string
  rate: number
  rating: number
  reviews: number
  badges: Array<'expert' | 'vetted' | 'new' | 'live'>
}

export default function ExpertCard({
  name,
  initials,
  specialty,
  rate,
  rating,
  reviews,
  badges,
}: ExpertCardProps) {
  return (
    <div className="bg-charcoal border border-steel rounded-card border-t-2 border-t-ember flex flex-col">
      <div className="p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-forest-mid flex items-center justify-center font-display text-lg text-ember shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-ui text-base font-bold text-ivory truncate">
              {name}
            </h3>
            <p className="font-ui text-sm font-light text-sage truncate">
              {specialty}
            </p>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <Badge key={b} variant={b}>
                {b}
              </Badge>
            ))}
          </div>
        )}

        {/* Rating + Price */}
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-amber text-sm">★</span>
            <span className="font-ui text-sm font-medium text-ivory">
              {rating.toFixed(1)}
            </span>
            <span className="font-ui text-xs text-sage">
              ({reviews})
            </span>
          </div>
          <div className="text-right">
            <span className="font-display text-[26px] font-medium text-ivory leading-none">
              ${rate}
            </span>
            <span className="font-ui text-xs text-sage block">/session</span>
          </div>
        </div>
      </div>

      {/* Book button */}
      <div className="p-4 pt-0">
        <Button className="w-full">Book a Session</Button>
      </div>
    </div>
  )
}
