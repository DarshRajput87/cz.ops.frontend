import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout'
import CustomerTable from '../components/CustomerTable'
import CustomerFilters from '../components/CustomerFilters'
import { useCustomerList } from '../hooks/useCustomers'

export default function CustomerList() {
  const navigate = useNavigate()
  const {
    customers, total, hasMore, loading, error,
    filters, applyFilters, resetFilters, loadMore,
  } = useCustomerList()

  const sentinelRef = useRef(null)

  const handleIntersect = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) loadMore()
    },
    [hasMore, loading, loadMore]
  )

  useEffect(() => {
    if (!sentinelRef.current) return
    const obs = new IntersectionObserver(handleIntersect, { rootMargin: '200px' })
    obs.observe(sentinelRef.current)
    return () => obs.disconnect()
  }, [handleIntersect])

  return (
    <DashboardLayout>
      <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/customers')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>
            <span className="text-slate-700">/</span>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-accent" />
              <h1 className="text-lg font-bold text-white">All Customers</h1>
              {!loading && (
                <span className="px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-semibold">
                  {total.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <CustomerFilters filters={filters} onApply={applyFilters} onReset={resetFilters} />

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Table */}
        <CustomerTable
          customers={customers}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          total={total}
        />

        {/* Invisible sentinel for intersection-based infinite scroll */}
        <div ref={sentinelRef} className="h-1" />
      </div>
    </DashboardLayout>
  )
}
