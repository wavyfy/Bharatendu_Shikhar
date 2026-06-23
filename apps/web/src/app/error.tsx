"use client";

import { useEffect } from "react";

/**
 * Error boundary component that displays a fallback interface and allows users to attempt recovery from errors.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service securely
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Oops! Something went wrong.</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        An unexpected error occurred. We have been notified and are looking into it.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
