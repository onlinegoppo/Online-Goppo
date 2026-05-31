/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { Book, BlogPost, Order, SalesAnalytics, SiteSettings, LandingPage } from "./src/types";

const app = express();
const PORT = 3000;

const isVercel = !!process.env.VERCEL;
const REPO_DB_FILE = path.join(process.cwd(), "db.json");
const DB_FILE = isVercel ? path.join("/tmp", "db.json") : REPO_DB_FILE;

// Ensure local cache copy in Vercel's ephemeral /tmp space
if (isVercel && !fs.existsSync(DB_FILE)) {
  try {
    if (fs.existsSync(REPO_DB_FILE)) {
      fs.copyFileSync(REPO_DB_FILE, DB_FILE);
      console.log("Successfully copied db.json from REPO to /tmp for Vercel session persistence");
    }
  } catch (err) {
    console.error("Failed to copy db.json to /tmp on startup:", err);
  }
}

const DEFAULT_SETTINGS: SiteSettings = {
  storeName: "onlinegoppo.site",
  heroHeading: "মুহূর্তেই বইয়ের পাতায় হারিয়ে যান অনলাইনগল্পের সাথে",
  heroSubheading: "বাঙালি সাহিত্যের সমৃদ্ধ ইতিহাস, শ্রেষ্ঠ জনপ্রিয় উপন্যাস, বৈজ্ঞানিক রোমাঞ্চকর গবেষণা এবং যেকোনো ই-বুক PDF এখন আপনার হাতের মুঠোয়। আপনার প্রিয় লেখকের যেকোনো মুদ্রিত বই সরাসরি হোম-ডেলিভারি নিন অথবা স্মার্ট ড্রাইভে তাত্ক্ষণিক ডাউনলোড করুন।",
  heroWelcomeMsg: "Welcome to onlinegoppo.site",
  supportEmail: "onlinegoppo@gmail.com",
  supportPhone: "+৮৮০ ১৭১১২২৩৩৪৪"
};

const DEFAULT_LANDING_PAGES: LandingPage[] = [
  {
    id: "lp-1",
    bookId: "book-1",
    slug: "himu-bosonto",
    headline: "হিমুর বসন্তের রঙে নিজেকে রাঙিয়ে নিন!",
    subheading: "হুমায়ূন আহমেদের কালজয়ী সৃষ্টি হিমুর জীবনের বসন্ত উৎসব নিয়ে বিশেষ আকর্ষণীয় ল্যান্ডিং পেজ।",
    bgColor: "#1B263B",
    textColor: "#FBFBFB",
    accentColor: "#C5A059",
    promoText: "হলুদ পাঞ্জাবি পরে খালি পায়ে ঘুরে বেড়ানো এক মুক্ত মানব হিমুর বসন্ত কালীন এক অন্যরকম গল্প। এই বইটি আপনাকে নিয়ে যাবে এক অদ্ভুত মায়াবী জগতে যেখানে যুক্তি হেরে যায় বিশ্বাসের কাছে, আর মায়া হয়ে ওঠে একমাত্র বাস্তব। আজই অর্ডার করুন এবং বিশেষ ছাড়ে সংগ্রহ করুন সংগ্রহে রাখার মতো এই অনন্য সংস্করণটি!",
    promoQuote: "томаре যা দিয়েছিনু সে তোমারি দান, গ্রহণ করেছ যতো ঋণী ততো করেছ আমায়।",
    promoQuoteAuthor: "শেষের কবিতা থেকে অনুপ্রেরণা",
    seoTitle: "হিমুর বসন্ত - বিশেষ প্রচার পাতা | onlinegoppo.site",
    seoDescription: "হুমায়ূন আহমেদের অনবদ্য সৃষ্টি 'হিমুর বসন্ত'-এর চমৎকার কাস্টম কালেকশন আজই সংগ্রহ করুন।"
  }
];


