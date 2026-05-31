/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BlogPost } from "../types";
import { BookOpen, Calendar, User, ArrowLeft, ArrowRight, Send, MessageSquare, Feather, Bookmark, Sparkles } from "lucide-react";

interface BlogSectionProps {
  blogs: BlogPost[];
  onBackToHome?: () => void;
  initialSelectedPost?: BlogPost | null;
  onClearSelectedPost?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function BlogSection({ 
  blogs, 
  onBackToHome, 
  initialSelectedPost, 
  onClearSelectedPost,
  searchQuery = "",
  setSearchQuery
}: BlogSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(initialSelectedPost || null);

  // Sync state if initialSelectedPost changes from outer hierarchy
  useEffect(() => {
    if (initialSelectedPost !== undefined) {
      setSelectedPost(initialSelectedPost);
    }
  }, [initialSelectedPost]);

  const handleBackToAllPost = () => {
    setSelectedPost(null);
    if (onClearSelectedPost) {
      onClearSelectedPost();
    }
    if (setSearchQuery) {
      setSearchQuery("");
    }
  };

  // Comments simulator suited for scholarly interactions
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState<{ name: string; text: string; date: string }[]>([
    { name: "তাহসিন আহমেদ", text: "মাশাআল্লাহ, অত্যন্ত জ্ঞানগর্ভ ও সময়োপযোগী প্রবন্ধ। জ্ঞান সাধনা নিয়ে এই সুন্দর আলোচনাটি বর্তমান প্রজন্মের চোখ খুলে দেবে।", date: "১ মে, ২০২৬" }
  ]);
  const [commentNotice, setCommentNotice] = useState(false);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment = {
      name: commentName,
      text: commentText,
      date: "আজ"
    };
    setCommentsList([...commentsList, newComment]);
    setCommentName("");
    setCommentText("");
    setCommentNotice(true);
    setTimeout(() => setCommentNotice(false), 2500);
  };

  // Filter articles by category or general search input
  const queryLower = searchQuery.toLowerCase().trim();
  const filteredBlogs = blogs.filter((post) => {
    if (!queryLower) return true;
    return (
      post.title.toLowerCase().includes(queryLower) ||
      post.excerpt.toLowerCase().includes(queryLower) ||
      post.author.toLowerCase().includes(queryLower) ||
      (post.category && post.category.toLowerCase().includes(queryLower)) ||
      (post.issue && post.issue.toLowerCase().includes(queryLower)) ||
      post.tags.some(tag => tag.toLowerCase().includes(queryLower))
    );
  });

