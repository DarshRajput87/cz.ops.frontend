export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(circle at 20% 0%, rgba(158,37,50,0.08) 0%, transparent 50%),' +
            'radial-gradient(circle at 85% 100%, rgba(158,37,50,0.04) 0%, transparent 50%)',
        }}
      />
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  )
}
