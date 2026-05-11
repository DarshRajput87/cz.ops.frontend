import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CheckCircle2, UserCheck, Tag, Calendar, Clock,
  Paperclip, User, Link2, ShieldAlert, Zap, AlertCircle,
  ExternalLink, FileText, X, Image,
} from 'lucide-react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import TicketStatusBadge from '../components/TicketStatusBadge'
import TicketPriorityBadge from '../components/TicketPriorityBadge'
import TicketActivityLog from '../components/TicketActivityLog'
import TicketAssignmentModal from '../components/TicketAssignmentModal'
import TicketResolveModal from '../components/TicketResolveModal'
import { useTicket, useTicketMutations } from '../hooks/useTickets'

const MUTABLE_STATUSES = ['OPEN', 'IN_PROGRESS', 'ON_HOLD']

const STATUS_BTN = {
  OPEN:        { label: 'Open',        active: 'border-blue-500/40 bg-blue-500/10 text-blue-400',       base: 'border-surface-700/60 text-slate-500 hover:border-surface-600 hover:text-slate-200' },
  IN_PROGRESS: { label: 'In Progress', active: 'border-[#00AEEF]/40 bg-[#00AEEF]/10 text-[#00AEEF]',    base: 'border-surface-700/60 text-slate-500 hover:border-surface-600 hover:text-slate-200' },
  ON_HOLD:     { label: 'On Hold',     active: 'border-amber-500/40 bg-amber-500/10 text-amber-400',    base: 'border-surface-700/60 text-slate-500 hover:border-surface-600 hover:text-slate-200' },
}