// Define sample seeded books
const SEED_BOOKS: Book[] = [
  {
    id: "book-1",
    title: "হিমুর বসন্ত",
    author: "হুমায়ূন আহমেদ",
    description: "হিমুর অদ্ভুত সব কাণ্ডকারখানা নিয়ে চমৎকার একটি উপন্যাস। হলুদ পাঞ্জাবি পরে খালি পায়ে ঘুরে বেড়ানো এক মুক্ত মানব হিমুর বসন্ত কালীন এক অন্যরকম গল্প।",
    price: 220,
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    category: "bestsellers",
    type: "physical",
    stock: 25,
    publishedYear: "2012",
    pages: 148,
    rating: 4.8,
    language: "Bengali",
    isbn: "978-984-502-0012-3"
  },
  {
    id: "book-2",
    title: "মিসির আলির চশমা",
    author: "হুমায়ূন আহমেদ",
    description: "মিসির আলি একজন যুক্তিবাদী মানুষ যিনি অতিপ্রাকৃতিক ঘটনার বিজ্ঞানসম্মত ব্যাখ্যা খোঁজার চেষ্টা করেন। এই বইতে মিসির আলির এক অতি রহস্যময় চশমা নিয়ে এক শ্বাসরুদ্ধকর মনস্তাত্ত্বিক অভিযানের কাহিনী তুলে ধরা হয়েছে।",
    price: 150,
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    category: "ebooks",
    type: "ebook",
    stock: 9999,
    fileUrl: "https://onlinegoppo.site/downloads/secure_pdf_misir_ali_choshma_signed.pdf",
    publishedYear: "1997",
    pages: 120,
    rating: 4.9,
    language: "Bengali",
    isbn: "978-984-502-0125-9"
  },
  {
    id: "book-3",
    title: "শেষের কবিতা",
    author: "রবীন্দ্রনাথ ঠাকুর",
    description: "রবীন্দ্রনাথ ঠাকুরের কালজয়ী রোমান্টিক উপন্যাস। অতি আধুনিক কবি অমিত রায় এবং শান্ত পরিবেশের শিক্ষিতা তরুণী লাবণ্যর অপূর্ব প্রেমের ট্র্যাজেডি-মণ্ডিত আক্ষরিক কাব্য। এটি কবিগুরুর অন্যতম জনপ্রিয় সৃষ্টি।",
    price: 120,
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600",
    category: "ebooks",
    type: "ebook",
    stock: 9999,
    fileUrl: "https://onlinegoppo.site/downloads/secure_pdf_shesher_kobita_signed.pdf",
    publishedYear: "1929",
    pages: 180,
    rating: 4.7,
    language: "Bengali",
    isbn: "978-984-411-9876-1"
  },
  {
    id: "book-4",
    title: "সঞ্চিতা",
    author: "কাজী নজরুল ইসলাম",
    description: "জাতীয় কবি কাজী নজরুল ইসলামের কাব্যসংকলন সঞ্চিতা। বিদ্রোহ, প্রেম, মানবতা ও সাম্যের কালজয়ী কবিতাগুচ্ছের অনবদ্য সংকলন, যা প্রত্যেক বাঙালি সাহিত্যপ্রেমীর বুকশেলফে একান্ত প্রয়োজনীয়।",
    price: 320,
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
    category: "new-arrivals",
    type: "physical",
    stock: 12,
    publishedYear: "1928",
    pages: 250,
    rating: 5.0,
    language: "Bengali",
    isbn: "978-984-332-1234-8"
  },
  {
    id: "book-5",
    title: "পথের পাঁচালী",
    author: "বিভূতিভূষণ বন্দ্যোপাধ্যায়",
    description: "বাঙালি নাগরিক জীবনের বাইরে পল্লী বাংলার সহজ-সরল রূপ ও প্রকৃতির এক চিরন্তন মহাকাব্য। অপু ও দুর্গার শৈশব, অপুর রোমাঞ্চকর জানার আগ্রহ এবং প্রকৃতির রহস্যময় আকর্ষণ উপন্যাসের পরতে পরতে ভাস্বর।",
    price: 280,
    coverUrl: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?auto=format&fit=crop&q=80&w=600",
    category: "bestsellers",
    type: "physical",
    stock: 8,
    publishedYear: "1929",
    pages: 310,
    rating: 4.9,
    language: "Bengali",
    isbn: "978-984-515-0994-0"
  },
  {
    id: "book-6",
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A world-renowned inspirational novel following Santiago, a young Andalusian shepherd, on his quest to find worldly treasure. The story teaches us to listen to our hearts and pursue our dreams.",
    price: 180,
    coverUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=600",
    category: "ebooks",
    type: "ebook",
    stock: 9999,
    fileUrl: "https://onlinegoppo.site/downloads/secure_pdf_the_alchemist_coelho.pdf",
    publishedYear: "1988",
    pages: 163,
    rating: 4.8,
    language: "English",
    isbn: "978-0062315007"
  },
  {
    id: "book-7",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    description: "Stephen Hawking's landmark work about the origins of the universe, cosmology, black holes, time travel, and general relativity, explained in clear, brilliant concepts for everyone.",
    price: 450,
    coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    category: "new-arrivals",
    type: "physical",
    stock: 15,
    publishedYear: "1988",
    pages: 212,
    rating: 4.9,
    language: "English",
    isbn: "978-0553380163"
  },
  {
    id: "book-8",
    title: "লালসালু",
    author: "সৈয়দ ওয়ালীউল্লাহ্",
    description: "বাঙালি সমাজের ধর্মান্ধতা, সাধারণ মানুষের কুসংস্কার ও স্বার্থান্বেষী শোষক মজিদের জীবন সংগ্রামের উপর রচিত কালজয়ী সামাজিক চিত্র উপন্যাস লালসালু।",
    price: 130,
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600",
    category: "bestsellers",
    type: "physical",
    stock: 20,
    publishedYear: "1948",
    pages: 144,
    rating: 4.6,
    language: "Bengali",
    isbn: "978-984-444-1010-2"
  },
  {
    id: "book-focus",
    title: "পাওয়ারফুল ফোকাস",
    author: "থিবো মেরিস",
    translator: "এসবি টিম",
    publisher: "শর্টবুক",
    edition: "1st",
    country: "বাংলাদেশ",
    description: "আপনি কি কাজ করতে বসলেই মনোযোগ হারিয়ে ফেলেন? আপনার কি মনে হয় সারাদিন অনেক ব্যস্ত থাকার পরও দিন শেষে তেমন কোনো কাজই শেষ হয়নি?\n\nআজকের এই ডিজিটাল যুগে আমাদের মনোযোগ নষ্ট করার জন্য চারদিকে হাজারো আয়োজন। স্মার্টফোন থেকে শুরু করে সোশ্যাল মিডিয়া নোটিফিকেশন, সবকিছুই আমাদের ফোকাস কেড়ে নিচ্ছে। আর এই ফোকাসের অভাবই হলো আমাদের সফলতার পথে সবচেয়ে বড় বাধা। থিবো মেরিসের লেখা ‘পাওয়ারফুল ফোকাস’ বইটি আপনাকে এই বিশাল সমস্যা থেকে খুব সহজেই মুক্তি দেবে। এটি আপনার হারানো মনোযোগ ফিরিয়ে আনার একটি অত্যন্ত বাস্তবসম্মত এবং পরীক্ষিত গাইডলাইন।",
    price: 20,
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
    category: "ebooks",
    type: "ebook",
    stock: 9999,
    fileUrl: "https://onlinegoppo.site/downloads/secure_pdf_powerful_focus_bengali.pdf",
    publishedYear: "2024",
    pages: 30,
    rating: 4.9,
    language: "Bengali",
    isbn: "978-984-755-1200-5",
    videoUrl: "",
    previewPages: [
      "১ম পৃষ্ঠা: ভূমিকা (Introduction)\n\nআমাদের ফোকাসই আমাদের বাস্তব গতিপথ নির্ধারণ করে। আজকের ব্যস্ত জীবনে আপনি যা উৎপাদন করছেন তা সরাসরি নির্ভর করে আপনার গভীর মনোযোগের শক্তির ওপর। ফোকাস হলো এমন একটি আত্মিক অবলিলা, যা জটিল ও ছড়ানো কাজগুলোকে গতি দান করে। বিজ্ঞান প্রমাণ করে যে, প্রতিবার যখন আমরা অন্য কোনো কাজে ডিস্ট্রাক্টেড হই, পূর্বের মনোযোগের গভীরতায় ফিরে যেতে গড়ে ২৩ মিনিট সময় লেগে যায়। অতএব, আজকের এই প্রযুক্তিচালিত যুগে ফোকাস করা একটি দুর্লভ দক্ষতা এবং আপনার ক্যারিয়ারের সবচেয়ে বড় চালিকাশক্তি।",
      "২য় পৃষ্ঠা: প্রথম অধ্যায় - ডিস্ট্রাকশন চিনে নিন\n\nকেন আমাদের মনোযোগ বারবার চলে যায়? এর মূল হোতা আমাদের মস্তিষ্কের ডোপামিন রিওয়ার্ড সিস্টেম। সোশ্যাল মিডিয়া ফিড স্ক্রোল করা বা মেমোরিতে নতুন নোটিফিকেশন জমা হলে আমাদের ব্রেইন তাত্ক্ষণিক উত্তেজনার খোঁজে ছোট শর্টকাট নেয়। নিজেকে পরীক্ষা করার জন্য একটি ডায়েরিতে প্রতিদিন কতবার ফোন আনলক করছেন তার হিসাব লিখতে পারেন। ফলাফল দেখে আপনি নিজেই চমকে যাবেন। সুস্থ ও সফল ফোকাসের জন্য প্রথম পদক্ষেপ হলো ফোনের সব অপ্রয়োজনীয় নোটিফিকেশন একেবারেই বন্ধ করে রাখা এবং ডিস্ট্রাকশনকে চিহ্নিত করা।",
      "৩য় পৃষ্ঠা: দ্বিতীয় অধ্যায় - কাজের জন্য উপযুক্ত পরিবেশ সৃষ্টি\n\nআপনার চোখ ও কানের আশেপাশে যা থাকে, আপনার অবচেতন মন সরাসরি তা নিয়ে চিন্তা করতে শুরু করে। ডেস্কে অপ্রয়োজনীয় কাগজপত্র, খোলা ব্রাউজার উইন্ডো বা পেছনের কোলাহল আপনার মানসিক এনার্জি গ্রাস করে। কাজে বসার আগে ডেস্কটি সম্পূর্ণ পরিষ্কার করুন এবং কেবল প্রয়োজনীয় উপাদান রাখুন। ব্যাকগ্রাউন্ডে মৃদু মিউজিক বা হোয়াইট নয়েজ ব্যবহার করতে পারেন যা ব্রেইনের কার্যক্ষমতা এবং মনোনিবেশ বাড়ানোর ক্ষমতাকে বহুগুণ বাড়িয়ে দেয়।",
      "৪য় পৃষ্ঠা: গভীর কাজের ৫টি সুবর্ণ নিয়ম (Deep Work Protocol)\n\n১. প্রতিদিন সকালে অন্তত ৯০ মিনিট 'ফোকাস টাইম block' বা ব্লক তৈরি করুন যেখানে কেউ অনুমতি ছাড়া আপনার মনোযোগ ব্যাহত করতে পারবে না।\n২. 'পোমোডোরো টেকনিক' ব্যবহার করুন—প্রতি ২৫ মিনিট টানা কাজ করে ৫ মিনিটের জন্য শান্ত হয়ে বসুন এবং জোরে শ্বাস নিন।\n৩. কাজের সময় চোখের সামনে থেকে ফোনকে সম্পূর্ণ অদৃশ্য করুন।\n৪. কাজ শুরুর পূর্বে একটি সুনির্দিষ্ট লক্ষ্য স্থির করুন—যেমন 'আজ ৯টা থেকে ১০টার মধ্যে পুরো কলাম সংশোধন সম্পন্ন করব'।\n৫. মাল্টিটাস্কিং চিরতরে বন্ধ করুন—একসাথে মাত্র একটি কাজ সর্বোচ্চ গুরুত্বসহ সমাধান করুন।",
      "৫ম পৃষ্ঠা: ৩য় অধ্যায় - ফোকাস বাড়ানোর আধুনিক মেডিটেশন (Paid Content)\n\n[এই পৃষ্ঠাটি শুধুমাত্র পেইড গ্রাহকদের জন্য উন্মুক্ত। পড়া চালিয়ে যেতে অনুগ্রহ করে বইটি ক্রয় করুন]\n\nমনোযোগ ধরে রাখতে বুক-মেডিটেশন একটি চমৎকার পদ্ধতি। দীর্ঘমেয়াদী মনঃসংযোগ তৈরি করতে ব্রেইন ট্রেইনিং বা পেশীর মতো নিয়মিত চর্চার প্রয়োজন হয়। প্রতিদিন চোখ বুজে ৫ মিনিট নিজের শ্বাসের গতিকে লক্ষ্য করুন এবং মন অন্যদিকে চলে গেলেই মৃদুভাবে ফিরিয়ে আনুন। এটি ধীরে ধীরে আপনার ক্রনিক ক্লান্তি ও মনোযোগহীনতা কমিয়ে আনে।",
      "৬ষ্ঠ পৃষ্ঠা: সমাপনী অধ্যায় - দীর্ঘস্থায়ী অভ্যাস গঠন (Paid Content)\n\n[এই পৃষ্ঠাটি শুধুমাত্র পেইড গ্রাহকদের জন্য উন্মুক্ত। পড়া চালিয়ে যেতে অনুগ্রহ করে বইটি ক্রয় করুন]\n\nস্বয়ংসম্পূর্ণ জীবন গড়ার জাদুকরী মন্ত্র হলো ফোকাসকে রুটিনের অংশ করে ফেলা। একদিনের চেষ্টা আপনাকে সাফল্য এনে দেবে না, বরং ছোট ছোট পরিবর্তনের সুশৃঙ্খল ধারাবাহিকতা আপনাকে অন্য সবার চেয়ে এগিয়ে রাখবে।"
    ]
  }
];

