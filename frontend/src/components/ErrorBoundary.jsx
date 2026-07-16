import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f3f2ef] flex flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Something went wrong</h1>
          <p className="text-gray-600 text-sm max-w-md">
            The page ran into an unexpected error. Try refreshing, or go back to the home page.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700"
            >
              Refresh page
            </button>
            <Link
              to="/"
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              Go to Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
