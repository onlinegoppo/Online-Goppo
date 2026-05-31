/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, ShoppingCart, User, ShieldCheck, Mail, Phone, BookOpen, Smartphone, Newspaper, Cpu, Home } from "lucide-react";
import { SiteSettings } from "../types";

interface HeaderProps {
  currentTab: "home" | "shop" | "blog" | "admin" | "library" | "ebook-landing";
  setCurrentTab: (tab: "home" | "shop" | "blog" | "admin" | "library" | "ebook-landing") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  setShowCart: (show: boolean) => void;
  userEmail: string | null;
  onLogout: () => void;
  siteSettings?: SiteSettings | null;
}

export default function Header({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  cartCount,
  setShowCart,
  userEmail,
  onLogout,
  siteSettings
}: HeaderProps) {
  const storeName = siteSettings?.storeName || "onlinegoppo.site";
  const supportEmail = siteSettings?.supportEmail || "onlinegoppo@gmail.com";
  const supportPhone = siteSettings?.supportPhone || "+৮৮০ ১৭xxxxxxxx";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-200">
      {/* Top Banner Bar with Shop domain and contact info */}
      <div className="w-full bg-[#1B263B] text-[#EDE7DE] py-1.5 px-4 text-xs font-mono select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 opacity-85 hover:opacity-100 transition-opacity">
              <Mail size={12} /> {supportEmail}
            </span>
            <span className="hidden md:flex items-center gap-1 opacity-85 hover:opacity-100 transition-opacity">
              <Phone size={12} /> {supportPhone}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded text-[10px] tracking-wide uppercase border border-[#C5A059]/20">
              Professional Active Connection
            </span>
            <span className="text-[#C5A059] font-semibold tracking-wider font-mono">
              {storeName}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div 
          onClick={() => setCurrentTab("home")} 
          className="flex items-center gap-2 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="bg-[#1B263B] text-white p-2 rounded-lg group-hover:scale-105 transition-transform duration-200 shadow-md">
            <BookOpen size={20} className="stroke-[2.5] text-[#C5A059]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-[#1B263B] leading-none group-hover:text-[#C5A059] transition-colors">
              {storeName.split(".")[0]}<span className="text-[#C5A059]">.{storeName.split(".")[1] || "site"}</span>
            </span>
            <span className="text-[10px] font-sans text-stone-500 font-medium tracking-widest uppercase">
              অনলাইনগল্প.সাইট
            </span>
          </div>
        </div>

        {/* Search Bar Block */}
        <div className="hidden md:flex items-center flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="বইয়ের নাম, লেখক অথবা ক্যাটাগরি দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentTab !== "shop" && currentTab !== "home") {
                setCurrentTab("shop");
              }
            }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-stone-100 hover:bg-stone-150 focus:bg-white text-stone-850 border border-stone-200 focus:border-[#1B263B] focus:ring-1 focus:ring-[#1B263B] rounded-full outline-none transition-all placeholder:text-stone-400 font-sans"
          />
          <Search size={16} className="absolute left-3 text-stone-400 pointer-events-none" />
        </div>

        {/* Tab Links Menu & Actions */}
        <div className="flex items-center gap-1.5 md:gap-3">
          <nav className="flex items-center gap-1 mr-1 md:mr-3">
            <button
              onClick={() => setCurrentTab("admin")}
              className={`px-2.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                currentTab === "admin"
                  ? "text-[#1B263B] bg-[#1B263B]/10 font-bold border border-[#1B263B]/20"
                  : "text-[#C5A059] bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/40"
              }`}
            >
              <ShieldCheck size={14} className="text-[#C5A059]" />
              অ্যাডমিন প্যানেল
            </button>
          </nav>

          {/* User Library Dashboard Action */}
          <button
            onClick={() => setCurrentTab("library")}
            title="ইউজার লাইব্রেরি (সংরক্ষিত ই-বুকসমূহ)"
            className={`p-2 rounded-full border transition-all relative ${
              currentTab === "library"
                ? "bg-[#C5A059]/20 text-[#1B263B] border-[#C5A059]/30"
                : "bg-white text-stone-600 hover:text-[#1B263B] border-stone-200 hover:bg-stone-50"
            }`}
          >
            <User size={18} />
            {userEmail && (
              <span className="absolute -top-1.5 -right-1.5 bg-green-600 text-white text-[8px] font-mono w-4 h-4 rounded-full flex items-center justify-center animate-pulse border border-white">
                ✓
              </span>
            )}
          </button>

          {/* Cart Icon Toggle Button */}
          <button
            onClick={() => setShowCart(true)}
            id="shopping-cart-button"
            className="p-2 rounded-full bg-white text-stone-600 hover:text-[#1B263B] border border-stone-200 hover:bg-stone-50 transition-all relative"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#C5A059] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Secure Admin Control Panel Access */}
          <button
            onClick={() => setCurrentTab("admin")}
            title="অ্যাডমিন প্যানেল"
            className={`p-2 rounded-full border transition-all ${
              currentTab === "admin"
                ? "bg-[#1B263B] text-[#C5A059] border-[#1B263B]"
                : "bg-white text-stone-600 hover:text-[#1B263B] border-stone-200 hover:bg-stone-50"
            }`}
          >
            <ShieldCheck size={18} />
          </button>
        </div>
      </div>

      {/* 🔴 RED BOX NAVIGATION SUB-HEADER BAR 🔴 */}
      <div className="w-full bg-[#E63946] py-2.5 shadow-md font-sans z-30 select-none border-b border-red-700">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-white uppercase font-mono tracking-wider shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
            <span>প্রধান মেনু (Main Categories):</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-3">
            {/* Home/প্রচ্ছদ Link */}
            <button
              onClick={() => {
                setCurrentTab("home");
                setSearchQuery("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                currentTab === "home" && searchQuery === ""
                  ? "bg-white text-[#E63946] border-white shadow-sm scale-102 cursor-pointer"
                  : "bg-[#E63946] hover:bg-white/10 text-white border-transparent hover:border-white/10 cursor-pointer"
              }`}
            >
              <Home size={13} className={currentTab === "home" && searchQuery === "" ? "text-[#E63946]" : "text-white"} />
              <span>প্রচ্ছদ (Home)</span>
            </button>

            {/* E-book Link */}
            <button
              onClick={() => {
                setCurrentTab("ebook-landing");
                setSearchQuery("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                currentTab === "ebook-landing"
                  ? "bg-white text-[#E63946] border-white shadow-sm scale-102 cursor-pointer"
                  : "bg-[#E63946] hover:bg-white/10 text-white border-transparent hover:border-white/10 cursor-pointer"
              }`}
            >
              <Smartphone size={13} className={currentTab === "ebook-landing" ? "text-[#E63946]" : "text-white"} />
              <span>E-book (ই-বুক)</span>
            </button>

            {/* Blog Link */}
            <button
              onClick={() => {
                setCurrentTab("blog");
                setSearchQuery("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                currentTab === "blog" && searchQuery === ""
                  ? "bg-white text-[#E63946] border-white shadow-sm scale-102 cursor-pointer"
                  : "bg-[#E63946] hover:bg-white/10 text-white border-transparent hover:border-white/10 cursor-pointer"
              }`}
            >
              <BookOpen size={13} className={currentTab === "blog" && searchQuery === "" ? "text-[#E63946]" : "text-white"} />
              <span>Blog (ব্লগ)</span>
            </button>

            {/* News Link */}
            <button
              onClick={() => {
                setCurrentTab("blog");
                setSearchQuery("news");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                currentTab === "blog" && searchQuery === "news"
                  ? "bg-white text-[#E63946] border-white shadow-sm scale-102 cursor-pointer"
                  : "bg-[#E63946] hover:bg-white/10 text-white border-transparent hover:border-white/10 cursor-pointer"
              }`}
            >
              <Newspaper size={13} className={currentTab === "blog" && searchQuery === "news" ? "text-[#E63946]" : "text-white"} />
              <span>News (সংবাদ)</span>
            </button>

            {/* Technology Link */}
            <button
              onClick={() => {
                setCurrentTab("shop");
                setSearchQuery("technology");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                currentTab === "shop" && searchQuery === "technology"
                  ? "bg-white text-[#E63946] border-white shadow-sm scale-102 cursor-pointer"
                  : "bg-[#E63946] hover:bg-white/10 text-white border-transparent hover:border-white/10 cursor-pointer"
              }`}
            >
              <Cpu size={13} className={currentTab === "shop" && searchQuery === "technology" ? "text-[#E63946]" : "text-white"} />
              <span>Technology (প্রযুক্তি)</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[9px] text-white/80 font-mono font-bold tracking-widest">
            <span>SECURE INSTANT DISTRIBUTION</span>
          </div>

        </div>
      </div>

      {/* Mobile Search row */}
      <div className="md:hidden w-full px-4 pb-3 flex items-center">
        <div className="w-full relative">
          <input
            type="text"
            placeholder="বইয়ের নাম বা লেখক খুঁজুন..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentTab !== "shop" && currentTab !== "home") {
                setCurrentTab("shop");
              }
            }}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-stone-100 text-stone-800 border border-stone-200 rounded-full outline-none focus:bg-white placeholder:text-stone-400 font-sans"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-stone-400 pointer-events-none" />
        </div>
      </div>
    </header>
  );
}