const SEED_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "রবীন্দ্রনাথের শেষের কবিতা: প্রেমের ট্র্যাজেডি নাকি দর্শন?",
    excerpt: "শেষের কবিতা রবীন্দ্রনাথ ঠাকুরের অন্যতম মাইলফলক সৃষ্টির একটি। এখানে অমিত ও লাবণ্যর অসমাপ্ত প্রেম আমাদেরকে কী বার্তা দেয়?",
    content: `রবীন্দ্রনাথ ঠাকুরের শেষের কবিতা (১৯২৯) শুধু একটি প্রেমের উপন্যাস নয়, এটি তৎকালীন বাঙালি নাগরিক উচ্চবিত্ত সমাজ, কাব্যিক দ্বন্দ্ব এবং আধুনিক মনস্তত্ত্বের এক অপূর্ব বিশ্লেষণ।

উপন্যাসের প্রধান চরিত্র অমিত রায় উচ্চশিক্ষিত, প্রখর রসবোধ ও বুদ্ধিদীপ্ত একজন তরুণ যে চিরকাল প্রথাগত ভাবমূর্তির বিরুদ্ধে দাঁড়িয়েছে। অন্যদিকে লাবণ্য শান্ত, গভীর, শিক্ষিত ও সংযমী এক নারী যে হৃদয়ের সত্য উপলব্ধি করতে ভয় পায় না।

অমিত ও লাবণ্যর পাহাড় ও মেঘের শহর শিলং-এ প্রথম দেখা হয়। তাঁদের প্রেমের বিকাশ ছিল অত্যন্ত নান্দনিক ও বুদ্ধিবৃত্তিক। তবে তাদের শেষ পর্যন্ত এক না হতে পারা মূলত এটিই বোঝায় যে—সব প্রেম ঘর বাঁধার সীমানায় আটকে থাকতে পারে না। লাবণ্যর ভাষায়:
> 'তোমারে যা দিয়েছিনু সে তোমারি দান, গ্রহণ করেছ যতো ঋণী ততো করেছ আমায়।'

আপনার মতামত কী? শেষের কবিতা উপন্যাসটি আপনার জীবনের প্রেমের দর্শনকে কীভাবে প্রভাবিত করেছে?`,
    author: "মুহম্মদ ইসমাত",
    date: "মে ২৪, ২০২৬",
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600",
    tags: ["রবীন্দ্রনাথ ঠাকুর", "উপন্যাস রিভিউ", "বাঙালি সাহিত্য"]
  },
  {
    id: "blog-2",
    title: "হুমায়ূন আহমেদের মিসির আলি: যুক্তি বনাম বিশ্বাসের দ্বন্দ্ব",
    excerpt: "বাঙালি সাহিত্যে মিসির আলি এক অনবদ্য চরিত্র। লেখকের সৃষ্টি করা এই যুক্তিবাদী মানুষটির রহস্য সমাধান প্রক্রিয়া আমরা কেন এত ভালোবাসি?",
    content: `হুমায়ূন আহমেদের অন্যতম শ্রেষ্ঠ আবিষ্কার হলো মিসির আলি। তিনি ঢাকা বিশ্ববিদ্যালয়ের মনোবিজ্ঞান বিভাগের একজন খণ্ডকালীন অধ্যাপক। রহস্যময় ও আধিভৌতিক ঘটনার বিজ্ঞানভিত্তিক সমাধান বের করাই তাঁর কাজ।

মিসির আলির শান্ত অবয়ব, যুক্তিপ্রবণ মন এবং তীক্ষ্ণ বুদ্ধিমত্তা আমাদেরকে শেখায় যেকোনো অলৌকিক কাণ্ডের পেছনেও থাকে মনস্তাত্ত্বিক সত্য অথবা বাস্তব বৈজ্ঞানিক কারণ। হ্যালুসিনেশন, সাইকোসিস, প্যারানয়া এবং জটিল মানসিক ব্যাধির সুন্দরতম উপস্থাপন হুমায়ূন আহমেদ তাঁর মিসির আলি সিরিজের মাধ্যমে ঘটিয়েছেন।

মিসির আলির চরিত্রের অন্যতম বৈশিষ্ট্য হলো—তিনি কখনো গোঁড়ামি পছন্দ করেন না। তিনি সত্যের সর্বোচ্চ চূড়ায় পৌঁছতে সর্বদা নিরপেক্ষ দৃষ্টিকোণ বজায় রাখেন।`,
    author: "অনন্যা রায়",
    date: "মে ২৮, ২০২৬",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600",
    tags: ["হুমায়ূন আহমেদ", "মিসির আলি", "রহস্য"]
  }
];

