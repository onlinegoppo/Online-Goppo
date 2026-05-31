/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Book, LandingPage } from "../types";
import { ArrowLeft, Sparkles, BookOpen, Smartphone, MoveRight, ChevronRight, Bookmark } from "lucide-react";

interface PromoLandingPageProps {
  promo: LandingPage;
  books: Book[];
  onDirectPurchase: (book: Book) => void;
  onGoBack: () => void;
}

export default function PromoLandingPage({ promo, books, onDirectPurchase, onGoBack }: PromoLandingPageProps) {
  const matchedBook = books.find((b) => b.id === promo.bookId);

  // Apply fallback styles if custom colors are empty or default
  const bgColor = promo.bgColor || "#1B263B";
  const textColor = promo.textColor || "#FBFBFB";
  const accentColor = promo.accentColor || "#C5A059";

  return (
    <div 
      className="min-h-screen relative font-sans flex flex-col justify-between"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Decorative Blur Vectors */}
      <div 
        className="absolute top-1/4 right-5 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      ></div>
      <div 
        className="absolute bottom-1/4 left-5 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      ></div>

      {/* Dynamic Promo Header Menu */}
      <header className="border-b border-white/10 py-4 px-4 md:px-6 relative z-10 bg-black/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button 
            onClick={onGoBack}
            className="flex items-center gap-1.5 text-xs font-semibold opacity-75 hover:opacity-100 transition-all font-sans bg-transparent py-1.5 px-3 border border-white/10 hover:border-white/20 rounded-lg cursor-pointer"
            style={{ color: textColor }}
          >
            <ArrowLeft size={14} /> প্রধান গ্যালারীতে ফিরুন
          </button>

          <div className="flex items-center gap-1">
            <span className="font-serif text-lg font-bold tracking-tight">
              onlinegoppo<span style={{ color: accentColor }}>.site</span>
            </span>
          </div>

          <div className="text-[10px] uppercase font-mono tracking-wider opacity-60 hidden md:block">
            Special Book Release Program
          </div>
        </div>
      </header>

      {/* Main Campaign Showcase Container */}
      <main className="flex-grow max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 relative z-10 flex items-center">
        {matchedBook ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            
            {/* Promo Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              
              <div 
                className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{ color: accentColor }}
              >
                <Sparkles size={12} /> Special Exclusive Offer
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.12] tracking-tight">
                {promo.headline}
              </h1>

              <p className="text-base md:text-lg leading-relaxed opacity-85">
                {promo.subheading}
              </p>

              {/* Promo Quote */}
              {promo.promoQuote && (
                <div className="border-l-4 pl-4 py-1 italic opacity-85 text-xs max-w-lg" style={{ borderColor: accentColor }}>
                  <p className="text-stone-300 font-serif">"{promo.promoQuote}"</p>
                  {promo.promoQuoteAuthor && (
                    <span className="block text-[10px] mt-1 font-sans opacity-60">— {promo.promoQuoteAuthor}</span>
                  )}
                </div>
              )}

              {/* Promo Narrative Pitch */}
              <p className="text-xs md:text-sm font-sans opacity-70 leading-relaxed max-w-2xl pt-2">
                {promo.promoText}
              </p>

              {/* Dynamic Purchase widget */}
              <div className="pt-6 border-t border-white/10 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-50 block">অর্ডার মূল্য মূল্য</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-serif font-bold">৳{matchedBook.price} BDT</span>
                    {matchedBook.type === "ebook" ? (
                      <span className="bg-green-600/30 text-green-200 text-[10px] px-2 py-0.5 rounded border border-green-500/10 font-bold uppercase">ই-বুক ডিকশনারী</span>
                    ) : (
                      <span className="bg-amber-600/35 text-amber-200 text-[10px] px-2 py-0.5 rounded border border-amber-500/10 font-bold uppercase">মুদ্রিত বই</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDirectPurchase(matchedBook)}
                  className="px-8 py-4 font-bold rounded-lg text-sm transition-all flex items-center gap-2 shadow-lg duration-350 cursor-pointer"
                  style={{ backgroundColor: accentColor, color: "#121A2A" }}
                >
                  সহজে এখনই সংগ্রহ করুন <MoveRight size={16} />
                </button>
              </div>

              {/* Guarantees info footer */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5 w-full max-w-lg text-[10px] opacity-60">
                <div className="flex flex-col items-start gap-1">
                  <Bookmark size={14} style={{ color: accentColor }} />
                  <span>১০০% অফিসিয়াল সোর্স কপি</span>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <Smartphone size={14} style={{ color: accentColor }} />
                  <span>তাত্ক্ষণিক ইমেইল ডেলিভারি</span>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <BookOpen size={14} style={{ color: accentColor }} />
                  <span>লাইফটাইম অ্যাক্সেস ব্যাকআপ</span>
                </div>
              </div>

            </div>

            {/* Poster cover view container column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative group max-w-sm w-full p-4 bg-white/5 border border-white/10 rounded-2xl shadow-2xl flex flex-col items-center">
                
                {/* Book stand badge */}
                <div 
                  className="absolute -top-3 right-4 shadow-md px-3 py-1 rounded-full text-[9px] font-bold tracking-tight flex items-center gap-1 font-mono uppercase"
                  style={{ backgroundColor: accentColor, color: "#121A2A" }}
                >
                  <Sparkles size={10} className="animate-spin" /> Limited Campaign Edition
                </div>

                {/* Cover representation */}
                <div className="w-56 h-76 shadow-2xl rounded-lg overflow-hidden border border-white/10 bg-neutral-900 mb-4 relative">
                  <img
                    src={matchedBook.coverUrl}
                    alt={matchedBook.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/15 shadow-[inset_-1px_0_0_rgba(255,255,255,0.1)]"></div>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="font-serif text-lg font-bold leading-none">{matchedBook.title}</h3>
                  <p className="text-xs opacity-75">{matchedBook.author}</p>
                </div>

                <div className="w-full border-t border-white/10 pt-3 mt-3 flex justify-between items-center text-[10.5px] opacity-70 font-mono">
                  <span>ISBN: {matchedBook.isbn || "N/A"}</span>
                  <span>{matchedBook.pages} পৃষ্ঠা</span>
                </div>

              </div>
            </div>

          </div>
        ) : (
          <div className="w-full text-center py-20 space-y-4">
            <h4 className="text-xl">নির্বাচনকৃত বইটি পাওয়া যায়নি বা ডিলিট করা হয়েছে!</h4>
            <button onClick={onGoBack} className="text-xs px-4 py-2 rounded bg-white text-stone-900">ফিরে যান</button>
          </div>
        )}
      </main>

      {/* Landing Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center mt-12 bg-black/20 text-[11px] opacity-50 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© {new Date().getFullYear()} onlinegoppo.site. All Rights Reserved.</span>
          <span>এই প্রচার পাতাটি অনলাইনগল্প অ্যাডমিন প্যানেল দিয়ে স্বয়ংক্রিয়ভাবে নির্মিত।</span>
        </div>
      </footer>
    </div>
  );
}
