import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserCheck, Check, Loader2 } from 'lucide-react'
import axios from 'axios'

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('cn_token')}` }
}

export default function TicketAssignmentModal({ ticket, onClose, onAssign, loading }) {
  const [agents,    setAgents]    = useState([])
  const [selected,  setSelected]  = useState(ticket?.assigned_to?._id ?? '')
  const [fetching,  setFetching]  = useState(false)

  useEffect(() => {
    setFetching(true)
    axios.get('/api/tickets/agents', { headers: authHeaders() })
      .catch(() => axios.get('/api/auth/users', { headers: authHeaders() }))
      .then((r) => setAgents(r.data?.data ?? r.data ?? []))
      .catch(() => setAgents([]))
      .finally(() => setFetching(false))
  }, [])

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-surface-900/95 backdrop-blur-xl border border-surface-700/60
                     rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00AEEF]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

          <div className="flex items-center justify-between px-6 py-5 border-b border-surface-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#00AEEF]/10 flex items-center justify-center ring-1 ring-[#00AEEF]/20">
                <UserCheck size={15} className="text-[#00AEEF]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Assign Ticket</h2>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{ticket?.ticket_id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500
                         hover:text-white hover:bg-surface-700/60 transition-all"
            >
              <X size={14} />
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); if (selected) onAssign(selected) }} className="p-6 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">Select Agent</p>

              {fetching ? (
                <div className="flex flex-col gap-2">
                  {[1,2,3].map((i) => (
                    <div key={i} className="h-14 rounded-xl bg-surface-800/60 animate-pulse" />
                  ))}
                </div>
              ) : agents.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-600">No agents available</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-0.5 custom-scroll">
                  {agents.map((agent) => {
                    const active = selected === agent._id
                    return (
                      <button
                        key={agent._id}
                        type="button"
                        onClick={() => setSelected(agent._id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                          ${active
                            ? 'border-[#00AEEF]/40 bg-[#00AEEF]/8 shadow-[0_0_12px_rgba(0,174,239,0.1)]'
                            : 'border-surface-700/50 bg-surface-800/40 hover:border-surface-600 hover:bg-surface-800/70'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ring-1
                          ${active ? 'bg-[#00AEEF]/20 text-[#00AEEF] ring-[#00AEEF]/30' : 'bg-surface-700 text-slate-400 ring-surface-600'}`}>
                          {agent.name?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{agent.name}</p>
                          <p className="text-xs text-slate-600 truncate">{agent.email}</p>
                        </div>
                        {active && (
                          <div className="w-5 h-5 rounded-full bg-brand-accent flex items-center justify-center flex-shrink-0">
                            <Check size={11} className="text-white" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-medium text-slate-400 border border-surface-700/60
                           rounded-xl hover:border-surface-600 hover:text-slate-200 hover:bg-surface-800/40 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selected || loading}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-brand-accent rounded-xl
                           hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all
                           flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,174,239,0.3)]"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                {loading ? 'Assigning…' : 'Assign'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
