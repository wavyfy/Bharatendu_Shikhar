import Link from "next/link";
import Image from "next/image";

export function Footer({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <footer className="bg-white dark:bg-news-card text-black dark:text-news-text border-t border-gray-200 dark:border-news-border pt-16 pb-8 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4">
        
        <div className="mb-10">
          {logoUrl ? (
            <Image 
              src={logoUrl.startsWith("http") ? logoUrl : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${logoUrl}`} 
              alt="Bharatendu Shikhar Logo" 
              width={240} 
              height={60} 
              className="object-contain object-left"
            />
          ) : (
            <h2 className="text-3xl font-bold uppercase tracking-tight">BHARATENDU SHIKHAR</h2>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          
          {/* Main Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* News */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-[15px] mb-2">News</h3>
              <Link href="/" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Home Page</Link>
              <Link href="/india" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">India</Link>
              <Link href="/world" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">World</Link>
              <Link href="/politics" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Politics</Link>
              <Link href="/shimla" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Shimla</Link>
              <Link href="/auli" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Auli</Link>
              <Link href="/mandi" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Mandi</Link>
              <Link href="/technology" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Tech</Link>
              <Link href="/science" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Science</Link>
              <Link href="/weather" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Weather</Link>
              <Link href="/business" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Business</Link>
            </div>

            {/* Arts */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-[15px] mb-2">Arts</h3>
              <Link href="/arts/book-review" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Book Review</Link>
              <Link href="/arts/dance" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Dance</Link>
              <Link href="/arts/movies" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Movies</Link>
              <Link href="/arts/pop-culture" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Pop Culture</Link>
              <Link href="/arts/music" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Music</Link>
              <Link href="/arts/theatre" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Theatre</Link>
              <Link href="/arts/television" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Television</Link>
              <Link href="/arts/visual-arts" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Visual Arts</Link>
            </div>

            {/* Opinion */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-[15px] mb-2">Opinion</h3>
              <Link href="/opinion/todays" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Today&apos;s Opinion</Link>
              <Link href="/opinion/editorial" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Editorial</Link>
              <Link href="/opinion/letters" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Letters</Link>
              <Link href="/opinion/sunday" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Sunday Opinions</Link>
              <Link href="/opinion/videos" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Opinion Videos</Link>
              <Link href="/opinion/images" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Opinion Images</Link>
              <Link href="/opinion/guest" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Guest Essays</Link>
              <Link href="/opinion/weekend" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Weekend Opinions</Link>
            </div>

            {/* Lifestyle */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-[15px] mb-2">Lifestyle</h3>
              <Link href="/lifestyle/health" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Health</Link>
              <Link href="/lifestyle/well" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Well</Link>
              <Link href="/lifestyle/food" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Food</Link>
              <Link href="/lifestyle/love" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Love</Link>
              <Link href="/lifestyle/travel" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Travel</Link>
              <Link href="/lifestyle/style" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Style</Link>
              <Link href="/lifestyle/fashion" className="text-[13px] text-gray-700 dark:text-news-text-secondary hover:text-black dark:hover:text-white">Fashion</Link>
            </div>
            
          </div>

          {/* Right Sidebar - Account & Follow Us */}
          <div className="flex flex-col lg:border-l lg:border-gray-200 dark:lg:border-news-border lg:pl-10">
            
            {/* Account */}
            <div className="mb-10">
              <h3 className="font-bold text-[15px] mb-4">Account</h3>
              <div className="flex flex-col gap-3 text-[13px] text-gray-700 dark:text-news-text-secondary">
                <Link href="/contact" className="hover:text-black dark:hover:text-white">Contact</Link>
                <p>Email : hamzaalimazari@lyari.com</p>
                <p>Phone : 420420420420</p>
              </div>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="font-bold text-[15px] mb-4">Follow Us :</h3>
              <div className="flex flex-col gap-3 text-[13px] text-gray-700 dark:text-news-text-secondary">
                <Link href="#" className="hover:text-black dark:hover:text-white">Instagram -</Link>
                <Link href="#" className="hover:text-black dark:hover:text-white">Youtube -</Link>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Border */}
        <div className="h-px w-full bg-gray-300 dark:bg-news-border my-10"></div>

        {/* Bottom Buttons */}
        <div className="flex justify-end gap-4">
          <Link href="/epaper" className="border border-red-600 text-red-600 hover:bg-red-50 rounded-full px-6 py-2 text-sm font-medium transition-colors">
            Read ePaper
          </Link>
          <Link href="/app" className="bg-red-600 text-white hover:bg-red-700 rounded-full px-6 py-2 text-sm font-medium transition-colors">
            Get the App
          </Link>
        </div>

      </div>
    </footer>
  );
}
