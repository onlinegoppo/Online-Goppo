/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Book } from "../types";
import { 
  X, 
  ShoppingCart, 
  Star, 
  Landmark, 
  BookmarkMinus, 
  BookOpen, 
  Smartphone, 
  AlertTriangle, 
  Film,
  ZoomIn,
  ZoomOut,
  Lock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface BookDetailProps {
  book: Book;
  onClose: () => void;
  onAddToCart: (book: Book) => void;
  onDirectCheckout: (book: Book) => void;
}

export default function BookDetail({ book, onClose, onAddToCart, onDirectCheckout }: BookDetailProps) {
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showPreviewReader, setShowPreviewReader] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleCartClick = () => {
    onAddToCart(book);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  // Dynamically extract or synthesize a high-fidelity 4-page free preview PDF slice
  const getPreviewPages = (targetBook: Book): string[] => {
    if (targetBook.previewPages && targetBook.previewPages.length > 0) {
      return targetBook.previewPages.slice(0, 4);
    }
    // Fallback template for books that do not have custom page contents
    return [
      `১ম পৃষ্ঠা: ভূমিকা ও প্রস্তাবন\n\nবইয়ের নাম: ${targetBook.title}\nলেখক: ${targetBook.author}\n${targetBook.translator ? `অনুবাদক: ${targetBook.translator}\n` : ""}${targetBook.publisher ? `প্রকাশনী: ${targetBook.publisher}\n` : ""}আইএসবিএন: ${targetBook.isbn || "N/A"}\n\nসূচনাপত্র:\nজগতে সফলতার মূল রহস্য লুকিয়ে থাকে আমাদের একাগ্র মনোযোগের শক্তিতে। লেখক ${targetBook.author} তাঁর দীর্ঘদিনের গভীর গবেষনার ফলস্বরূপ এই অনবদ্য সৃষ্টিতে আমাদের দেখিয়েছেন কীভাবে আমরা চারপাশের সহস্র কোলাহল পেরিয়ে নিজের লক্ষ্য অর্জনে অবিরাম দৃষ্টি নিবদ্ধ রাখতে পারি। এটি কেবল কোনো বই নয়, আপনার সফলতার পথে চলার এক আলোকবর্তিকা।`,
      
      `২য় পৃষ্ঠা: বিষয়ের রূপরেখা (সূচিপত্র)\n\n১. গভীর কাজের সূচনা (Deep Focus Engine)\n২. মনোযোগ হারানোর বৈজ্ঞানিক কারণ ও ডোপামিন হ্যাকিং\n৩. আমাদের চারপাশে ডিস্ট্রাকশন দূর করার ৪টি ম্যাজিক রুল\n৪. দৈনন্দিন প্রোডাক্টিভিটি বুস্টার রুটিন\n\n"যে মানুষটি নিজের চিন্তাকে ২৪ ঘন্টা যেকোনো মুহূর্তে একটি নির্দিষ্ট বিষয়ে ঘণ্টার পর ঘণ্টা নিবিষ্ট রাখতে পারে, জগতের কোনো কঠিনতম বাধাই তাকে কখনো আটকে রাখতে পারে না।"`,
      
      `৩য় পৃষ্ঠা: প্রথম অধ্যায় - ডিস্ট্রাকশন ও বিজ্ঞান\n\nআমরা যখন কোনো আধুনিক টেকনোলজি বা ডিভাইস নিয়ে কাজ করি, তখন কেন আমাদের মনোযোগ বিক্ষিপ্ত হয়?\n\nমস্তিষ্কের ভেতরের ডোপামিন যখন কোনো কুইক রিওয়ার্ড বা নোটিফিকেশনের খোঁজে ব্যস্ত থাকে, আমরা তখন কোনো দীর্ঘমেয়াদি ধাপে ফোকাস দিতে অক্ষম হই। আজকের যুগে ফোকাস ধরে রাখার প্রধান শর্ত হলো অবচেতন মনকে এমনভাবে ট্রেইন করা, যেন সেটি অলস চিত্তবিনোদনের বদলে দীর্ঘমেয়াদি প্রজেক্টে শান্তি ও সন্তুষ্টি খুঁজে পায়।`,
      
      `৪র্থ পৃষ্ঠা: ২য় অধ্যায় - ফোকাস বাড়ানোর ৫টি জাদুকরী নিয়ম\n\n১. নোটিফিকেশন সাইলেন্স নিয়ম: কাজ করার সময় ফোন ও পিসির সকল সোশ্যাল মিডিয়া নোটিফিকেশন সম্পূর্ণ অফ করে দিন।\n২. কাজের ৯০ মিনিট ব্লক: গবেষণায় দেখা গেছে ৯০ মিনিটের গভীর সেশন মানুষের মস্তিস্কের চূড়ান্ত ধারণক্ষমতা প্রকাশে ভূমিকা রাখে।\n৩. পোমোডোরো স্ট্র্যাটেজি: ২৫ মিনিট নিবিড় কাজ ও ৫ মিনিট বুক স্পেসিং শ্বাসক্রিয়া।\n৪. স্বাস্থ্য সম্মত ফুডিং এবং নিদ্রা: আমাদের মনোযোগের সুস্থতা শরীরের সামগ্রিক এনার্জির সাথে নিবিড়ভাবে যুক্ত।\n৫. মাল্টিটাস্কিং সম্পূর্ণ বর্জন করে সিঙ্গেল প্রজেক্ট ফোকাস করুন!`
    ];
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Detail Card Overlay Container */}
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full border border-gray-200 shadow-2xl overflow-hidden focus:outline-none flex flex-col md:flex-row handle-animation-fade-in"
      >
        {/* Close Button top corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full transition-colors z-20"
        >
          <X size={16} />
        </button>

        {/* Left Column: Book cover focus visualizer */}
        <div className="md:w-5/12 bg-gray-50/50 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-200">
          <div className="w-48 h-68 shadow-2xl rounded-xl overflow-hidden relative group border border-stone-200 transform md:rotate-2 hover:rotate-0 hover:scale-[1.02] duration-300">
            <img
              src={book.coverUrl}
              alt={book.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Real book spine layout effect */}
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/30 via-black/5 to-transparent shadow-[inset_-1px_0_0_rgba(255,255,255,0.1)]"></div>
          </div>

          <div className="mt-6 flex flex-col items-center text-center w-full px-4">
            <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider font-sans">ফরম্যাট টাইপ</span>
            <div className="flex items-center gap-2 mt-1.5 mb-3.5">
              {book.type === "ebook" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] text-xs font-bold font-sans">
                  <Smartphone size={13} /> ই-বুক PDF
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B263B]/10 border border-[#1B263B]/20 text-[#1B263B] text-xs font-bold font-sans">
                  <BookOpen size={13} /> মুদ্রিত কপি (Paperback)
                </span>
              )}
            </div>

            {book.type === "ebook" && (
              <button
                onClick={() => {
                  setActivePage(1);
                  setShowPreviewReader(true);
                }}
                className="w-full max-w-[200px] py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow border border-emerald-500 shadow-emerald-500/10 cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-103"
              >
                <BookOpen size={13} className="animate-pulse text-white" />
                ফ্রী ৪-পৃষ্ঠা প্রিভিউ দেখুন
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Book core metadata & details */}
        <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Authors & Rating */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[#C5A059] text-xs font-bold uppercase tracking-wider font-sans">
                {book.category.toUpperCase()}
              </span>
              <div className="flex items-center gap-1 text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded text-xs font-bold">
                <Star size={12} className="fill-amber-500 stroke-none" />
                <span>{book.rating.toFixed(1)} / ৫.০ (রেটিং)</span>
              </div>
            </div>

            {/* Title & Author */}
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900">
                {book.title}
              </h2>
              <p className="text-[#1B263B] font-sans font-medium text-sm mt-1">
                লেখক: <span className="font-semibold underline underline-offset-2">{book.author}</span>
              </p>
            </div>

            {/* Specific Specs Ribbon (Pages, Language, Published) */}
            <div className="grid grid-cols-3 gap-3 bg-gray-50/50 p-2.5 rounded-xl border border-gray-200 text-center text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-sans">পৃষ্ঠা সংখ্যা</span>
                <span className="font-serif text-[#1B263B] font-medium">{book.pages} পৃষ্ঠা</span>
              </div>
              <div className="border-x border-gray-200">
                <span className="text-stone-400 block text-[10px] uppercase font-sans">ভাষা</span>
                <span className="font-sans font-medium text-[#1B263B]">{book.language}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-sans">প্রকাশের বছর</span>
                <span className="font-serif text-[#1B263B] font-medium">{book.publishedYear}</span>
              </div>
            </div>

            {/* Book Description Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 text-xs font-semibold font-sans uppercase tracking-wider">সারসংক্ষেপ (Description)</span>
                {book.type === "ebook" && (
                  <button
                    onClick={() => {
                      setActivePage(1);
                      setShowPreviewReader(true);
                    }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen size={12} /> ৪ পৃষ্ঠা ফ্রী পড়ুন
                  </button>
                )}
              </div>
              <p className="text-stone-600 text-xs md:text-sm font-sans leading-relaxed tracking-wide bg-white/70 p-3 rounded-lg border border-gray-200 max-h-32 overflow-y-auto font-sans">
                {book.description}
              </p>
            </div>

            {/* Promo Trailer Video Player (If Uploaded) */}
            {book.videoUrl && (
              <div className="space-y-1.5">
                <span className="text-stone-500 text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-1 text-[#E63946]">
                  <Film size={12} /> বইয়ের ভিডিও পরিচিতি (Promo Video Trailer)
                </span>
                <div className="rounded-xl overflow-hidden shadow-sm border border-stone-200 aspect-video w-full bg-black">
                  <video 
                    src={book.videoUrl} 
                    controls 
                    className="w-full h-full object-cover" 
                    poster={book.coverUrl}
                  />
                </div>
              </div>
            )}

            {/* SKU and Stock Inventory Controls */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-200">
              <span className="text-stone-400 font-mono">ISBN: {book.isbn || "N/A-9828-X"}</span>
              <div>
                {book.type === "physical" ? (
                  book.stock > 0 ? (
                    <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded font-semibold">
                      স্টক: {book.stock} টি কপি অবশিষ্ট
                    </span>
                  ) : (
                    <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      <AlertTriangle size={12} /> আউট অফ স্টক
                    </span>
                  )
                ) : (
                  <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded font-semibold">
                    তাত্ক্ষণিক ই-বুক ডাউনলোড যোগ্য
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Purchase Actions */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs text-stone-400 uppercase tracking-tight block">বইয়ের মূল্য</span>
              <span className="font-serif text-3xl font-bold text-[#1B263B]">৳{book.price}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCartClick}
                disabled={book.type === "physical" && book.stock <= 0}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                  book.type === "physical" && book.stock <= 0
                    ? "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed"
                    : addedSuccess
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-50 hover:bg-[#1B263B]/5 text-[#1B263B] border border-gray-200"
                }`}
              >
                <ShoppingCart size={14} />
                {addedSuccess ? "কার্টে যোগ হয়েছে!" : "কার্টে রাখুন"}
              </button>

              <button
                onClick={() => {
                  onDirectCheckout(book);
                  onClose();
                }}
                disabled={book.type === "physical" && book.stock <= 0}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-semibold text-xs text-white transition-all flex items-center justify-center gap-2 ${
                  book.type === "physical" && book.stock <= 0
                    ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                    : "bg-[#1B263B] hover:bg-[#121A2A]"
                }`}
              >
                سরাসরি কিনুন
              </button>
            </div>
          </div>

        </div>
      </div>
      </div>

      {/* 🔴 OVERLAY: ACCESSIBLE HIGH-FIDELITY BOOK PAGE READER MODAL 🔴 */}
      {showPreviewReader && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none animate-fade-in font-sans">
          <div className="relative bg-[#F3F4F6] rounded-2xl max-w-4xl w-full border border-stone-200/50 shadow-2xl flex flex-col h-[90vh] sm:h-[85vh] overflow-hidden">
            
            {/* --- Top Toolbar --- */}
            <div className="bg-stone-900 border-b border-stone-850 px-4 py-3 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-11 rounded border border-stone-700 overflow-hidden relative shadow bg-stone-950 shrink-0 hidden sm:block">
                  <img src={book.coverUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt={book.title} />
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-black/20"></div>
                </div>

                <div className="text-left font-sans">
                  <span className="bg-emerald-500 text-stone-950 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">
                    DEMO SLICE (৪-পৃষ্ঠা প্রিভিউ)
                  </span>
                  <h3 className="text-xs sm:text-sm font-serif font-extrabold text-stone-100 line-clamp-1 mt-0.5">
                    {book.title} - Free Preview
                  </h3>
                  <p className="text-[10px] text-stone-400 line-clamp-1 font-sans">by {book.author}</p>
                </div>
              </div>

              {/* Toolbar Controls */}
              <div className="flex items-center gap-2 sm:gap-4 font-sans">
                <div className="hidden md:flex items-center gap-1.5 p-1 bg-stone-800 rounded-lg border border-stone-750 text-[11px]">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                    disabled={zoomLevel <= 80}
                    className="p-1 hover:bg-stone-700 rounded disabled:opacity-40 transition-all cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <span className="font-mono text-stone-300 font-bold px-1.5 select-none">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                    disabled={zoomLevel >= 130}
                    className="p-1 hover:bg-stone-700 rounded disabled:opacity-40 transition-all cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn size={13} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    onDirectCheckout(book);
                    setShowPreviewReader(false);
                    onClose();
                  }}
                  className="bg-[#00a2e8] hover:bg-[#0091d5] text-white text-[10px] sm:text-xs font-extrabold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all flex items-center gap-1.5 shadow active:scale-95 cursor-pointer uppercase tracking-wider font-sans"
                >
                  <ShoppingCart size={12} /> সম্পূর্ণ কপি কিনুন (৳{book.price})
                </button>

                <button
                  onClick={() => setShowPreviewReader(false)}
                  className="p-1.5 bg-stone-800 hover:bg-stone-750 text-stone-400 hover:text-stone-200 rounded-full transition-all cursor-pointer"
                  title="Close Reader"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* --- Main Workspace --- */}
            <div className="flex-grow flex overflow-hidden">
              
              {/* Sidebar Thumbnails Column */}
              <div className="w-16 sm:w-28 bg-stone-850 border-r border-stone-800 p-2 overflow-y-auto select-none shrink-0 flex flex-col space-y-3.5 items-center">
                <div className="text-[8px] sm:text-[9px] font-bold text-stone-500 uppercase tracking-widest text-center hidden sm:block pb-1.5 border-b border-stone-800 w-full">
                  PAGES
                </div>
                {[1, 2, 3, 4, 5].map((pageNum) => {
                  const isPageLocked = pageNum > 4;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setActivePage(pageNum);
                      }}
                      className={`relative w-12 sm:w-22 group transition-all text-left ${
                        activePage === pageNum
                          ? "ring-2 ring-emerald-500 rounded p-0.5 bg-stone-800"
                          : "hover:bg-stone-800/30 p-0.5 rounded"
                      }`}
                    >
                      {/* Scaled down thumbnail */}
                      <div className="aspect-[1/1.414] bg-white rounded border border-stone-700 shadow-sm overflow-hidden flex flex-col justify-between p-1 select-none relative">
                        {isPageLocked ? (
                          <div className="absolute inset-0 bg-stone-900/45 backdrop-blur-[1px] flex items-center justify-center">
                            <Lock size={14} className="text-white drop-shadow" />
                          </div>
                        ) : (
                          <div className="text-[4px] leading-[5px] text-stone-400 space-y-0.5 font-mono pointer-events-none line-clamp-6">
                            <div className="font-bold text-stone-700 text-[5px] line-clamp-1">{book.title}</div>
                            <div>{pageNum === 1 ? "সূচনা ও ভূমিকা" : pageNum === 2 ? "বিষয়ের সূচিপত্র" : pageNum === 3 ? "অধ্যায় ১" : "অধ্যায় ২"}</div>
                            <div>Lorem ipsum dolor site amet elit conse ctetuor. Adipiscing elit sed do eiusmod as.</div>
                          </div>
                        )}
                        <span className="text-[8px] text-stone-500 mt-auto text-right w-full block font-mono">
                          {pageNum}
                        </span>
                      </div>
                      
                      {/* Label check */}
                      <div className="text-[9px] text-center mt-1 text-stone-400 group-hover:text-stone-200 block truncate font-mono">
                        {isPageLocked ? "Locked" : `Page ${pageNum}`}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Readable A4 Document Sandbox Panel */}
              <div className="flex-grow p-4 sm:p-8 overflow-y-auto bg-stone-900 flex justify-center items-start text-stone-800 relative scroll-smooth">
                
                {activePage > 4 ? (
                  <div className="my-auto max-w-sm w-full bg-white rounded-3xl border border-stone-200 p-6 text-center shadow-2xl flex flex-col items-center space-y-4 font-sans animate-scale-up z-10">
                    <div className="w-16 h-16 rounded-full bg-red-50 text-[#E63946] flex items-center justify-center shadow-inner border border-red-100 animate-bounce">
                      <Lock size={26} />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-base font-serif font-extrabold text-stone-900">🔒 ৫ পৃষ্ঠা লকড (পেইড কন্টেন্ট)</h4>
                      <p className="text-xs leading-relaxed text-stone-600 font-sans">
                        ফ্রী প্রিভিউ সংস্করণটি ৪ পৃষ্ঠা পর্যন্ত পড়ার অনুমতি দেয়। পুরো বইয়ের সবগুলো পাতা বিস্তারিত পড়তে অনুগ্রহ করে ই-বুকটি ক্রয় করুন।
                      </p>
                    </div>

                    {/* Book info summary box */}
                    <div className="w-full bg-stone-50 p-3 rounded-2xl border border-stone-200 flex items-center justify-between text-left">
                      <div>
                        <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider font-sans">বইয়ের মূল্য</span>
                        <strong className="text-[#1B263B] text-lg font-serif">৳{book.price} টাকা</strong>
                      </div>
                      <div className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1 font-sans">
                        ✓ লাইফটাইম অ্যাক্সেস!
                      </div>
                    </div>

                    <div className="w-full space-y-2">
                      <button
                        onClick={() => {
                          onDirectCheckout(book);
                          setShowPreviewReader(false);
                          onClose();
                        }}
                        className="w-full py-3 bg-[#00a2e8] hover:bg-[#0091d5] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg uppercase tracking-wide font-sans"
                      >
                        বইটি এখনই কিনুন (Buy Now)
                      </button>
                      <button
                        onClick={() => setActivePage(4)}
                        className="w-full py-1.5 bg-white hover:bg-stone-50 text-stone-500 hover:text-stone-700 text-[10px] font-bold rounded-lg transition-colors border border-stone-200 cursor-pointer font-sans"
                      >
                        ← ৪ পৃষ্ঠায় ফিরে যান
                      </button>
                    </div>
                  </div>

                ) : (
                  <div 
                    style={{ transform: `scale(${zoomLevel / 100})` }}
                    className="bg-white rounded shadow-2xl p-6 sm:p-11 max-w-xl w-full min-h-[550px] aspect-[1/1.414] border border-stone-200 relative flex flex-col justify-between text-left font-sans transition-all duration-200 origin-top"
                  >
                    
                    {/* Diagnostic diagonal preview slice watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.05] overflow-hidden">
                      <div className="text-stone-900 font-black text-4xl sm:text-7xl font-sans tracking-widest uppercase -rotate-45 whitespace-nowrap">
                        PREVIEW ONLY • PREVIEW ONLY
                      </div>
                    </div>

                    {/* Top running header */}
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-stone-400 border-b border-stone-150 pb-2 select-none">
                      <span className="uppercase tracking-widest">onlinegoppo.site - ফ্রী রিডার</span>
                      <span className="font-serif italic font-bold">{book.title}</span>
                    </div>

                    {/* Content text */}
                    <div className="flex-grow pt-4 pb-6 overflow-y-auto">
                      <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-stone-750 font-sans p-1">
                        {getPreviewPages(book)[activePage - 1]}
                      </div>
                    </div>

                    {/* Bottom running footer with pagination */}
                    <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 border-t border-stone-150 pt-2 select-none">
                      <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                        <ShieldCheck size={11} /> সিকিউর ফ্রী স্লাইস
                      </span>
                      <span className="font-mono text-stone-500">
                        পৃষ্ঠা {activePage} / ৪
                      </span>
                    </div>

                  </div>

                )}

              </div>

            </div>

            {/* --- Bottom Navigation Control Footer strip --- */}
            <div className="bg-stone-900 border-t border-stone-850 p-4 flex items-center justify-between shrink-0 text-white select-none">
              <button
                onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                disabled={activePage === 1}
                className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 disabled:hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer font-sans"
              >
                <ChevronLeft size={14} /> পূর্ববর্তী পৃষ্ঠা
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 font-mono font-sans font-medium">
                  পাঠ পৃষ্ঠা <strong className="text-white font-bold">{activePage}</strong> / ৫
                </span>
                {activePage === 4 && (
                  <span className="bg-[#E63946] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse shadow font-sans">
                    শেষ ফ্রী পৃষ্ঠা!
                  </span>
                )}
              </div>

              <button
                onClick={() => setActivePage((p) => Math.min(5, p + 1))}
                disabled={activePage === 5}
                className="px-3.5 py-1.5 bg-[#00a2e8] hover:bg-[#0091d5] disabled:opacity-40 disabled:hover:bg-[#00a2e8] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer font-sans"
              >
                পরবর্তী পৃষ্ঠা <ChevronRight size={14} />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
