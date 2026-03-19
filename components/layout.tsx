'use client'

import { Sidebar } from './sidebar'
import { Header } from './header'
import { Dashboard } from './dashboard'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
export function Layout() {

  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('id')

    if (!user) {
      router.replace('/login')
    }
  }, [])

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title={''} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto bg-orange-50">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}