const SEED_ORDERS: Order[] = [
  {
    id: "ORD-98231",
    customerName: "আব্দুল্লাহ আল নোমান",
    customerEmail: "noman@gmail.com",
    customerPhone: "01711223344",
    deliveryAddress: "মিরপুর ২, ঢাকা",
    items: [
      { bookId: "book-1", title: "হিমুর বসন্ত", price: 220, quantity: 1, type: "physical" },
      { bookId: "book-3", title: "শেষের কবিতা", price: 120, quantity: 1, type: "ebook" }
    ],
    totalAmount: 340,
    paymentMethod: "bkash",
    paymentTxnId: "BK99X87Y21",
    status: "paid",
    createdAt: new Date(Date.now() - 48*3600*1000).toISOString()
  },
  {
    id: "ORD-48210",
    customerName: "নাহিদ সুলতানা",
    customerEmail: "nahid.sultana@yahoo.com",
    customerPhone: "01998877665",
    items: [
      { bookId: "book-2", title: "মিসির আলির চশমা", price: 150, quantity: 1, type: "ebook" }
    ],
    totalAmount: 150,
    paymentMethod: "card",
    paymentTxnId: "TXN_CC_81092",
    status: "paid",
    createdAt: new Date(Date.now() - 12*3600*1000).toISOString()
  }
];

