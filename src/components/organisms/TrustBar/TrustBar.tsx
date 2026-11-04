import { landing } from '@/content/landing'
import { StatItem } from '@/components/atoms/StatItem'

/** Lista de cifras (<ul>): el lector anuncia "lista, 3 elementos". La estrella es decorativa. */
export function TrustBar() {
  const { trust } = landing
  return (
    <div className="mt-trust border-t border-border pt-7 pb-trust">
      <ul className="m-0 grid list-none grid-fit-220 gap-6 p-0">
        {trust.stats.map((stat) => (
          <StatItem
            key={stat.label}
            label={stat.label}
            srText={'sr' in stat ? stat.sr : undefined}
            value={
              'star' in stat ? (
                <>
                  {stat.value}{' '}
                  <span aria-hidden="true" className="text-title-lg text-accent">
                    ★
                  </span>
                </>
              ) : (
                stat.value
              )
            }
          />
        ))}
      </ul>
      <p className="mt-4 mb-0 font-sans text-overline font-normal tracking-normal text-text-muted">{trust.note}</p>
    </div>
  )
}
