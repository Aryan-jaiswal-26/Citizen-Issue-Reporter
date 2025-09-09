'use client'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  onLogout: () => void
}

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'issues', name: 'Issues', icon: '🚨' },
    { id: 'assignments', name: 'Assignments', icon: '📋' },
    { id: 'reports', name: 'Reports', icon: '📈' },
    { id: 'analytics', name: 'Analytics', icon: '📉' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ]

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center h-16 bg-indigo-600">
          <div className="flex items-center">
            <div className="text-white text-2xl mr-2">🏛️</div>
            <span className="text-white text-xl font-bold">CivicAuth</span>
          </div>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <span className="mr-3 text-lg">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </>
  )
}