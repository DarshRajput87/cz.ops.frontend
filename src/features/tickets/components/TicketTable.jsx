import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, TicketCheck } from 'lucide-react'
import TicketStatusBadge from './TicketStatusBadge'
import TicketPriorityBadge from './TicketPriorityBadge'

function SkeletonRow() {
  return (
    <tr className="border-b border-surface-700/30">
      {[32, 0, 22, 18, 18, 28].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3.5 bg-surface-700/50 rounded-lg animate-pulse"
               style={{ width: w === 0 ? '65%' : `${w * 2}px` }} />
        </td>
      ))}
    </tr>
  )
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6} className="py-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-surface-800/80 border border-surface-700/50
                          flex items-center justify-center">
            <TicketCheck size={22} className="text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">No tickets found</p>
            <p className="text-xs text-slate-700 mt-0.5">Try adjusting your filters</p>
          </div>
        </div>
      </td>
    </tr>
  )
}

function Pagination({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null
  const start = (page - 1) * 20 + 1
  const end   = Math.min(page * 20, total)

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-surface-700/40">
      <p className="text-xs text-slate-600">
        Showing <span className="text-slate-400 font-medium">{start}–{end}</span> of{' '}
        <span className="text-slate-400 font-medium">{total}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-surface-700/60
                     text-slate-400 hover:text-white hover:border-surface-600 hover:bg-surface-800
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="px-3 py-1 text-xs font-mono text-slate-400 bg-surface-800/60 rounded-lg border border-surface-700/40">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-surface-700/60
                     text-slate-400 hover:text-white hover:border-surface-600 hover:bg-surface-800
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

const COLS = ['Ticket ID', 'Title', 'Department', 'Priority', 'Status', 'Assigned To']

export default function TicketTable({ tickets, loading, page, totalPages, total, onPageChange }) {
  const navigate = useNavigate()

  return (
    <div className="relative bg-surface-900/80 backdrop-blur-sm border border-surface-700/60
                    rounded-2xl overflow-hidden shadow-xl shadow-black/20">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.015] to-transparent pointer-events-none rounded-2xl" />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-700/50 bg-surface-900/70 sticky top-0 z-10">
              {COLS.map((col) => (
                <th key={col}
                    className="px-5 py-3 text-left text-[10px] font-semibold text-slate-600
                               uppercase tracking-widest whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
            {!loading && tickets.length === 0 && <EmptyState />}
            {!loading && tickets.map((ticket, i) => (
              <motion.tr
                key={ticket._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/tickets/${ticket._id}`)}
                className="border-b border-surface-700/25 hover:bg-white/[0.025] cursor-pointer
                           transition-all duration-150 group"
              >
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="font-mono text-xs text-[#00AEEF] group-hover:text-blue-300 transition-colors">
                    {ticket.ticket_id}
                  </span>
                </td>
                <td className="px-5 py-3.5 max-w-[240px]">
                  <p className="text-sm text-slate-300 font-medium truncate group-hover:text-white transition-colors">
                    {ticket.title}
                  </p>
                  {ticket.customer?.name && (
                    <p className="text-xs text-slate-600 truncate mt-0.5">{ticket.customer.name}</p>
                  )}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="text-[11px] text-slate-500 bg-surface-800/70 border border-surface-700/40
                                   px-2.5 py-1 rounded-lg font-medium">
                    {ticket.department_tag}
                  </span>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <TicketPriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <TicketStatusBadge status={ticket.status} />
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  {ticket.assigned_to?.name ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#00AEEF]/15 text-[#00AEEF] text-[10px] font-bold
                                      flex items-center justify-center flex-shrink-0 ring-1 ring-[#00AEEF]/20">
                        {ticket.assigned_to.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-slate-400 truncate max-w-[100px]">
                        {ticket.assigned_to.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-700 italic">Unassigned</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} />
    </div>
  )
}
