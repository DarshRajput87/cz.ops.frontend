import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'

const SIDEBAR_WIDTH = 260
const NAVBAR_HEIGHT = 64

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <Sidebar width={SIDEBAR_WIDTH} />
      <div style={{ marginLeft: SIDEBAR_WIDTH }} className="flex flex-col min-h-screen">
        <Navbar height={NAVBAR_HEIGHT} sidebarWidth={SIDEBAR_WIDTH} />
        <main className="flex-1 px-8 lg:px-10 py-8" style={{ marginTop: NAVBAR_HEIGHT }}>
          <div className="max-w-[1440px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