function GlassCard({ topColor, children, className = '' }) {
  return (
    <div className={`relative bg-surface-900/80 backdrop-blur-sm border border-surface-700/60
                     rounded-2xl shadow-xl shadow-black/20 overflow-hidden ${className}`}>
      {topColor && (
        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${topColor} to-transparent`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      {children}
    </div>
  )
}

function SectionHeader({ icon: Icon, label, iconColor = 'text-slate-400', iconBg = 'bg-surface-700/60' }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-surface-700/50">
      <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center ring-1 ring-white/5`}>
        <Icon size={14} className={iconColor} />
      </div>
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function MetaRow({ label, value, mono = false }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">{label}</span>
      <span className={`text-sm text-slate-300 ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  )
}

function SkeletonDetail() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6 flex flex-col gap-5 animate-pulse">
        <div className="h-16 bg-surface-800/60 border border-surface-700/50 rounded-2xl" />
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 flex flex-col gap-5">
            <div className="h-40 bg-surface-800/60 border border-surface-700/50 rounded-2xl" />
            <div className="h-48 bg-surface-800/60 border border-surface-700/50 rounded-2xl" />
            <div className="h-40 bg-surface-800/60 border border-surface-700/50 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-5">
            <div className="h-32 bg-surface-800/60 border border-surface-700/50 rounded-2xl" />
            <div className="h-56 bg-surface-800/60 border border-surface-700/50 rounded-2xl" />
            <div className="h-24 bg-surface-800/60 border border-surface-700/50 rounded-2xl" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0 },
}

export default function TicketDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const { ticket, loading, error, refresh } = useTicket(id)

  const [showAssign,    setShowAssign]    = useState(false)
  const [showResolve,   setShowResolve]   = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)

  const { updateStatus, assignTicket, resolveTicket, loading: mutating } = useTicketMutations(() => {
    setShowAssign(false)
    setShowResolve(false)
    refresh()
  })

  if (loading) return <SkeletonDetail />

  if (error || !ticket) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-800/80 border border-surface-700/50 flex items-center justify-center">
            <AlertCircle size={24} className="text-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-400">{error ?? 'Ticket not found'}</p>
            <p className="text-xs text-slate-600 mt-1">The ticket may have been removed or you lack access.</p>
          </div>
          <button
            onClick={() => navigate('/tickets/list')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#00AEEF]
                       border border-[#00AEEF]/30 rounded-xl hover:bg-[#00AEEF]/8 transition-all"
          >
            <ArrowLeft size={13} /> Back to tickets
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const isResolved = ['RESOLVED', 'CLOSED'].includes(ticket.status)

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6 flex flex-col gap-5">

        {/* ── Header ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show"
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <GlassCard topColor="via-[#00AEEF]/25">
            <div className="flex items-start gap-4 px-6 py-5">
              <button
                onClick={() => navigate('/tickets/list')}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-surface-700/60
                           text-slate-500 hover:text-white hover:border-surface-600 hover:bg-surface-800
                           transition-all flex-shrink-0 mt-0.5"
              >
                <ArrowLeft size={15} />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="font-mono text-xs text-[#00AEEF] bg-[#00AEEF]/8 px-2 py-0.5 rounded-lg border border-[#00AEEF]/15">
                    {ticket.ticket_id}
                  </span>
                  <TicketStatusBadge status={ticket.status} />
                  <TicketPriorityBadge priority={ticket.priority} />
                  {ticket.is_escalated && (
                    <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full
                                     bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
                      <ShieldAlert size={10} /> Escalated
                    </span>
                  )}
                  {ticket.source === 'AI_GENERATED' && (
                    <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full
                                     bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
                      <Zap size={10} /> AI Generated
                    </span>
                  )}
                </div>
                <h1 className="text-base font-semibold text-white leading-snug">{ticket.title}</h1>
              </div>

              {!isResolved && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowAssign(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300
                               border border-surface-700/60 rounded-xl hover:border-surface-600
                               hover:text-white hover:bg-surface-800/60 transition-all"
                  >
                    <UserCheck size={13} />
                    {ticket.assigned_to ? 'Reassign' : 'Assign'}
                  </button>
                  <button
                    onClick={() => setShowResolve(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white
                               bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-all
                               shadow-[0_0_16px_rgba(16,185,129,0.25)]"
                  >
                    <CheckCircle2 size={13} />
                    Resolve
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Body ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left col */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Description */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.07 }}>
              <GlassCard topColor="via-slate-500/20">
                <SectionHeader icon={FileText} label="Description" iconBg="bg-slate-700/60" />
                <div className="px-5 py-4">
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {ticket.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Inline image attachments */}
            {ticket.attachments?.some((a) => a.mime_type?.startsWith('image/')) && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.09 }}>
                <GlassCard topColor="via-purple-500/20">
                  <SectionHeader icon={Image} label="Images" iconBg="bg-purple-500/10" iconColor="text-purple-400" />
                  <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ticket.attachments
                      .filter((a) => a.mime_type?.startsWith('image/'))
                      .map((a) => (
                        <button
                          key={a._id}
                          onClick={() => setLightboxImage(a)}
                          className="group relative aspect-video rounded-xl overflow-hidden border border-surface-700/50
                                     hover:border-purple-500/40 transition-all bg-surface-800/60"
                        >
                          <img
                            src={a.url}
                            alt={a.filename}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all
                                          flex items-center justify-center">
                            <ExternalLink size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Resolution note */}
            {ticket.resolution_note && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.1 }}>
                <GlassCard topColor="via-emerald-500/30" className="border-emerald-500/20">
                  <SectionHeader icon={CheckCircle2} label="Resolution" iconBg="bg-emerald-500/10" iconColor="text-emerald-400" />
                  <div className="px-5 py-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 ring-1 ring-emerald-500/20">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300 leading-relaxed">{ticket.resolution_note}</p>
                      {ticket.resolved_at && (
                        <p className="flex items-center gap-1 text-xs text-slate-600 mt-2">
                          <Clock size={11} />
                          Resolved {new Date(ticket.resolved_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Status changer */}
            {!isResolved && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.13 }}>
                <GlassCard topColor="via-[#00AEEF]/20">
                  <SectionHeader icon={Tag} label="Update Status" iconBg="bg-[#00AEEF]/10" iconColor="text-[#00AEEF]" />
                  <div className="px-5 py-4 flex flex-wrap gap-2">
                    {MUTABLE_STATUSES.map((s) => {
                      const meta = STATUS_BTN[s]
                      const isActive = ticket.status === s
                      return (
                        <button
                          key={s}
                          disabled={isActive || mutating}
                          onClick={() => updateStatus(ticket._id, s)}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all
                            ${isActive ? meta.active + ' cursor-default' : meta.base}
                            disabled:opacity-40`}
                        >
                          {meta.label}
                        </button>
                      )
                    })}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Activity log */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.16 }}>
              <GlassCard>
                <SectionHeader icon={Clock} label="Activity" iconBg="bg-violet-500/10" iconColor="text-violet-400" />
                <div className="px-5 py-4">
                  <TicketActivityLog activities={ticket.activities ?? []} />
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Right col */}
          <div className="flex flex-col gap-5">

            {/* Assignment */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.1 }}>
              <GlassCard topColor="via-[#00AEEF]/25">
                <SectionHeader icon={UserCheck} label="Assignment" iconBg="bg-[#00AEEF]/10" iconColor="text-[#00AEEF]" />
                <div className="px-5 py-4">
                  {ticket.assigned_to ? (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#00AEEF]/15 text-[#00AEEF] text-sm
                                      flex items-center justify-center font-bold flex-shrink-0 ring-1 ring-[#00AEEF]/20">
                        {ticket.assigned_to.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{ticket.assigned_to.name}</p>
                        <p className="text-xs text-slate-500 truncate">{ticket.assigned_to.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 py-1">
                      <div className="w-8 h-8 rounded-full bg-surface-700/60 flex items-center justify-center">
                        <User size={14} className="text-slate-600" />
                      </div>
                      <span className="text-sm text-slate-600 italic">Unassigned</span>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Details */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.13 }}>
              <GlassCard>
                <SectionHeader icon={Tag} label="Details" />
                <div className="px-5 py-4 flex flex-col gap-3.5">
                  <MetaRow label="Department"   value={ticket.department_tag} />
                  <MetaRow label="Created by"   value={ticket.created_by?.name} />
                  <MetaRow label="Created"       value={new Date(ticket.createdAt).toLocaleString()} />
                  <MetaRow label="Last updated"  value={new Date(ticket.updatedAt).toLocaleString()} />
                  {ticket.issue_tags?.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Issue Tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {ticket.issue_tags.map((t) => (
                          <span key={t}
                                className="px-2 py-0.5 text-[10px] font-medium rounded-md
                                           bg-surface-800 border border-surface-700/60 text-slate-500">
                            {t.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Customer */}
            {(ticket.customer?.name || ticket.customer?.email) && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.16 }}>
                <GlassCard>
                  <SectionHeader icon={User} label="Customer" iconBg="bg-blue-500/10" iconColor="text-blue-400" />
                  <div className="px-5 py-4 flex flex-col gap-3.5">
                    <MetaRow label="Name"  value={ticket.customer.name} />
                    <MetaRow label="Email" value={ticket.customer.email} />
                    <MetaRow label="Phone" value={ticket.customer.phone} />
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Related entities */}
            {(ticket.related_entities?.charger_id || ticket.related_entities?.session_id) && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.19 }}>
                <GlassCard>
                  <SectionHeader icon={Link2} label="Related Entities" iconBg="bg-amber-500/10" iconColor="text-amber-400" />
                  <div className="px-5 py-4 flex flex-col gap-3.5">
                    <MetaRow label="Charger ID" value={ticket.related_entities.charger_id} mono />
                    <MetaRow label="Session ID" value={ticket.related_entities.session_id} mono />
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Attachments */}
            {ticket.attachments?.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.22 }}>
                <GlassCard>
                  <SectionHeader icon={Paperclip} label={`Attachments (${ticket.attachments.length})`} iconBg="bg-purple-500/10" iconColor="text-purple-400" />
                  <div className="px-5 py-4 flex flex-col gap-2">
                    {ticket.attachments.map((a) => (
                      <a
                        key={a._id}
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-surface-700/50
                                   bg-surface-800/40 hover:border-surface-600 hover:bg-surface-800/70
                                   text-slate-400 hover:text-white transition-all group"
                      >
                        <FileText size={13} className="text-slate-600 flex-shrink-0 group-hover:text-slate-400" />
                        <span className="text-xs flex-1 truncate">{a.filename}</span>
                        <ExternalLink size={11} className="text-slate-700 flex-shrink-0 group-hover:text-slate-500" />
                      </a>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {showAssign && (
        <TicketAssignmentModal
          ticket={ticket}
          loading={mutating}
          onClose={() => setShowAssign(false)}
          onAssign={(agentId) => assignTicket(ticket._id, agentId)}
        />
      )}

      {showResolve && (
        <TicketResolveModal
          ticket={ticket}
          loading={mutating}
          onClose={() => setShowResolve(false)}
          onResolve={(note) => resolveTicket(ticket._id, note)}
        />
      )}

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden border border-surface-700/60 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.url}
              alt={lightboxImage.filename}
              className="w-full max-h-[80vh] object-contain bg-surface-950"
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <a
                href={lightboxImage.url}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-black/60 border border-white/10
                           text-slate-400 hover:text-white transition-all"
              >
                <ExternalLink size={13} />
              </a>
              <button
                onClick={() => setLightboxImage(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-black/60 border border-white/10
                           text-slate-400 hover:text-white transition-all"
              >
                <X size={14} />
              </button>
            </div>
            <div className="px-4 py-2.5 bg-surface-900/90 border-t border-surface-700/50">
              <p className="text-xs text-slate-500 truncate">{lightboxImage.filename}</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
