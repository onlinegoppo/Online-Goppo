/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BookOpen, Sparkles, BookCheck, ArrowRight, Smartphone } from "lucide-react";
import { Book, SiteSettings } from "../types";

interface HeroProps {
  featuredBooks: Book[];
  onSelectBook: (book: Book) => void;
  onExploreShop: () => void;
  siteSettings?: SiteSettings | null;
}

export default function Hero({ featuredBooks, onSelectBook, onExploreShop, siteSettings }: HeroProps) {
  // Let's grab some featured books to display
  const primaryFeatured = featuredBooks[0] || null;
  const secondaryFeatured = featuredBooks.slice(1, 3);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1B263B]/5 via-[#FBFBFB] to-[#FBFBFB] py-12 md:py-20 border-b border-gray-200">
      {/* Decorative background vectors representing literary elegance */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-5 left-5 w-80 h-80 bg-[#1B263B]/5 rounded-full blur-3xl pointer-events-none"></div>
 
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Editorial Text Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full text-[#1B263B] text-xs font-semibold uppercase tracking-wider select-none">
            <Sparkles size={13} className="text-[#C5A059] animate-spin" /> 
            {siteSettings?.heroWelcomeMsg || "Welcome to onlinegoppo.site"}
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-5xl font-serif font-bold text-gray-900 leading-[1.2] tracking-tight whitespace-pre-line">
            {siteSettings?.heroHeading || "মুহূর্তেই বইয়ের পাতায় \nহারিয়ে যান অনলাইনগল্পের সাথে"}
          </h1>
 
          <p className="text-gray-600 text-xs md:text-sm max-w-xl font-sans leading-relaxed">
            {siteSettings?.heroSubheading || "বাঙালি সাহিত্যের সমৃদ্ধ ইতিহাস, শ্রেষ্ঠ জনপ্রিয় উপন্যাস, বৈজ্ঞানিক রোমাঞ্চকর গবেষণা এবং যেকোনো ই-বুক PDF এখন আপনার হাতের মুঠোয়। আপনার প্রিয় লেখকের যেকোনো মুদ্রিত বই সরাসরি হোম-ডেলিভারি নিন অথবা স্মার্ট ড্রাইভে তাত্ক্ষণিক ডাউনলোড করুন।"}
          </p>
 
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onExploreShop}
              className="px-6 py-3 bg-[#1B263B] hover:bg-[#121A2A] text-white rounded-lg text-sm font-semibold shadow-lg shadow-[#1B263B]/10 hover:shadow-[#1B263B]/25 transition-all flex items-center gap-2 group"
            >
              বইয়ের সমাহার দেখুন 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#latest-ebooks"
              className="px-6 py-3 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 hover:border-[#C5A059] rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Smartphone size={16} className="text-stone-500" />
              ই-বুক ক্যাটাগরি
            </a>
          </div>
 
          {/* Core values row */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200 w-full max-w-lg">
            <div className="flex flex-col items-start">
              <span className="font-serif text-2xl font-bold text-gray-900">100%</span>
              <span className="text-xs text-stone-500">মূল কপি নিশ্চয়তা</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-serif text-2xl font-bold text-gray-950 block">তাত্ক্ষণিক</span>
              <span className="text-xs text-stone-500">ডিজিটাল PDF ডেলিভারি</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-serif text-2xl font-bold text-gray-900">সহজ</span>
              <span className="text-xs text-stone-500">বিকাশ/কার্ড পেমেন্ট</span>
            </div>
          </div>
        </div>
 
        {/* Featured Showcase Display (Book Cover Mockup Layout) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          {primaryFeatured && (
            <div className="relative group select-none">
              {/* Outer decorative card shadow backdrop */}
              <div className="absolute -inset-1 bg-[#C5A059]/20 rounded-2xl blur-xl transition-all duration-300 group-hover:blur-2xl group-hover:scale-105"></div>
              
              <div 
                onClick={() => onSelectBook(primaryFeatured)}
                className="relative bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-2xl hover:shadow-[#1B263B]/5 transition-all duration-300 cursor-pointer w-full max-w-sm flex flex-col items-center text-center"
              >
                {/* Book stand badge */}
                <span className="absolute top-4 right-4 bg-[#C5A059] text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight shadow-sm flex items-center gap-1">
                  <Sparkles size={11} /> সপ্তাহের সেরা বই
                </span>
 
                {/* Cover representation */}
                <div className="w-48 h-68 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden border border-stone-100 bg-stone-50 transform hover:-translate-y-2 mb-5 relative">
                  <img
                    src={primaryFeatured.coverUrl}
                    alt={primaryFeatured.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Book spine line overlay for realistic booklet visual */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/10 shadow-[inset_-1px_0_1px_rgba(255,255,255,0.25)]"></div>
                </div>
 
                <h3 className="font-serif text-lg font-bold text-stone-950 mb-1 line-clamp-1 group-hover:text-[#1B263B] transition-colors">
                  {primaryFeatured.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium font-sans mb-3">
                  {primaryFeatured.author}
                </p>
 
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B263B]/5 border border-[#1B263B]/10 text-[#1B263B] text-xs font-semibold mb-3">
                  {primaryFeatured.type === "ebook" ? "ই-বুক PDF" : "মুদ্রিত কপি"} • {primaryFeatured.category === "bestsellers" ? "সেরা বিক্রেতা" : "নতুন সংযোজন"}
                </div>
 
                <div className="flex items-center justify-between w-full pt-4 border-t border-gray-200">
                  <div className="text-left">
                    <span className="text-[10px] text-stone-400 block uppercase tracking-wider">দাম</span>
                    <span className="font-serif text-xl font-bold text-[#1B263B]">৳{primaryFeatured.price}</span>
                  </div>
                  <span className="text-xs text-[#C5A059] font-semibold group-hover:translate-x-1 duration-200 flex items-center gap-1">
                    বিস্তারিত দেখুন <ArrowRight size={12} />
                  </span>
                </div>
              </div>
 
              {/* Miniature sibling preview stack background effect */}
              {secondaryFeatured.map((book, idx) => (
                <div 
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  style={{
                    transform: `rotate(${idx === 0 ? '-6deg' : '6deg'}) translate(${idx === 0 ? '-35px' : '35px'}, 15px)`,
                    zIndex: -1
                  }}
                  className="absolute inset-0 bg-gray-100/80 rounded-2xl border border-gray-200 shadow-md cursor-pointer flex items-center justify-center pointer-events-auto hover:bg-[#EDE6DA] duration-200"
                >
                  <div className="w-12 h-16 self-start mt-6 shadow-sm rounded overflow-hidden">
                    <img src={book.coverUrl} alt={book.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
 
      </div>
    </section>
  );
}