// Load current data or initialize
interface DBState {
  books: Book[];
  blogs: BlogPost[];
  orders: Order[];
  settings: SiteSettings;
  landingPages: LandingPage[];
}

function loadDB(): DBState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const obj = JSON.parse(data);
      if (!obj.settings) obj.settings = DEFAULT_SETTINGS;
      if (!obj.landingPages) obj.landingPages = DEFAULT_LANDING_PAGES;
      return obj as DBState;
    }
  } catch (err) {
    console.error("Error reading database file, using seeds:", err);
  }
  const defaultState: DBState = {
    books: SEED_BOOKS,
    blogs: SEED_BLOGS,
    orders: SEED_ORDERS,
    settings: DEFAULT_SETTINGS,
    landingPages: DEFAULT_LANDING_PAGES
  };
  saveDB(defaultState);
  return defaultState;
}

function saveDB(state: DBState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// Initialize db memory cache
let dbCache = loadDB();

// Credentials configurations
const SECURE_ADMIN_EMAIL = "onlinegoppo@gmail.com";
const SECURE_ADMIN_PASSWORD = "admin123";
const SECURE_ADMIN_TOKEN = "onlinegoppo-admin-secure-token-2026";

// Middlewares
app.use(express.json());

// Admin Protection Middleware
function adminAuthMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${SECURE_ADMIN_TOKEN}`) {
    return res.status(401).json({ error: "Access Denied: Certified administrator login required to view or perform this action" });
  }
  next();
}

// API Routes
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email/username and password are required" });
  }
  
  const cleanEmail = email.trim().toLowerCase();
  if (
    (cleanEmail === SECURE_ADMIN_EMAIL && password === SECURE_ADMIN_PASSWORD) ||
    (cleanEmail === "admin" && password === SECURE_ADMIN_PASSWORD)
  ) {
    return res.json({
      success: true,
      token: SECURE_ADMIN_TOKEN,
      email: SECURE_ADMIN_EMAIL,
      storeName: dbCache.settings?.storeName || "onlinegoppo.site"
    });
  } else {
    return res.status(401).json({ error: "Incorrect administrator email or password" });
  }
});

app.get("/api/books", (req, res) => {
  res.json(dbCache.books);
});

app.post("/api/books", adminAuthMiddleware, (req, res) => {
  const newBook: Book = {
    id: `book-${Date.now()}`,
    ...req.body
  };
  dbCache.books.push(newBook);
  saveDB(dbCache);
  res.status(201).json(newBook);
});

app.put("/api/books/:id", adminAuthMiddleware, (req, res) => {
  const { id } = req.params;
  const idx = dbCache.books.findIndex(b => b.id === id);
  if (idx !== -1) {
    dbCache.books[idx] = { ...dbCache.books[idx], ...req.body };
    saveDB(dbCache);
    res.json(dbCache.books[idx]);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

app.delete("/api/books/:id", adminAuthMiddleware, (req, res) => {
  const { id } = req.params;
  const initialLen = dbCache.books.length;
  dbCache.books = dbCache.books.filter(b => b.id !== id);
  if (dbCache.books.length < initialLen) {
    saveDB(dbCache);
    res.json({ success: true, message: "Book deleted" });
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

app.get("/api/blogs", (req, res) => {
  res.json(dbCache.blogs);
});

app.post("/api/blogs", adminAuthMiddleware, (req, res) => {
  const newPost: BlogPost = {
    id: `blog-${Date.now()}`,
    date: new Date().toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" }),
    ...req.body
  };
  dbCache.blogs.unshift(newPost);
  saveDB(dbCache);
  res.status(201).json(newPost);
});

app.get("/api/orders", adminAuthMiddleware, (req, res) => {
  res.json(dbCache.orders);
});

app.put("/api/orders/:id/status", adminAuthMiddleware, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = dbCache.orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    saveDB(dbCache);
    res.json(order);
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

app.get("/api/settings", (req, res) => {
  res.json(dbCache.settings || DEFAULT_SETTINGS);
});

app.post("/api/settings", adminAuthMiddleware, (req, res) => {
  dbCache.settings = { ...(dbCache.settings || DEFAULT_SETTINGS), ...req.body };
  saveDB(dbCache);
  res.json(dbCache.settings);
});

app.get("/api/landing-pages", (req, res) => {
  res.json(dbCache.landingPages || []);
});

app.post("/api/landing-pages", adminAuthMiddleware, (req, res) => {
  const pageData = req.body;
  if (!pageData.id) {
    const newPage: LandingPage = {
      id: `lp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...pageData
    };
    if (!dbCache.landingPages) dbCache.landingPages = [];
    dbCache.landingPages.unshift(newPage);
    saveDB(dbCache);
    res.status(201).json(newPage);
  } else {
    const idx = dbCache.landingPages.findIndex(p => p.id === pageData.id);
    if (idx !== -1) {
      dbCache.landingPages[idx] = { ...dbCache.landingPages[idx], ...pageData };
      saveDB(dbCache);
      res.json(dbCache.landingPages[idx]);
    } else {
      res.status(404).json({ error: "Landing page not found" });
    }
  }
});

