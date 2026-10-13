import { motion } from 'framer-motion'

function Bone({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`rounded bg-slate-200 ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function KpiSkeleton() {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-hidden="true"
    >
      <Bone className="h-4 w-24" />
      <Bone className="mt-3 h-8 w-32" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div
      className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm"
      role="status"
      aria-label="Loading inventory"
    >
      <div className="flex gap-2 border-b border-slate-200 p-3">
        {[0, 1, 2, 3].map((i) => (
          <Bone key={i} className="h-8 w-20" />
        ))}
      </div>
      <div className="space-y-4 p-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex items-center gap-6">
            <Bone className="h-4 w-20" />
            <Bone className="h-4 flex-1" />
            <Bone className="h-4 w-12" />
            <Bone className="h-4 w-16" />
            <Bone className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}