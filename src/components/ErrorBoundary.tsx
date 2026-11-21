import React from 'react';

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message || 'An unexpected error occurred.' };
  }

  componentDidCatch(error: Error) {
    console.error('AGLA KADAM ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F4EC] text-[#30342F] flex items-center justify-center p-6">
          <div className="max-w-lg w-full border border-[#D9CFC0] bg-[#FCFBF7] p-8 space-y-4">
            <p className="text-xs tracking-widest uppercase text-[#B87961]">Application Notice</p>
            <h1 className="font-serif text-2xl text-[#34483D]">Something interrupted this view</h1>
            <p className="text-sm text-[#5C625A] leading-relaxed">
              We encountered an unexpected error while loading your data. Your saved work remains safe.
            </p>
            <div className="text-xs text-[#5C625A] bg-[#E9E2D5]/60 p-3 break-words">
              {this.state.message.slice(0, 280)}
            </div>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, message: '' });
                window.location.reload();
              }}
              className="px-5 py-2.5 text-sm font-medium bg-[#34483D] text-[#F7F4EC] hover:bg-[#26362D] transition-colors"
            >
              Reload AGLA KADAM
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
