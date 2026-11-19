import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary catches unhandled React rendering errors and displays
 * a graceful fallback instead of crashing the entire application.
 * This is essential for resilient production applications.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[AuraShield ErrorBoundary] Caught rendering error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-slate-950 flex items-center justify-center p-8"
        >
          <div className="max-w-md w-full bg-slate-900 border border-rose-700/50 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-950 border border-rose-600/50 flex items-center justify-center text-rose-400 text-3xl">
              ⚠
            </div>
            <h1 className="text-xl font-bold text-white mb-2">
              Something Went Wrong
            </h1>
            <p className="text-sm text-slate-300 mb-4">
              {this.props.fallbackMessage ||
                'AuraShield encountered an unexpected error. Your data is safe.'}
            </p>
            <p className="text-xs text-slate-500 font-mono bg-slate-950 p-3 rounded-lg mb-4 text-left break-all">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
