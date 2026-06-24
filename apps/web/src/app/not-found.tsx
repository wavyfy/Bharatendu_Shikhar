import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-4xl font-medium text-red-600 dark:text-news-accent mb-4">404 - Not Found</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
        The page or article you are looking for does not exist or has been removed.
      </p>
      <Link 
        href="/"
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
