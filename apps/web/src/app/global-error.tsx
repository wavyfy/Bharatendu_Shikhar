"use client";

/**
 * Renders a global error fallback UI for critical system errors.
 *
 * Displays a page with a "Critical System Error" message and a button that triggers recovery by calling the `reset` callback.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Critical System Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            A critical error occurred. Please try reloading the page.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
