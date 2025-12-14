import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: "2rem", 
          fontFamily: "sans-serif",
          color: "red",
          backgroundColor: "#fee",
          border: "2px solid red",
          borderRadius: "8px",
          margin: "2rem"
        }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message || "Unknown error"}</p>
          <pre style={{ 
            background: "#fff", 
            padding: "1rem", 
            overflow: "auto",
            fontSize: "12px"
          }}>
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              marginTop: "1rem",
              cursor: "pointer"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
