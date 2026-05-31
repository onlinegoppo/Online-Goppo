/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BlogPost } from "../types";
import { BookOpen, Calendar, User, ArrowLeft, Send, Sparkles, MessageSquare } from "lucide-react";

interface BlogSectionProps {
  blogs: BlogPost[];
  onBackToHome?: () => void;
}

export default function BlogSection({ blogs, onBackToHome }: BlogSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Comments simulator
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState<{ name: string; text: string; date: string }[]>([
    { name: "তাহসিন আহমেদ", text: "অসাধারণ রিভিউ! রবীন্দ্রনাথের শেষের কবিতা উপন্যাসটি সত্যিই সময়ের চেয়ে অনেক এগিয়ে ছিল।", date: "২৮ মে, ২০২৬" }
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
    setTimeout(() => setCommentNotice(false), 2000);
  };

  return (
    <div className="py-12 bg-white font-sans min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        {/* DETAIL VIEW ON SELECTING A POST */}
        {selectedPost ? (
          <article className="space-y-6 handle-animation-fade-in">
            {/* Nav Back Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1B263B] font-semibold rounded-lg text-xs flex items-center gap-2 mb-4 w-fit cursor-pointer transition-colors"
            >
              <ArrowLeft size={12} /> সব ব্লগ পড়ুন
            </button>

            {/* Thumbnail Header Image */}
            <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden relative shadow-lg">
              <img
                src={selectedPost.coverUrl}
                alt={selectedPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="bg-[#C5A059] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase font-sans tracking-wide">
                  {selectedPost.tags[0] || "সাহিত্য সমালোচনা"}
                </span>
                <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight leading-tight">
                  {selectedPost.title}
                </h1>
              </div>
            </div>

            {/* Meta information row */}
            <div className="flex flex-wrap gap-4 items-center text-xs text-stone-500 border-b border-gray-200 pb-3">
              <span className="flex items-center gap-1.5 font-medium">
                <User size={13} className="text-[#C5A059]" /> লেখকঃ {selectedPost.author}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar size={13} className="text-[#C5A059]" /> প্রকাশিতঃ {selectedPost.date}
              </span>
              <div className="flex gap-1">
                {selectedPost.tags.map((tag, idx) => (
                  <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-medium text-stone-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Content area */}
            <div className="text-stone-750 font-serif leading-relaxed text-sm md:text-base space-y-4 whitespace-pre-line tracking-wide">
              {selectedPost.content}
            </div>

            {/* COMMENTS AREA SIMULATOR */}
            <div className="border-t border-gray-200 pt-8 space-y-6">
              <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <MessageSquare size={16} className="text-[#1B263B]" /> পাঠকদের মন্তব্য ({commentsList.length})
              </h3>

              {commentsList.map((comm, idx) => (
                <div key={idx} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between font-semibold text-stone-850">
                    <span>{comm.name}</span>
                    <span className="text-[10px] font-normal text-stone-500">{comm.date}</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed font-sans">{comm.text}</p>
                </div>
              ))}

              {/* Submit a comment form */}
              <form onSubmit={handlePostComment} className="space-y-3 font-sans text-xs">
                <p className="font-bold text-stone-700">একটি মন্তব্য করুন:</p>
                {commentNotice && (
                  <div className="bg-green-100 text-green-800 p-2.5 rounded-lg text-xs">
                    ✓ আপনার মন্তব্যটি প্রকাশিত হয়েছে!
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="আপনার নাম"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-800"
                  />
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="মন্তব্যের বিবরণ লিখুন..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-800 pr-9"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 p-1 bg-[#1B263B] text-white rounded hover:bg-[#121A2A]"
                    >
                      <Send size={11} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </article>
        ) : (
          /* BLOGS MATRIX VIEW */
          <div className="space-y-8">
            <div className="text-center space-y-1.5">
              <h2 className="text-3xl font-serif font-bold text-[#1B263B] tracking-tight">সাহিত্য রসালয় (Book Haven Blog)</h2>
              <p className="text-stone-500 text-xs font-sans max-w-md mx-auto leading-relaxed">
                বই পর্যালোচনা, সাহিত্যিকদের ইতিহাস এবং সমসাময়িক পাঠকদের জ্ঞান সমৃদ্ধ ব্লগসমূহ নিয়মিত চর্চা করুন।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {blogs.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white border border-gray-200 hover:border-[#1B263B]/25 p-4 rounded-xl flex flex-col justify-between hover:shadow-md cursor-pointer transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="w-full aspect-[16/10] bg-stone-100 rounded-lg overflow-hidden border border-stone-200 font-sans shadow-sm">
                      <img src={post.coverUrl} alt={post.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-stone-400 font-mono">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
                      <span>•</span>
                      <span>লেখকঃ {post.author}</span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-stone-900 hover:text-[#C5A059] transition-colors line-clamp-1 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-sans line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <span className="text-[11px] font-sans text-[#1B263B] hover:text-[#C5A059] transition-colors font-semibold inline-flex items-center gap-1 pt-3 border-t border-gray-200 mt-4">
                    সম্পূর্ণ বিবরণ পড়ুন <BookOpen size={11} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
