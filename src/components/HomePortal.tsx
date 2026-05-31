/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BlogPost, SiteSettings, Book } from "../types";
import { 
  BookOpen, Clock, MoveRight, ChevronRight, HelpCircle, 
  CheckCircle, ArrowRight, ShieldCheck, Mail, Calendar, 
  Award, Feather, Star, Compass, Bookmark, MessageSquare
} from "lucide-react";

interface HomePortalProps {
  books: Book[];
  blogs: BlogPost[];
  siteSettings: SiteSettings | null;
  onSelectBook: (book: Book) => void;
  onSelectBlog: (blog: BlogPost) => void;
  setCurrentTab: (tab: "home" | "shop" | "blog" | "admin" | "library" | "ebook-landing") => void;
  setSearchQuery: (query: string) => void;
  onDirectCheckout: (book: Book) => void;
}

export default function HomePortal({
  books,
  blogs,
  siteSettings,
  onSelectBook,
  onSelectBlog,
  setCurrentTab,
  setSearchQuery,
  onDirectCheckout
}: HomePortalProps) {
  
  // Side panel list tab: 'সর্বশেষ' (Latest) or 'পঠিত' (Most Popular)
  const [sidebarTab, setSidebarTab] = useState<"latest" | "popular">("latest");

  // Custom User Reader Poll States (Interactive)
  const [pollVoted, setPollVoted] = useState(false);
  const [pollOption, setPollOption] = useState<string | null>(null);
  const [pollVotes, setPollVotes] = useState({ yes: 82, no: 14, noComment: 4 });

  // Custom newsletter submission
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
      setEmailInput("");
    }
  };

  // Helper to construct a beautiful Bengali/Hijri Calendar Date
  const getBengaliDate = () => {
    const days = ["আজ", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
    const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
    const now = new Date();
    
    const dayName = days[now.getDay()];
    const dateNum = now.getDate();
    const monthName = months[now.getMonth()];
    const yearNum = 2026;

    const convertToBengaliDigits = (num: number) => {
      const bDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
      return num.toString().split("").map(digit => {
        return isNaN(parseInt(digit)) ? digit : bDigits[parseInt(digit)];
      }).join("");
    };

    return `${dayName}, ${convertToBengaliDigits(dateNum)} ${monthName} ${convertToBengaliDigits(yearNum)} খ্রি; ১৮ জিলকদ ১৪৪৭ হিজরি`;
  };

  // Safe categorization of blogs matching islamic themes (Al-Kawsar columns)
  const editorialArticles = blogs.filter(p => p.category === "সম্পাদকীয়" || p.tags.includes("সম্পাদকীয়"));
  const quranArticles = blogs.filter(p => p.category === "কুরআন অধ্যয়ন" || p.tags.includes("কুরআন অধ্যয়ন"));
  const hadithArticles = blogs.filter(p => p.category === "হাদীস অধ্যয়ন" || p.tags.includes("হাদীস অধ্যয়ন"));
  const jurisprudenceArticles = blogs.filter(p => p.category === "ফিকহ ও ফতোয়া" || p.tags.includes("ফিকহ ও ফতোয়া"));
  const societyArticles = blogs.filter(p => p.category === "পরিবার ও সমাজ" || p.tags.includes("পরিবার ও সমাজ"));

  // Lead main big article
  const leadPost = blogs[0] || {
    id: "default-lead",
    title: "অনলাইন ইসলামী সভ্যতার তাত্ত্বিক জ্ঞান এবং গবেষণার প্রাসঙ্গিকতা",
    excerpt: "কালের চক্রে মুসলিম উম্মাহর বুদ্ধিবৃত্তিক অগ্রযাত্রা এবং আধুনিক যুগে ইন্টারনেটের কল্যানে গবেষণাধর্মী সাহিত্য সর্বসাধারণের কাছে ছড়িয়ে দেওয়ার এক বিনীত প্রচেষ্টা।",
    content: "গবেষণা এবং অধ্যয়ন মানব জীবনের অবিচ্ছেদ্য অংশ...",
    author: "মাওলানা মুফতি আব্দুল মালেক",
    date: "১ মে ২০২৬",
    coverUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600",
    tags: ["সম্পাদকীয়", "গবেষণাপত্র"],
    category: "সম্পাদকীয়",
    issue: "রমজান ১৪৪৭ - মে ২০২৬"
  };

  const secondaryIssues = blogs.slice(1, 4);
  const popularPosts = [...blogs].reverse().slice(0, 5);

  const handlePollVote = (option: string) => {
    if (pollVoted) return;
    setPollOption(option);
    setPollVoted(true);
    setPollVotes(prev => {
      if (option === "yes") return { ...prev, yes: prev.yes + 1 };
      if (option === "no") return { ...prev, no: prev.no + 1 };
      return { ...prev, noComment: prev.noComment + 1 };
    });
  };

  return (
    <div className="bg-[#FAF8F5] text-[#2C3531] font-sans antialiased pb-12">
      
      {/* 🟢 TOP SUB-HEADER: ACADEMIC CALENDAR & ACCESS BANNER 🟢 */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-2 border-b border-[#E5DFD3] text-xs text-stone-600 font-medium">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2.5">
            <Calendar className="text-[#C5A059]" size={14} />
            <span className="text-[#103B2B] font-extrabold text-[12px] tracking-wide pr-3 border-r border-[#E5DFD3]">
              {getBengaliDate()}
            </span>
            <span className="hidden lg:inline text-stone-500 font-serif">Online Goppo আদলে প্রতিষ্ঠিত জ্ঞানগর্ভ অনলাইন কলাম ও গল্প আর্কাইভ</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50/70 border border-emerald-100/80 px-2.5 py-0.5 rounded-full text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              অফলাইন লাইব্রেরি সংযুক্তি: ৮,৫২০ জন সদস্য
            </span>
          </div>
        </div>
      </div>

      {/* 📣 MEGA AD REVENUE ZONE: TOP GENERAL SPONSOR LEADERBOARD (৭২৮x৯০) 📣 */}
      <div className="w-full bg-[#F3EFE0]/40 py-6 border-b border-[#E9E4DB] px-4 select-none">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
          <div className="text-[9px] text-gray-400 font-bold font-sans self-start tracking-wider mb-1 px-1.5 border-l-2 border-[#C5A059]">
            বিজ্ঞাপন / SPONSOR SUPPORT
          </div>
          
          <div className="w-full max-w-4xl bg-white border border-[#E5DFD3] p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm hover:shadow transition-all relative overflow-hidden group">
            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#C5A059]"></div>
            
            <div className="flex items-center gap-3.5 pl-3 text-left">
              <div className="w-12 h-12 bg-[#103B2B]/5 rounded-xl flex items-center justify-center text-[#103B2B] border border-[#E5DFD3] shrink-0">
                <Feather size={20} className="text-[#C5A059] animate-pulse" />
              </div>
              <div>
                <span className="bg-[#103B2B] text-[#FCFBF8] text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded mr-2 inline-block">
                  স্পন্সর কিতাবঘর
                </span>
                <h4 className="font-serif text-[13px] md:text-sm font-bold text-stone-900 group-hover:text-[#103B2B] transition-colors leading-snug">
                  ঐতিহ্যবাহী ফিকহি অনুবাদ গ্রন্থ 'হেদায়াহ' ও 'কুদুরী' এর বিশুদ্ধ সংস্করণ প্রকাশনা সহযোগী।
                </h4>
                <p className="text-stone-500 text-[11px] mt-0.5">
                  ইসলামী কুতুবখানা পক্ষ হতে সকল গবেষক পাঠকদের জন্য আজই সংগ্রহ করুন।
                </p>
              </div>
            </div>

            <div className="shrink-0 font-sans">
              <a 
                href="mailto:onlinegoppo@gmail.com?subject=AdvertisementSponsorship"
                className="px-4 py-2 bg-[#103B2B] hover:bg-black text-[#F3EFE0] font-bold rounded-lg text-xs transition-all tracking-wide flex items-center gap-1"
              >
                এখানে বিজ্ঞাপন দিন <MoveRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 📰 KNOWLEDGE ARCHIVE GRID LAYOUT 📰 */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT 8-COLUMNS STORYBOARD ================= */}
        <div className="lg:col-span-8 space-y-10 text-left">
          
          {/* Main Scholarly Editorial Lead Article */}
          <div 
            className="bg-white border border-[#E5DFD3] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
            onClick={() => onSelectBlog(leadPost)}
          >
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3 mb-4 select-none">
              <span className="text-xs text-[#C5A059] font-black uppercase tracking-widest flex items-center gap-1">
                <Star size={12} className="fill-current text-[#C5A059]" /> সম্পাদকীয় নিবন্ধ (Lead Editorial)
              </span>
              <span className="text-[11px] text-stone-400 font-mono">সূচী সংখ্যা: {leadPost.issue || "চলতি সংখ্যা"}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 flex flex-col justify-between h-full space-y-3">
                <div className="space-y-3">
                  <h1 className="font-serif text-xl md:text-2xl lg:text-3xl font-black text-stone-900 group-hover:text-[#103B2B] transition-colors leading-[1.3] tracking-tight">
                    {leadPost.title}
                  </h1>
                  
                  <div className="flex items-center gap-2 text-[11px] text-stone-400">
                    <span className="font-bold text-[#103B2B]">{leadPost.author}</span>
                    <span>•</span>
                    <span>{leadPost.date}</span>
                  </div>

                  <p className="text-stone-600 text-[12px] md:text-sm leading-relaxed font-sans">
                    {leadPost.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#103B2B] font-bold mt-4">
                  <span>নিবন্ধটি সম্পূর্ণ পড়ুন</span>
                  <ArrowRight size={13} className="text-[#C5A059] transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="md:col-span-7">
                <div className="aspect-[16/10] bg-[#FAF8F5] rounded-xl overflow-hidden border border-[#E5DFD3] relative">
                  <img 
                    src={leadPost.coverUrl} 
                    alt={leadPost.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500" 
                  />
                  <div className="absolute bottom-3 left-3 bg-[#103B2B]/90 backdrop-blur-sm text-white text-[9px] px-2.5 py-1 rounded border border-[#C5A059]/35 select-none font-bold">
                    {leadPost.category || " সম্পাদকীয় প্রতিবেদন "}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clean 2-Column Classifications (কুরআন ও সুন্নাহর আলো) */}
          <div className="space-y-4">
            <div className="border-b-2 border-[#103B2B] pb-1 flex justify-between items-center select-none font-serif">
              <h2 className="text-lg md:text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <Compass className="text-[#C5A059]" size={18} />
                গবেষণা বিষয়ক প্রবন্ধ সম্ভার
              </h2>
              <button 
                onClick={() => {
                  setCurrentTab("blog");
                  setSearchQuery("");
                }} 
                className="text-xs text-[#C5A059] hover:text-[#103B2B] font-bold flex items-center gap-0.5"
              >
                সব নিবন্ধ সম্ভার দেখান <MoveRight size={12} />
              </button>
            </div>

            {/* Simulated bento or grid of subsequent articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {secondaryIssues.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => onSelectBlog(post)}
                  className="bg-white p-4 rounded-xl border border-[#E5DFD3] hover:border-[#103B2B]/30 hover:shadow-sm cursor-pointer group flex flex-col justify-between transition-all duration-200"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#C5A059] font-black uppercase tracking-wider py-0.5 px-2 bg-[#C5A059]/10 rounded">
                        {post.category || "সমকালীন পর্যালোচনা"}
                      </span>
                      <span className="text-[10px] text-stone-400 font-serif">{post.issue || "শাবান সংখ্যা"}</span>
                    </div>

                    <h3 className="font-serif text-sm md:text-base font-bold text-stone-900 leading-snug group-hover:text-[#103B2B] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-stone-500 text-[11px] md:text-xs leading-relaxed font-sans line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-stone-400 mt-4 border-t border-[#F0EAE1] pt-2.5 font-sans">
                    <span className="font-medium text-[#103B2B]">{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 📣 MIDGRID AD CORNER: DEDICATED REVENUE BOX FOR EXTERNAL SPONSORS 📣 */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#103B2B] to-[#174A37] text-[#FCFBF8] border border-[#C5A059]/20 shadow-sm relative overflow-hidden select-none">
            <span className="absolute right-3 top-2.5 text-[8px] text-[#C5A059] uppercase tracking-widest font-extrabold pb-0.5 border-b border-[#C5A059]/20 font-mono">
              [ স্পন্সর অ্যাড ব্যানার / ADVERTISEMENT ]
            </span>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-5 pt-2">
              <div className="space-y-1.5 flex-1 text-left">
                <span className="bg-[#C5A059] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                  PREMIUM PARTNER
                </span>
                <h4 className="font-serif text-base font-bold tracking-tight text-white">
                  মাদরাসা শিক্ষক ও সাধারণ গবেষকদের জন্য বিশেষ মাকতাবাহ সফটওয়্যার প্যাকেজ!
                </h4>
                <p className="text-stone-300 text-[11px] leading-relaxed font-sans">
                  হাদীসের বিশুদ্ধতা যাচাই, ফিকহি রেফারেন্স এবং আরবী আরবী অভিধানসহ অফলাইন ডাটাবেস সফটওয়্যার ডেমো দেখতে ক্লিক করুন।
                </p>
              </div>

              <div className="shrink-0 flex gap-2 font-sans">
                <a 
                  href="mailto:onlinegoppo@gmail.com?subject=SoftwareInquiry"
                  className="px-4 py-2 bg-[#C5A059] hover:bg-[#BE933D] text-white font-bold rounded-lg text-xs transition-colors"
                >
                  বিস্তারিত জানুন
                </a>
              </div>
            </div>
          </div>

          {/* Monthly Issue Overview Tab Section */}
          <div className="bg-white border border-[#E5DFD3] p-5 rounded-2xl text-left">
            <h3 className="font-serif text-[15px] font-bold text-stone-900 border-b border-[#F0EAE1] pb-2 mb-3 px-1 flex items-center gap-1.5">
              <Bookmark size={15} className="text-[#C5A059]" />
              মাসিক সূচীপত্রের আর্কাইভ (Volume Archive)
            </h3>
            <p className="text-xs text-stone-500 mb-4 font-sans leading-relaxed">
              Online Goppo (অনলাইন গল্প) ব্লগের প্রকাশনা সংখ্যাভেদে প্রকাশিত নিবন্ধসমূহ সহজে পেতে নিচের প্রকাশনা সংখ্যা নির্বাচন করুন।
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-sans font-medium text-[#103B2B]">
              <button onClick={() => setSearchQuery("রমজান ১৪৪৭")} className="p-2.5 bg-[#FAF8F5] border border-[#E5DFD3] hover:border-[#103B2B] hover:bg-white text-center rounded duration-100 cursor-pointer">
                রমজান ১৪৪৭ - মে ২০২৬
              </button>
              <button onClick={() => setSearchQuery("শাবান ১৪৪৭")} className="p-2.5 bg-[#FAF8F5] border border-[#E5DFD3] hover:border-[#103B2B] hover:bg-white text-center rounded duration-100 cursor-pointer">
                শাবান ১৪৪৭ - এপ্রিল ২০২৬
              </button>
              <button onClick={() => setSearchQuery("রজব ১৪৪৭")} className="p-2.5 bg-[#FAF8F5] border border-[#E5DFD3] hover:border-[#103B2B] hover:bg-white text-center rounded duration-100 cursor-pointer">
                রজব ১৪৪৭ - মার্চ ২০২৬
              </button>
            </div>
          </div>

        </div>

        {/* ================= RIGHT 4-COLUMNS SIDEBAR (Polished Widgets) ================= */}
        <div className="lg:col-span-4 space-y-8 lg:pl-3 lg:border-l border-[#E5DFD3] text-left">
          
          {/* LATEST VS POPULAR ACADEMIC COLUMNS TABS */}
          <div className="border border-[#E5DFD3] rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="flex border-b border-[#E5DFD3] font-sans">
              <button
                onClick={() => setSidebarTab("latest")}
                className={`flex-1 py-3 text-xs font-bold transition-all text-center uppercase tracking-wider cursor-pointer ${
                  sidebarTab === "latest"
                    ? "bg-[#FCFBF8] text-[#103B2B] border-b-2 border-[#103B2B] font-extrabold"
                    : "bg-[#FAF8F5] text-stone-500 hover:text-black hover:bg-stone-50"
                }`}
              >
                সর্বশেষ নিবন্ধাবলী
              </button>
              <button
                onClick={() => setSidebarTab("popular")}
                className={`flex-1 py-3 text-xs font-bold transition-all text-center uppercase tracking-wider cursor-pointer ${
                  sidebarTab === "popular"
                    ? "bg-[#FCFBF8] text-[#103B2B] border-b-2 border-[#103B2B] font-extrabold"
                    : "bg-[#FAF8F5] text-stone-500 hover:text-black hover:bg-stone-50"
                }`}
              >
                পঠিত গবেষণাপত্র
              </button>
            </div>

            <div className="divide-y divide-[#F0EAE1] bg-[#FCFBF8] font-sans">
              {(sidebarTab === "latest" ? popularPosts : popularPosts.slice().reverse()).map((post, index) => {
                const bnNumbers = ["১", "২", "৩", "৪", "৫"];
                return (
                  <div 
                    key={post.id}
                    onClick={() => onSelectBlog(post)}
                    className="p-3.5 flex gap-3 hover:bg-white transition-colors cursor-pointer group"
                  >
                    <span className="font-serif text-2xl font-black text-[#C5A059]/40 group-hover:text-[#103B2B] transition-colors leading-none pr-1">
                      {bnNumbers[index] || "•"}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-serif text-[13px] font-bold text-stone-900 group-hover:text-[#103B2B] leading-snug transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-stone-400 text-[10px] flex items-center gap-1">
                        <Clock size={9} /> {post.date}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 📣 SIDEBAR RECTANGLE AD REVENUE CORNER (৩০০x২৫০) 📣 */}
          <div className="border border-[#E5DFD3] rounded-2xl p-4.5 bg-[#FAF8F5] select-none text-center shadow-inner">
            <div className="text-[9px] text-[#103B2B] font-extrabold tracking-wider mb-2 select-none font-sans text-left flex items-center justify-between">
              <span className="border-l-2 border-[#C5A059] pl-1">[ স্পনসরড কলাম ]</span>
              <span className="text-[8px] text-stone-400">৩০০ x ২৫০ পিক্সেল</span>
            </div>
            
            <div className="bg-white border border-[#E5DFD3] rounded-xl p-4 space-y-3.5 hover:shadow transition-shadow relative overflow-hidden text-left">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#103B2B]/5 rounded-full blur-2xl"></div>
              
              <div className="space-y-1">
                <span className="bg-[#103B2B] text-white text-[8px] font-bold font-sans px-2 py-0.5 rounded tracking-wider inline-block">
                  তালীমুল হাদীস স্কলারশিপ
                </span>
                <h4 className="font-serif text-[13px] font-bold leading-tight text-stone-900">
                  আরবী সাহিত্য ও ইসলামী ফিকহের ওপর উচ্চতর গবেষণা স্কলারশিপ মে ২০২৬
                </h4>
                <p className="text-stone-500 text-[10px] leading-relaxed font-sans">
                  একাডেমিক যোগ্যতাভিত্তিক সম্পূর্ণ অর্থ সহায়তাপ্রাপ্ত ১ বছরের খণ্ডকালীন দূরশিক্ষণ ডিপ্লোমা প্রোগ্রাম।
                </p>
              </div>

              <div className="pt-2 border-t border-[#F0EAE1] flex justify-between items-center bg-transparent">
                <span className="text-[9px] text-[#C5A059] font-bold uppercase tracking-wider">আবেদন চলমান</span>
                <a 
                  href="mailto:onlinegoppo@gmail.com?subject=ScholarshipInquiry"
                  className="px-3 py-1 bg-[#103B2B] hover:bg-black text-[#FCFBF8] text-[10px] font-bold rounded transition-colors font-sans flex items-center gap-0.5"
                >
                  আবেদন করুন <MoveRight size={10} />
                </a>
              </div>
            </div>
          </div>

          {/* 🗳️ ACADEMIC OPINION READER POLL 🗳️ */}
          <div className="border border-[#E5DFD3] rounded-2xl p-5 bg-white shadow-sm text-left">
            <h3 className="font-serif text-[14px] font-bold text-stone-900 border-b border-[#F0EAE1] pb-2 mb-3 px-1 flex items-center gap-1.5 select-none">
              <HelpCircle size={15} className="text-[#C5A059]" />
              আজকের মতামত জরিপ (Opinion Poll)
            </h3>

            <p className="text-xs font-semibold text-stone-700 leading-relaxed mb-4 font-sans">
              "আপনি কি মনে করেন আধুনিক ইন্টারনেটের কল্যানে গবেষণাধর্মী ফিকহি ও ইসলামী কলামসমূহ সর্বসাধারণের পাঠের জন্য উন্মুক্ত করা জ্ঞান প্রসারে সুদূরপ্রসারী ভূমিকা রাখবে?"
            </p>

            {!pollVoted ? (
              <div className="space-y-2 font-sans text-xs">
                <button
                  type="button"
                  onClick={() => handlePollVote("yes")}
                  className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:border-[#103B2B] hover:bg-[#FAF8F5] transition-colors font-medium flex items-center justify-between group cursor-pointer"
                >
                  <span>হ্যাঁ, এটি সময়োপযোগী ও প্রয়োজনীয়</span>
                  <CheckCircle size={14} className="opacity-0 group-hover:opacity-100 text-[#103B2B] transition-opacity" />
                </button>
                <button
                  type="button"
                  onClick={() => handlePollVote("no")}
                  className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:border-[#103B2B] hover:bg-[#FAF8F5] transition-colors font-medium flex items-center justify-between group cursor-pointer"
                >
                  <span>না, অনলাইন পঠনে গভীর প্রজ্ঞা অর্জন কঠিন</span>
                  <CheckCircle size={14} className="opacity-0 group-hover:opacity-100 text-[#103B2B] transition-opacity" />
                </button>
                <button
                  type="button"
                  onClick={() => handlePollVote("noComment")}
                  className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:border-[#103B2B] hover:bg-[#FAF8F5] transition-colors font-medium flex items-center justify-between group cursor-pointer"
                >
                  <span>মন্তব্য জানাতে পারছি না</span>
                  <CheckCircle size={14} className="opacity-0 group-hover:opacity-100 text-[#103B2B] transition-opacity" />
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 font-sans text-xs pt-1">
                <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg text-center font-bold text-[11px] mb-2 border border-emerald-100 select-none">
                  ✓ মতামত জরিপে সাড়া দেওয়ার জন্য শুকরিয়া!
                </div>
                
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-stone-700 mb-1">
                      <span>ঐকমত্য প্রকাশ ({pollOption === "yes" ? "আপনার মত" : "হ্যাঁ"})</span>
                      <span className="font-bold">{pollVotes.yes}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pollVotes.yes}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-stone-700 mb-1">
                      <span>ভিন্নমত পোষণ ({pollOption === "no" ? "আপনার মত" : "না"})</span>
                      <span className="font-bold">{pollVotes.no}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-stone-400 rounded-full" style={{ width: `${pollVotes.no}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-stone-700 mb-1">
                      <span>নিরপেক্ষ অবস্থান</span>
                      <span className="font-bold">{pollVotes.noComment}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-stone-300 rounded-full" style={{ width: `${pollVotes.noComment}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 📬 SUBSCRIPTION NEWSLETTER WIDGET 📬 */}
          <div className="border border-[#E5DFD3] rounded-2xl p-5 bg-[#FCFBF8] text-left">
            <h4 className="font-serif text-[14px] font-bold text-stone-900 mb-1.5 flex items-center gap-1.5">
              <Mail className="text-[#C5A059]" size={14} />
              মাসিক নতুন লেখা এলার্ট (Newsletter)
            </h4>
            <p className="text-[11px] text-stone-500 mb-3.5 font-sans leading-relaxed">
              নতুন গবেষণাপত্র এবং মাসিক সম্পাদকীয় সূচী প্রকাশিত হওয়ামাত্রই সরাসরি ইমেইলে নোটিফিকেশন পেতে যুক্ত হোন।
            </p>
            {emailSubscribed ? (
              <div className="p-2 bg-[#103B2B]/5 text-[#103B2B] text-center text-[11px] rounded font-bold border border-[#C5A059]/20">
                সাফল্যের সাথে এলার্ট সাবস্ক্রিপশন সম্পন্ন হয়েছে! কৃতজ্ঞতা।
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2 font-sans text-xs">
                <input 
                  type="email" 
                  placeholder="আপনার ইমেইল ঠিকানা..." 
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E5DFD3] focus:border-[#103B2B] outline-none rounded-lg"
                />
                <button 
                  type="submit"
                  className="w-full py-2 bg-[#103B2B] hover:bg-black text-[#FCFBF8] font-bold rounded-lg transition-colors cursor-pointer"
                >
                  যুক্ত হোন (Subscribe)
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