app.delete("/api/landing-pages/:id", adminAuthMiddleware, (req, res) => {
  const { id } = req.params;
  if (dbCache.landingPages) {
    const initialLen = dbCache.landingPages.length;
    dbCache.landingPages = dbCache.landingPages.filter(p => p.id !== id);
    if (dbCache.landingPages.length < initialLen) {
      saveDB(dbCache);
      res.json({ success: true, message: "Landing page deleted" });
    } else {
      res.status(404).json({ error: "Landing page not found" });
    }
  } else {
    res.status(404).json({ error: "Landing page not found" });
  }
});

// Secure library retrieval for user purchases
app.get("/api/user/library", (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const userEmailStr = String(email).trim().toLowerCase();
  
  // Find paid orders containing ebooks for this email user
  const userEbooks: Book[] = [];
  const addedIds = new Set<string>();

  const paidOrders = dbCache.orders.filter(
    o => o.status === "paid" && o.customerEmail.trim().toLowerCase() === userEmailStr
  );

  for (const order of paidOrders) {
    for (const item of order.items) {
      if (item.type === "ebook" && !addedIds.has(item.bookId)) {
        // Find full book info
        const originalBook = dbCache.books.find(b => b.id === item.bookId);
        if (originalBook) {
          userEbooks.push(originalBook);
          addedIds.add(item.bookId);
        }
      }
    }
  }

  res.json({
    email: userEmailStr,
    orders: paidOrders,
    library: userEbooks
  });
});

