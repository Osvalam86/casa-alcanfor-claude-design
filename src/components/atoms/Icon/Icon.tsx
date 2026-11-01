import type { ComponentProps, ReactNode } from 'react'

const paths = {
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </>
  ),
  tag: (
    <>
      <path d="M4 12V4h8l8 8-8 8z" />
      <circle cx="8.5" cy="8.5" r="1.2" />
    </>
  ),
  'plus-circle': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  whatsapp: <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  play: <path d="M8 5l11 7-11 7z" />,
  gallery: (
    <>
      <rect x="3.5" y="5" width="13" height="11" rx="1" />
      <path d="M7.5 19.5h13V9" />
      <path d="M6 13.5l3-3 3 3 1.8-1.8 2.7 2.7" />
    </>
  ),
  menu: <path d="M4 9h16M4 15h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  'chevron-left': <path d="M15 6l-6 6 6 6" />,
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'alert-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5v.01" />
    </>
  ),
  'info-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5v.01" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14" rx="1" />
      <path d="M4 10h16M8 3.5v4M16 3.5v4" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof paths

/** Íconos de relleno; el resto son de trazo 1.5px. */
const filled: ReadonlySet<IconName> = new Set<IconName>(['play'])

type IconProps = Omit<ComponentProps<'svg'>, 'children'> & {
  name: IconName
  size?: number
}

/** Siempre decorativo: el nombre accesible lo pone el control que lo contiene. */
export function Icon({ name, size = 24, ...props }: IconProps) {
  const isFilled = filled.has(name)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke={isFilled ? 'none' : 'currentColor'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
