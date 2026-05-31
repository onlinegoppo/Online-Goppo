/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, ShieldCheck, Mail, Phone, BookOpen, Newspaper, Home, Award, Feather } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full bg-[#FCFBF8] border-b border-[#E9E4DB] shadow-sm transition-all duration-200">
      {/* Top Banner Bar with Shop info and email */}
      <div className="w-full bg-[#103B2B] text-[#F3EFE0] py-1.5 px-4 text-xs font-sans select-none border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity text-[11px]">
              <Mail size={12} className="text-[#C5A059]" /> {supportEmail}
            </span>
            <span className="hidden md:flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity text-[11px]">
              <Phone size={12} className="text-[#C5A059]" /> {supportPhone}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[#C5A059]/15 text-[#C5A059] px-2.5 py-0.5 rounded text-[10px] tracking-wide uppercase border border-[#C5A059]/35 font-bold">
              মাসিক ইসলামী গবেষণা পত্রিকা
            </span>
            <span className="text-[#C5A059] font-serif font-bold tracking-wider">
              {storeName}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
        {/* Logo and Scholarly Identity */}
        <div 
          onClick={() => {
            setCurrentTab("home");
            setSearchQuery("");
          }} 
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="bg-[#103B2B] text-white p-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200 shadow-md border border-[#C5A059]/20">
            <BookOpen size={22} className="stroke-[2] text-[#C5A059]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-2xl font-black tracking-tight text-[#103B2B] leading-none group-hover:text-[#C5A059] transition-colors">
              Online Goppo
            </span>
            <span className="text-[10px] font-sans text-stone-500 font-bold tracking-widest uppercase mt-1 flex items-center gap-1">
              <Feather size={10} className="text-[#C5A059]" /> অনলাইন গল্প
            </span>
          </div>
        </div>

        {/* Dynamic Search Bar suited for looking up articles */}
        <div className="hidden md:flex items-center flex-1 max-w-sm relative">
          <input
            type="text"
            placeholder="নিবন্ধ এবং গবেষণাপত্র খুঁজুন..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentTab !== "blog") {
                setCurrentTab("blog");
              }
            }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-stone-100 hover:bg-stone-150 focus:bg-white text-stone-850 border border-stone-200 focus:border-[#103B2B] focus:ring-1 focus:ring-[#103B2B] rounded-full outline-none transition-all placeholder:text-stone-400 font-sans"
          />
          <Search size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
        </div>

        {/* Tab Links Actions (No e-commerce cart/checkout icons!) */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setCurrentTab("admin")}
            className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              currentTab === "admin"
                ? "text-white bg-[#103B2B] border-[#103B2B] shadow-inner"
                : "text-[#103B2B] bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border-[#C5A059]/40"
            }`}
          >
            <ShieldCheck size={14} className="text-[#C5A059]" />
            সম্পাদকীয় ও লেখক প্যানেল
          </button>
        </div>
      </div>

      {/* 🟢 DEEP GREEN SCHOLARLY SUB-HEADER NAVIGATION BAR (Alkawsar Inspired) 🟢 */}
      <div className="w-full bg-[#13402F] py-2 shadow-md font-sans border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">

          <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
            {/* Home Link */}
            <button
              onClick={() => {
                setCurrentTab("home");
                setSearchQuery("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold transition-all ${
                currentTab === "home" && searchQuery === ""
                  ? "bg-[#C5A059] text-white shadow-sm font-black cursor-pointer"
                  : "text-[#EDE7DE] hover:text-white hover:bg-white/10 cursor-pointer"
              }`}
            >
              <Home size={12} />
              <span>প্রচ্ছদ (Home)</span>
            </button>

            {/* Editorial Link */}
            <button
              onClick={() => {
                setCurrentTab("blog");
                setSearchQuery("সম্পাদকীয়");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                currentTab === "blog" && searchQuery === "সম্পাদকীয়"
                  ? "bg-[#C5A059] text-white shadow-sm font-black cursor-pointer"
                  : "text-[#EDE7DE] hover:text-white hover:bg-white/10 cursor-pointer"
              }`}
            >
              <span>সম্পাদকীয়</span>
            </button>

            {/* Quran Studies Link */}
            <button
              onClick={() => {
                setCurrentTab("blog");
                setSearchQuery("কুরআন অধ্যয়ন");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                currentTab === "blog" && searchQuery === "কুরআন অধ্যয়ন"
                  ? "bg-[#C5A059] text-white shadow-sm font-black cursor-pointer"
                  : "text-[#EDE7DE] hover:text-white hover:bg-white/10 cursor-pointer"
              }`}
            >
              <span>কুরআন অধ্যয়ন</span>
            </button>

            {/* Hadith Studies Link */}
            <button
              onClick={() => {
                setCurrentTab("blog");
                setSearchQuery("হাদীস অধ্যয়ন");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                currentTab === "blog" && searchQuery === "হাদীস অধ্যয়ন"
                  ? "bg-[#C5A059] text-white shadow-sm font-black cursor-pointer"
                  : "text-[#EDE7DE] hover:text-white hover:bg-white/10 cursor-pointer"
              }`}
            >
              <span>হাদীস অধ্যয়ন</span>
            </button>

            {/* Jurisprudence Link */}
            <button
              onClick={() => {
                setCurrentTab("blog");
                setSearchQuery("ফিকহ ও ফতোয়া");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                currentTab === "blog" && searchQuery === "ফিকহ ও ফতোয়া"
                  ? "bg-[#C5A059] text-white shadow-sm font-black cursor-pointer"
                  : "text-[#EDE7DE] hover:text-white hover:bg-white/10 cursor-pointer"
              }`}
            >
              <span>ফিকহ ও ফতোয়া</span>
            </button>

            {/* Society & Family Link */}
            <button
              onClick={() => {
                setCurrentTab("blog");
                setSearchQuery("পরিবার ও সমাজ");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                currentTab === "blog" && searchQuery === "পরিবার ও সমাজ"
                  ? "bg-[#C5A059] text-white shadow-sm font-black cursor-pointer"
                  : "text-[#EDE7DE] hover:text-white hover:bg-white/10 cursor-pointer"
              }`}
            >
              <span>পরিবার ও সমাজ</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] text-stone-200/95 font-serif">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>নলেজ আর্কাইভ কানেকশন সুরক্ষিত</span>
          </div>

        </div>
      </div>

      {/* Mobile search row */}
      <div className="md:hidden w-full px-4 pb-3 pt-2 flex items-center bg-[#FCFBF8]">
        <div className="w-full relative">
          <input
            type="text"
            placeholder="আর্টিকেল বা লেখক খুঁজুন..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentTab !== "blog") {
                setCurrentTab("blog");
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
