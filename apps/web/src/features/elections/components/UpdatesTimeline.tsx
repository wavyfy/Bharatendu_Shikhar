export function UpdatesTimeline({ updates }: { updates: any[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysUpdates = updates.filter(u => new Date(u.created_at) >= today);
  const previousUpdates = updates.filter(u => new Date(u.created_at) < today);


  const renderChannel = (title: string, channelUpdates: any[]) => (
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-bold text-foreground mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">{title}</h3>
      
      <div className="relative">
        {/* Vertical Timeline Line */}
        {channelUpdates.length > 0 && (
          <div className="absolute left-[7px] top-3 bottom-0 w-[2px] bg-black dark:bg-gray-400" />
        )}

        <div className="flex flex-col gap-6">
          {channelUpdates.map(update => (
            <div key={update.id} className="relative pl-8 md:pl-10">
              {/* Timeline Dot */}
              <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-black dark:bg-gray-300" />

              {/* Date Button */}
              <div className="bg-red-600 text-white rounded-full px-3 py-1 text-[11px] font-bold inline-block mb-3 -ml-2 md:-ml-6 shadow-sm">
                {new Date(update.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>

              {/* Content */}
              <div className="flex flex-col items-start w-full">
                {update.title && (
                  <h4 className="font-bold text-base text-foreground mb-1 leading-tight">
                    {update.title}
                  </h4>
                )}
                <div 
                  className="prose prose-sm max-w-none w-full dark:prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-red-600 dark:prose-a:text-news-accent" 
                  dangerouslySetInnerHTML={{ __html: update.content }} 
                />
              </div>
            </div>
          ))}
          {channelUpdates.length === 0 && (
            <div className="text-sm text-muted-foreground">No updates available.</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col sm:flex-row gap-8 bg-card p-6 h-full">
      {renderChannel("Today's Channel :", todaysUpdates)}
      {renderChannel("Previous Channel :", previousUpdates)}
    </div>
  );
}
