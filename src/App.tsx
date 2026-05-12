import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import StockDetailPage from './pages/StockDetailPage'
import StockListPage from './pages/StockListPage'
import PortfolioPage from './pages/PortfolioPage'
import TransactionHistoryPage from './pages/TransactionHistoryPage'
import InvestmentSettingsPage from './pages/InvestmentSettingsPage'
import OnboardingPage from './pages/OnboardingPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/stock/:code" element={<StockDetailPage />} />
        <Route path="/stocks" element={<StockListPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/transactions" element={<TransactionHistoryPage />} />
        <Route path="/settings/investment" element={<InvestmentSettingsPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
