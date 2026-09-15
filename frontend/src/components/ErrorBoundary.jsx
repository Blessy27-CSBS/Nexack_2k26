import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('NEXACK 2K26 Uncaught Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07080d] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-lg shadow-rose-500/10">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 mb-3">
            Application Error
          </span>

          <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight uppercase mb-3">
            Something Went Wrong
          </h1>

          <p className="text-slate-400 max-w-md text-sm sm:text-base mb-6">
            An unexpected error occurred while loading this view. Try refreshing the page or returning home.
          </p>

          {this.state.error && (
            <div className="max-w-xl w-full p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs font-mono text-rose-300 overflow-x-auto mb-6">
              <p className="font-bold mb-1">{this.state.error.toString()}</p>
              <pre className="text-[11px] text-slate-400 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-sm flex items-center gap-2 hover:bg-cyan-400 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>

            <button
              onClick={this.handleGoHome}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
