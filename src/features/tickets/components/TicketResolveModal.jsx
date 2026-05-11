import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

export default function TicketResolveModal({ ticket, onClose, onResolve, loading }) {
  const [note,  setNote]  = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!note.trim()) { setError('Resolution note is required'); return }
    setError('')
    onResolve(note.trim())
  }

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
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

          <div className="flex items-center justify-between px-6 py-5 border-b border-surface-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                <CheckCircle2 size={15} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Resolve Ticket</h2>
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

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <div className="px-4 py-3 bg-surface-800/60 border border-surface-700/50 rounded-xl">
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-1">Resolving</p>
              <p className="text-sm text-slate-300 font-medium line-clamp-2">{ticket?.title}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                Resolution Note <span className="text-red-400 normal-case">*</span>
              </label>
              <textarea
                rows={4}
                value={note}
                onChange={(e) => { setNote(e.target.value); setError('') }}
                placeholder="Describe what was done to resolve this issue…"
                className={`w-full bg-surface-800/60 border rounded-xl px-4 py-3 text-sm text-slate-200
                            placeholder-slate-600 resize-none focus:outline-none focus:ring-1 transition-all
                            ${error
                              ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20'
                              : 'border-surface-700/50 hover:border-surface-600 focus:border-emerald-500/40 focus:ring-emerald-500/20'
                            }`}
              />
              <div className="flex items-center justify-between">
                {error ? (
                  <p className="flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle size={12} /> {error}
                  </p>
                ) : <span />}
                <p className="text-xs text-slate-700 font-mono">{note.length}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 px-4 py-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
              <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300/70 leading-relaxed">
                This marks the ticket as <strong className="text-amber-300">Resolved</strong>. Status can be changed manually if needed.
              </p>
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
                disabled={loading}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl
                           hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all
                           flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(16,185,129,0.25)]"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                {loading ? 'Resolving…' : 'Mark Resolved'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
