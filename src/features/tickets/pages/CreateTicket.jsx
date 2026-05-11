import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Plus, Loader2, Check, Upload, X, FileText,
  User, Users, Link2, Paperclip, AlertCircle, Info, UserCheck, Search, Sparkles,
} from 'lucide-react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { useTicketMutations } from '../hooks/useTickets'
import api from '../services/ticket.api'

const DEPARTMENTS = ['Operations', 'Technical', 'Finance', 'OCPI', 'Support', 'Maintenance', 'Software', 'Mobile App']
const PRIORITIES  = ['URGENT', 'HIGH', 'MEDIUM', 'LOW']
const ISSUE_TAGS  = ['APP_ISSUE', 'CHARGER_ISSUE', 'PAYMENT_ISSUE', 'RFID_ISSUE', 'SESSION_ISSUE', 'OCPI_SYNC']

const PRIORITY_META = {
  URGENT: { color: 'text-red-400',    ring: 'ring-red-500/30',    bg: 'bg-red-500/8',      dot: 'bg-red-400',    desc: 'Requires immediate attention' },
  HIGH:   { color: 'text-orange-400', ring: 'ring-orange-500/30', bg: 'bg-orange-500/8',   dot: 'bg-orange-400', desc: 'Should be addressed today' },
  MEDIUM: { color: 'text-yellow-400', ring: 'ring-yellow-500/30', bg: 'bg-yellow-500/8',   dot: 'bg-yellow-400', desc: 'Standard resolution timeline' },
  LOW:    { color: 'text-slate-400',  ring: 'ring-slate-600/50',  bg: 'bg-surface-700/40', dot: 'bg-slate-500',  desc: 'No immediate urgency' },
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain']
const MAX_SIZE_MB   = 5
const MAX_FILES     = 5

function getUser() {
  try { return JSON.parse(localStorage.getItem('cn_user')) } catch { return null }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Sub-components ─────────────────────────────────────────────────────────────

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

function CardHeader({ icon: Icon, label, iconBg = 'bg-[#00AEEF]/10', iconColor = 'text-[#00AEEF]', badge }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-surface-700/50">
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center ring-1 ring-white/5`}>
          <Icon size={14} className={iconColor} />
        </div>
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>
      {badge}
    </div>
  )
}

function Field({ label, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
          {label} {required && <span className="text-red-400 normal-case">*</span>}
        </label>
        {hint && <span className="text-xs text-slate-700 font-mono">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle size={11} className="flex-shrink-0" /> {error}
        </p>
      )}
    </div>
  )
}

const inputCls = (err) =>
  `w-full bg-surface-800/60 border rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600
   focus:outline-none focus:ring-1 transition-all appearance-none
   ${err
     ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20'
     : 'border-surface-700/50 hover:border-surface-600 focus:border-[#00AEEF]/50 focus:ring-[#00AEEF]/20'
   }`

// ── File upload zone ───────────────────────────────────────────────────────────

function FileUploadZone({ files, onAdd, onRemove, uploading, uploadProgress }) {
  const inputRef  = useRef()
  const [drag, setDrag] = useState(false)

  const processFiles = useCallback((incoming) => {
    const valid = []
    const errs  = []
    Array.from(incoming).forEach((f) => {
      if (!ALLOWED_TYPES.includes(f.type)) { errs.push(`${f.name}: unsupported type`); return }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) { errs.push(`${f.name}: exceeds ${MAX_SIZE_MB}MB`); return }
      if (files.length + valid.length >= MAX_FILES) { errs.push('Max 5 files allowed'); return }
      valid.push(f)
    })
    if (valid.length) onAdd(valid, errs)
  }, [files.length, onAdd])

  const onDrop = (e) => { e.preventDefault(); setDrag(false); processFiles(e.dataTransfer.files) }
  const isImage  = (f) => f.type?.startsWith('image/') || f.mime_type?.startsWith('image/')
  const previewUrl = (f) => f.preview ?? f.url ?? null

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-xl border-2
                    border-dashed cursor-pointer transition-all duration-200
                    ${drag
                      ? 'border-[#00AEEF] bg-[#00AEEF]/8 scale-[1.01]'
                      : 'border-surface-700/60 hover:border-surface-600 bg-surface-800/30 hover:bg-surface-800/60'
                    }`}
      >
        <input ref={inputRef} type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.txt"
               className="hidden" onChange={(e) => processFiles(e.target.files)} />
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all
                         ${drag ? 'bg-[#00AEEF]/20 text-[#00AEEF]' : 'bg-surface-700/60 text-slate-500'}`}>
          <Upload size={22} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-300">
            {drag ? 'Drop files here' : 'Drag & drop or click to browse'}
          </p>
          <p className="text-xs text-slate-600 mt-1">JPG · PNG · PDF · TXT · Max {MAX_SIZE_MB}MB · Up to {MAX_FILES} files</p>
        </div>
      </div>

      {uploading && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-[#00AEEF]/8 border border-[#00AEEF]/20 rounded-xl">
          <Loader2 size={14} className="text-[#00AEEF] animate-spin flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Uploading…</span><span>{uploadProgress}%</span>
            </div>
            <div className="h-1 bg-surface-700 rounded-full overflow-hidden">
              <div className="h-full bg-[#00AEEF] rounded-full transition-all duration-300"
                   style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2.5 bg-surface-800/60
                                      border border-surface-700/50 rounded-xl group">
              {isImage(f) && previewUrl(f) ? (
                <img src={previewUrl(f)} alt={f.name ?? f.filename}
                     className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-surface-600" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-surface-700/60 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-slate-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-300 truncate">{f.name ?? f.filename}</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {formatBytes(f.size ?? f.size_bytes ?? 0)}
                  {f.uploaded && <span className="ml-2 text-emerald-400">✓ Uploaded</span>}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600
                           hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Step badge ─────────────────────────────────────────────────────────────────

function StepBadge({ n, label, active, done }) {
  return (
    <div className={`flex items-center gap-2 transition-opacity ${active ? 'opacity-100' : 'opacity-35'}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0
        ${done ? 'bg-emerald-500 text-white' : active ? 'bg-[#00AEEF] text-white' : 'bg-surface-700 text-slate-500'}`}>
        {done ? <Check size={12} strokeWidth={3} /> : n}
      </div>
      <span className={`text-xs font-medium hidden sm:block ${active ? 'text-white' : 'text-slate-600'}`}>{label}</span>
    </div>
  )
}

// ── Constants ──────────────────────────────────────────────────────────────────

// ── Agent picker ───────────────────────────────────────────────────────────────

const AVATAR_GRADIENTS = [
  'from-[#00AEEF] to-[#0077b6]',
  'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-700',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
  'from-sky-500 to-blue-700',
]

function agentGradient(name = '') {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[idx]
}

function AgentPicker({ selected, onSelect }) {
  const [agents,   setAgents]   = useState([])
  const [fetching, setFetching] = useState(false)
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    setFetching(true)
    api.agents()
      .then((r) => setAgents(r.data?.data ?? r.data ?? []))
      .catch(() => setAgents([]))
      .finally(() => setFetching(false))
  }, [])

  const filtered = search.trim()
    ? agents.filter((a) =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.email?.toLowerCase().includes(search.toLowerCase()))
    : agents

  const selectedAgent = agents.find((a) => a._id === selected)

  return (
    <div className="flex flex-col gap-3">

      {/* Selected agent banner */}
      {selectedAgent ? (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                        bg-[#00AEEF]/8 border border-[#00AEEF]/30
                        shadow-[0_0_14px_rgba(0,174,239,0.08)]">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${agentGradient(selectedAgent.name)}
                           flex items-center justify-center text-xs font-bold text-white flex-shrink-0
                           ring-2 ring-[#00AEEF]/30`}>
            {selectedAgent.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{selectedAgent.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{selectedAgent.email}</p>
          </div>
          <button
            type="button"
            onClick={() => onSelect('')}
            className="w-6 h-6 flex items-center justify-center rounded-lg
                       text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
          >
            <X size={11} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-800/40 border border-surface-700/40">
          <div className="w-7 h-7 rounded-full bg-surface-700/60 flex items-center justify-center flex-shrink-0">
            <User size={13} className="text-slate-600" />
          </div>
          <span className="text-xs text-slate-600 italic">No agent assigned yet</span>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-800/60 border border-surface-700/50 rounded-xl
                     pl-8 pr-8 py-2 text-xs text-slate-300 placeholder-slate-600
                     focus:outline-none focus:border-[#00AEEF]/50 focus:ring-1 focus:ring-[#00AEEF]/20
                     hover:border-surface-600 transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
          >
            <X size={11} />
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-0.5 custom-scroll">
        {fetching ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-800/60 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-surface-700/60 flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-2.5 bg-surface-700/60 rounded-full w-24" />
                <div className="h-2 bg-surface-700/40 rounded-full w-32" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-slate-600">
            <Search size={18} className="opacity-40" />
            <p className="text-xs">No agents found</p>
          </div>
        ) : (
          filtered.map((agent) => {
            const active = selected === agent._id
            const grad   = agentGradient(agent.name)
            return (
              <button
                key={agent._id}
                type="button"
                onClick={() => onSelect(active ? '' : agent._id)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-150
                  ${active
                    ? 'border-[#00AEEF]/35 bg-[#00AEEF]/8 shadow-[0_0_12px_rgba(0,174,239,0.08)]'
                    : 'border-surface-700/50 bg-surface-800/30 hover:bg-surface-800/70 hover:border-surface-600'
                  }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad}
                                 flex items-center justify-center text-xs font-bold text-white flex-shrink-0
                                 ring-1 ${active ? 'ring-[#00AEEF]/40' : 'ring-black/20'} transition-all`}>
                  {agent.name?.charAt(0).toUpperCase() ?? '?'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate transition-colors
                                 ${active ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {agent.name}
                  </p>
                  <p className="text-[10px] text-slate-600 truncate">{agent.email}</p>
                </div>

                {/* Selection indicator */}
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all
                  ${active
                    ? 'bg-[#00AEEF] border-[#00AEEF]'
                    : 'border-surface-600 group-hover:border-surface-500'
                  }`}>
                  {active && <Check size={9} className="text-white" strokeWidth={3} />}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

const INITIAL = {
  title: '', description: '', department_tag: '', priority: 'MEDIUM',
  issue_tags: [], customer_name: '', customer_email: '', customer_phone: '',
  charger_id: '', session_id: '',
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0 },
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CreateTicket() {
  const navigate  = useNavigate()
  const user      = getUser()

  const [form,       setForm]       = useState(INITIAL)
  const [errors,     setErrors]     = useState({})
  const [files,      setFiles]      = useState([])
  const [fileErrs,   setFileErrs]   = useState([])
  const [assignedTo, setAssignedTo] = useState('')
  const [uploading,      setUploading]      = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analyzing,  setAnalyzing]  = useState(false)
  const [aiUsed,     setAiUsed]     = useState(false)
  const [aiError,    setAiError]    = useState('')

  const { createTicket, loading, error: apiError } = useTicketMutations((ticket) => {
    navigate(`/tickets/${ticket._id}`)
  })

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const analyzeWithAI = async () => {
    if (!form.description.trim()) return
    setAnalyzing(true)
    setAiError('')
    try {
      const res  = await api.analyze(form.description.trim(), false)
      const { analysis } = res.data
      setForm((p) => ({
        ...p,
        title:          analysis.classified_issue || p.title,
        priority:       analysis.suggested_priority || p.priority,
        department_tag: analysis.suggested_dept    || p.department_tag,
        issue_tags:     analysis.issue_tags?.length ? analysis.issue_tags : p.issue_tags,
      }))
      setAiUsed(true)
    } catch {
      setAiError('AI analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const toggleTag = (tag) =>
    setForm((p) => ({
      ...p,
      issue_tags: p.issue_tags.includes(tag)
        ? p.issue_tags.filter((t) => t !== tag)
        : [...p.issue_tags, tag],
    }))

  const addFiles = useCallback((incoming, errs) => {
    const withPreview = incoming.map((f) =>
      Object.assign(f, { preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null })
    )
    setFiles((prev) => [...prev, ...withPreview])
    if (errs?.length) setFileErrs(errs)
  }, [])

  const removeFile = (idx) => {
    setFiles((prev) => {
      const f = prev[idx]
      if (f.preview) URL.revokeObjectURL(f.preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title          = 'Title is required'
    if (!form.description.trim()) e.description    = 'Description is required'
    if (!form.department_tag)     e.department_tag = 'Select a department'
    if (form.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email))
      e.customer_email = 'Invalid email'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    let uploadedAttachments = []
    const pendingFiles = files.filter((f) => !f.uploaded)

    if (pendingFiles.length) {
      setUploading(true)
      try {
        const fd = new FormData()
        pendingFiles.forEach((f) => fd.append('files', f))
        const res = await api.uploadFiles(fd, setUploadProgress)
        uploadedAttachments = res.data.data
        setFiles((prev) => prev.map((f) => f.uploaded ? f : { ...f, uploaded: true }))
      } catch {
        setFileErrs(['File upload failed. Please try again.'])
        setUploading(false)
        return
      }
      setUploading(false)
    }

    await createTicket({
      title:          form.title.trim(),
      description:    form.description.trim(),
      department_tag: form.department_tag,
      priority:       form.priority,
      issue_tags:     form.issue_tags,
      customer: {
        name:  form.customer_name.trim()  || undefined,
        email: form.customer_email.trim() || undefined,
        phone: form.customer_phone.trim() || undefined,
      },
      related_entities: {
        charger_id: form.charger_id.trim() || undefined,
        session_id: form.session_id.trim() || undefined,
      },
      attachments: uploadedAttachments,
      ...(assignedTo ? { assigned_to: assignedTo } : {}),
    })
  }

  const pm = PRIORITY_META[form.priority]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show"
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate('/tickets/list')}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-surface-700/60
                       text-slate-500 hover:text-white hover:border-surface-600 hover:bg-surface-800
                       transition-all flex-shrink-0"
          >
            <ArrowLeft size={15} />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-white">Create Support Ticket</h1>
            <p className="text-[11px] text-slate-500 mt-0.5">Fill in all required fields to open a new ticket</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <StepBadge n={1} label="Details"     active done={!!form.title && !!form.department_tag} />
            <div className="w-5 h-px bg-surface-700" />
            <StepBadge n={2} label="Assign"      active={!!form.title} done={!!assignedTo} />
            <div className="w-5 h-px bg-surface-700" />
            <StepBadge n={3} label="Customer"    active={!!form.title} done={!!form.customer_name || !!form.customer_email} />
            <div className="w-5 h-px bg-surface-700" />
            <StepBadge n={4} label="Files"       active={!!form.title} done={files.length > 0} />
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left: main fields ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Ticket details card */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.07 }}>
              <GlassCard topColor="via-[#00AEEF]/30">
                <CardHeader icon={FileText} label="Ticket Details" />
                <div className="p-6 flex flex-col gap-5">

                  <Field label="Title" required error={errors.title} hint={`${form.title.length}/120`}>
                    <input
                      type="text" maxLength={120}
                      placeholder="Brief description of the issue"
                      value={form.title} onChange={set('title')}
                      className={inputCls(!!errors.title)}
                    />
                  </Field>

                  <Field label="Description" required error={errors.description}
                         hint={`${form.description.length} chars`}>
                    <textarea
                      rows={5}
                      placeholder="Detailed explanation — steps to reproduce, impact, expected vs actual behavior…"
                      value={form.description} onChange={set('description')}
                      className={`${inputCls(!!errors.description)} resize-none`}
                    />
                  </Field>

                  {/* AI Analyze button */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={analyzeWithAI}
                      disabled={analyzing || !form.description.trim()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold
                                 bg-violet-500/10 border border-violet-500/30 text-violet-300
                                 hover:bg-violet-500/20 hover:border-violet-500/50
                                 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      {analyzing
                        ? <Loader2 size={13} className="animate-spin" />
                        : <Sparkles size={13} />
                      }
                      {analyzing ? 'Analyzing…' : 'Analyze with AI'}
                    </button>
                    {aiUsed && (
                      <span className="flex items-center gap-1.5 text-xs text-violet-400">
                        <Check size={11} strokeWidth={3} /> AI suggestions applied
                      </span>
                    )}
                    {aiError && (
                      <span className="text-xs text-red-400">{aiError}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Department" required error={errors.department_tag}>
                      <div className="relative">
                        <select value={form.department_tag} onChange={set('department_tag')}
                                className={inputCls(!!errors.department_tag)}>
                          <option value="">Select…</option>
                          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </Field>
                    <Field label="Priority">
                      <div className="relative">
                        <select value={form.priority} onChange={set('priority')} className={inputCls(false)}>
                          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </Field>
                  </div>

                  {/* Priority indicator */}
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ring-1 w-fit text-xs font-semibold
                                   ${pm.color} ${pm.ring} ${pm.bg}`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${pm.dot}`} />
                    <span>{form.priority} — {pm.desc}</span>
                  </div>

                  {/* Issue tags */}
                  <Field label="Issue Tags" hint="Select all that apply">
                    <div className="flex flex-wrap gap-2">
                      {ISSUE_TAGS.map((tag) => {
                        const active = form.issue_tags.includes(tag)
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                        border transition-all
                              ${active
                                ? 'bg-[#00AEEF]/12 border-[#00AEEF]/40 text-[#00AEEF] shadow-[0_0_8px_rgba(0,174,239,0.12)]'
                                : 'bg-surface-800/40 border-surface-700/50 text-slate-500 hover:border-surface-600 hover:text-slate-300'
                              }`}
                          >
                            {active && <Check size={10} strokeWidth={3} />}
                            {tag.replace(/_/g, ' ')}
                          </button>
                        )
                      })}
                    </div>
                  </Field>
                </div>
              </GlassCard>
            </motion.div>

            {/* Attachments card */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.13 }}>
              <GlassCard topColor="via-purple-500/25">
                <CardHeader
                  icon={Paperclip} label="Attachments"
                  iconBg="bg-purple-500/10" iconColor="text-purple-400"
                  badge={files.length > 0 && (
                    <span className="text-[10px] text-slate-600 font-mono">{files.length}/{MAX_FILES}</span>
                  )}
                />
                <div className="p-6">
                  <FileUploadZone
                    files={files}
                    onAdd={addFiles}
                    onRemove={removeFile}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                  />
                  {fileErrs.length > 0 && (
                    <div className="mt-3 flex flex-col gap-1.5">
                      {fileErrs.map((e, i) => (
                        <p key={i} className="flex items-center gap-1.5 text-xs text-red-400">
                          <X size={11} className="flex-shrink-0" /> {e}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="flex flex-col gap-5">

            {/* Created by */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.07 }}>
              <GlassCard topColor="via-emerald-500/25">
                <CardHeader icon={User} label="Created By" iconBg="bg-emerald-500/10" iconColor="text-emerald-400" />
                <div className="p-5">
                  {user ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#00AEEF]/15 text-[#00AEEF] font-bold
                                      flex items-center justify-center text-sm flex-shrink-0 ring-1 ring-[#00AEEF]/20">
                        {user.name?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">{user.name ?? 'Unknown'}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-full
                                         bg-[#00AEEF]/10 text-[#00AEEF] border border-[#00AEEF]/20 capitalize">
                          {user.role ?? 'operator'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600">Not logged in</p>
                  )}
                  <p className="flex items-center gap-1.5 text-xs text-slate-700 mt-3.5">
                    <Info size={11} /> Auto-populated from your session
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Assign Agent */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.1 }}>
              <GlassCard topColor="via-[#00AEEF]/30">
                <CardHeader
                  icon={UserCheck} label="Assign Agent"
                  iconBg="bg-[#00AEEF]/10" iconColor="text-[#00AEEF]"
                  badge={
                    assignedTo
                      ? <span className="text-[10px] font-semibold text-[#00AEEF] bg-[#00AEEF]/10 border border-[#00AEEF]/20 px-2 py-0.5 rounded-lg">Assigned</span>
                      : <span className="text-[10px] text-slate-600 bg-surface-800 border border-surface-700/50 px-2 py-0.5 rounded-lg">Optional</span>
                  }
                />
                <div className="p-4">
                  <AgentPicker selected={assignedTo} onSelect={setAssignedTo} />
                </div>
              </GlassCard>
            </motion.div>

            {/* Customer info */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.13 }}>
              <GlassCard topColor="via-blue-500/25">
                <CardHeader
                  icon={Users} label="Customer"
                  iconBg="bg-blue-500/10" iconColor="text-blue-400"
                  badge={<span className="text-[10px] text-slate-600 bg-surface-800 border border-surface-700/50 px-2 py-0.5 rounded-lg">Optional</span>}
                />
                <div className="p-5 flex flex-col gap-4">
                  <Field label="Name">
                    <input type="text" placeholder="Full name" value={form.customer_name}
                           onChange={set('customer_name')} className={inputCls(false)} />
                  </Field>
                  <Field label="Email" error={errors.customer_email}>
                    <input type="email" placeholder="email@example.com" value={form.customer_email}
                           onChange={set('customer_email')} className={inputCls(!!errors.customer_email)} />
                  </Field>
                  <Field label="Phone">
                    <input type="text" placeholder="+91 98765 43210" value={form.customer_phone}
                           onChange={set('customer_phone')} className={inputCls(false)} />
                  </Field>
                </div>
              </GlassCard>
            </motion.div>
            {/* API error */}
            {apiError && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                          className="flex items-start gap-3 px-4 py-3 bg-red-500/8 border border-red-500/20
                                     rounded-xl text-xs text-red-400">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                {apiError}
              </motion.div>
            )}

            {/* Submit */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.3, delay: 0.19 }}
                        className="flex flex-col gap-2.5">
              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold
                           text-white bg-[#00AEEF] rounded-2xl hover:bg-[#0099d6] transition-all
                           disabled:opacity-40 disabled:cursor-not-allowed
                           shadow-[0_0_20px_rgba(0,174,239,0.3)] hover:shadow-[0_0_28px_rgba(0,174,239,0.5)]"
              >
                {loading || uploading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    {uploading ? `Uploading… ${uploadProgress}%` : 'Creating ticket…'}
                  </>
                ) : (
                  <>
                    <Plus size={15} strokeWidth={2.5} />
                    Create Ticket
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/tickets/list')}
                className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-300
                           border border-surface-700/60 hover:border-surface-600 rounded-2xl transition-all"
              >
                Cancel
              </button>
            </motion.div>

          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
