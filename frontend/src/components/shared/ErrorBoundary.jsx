import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mb-4" />
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-[#e8f0ea]">Something went wrong</h2>
          <p className="text-sm text-gray-500 dark:text-[#6a7a6e] mb-4 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button variant="secondary" onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
