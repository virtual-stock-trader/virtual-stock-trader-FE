import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthProvider'
import ProtectedRoute from './components/ui/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import DashboardPage from './pages/DashboardPage'
import StockDetailPage from './pages/StockDetailPage'
import StockListPage from './pages/StockListPage'
import PortfolioPage from './pages/PortfolioPage'
import TransactionHistoryPage from './pages/TransactionHistoryPage'
import InvestmentSettingsPage from './pages/InvestmentSettingsPage'
import OnboardingPage from './pages/OnboardingPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/auth/callback' element={<AuthCallbackPage />} />
            <Route
              path='/onboarding'
              element={
                <ProtectedRoute requireOnboarded={false}>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/stocks'
              element={
                <ProtectedRoute>
                  <StockListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/stock/:code'
              element={
                <ProtectedRoute>
                  <StockDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/portfolio'
              element={
                <ProtectedRoute>
                  <PortfolioPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/transactions'
              element={
                <ProtectedRoute>
                  <TransactionHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/settings/investment'
              element={
                <ProtectedRoute>
                  <InvestmentSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<Navigate to='/login' replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
