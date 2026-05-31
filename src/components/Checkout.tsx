/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, CreditCard, ChevronRight, CheckCircle, Ticket, Smartphone, Landmark, Mail, ArrowDown, HelpCircle, Loader2 } from "lucide-react";
import { CartItem } from "../types";
import { processCheckout, CheckoutPayload } from "../api";

interface CheckoutProps {
  cartItems: CartItem[];
  onClose: () => void;
  onSuccessPay: (userEmail: string, purchasedBooks: any[]) => void;
  onClearCart: () => void;
}

export default function Checkout({ cartItems, onClose, onSuccessPay, onClearCart }: CheckoutProps) {
  // Wizard steps
  const [step, setStep] = useState<"form" | "payment" | "processing" | "success">("form");

  // User input details
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Payment gateway options
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket" | "card">("bkash");
  
  // Simulated Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Simulated Mobile Banking details
  const [walletNumber, setWalletNumber] = useState("");
  const [walletOtp, setWalletOtp] = useState("");
  const [walletPin, setWalletPin] = useState("");

  // Validation details
  const [validationError, setValidationError] = useState<string | null>(null);

  // Success state data logs
  const [orderId, setOrderId] = useState("");
  const [txnId, setTxnId] = useState("");
  const [deliveryNotice, setDeliveryNotice] = useState("");
  const [finalTotal, setFinalTotal] = useState(0);

  // Cart total calculations
  const totalAmount = cartItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  const hasPhysicalBooks = cartItems.some(i => i.book.type === "physical");
  const hasEbooks = cartItems.some(i => i.book.type === "ebook");

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setValidationError("অনুগ্রহ করে আপনার নাম, ইমেইল এবং ফোন নাম্বার সঠিকভাবে পূরণ করুন।");
      return;
    }

    if (!customerEmail.includes("@") || customerEmail.length < 5) {
      setValidationError("অনুগ্রহ করে একটি বৈধ ইমেইল এড্রেস লিখুন।");
      return;
    }

    if (hasPhysicalBooks && !deliveryAddress.trim()) {
      setValidationError("আপনার কার্টে প্রিন্টেড বই রয়েছে, অনুগ্রহ করে হোম ডেলিভারির জন্য ঠিকানা লিখুন।");
      return;
    }

    setStep("payment");
  };

  const handleAuthorizePayment = async () => {
    setValidationError(null);

    // Verify gateway specific fields
    if (paymentMethod === "card") {
      if (cardNumber.length < 15 || cvv.length < 3 || !cardExpiry.trim()) {
        setValidationError("অনুগ্রহ করে কার্ড নাম্বার (১৬ ডিজিট), মেয়াদ এবং ৩-ডিজিট CVV কোড পূরণ করুন।");
        return;
      }
    } else {
      if (walletNumber.length < 11) {
        setValidationError("অনুগ্রহ করে আপনার সঠিক ১১-ডিজিটের মোবাইল ওয়ালেট নাম্বারটি দিন।");
        return;
      }
      if (!walletPin) {
        setValidationError("ভেরিফিকেশন সম্পন্ন করতে অনুগ্রহ করে ওয়ালেট পিন কোডটি প্রদান করুন।");
        return;
      }
    }

    setStep("processing");

    // Prepare payload
    const payload: CheckoutPayload = {
      customerName,
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone,
      deliveryAddress,
      cartItems: cartItems.map(i => ({ id: i.book.id, quantity: i.quantity })),
      paymentMethod,
      paymentDetails: {
        cardNumber,
        cardExpiry,
        cvv,
        mobileWalletNumber: walletNumber,
        otpCode: walletOtp,
        pinCode: walletPin
      }
    };

    try {
      // API call
      const res = await processCheckout(payload);
      if (res.success) {
        // Set success parameters
        setOrderId(res.order.id);
        setTxnId(res.txnId);
        setDeliveryNotice(res.deliveryNotice);
        setFinalTotal(res.order.totalAmount);
        
        setTimeout(() => {
          setStep("success");
          onSuccessPay(customerEmail, cartItems);
          onClearCart();
        }, 1800); // realistic payment processor timeout duration
      }
    } catch (err: any) {
      setStep("payment");
      setValidationError(err.message || "পেমেন্ট গেটওয়ে ট্রানজেকশন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full border border-gray-200 shadow-2xl overflow-hidden flex flex-col focus:outline-none">
        
        {/* Header Ribbon */}
        <div className="bg-[#1B263B] text-white p-4 flex items-center justify-between border-b border-[#1B263B]">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-[#C5A059]" />
            <h3 className="font-serif text-base font-bold">
              {step === "form" && "অর্ডার এবং ডেলিভারি বিস্তারিত"}
              {step === "payment" && "নিরাপদ পেমেন্ট গেটওয়ে (Payment Gateways)"}
              {step === "processing" && "পেমেন্ট প্রসেসিং হচ্ছে..."}
              {step === "success" && "অর্ডার সফলভাবে সম্পন্ন হয়েছে!"}
            </h3>
          </div>
          {step !== "processing" && (
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-white rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Dynamic Wizard Body container */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {validationError && (
            <div className="mb-4 bg-red-100 text-red-800 text-xs py-2 px-3 rounded-lg border border-red-200 font-sans flex items-start gap-2 leading-relaxed">
              <span>⚠️</span>
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: BILLING DETAILS FORM */}
          {step === "form" && (
            <form onSubmit={handleNextToPayment} className="space-y-4 font-sans text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-semibold uppercase tracking-wider block">গ্রাহকের নাম (Full Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="উদাঃ আব্দুল্লাহ আল নোমান"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-800 transition-all font-medium"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-stone-500 font-semibold uppercase tracking-wider block">নিবন্ধিত ইমেইল (Registered Email)</label>
                  <input
                    type="email"
                    required
                    placeholder="উদাঃ noman@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-800 transition-all font-medium focus:ring-1 focus:ring-[#1B263B]/10"
                  />
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    * ই-বুক এর ডাউনলোড লিংকটি এই ইমেইল এড্রেসে এবং ইউজার ড্যাশবোর্ডে যোগ হবে।
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-500 font-semibold uppercase tracking-wider block">মোবাইল নাম্বার (Mobile Wallet / Phone)</label>
                <input
                  type="tel"
                  required
                  placeholder="উদাঃ ০১৭১১২২৩৩৪৪"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-800 transition-all font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-500 font-semibold uppercase tracking-wider block">
                  ডেলিভারি ঠিকানা {hasPhysicalBooks ? "(Physical Delivery Address)" : "(Optional - Delivery Address)"}
                </label>
                <textarea
                  placeholder="উদাঃ বাড়ি নং ২২, রোড নং ০২, ব্লক-সি, মিরপুর ২, ঢাকা ১২১৬।"
                  rows={2}
                  required={hasPhysicalBooks}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-800 transition-all font-medium"
                />
                {!hasPhysicalBooks && (
                  <span className="text-[10px] text-neutral-400 block">
                    আপনি শুধুমাত্র ই-বুক কিনছেন, তাই কোনো ডমেস্টিক ডেলিভারি ঠিকানার প্রয়োজন নেই। ডিজিটাল লক ডিস্ট্রিবিউটর অ্যাক্টিভেট হবে।
                  </span>
                )}
              </div>

              {/* Items summary within step */}
              <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200 space-y-2 mt-4">
                <span className="font-serif text-xs font-bold text-stone-800 block">কার্ট রিভিউ (Review Order)</span>
                {cartItems.map((item) => (
                  <div key={item.book.id} className="flex justify-between items-center text-xs font-sans text-stone-600">
                    <span className="truncate max-w-[70%]">
                      {item.book.title} <span className="text-[#C5A059] font-semibold">({item.book.type === "ebook" ? "PDF" : "মুদ্রিত কপি"})</span>
                    </span>
                    <span className="font-serif">৳{item.book.price} × {item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-stone-800">
                  <span>সর্বমোট প্রদেয় বিল</span>
                  <span className="font-serif text-base text-stone-900">৳{totalAmount}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1B263B] hover:bg-[#121A2A] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  পেমেন্ট অপশনে যান <ChevronRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: GATEWAY PAYMENT CONFIG */}
          {step === "payment" && (
            <div className="space-y-6 font-sans text-xs">
              <div className="flex gap-4">
                <div className="flex flex-col items-center flex-1">
                  <span className="text-stone-400 uppercase font-bold tracking-wider text-[10px] mb-2 block">পেমেন্ট গেটওয়ে টাইপ</span>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <button
                      onClick={() => setPaymentMethod("bkash")}
                      className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        paymentMethod === "bkash" || paymentMethod === "nagad" || paymentMethod === "rocket"
                          ? "bg-amber-100/50 border-amber-600 text-amber-950 font-bold"
                          : "bg-white border-stone-250 text-stone-600"
                      }`}
                    >
                      <Smartphone size={18} className="text-stone-500" />
                      মোবাইল ব্যাংকিং (MFS)
                    </button>
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        paymentMethod === "card"
                          ? "bg-amber-100/50 border-amber-600 text-amber-950 font-bold"
                          : "bg-white border-stone-250 text-stone-600"
                      }`}
                    >
                      <CreditCard size={18} className="text-stone-500" />
                      কার্ড পেমেন্ট (SSL)
                    </button>
                  </div>
                </div>
              </div>

              {/* IF MOBILE BANKING SELECTED */}
              {(paymentMethod === "bkash" || paymentMethod === "nagad" || paymentMethod === "rocket") && (
                <div className="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-stone-700">মোবাইল ফাইনান্সিয়াল সার্ভিস বেছে নিন:</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPaymentMethod("bkash")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border tracking-wider transition-all ${
                          paymentMethod === "bkash"
                            ? "bg-pink-600 text-white border-pink-700"
                            : "bg-white text-[#1B263B] border-stone-250"
                        }`}
                      >
                        bKash (বিকাশ)
                      </button>
                      <button
                        onClick={() => setPaymentMethod("nagad")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border tracking-wider transition-all ${
                          paymentMethod === "nagad"
                            ? "bg-orange-600 text-white border-orange-700"
                            : "bg-white text-[#1B263B] border-stone-250"
                        }`}
                      >
                        Nagad (নগদ)
                      </button>
                      <button
                        onClick={() => setPaymentMethod("rocket")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border tracking-wider transition-all ${
                          paymentMethod === "rocket"
                            ? "bg-indigo-600 text-white border-indigo-700"
                            : "bg-white text-[#1B263B] border-stone-250"
                        }`}
                      >
                        Rocket (রকেট)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-stone-500 font-semibold">মোবাইল ওয়ালেট নাম্বার (Wallet No)</label>
                      <input
                        type="text"
                        maxLength={11}
                        placeholder="উদাঃ ০১৭xxxxxxxx"
                        value={walletNumber}
                        onChange={(e) => setWalletNumber(e.target.value.replace(/\D/g, ""))}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none font-bold tracking-wider"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-stone-500 font-semibold">ওয়ালেট ৪/৫ ডিজিট সিকিউর পিন (PIN)</label>
                      <input
                        type="password"
                        maxLength={5}
                        placeholder="••••"
                        value={walletPin}
                        onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, ""))}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none font-bold tracking-widest text-[#1B263B]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-500 font-semibold flex items-center gap-1">
                      OTP ভেরিফিকেশন কোড <span className="text-stone-400 font-normal">(মেসেজে প্রেরিত ৬ ডিজিট)</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="১২৩৪৫৬"
                      value={walletOtp}
                      onChange={(e) => setWalletOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none font-bold tracking-widest text-center"
                    />
                    <span className="text-[10px] text-stone-400 block">
                      * এই ভেরিফিকেশনটি সম্পূর্ণ ডেমো মোডে প্রসেস করা হবে। বাস্তব পেমেন্ট গেটওয়ের ইন্টারফেস অনুকরণ করে তৈরি।
                    </span>
                  </div>
                </div>
              )}

              {/* IF CREDIT CARD SELECTED */}
              {paymentMethod === "card" && (
                <div className="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-200">
                  <p className="font-semibold text-stone-700">ভিসา, মাস্টারকার্ড অথবা আমেরিকান এক্সপ্রেস কার্ডের তথ্য দিন:</p>
                  
                  <div className="space-y-1">
                    <label className="text-stone-500 font-semibold">কার্ডে লিখিত নাম (Cardholder Name)</label>
                    <input
                      type="text"
                      placeholder="MD. NOMAN CHOWDHURY"
                      value={cardNumber ? undefined : ""} // local styling mockup
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg uppercase outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-500 font-semibold">কার্ড নাম্বার (১৬ ডিজিটের কোড)</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="৪১২৩ ৪৫৬৭ ৮৯০১ ২৩৪৫"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none font-mono tracking-widest text-stone-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-stone-500 font-semibold">মেয়াদ উত্তীর্ণ (Expiry MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="১২/২৮"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none text-center font-mono text-stone-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-stone-500 font-semibold flex items-center gap-1">
                        CVC / CVV <span className="text-stone-400 font-normal font-sans">(পেছনের ৩ সংখ্যা)</span>
                      </label>
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none text-center font-mono font-bold text-lg text-stone-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Total calculations recap & Actions */}
              <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-stone-600">
                  <span>গ্রাহক ইমেইলঃ </span>
                  <span className="font-semibold text-stone-900">{customerEmail}</span>
                  <span className="block text-[11px] mt-0.5">সব মিলিয়ে পরিশোধযোগ্য বিল: <strong className="text-[#1B263B] font-serif text-sm font-bold">৳{totalAmount}</strong></span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStep("form")}
                    className="px-4 py-2.5 bg-stone-200 hover:bg-stone-250 text-stone-700 font-semibold rounded-lg text-xs"
                  >
                    পিছনে যান
                  </button>
                  <button
                    onClick={handleAuthorizePayment}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 uppercase tracking-wider"
                  >
                    পেমেন্ট নিশ্চিত করুন (Pay BDT ৳{totalAmount})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING TIMER LOADER */}
          {step === "processing" && (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="animate-spin text-[#C5A059]" size={52} />
              <div className="text-center space-y-1.5">
                <h4 className="font-serif text-lg font-bold text-stone-900">গেটওয়ে সিকিউরিটি চেক চলছে...</h4>
                <p className="text-stone-500 text-xs font-sans max-w-sm">
                  OnlineGoppo পেমেন্ট গেটওয়ের মাধ্যমে আপনার ব্যাংক বা মোবাইল অ্যাকাউন্ট অথরাইজেশন যাচাই হচ্ছে। দয়া করে উইন্ডোটি রিফ্রেশ বা বন্ধ করবেন না।
                </p>
              </div>
              <div className="bg-stone-100 p-2 text-[10px] text-stone-400 rounded-lg font-mono">
                ENCRYPTED SSL • TLS 1.3 SYMMETRIC CIPHER • TRANSACTION SECURE
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS WITH AUTOMATED DIGITAL DELIVERY DISPATCH SIMULATION */}
          {step === "success" && (
            <div className="space-y-6 font-sans">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-green-100 text-green-700 rounded-full mb-2">
                  <CheckCircle size={44} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">পেমেন্ট সফলভাবে সম্পাদিত হয়েছে!</h3>
                <p className="text-xs text-stone-600 max-w-lg mx-auto">
                  ধন্যবাদ, আপনার পেমেন্টটি সফল হয়েছে। অর্ডার কোড এবং প্রদেয় ক্যাশবিল তৈরি হয়েছে। আপনার লেনদেনের বিস্তারিত নিচে উল্লেখ করা হলোঃ
                </p>
              </div>

              {/* Order specifications stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-200 text-xs text-center">
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase">অর্ডার আইডি</span>
                  <span className="font-bold font-mono text-[#1B263B]">{orderId}</span>
                </div>
                <div className="border-l border-stone-200">
                  <span className="text-stone-400 block text-[9px] uppercase">ট্রানজেকশন হ্যাশ (TxnID)</span>
                  <span className="font-bold font-mono text-stone-700">{txnId}</span>
                </div>
                <div className="border-l border-stone-200">
                  <span className="text-stone-400 block text-[9px] uppercase">পরিশোধের মাধ্যম</span>
                  <span className="font-bold uppercase text-stone-700">{paymentMethod === "card" ? "ভিসা / মাস্টার" : paymentMethod}</span>
                </div>
                <div className="border-l border-stone-200">
                  <span className="text-stone-400 block text-[9px] uppercase">পরিশোধিত অর্থ</span>
                  <span className="font-bold font-serif text-stone-950">৳{finalTotal}</span>
                </div>
              </div>

              {/* AUTOMATED DIGITAL DELIVERY SIMULATION EMULATED INBOX */}
              {hasEbooks && (
                <div className="space-y-2">
                  <span className="text-stone-500 font-bold text-xs uppercase tracking-wider block">
                    📬 ইমেইল ডিস্ট্রিবিউটর লগার (Automated Digital Delivery Log)
                  </span>
                  
                  <div className="bg-white rounded-xl border border-[#C5A059]/25 shadow-md overflow-hidden text-xs">
                    {/* Mail Header Mockup */}
                    <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="text-stone-400 block font-normal">থেকে: <strong>delivery-bot@onlinegoppo.site</strong></span>
                        <span className="text-stone-600 block mt-0.5">প্রতি: <strong>{customerEmail}</strong></span>
                      </div>
                      <span className="bg-green-100 text-green-800 text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase border border-green-200 animate-pulse">
                        ইমেইল প্রেরিত (Dispatched)
                      </span>
                    </div>

                    {/* Mail Content Body Mockup */}
                    <div className="p-4 space-y-3 font-sans text-stone-700 leading-relaxed bg-[#FFFDFB]">
                      <p className="font-semibold text-stone-900">প্রিয় {customerName},</p>
                      
                      <p>
                        আপনার <strong>OnlineGoppo</strong> অনলাইন বুকশপ থেকে ক্রয়কৃত ই-বুকটি (PDF) সফলভাবে প্রস্তুত। আমাদের অটোমেটেড ডেলিভারি রোবট আপনার ডিজিটাল ফাইলটি নিচের ডাউনলোডার লিংকের মাধ্যমে আপনার ইমেইল ইনবক্সে পাঠিয়ে দিয়েছে।
                      </p>

                      <div className="bg-[#C5A059]/10 p-3 rounded-lg border border-[#C5A059]/20 text-xs">
                        <span className="font-serif font-bold text-stone-850 block mb-1">নিচে আপনার বইয়ের ডাউনলোডার লিংক দেয়া হলো:</span>
                        {cartItems.filter(i => i.book.type === "ebook").map(item => (
                          <div key={item.book.id} className="flex flex-wrap items-center justify-between gap-2 py-1.5 border-b border-amber-200/20 last:border-0">
                            <span className="font-serif text-stone-800 font-medium">📔 {item.book.title} (PDF ই-বুক)</span>
                            <a 
                              href={item.book.fileUrl || "/downloads/book_pdf_sample.pdf"} 
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-green-700 hover:bg-green-800 text-white rounded text-[10px] font-bold tracking-tight inline-flex items-center gap-1 hover:no-underline shadow-sm cursor-pointer"
                            >
                              <ArrowDown size={10} /> PDF ডাউনলোড করুন
                            </a>
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] text-stone-500">
                        * লিংকটি সুরক্ষিত এবং আজীবন সক্রিয় থাকবে। এছাড়াও, আপনি আপনার রেজিস্টার্ড ইমেইল ব্যবহার করে আমাদের <strong>ইউজার লাইব্রেরি ড্যাশবোর্ড</strong> এ লগইন করে যেকোনো সময় ডাউনলোড করা বইপত্র রিট্রিভ করতে পারবেন।
                      </p>

                      <div className="pt-3 border-t border-stone-200 text-center text-stone-400 text-[10px]">
                        © {new Date().getFullYear()} onlinegoppo.site • বুক হেভেন এডিশন।
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery notice label */}
              <div className="bg-green-50 p-3 rounded-xl border border-green-200/65 text-xs text-green-900 leading-relaxed font-sans">
                💡 <strong>ম্যানেজমেন্ট নোটঃ </strong> {deliveryNotice}
              </div>

              {/* Action and finish */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-[#1B263B] hover:bg-[#121A2A] text-white font-bold rounded-lg text-xs shadow-md hover:shadow-lg transition-all uppercase"
                >
                  দোকান ঘুরে দেখুন (Let's Continue)
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
