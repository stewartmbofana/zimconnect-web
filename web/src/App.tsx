import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './auth/AuthProvider'
import { AdminRoute } from './router/AdminRoute'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { OfflineBanner } from './components/OfflineBanner'
import { UpdatePrompt } from './components/UpdatePrompt'
import { HomePage } from './pages/HomePage'
import { DirectoryPage } from './pages/DirectoryPage'
import { CivicPage } from './pages/CivicPage'
import { SubmitPage } from './pages/SubmitPage'
import { NotFoundPage } from './pages/NotFoundPage'

// Admin shell is lazy-loaded — never included in the public bundle
const AdminShell = lazy(() =>
  import('./pages/admin/AdminShell').then((m) => ({ default: m.AdminShell }))
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
})

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <OfflineBanner />
      <UpdatePrompt />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/directory" element={<PublicLayout><DirectoryPage /></PublicLayout>} />
            <Route path="/civic" element={<PublicLayout><CivicPage /></PublicLayout>} />
            <Route path="/submit" element={<PublicLayout><SubmitPage /></PublicLayout>} />

            {/*
              Admin route — concealed.
              AdminRoute renders a standard 404 for unauthorized visitors.
              AdminShell is lazy-loaded so its JS chunk never reaches public users.
            */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <Suspense fallback={null}>
                    <AdminShell />
                  </Suspense>
                </AdminRoute>
              }
            />

            {/* All other routes render a standard 404 */}
            <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
