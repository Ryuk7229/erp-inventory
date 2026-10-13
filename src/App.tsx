import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { products } from './data'
import CountUp from './CountUp'
import ProductTable from './ProductTable'
import { KpiSkeleton, TableSkeleton } from './Skeleton'

export default function App() {
  const [loading, setLoading] = useState(true)

  // Fake network delay. In a real app this would be your fetch() finishing.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  const kpis = [
    { label: 'Total SKUs', value: products.length, prefix: '' },
    { label: 'Low Stock', value: products.filter((p) => p.status !== 'In Stock').length, prefix: '' },
    { label: 'Stock Value', value: products.reduce((s, p) => s + p.stock * p.price, 0), prefix: '₹' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Inventory</h1>

      <div className="grid grid-cols-3 gap-4">
        {loading
          ? kpis.map((k) => <KpiSkeleton key={k.label} />)
          : kpis.map((k, i) => (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
                whileHover={{ y: -4 }}
                className="rounded-xl bg-white p-5 shadow-sm border border-slate-200"
              >
                <p className="text-sm text-slate-500">{k.label}</p>
                <p className="text-3xl font-semibold text-slate-900 mt-1">
                  <CountUp to={k.value} prefix={k.prefix} />
                </p>
              </motion.div>
            ))}
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <ProductTable />
        </motion.div>
      )}
    </div>
  )
}