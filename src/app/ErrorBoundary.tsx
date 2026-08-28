import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../shared/ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Expense Manager crashed:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--color-paper)] px-6">
        <div className="max-w-sm text-center">
          <AlertTriangle size={32} className="mx-auto mb-3 text-[var(--color-berry)]" />
          <h1 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)] mb-1.5">
            Something went wrong
          </h1>
          <p className="text-sm text-[var(--color-ink-soft)] mb-5">
            Your data is safe on this device — it's stored independently of this screen. Reloading usually fixes it.
          </p>
          <Button onClick={() => window.location.reload()}>Reload the app</Button>
        </div>
      </div>
    );
  }
}