  return (
    <div className="py-12 bg-[#FAF8F5] font-sans min-h-[70vh] text-left">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        {/* VIEW ARCHIVE MODE (SELECTED POST ACTIVE) */}
        {selectedPost ? (
          <article className="space-y-6 handle-animation-fade-in bg-white border border-[#E5DFD3] p-6 md:p-8 rounded-2xl shadow-sm">
            
            {/* Nav Back Button */}
            <button
              onClick={handleBackToAllPost}
              className="px-4 py-2 bg-[#103B2B]/5 hover:bg-[#103B2B]/10 text-[#103B2B] font-bold rounded-lg text-xs flex items-center gap-2 mb-4 w-fit cursor-pointer transition-colors border border-[#E5DFD3]"
            >
              <ArrowLeft size={12} /> পূর্ববর্তী পৃষ্ঠা ও কলাম সূচী
            </button>

            {/* Thumbnail Header Image */}
            <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden relative shadow-inner border border-[#E5DFD3]">
              <img
                src={selectedPost.coverUrl}
                alt={selectedPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#103B2B]/85 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="bg-[#C5A059] text-white text-[9px] font-bold px-2.5 py-1 rounded select-none font-sans uppercase tracking-widest border border-[#C5A059]/30 shadow-md">
                  {selectedPost.category || "গবেষণাপত্র"}
                </span>
                <h1 className="text-xl md:text-3xl font-serif font-black tracking-tight leading-snug">
                  {selectedPost.title}
                </h1>
              </div>
            </div>

            {/* Meta information row */}
            <div className="flex flex-wrap gap-4 items-center text-xs text-stone-500 border-b border-[#F0EAE1] pb-4">
              <span className="flex items-center gap-1.5 font-bold text-[#103B2B]">
                <User size={14} className="text-[#C5A059]" /> কলাম লেখকঃ {selectedPost.author}
              </span>
              <span className="flex items-center gap-1.5 font-bold">
                <Calendar size={14} className="text-[#C5A059]" /> সংখ্যাঃ {selectedPost.issue || "চলতি সংখ্যা"}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-stone-400">
                <Bookmark size={14} /> প্রকাশের তারিখঃ {selectedPost.date}
              </span>
            </div>

            {/* Core Scholarly Text Area styled like high-quality papers */}
            <div className="text-stone-800 font-serif leading-relaxed text-sm md:text-[17px] space-y-5 tracking-wide pt-4 pb-8 pl-1 text-justify">
              {selectedPost.content.split("\n").map((line, i) => {
                if (!line.trim()) return <div key={i} className="h-4" />;
                
                // Check for inline video tag
                if (line.includes("<video") && line.includes("src=")) {
                  const srcMatch = line.match(/src="([^"]+)"/);
                  const videoSrc = srcMatch ? srcMatch[1] : "";
                  if (videoSrc) {
                    return (
                      <div key={i} className="my-6 rounded-xl overflow-hidden shadow-lg border border-[#E5DFD3] bg-black">
                        <video src={videoSrc} controls className="w-full max-h-[450px]" />
                      </div>
                    );
                  }
                }

                // Check for markdown image
                const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
                if (imgMatch) {
                  const alt = imgMatch[1];
                  const url = imgMatch[2];
                  return (
                    <div key={i} className="my-6 space-y-2 text-center">
                      <img src={url} alt={alt} className="w-full rounded-xl border border-[#E5DFD3] shadow-md my-2 object-cover max-h-[450px]" referrerPolicy="no-referrer" />
                      {alt && <span className="text-xs text-stone-500 italic block font-sans">চিত্রঃ {alt}</span>}
                    </div>
                  );
                }

                return (
                  <p key={i} className="whitespace-pre-line">
                    {line}
                  </p>
                );
              })}
            </div>

            {/* 📣 IN-CONTENT HIGHLY INTEGRATED AD BLOCK FOR REVENUE 📣 */}
            <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
              <div className="text-left">
                <span className="text-[8px] bg-[#C5A059]/15 text-[#C5A059] px-2 py-0.5 rounded mr-1.5 font-bold uppercase tracking-widest">
                  বিজ্ঞাপন সহযোগী
                </span>
                <p className="text-stone-700 text-xs font-semibold leading-relaxed mt-1 font-serif">
                  দারুল ইলম পাবলিশার্স - ইসলামী কিতাবাদি এবং প্রাচীন গবেষণাপত্রের বিশ্বস্ত মুদ্রণ ও পরিবেশক।
                </p>
              </div>
              <a 
                href="mailto:onlinegoppo@gmail.com?subject=AdvertiseWithUs"
                className="px-3.5 py-1.5 bg-[#103B2B] hover:bg-black text-[#FCFBF8] text-[10px] font-bold rounded-lg shrink-0 font-sans"
              >
                যোগাযোগ করুন
              </a>
            </div>

            {/* ACADEMIC INTERACTIONS & FEEDBACK OVERVIEW */}
            <div className="border-t border-[#E5DFD3] pt-8 space-y-6 text-left">
              <h3 className="font-serif text-[15px] font-bold text-stone-900 flex items-center gap-2 select-none">
                <MessageSquare size={16} className="text-[#C5A059]" /> পাঠকদের মতামত ও পর্যালোচনা ({commentsList.length})
              </h3>

              <div className="space-y-3.5">
                {commentsList.map((comm, idx) => (
                  <div key={idx} className="bg-[#FAF8F5]/85 p-4 rounded-xl border border-[#E5DFD3] space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-stone-800">
                      <span className="font-serif text-[#103B2B]">{comm.name}</span>
                      <span className="text-[10px] font-normal text-stone-400">{comm.date}</span>
                    </div>
                    <p className="text-stone-605 leading-relaxed font-sans">{comm.text}</p>
                  </div>
                ))}
              </div>

              {/* Submit feedback form */}
              <form onSubmit={handlePostComment} className="space-y-3.5 font-sans text-xs bg-[#FCFBF8] p-4.5 rounded-xl border border-[#E5DFD3]">
                <p className="font-bold text-[#103B2B]">আপনার মার্জিত মতামত এখানে ব্যক্ত করুন:</p>
                {commentNotice && (
                  <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg text-xs font-bold border border-emerald-100 animate-pulse">
                    ✓ মতামতটি পর্যালোচনার জন্য গৃহীত হয়েছে! শুকরিয়া।
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="আপনার শুভ নাম"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E5DFD3] focus:border-[#103B2B] rounded-lg outline-none text-stone-850 font-medium"
                  />
                  <input
                    type="text"
                    required
                    placeholder="মতামতের বিবরণ লিখুন..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E5DFD3] focus:border-[#103B2B] rounded-lg outline-none text-stone-850 sm:col-span-2"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#103B2B] text-white hover:bg-black rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    মতামত জমা দিন <Send size={11} />
                  </button>
                </div>
              </form>
            </div>
          </article>
        ) : (
          /* BLOG ARCHIVE LIST VIEW (GRID) */
          <div className="space-y-8 handle-animation-fade-in">
            <div className="text-center space-y-3 p-6 bg-white border border-[#E5DFD3] rounded-2xl shadow-sm">
              <span className="inline-flex items-center gap-1 border border-[#C5A059]/20 bg-[#C5A059]/10 px-3 py-1 rounded-full text-[11px] text-[#C5A059] font-black uppercase tracking-wider select-none font-sans">
                <Feather size={11} /> তালীমুল ইসলাম আর্কাইভসমূহ
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-black text-stone-900 tracking-tight">গবেষণাপত্র ও কলাম আর্কাইভ</h2>
              <p className="text-stone-500 text-xs md:text-sm font-sans max-w-lg mx-auto leading-relaxed">
                ঐতিহ্যবাহী আল-কুরআন, সুন্নাহর আলো, ফিকাহ এবং সমাজ সংস্কারকে কেন্দ্র করে প্রাজ্ঞ মাওলানাদের জীবনমুখী প্রবন্ধ সম্ভার।
              </p>
              
              {searchQuery && (
                <div className="pt-2 text-xs font-sans text-stone-600 font-bold flex items-center justify-center gap-1.5 select-none">
                  <span>অনুসন্ধান ক্যাটাগরি: <strong className="text-[#103B2B] bg-[#C5A059]/10 py-1 px-2.5 rounded border border-[#C5A059]/20">"{searchQuery}"</strong></span>
                  <button 
                    onClick={() => {
                      if (setSearchQuery) setSearchQuery("");
                    }} 
                    className="text-stone-400 hover:text-[#103B2B] text-[10px] underline"
                  >
                    স্পষ্ট করুন
                  </button>
                </div>
              )}
            </div>

            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {filteredBlogs.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      setSelectedPost(post);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-white border border-[#E5DFD3] hover:border-[#103B2B]/25 p-4 rounded-xl flex flex-col justify-between hover:shadow-md cursor-pointer transition-all duration-300 group"
                  >
                    <div className="space-y-3.5">
                      <div className="w-full aspect-[16/10] bg-stone-50 rounded-lg overflow-hidden border border-[#E5DFD3] relative">
                        <img 
                          src={post.coverUrl} 
                          alt={post.title} 
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-cover group-hover:scale-[1.01] duration-300" 
                        />
                        <span className="absolute top-2.5 left-2.5 bg-[#103B2B]/95 text-white text-[9px] font-bold px-2 py-0.5 rounded select-none border border-[#C5A059]/15">
                          {post.category || "তাত্ত্বিক প্রবন্ধ"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-stone-400 font-sans font-medium">
                        <span className="flex items-center gap-1 font-bold text-[#103B2B]"><Calendar size={11} className="text-[#C5A059]" /> {post.date}</span>
                        <span>•</span>
                        <span>লেখকঃ {post.author}</span>
                      </div>

                      <h3 className="font-serif text-sm md:text-base font-bold text-stone-900 group-hover:text-[#103B2B] transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-stone-500 font-sans line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <span className="text-[11px] font-sans text-[#103B2B] hover:text-[#C5A059] transition-colors font-bold inline-flex items-center gap-1.5 pt-3 border-t border-[#F0EAE1] mt-4 select-none">
                      সম্পূর্ণ প্রবন্ধ পড়ুন <ArrowRight size={11} className="text-[#C5A059]" />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-[#E5DFD3] rounded-2xl">
                <p className="text-stone-400 text-xs font-sans">আপনার কাঙ্ক্ষিত অনুসন্ধানে কোনো গবেষক প্রবন্ধ পাওয়া যায়নি। অনুগ্রহ করে অন্য তত্ত্ব বা ক্যাটাগরি দিয়ে চেষ্টা করুন।</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
