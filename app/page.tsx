import React from "react";
import Image from "next/image";

export default function NewspaperPage() {
  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#111] font-sans">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&display=swap');
          .font-playfair {
            font-family: 'Playfair Display', serif;
          }
        `,
        }}
      />

      {/* Header */}
      <header className="py-8 border-b-4 border-black flex flex-col md:flex-row items-center justify-between px-4 md:px-8 max-w-screen-2xl mx-auto">
        <div className="text-xs tracking-wide font-semibold text-gray-600 mb-3 md:mb-0 w-full md:w-48 text-center md:text-left">
          10 मई 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-black font-playfair tracking-tight text-center flex-1">
          भरतेंदु शिखर
        </h1>
        <div className="text-xs tracking-wide font-semibold text-gray-600 mt-3 md:mt-0 w-full md:w-48 text-center md:text-right">
          राष्ट्रीय संस्करण
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#CC2200] text-white">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 gap-6">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-bold tracking-wider">
            <a href="#" className="hover:underline transition-all">
              राजनीति
            </a>
            <a href="#" className="hover:underline transition-all">
              संस्कृति
            </a>
            <a href="#" className="hover:underline transition-all">
              व्यापार
            </a>
            <a href="#" className="hover:underline transition-all">
              राय
            </a>
            <a href="#" className="hover:underline transition-all">
              तकनीक
            </a>
            <a href="#" className="hover:underline transition-all">
              विज्ञान
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <button
              aria-label="Search"
              className="hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button className="bg-white text-[#CC2200] px-4 py-1.5 text-[10px] font-black tracking-widest hover:bg-gray-100 transition-colors">
              सदस्यता लें
            </button>
          </div>
        </div>
      </nav>

      {/* Breaking News Ticker */}
      <div className="border-b border-black">
        <div className="max-w-screen-2xl mx-auto py-3 px-4 md:px-8 flex items-center text-xs">
          <span className="text-[#CC2200] font-bold whitespace-nowrap mr-6">
            ताज़ा ख़बरें
          </span>
          <div className="overflow-hidden whitespace-nowrap flex-1 flex items-center text-gray-800">
            <span className="mr-6 hover:underline cursor-pointer">
              मैराथन सत्र के बाद सीनेट ने ऐतिहासिक बुनियादी ढांचा विधेयक पारित
              किया
            </span>
            <span className="text-[#CC2200] mr-6 text-base leading-none">
              •
            </span>
            <span className="mr-6 hover:underline cursor-pointer">
              नए अध्ययन से नींद के पैटर्न और याददाश्त के बीच अप्रत्याशित संबंध
              का पता चला
            </span>
            <span className="text-[#CC2200] mr-6 text-base leading-none">
              •
            </span>
            <span className="hover:underline cursor-pointer">
              आधुनिक कला संग्रहालय ने विवादास्पद पूर्वव्यापी प्रदर्शनी की घोषणा
              की...
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column */}
        <section className="col-span-12 lg:col-span-3 flex flex-col gap-8">
          <div className="border-b-2 border-black pb-2 mb-3">
            <h2 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">
              संक्षेप में
            </h2>
          </div>

          <article className="group cursor-pointer">
            <div className="text-[#CC2200] text-[10px] font-bold mb-3 tracking-widest">
              राजनीति
            </div>
            <h3 className="font-playfair font-bold text-xl leading-tight mb-4 group-hover:text-[#CC2200] transition-colors">
              मैराथन सत्र के बाद सीनेट ने ऐतिहासिक बुनियादी ढांचा विधेयक पारित
              किया
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              प्रशासन के लिए एक बड़ी जीत, जिसने देश भर में सड़कों और पुलों की
              व्यापक मरम्मत का मार्ग प्रशस्त किया।
            </p>
          </article>

          <div className="border-t border-gray-300"></div>

          <article className="group cursor-pointer">
            <div className="text-[#CC2200] text-[10px] font-bold mb-3 tracking-widest">
              विज्ञान
            </div>
            <h3 className="font-playfair font-bold text-xl leading-tight mb-4 group-hover:text-[#CC2200] transition-colors">
              नए अध्ययन से नींद के पैटर्न और याददाश्त के बीच अप्रत्याशित संबंध
              का पता चला
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              शोधकर्ताओं ने पाया कि गहरी नींद के चक्र पहले की तुलना में
              संज्ञानात्मक प्रतिधारण में अधिक महत्वपूर्ण भूमिका निभाते हैं।
            </p>
          </article>

          <div className="border-t border-gray-300"></div>

          <article className="group cursor-pointer">
            <div className="text-[#CC2200] text-[10px] font-bold mb-3 tracking-widest">
              संस्कृति
            </div>
            <h3 className="font-playfair font-bold text-xl leading-tight mb-4 group-hover:text-[#CC2200] transition-colors">
              आधुनिक कला संग्रहालय ने विवादास्पद पूर्वव्यापी प्रदर्शनी की घोषणा
              की
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              आलोचक आगामी शोकेस पर विभाजित हैं, जो मूर्तिकला रूप की पारंपरिक
              परिभाषाओं को चुनौती देता है।
            </p>
          </article>
        </section>

        {/* Center Column */}
        <section className="col-span-12 lg:col-span-6 flex flex-col px-0 lg:px-8 border-y border-transparent lg:border-x lg:border-gray-300">
          <div className="mb-6">
            <span className="bg-[#CC2200] text-white text-[10px] font-bold px-2.5 py-1 tracking-widest inline-block">
              विशेष
            </span>
          </div>

          <h1 className="font-playfair font-black text-3xl md:text-5xl leading-[1.15] mb-8 cursor-pointer hover:text-gray-800 transition-colors">
            तकनीकी नवाचारों से आर्थिक स्थिरता के नए युग का संकेत मिलने से
            वैश्विक बाजारों में तेजी
          </h1>

          <p className="text-base md:text-lg text-gray-700 border-l-4 border-[#CC2200] pl-6 mb-10 font-serif italic leading-relaxed">
            तकनीकी क्षेत्र में स्थायी विकास को बढ़ावा देने के लिए डिज़ाइन किए गए
            विनियामक परिवर्तनों की लहर के बाद निवेशक सतर्क आशावाद व्यक्त करते
            हैं।
          </p>

          <div className="w-full aspect-[16/9] relative mb-10 group overflow-hidden cursor-pointer bg-gray-200">
            <Image
              src="https://picsum.photos/id/122/800/450"
              alt="City Street Night"
              width={800}
              height={450}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Sub-columns inside center */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t-2 border-black pt-8">
            {/* Market Watch */}
            <div>
              <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest border-b border-black pb-3 mb-5">
                मार्केट वॉच
              </h3>
              <ul className="text-xs space-y-4 mb-6 font-bold">
                <li className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span>निफ्टी 50</span>{" "}
                  <span className="text-green-600">+1.2%</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span>सेंसेक्स</span>{" "}
                  <span className="text-green-600">+0.8%</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span>सोना</span>{" "}
                  <span className="text-[#CC2200]">-0.3%</span>
                </li>
              </ul>
              <h4 className="font-bold text-xs mb-3 text-gray-900 leading-snug">
                रुपये में स्थिरता, वैश्विक रुख का असर
              </h4>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                डॉलर के मुकाबले रुपया सीमित दायरे में कारोबार कर रहा है।
              </p>
            </div>

            {/* World News */}
            <div>
              <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest border-b border-black pb-3 mb-5">
                विश्व समाचार
              </h3>
              <div className="space-y-6">
                <article className="flex flex-col xl:flex-row gap-4 group cursor-pointer">
                  <div className="w-full xl:w-16 h-24 xl:h-16 shrink-0 overflow-hidden bg-gray-200">
                    <Image
                      src="https://picsum.photos/id/20/100/100"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt="News thumbnail"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs leading-snug mb-2 group-hover:text-[#CC2200] transition-colors">
                      जलवायु शिखर सम्मेलन में नए संकल्प
                    </h4>
                    <p className="text-[10px] text-gray-600 leading-relaxed">
                      नेताओं ने कार्बन उत्सर्जन को कम करने के लिए कड़े लक्ष्यों
                      पर सहमति व्यक्त की है।
                    </p>
                  </div>
                </article>
                <article className="flex flex-col xl:flex-row gap-4 group cursor-pointer">
                  <div className="w-full xl:w-16 h-24 xl:h-16 shrink-0 overflow-hidden bg-gray-200">
                    <Image
                      src="https://picsum.photos/id/30/100/100"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt="News thumbnail"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs leading-snug mb-2 group-hover:text-[#CC2200] transition-colors">
                      यूरोपीय संघ के नए व्यापार नियम
                    </h4>
                    <p className="text-[10px] text-gray-600 leading-relaxed">
                      नए डिजिटल सेवा कानून से तकनीकी दिग्गजों पर प्रभाव पड़ने की
                      संभावना है।
                    </p>
                  </div>
                </article>
              </div>
            </div>

            {/* Editor's Picks */}
            <div>
              <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest border-b border-black pb-3 mb-5">
                संपादक की पसंद
              </h3>
              <div className="space-y-5">
                <article className="group cursor-pointer">
                  <h4 className="font-bold text-xs leading-snug mb-3 group-hover:text-[#CC2200] transition-colors">
                    कला और समाज का बदलता स्वरूप
                  </h4>
                  <p className="text-[10px] text-gray-600 leading-relaxed">
                    एक विश्लेषण कैसे तकनीक हमारी अभिव्यक्ति को प्रभावित कर रही
                    है।
                  </p>
                </article>
                <div className="border-t border-gray-300"></div>
                <article className="group cursor-pointer">
                  <h4 className="font-bold text-xs leading-snug mb-3 group-hover:text-[#CC2200] transition-colors">
                    सपनों की नगरी की अनदेखी कहानियाँ
                  </h4>
                  <p className="text-[10px] text-gray-600 leading-relaxed">
                    शहर की भीड़भाड़ के पीछे छिपे अनकहे किस्से।
                  </p>
                </article>
                <div className="border-t border-gray-300"></div>
                <article className="group cursor-pointer">
                  <h4 className="font-bold text-xs leading-snug mb-3 group-hover:text-[#CC2200] transition-colors">
                    आधुनिक जीवन में योग का महत्व
                  </h4>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column */}
        <section className="col-span-12 lg:col-span-3 flex flex-col gap-8">
          <div className="border-b-2 border-black pb-2 mb-3">
            <h2 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">
              प्रमुख कहानियाँ
            </h2>
          </div>

          <article className="group cursor-pointer">
            <div className="overflow-hidden mb-4 bg-gray-200">
              <Image
                src="https://picsum.photos/id/164/400/300"
                width={400}
                height={300}
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Business"
              />
            </div>
            <div className="text-[#CC2200] text-[10px] font-bold mb-3 tracking-widest">
              व्यापार
            </div>
            <h3 className="font-playfair font-bold text-xl leading-tight mb-4 group-hover:text-[#CC2200] transition-colors">
              अर्थव्यवस्था स्थिर होने के साथ कॉर्पोरेट विलय में उछाल
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              विश्लेषकों का अनुमान है कि बाजार में विश्वास लौटने के कारण तीसरी
              तिमाही में अधिग्रहण में वृद्धि होगी।
            </p>
          </article>

          <div className="border-t border-gray-300"></div>

          <article className="group cursor-pointer">
            <div className="overflow-hidden mb-4 bg-gray-200">
              <Image
                src="https://picsum.photos/id/0/400/300"
                width={400}
                height={300}
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Tech"
              />
            </div>
            <div className="text-[#CC2200] text-[10px] font-bold mb-3 tracking-widest">
              तकनीक
            </div>
            <h3 className="font-playfair font-bold text-xl leading-tight mb-4 group-hover:text-[#CC2200] transition-colors">
              नेक्स्ट-जेन प्रोसेसर अभूतपूर्व दक्षता का वादा करते हैं
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              नवीनतम माइक्रोचिप डिज़ाइन व्यक्तिगत कंप्यूटिंग और बड़े पैमाने के
              डेटा केंद्रों दोनों में क्रांति लाने के लिए तैयार हैं।
            </p>
          </article>

          <div className="border-t border-gray-300"></div>

          <article className="group cursor-pointer">
            <div className="overflow-hidden mb-4 bg-gray-200">
              <Image
                src="https://picsum.photos/id/119/400/300"
                width={400}
                height={300}
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Opinion"
              />
            </div>
            <div className="text-[#CC2200] text-[10px] font-bold mb-3 tracking-widest">
              राय
            </div>
            <h3 className="font-playfair font-bold text-xl leading-tight mb-4 group-hover:text-[#CC2200] transition-colors">
              रिमोट कार्य नीतियों की छिपी लागत
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              यद्यपि लचीलेपन की प्रशंसा की जाती है, लेकिन हमें सहयोगात्मक
              कार्यालय संस्कृति के सूक्ष्म क्षरण को नजरअंदाज नहीं करना चाहिए।
            </p>
          </article>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-[6px] border-black bg-[#F8F5F0] mt-12">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <h2 className="font-playfair font-black text-2xl mb-4">
              द डेली रिकॉर्ड
            </h2>
            <p className="text-gray-700 text-xs font-serif italic mb-6">
              1922 से स्वतंत्र पत्रकारिता।
            </p>
            <p className="text-[10px] text-gray-500 font-medium">
              © 2024 द डेली रिकॉर्ड। सर्वाधिकार सुरक्षित।
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-8">
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs font-bold text-gray-800">
              <a href="#" className="hover:text-[#CC2200] transition-colors">
                हमारे बारे में
              </a>
              <a href="#" className="hover:text-[#CC2200] transition-colors">
                न्यूज़लेटर
              </a>
              <a href="#" className="hover:text-[#CC2200] transition-colors">
                संपर्क करें
              </a>
              <a href="#" className="hover:text-[#CC2200] transition-colors">
                पहुंच
              </a>
              <a href="#" className="hover:text-[#CC2200] transition-colors">
                गोपनीयता नीति
              </a>
              <a href="#" className="hover:text-[#CC2200] transition-colors">
                विज्ञापन विकल्प
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
