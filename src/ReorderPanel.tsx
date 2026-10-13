import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Product } from './data'

const suppliers = ['Apex Industrial Supplies', 'Mumbai Hardware Co.', 'Shree Traders']

export default function ReorderPanel({
  product,
  onClose,
}: {
  product: Product | null
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {product && [
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/30"
        />,
        <Panel key="panel" product={product} onClose={onClose} />,
      ]}
    </AnimatePresence>
  )
}

function Panel({ product, onClose }: { product: Product; onClose: () => void }) {
  const [step, setStep] = useState(1) // 1 = quantity, 2 = supplier, 3 = success
  const [qty, setQty] = useState(50)
  const [supplier, setSupplier] = useState(suppliers[0])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const total = qty * product.price

  return (
    <motion.aside
      role="dialog"
      aria-modal="true"
      aria-label={`Reorder ${product.name}`}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 350, damping: 34 }}
      className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Reorder</p>
          <h2 className="text-lg font-semibold text-slate-900">{product.name}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-500"
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      {step < 3 && (
        <div className="h-1 bg-slate-100">
          <motion.div
            className="h-full bg-indigo-600"
            animate={{ width: step === 1 ? '50%' : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      )}

      <div className="flex-1 overflow-hidden px-6 py-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
            >
              <label htmlFor="qty" className="text-sm font-medium text-slate-700">
                Quantity to order
              </label>
              <input
                id="qty"
                type="number"
                min={1}
                autoFocus
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-lg tabular-nums focus:outline-2 focus:outline-indigo-500"
              />
              <p className="mt-3 text-sm text-slate-500">
                Current stock: <span className="tabular-nums">{product.stock}</span> · Unit price: ₹
                {product.price.toLocaleString('en-IN')}
              </p>
              <p className="mt-6 text-sm text-slate-500">Estimated total</p>
              <p className="text-3xl font-semibold tabular-nums text-slate-900">
                ₹{total.toLocaleString('en-IN')}
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-medium text-slate-700">Choose a supplier</p>
              <div className="mt-3 space-y-2" role="radiogroup" aria-label="Supplier">
                {suppliers.map((s) => (
                  <motion.button
                    key={s}
                    role="radio"
                    aria-checked={supplier === s}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSupplier(s)}
                    className={`w-full rounded-lg border px-4 py-3 text-left text-sm focus-visible:outline-2 focus-visible:outline-indigo-500 ${
                      supplier === s
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
              <p className="mt-6 text-sm text-slate-500">
                {qty} × {product.name} · ₹{total.toLocaleString('en-IN')}
              </p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-col items-center justify-center text-center"
            >
              <motion.svg width="88" height="88" viewBox="0 0 88 88" fill="none">
                <motion.circle
                  cx="44"
                  cy="44"
                  r="38"
                  stroke="#10b981"
                  strokeWidth="5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                <motion.path
                  d="M26 45 L39 58 L62 32"
                  stroke="#10b981"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.45, duration: 0.35, ease: 'easeOut' }}
                />
              </motion.svg>
              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-5 text-xl font-semibold text-slate-900"
              >
                Purchase order created
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-1 text-sm text-slate-500"
              >
                {qty} × {product.name} from {supplier}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between border-t border-slate-200 px-6 py-4">
        {step === 1 && (
          <>
            <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={qty < 1}
              onClick={() => setStep(2)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              Continue
            </motion.button>
          </>
        )}
        {step === 2 && (
          <>
            <button onClick={() => setStep(1)} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
              Back
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep(3)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
            >
              Place order
            </motion.button>
          </>
        )}
        {step === 3 && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="ml-auto rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Done
          </motion.button>
        )}
      </div>
    </motion.aside>
  )
}