/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, Smartphone, BookOpen, CreditCard } from "lucide-react";
import { CartItem } from "../types";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemoveItem: (bookId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout
}: CartProps) {
  const isCartEmpty = cartItems.length === 0;

  // Calculatings
  const subtotal = cartItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden">
        
        {/* Backdrop transparent trigger */}
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white border-l border-stone-200 flex flex-col shadow-2xl relative handle-animation-slide-over">
            
            {/* Cart Panel Header */}
            <div className="px-4 py-5 bg-[#1B263B] text-white flex items-center justify-between border-b border-[#1B263B]">
              <h2 className="text-md font-serif font-semibold tracking-wide flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#C5A059]" />
                আপনার শপিং কার্ট ({cartItems.length} টি আইটেম)
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-stone-400 hover:text-white rounded-full transition-colors focus:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart List Canvas */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!isCartEmpty ? (
                <>
                  <div className="flex justify-between items-center bg-stone-100 p-2 rounded-lg border border-stone-200">
                    <span className="text-[11px] text-stone-500 font-sans">কার্ট রিফ্রেশ করতে পারেন</span>
                    <button
                      onClick={onClearCart}
                      className="text-[10px] text-red-700 hover:underline font-bold flex items-center gap-1 uppercase"
                    >
                      <Trash2 size={11} /> সম্পূর্ণ কার্ট মুছুন
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.book.id}
                        className="flex gap-3 bg-white p-3 rounded-xl border border-gray-200 hover:border-[#C5A059]/30 transition-all shadow-sm"
                      >
                        {/* Book Cover miniature mini */}
                        <div className="w-14 h-20 bg-stone-50 rounded-lg overflow-hidden border border-stone-200 flex-shrink-0 relative">
                          <img
                            src={item.book.coverUrl}
                            alt={item.book.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Title descriptions details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-serif text-sm font-bold text-stone-900 line-clamp-1 leading-snug">
                                {item.book.title}
                              </h4>
                              <button
                                onClick={() => onRemoveItem(item.book.id)}
                                className="text-stone-400 hover:text-red-700 p-0.5 rounded transition-colors"
                                title="আইটেম মুছুন"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <p className="text-[10px] text-stone-500 font-sans mt-0.5">{item.book.author}</p>
                          </div>

                          {/* Control row */}
                          <div className="flex items-end justify-between gap-2 mt-2">
                            {/* Quantity buttons */}
                            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-lg p-0.5">
                              <button
                                onClick={() => onUpdateQuantity(item.book.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-1 text-stone-500 hover:text-stone-800 disabled:opacity-40 transition-colors"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="text-xs font-bold font-mono px-1.5">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(item.book.id, item.quantity + 1)}
                                disabled={item.book.type === "physical" && item.quantity >= item.book.stock}
                                className="p-1 text-stone-500 hover:text-stone-800 disabled:opacity-40 transition-colors"
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            {/* Book Format sticker & Price calculations */}
                            <div className="text-right">
                              <span className="text-[9px] uppercase font-mono block text-stone-400">
                                {item.book.type === "ebook" ? "ই-বুক PDF" : "মুদ্রিত কপি"}
                              </span>
                              <span className="font-serif text-xs font-bold text-[#1B263B]">
                                ৳{item.book.price} × {item.quantity} = ৳{item.book.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="bg-stone-100 p-4 rounded-full text-stone-400 mb-4 border border-stone-200">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-800">আপনার কার্টটি একদম খালি!</h3>
                  <p className="text-xs text-stone-500 max-w-xs mt-1.5 font-sans leading-relaxed">
                    বইয়ের দোকান ক্যাটাগরি ঘুরে পছন্দের বই যোগ করুন। আমাদের কাছে পাবেন শত শত আকর্ষণীয় মুদ্রিত ও পিডিএফ ই-বই।
                  </p>
                  <button 
                    onClick={onClose} 
                    className="mt-6 px-5 py-2.5 bg-[#1B263B] hover:bg-[#121A2A] text-white text-xs font-semibold rounded-lg transition-all shadow-md"
                  >
                    বই পছন্দ করতে যান
                  </button>
                </div>
              )}
            </div>

            {/* Cart Panel footer calculate calculations and CTA button */}
            {!isCartEmpty && (
              <div className="px-4 py-5 bg-stone-100 border-t border-stone-250 space-y-4">
                <div className="space-y-1 text-sm font-sans">
                  <div className="flex justify-between text-stone-600">
                    <span>উপ-মোট (Subtotal)</span>
                    <span className="font-serif">৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 text-xs">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="text-green-700 font-semibold uppercase">ফ্রি (Promo Locker)</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-base">
                    <span>সর্বমোট (Total Amount)</span>
                    <span className="font-serif text-[#1B263B]">৳{subtotal}</span>
                  </div>
                </div>

                <div className="bg-amber-100/60 p-2.5 rounded-lg border border-amber-200 text-amber-950 text-[10px] font-sans flex items-start gap-1.5 leading-normal">
                  <Smartphone className="text-amber-800 flex-shrink-0" size={13} />
                  <span>
                    নিশ্চিত থাকুন: ই-বুক কিনলে অর্ডার সম্পন্ন হওয়ামাত্রই আপনার ইউজার লাইব্রেরি ক্যাবিনেটে এবং নিবন্ধিত ইমেইলে পিডিএফ ডাউনলোডার পাঠিয়ে দেয়া হবে।
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={onClose}
                    className="px-4 py-3 bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-lg text-xs font-bold transition-all border border-stone-250 text-center uppercase"
                  >
                    আরো যোগ করুন
                  </button>
                  <button
                    onClick={onCheckout}
                    className="px-4 py-3 bg-[#1B263B] hover:bg-[#121A2A] text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1B263B]/20 uppercase"
                  >
                    <CreditCard size={13} /> অর্ডার করুন
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
