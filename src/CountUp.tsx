import { useEffect } from 'react'
import { animate, useMotionValue, useTransform, motion } from 'framer-motion'

export default function CountUp({ to, prefix = '' }: { to: number; prefix?: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => prefix + Math.round(v).toLocaleString('en-IN'))

  useEffect(() => {
    const controls = animate(count, to, { duration: 1.2, ease: 'easeOut' })
    return () => controls.stop()
  }, [to] )

  return <motion.span>{rounded}</motion.span>
}