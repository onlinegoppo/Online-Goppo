/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Book, CartItem } from "../types";
import { ShoppingCart, Star, Check, Smartphone, BookOpen, AlertCircle } from "lucide-react";

interface BookGridProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  searchQuery: string;
}

export default function BookGrid({ books, onSelectBook, onAddToCart, searchQuery }: BookGridProps) {
  // Category tabs list
  const categories = [
    { id: "all", label: "সকল বই" },
    { id: "bestsellers", label: "সেরা বিক্রেতা (Bestsellers)" },
    { id: "new-arrivals", label: "নতুন আয়োজন (New)" },
    { id: "ebooks", label: "ই-বুক / PDF (E-books)" }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formatFilter, setFormatFilter] = useState<"all" | "physical" | "ebook">("all");
  const [sortBy, setSortBy] = useState<"rating" | "price-asc" | "price-desc">("rating");
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Filter & Sort core logic
  const processedBooks = useMemo(() => {
    let result = [...books];

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.language && b.language.toLowerCase().includes(q))
      );
    }

    // Category match
    if (selectedCategory !== "all") {
      result = result.filter((b) => b.category === selectedCategory);
    }

    // Format Filter match
    if (formatFilter !== "all") {
      result = result.filter((b) => b.type === formatFilter);
    }

    // Sort order
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [books, selectedCategory, formatFilter, sortBy, searchQuery]);

  const handleAddToCartClick = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation(); // prevent opening book details modal
    onAddToCart(book);
    setJustAddedId(book.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  return (
    <div id="latest-ebooks" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#1B263B] tracking-tight">
              বইয়ের স্বর্গরাজ্য (Browse Bookstore)
            </h2>
            <p className="text-[#C5A059] text-sm mt-1 font-sans font-medium">
              আপনার কাঙ্ক্ষিত বইটি বেছে নিন এবং পড়া শুরু করুন আজই
            </p>
          </div>

          {/* Quick Format Filters as requested */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
            <button
              onClick={() => setFormatFilter("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                formatFilter === "all"
                  ? "bg-white text-[#1B263B] shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              সকল বই
            </button>
            <button
              onClick={() => setFormatFilter("physical")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                formatFilter === "physical"
                  ? "bg-white text-[#1B263B]/90 shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <BookOpen size={12} /> মুদ্রিত কফি (Physical)
            </button>
            <button
              onClick={() => setFormatFilter("ebook")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                formatFilter === "ebook"
                  ? "bg-white text-[#C5A059] shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Smartphone size={12} /> ই-বুক PDF (Digital)
            </button>
          </div>
        </div>

        {/* Categories, Sort menu & Stats Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-8 border-b border-gray-200">
          {/* Category Tabs list */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-[#1B263B] text-white font-semibold"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Selection & Book Counter */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="text-xs font-mono text-stone-400">
              {processedBooks.length} টি বই পাওয়া গেছে
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-sans hidden sm:inline">সর্ট করুন:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-sans bg-transparent border border-gray-200 py-1.5 px-3 rounded-lg outline-none text-[#1B263B] cursor-pointer focus:border-[#1B263B]"
              >
                <option value="rating">পাঠকদের রেটিং (Rating)</option>
                <option value="price-asc">দাম: কম থেকে বেশি (Price Asc)</option>
                <option value="price-desc">দাম: বেশি থেকে কম (Price Desc)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Book Grid */}
        {processedBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {processedBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="group bg-white rounded-xl border border-gray-200 hover:border-[#C5A059]/40 p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 relative"
              >
                {/* Book stand details / Format Badge sticker */}
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold tracking-tight uppercase shadow-sm flex items-center gap-1 ${
                  book.type === "ebook"
                    ? "bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20"
                    : "bg-[#1B263B]/10 text-[#1B263B] border border-[#1B263B]/20"
                }`}>
                  {book.type === "ebook" ? (
                    <>
                      <Smartphone size={10} /> PDF
                    </>
                  ) : (
                    <>
                      <BookOpen size={10} /> মুদ্রিত
                    </>
                  )}
                </span>

                {/* Cover representation container */}
                <div>
                  <div className="aspect-[4/5] bg-stone-100 rounded-lg overflow-hidden relative shadow-md group-hover:shadow-lg transition-shadow duration-300 transform group-hover:scale-[1.01] mb-4">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Real spine shadow book simulator */}
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/25 via-black/5 to-transparent"></div>
                  </div>

                  {/* Authors and Rating row */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] uppercase font-semibold text-stone-400 max-w-[70%] truncate">
                      {book.author}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      <Star size={8} className="fill-amber-500 stroke-none" />
                      <span>{book.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-sm md:text-base font-bold text-gray-900 group-hover:text-[#1B263B] transition-colors line-clamp-1 mb-1">
                    {book.title}
                  </h3>
                </div>

                {/* Pricing / CTA row */}
                <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] text-stone-400 block tracking-tight">মূল্য</span>
                    <span className="font-serif text-base font-semibold text-[#1B263B]">৳{book.price}</span>
                  </div>

                  {/* Interactive Add to Cart button */}
                  <button
                    onClick={(e) => handleAddToCartClick(e, book)}
                    disabled={book.type === "physical" && book.stock <= 0}
                    title={book.type === "physical" && book.stock <= 0 ? "আউট অফ স্টক" : "কার্টে যোগ করুন"}
                    className={`p-2 rounded-lg transition-all ${
                      book.type === "physical" && book.stock <= 0
                        ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                        : justAddedId === book.id
                        ? "bg-green-600 text-white"
                        : "bg-gray-50 hover:bg-[#1B263B]/5 text-[#1B263B] hover:text-[#1B263B] border border-gray-200"
                    }`}
                  >
                    {justAddedId === book.id ? <Check size={14} /> : <ShoppingCart size={14} />}
                  </button>
                </div>

                {/* Stock alert labels */}
                {book.type === "physical" && book.stock <= 5 && book.stock > 0 && (
                  <span className="absolute bottom-16 left-4 right-4 bg-orange-400/10 text-orange-700 text-[9px] font-semibold py-0.5 px-2 rounded border border-orange-200/50 text-center pointer-events-none">
                    মাত্র {book.stock} টি অবশিষ্ট আছে!
                  </span>
                )}
                {book.type === "physical" && book.stock <= 0 && (
                  <span className="absolute bottom-16 left-4 right-4 bg-red-100 text-red-700 text-[10px] font-bold py-1 px-2 rounded border border-red-200 text-center pointer-events-none">
                    স্টক শেষ (Out of Stock)
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center max-w-sm mx-auto">
            <AlertCircle size={40} className="text-stone-400 mx-auto mb-3" />
            <span className="block font-serif text-lg font-bold text-stone-800">কোনো বই খুঁজে পাওয়া যায়নি</span>
            <span className="block text-xs text-stone-500 font-sans mt-1">অনুগ্রহ করে ভিন্ন কোনো নাম, লেখক বা ক্যাটাগরি ব্যবহার করুন।</span>
            <button 
              onClick={() => { setSelectedCategory("all"); setFormatFilter("all"); }} 
              className="mt-4 px-4 py-1.5 bg-[#1B263B] text-white text-xs font-semibold rounded-lg hover:bg-[#121A2A]"
            >
              সব বই আবার দেখুন
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
