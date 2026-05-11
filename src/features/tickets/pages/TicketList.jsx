import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, AlertCircle, RefreshCw, List } from 'lucide-react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import TicketTable from '../components/TicketTable'
import TicketFilters from '../components/TicketFilters'
import TicketAssignmentModal from '../components/TicketAssignmentModal'
import { useTickets, useTicketMutations } from '../hooks/useTickets'

export default function TicketList() {
  const navigate = useNavigate()

  const {
    tickets, total, totalPages, page, setPage,
    filters, applyFilters, resetFilters,
    loading, error, refresh,
  } = useTickets()

  const [assignTarget, setAssignTarget] = useState(null)

  const { assignTicket, loading: mutating } = useTicketMutations(() => {
    setAssignTarget(null)
    refresh()
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative flex items-center justify-between px-6 py-5
                     bg-surface-900/80 backdrop-blur-sm border border-surface-700/60
                     rounded-2xl shadow-xl shadow-black/20 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00AEEF]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

          <div className="flex items-center gap-3 relative">
            <div className="w-9 h-9 rounded-xl bg-[#00AEEF]/10 flex items-center justify-center ring-1 ring-[#00AEEF]/20">
              <List size={16} className="text-[#00AEEF]" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">All Tickets</h1>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {loading
                  ? 'Loading…'
                  : total > 0
                    ? `${total} ticket${total !== 1 ? 's' : ''} found`
                    : 'No tickets found'}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/tickets/create')}
            className="relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white
                       bg-[#00AEEF] rounded-xl hover:bg-[#0099d6] transition-all
                       shadow-[0_0_20px_rgba(0,174,239,0.3)] hover:shadow-[0_0_28px_rgba(0,174,239,0.45)]"
          >
            <Plus size={15} strokeWidth={2.5} />
            New Ticket
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.07, ease: 'easeOut' }}
        >
          <TicketFilters
            filters={filters}
            onApply={applyFilters}
            onReset={resetFilters}
          />
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 px-5 py-3.5 bg-red-500/8 border border-red-500/20
                       rounded-2xl text-sm text-red-400"
          >
            <AlertCircle size={15} className="flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 text-xs font-medium text-red-400/70
                         hover:text-red-300 transition-colors ml-auto"
            >
              <RefreshCw size={12} />
              Retry
            </button>
          </motion.div>
        )}

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12, ease: 'easeOut' }}
        >
          <TicketTable
            tickets={tickets}
            loading={loading}
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            onAssign={(ticket) => setAssignTarget(ticket)}
          />
        </motion.div>

      </div>

      {assignTarget && (
        <TicketAssignmentModal
          ticket={assignTarget}
          loading={mutating}
          onClose={() => setAssignTarget(null)}
          onAssign={(agentId) => assignTicket(assignTarget._id, agentId)}
        />
      )}
    </DashboardLayout>
  )
}
