/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { fetchUserLibrary, UserLibraryResponse } from "../api";
import { Book, Order } from "../types";
import { Search, Loader2, Key, Smartphone, FileDown, LogIn, LogOut, CheckCircle, TicketCheck, AlignLeft, ShieldCheck, Mail } from "lucide-react";

interface UserDashboardProps {
  onLoginSuccess: (email: string) => void;
  userEmail: string | null;
  onLogout: () => void;
}

export default function UserDashboard({ onLoginSuccess, userEmail, onLogout }: UserDashboardProps) {
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Library response state
  const [libraryData, setLibraryData] = useState<UserLibraryResponse | null>(null);

  // Load library data if already logged in
  useEffect(() => {
    if (userEmail) {
      loadLibrary(userEmail);
    } else {
      setLibraryData(null);
    }
  }, [userEmail]);

  const loadLibrary = async (email: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchUserLibrary(email);
      setLibraryData(data);
    } catch (err: any) {
      setErrorMessage("আপনার লাইব্রেরি ডেটা লোড করতে ব্যর্থ হয়েছে। দয়া করে সঠিক রেজিস্টার্ড ইমেইল চেক করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes("@")) {
      setErrorMessage("দয়া করে একটি সঠিক বৈধ ইমেইল এড্রেস লিখুন।");
      return;
    }
    const cleanEmail = emailInput.trim().toLowerCase();
    onLoginSuccess(cleanEmail);
    loadLibrary(cleanEmail);
  };

  return (
    <div className="py-12 bg-[#FBFBFB] min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        
        {/* Not Logged In View */}
        {!userEmail ? (
          <div className="max-w-md mx-auto bg-white border border-gray-200 p-8 rounded-2xl shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="bg-[#1B263B] inline-flex p-3.5 text-[#C5A059] rounded-xl shadow-md">
                <ShieldCheck size={32} />
              </div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-2 font-serif">ডিজিটাল বুক ড্যাশবোর্ড</h2>
              <p className="text-stone-500 text-xs font-sans leading-relaxed">
                আপনার ক্রয়কৃত এবং সংরক্ষিত ই-বুকসমূহ তাত্ক্ষণিকভাবে ভিউ ও ডাউনলোড করতে আপনার রেজিস্টার্ড ইমেইল ব্যবহার করে সিকিউর গেটওয়েতে প্রবেশ করুন।
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-800 text-xs p-2.5 rounded-lg border border-red-200 font-sans leading-relaxed">
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">রেজিস্টার্ড ইমেইল এড্রেস (Registered Email)</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="উদাঃ noman@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-855 font-medium"
                  />
                  <Mail size={14} className="absolute left-3 top-3 text-stone-400" />
                </div>
                <span className="text-[10px] text-stone-400 block mt-1">
                  * ট্রায়াল ডেমোর জন্য পূর্বে ইমেইল <strong>noman@gmail.com</strong> ব্যবহার করে টেস্ট করতে পারেন।
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1B263B] hover:bg-[#121A2A] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md uppercase cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : <LogIn size={14} />}
                পাসবুক ভেরিফাই করুন (Access Digital Locker)
              </button>
            </form>
          </div>
        ) : (
          /* Logged In View */
          <div className="space-y-8">
            
            {/* Dashboard Header Bar */}
            <div className="bg-[#1B263B] text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl border border-[#1B263B]">
              <div className="space-y-1.5 col-span-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold">গ্রাহক লাইব্রেরি ক্যাবিনেট</span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold flex items-center gap-2">
                  ধন্যবাদ, {libraryData?.orders[0]?.customerName || "গ্রাহক সুধী!"}
                </h2>
                <p className="text-xs text-stone-200 flex items-center gap-1.5 font-sans">
                  <span>নিবন্ধিত অ্যাকাউন্টঃ </span>
                  <strong className="text-stone-100">{userEmail}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => loadLibrary(userEmail)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white border border-white/25 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  সিংক্রোনাইজ করুন
                </button>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/20 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={12} /> লগআউট
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <Loader2 className="animate-spin text-[#C5A059] mx-auto" size={44} />
                <span className="text-xs text-stone-500 block mt-2">আপনার ডিজিটাল ক্যাবিনেট সিঙ্ক হচ্ছে...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* PDF Digital library drawer - Left Side Column */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-gray-200 pb-2">
                    সংরক্ষিত ই-বুকসমূহ (Secured E-books Shelf)
                  </h3>

                  {libraryData && libraryData.library.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-2">
                      {libraryData.library.map((book) => (
                        <div
                          key={book.id}
                          className="bg-white p-4 rounded-xl border border-gray-200 flex gap-3 shadow-sm hover:shadow-md transition-all relative"
                        >
                          <div className="w-16 h-22 bg-gray-50 rounded overflow-hidden border border-gray-200 flex-shrink-0 shadow-sm relative font-sans">
                            <img src={book.coverUrl} alt={book.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/10"></div>
                          </div>

                          <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                              <h4 className="font-serif text-sm font-bold text-stone-900 line-clamp-1 leading-snug">
                                {book.title}
                              </h4>
                              <p className="text-[10px] text-stone-400 font-sans mt-0.5">{book.author}</p>
                            </div>

                            <a
                              href={book.fileUrl || "/downloads/book_pdf_sample.pdf"}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-[#FBF9F6] rounded text-[10px] font-bold tracking-tight inline-flex items-center justify-center gap-1.5 transition-all shadow-sm hover:no-underline cursor-pointer"
                            >
                              <FileDown size={12} /> ডাউনলোড PDF
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-8 text-center rounded-2xl border border-gray-100">
                      <Smartphone size={32} className="text-stone-400 mx-auto mb-3" />
                      <span className="block font-serif text-sm font-bold text-stone-800">কোনো ই-বুক পাওয়া যায়নি</span>
                      <span className="block text-stone-500 text-[10.5px] font-sans mt-1 max-w-sm mx-auto leading-relaxed">
                        আপনার ক্যাবিনেটে এখনো কোনো ডিজিটাল ই-বুক বা পিডিএফ ক্রয় ডেটা যোগ হয়নি। শপ ভিজিট করে পছন্দসই পিডিএফ ই-বুক ক্রয় সম্পন্ন করলেই তা এখানে দেখা যাবে।
                      </span>
                    </div>
                  )}
                </div>

                {/* Billing histories & active orders list - Right Side Column */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-gray-200 pb-2">
                    অর্ডার ও ট্রানজেকশন হিস্টোরি (Purchase Invoices)
                  </h3>

                  {libraryData && libraryData.orders.length > 0 ? (
                    <div className="space-y-4">
                      {libraryData.orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-gray-50/50 p-4 rounded-xl border border-gray-250 text-xs font-sans space-y-3"
                        >
                          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                            <div>
                              <span className="text-stone-400 block text-[9px] uppercase font-mono">অর্ডার আইডি</span>
                              <span className="font-bold text-stone-900 font-serif">{order.id}</span>
                            </div>
                            <span className="bg-green-150 text-green-800 font-semibold py-0.5 px-2 rounded-full border border-green-200 font-sans text-[10px] uppercase">
                              ✓ Paid
                            </span>
                          </div>

                          <div className="space-y-1 col-span-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-stone-600">
                                <span className="truncate max-w-[70%]">{item.title} x {item.quantity}</span>
                                <span className="font-serif font-medium flex-shrink-0">৳{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-gray-200 pt-2 flex flex-col space-y-1 text-[10px] text-stone-400">
                            <p className="flex justify-between text-stone-800 font-bold text-xs font-sans">
                              <span>মোট পরিশোধিতঃ </span>
                              <span className="font-serif">৳{order.totalAmount}</span>
                            </p>
                            <p className="flex justify-between font-mono">
                              <span>মার্জিন মাধ্যমঃ </span>
                              <span className="uppercase">{order.paymentMethod} ({order.paymentTxnId})</span>
                            </p>
                            <p className="flex justify-between font-sans">
                              <span>তারিখঃ </span>
                              <span>{new Date(order.createdAt).toLocaleString("bn-BD")}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-stone-400 text-xs">
                      পূর্বে কেনাকাটার কোনো তথ্য খুজে পাওয়া যায়নি।
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
