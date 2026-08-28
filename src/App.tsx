import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import { ToastProvider } from './shared/ui/Toast';
import { ErrorBoundary } from './app/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ErrorBoundary>
  );
}
