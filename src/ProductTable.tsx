import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { products, type Product } from './data'
import Sparkline from './Sparkline'
import ReorderPanel from './ReorderPanel'

type SortKey = 'sku' | 'name' | 'stock' | 'price'
type Filter = 'All' | Product['status']

const filters: Filter[] = ['All', 'In Stock', 'Low Stock', 'Out of Stock']

const badge: Record<Product['status'], string> = {
  'In Stock': 'bg-emerald-50 text-emerald-700',
  'Low Stock': 'bg-amber-50 text-amber-700',
  'Out of Stock': 'bg-rose-50 text-rose-700',
}

const columns: { key: SortKey; label: string; align?: string }[] = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Product' },
  { key: 'stock', label: 'Stock', align: 'text-right' },
  { key: 'price', label: 'Price', align: 'text-right' },
]

export default function ProductTable() {
  const [filter, setFilter] = useState<Filter>('All')
  const [sortKey, setSortKey] = useState<SortKey>('sku')
  const [asc, setAsc] = useState(true)
  const [openId, setOpenId] = useState<number | null>(null)
  const [reorder, setReorder] = useState<Product | null>(null)

  const rows = useMemo(() => {
    const list = products.filter((p) => filter === 'All' || p.status === filter)
    return [...list].sort((a, b) => {
      const x = a[sortKey]
      const y = b[sortKey]
      const r = typeof x === 'number' ? x - (y as number) : String(x).localeCompare(String(y))
      return asc ? r : -r
    })
  }, [filter, sortKey, asc])

  function toggleSort(key: SortKey) {
    if (key === sortKey) setAsc(!asc)
    else {
      setSortKey(key)
      setAsc(true)
    }
  }

  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Filter pills with a sliding highlight */}
      <div className="flex gap-1 border-b border-slate-200 p-3">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="relative rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            {filter === f && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-md bg-slate-100"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className={`relative ${filter === f ? 'text-slate-900' : ''}`}>{f}</span>
          </button>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-2 font-medium ${c.align ?? 'text-left'}`}>
                <button onClick={() => toggleSort(c.key)} className="hover:text-slate-900">
                  {c.label}
                  {sortKey === c.key && (asc ? ' ↑' : ' ↓')}
                </button>
              </th>
            ))}
            <th className="px-4 py-2 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map((p) => (
              <ProductRow
                key={p.id}
                p={p}
                open={openId === p.id}
                onToggle={() => setOpenId(openId === p.id ? null : p.id)}
                   onReorder={() => setReorder(p)}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
         <ReorderPanel product={reorder} onClose={() => setReorder(null)} />
    </div>
  )
}

   function ProductRow({ p, open, onToggle, onReorder }: { p: Product; open: boolean; onToggle: () => void; onReorder: () => void }) {
  const history = Array.from({ length: 8 }, (_, i) =>
    i === 7 ? p.price : Math.round(p.price * (0.85 + 0.3 * Math.abs(Math.sin(p.id * (i + 1)))))
  )

  return (
    <>
      <motion.tr
        layout="position"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        className="border-b border-slate-100 hover:bg-slate-50"
      >
        <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{p.sku}</td>
        <td className="px-4 py-2.5 text-slate-900">
          <button
            onClick={onToggle}
            aria-expanded={open}
            className="flex items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            <motion.span animate={{ rotate: open ? 90 : 0 }} className="text-slate-400">
              ▸
            </motion.span>
            {p.name}
          </button>
        </td>
        <td className="px-4 py-2.5 text-right tabular-nums">{p.stock}</td>
        <td className="px-4 py-2.5 text-right tabular-nums">₹{p.price.toLocaleString('en-IN')}</td>
        <td className="px-4 py-2.5">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge[p.status]}`}>
            {p.status}
          </span>
        </td>
      </motion.tr>

      <AnimatePresence initial={false}>
        {open && (
          <tr className="bg-slate-50">
            <td colSpan={5} className="p-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between px-12 py-4">
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">
                      Price history (8 weeks)
                    </p>
                    <Sparkline values={history} />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onReorder}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Reorder
                  </motion.button>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  )
}