// Checkout and Auto Digital Delivery
app.post("/api/checkout", (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    cartItems,
    paymentMethod,
    paymentDetails
  } = req.body;

  if (!customerName || !customerEmail || !customerPhone || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: "Missing required fields for checkout" });
  }

  const resolvedItems: any[] = [];
  let totalAmount = 0;
  let hasEbook = false;

  // Validate items and verify stocks
  for (const item of cartItems) {
    const book = dbCache.books.find(b => b.id === item.id);
    if (!book) {
      return res.status(400).json({ error: `Book with ID ${item.id} not found` });
    }

    if (book.type === "physical" && book.stock < item.quantity) {
      return res.status(400).json({ error: `Sorry, not enough physical stock for book: "${book.title}" (Available: ${book.stock})` });
    }

    resolvedItems.push({
      bookId: book.id,
      title: book.title,
      price: book.price,
      quantity: item.quantity,
      type: book.type
    });

    totalAmount += book.price * item.quantity;
    if (book.type === "ebook") {
      hasEbook = true;
    }
  }

  // Deduct physical inventory stocks
  for (const item of cartItems) {
    const book = dbCache.books.find(b => b.id === item.id);
    if (book && book.type === "physical") {
      book.stock -= item.quantity;
    }
  }

  // Fast payment confirmation simulation
  const paymentTxnId = `${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const newOrder: Order = {
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress: deliveryAddress || "Digital Locker Delivery",
    items: resolvedItems,
    totalAmount,
    paymentMethod,
    paymentTxnId,
    status: "paid",
    createdAt: new Date().toISOString()
  };

  dbCache.orders.unshift(newOrder);
  saveDB(dbCache);

  // Digital Delivery automation response detail
  const deliveryNotification = hasEbook 
    ? `An automated electronic locker dispatch email was sent to ${customerEmail}. Your high-quality secure PDF files are now active on your secure login dashboard.`
    : `Thank you for your order! Your physical books are being packed and will ship shortly.`;

  res.status(201).json({
    success: true,
    message: "Payment Authorized Successfully",
    order: newOrder,
    txnId: paymentTxnId,
    deliveryNotice: deliveryNotification,
    hasEbooks: hasEbook
  });
});

// Admin Analytics API
app.get("/api/admin/analytics", adminAuthMiddleware, (req, res) => {
  const sales = dbCache.orders.filter(o => o.status === "paid");
  
  let totalRevenue = 0;
  let physicalSalesCount = 0;
  let ebookSalesCount = 0;
  const totalOrdersCount = sales.length;
  const categorySales: { [category: string]: number } = {};

  // For time scale, let's group by days
  const dailySalesMap: { [date: string]: number } = {};

  for (const order of sales) {
    totalRevenue += order.totalAmount;
    
    // Group by Date for graph
    const dt = new Date(order.createdAt).toLocaleDateString("bn-BD", { month: "short", day: "numeric" });
    dailySalesMap[dt] = (dailySalesMap[dt] || 0) + order.totalAmount;

    for (const item of order.items) {
      if (item.type === "physical") {
        physicalSalesCount += item.quantity;
      } else {
        ebookSalesCount += item.quantity;
      }

      // Track by category
      const bookObj = dbCache.books.find(b => b.id === item.bookId);
      if (bookObj) {
        const cat = bookObj.category || "General";
        categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);
      }
    }
  }

  // Map to historical array
  const dailySales = Object.entries(dailySalesMap).map(([date, amount]) => ({
    date,
    amount
  })).reverse(); // Order appropriately

  res.json({
    totalRevenue,
    physicalSalesCount,
    ebookSalesCount,
    totalOrdersCount,
    categorySales,
    dailySales
  });
});

// Vite & Static file handler configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode: Vite Integration
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode: Static Asset Delivery
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server successfully running on port http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
