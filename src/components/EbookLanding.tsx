/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Book } from "../types";
import { 
  X, 
  Smartphone, 
  BookOpen, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Gift, 
  Check, 
  ShieldCheck, 
  Bookmark, 
  Users,
  Film,
  Sparkles,
  ArrowRight,
  BookmarkMinus
} from "lucide-react";

interface EbookLandingProps {
  books: Book[];
  onDirectCheckout: (book: Book) => void;
  userEmail: string | null;
  onNavigateHome: () => void;
}

export default function EbookLanding({ books, onDirectCheckout, userEmail, onNavigateHome }: EbookLandingProps) {
  // Get all ebooks from database
  const ebooks = books.filter(b => b.type === "ebook");
  
  // Set default book to Powersful Focus if available, otherwise first ebook
  const defaultBook = ebooks.find(b => b.id === "book-focus") || ebooks[0];
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Sync default book when ebooks list finishes loading
  useEffect(() => {
    if (defaultBook && !selectedBook) {
      setSelectedBook(defaultBook);
    }
  }, [books, defaultBook]);

  // Current tab under the spotlight book
  const [activeTab, setActiveTab] = useState<"summary" | "specification" | "author">("summary");

  // Read preview state (Interactive Reader Overlay)
  const [showReader, setShowReader] = useState(false);
  const [readerPage, setReaderPage] = useState(1); // 1-based index

  // Wishlist state saved locally
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Safe checks if user already purchased the active book
  const isPurchased = selectedBook ? localStorage.getItem("purchased_" + selectedBook.id) === "true" : false;

  useEffect(() => {
    if (selectedBook) {
      setIsWishlisted(localStorage.getItem("wishlist_" + selectedBook.id) === "true");
    }
  }, [selectedBook]);

  if (!selectedBook) {
    return (
      <div className="py-24 text-center">
        <div className="animate-pulse text-stone-500 font-sans text-xs">ই-বুক ড্যাশবোর্ড লোড হচ্ছে...</div>
      </div>
    );
  }

  // Handle wishlist toggle
  const handleToggleWishlist = () => {
    const key = "wishlist_" + selectedBook.id;
    const current = localStorage.getItem(key) === "true";
    localStorage.setItem(key, current ? "false" : "true");
    setIsWishlisted(!current);
  };

  // Handle sharing link copy
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  // Generate dynamic preview pages if not predefined in the book object
  const getPreviewPagesForBook = (book: Book): string[] => {
    if (book.previewPages && book.previewPages.length > 0) {
      return book.previewPages;
    }
    // Fallback template for books that do not have custom page contents
    return [
      `১ম পৃষ্ঠা: নতুন শুরু • ${book.title}\n\nস্বাগতম! এই ডিজিটাল সংস্করণে আপনাকে অভিনন্দন। ${book.author} এর চমৎকার সৃষ্টি এটি। এই বইটি আপনাকে আপনার জীবনের লক্ষ্য পূরণ ও নতুন এক চিন্তাভাবনা গড়ে তুলতে সাহায্য করবে। পড়তে থাকুন পরবর্তী পৃষ্ঠাগুলো যা একেবারেই ফ্রি!`,
      `২য় পৃষ্ঠা: প্রথম পদক্ষেপ\n\nসফলতার প্রথম মূলমন্ত্র হলো প্রতিটি দিনকে পরিকল্পিতভাবে শুরু করা। লেখক এখানে ব্যাখ্যা করেছেন কীভাবে জীবনের ছোট বড় যেকোনো লক্ষ্যকে সহজ ভাগে ভাগ করে অগ্রসর হওয়া যায়। এটি খুবই বাস্তবসম্মত আলোচনা।`,
      `৩য় পৃষ্ঠা: ভুল মানসিকতা অতিক্রম করা\n\nআমরা প্রায়শই আমাদের পূর্বের ব্যর্থতার বোঝা ঘাড়ে বয়ে বেড়াই। এই চ্যাপ্টার আপনাকে শেখাবে কীভাবে সেই নেতিবাচক বিশ্বাসগুলো ঝেড়ে ফেলে আপনার ভেতরে আত্মবিশ্বাস ফিরিয়ে আনা যায়।`,
      `৪র্থ পৃষ্ঠা: কর্মক্ষমতা বৃদ্ধি\n\nআপনার মূল্যবান সময় কেবল সেই জিনিসেই বিনিয়োগ করুন যা আপনাকে প্রকৃত আনন্দ ও মূল্য দেয়। লেখকের ভাষায়, অলসতা হলো মূলত স্পষ্ট লক্ষ্যের অভাবেরই বহিঃপ্রকাশ।`,
      `৫ম পৃষ্ঠা: চ্যাপ্টার ৫ • গুরুত্বপূর্ণ সিদ্ধান্ত (Paid Content)\n\n[এই পৃষ্ঠাটি শুধুমাত্র পেইড গ্রাহকদের জন্য সংরক্ষিত। পড়া চালিয়ে যেতে অনুগ্রহ করে বইটি ক্রয় করুন]\n\nআপনি যদি এই পর্যন্ত আমাদের সাথে থেকে থাকেন, তবে আপনি আপনার জীবন পরিবর্তনের প্রথম বড় পদক্ষেপটি নিয়েছেন। এই পেইড সংস্করণে রয়েছে বাকি অধ্যায়, গাইডলাইন ও অনুশীলনী যা আপনাকে পূর্ণাঙ্গভাবে সাহায্য করবে।`,
      `৬ষ্ঠ পৃষ্ঠা: সফল অভ্যাস তৈরি (Paid Content)\n\n[এই পৃষ্ঠাটি শুধুমাত্র পেইড গ্রাহকদের জন্য সংরক্ষিত। পড়া চালিয়ে যেতে অনুগ্রহ করে বইটি ক্রয় করুন]\n\nঅভ্যাস গঠন একটি বিজ্ঞানসম্মত পদ্ধতি। ২৫ দিনের রুটিন কীভাবে আপনার অবচেতন মনকে পুরোপুরি ইতিবাচক দিকে ধাবিত করবে তা বিস্তারিত আলোচনা করা হয়েছে এই পেইড অধ্যায়ে।`
    ];
  };

  const previewPages = getPreviewPagesForBook(selectedBook);
  const totalPages = previewPages.length;

  return (
    <div className="py-10 bg-stone-50 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* BREADCRUMB ROADMAP */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 font-sans pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <button 
              onClick={onNavigateHome}
              className="hover:text-[#E63946] transition-colors font-semibold"
            >
              প্রচ্ছদ (Home)
            </button>
            <span>/</span>
            <span className="text-[#E63946] font-bold">ই-বুক ল্যান্ডিং কর্নার ({selectedBook.title})</span>
          </div>

          <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-800 px-2.5 py-1 rounded-full text-[10px] font-bold border border-yellow-400/20">
            <Sparkles size={11} className="animate-spin text-yellow-600" />
            <span>স্পেশাল অফার ট্যারিফ: ২০ টাকা মাত্র!</span>
          </div>
        </div>

        {/* 🟢 TOP AREA: SPOTLIGHT MAIN SECTION 🟢 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-white p-6 sm:p-8 rounded-3xl border border-stone-250/75 shadow-lg relative overflow-hidden">
          
          {/* Subtle design accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E63946]/5 rounded-bl-full pointer-events-none"></div>

          {/* LEFT SIDE: BOOK COVER & PREVIEW TRIGGERS (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center space-y-4">
            
            {/* Visual Header Indicator "একটু পড়ে দেখুন" */}
            <button
              onClick={() => {
                setReaderPage(1);
                setShowReader(true);
              }}
              className="flex items-center gap-1.5 text-xs text-[#E63946] font-extrabold bg-red-50 hover:bg-red-100/80 px-4 py-2 rounded-full border border-red-200 shadow-sm transition-all animate-bounce cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] animate-ping"></span>
              একটু পড়ে দেখুন (Read Preview) ↓
            </button>

            {/* Book Spine Shadow Case */}
            <div 
              onClick={() => {
                setReaderPage(1);
                setShowReader(true);
              }}
              className="group aspect-[3/4] max-w-[270px] w-full bg-white p-5 rounded-2xl border border-stone-200 shadow-lg hover:shadow-xl hover:border-[#E63946]/20 transition-all duration-300 cursor-pointer relative"
            >
              <div className="w-full h-full rounded-lg overflow-hidden relative border border-stone-150">
                <img 
                  src={selectedBook.coverUrl} 
                  alt={selectedBook.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-104 duration-300"
                />
                
                {/* Book Spine highlights just like the physical book representation */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/15 shadow-[inset_-1px_0_0_rgba(255,255,255,0.08)]"></div>
                
                {/* Interactive watermarks overlay */}
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 flex items-center justify-center duration-300">
                  <span className="opacity-0 group-hover:opacity-100 bg-[#E63946] text-white text-[10px] font-bold py-1 px-2.5 rounded-lg shadow-md duration-250 flex items-center gap-1">
                    <BookOpen size={11} /> রিডার চালু করুন
                  </span>
                </div>
              </div>

              {/* Watermark badge on top */}
              <div className="absolute top-2.5 right-2.5 bg-sky-500 text-white text-[9px] font-bold py-0.5 px-2 rounded-full font-sans uppercase shadow">
                Ebook PDF
              </div>
            </div>

            {/* Read Button Selector Dropdown or Action beneath */}
            <div className="w-full max-w-[270px] pt-1">
              <button
                onClick={() => {
                  setReaderPage(1);
                  setShowReader(true);
                }}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 text-xs font-bold rounded-xl border border-stone-300 shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <BookOpen size={13} /> কন্টেন্ট প্রিভিউয়ার উইন্ডো
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: METADATA, TITLE & CONVERSION ACTION (7 cols) */}
          <div className="md:col-span-7 space-y-6 text-left">
            <div>
              <span className="bg-[#E63946]/10 text-[#E63946] text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg uppercase font-sans inline-block tracking-wider">
                Instant PDF Delivery
              </span>
              
              <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-stone-900 tracking-tight mt-3">
                {selectedBook.title}
              </h1>

              <p className="text-stone-500 text-xs sm:text-sm mt-1.5 font-sans leading-relaxed flex flex-wrap items-center gap-2">
                <span>by</span>
                <span className="text-sky-600 font-bold hover:underline cursor-pointer">{selectedBook.author}</span>
                {selectedBook.translator && (
                  <>
                    <span>,</span>
                    <span className="text-sky-600 font-bold hover:underline cursor-pointer">{selectedBook.translator} (অনুবাদক)</span>
                  </>
                )}
              </p>

              <div className="text-stone-500 text-xs mt-2 font-sans flex items-center gap-1">
                <span className="font-semibold text-stone-700">Category:</span>
                <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-sans text-[11px] font-medium border border-stone-200">
                  {selectedBook.category === "ebooks" ? "অনুবাদ: আত্ম-উন্নয়ন ও মেডিটেশন" : selectedBook.category}
                </span>
              </div>
            </div>

            {/* Book price box TK 20 */}
            <div className="py-2.5 border-y border-stone-200/80 flex items-center gap-4">
              <div className="text-stone-850 font-serif font-extrabold text-3xl">
                ৳{selectedBook.price} <span className="text-xs sm:text-sm text-stone-400 font-sans font-normal ml-1">টাকা মাত্র</span>
              </div>
              <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-100/80 uppercase font-sans">
                ✓ ৯২% ছাড় পাওয়া যাচ্ছে
              </div>
            </div>

            {/* Short expandable description box */}
            <div className="space-y-1 bg-stone-50/50 p-4 rounded-2xl border border-stone-200">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider font-sans">সারসংক্ষেপ কলাম (Excerpt)</h4>
              <p className="text-stone-600 text-xs leading-relaxed max-h-24 overflow-y-auto font-sans">
                {selectedBook.description}
              </p>
            </div>

            {/* Custom promotion banner "ঈদ মোবারক" */}
            <div className="bg-[#FFF5F5] border border-red-100 rounded-xl p-3 flex items-start gap-2.5 text-stone-700">
              <span className="p-1 bg-[#E63946]/10 rounded-lg text-[#E63946] flex-shrink-0 mt-0.5">
                <Gift size={15} />
              </span>
              <div className="text-[11px] leading-relaxed font-sans font-medium">
                <strong className="text-[#E63946] block font-bold mb-0.5">বিশেষ অফার বার্তা:</strong>
                ঈদ মোবারক! কুরবানির ত্যাগের মহিমায় উদ্ভাসিত হোক আমাদের চারপাশ। সবার ঈদ কাটুক হাসিখুশিতে আর পরম শান্তিতে। অনলাইনগল্প.সাইটে সব ইমেজে ২০ টাকা অফার চলছে!
              </div>
            </div>

            {/* Conversion CTA button "Buy eBook" in Sky Blue */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onDirectCheckout(selectedBook)}
                  className="px-8 py-3.5 bg-[#00a2e8] hover:bg-[#0091d5] text-white font-extrabold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 tracking-wider uppercase cursor-pointer"
                >
                  <Smartphone size={16} /> Buy eBook (৳{selectedBook.price})
                </button>

                <button
                  onClick={() => {
                    setReaderPage(1);
                    setShowReader(true);
                  }}
                  className="px-6 py-3.5 bg-stone-900 hover:bg-stone-950 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen size={14} /> ফ্রী পড়া শুরু করুন
                </button>
              </div>

              {/* Wishlist and Share Row */}
              <div className="flex flex-wrap items-center gap-5 text-xs text-stone-550 font-sans font-medium select-none pt-1">
                <button
                  onClick={handleToggleWishlist}
                  className="flex items-center gap-1.5 hover:text-[#E63946] transition-colors cursor-pointer"
                >
                  <Heart size={14} className={isWishlisted ? "fill-red-500 text-red-500" : "text-stone-400"} />
                  <span>{isWishlisted ? "পছন্দের তালিকায় রাখা হয়েছে" : "পছন্দের তালিকায় রাখুন"}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-sky-600 transition-colors cursor-pointer relative"
                >
                  <Share2 size={14} className="text-stone-400" />
                  <span>বন্ধুদের সাথে শেয়ার করুন</span>
                  {shareSuccess && (
                    <span className="absolute -top-7 left-0 bg-stone-900 text-white text-[9px] py-0.5 px-2 rounded shadow animate-fade-in z-20">
                      ✓ লিংক কপি হয়েছে!
                    </span>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* 🟢 MID AREA: MULTI-TAB PANEL EXACTLY AS SCREENSHOTS 🟢 */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-6 text-left space-y-6">
          
          <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-stone-900 tracking-tight pb-3 border-b border-stone-200/80">
            বইটির বিস্তারিত দেখুন (Detailed Commentary)
          </h2>

          {/* ACTIVE GREEN UNDERLINED TAB BUTTONS BAR */}
          <div className="flex items-center border-b border-stone-200/80 w-full overflow-x-auto text-xs sm:text-sm font-bold tracking-wide select-none">
            
            {/* 1. Summary Tab */}
            <button
              onClick={() => setActiveTab("summary")}
              className={`pb-2.5 px-4 relative duration-150 cursor-pointer ${
                activeTab === "summary"
                  ? "text-[#2ecc71]"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <span>Summary (সারসংক্ষেপ)</span>
              {activeTab === "summary" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2ecc71] rounded-full"></div>
              )}
            </button>

            {/* 2. Specification Tab */}
            <button
              onClick={() => setActiveTab("specification")}
              className={`pb-2.5 px-4 relative duration-150 cursor-pointer ${
                activeTab === "specification"
                  ? "text-[#2ecc71]"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <span>Specification (স্পেসিফিকেশন)</span>
              {activeTab === "specification" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2ecc71] rounded-full"></div>
              )}
            </button>

            {/* 3. Author Tab */}
            <button
              onClick={() => setActiveTab("author")}
              className={`pb-2.5 px-4 relative duration-150 cursor-pointer ${
                activeTab === "author"
                  ? "text-[#2ecc71]"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <span>Author (লেখক)</span>
              {activeTab === "author" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2ecc71] rounded-full"></div>
              )}
            </button>

          </div>

          {/* TAB CONTENTS CONTAINER */}
          <div className="pt-2 font-sans text-xs sm:text-sm leading-relaxed text-stone-600">
            
            {/* TAB CONTENT: SUMMARY */}
            {activeTab === "summary" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <p>
                    আপনি কি কাজ করতে বসলেই মনোযোগ হারিয়ে ফেলেন? আপনার কি মনে হয় সারাদিন অনেক ব্যস্ত থাকার পরও দিন শেষে তেমন কোনো কাজই শেষ হয়নি?
                  </p>
                  <p>
                    আজকের এই ডিজিটাল যুগে আমাদের মনোযোগ নষ্ট করার জন্য চারদিকে হাজারো আয়োজন। স্মার্টফোন থেকে শুরু করে সোশ্যাল মিডিয়া নোটিফিকেশন, সবকিছুই আমাদের ফোকাস কেড়ে নিচ্ছে। আর এই ফোকাসের অভাবই হলো আমাদের সফলতার পথে সবচেয়ে বড় বাধা। থিবো মেরিসের লেখা ‘পাওয়ারফুল ফোকাস’ বইটি আপনাকে এই বিশাল সমস্যা থেকে খুব সহজেই মুক্তি দেবে। এটি আপনার হারানো মনোযোগ ফিরিয়ে আনার একটি অত্যন্ত বাস্তবসম্মত এবং পরীক্ষিত গাইডলাইন।
                  </p>
                </div>

                {/* Yellow Rounded Highlight Block (Exact Style From Snapshot 2) */}
                <div className="p-3 bg-yellow-100 text-yellow-905 border-l-4 border-yellow-500 font-extrabold rounded-r-lg max-w-lg">
                  🎯 এই দারুণ বইটি আপনাকে যা শেখাবে:
                </div>

                {/* Checklist from image */}
                <ul className="space-y-2 text-stone-700 pl-2">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#2ecc71] font-bold mt-0.5">✓</span>
                    <span>কীভাবে চারপাশের সব ধরনের বাধা এড়িয়ে নিজের কাজের প্রতি লেজার-শার্প ফোকাস ধরে রাখতে হয়?</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#2ecc71] font-bold mt-0.5">✓</span>
                    <span>কীভাবে অনেক কম সময়ে আগের চেয়ে অনেক বেশি কাজ সুন্দরভাবে শেষ করতে হয়?</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#2ecc71] font-bold mt-0.5">✓</span>
                    <span>কীভাবে কাজের একঘেয়েমি দূর করে নিজের শক্তিকে সঠিকভাবে ধরে রাখতে হয়?</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#2ecc71] font-bold mt-0.5">✓</span>
                    <span>কীভাবে জীবনের সবচেয়ে গুরুত্বপূর্ণ লক্ষ্যগুলো ঠিক করে অন্য সব চিন্তা বাদ দিয়ে সেগুলোর দিকে সোজা এগিয়ে যেতে হয়?</span>
                  </li>
                </ul>

                <p className="pt-2">
                  আপনি যদি নিজের কাজগুলো আর জমিয়ে না রেখে, একটি স্থির এবং শক্তিশালী ফোকাস তৈরি করতে চান, তবে এই বইটি আপনার জন্যই! এটি আপনার চিন্তাভাবনা এবং কাজের ধরন পাল্টে দিয়ে আপনাকে আরও অনেক বেশি প্রোডাক্টিভ হতে সাহায্য করবে।
                </p>
              </div>
            )}

            {/* TAB CONTENT: SPECIFICATION */}
            {activeTab === "specification" && (
              <div className="max-w-xl">
                <div className="overflow-hidden border border-stone-200 rounded-xl">
                  <table className="w-full text-left font-sans text-xs">
                    <tbody>
                      <tr className="border-b border-stone-200 bg-stone-50">
                        <td className="p-3 font-extrabold text-stone-800 w-1/3">Title (বইয়ের নাম)</td>
                        <td className="p-3 text-stone-600">{selectedBook.title}</td>
                      </tr>
                      <tr className="border-b border-stone-200 bg-white">
                        <td className="p-3 font-extrabold text-stone-800">Author (লেখক)</td>
                        <td className="p-3 text-[#00a2e8] font-bold">{selectedBook.author}</td>
                      </tr>
                      {selectedBook.translator && (
                        <tr className="border-b border-stone-200 bg-stone-50">
                          <td className="p-3 font-extrabold text-stone-800">Translator (অনুবাদক)</td>
                          <td className="p-3 text-[#00a2e8] font-bold">{selectedBook.translator}</td>
                        </tr>
                      )}
                      <tr className="border-b border-stone-200 bg-white">
                        <td className="p-3 font-extrabold text-stone-800">Publisher (প্রকাশনী)</td>
                        <td className="p-3 text-[#00a2e8] font-bold">{selectedBook.publisher || "শর্টবুক"}</td>
                      </tr>
                      <tr className="border-b border-stone-200 bg-stone-50">
                        <td className="p-3 font-extrabold text-stone-800">Edition (সংস্করণ)</td>
                        <td className="p-3 text-stone-600">{selectedBook.edition || "1st"}</td>
                      </tr>
                      <tr className="border-b border-stone-200 bg-white">
                        <td className="p-3 font-extrabold text-stone-800">Number of Pages (পৃষ্ঠা সংখ্যা)</td>
                        <td className="p-3 text-stone-600">{selectedBook.pages || 30}</td>
                      </tr>
                      <tr className="border-b border-stone-200 bg-stone-50">
                        <td className="p-3 font-extrabold text-stone-800">Country (দেশ)</td>
                        <td className="p-3 text-stone-600">{selectedBook.country || "বাংলাদেশ"}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-extrabold text-stone-800">Language (ভাষা)</td>
                        <td className="p-3 text-stone-600">{selectedBook.language}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: AUTHOR */}
            {activeTab === "author" && (
              <div className="space-y-6">
                
                {/* Author profile upper alignment block */}
                <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-stone-150 pb-5">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-stone-200 bg-stone-100 flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300" // dynamic placeholder representation
                      className="w-full h-full object-cover" 
                      alt={selectedBook.author}
                    />
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      {selectedBook.author}
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-stone-400">
                      <Users size={12} />
                      <span>1.9K followers</span>
                    </div>

                    <button className="px-5 py-1 bg-[#00a2e8] hover:bg-[#0091d5] text-white font-bold text-[10px] rounded-full shadow-sm transition-all uppercase mt-1 cursor-pointer">
                      Follow
                    </button>
                  </div>
                </div>

                {/* Author description text */}
                <div className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed space-y-3">
                  <p>
                    In June 2017, I quit my job to pursue my passion for personal development and become a full-time writer. At the time, I didn't enjoy my job. It felt as though I wasn't doing what I was supposed to be doing. There was a clear lack of meaning and purpose in my life, and I needed to do something about it. I had big dreams.
                  </p>
                  <p>
                    Having read dozens of personal development books, I sensed that I could bring something unique to the field. I wanted to transform my life and bring countless people with me on that journey. I was excited. There was a problem though. While I could see my potential, I didn't know how to unlock it.
                  </p>
                  <p>
                    My efforts eventually paid off. I have sold more than 500,000 books and reached over 1 million readers around the world. My best-selling book "Master Your Emotions" has sold over 300,000 copies and has been translated into twenty different languages.
                  </p>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* 🟢 LOWER AREA: EXPLORE COMPLEMENTARY E-BOOKS CABINET 🟢 */}
        {ebooks.length > 1 && (
          <div className="space-y-6">
            <div className="text-left border-b border-stone-200 pb-3">
              <span className="text-[10px] text-[#E63946] font-bold uppercase tracking-wider font-sans">More Electronic Publications</span>
              <h3 className="text-xl font-serif font-extrabold text-stone-900 mt-0.5">অন্যান্য ই-বুকসমূহ ব্রাউজ করুন (E-books Rack)</h3>
              <p className="text-stone-400 text-[11px] mt-1 font-sans">আমাদের কালেকশন থেকে যেকোনো আকর্ষণীয় ই-বুক সিলেক্ট করুন</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {ebooks.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBook(b);
                    setActiveTab("summary");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedBook.id === b.id 
                      ? "bg-[#E63946]/5 border-[#E63946] shadow-md scale-102" 
                      : "bg-white border-stone-200 hover:border-[#E63946]/20 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden relative shadow bg-stone-100 mb-3.5 flex items-center justify-center">
                    <img src={b.coverUrl} alt={b.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/15"></div>
                  </div>
                  
                  <div className="text-left">
                    <span className="text-[9px] text-[#E63946] font-bold uppercase font-sans tracking-wide block mb-0.5">
                      {b.author}
                    </span>
                    <h4 className="font-serif text-xs font-bold text-stone-900 line-clamp-1">
                      {b.title}
                    </h4>
                    <div className="flex items-center justify-between pt-1.5 mt-2 border-t border-stone-150">
                      <span className="text-xs font-serif font-bold text-stone-900">৳{b.price}</span>
                      <span className="text-[8px] bg-sky-100 text-sky-700 font-bold px-1.5 py-0.5 rounded uppercase font-sans">
                        PDF
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 🔴 OVERLAY: ACCESSIBLE HIGH-FIDELITY BOOK PAGE READER MODAL 🔴 */}
      {showReader && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-sans select-none animate-fade-in">
          
          <div className="relative bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl flex flex-col h-[85vh] sm:h-[80vh] overflow-hidden focus:outline-none">
            
            {/* Header segment of reader */}
            <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-yellow-400 animate-pulse" />
                <div className="text-left">
                  <h3 className="text-xs sm:text-sm font-bold font-serif line-clamp-1">{selectedBook.title}</h3>
                  <span className="text-[10px] text-stone-400">by {selectedBook.author} (ফ্রী রিডার সংস্করণ)</span>
                </div>
              </div>

              <button
                onClick={() => setShowReader(false)}
                className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-full transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Read Canvas Content Panel */}
            <div className="flex-grow p-5 sm:p-8 overflow-y-auto bg-amber-50/20 text-stone-850 flex flex-col justify-start relative text-left">
              
              {/* Subtle vintage book paper background texture */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/5 via-transparent to-transparent pointer-events-none"></div>

              {/* Check if Locked (Pages > 4 count as Paywall blocks unless purchased!) */}
              {readerPage > 4 && !isPurchased ? (
                
                /* PREMIUM PAYWALL INTERFACE STYLED EXTREMELY HIGH END */
                <div className="m-auto max-w-sm w-full text-center p-6 bg-white border border-stone-200 shadow-lg rounded-2xl flex flex-col items-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-red-50 text-[#E63946] flex items-center justify-center shadow-inner border border-red-100 bounce-animation">
                    <Smartphone size={24} className="animate-pulse" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-serif font-extrabold text-stone-900 uppercase">🔒 পেইড কন্টেন্ট লক স্ক্রিন</h4>
                    <p className="text-[11px] leading-relaxed text-stone-500 font-sans">
                      বইটির পুরো কন্টেন্ট পড়তে দয়া করে ই-বুক সংস্করণটি ক্রয় করুন। ফ্রী প্রিভিউ সংস্করণটি কেবল ৪ পৃষ্ঠা পর্যন্ত অ্যাক্সেসযোগ্য।
                    </p>
                  </div>

                  {/* Pricing and checkout trigger */}
                  <div className="w-full bg-stone-50 p-3 rounded-xl border border-stone-150 flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[9px] text-stone-400 block font-bold">নির্ধারিত বিনিময় মূল্য:</span>
                      <strong className="text-stone-800 text-lg font-serif">৳{selectedBook.price} টাকা</strong>
                    </div>
                    <div className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                      <Check size={10} /> আজীবনের লাইফটাইম অ্যাক্সেস!
                    </div>
                  </div>

                  <div className="w-full space-y-2 pt-1">
                    <button
                      onClick={() => {
                        setShowReader(false);
                        onDirectCheckout(selectedBook);
                      }}
                      className="w-full py-3 bg-[#00a2e8] hover:bg-[#0091d5] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 uppercase cursor-pointer"
                    >
                      বইটি কিনুন (Buy Now ৳{selectedBook.price})
                    </button>
                    <button
                      onClick={() => setReaderPage(4)}
                      className="w-full py-1.5 bg-white hover:bg-stone-50 text-stone-500 hover:text-stone-700 text-[10px] font-bold rounded"
                    >
                      ← ৪ পৃষ্ঠায় ফিরে যান
                    </button>
                  </div>
                </div>

              ) : (

                /* RENDER STANDARD READABLE PAGE */
                <div className="space-y-4 h-full flex flex-col justify-between font-sans">
                  <div className="whitespace-pre-line text-xs sm:text-sm font-medium leading-relaxed tracking-wide text-stone-750 font-sans p-2 bg-white/60 border border-stone-150 rounded-xl max-h-[50vh] overflow-y-auto">
                    {previewPages[readerPage - 1]}
                  </div>

                  {/* Underneath support disclaimer */}
                  <div className="text-[10px] text-stone-400 border-t border-stone-150 pt-2 flex justify-between items-center bg-transparent mt-auto select-none col-span-2">
                    <span className="flex items-center gap-1 font-semibold text-stone-500">
                      <ShieldCheck size={11} className="text-emerald-500" /> সুরক্ষিত ডিজিটাল ডিস্ট্রিবিউশন
                    </span>
                    <span>onlinegoppo.site</span>
                  </div>
                </div>

              )}

            </div>

            {/* Bottom Controls strip */}
            <div className="bg-stone-900 border-t border-stone-800 p-4 flex items-center justify-between text-white select-none shrink-0">
              <button
                onClick={() => setReaderPage(p => Math.max(1, p - 1))}
                disabled={readerPage === 1}
                className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 hover:text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={14} /> পূর্ববর্তী পৃষ্ঠা
              </button>

              <span className="text-xs text-stone-400 font-mono">
                পৃষ্ঠা <strong className="text-white font-bold">{readerPage}</strong> / {totalPages}
              </span>

              <button
                onClick={() => setReaderPage(p => Math.min(totalPages, p + 1))}
                disabled={readerPage === totalPages}
                className="px-3.5 py-1.5 bg-[#00a2e8] hover:bg-[#0091d5] disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                পরবর্তী পৃষ্ঠা <ChevronRight size={14} />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
