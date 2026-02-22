import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { QuizProvider } from './context/QuizContext'
import { ResultsProvider } from './context/ResultsContext'
import { UserProvider } from './context/UserContext'
import AppShell from './components/layout/AppShell'
import ErrorBoundary from './components/shared/ErrorBoundary'

const QuizPage = lazy(() => import('./routes/QuizPage'))
const ResultsPage = lazy(() => import('./routes/ResultsPage'))
const DispensaryPage = lazy(() => import('./routes/DispensaryPage'))
const DashboardPage = lazy(() => import('./routes/DashboardPage'))
const JournalPage = lazy(() => import('./routes/JournalPage'))
const ComparePage = lazy(() => import('./routes/ComparePage'))
const LearnPage = lazy(() => import('./routes/LearnPage'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 rounded-full border-2 border-leaf-500/20 border-t-leaf-500 animate-spin-slow" />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <UserProvider>
          <QuizProvider>
            <ResultsProvider>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route element={<AppShell />}>
                    <Route index element={<QuizPage />} />
                    <Route path="results" element={<ResultsPage />} />
                    <Route path="dispensaries" element={<DispensaryPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="journal" element={<JournalPage />} />
                    <Route path="compare" element={<ComparePage />} />
                    <Route path="learn" element={<LearnPage />} />
                    <Route path="learn/:topic" element={<LearnPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </ResultsProvider>
          </QuizProvider>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
