"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#111] font-sans">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&display=swap');

          .font-playfair {
            font-family: 'Playfair Display', serif;
          }

          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }

          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `,
        }}
      />

      {/* Header */}
      <header className="py-5 md:py-8 border-b-4 border-black px-4 md:px-8 max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center mb-5 md:hidden text-[10px] font-bold tracking-widest text-gray-600 border-b border-gray-300 pb-2 uppercase">
          <span>7 मई 2026</span>
          <span>राष्ट्रीय संस्करण</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="hidden md:block text-xs tracking-wide font-semibold text-gray-600 w-48 text-left">
            7 मई 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-black font-playfair tracking-tight text-center flex-1 py-1 md:py-0">
            भरतेंदु शिखर
          </h1>

          <div className="hidden md:block text-xs tracking-wide font-semibold text-gray-600 w-48 text-right">
            राष्ट्रीय संस्करण
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#CC2200] text-white relative">
        <div className="max-w-screen-2xl mx-auto flex flex-row items-center justify-between px-4 md:px-8 py-3 md:py-4">
          <button
            className="md:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="block w-5 h-[2px] bg-white"></span>
            <span className="block w-5 h-[2px] bg-white"></span>
            <span className="block w-5 h-[2px] bg-white"></span>
          </button>

          <div className="hidden md:flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-bold tracking-wider">
            <a href="#">राजनीति</a>
            <a href="#">रक्षा</a>
            <a href="#">विश्व</a>
            <a href="#">शिक्षा</a>
            <a href="#">राष्ट्रीय</a>
            <a href="#">तकनीक</a>
          </div>

          <button className="bg-white text-[#CC2200] px-4 py-1.5 text-[10px] font-black tracking-widest">
            सदस्यता लें
          </button>
        </div>

        <div
          className={`md:hidden absolute top-full left-0 w-full bg-[#B31E00] z-50 transition-all duration-300 overflow-hidden ${isMenuOpen ? "max-h-96" : "max-h-0"
            }`}
        >
          <div className="flex flex-col px-4 py-2 text-xs font-bold tracking-wider">
            <a href="#" className="py-3 border-b border-white/10">राजनीति</a>
            <a href="#" className="py-3 border-b border-white/10">रक्षा</a>
            <a href="#" className="py-3 border-b border-white/10">विश्व</a>
            <a href="#" className="py-3 border-b border-white/10">शिक्षा</a>
            <a href="#" className="py-3">राष्ट्रीय</a>
          </div>
        </div>
      </nav>

      {/* Breaking News */}
      <div className="border-b border-black">
        <div className="max-w-screen-2xl mx-auto py-3 px-4 md:px-8 flex items-center text-xs">
          <span className="text-[#CC2200] font-bold whitespace-nowrap mr-6">
            ताज़ा ख़बरें
          </span>

          <div className="overflow-x-auto hide-scrollbar whitespace-nowrap flex-1 flex items-center text-gray-800">
            <span className="mr-6 hover:underline cursor-pointer">
              वंदे मातरम् को राष्ट्रगान के बराबर दर्जा देने का फैसला
            </span>

            <span className="text-[#CC2200] mr-6">•</span>

            <span className="mr-6 hover:underline cursor-pointer">
              भारत खरीदेगा S-400 के 5 नए स्क्वाड्रन
            </span>

            <span className="text-[#CC2200] mr-6">•</span>

            <span className="hover:underline cursor-pointer">
              हिमाचल में 100 से अधिक स्कूल मर्ज करने की तैयारी
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <main className="max-w-screen-2xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-12">

        {/* Left Sidebar */}
        <section className="col-span-12 lg:col-span-3 flex flex-col gap-8">
          <div className="border-b-2 border-black pb-2">
            <h2 className="text-[10px] font-bold uppercase tracking-widest">
              संक्षेप में
            </h2>
          </div>

          <article>
            <div className="text-[#CC2200] text-[10px] font-bold mb-3 tracking-widest">
              राजनीति
            </div>

            <h3 className="font-playfair font-bold text-xl leading-tight mb-4">
              वंदे मातरम् को राष्ट्रगान के बराबर दर्जा
            </h3>

            <p className="text-xs text-gray-700 leading-relaxed">
              केंद्र सरकार ने राष्ट्रीय सम्मान कानून में संशोधन का प्रस्ताव मंजूर किया।
            </p>
          </article>

          <div className="border-t border-gray-300"></div>

          <article>
            <div className="text-[#CC2200] text-[10px] font-bold mb-3 tracking-widest">
              रक्षा
            </div>

            <h3 className="font-playfair font-bold text-xl leading-tight mb-4">
              भारत खरीदेगा S-400 के 5 नए स्क्वाड्रन
            </h3>

            <p className="text-xs text-gray-700 leading-relaxed">
              रूस के साथ बड़े रक्षा समझौते पर तेजी से प्रगति जारी।
            </p>
          </article>

          <div className="border-t border-gray-300"></div>

          <article>
            <div className="text-[#CC2200] text-[10px] font-bold mb-3 tracking-widest">
              शिक्षा
            </div>

            <h3 className="font-playfair font-bold text-xl leading-tight mb-4">
              हिमाचल में 100 से अधिक स्कूल मर्ज होंगे
            </h3>

            <p className="text-xs text-gray-700 leading-relaxed">
              कम छात्र संख्या वाले स्कूलों को बड़े संस्थानों में समाहित किया जाएगा।
            </p>
          </article>
        </section>

        {/* Center Content */}
        <section className="col-span-12 lg:col-span-6 px-0 lg:px-8 border-x border-gray-300">
          <div className="mb-6">
            <span className="bg-[#CC2200] text-white text-[10px] font-bold px-2.5 py-1 tracking-widest inline-block">
              विशेष
            </span>
          </div>

          <h1 className="font-playfair font-black text-3xl md:text-5xl leading-[1.15] mb-8">
            वंदे मातरम् को राष्ट्रगान के बराबर दर्जा, अपमान पर होगी सजा
          </h1>

          <p className="text-lg text-gray-700 border-l-4 border-[#CC2200] pl-6 mb-10 italic leading-relaxed">
            केंद्र सरकार ने राष्ट्रीय सम्मान कानून में संशोधन कर वंदे मातरम् को नई संवैधानिक मान्यता देने का निर्णय लिया है।
          </p>

          <div className="w-full aspect-video relative mb-10 overflow-hidden bg-gray-200">
            <Image
              src="https://picsum.photos/id/1011/1000/600"
              alt="News"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t-2 border-black pt-8">
            {/* Market */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-3 mb-5">
                मार्केट वॉच
              </h3>

              <ul className="text-xs space-y-4 mb-6 font-bold">
                <li className="flex justify-between border-b border-gray-200 pb-3">
                  <span>सेंसेक्स</span>
                  <span className="text-green-600">77,959</span>
                </li>

                <li className="flex justify-between border-b border-gray-200 pb-3">
                  <span>निफ्टी</span>
                  <span className="text-green-600">22,331</span>
                </li>

                <li className="flex justify-between border-b border-gray-200 pb-3">
                  <span>सोना</span>
                  <span className="text-[#CC2200]">1,51,000</span>
                </li>
              </ul>
            </div>

            {/* World */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-3 mb-5">
                विश्व समाचार
              </h3>

              <div className="space-y-6 text-xs">
                <article>
                  <h4 className="font-bold mb-2">
                    अमेरिका ने प्रोजेक्ट फ्रीडम ऑपरेशन रोका
                  </h4>

                  <p className="text-gray-600">
                    ईरान के साथ बातचीत के बीच अमेरिका ने अस्थायी रोक की घोषणा की।
                  </p>
                </article>

                <article>
                  <h4 className="font-bold mb-2">
                    टेक्सास में गोलीबारी, दो की मौत
                  </h4>

                  <p className="text-gray-600">
                    पुलिस ने संदिग्ध को हिरासत में लिया।
                  </p>
                </article>
              </div>
            </div>

            {/* Editors */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-3 mb-5">
                संपादक की पसंद
              </h3>

              <div className="space-y-5 text-xs">
                <article>
                  <h4 className="font-bold mb-2">
                    पंजाब में IED ब्लास्ट के बाद हाई अलर्ट
                  </h4>

                  <p className="text-gray-600">
                    सुरक्षा एजेंसियों ने जांच तेज की।
                  </p>
                </article>

                <div className="border-t border-gray-300"></div>

                <article>
                  <h4 className="font-bold mb-2">
                    बिहार कैबिनेट विस्तार की तैयारी तेज
                  </h4>

                  <p className="text-gray-600">
                    कई नए मंत्रियों के शामिल होने की संभावना।
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar */}
        <section className="col-span-12 lg:col-span-3 flex flex-col gap-8">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-3 mb-5">
              राष्ट्रीय
            </h3>

            <article className="mb-6">
              <h4 className="font-playfair font-bold text-2xl leading-tight mb-3">
                बिहार में कैबिनेट विस्तार की तैयारी
              </h4>

              <p className="text-xs text-gray-700 leading-relaxed">
                कई नेताओं के शपथ लेने की संभावना, बड़े राजनीतिक चेहरे मौजूद रहेंगे।
              </p>
            </article>

            <div className="border-t border-gray-300 pt-6">
              <article>
                <h4 className="font-bold text-sm leading-snug mb-2">
                  तमिलनाडु में सरकार गठन को लेकर हलचल तेज
                </h4>

                <p className="text-[11px] text-gray-600 leading-relaxed">
                  बहुमत के लिए अतिरिक्त समर्थन जुटाने की कोशिश जारी।
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
