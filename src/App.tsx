/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Book, BlogPost, CartItem, SiteSettings, LandingPage } from "./types";
import { fetchBooks, fetchBlogs, fetchSettings } from "./api";
import Header from "./components/Header";
import Hero from "./components/Hero";
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
              <div className="handle-animation-fade-in space-y-16">
                
                {/* Hero Showcase block */}
                <Hero
                  featuredBooks={books}
                  onSelectBook={setSelectedBook}
                  onExploreShop={() => setCurrentTab("shop")}
                  siteSettings={siteSettings}
                />

                {/* BESTSELLERS SECTION - মুদ্রিত সেরা বিক্রেতা */}
                <section className="max-w-7xl mx-auto px-4 md:px-6">
                  <div className="flex items-end justify-between border-b border-gray-200 pb-3 mb-8">
                    <div>
                      <div className="text-[#C5A059] text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1.5 mb-1">
                        <Sparkles size={12} /> Bestselling Masterpieces
                      </div>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                        সেরা বিক্রেতা (Bestsellers Shelf)
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentTab("shop");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-xs text-[#1B263B] hover:text-[#C5A059] font-semibold flex items-center gap-1 hover:underline"
                    >
                      সব বই দেখুন <MoveRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {bestsellers.map((book) => (
                      <div
                        key={book.id}
                        onClick={() => setSelectedBook(book)}
                        className="group bg-white border border-gray-200 hover:border-[#C5A059]/40 p-3.5 rounded-xl flex flex-col justify-between transition-all duration-350 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <div className="aspect-[3/4] rounded-lg overflow-hidden relative shadow-sm mb-3">
                          <img src={book.coverUrl} alt={book.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-103 duration-300" />
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/15 shadow-[inset_-1px_0_0_rgba(255,255,255,0.1)]"></div>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 block mb-0.5">{book.author}</span>
                          <h3 className="font-serif text-sm font-bold text-gray-900 group-hover:text-[#1B263B] transition-colors line-clamp-1">{book.title}</h3>
                          <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
                            <span className="font-serif text-xs font-semibold text-[#1B263B]">৳{book.price}</span>
                            <span className="bg-[#1B263B]/10 text-[#1B263B] text-[8px] font-bold py-0.5 px-1.5 rounded uppercase font-sans">
                              {book.type === "ebook" ? "PDF" : "Paperback"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* PROMOTION / HIGHLIGHT AD GRAPHIC CAROUSEL BLOCK */}
                <section className="bg-gradient-to-r from-[#1B263B] to-[#121A2A] text-[#FBFBFB] py-12">
                  <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
                    <div className="md:col-span-8 space-y-4">
                      <div className="bg-[#C5A059]/20 text-[#C5A059] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase inline-block font-mono border border-[#C5A059]/25">
                        Digital Reader Promotion • ডেসটপ বা মোবাইলে
                      </div>
                      <h3 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
                        যেকোনো মুহূর্তেই ই-বুক কিনুন, <br />
                        তাত্ক্ষণিক ডাউনলোড লিংক বুঝে নিন!
                      </h3>
                      <p className="text-[#F1F3F5] text-xs md:text-sm font-sans max-w-xl leading-relaxed">
                        কোনো কুরিয়ারের অপেক্ষা ছাড়াই, পছন্দসই ই-বুকটি ক্রয় করামাত্রই আপনার ইউজার ড্যাশবোর্ডে এবং নিবন্ধিত ইমেইলে সোর্স কোডসহ সুরক্ষিত পিডিএফ ফাইল চলে যাবে। সাথে পাচ্ছেন লাইফটাইম অ্যাক্সেস।
                      </p>
                    </div>

                    <div className="md:col-span-4 flex justify-start md:justify-end">
                      <button
                        onClick={() => {
                          setCurrentTab("shop");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#b58f48] text-white font-bold rounded-lg text-xs shadow-lg transition-all flex items-center gap-2 group cursor-pointer uppercase"
                      >
                        পিডিএফ বইসমূহ দেখুন <MoveRight size={14} className="group-hover:translate-x-1 duration-200" />
                      </button>
                    </div>
                  </div>
                </section>

                {/* DYNAMIC NEW ARRIVALS - নতুন ও অপ্রকাশিত বইসমূহ */}
                <section className="max-w-7xl mx-auto px-4 md:px-6">
                  <div className="flex items-end justify-between border-b border-gray-200 pb-3 mb-8">
                    <div>
                      <div className="text-[#C5A059] text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1.5 mb-1">
                        <Clock size={12} /> New Releases Shelf
                      </div>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                        নতুন আয়োজন (New Arrivals)
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentTab("shop");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-xs text-[#1B263B] hover:text-[#C5A059] font-semibold flex items-center gap-1 hover:underline"
                    >
                      সব নতুন বই দেখুন <MoveRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {newArrivals.map((book) => (
                      <div
                        key={book.id}
                        onClick={() => setSelectedBook(book)}
                        className="group bg-white border border-gray-200 hover:border-[#C5A059]/40 p-3.5 rounded-xl flex flex-col justify-between transition-all duration-350 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <div className="aspect-[3/4] rounded-lg overflow-hidden relative shadow-sm mb-3">
                          <img src={book.coverUrl} alt={book.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-103 duration-300" />
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/15 shadow-[inset_-1px_0_0_rgba(255,255,255,0.1)]"></div>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 block mb-0.5">{book.author}</span>
                          <h3 className="font-serif text-sm font-bold text-gray-900 group-hover:text-[#1B263B] transition-colors line-clamp-1">{book.title}</h3>
                          <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
                            <span className="font-serif text-xs font-semibold text-[#1B263B]">৳{book.price}</span>
                            <span className="bg-[#1B263B]/10 text-[#1B263B] text-[8px] font-bold py-0.5 px-1.5 rounded uppercase font-sans">
                              {book.type === "ebook" ? "PDF" : "Paperback"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* BLOG HIGHLIGHT PREVIEW BAR AS REQUESTED */}
                {blogs.length > 0 && (
                  <section className="bg-gray-50 border-y border-gray-205 py-12 font-sans">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
                      <div className="text-center space-y-1.5">
                        <span className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest">Latest from Literary Columns</span>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-950">সবশেষ সাহিত্য পর্যালোচনা (From Blog)</h2>
                        <p className="text-gray-500 text-xs">আমাদের বুক রিভিউ কলাম থেকে বাছাইকৃত কয়েকটি আকর্ষণীয় প্রবন্ধ</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                        {blogs.slice(0, 2).map((post) => (
                          <div 
                            key={post.id}
                            onClick={() => {
                              setCurrentTab("blog");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col md:flex-row gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                          >
                            <div className="w-full md:w-1/3 aspect-[4/3] rounded-lg overflow-hidden border border-gray-150 bg-gray-50 flex-shrink-0">
                              <img src={post.coverUrl} alt={post.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-104 duration-300" />
                            </div>
                            <div className="flex-grow flex flex-col justify-between py-1">
                              <div>
                                <span className="text-[9px] text-[#C5A059] font-bold uppercase font-sans">{post.tags[0]}</span>
                                <h4 className="font-serif text-sm font-bold text-gray-900 group-hover:text-[#1B263B] transition-colors line-clamp-2 leading-snug mt-1">
                                  {post.title}
                                </h4>
                                <p className="text-gray-500 text-[11px] line-clamp-2 leading-relaxed mt-2">{post.excerpt}</p>
                              </div>
                              <span className="text-[10px] text-[#C5A059] font-bold flex items-center gap-1 group-hover:translate-x-1 duration-200 mt-3 pt-3 border-t border-gray-200">
                                পুরো নিবন্ধ পড়ুন <ChevronRight size={10} />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

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
