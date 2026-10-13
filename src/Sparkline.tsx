import { motion } from 'framer-motion'

export default function Sparkline({ values }: { values: number[] }) {
  const w = 240, h = 64, pad = 4
  const min = Math.min(...values), max = Math.max(...values)
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)
    return `${x},${y}`
  })

  return (
    <svg width={w} height={h} role="img" aria-label="Price history, last 8 weeks">
      <motion.polyline
        points={pts.join(' ')}
        fill="none"
        stroke="#6366f1"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </svg>
  )
}