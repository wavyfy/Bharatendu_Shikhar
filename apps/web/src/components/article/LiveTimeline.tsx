"use client";

import type { Database } from "@repo/api";

type LiveUpdate = Database["public"]["Tables"]["article_live_updates"]["Row"];

export function LiveTimeline({ updates }: { updates: LiveUpdate[] }) {
  if (!updates || updates.length === 0) return null;

  // Sort updates by created_at descending (newest first)
  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="mt-12 relative">
      {/* Vertical Timeline Line */}
      <div className="absolute left-[7px] top-3 bottom-0 w-[2px] bg-black dark:bg-gray-400" />

      <div className="flex flex-col gap-10">
        {sortedUpdates.map((update) => (
          <div key={update.id} className="relative pl-8 md:pl-12">
            {/* Timeline Dot */}
            <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-black dark:bg-gray-400" />

           {/* Date Button (styled like ePaper button) */}
              <div className="border border-red-600 text-red-600 rounded-full px-5 py-1.5 text-xs font-medium inline-block mb-4">
                {new Date(update.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(update.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </div>

            {/* Content */}
            <div className="flex flex-col items-start">
              <h2 className="text-2xl md:text-3xl font-bold font-playfair text-black dark:text-white leading-tight mb-3">
                {update.headline}
              </h2>

            

              <div
                className="prose prose-lg md:prose-[21px] max-w-none dark:prose-invert prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-[1.8] prose-a:text-red-600 dark:prose-a:text-news-accent"
                dangerouslySetInnerHTML={{ __html: update.content }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
