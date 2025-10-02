import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-red-500">
              <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Bir Hata Oluştu</h1>
              <div className="space-y-4">
                <div className="bg-red-100 p-4 rounded">
                  <h2 className="font-bold text-red-800 mb-2">Hata Mesajı:</h2>
                  <pre className="text-sm text-red-700 whitespace-pre-wrap">
                    {this.state.error?.toString()}
                  </pre>
                </div>
                {this.state.errorInfo && (
                  <div className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
                    <h2 className="font-bold text-gray-800 mb-2">Stack Trace:</h2>
                    <pre className="text-xs text-gray-700">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Sayfayı Yenile
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

