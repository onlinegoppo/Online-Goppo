/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Book, BlogPost, CartItem, SiteSettings, LandingPage } from "./types";
import { fetchBooks, fetchBlogs, fetchSettings } from "./api";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HomePortal from "./components/HomePortal";
import BookGrid from "./components/BookGrid";
import BookDetail from "./components/BookDetail";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import UserDashboard from "./components/UserDashboard";
import BlogSection from "./components/BlogSection";
import AdminPanel from "./components/AdminPanel";
import PromoLandingPage from "./components/PromoLandingPage";
import EbookLanding from "./components/EbookLanding";
import { ArrowRight, Sparkles, Smartphone, Landmark, Info, BookOpen, Clock, Heart, MoveRight, ChevronRight } from "lucide-react";

export default function App() {
  // Navigation & Browsing States
  const [currentTab, setCurrentTab] = useState<"home" | "shop" | "blog" | "admin" | "library" | "ebook-landing">("home");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Real Database Core States
  const [books, setBooks] = useState<Book[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Site Custom Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [activePromo, setActivePromo] = useState<LandingPage | null>(null);

  // Cart Management States
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const local = localStorage.getItem("onlinegoppo_cart");
    return local ? JSON.parse(local) : [];
  });
  const [showCart, setShowCart] = useState(false);

  // Modal / Gateway States
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Secure User Auth Session States
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem("onlinegoppo_user_email");
  });

  // Initial Database Sync Mounting
  useEffect(() => {
    loadData();
  }, []);

  // Save Cart states dynamically to local storage persistent
  useEffect(() => {
    localStorage.setItem("onlinegoppo_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allBooks, allBlogs, fetchedSettings] = await Promise.all([
        fetchBooks(),
        fetchBlogs(),
        fetchSettings()
      ]);
      setBooks(allBooks);
      setBlogs(allBlogs);
      setSiteSettings(fetchedSettings);
    } catch (err) {
      console.error("Critical: failed loading database stores:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cart operations
  const handleAddToCart = (book: Book) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        // limit physical stock
        if (book.type === "physical" && existing.quantity >= book.stock) {
          return prev;
        }
        return prev.map((item) =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(bookId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (bookId: string) => {
    setCartItems((prev) => prev.filter((item) => item.book.id !== bookId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Login session lifecycle
  const handleUserLogin = (email: string) => {
    setUserEmail(email);
    localStorage.setItem("onlinegoppo_user_email", email);
  };

  const handleUserLogout = () => {
    setUserEmail(null);
    localStorage.removeItem("onlinegoppo_user_email");
  };

  const handleSuccessPayment = (email: string, purchased: any[]) => {
    handleUserLogin(email);
    purchased.forEach((item) => {
      if (item && item.book && item.book.id) {
        localStorage.setItem("purchased_" + item.book.id, "true");
      } else if (item && item.id) {
        localStorage.setItem("purchased_" + item.id, "true");
      }
    });
    setCurrentTab("library"); // switch to user downloads locker instantly
  };

  const handleDirectCheckout = (book: Book) => {
    // Quick checkout configures cart with only this book
    setCartItems([{ book, quantity: 1 }]);
    setShowCheckout(true);
  };

  // Calculate cart counts
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Grouped datasets for dynamic presentation
  const bestsellers = books.filter((b) => b.category === "bestsellers").slice(0, 4);
  const ebooksOnly = books.filter((b) => b.type === "ebook").slice(0, 4);
  const newArrivals = books.filter((b) => b.category === "new-arrivals").slice(0, 4);

  if (activePromo) {
    return (
      <PromoLandingPage
        promo={activePromo}
        books={books}
        onDirectPurchase={(book) => {
          handleDirectCheckout(book);
        }}
        onGoBack={() => {
          setActivePromo(null);
          setCurrentTab("admin");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FBFBFB] selection:bg-[#C5A059]/20 selection:text-[#1B263B]">
      
      {/* Header Panel Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={totalCartCount}
        setShowCart={setShowCart}
        userEmail={userEmail}
        onLogout={handleUserLogout}
        siteSettings={siteSettings}
      />

      {/* Main Container View Controller */}
      <main className="flex-grow">
        
        {loading ? (
          <div className="py-32 text-center flex flex-col justify-center items-center gap-3">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-gray-250"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[#1B263B] animate-spin"></div>
            </div>
            <span className="text-gray-500 font-sans tracking-wide text-xs">বুক হেভেনের সেলফ সিঙ্ক হচ্ছে...</span>
          </div>
        ) : (
          <>
            {/* TAB 1: HOME PAGE ROUTER */}
            {currentTab === "home" && (
              <div className="handle-animation-fade-in">
                <HomePortal
                  books={books}
                  blogs={blogs}
                  siteSettings={siteSettings}
                  onSelectBook={setSelectedBook}
                  onSelectBlog={(blog) => {
                    setSelectedBlogPost(blog);
                    setCurrentTab("blog");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  setCurrentTab={(tab) => {
                    setCurrentTab(tab);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  setSearchQuery={setSearchQuery}
                  onDirectCheckout={handleDirectCheckout}
                />
              </div>
            )}

            {/* TAB 2: SHOP BOOKSTORE ROUTER */}
            {currentTab === "ebook-landing" && (
              <EbookLanding
                books={books}
                onDirectCheckout={handleDirectCheckout}
                userEmail={userEmail}
                onNavigateHome={() => {
                  setCurrentTab("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {currentTab === "shop" && (
              <BookGrid
                books={books}
                onSelectBook={setSelectedBook}
                onAddToCart={handleAddToCart}
                searchQuery={searchQuery}
              />
            )}

            {/* TAB 3: THE LITERARY BLOG SECTION ROUTER */}
            {currentTab === "blog" && (
              <BlogSection
                blogs={blogs}
                initialSelectedPost={selectedBlogPost}
                onClearSelectedPost={() => setSelectedBlogPost(null)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {/* TAB 4: SECURED USER ACCESS LIBRARY LOCKER ROUTER */}
            {currentTab === "library" && (
              <UserDashboard
                userEmail={userEmail}
                onLoginSuccess={handleUserLogin}
                onLogout={handleUserLogout}
              />
            )}

            {/* TAB 5: ADMIN MANAGEMENT CONSOLE ROUTER */}
            {currentTab === "admin" && (
              <AdminPanel
                books={books}
                blogs={blogs}
                onRefreshData={loadData}
                onViewPromoPage={(promo) => {
                  setActivePromo(promo);
                }}
                onNavigateHome={() => {
                  setCurrentTab("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </>
        )}
      </main>

      {/* FOOTER BAR WITH DOMAIN IDENTIFIER */}
      <footer className="bg-slate-900 text-slate-400 font-sans text-xs border-t border-slate-800 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-left">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#1B263B] text-white p-1.5 rounded-lg border border-slate-700">
                <BookOpen size={16} className="text-[#C5A059]" />
              </div>
              <span className="font-serif text-lg font-bold text-white tracking-tight">onlinegoppo<span className="text-[#C5A059]">.site</span></span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-xs">
              অনলাইনগল্প.সাইট (onlinegoppo.site) হলো বাঙালি সাহিত্যপ্রেমীদের একটি বিশ্বস্ত গন্তব্য। এখানে আপনি যেকোনো সময় সেরা গল্প, উপন্যাস এবং শিক্ষামূলক ই-বুক খুঁজে পাবেন সস্তায়।
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif text-white font-bold text-sm tracking-wide">দ্রুত লিংকসমূহ</h4>
            <ul className="space-y-1.5 text-stone-500 text-[11px]">
              <li><button onClick={() => setCurrentTab("home")} className="hover:text-white transition-colors bg-transparent border-none p-0 inline">প্রচ্ছদ (Home)</button></li>
              <li><button onClick={() => setCurrentTab("shop")} className="hover:text-white transition-colors bg-transparent border-none p-0 inline">বইয়ের দোকান (Shop)</button></li>
              <li><button onClick={() => setCurrentTab("blog")} className="hover:text-white transition-colors bg-transparent border-none p-0 inline">সাহিত্য ব্লগ (Blog)</button></li>
              <li><button onClick={() => setCurrentTab("library")} className="hover:text-white transition-colors bg-transparent border-none p-0 inline">ডিজিটাল বুক সেল্ফ (Locker)</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif text-white font-bold text-sm tracking-wide">নিরাপদ পেমেন্ট</h4>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              বিকাশ, নগদ, রকেটের মতো জনপ্রিয় মোবাইল ওয়ালেট এবং যেকোনো ভিসা ও মাস্টারকার্ডের মাধ্যমে সম্পূর্ণ নিরাপদে পে করুন নিশ্চিন্তে।
            </p>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-[9px] text-[#1C1917] select-none">
              <span className="bg-pink-600/20 text-pink-300 border border-pink-700/30 px-1.5 py-0.5 rounded">BKash</span>
              <span className="bg-orange-600/20 text-orange-300 border border-orange-700/30 px-1.5 py-0.5 rounded">Nagad</span>
              <span className="bg-white/10 text-white/70 border border-white/10 px-1.5 py-0.5 rounded">Visa/Master</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif text-white font-bold text-sm tracking-wide">যোগাযোগ ও সাপোর্ট</h4>
            <p className="text-slate-400 text-[11px]">
              ডিজিটাল ডেলিভারি বা বুকিং নিয়ে যেকোনো সমস্যায় সরাসরি মেইল করুন: <br />
              <strong className="text-slate-300 hover:underline">onlinegoppo@gmail.com</strong>
            </p>
            <div className="pt-2">
              <a 
                href="https://onlinegoppo.site" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#C5A059] font-bold hover:underline"
              >
                www.onlinegoppo.site
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 border-t border-stone-850 flex flex-col md:flex-row justify-between items-center gap-4 text-stone-550 text-[11px]">
          <span>© {new Date().getFullYear()} onlinegoppo.site. All Rights Reserved.</span>
          <span>Designed with high-quality Book Haven aesthetics for OnlineGoppo Bookstore.</span>
        </div>
      </footer>

      {/* DYNAMIC CART SLIDE-OVER OVERLAY DRAWER */}
      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckout={() => {
          setShowCart(false);
          setShowCheckout(true);
        }}
      />

      {/* PRODUCT DETAILED LIGHTBOX MODAL */}
      {selectedBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddToCart={handleAddToCart}
          onDirectCheckout={handleDirectCheckout}
        />
      )}

      {/* CHECKOUT WIZARD MODAL W/ SECURE MOCK GATEWAYS */}
      {showCheckout && (
        <Checkout
          cartItems={cartItems}
          onClose={() => setShowCheckout(false)}
          onSuccessPay={handleSuccessPayment}
          onClearCart={handleClearCart}
        />
      )}

    </div>
  );
}
