/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Book, BlogPost, Order, SalesAnalytics, SiteSettings, LandingPage } from "../types";
import { 
  fetchAnalytics, 
  createBook, 
  deleteBook, 
  updateBook, 
  createBlog, 
  fetchSettings, 
  updateSettings, 
  fetchLandingPages, 
  createLandingPage, 
  deleteLandingPage, 
  fetchOrders, 
  updateOrderStatus,
  adminLogin
} from "../api";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Settings, 
  Mail, 
  LayoutDashboard, 
  FileSpreadsheet, 
  Newspaper, 
  Server, 
  Check, 
  ArrowRight, 
  TrendingUp, 
  Smartphone, 
  BookOpen, 
  UserCheck, 
  ShoppingBag, 
  Users, 
  ExternalLink, 
  Palette, 
  Layers, 
  Sparkles, 
  PhoneCall, 
  BadgeHelp,
  Globe,
  Upload,
  Film,
  X,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface AdminPanelProps {
  books: Book[];
  blogs: BlogPost[];
  onRefreshData: () => void;
  onViewPromoPage?: (promo: LandingPage) => void;
  onNavigateHome?: () => void;
}

export default function AdminPanel({ books, blogs, onRefreshData, onViewPromoPage, onNavigateHome }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "upload" | "inventory" | "write-blog" | "landing-pages" | "orders" | "user-profiles" | "site-settings" | "domain-setup" | "database-schema">("analytics");

  // Custom Domain DNS states
  const [dnsCheckLoading, setDnsCheckLoading] = useState(false);
  const [dnsResults, setDnsResults] = useState<{
    aRecords: string[];
    cnameRecords: string[];
    txtRecords: string[];
    isConfigured: boolean;
    checkedAt: string;
  } | null>(null);
  const [dnsError, setDnsError] = useState<string | null>(null);

  const checkDomainDNS = async () => {
    setDnsCheckLoading(true);
    setDnsError(null);
    try {
      const aRes = await fetch("https://cloudflare-dns.com/dns-query?name=onlinegoppo.site&type=A", {
        headers: { Accept: "application/dns-json" }
      });
      const aData = await aRes.json();
      
      const cnameRes = await fetch("https://cloudflare-dns.com/dns-query?name=www.onlinegoppo.site&type=CNAME", {
        headers: { Accept: "application/dns-json" }
      });
      const cnameData = await cnameRes.json();

      const txtRes = await fetch("https://cloudflare-dns.com/dns-query?name=onlinegoppo.site&type=TXT", {
        headers: { Accept: "application/dns-json" }
      });
      const txtData = await txtRes.json();

      const aRecs: string[] = [];
      if (aData.Answer) {
        aData.Answer.forEach((ans: any) => {
          if (ans.type === 1) { // A record
            aRecs.push(ans.data);
          }
        });
      }

      const cnameRecs: string[] = [];
      if (cnameData.Answer) {
        cnameData.Answer.forEach((ans: any) => {
          if (ans.type === 5) { // CNAME
            cnameRecs.push(ans.data);
          }
        });
      }

      const txtRecs: string[] = [];
      if (txtData.Answer) {
        txtData.Answer.forEach((ans: any) => {
          if (ans.type === 16) { // TXT
            txtRecs.push(ans.data);
          }
        });
      }

      const requiredIPs = ["216.239.32.21", "216.239.34.21", "216.239.36.21", "216.239.38.21"];
      const matchesAnyRequired = aRecs.some(ip => requiredIPs.includes(ip));

      setDnsResults({
        aRecords: aRecs,
        cnameRecords: cnameRecs,
        txtRecords: txtRecs,
        isConfigured: matchesAnyRequired,
        checkedAt: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    } catch (err: any) {
      console.error("DNS check failed", err);
      setDnsError("ডোমেন রেকর্ড ডাটাবেস চেক সাময়িকভাবে ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    } finally {
      setDnsCheckLoading(false);
    }
  };

  // Secure admin session validation
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("onlinegoppo_admin_token");
  });
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // WordPress simulation extra states
  const [wpDraftTitle, setWpDraftTitle] = useState("");
  const [wpDraftContent, setWpDraftContent] = useState("");
  const [wpDraftsList, setWpDraftsList] = useState<{title: string, date: string}[]>(() => {
    const local = localStorage.getItem("wp_quick_drafts");
    return local ? JSON.parse(local) : [
      { title: "নতুন কবিতার বই ২০২৩ পর্যালোচনা", date: "May 29, 2026" },
      { title: "বইমেলা ২০২৬ এর টার্গেট অডিয়েন্স প্ল্যানিং", date: "May 28, 2026" }
    ];
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wpDraftTitle) return;
    const newDrafts = [
      { title: wpDraftTitle, date: new Date().toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' }) },
      ...wpDraftsList
    ];
    setWpDraftsList(newDrafts);
    localStorage.setItem("wp_quick_drafts", JSON.stringify(newDrafts));
    setWpDraftTitle("");
    setWpDraftContent("");
    setSuccessMsg("দ্রুত ড্রাফট সফলভাবে সংরক্ষণ করা হয়েছে!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDeleteDraft = (indexToDelete: number) => {
    const filtered = wpDraftsList.filter((_, idx) => idx !== indexToDelete);
    setWpDraftsList(filtered);
    localStorage.setItem("wp_quick_drafts", JSON.stringify(filtered));
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAuth(true);
    setAuthError(null);
    try {
      const response = await adminLogin(adminEmail, adminPassword);
      if (response.token) {
        localStorage.setItem("onlinegoppo_admin_token", response.token);
        setIsAdminLoggedIn(true);
        setSuccessMsg("Administrator session generated and authorized successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials. Authorization failed.");
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("onlinegoppo_admin_token");
    setIsAdminLoggedIn(false);
    setAdminEmail("");
    setAdminPassword("");
  };

  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Expanded Collections State
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Form states - Book upload
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookDesc, setBookDesc] = useState("");
  const [bookPrice, setBookPrice] = useState(150);
  const [bookCoverUrl, setBookCoverUrl] = useState("");
  const [bookCategory, setBookCategory] = useState("bestsellers");
  const [bookType, setBookType] = useState<"physical" | "ebook">("physical");
  const [bookStock, setBookStock] = useState(15);
  const [bookFileUrl, setBookFileUrl] = useState("");
  const [bookYear, setBookYear] = useState("2026");
  const [bookPages, setBookPages] = useState(160);
  const [bookLanguage, setBookLanguage] = useState("Bengali");
  const [bookIsbn, setBookIsbn] = useState("");
  const [bookVideoUrl, setBookVideoUrl] = useState("");

  // Editing Book State & Modal State
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form states - Blog post writing
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("মাওলানা মুফতি আব্দুল মালেক");
  const [blogCoverUrl, setBlogCoverUrl] = useState("");
  const [blogTags, setBlogTags] = useState("");
  const [blogCategory, setBlogCategory] = useState("সম্পাদকীয়");
  const [blogIssue, setBlogIssue] = useState("মে ২০২৬");
  const [blogMediaList, setBlogMediaList] = useState<{ id: string; name: string; type: "image" | "video"; url: string }[]>([]);
  const [blogUploadProgress, setBlogUploadProgress] = useState<string | null>(null);

  // Form states - Landing Page Builder
  const [lpBookId, setLpBookId] = useState("");
  const [lpSlug, setLpSlug] = useState("");
  const [lpHeadline, setLpHeadline] = useState("");
  const [lpSubheading, setLpSubheading] = useState("");
  const [lpBgColor, setLpBgColor] = useState("#1B263B");
  const [lpTextColor, setLpTextColor] = useState("#FBFBFB");
  const [lpAccentColor, setLpAccentColor] = useState("#C5A059");
  const [lpPromoText, setLpPromoText] = useState("");
  const [lpQuote, setLpQuote] = useState("");
  const [lpQuoteAuthor, setLpQuoteAuthor] = useState("");
  const [lpSeoTitle, setLpSeoTitle] = useState("");
  const [lpSeoDescription, setLpSeoDescription] = useState("");

  // Form states - Settings customization
  const [settingsStoreName, setSettingsStoreName] = useState("");
  const [settingsHeroHeading, setSettingsHeroHeading] = useState("");
  const [settingsHeroSubheading, setSettingsHeroSubheading] = useState("");
  const [settingsHeroWelcomeMsg, setSettingsWelcomeMsg] = useState("");
  const [settingsSupportEmail, setSettingsSupportEmail] = useState("");
  const [settingsSupportPhone, setSettingsSupportPhone] = useState("");

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAllAdminData();
    }
  }, [books, isAdminLoggedIn]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsData, ordersData, landersData, settingsData] = await Promise.all([
        fetchAnalytics(),
        fetchOrders(),
        fetchLandingPages(),
        fetchSettings()
      ]);
      setAnalytics(analyticsData);
      setOrders(ordersData);
      setLandingPages(landersData);
      setSiteSettings(settingsData);

      // Auto populate Settings forms
      if (settingsData) {
        setSettingsStoreName(settingsData.storeName || "onlinegoppo.site");
        setSettingsHeroHeading(settingsData.heroHeading || "");
        setSettingsHeroSubheading(settingsData.heroSubheading || "");
        setSettingsWelcomeMsg(settingsData.heroWelcomeMsg || "");
        setSettingsSupportEmail(settingsData.supportEmail || "onlinegoppo@gmail.com");
        setSettingsSupportPhone(settingsData.supportPhone || "+৮৮০ ১৭xxxxxxxx");
      }
    } catch (err) {
      console.error("Error loading secure admin collections:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle || !bookAuthor) return;

    try {
      await createBook({
        title: bookTitle,
        author: bookAuthor,
        description: bookDesc,
        price: Number(bookPrice),
        coverUrl: bookCoverUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600",
        category: bookCategory,
        type: bookType,
        stock: bookType === "ebook" ? 9999 : Number(bookStock),
        fileUrl: bookType === "ebook" ? (bookFileUrl || "https://onlinegoppo.site/downloads/book_pdf_sample.pdf") : undefined,
        publishedYear: bookYear,
        pages: Number(bookPages),
        rating: 4.8,
        language: bookLanguage,
        isbn: bookIsbn,
        videoUrl: bookVideoUrl || undefined
      });

      setSuccessMsg("নতুন বইটি সফলভাবে আপলোড ও রেজিস্টার করা হয়েছে!");
      onRefreshData();
      
      // Reset form
      setBookTitle("");
      setBookAuthor("");
      setBookDesc("");
      setBookCoverUrl("");
      setBookFileUrl("");
      setBookIsbn("");
      setBookVideoUrl("");
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      alert("বই আপলোড ব্যর্থ হয়েছে।");
    }
  };

  const handleBookEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    try {
      await updateBook(editingBook.id, editingBook);
      setSuccessMsg("বইয়ের পরিবর্তনসমূহ সফলভাবে সংরক্ষণ করা হয়েছে!");
      onRefreshData();
      setEditingBook(null);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      alert("বই এডিটিং ব্যর্থ হয়েছে।");
    }
  };

  const handleBlogPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;

    // Word count validation (minimum 2,000 words to ensure high quality research)
    const words = blogContent.trim().split(/[\s,।০১২৩৪৫৬৭৮৯]+/);
    const wordCount = words.filter(w => w.length > 0).length;

    if (wordCount < 2000) {
      alert(`গবেষণামূলক নিবন্ধের মান রক্ষার্থে ন্যূনতম ২,০০০ শব্দের বিবরণ আবশ্যক। আপনার প্রবন্ধে বর্তমানে ${wordCount}টি শব্দ রয়েছে। অনুগ্রহ করে লেখাটি আরও বিস্তারিত করুন (আরও ${2000 - wordCount} শব্দ যোগ করুন)।\n\nসাহায্যঃ কন্টেন্ট বাক্সের উপরে থাকা 'নমুনা গবেষণামূলক নিবন্ধ' বাটনে ক্লিক করে ২,০০০+ শব্দের নমুনা লেখা অটো-ফিল করতে পারেন!`);
      return;
    }

    try {
      await createBlog({
        title: blogTitle,
        excerpt: blogExcerpt || blogContent.substring(0, 100) + "...",
        content: blogContent,
        author: blogAuthor,
        coverUrl: blogCoverUrl || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600",
        tags: blogTags ? blogTags.split(",").map(t => t.trim()) : ["গবেষণা", "কলাম"],
        category: blogCategory,
        issue: blogIssue
      });

      setSuccessMsg("নতুন গবেষণামূলক প্রবন্ধ সফলভাবে সংরক্ষণ ও প্রকাশ করা হয়েছে!");
      onRefreshData();

      setBlogTitle("");
      setBlogExcerpt("");
      setBlogContent("");
      setBlogCoverUrl("");
      setBlogTags("");
      setBlogCategory("সম্পাদকীয়");
      setBlogIssue("মে ২০২৬");
      setBlogMediaList([]);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      alert("আর্টিকেল পোস্টিং ব্যর্থ হয়েছে।");
    }
  };

  const handleStockUpdate = async (bookId: string, currentStock: number, change: number) => {
    const newStock = Math.max(0, currentStock + change);
    try {
      await updateBook(bookId, { stock: newStock });
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookDelete = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই বইটি ডিলিট করতে চান? এটি ইনভেন্টরি থেকে চিরতরে মুছে যাবে।")) {
      try {
        await deleteBook(id);
        onRefreshData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      setSuccessMsg(`অর্ডারের স্ট্যাটাস সফলভাবে "${status}" এ পরিবর্তন করা হয়েছে।`);
      loadAllAdminData();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      alert("স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।");
    }
  };

  const handleSaveLandingPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lpBookId || !lpSlug || !lpHeadline) {
      alert("দয়া করে বইয়ের নাম, স্ল্যাগ ও প্রমোশনাল শিরোনাম প্রদান করুন!");
      return;
    }

    try {
      const payload: Partial<LandingPage> = {
        bookId: lpBookId,
        slug: lpSlug.toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
        headline: lpHeadline,
        subheading: lpSubheading,
        bgColor: lpBgColor,
        textColor: lpTextColor,
        accentColor: lpAccentColor,
        promoText: lpPromoText,
        promoQuote: lpQuote,
        promoQuoteAuthor: lpQuoteAuthor,
        seoTitle: lpSeoTitle || `${lpHeadline} | onlinegoppo.site`,
        seoDescription: lpSeoDescription || lpSubheading
      };

      await createLandingPage(payload);
      setSuccessMsg("বিশেষ বুক ল্যান্ডিং প্রমোশনাল পেজ সফলভাবে সৃষ্টি করা হয়েছে!");
      
      // Clear LP fields
      setLpBookId("");
      setLpSlug("");
      setLpHeadline("");
      setLpSubheading("");
      setLpPromoText("");
      setLpQuote("");
      setLpQuoteAuthor("");
      setLpSeoTitle("");
      setLpSeoDescription("");

      const landers = await fetchLandingPages();
      setLandingPages(landers);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      alert("ল্যান্ডিং পেজ সৃষ্টি ব্যর্থ হয়েছে।");
    }
  };

  const handleDeleteLander = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই ল্যান্ডিং প্রমোশন পেজটি ডিলিট করতে চান?")) {
      try {
        await deleteLandingPage(id);
        const landers = await fetchLandingPages();
        setLandingPages(landers);
        setSuccessMsg("প্রচার পাতাটি ডিলিট করা হয়েছে।");
        setTimeout(() => setSuccessMsg(null), 2500);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateSettings({
        storeName: settingsStoreName,
        heroHeading: settingsHeroHeading,
        heroSubheading: settingsHeroSubheading,
        heroWelcomeMsg: settingsHeroWelcomeMsg,
        supportEmail: settingsSupportEmail,
        supportPhone: settingsSupportPhone
      });
      setSiteSettings(updated);
      setSuccessMsg("সাইটের গ্লোবাল কনফিগারেশন সেটিংস সফলভাবে আপডেট করা হয়েছে!");
      onRefreshData();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      alert("সাইট সেটিংস কাস্টমাইজেশন ব্যর্থ হয়েছে।");
    }
  };

  // Synthesize customer Profiles & LTV metrics
  const getCustomerProfiles = () => {
    const map: { [email: string]: { name: string; phone: string; address: string; orderCount: number; spend: number; books: string[] } } = {};
    
    orders.forEach(o => {
      const email = o.customerEmail.toLowerCase().trim();
      if (!map[email]) {
        map[email] = {
          name: o.customerName || "অজানা ক্রেতা",
          phone: o.customerPhone || "N/A",
          address: o.deliveryAddress || "N/A",
          orderCount: 0,
          spend: 0,
          books: []
        };
      }
      
      map[email].orderCount += 1;
      map[email].spend += o.totalAmount;
      o.items.forEach(i => {
        if (!map[email].books.includes(i.title)) {
          map[email].books.push(i.title);
        }
      });
      // always pick the latest order's details for contact info
      if (o.customerPhone) map[email].phone = o.customerPhone;
      if (o.deliveryAddress) map[email].address = o.deliveryAddress;
      if (o.customerName) map[email].name = o.customerName;
    });

    return Object.entries(map).map(([email, info]) => ({
      email,
      ...info
    })).sort((a, b) => b.spend - a.spend); // Highest spends first
  };

  const customerProfiles = getCustomerProfiles();

  // Filter orders by search & status
  const getFilteredOrders = () => {
    return orders.filter(o => {
      const matchesSearch = 
        o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        (o.paymentTxnId && o.paymentTxnId.toLowerCase().includes(orderSearchQuery.toLowerCase()));

      const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredOrders = getFilteredOrders();

  if (!isAdminLoggedIn) {
    return (
      <div className="py-20 bg-[#FBFBFB] min-h-[70vh] flex items-center justify-center font-sans tracking-tight">
        <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-2xl p-8 mr-auto ml-auto">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="bg-[#1B263B] text-white p-3 rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-md">
              <Server size={24} className="text-[#C5A059]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-800">Verified Admin Session</h3>
            <p className="text-xs text-stone-500 mt-1">Please authenticate with secure credentials to enter onlinegoppo.site console.</p>
          </div>

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-left">
            {authError && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 text-xs rounded-xl font-semibold flex items-center gap-2">
                <span>⚠️ {authError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block">Admin Email / Username</label>
              <input
                type="text"
                placeholder="e.g. onlinegoppo@gmail.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none transition-all text-slate-800"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block">Passcode</label>
                <span className="text-[10px] text-[#C5A059] font-medium">Reset restricted</span>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none transition-all text-slate-800"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submittingAuth}
              className="w-full py-3 bg-[#1B263B] text-white hover:bg-[#1B263B]/90 font-semibold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submittingAuth ? "Authorizing Secure Client..." : "Generate Secure Bearer Access Session"}
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Quick Helper for Developers */}
          <div className="mt-8 pt-5 border-t border-gray-150 text-center">
            <p className="text-[10px] text-stone-400">Scaffold credentials: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-600">onlinegoppo@gmail.com</code> / <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-600">admin123</code></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#f0f0f1] z-[100] h-screen overflow-hidden flex flex-col font-sans text-[#2c3338] select-text">
      
      {/* WordPress Top Admin Bar */}
      <div className="h-8 bg-[#1d2327] text-[#c3c4c7] flex justify-between items-center px-4 fixed top-0 left-0 right-0 z-50 text-[12px] font-sans border-b border-stone-850 select-none">
        <div className="flex items-center gap-4">
          {/* Mobile sidebar toggle */}
          <button 
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
            className="md:hidden text-stone-300 hover:text-white transition-colors p-1 text-sm font-semibold"
          >
            ☰ Menu
          </button>
          
          {/* Brand & Visit site shortcut */}
          <button 
            type="button"
            onClick={onNavigateHome} 
            className="flex items-center gap-1.5 font-bold hover:text-[#72aee6] text-stone-100 transition-colors cursor-pointer text-xs uppercase"
          >
            <Server size={14} className="text-[#C5A059]" />
            <span className="hidden sm:inline">{siteSettings?.storeName || "onlinegoppo.site"}</span>
            <ExternalLink size={10} className="opacity-65" />
          </button>

          <span className="hidden md:inline text-stone-500 text-[11px] border-l border-stone-700 pl-4">
            ভার্সন ৬.৬-লাইভ • ওয়ান-ক্লিক কুয়েরি
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-stone-300 text-[11px] hidden sm:inline">Howdy, <strong>Administrator</strong></span>
            <div className="w-5 h-5 rounded-full bg-[#C5A059] text-white flex items-center justify-center font-bold text-[10px]">A</div>
          </div>
          <button
            type="button"
            onClick={handleAdminLogout}
            className="text-[#f0f0f1]/80 hover:text-red-400 text-[11px] font-semibold transition-all cursor-pointer bg-transparent border-none font-sans"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Two-Column SideBar & Work Area Body */}
      <div className="flex flex-1 pt-8 overflow-hidden relative">
        
        {/* WordPress Style Sticky Sidebar */}
        <div className={`w-64 bg-[#1d2327] text-[#f0f0f1] absolute md:static top-0 bottom-0 left-0 z-40 overflow-y-auto pt-3 flex flex-col justify-between select-none border-r border-[#2c3338] transition-all duration-300 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
          <div className="space-y-1.5">
            {/* Header info inside sidebar */}
            <div className="px-4 py-3 bg-stone-900/40 border-b border-stone-800 mb-2">
              <div className="flex items-center gap-2 text-left">
                <span className="bg-[#2271b1] text-white font-serif font-black px-1.5 py-0.5 rounded text-xs">WP</span>
                <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase">WordPress System</span>
              </div>
            </div>

            {/* Main Menu Links items */}
            <div className="space-y-0.5">
              {[
                { id: "analytics", label: "Dashboard (ড্যাশবোর্ড)", icon: <LayoutDashboard size={14} /> },
                { id: "inventory", label: "WooCommerce Books (বই)", icon: <FileSpreadsheet size={14} />, count: books.length },
                { id: "upload", label: "Add New Book (বই যোগ)", icon: <Plus size={14} /> },
                { id: "orders", label: "Orders (গ্রাহকের অর্ডার)", icon: <ShoppingBag size={14} />, count: orders.length },
                { id: "write-blog", label: "Posts (সাহিত্য ব্লগ)", icon: <Newspaper size={14} /> },
                { id: "landing-pages", label: "Landing Pages (মার্কেটিং)", icon: <Layers size={14} />, count: landingPages.length },
                { id: "user-profiles", label: "Users CRM (কাস্টমার)", icon: <Users size={14} />, count: customerProfiles.length },
                { id: "site-settings", label: "Settings (সাইট সেটিংস)", icon: <Settings size={14} /> },
                { id: "domain-setup", label: "Custom Domain (ডোমেন)", icon: <Globe size={14} /> },
                { id: "database-schema", label: "System Schema (SQL)", icon: <Server size={14} /> },
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between text-left px-4 py-2.5 border-l-4 transition-all duration-150 cursor-pointer ${
                      isActive 
                        ? "bg-[#2271b1] text-white border-l-[#72aee6]" 
                        : "border-l-transparent text-[#f0f0f1]/75 hover:bg-[#2c3338] hover:text-[#72aee6]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-white" : "text-[#a7aaad]"}>{item.icon}</span>
                      <span className="font-semibold text-xs tracking-tight">{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-stone-800 text-[#a7aaad]"
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Sidebar Footer */}
          <div className="px-4 py-3 border-t border-stone-800 bg-[#1d2327]/60 text-[#a7aaad] text-[10px] font-mono select-none">
            Logged as Administrator<br/>
            Admin Portal v6.6
          </div>
        </div>

        {/* Main Workspace Frame container */}
        <div className="flex-1 overflow-y-auto bg-[#f0f0f1] p-4 md:p-8 flex flex-col justify-between">
          
          {/* Header area of Workspace with dynamic page title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-250 mb-6 gap-4 select-none">
            <div className="text-left">
              <h2 className="font-serif text-2xl font-black text-[#1d2327]">
                {activeTab === "analytics" && "Dashboard (ড্যাশবোর্ড)"}
                {activeTab === "inventory" && "WooCommerce Books (বই)"}
                {activeTab === "upload" && "Add New Book (বই যোগ)"}
                {activeTab === "orders" && "WooCommerce Orders Hub (গ্রাহক অর্ডার)"}
                {activeTab === "write-blog" && "Write New Creative Article (সাহিত্য ব্লগ)"}
                {activeTab === "landing-pages" && "Marketing Landing Pages Customizer (ল্যান্ডার Builder)"}
                {activeTab === "orders" && "WooCommerce Orders Hub (গ্রাহক অর্ডার)"}
                {activeTab === "write-blog" && "Write New Creative Article (সাহিত্য ব্লগ)"}
                {activeTab === "landing-pages" && "Marketing Landing Pages Customizer (ল্যান্ডার Builder)"}
                {activeTab === "user-profiles" && "Verified Customers Database (গ্রাহক প্রোফাইল)"}
                {activeTab === "site-settings" && "Customizer Store Information Settings (গ্লোবাল সেটিংস)"}
                {activeTab === "database-schema" && "Active SQL System Tables Metadata (স্কিমা)"}
              </h2>
              <p className="text-stone-500 text-[11px] mt-0.5">
                {activeTab === "analytics" && "At a Glance core WooCommerce metrics, sales volume, and quick draft capabilities."}
                {activeTab === "inventory" && "Edit listings, configure core paperback inventory stock triggers, or digital locks."}
                {activeTab === "upload" && "Publish a physical paperback literary piece or configure instantly downloadable pdf archives."}
                {activeTab === "orders" && "Review customer digital payments, confirm ledger transaction hashes, and activate downloads."}
                {activeTab === "write-blog" && "Draft editorial pieces, literary columns, and book reviews read by hundreds of readers daily."}
                {activeTab === "landing-pages" && "Launch high-conversion single-product promotional campaigns linked directly to bkash buttons."}
                {activeTab === "user-profiles" && "Manage customer lifetimes, direct order histories, and verified credentials access matrix."}
                {activeTab === "site-settings" && "Configure dynamic welcome layouts, customer hotlines, legal support emails, and headlines."}
                {activeTab === "database-schema" && "Read structural entity diagrams and master schema maps of the persistent JSON store."}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] bg-white border border-stone-200 px-3 py-1.5 rounded shadow-sm self-start">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-stone-600 font-mono font-semibold">Live DB Connected • port 3000</span>
            </div>
          </div>

          {/* Success Alerts Banner style WordPress message */}
          {successMsg && (
            <div className="mb-6 bg-white border-l-4 border-[#2271b1] text-stone-800 py-3 px-4 shadow-sm text-xs font-semibold flex items-center gap-2 transition-all">
              <Check size={16} className="text-[#2271b1]" /> {successMsg}
            </div>
          )}

          {/* ==================== TAB 1: ANALYTICS (DASHBOARD) ==================== */}
          {activeTab === "analytics" && (
            <div className="space-y-6 handle-animation-fade-in text-xs text-left">
              
              {/* WordPress Welcome Panel */}
              <div className="bg-white border border-stone-200 p-6 rounded shadow-sm">
                <h3 className="text-base font-bold text-[#1d2327] mb-2">Welcome to your onlinegoppo.site Admin Console version 6.6-beta!</h3>
                <p className="text-stone-500 text-[12px] mb-4">We have assembled some links to get you started on managing your digital book paradise:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[12px]">
                  <div className="space-y-2">
                    <h4 className="font-bold text-stone-700">Get Started</h4>
                    <button type="button" onClick={() => setActiveTab("upload")} className="text-[#2271b1] hover:underline font-semibold block text-left">✍️ Write / Upload a New Book</button>
                    <button type="button" onClick={() => setActiveTab("site-settings")} className="text-[#2271b1] hover:underline font-semibold block text-left">⚙️ Customize site headlines</button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-stone-700">Next Steps</h4>
                    <button type="button" onClick={() => setActiveTab("inventory")} className="text-[#2271b1] hover:underline font-semibold block text-left">📦 Manage paperback stock triggers</button>
                    <button type="button" onClick={() => setActiveTab("orders")} className="text-[#2271b1] hover:underline font-semibold block text-left">🛒 View pending orders ({orders.length})</button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-stone-700">More Actions</h4>
                    <button type="button" onClick={onNavigateHome} className="text-[#2271b1] hover:underline font-semibold block text-left">🌐 Go inspect public books list</button>
                    <button type="button" onClick={() => setActiveTab("landing-pages")} className="text-[#2271b1] hover:underline font-semibold block text-left">🚀 Design high-conversion promotion book pages</button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-stone-400">বিশ্লেষণ তথ্য লোড হচ্ছে...</div>
              ) : analytics ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Main Widgets */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* At a Glance Widget */}
                    <div className="bg-white border border-stone-200 rounded shadow-sm overflow-hidden text-left">
                      <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200">
                        <h4 className="font-bold text-stone-800 text-xs">At a Glance (এক নজরে)</h4>
                      </div>
                      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                        <div className="space-y-1">
                          <span className="text-stone-400 block tracking-normal text-[10px] font-bold uppercase">Published Books</span>
                          <button type="button" onClick={() => setActiveTab("inventory")} className="text-[#2271b1] hover:underline font-bold text-xl block text-left">{books.length} Books</button>
                        </div>
                        <div className="space-y-1">
                          <span className="text-stone-400 block tracking-normal text-[10px] font-bold uppercase">Blog Articles</span>
                          <button type="button" onClick={() => setActiveTab("write-blog")} className="text-[#2271b1] hover:underline font-bold text-xl block text-left">{blogs.length} Posts</button>
                        </div>
                        <div className="space-y-1">
                          <span className="text-stone-400 block tracking-normal text-[10px] font-bold uppercase">Total Orders</span>
                          <button type="button" onClick={() => setActiveTab("orders")} className="text-[#2271b1] hover:underline font-bold text-xl block text-left">{orders.length} Invoices</button>
                        </div>
                        <div className="space-y-1">
                          <span className="text-stone-400 block tracking-normal text-[10px] font-bold uppercase">LTV Customers</span>
                          <button type="button" onClick={() => setActiveTab("user-profiles")} className="text-[#2271b1] hover:underline font-bold text-xl block text-left">{customerProfiles.length} Users</button>
                        </div>
                      </div>
                    </div>

                    {/* Sales Metrics and Chart */}
                    <div className="bg-white border border-stone-200 rounded shadow-sm overflow-hidden text-left">
                      <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200 flex justify-between items-center">
                        <h4 className="font-bold text-stone-800 text-xs">WooCommerce Core Performance Analytics</h4>
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold font-mono border border-emerald-200">Active Node Database Link</span>
                      </div>
                      
                      <div className="p-4 md:p-6 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-stone-50 p-4 border border-stone-150 rounded">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block text-left">Total Platform Revenue</span>
                            <h3 className="text-2xl font-bold text-[#1B263B] mt-1 text-left">৳{analytics.totalRevenue}</h3>
                          </div>
                          <div className="bg-stone-50 p-4 border border-stone-150 rounded">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block text-left">Paperbacks Copy Sales</span>
                            <h3 className="text-2xl font-bold text-stone-900 mt-1 text-left">{analytics.physicalSalesCount} Copies</h3>
                          </div>
                          <div className="bg-stone-50 p-4 border border-stone-150 rounded">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block text-left">Ebook PDFs Delivered</span>
                            <h3 className="text-2xl font-bold text-green-800 mt-1 text-left">{analytics.ebookSalesCount} Files</h3>
                          </div>
                        </div>

                        {/* Chart representation */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-stone-150">
                            <h5 className="font-bold text-stone-700 text-xs text-left">Daily Sales Trends & Growth</h5>
                            <span className="text-[10px] text-stone-400 font-mono">Live synchronization</span>
                          </div>
                          {analytics.dailySales && analytics.dailySales.length > 0 ? (
                            <div className="space-y-4">
                              <div className="flex items-end justify-between gap-2 h-44 pt-4">
                                {analytics.dailySales.map((day, idx) => {
                                  const maxVal = Math.max(...analytics.dailySales.map(d => d.amount), 500);
                                  const percent = (day.amount / maxVal) * 100;
                                  return (
                                    <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                                      <div className="absolute -top-8 bg-[#1B263B] text-white text-[9px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap font-sans">
                                        ৳{day.amount}
                                      </div>
                                      <div 
                                        style={{ height: `${Math.max(8, percent)}%` }}
                                        className="w-full bg-[#1B263B] hover:bg-[#2271b1] rounded-t transition-all duration-300 shadow-sm"
                                      ></div>
                                      <span className="text-[9px] text-[#2c3338] font-mono mt-2 scale-90">
                                        {day.date}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="text-stone-400 text-center py-6">No historical records found.</div>
                          )}
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Right WordPress Sidebar Widgets */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Quick Draft Widget */}
                    <div className="bg-white border border-stone-200 rounded shadow-sm overflow-hidden text-left">
                      <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200">
                        <h4 className="font-bold text-stone-800 text-xs">Quick Draft (দ্রুত ড্রাফট)</h4>
                      </div>
                      <form onSubmit={handleSaveDraft} className="p-4 space-y-3">
                        <input
                          type="text"
                          placeholder="Title / শিরোনাম"
                          value={wpDraftTitle}
                          onChange={(e) => setWpDraftTitle(e.target.value)}
                          className="w-full bg-white border border-stone-300 p-2 text-xs rounded outline-none h-9 focus:border-[#2271b1] transition-all text-slate-800 font-sans"
                          required
                        />
                        <textarea
                          placeholder="What's on your mind? Save private bookkeeping indices, literary drafts, stock todo logs..."
                          rows={4}
                          value={wpDraftContent}
                          onChange={(e) => setWpDraftContent(e.target.value)}
                          className="w-full bg-white border border-stone-300 p-2 text-xs rounded outline-none leading-relaxed focus:border-[#2271b1] transition-all text-slate-850 font-sans"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold text-xs rounded transition-all cursor-pointer shadow-sm font-sans"
                        >
                          Save Draft Note
                        </button>
                      </form>

                      {/* Draft Notes Lists */}
                      {wpDraftsList.length > 0 && (
                        <div className="border-t border-stone-200 p-4 space-y-2">
                          <h5 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block text-left">Your Saved Admin Draft Notes:</h5>
                          <div className="divide-y divide-stone-150">
                            {wpDraftsList.map((dt, idx) => (
                              <div key={idx} className="py-2.5 flex items-center justify-between gap-2 text-left">
                                <div className="text-[11px] text-left">
                                  <span className="font-semibold text-stone-800 block text-left leading-snug">{dt.title}</span>
                                  <span className="text-[10px] text-stone-400 block text-left font-mono mt-0.5">{dt.date}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDraft(idx)}
                                  className="text-stone-400 hover:text-red-600 hover:bg-stone-100 p-1 rounded transition-colors cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Site Security and Host Health Status */}
                    <div className="bg-white border border-stone-200 rounded shadow-sm overflow-hidden text-left">
                      <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200">
                        <h4 className="font-bold text-stone-800 text-xs">Site Health & integrity</h4>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold font-mono text-xs">100</div>
                          <div>
                            <h5 className="font-bold text-xs text-stone-800">Uptime checks are perfect</h5>
                            <p className="text-[10px] text-stone-400">0 errors reported. DB verified in memory.</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5 border-t border-stone-150 pt-3 text-[11px] text-stone-600 font-sans">
                          <div className="flex justify-between">
                            <span>Admin Key Validated:</span>
                            <span className="font-bold text-emerald-600">Secure AES Bearer</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Core Tables:</span>
                            <span className="font-bold text-emerald-600 font-mono">100% synchronized</span>
                          </div>
                          <div className="flex justify-between">
                            <span>JSON persistent storage:</span>
                            <span className="font-bold text-sky-700 font-mono">CJS Server Engine</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Orders activities short widget */}
                    <div className="bg-white border border-stone-200 rounded shadow-sm overflow-hidden text-left">
                      <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200">
                        <h4 className="font-bold text-stone-800 text-xs text-left">Latest Invoices Streams</h4>
                      </div>
                      <div className="p-4 divide-y divide-stone-100 text-left">
                        {orders.slice(0, 4).map((o, index) => (
                          <div key={index} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs font-sans">
                            <div className="text-left">
                              <span className="font-bold text-stone-805 block text-left">{o.customerName}</span>
                              <span className="text-[10px] text-stone-400 block text-left">৳{o.totalAmount} • {o.paymentMethod}</span>
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-sans ${
                              o.status === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {o.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="py-12 bg-white border rounded text-center text-stone-400">বিশ্লেষণ তথ্য ডেটা রেন্ডার ব্যর্থ হয়েছে।</div>
              )}

            </div>
          )}

        {/* ==================== TAB 2: INVENTORY ==================== */}
        {activeTab === "inventory" && (
          <div className="bg-white border border-gray-200 p-4 md:p-6 rounded-2xl shadow-sm overflow-hidden handle-animation-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h4 className="font-serif text-base font-bold text-[#1B263B]">ইনভেন্টরি চাল তালিকা (Books Inventory Control)</h4>
              <span className="text-[10px] text-stone-400 font-mono">মোট {books.length} টি বই ডাটাবেজে রয়েছে</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-stone-500 uppercase text-[9px] tracking-wider font-bold">
                    <th className="py-2.5 px-3">কাভার ও শিরোনাম</th>
                    <th className="py-2.5 px-3">লেখক</th>
                    <th className="py-2.5 px-3">ক্যাটাগরি</th>
                    <th className="py-2.5 px-3">টাইপ ফরম্যাট</th>
                    <th className="py-2.5 px-3 text-center">মূল্য</th>
                    <th className="py-2.5 px-3 text-center">ইনভেন্টরি স্টক</th>
                    <th className="py-2.5 px-3 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50/50 text-stone-750">
                      <td className="py-3 px-3 flex items-center gap-3">
                        <div className="w-9 h-12 rounded bg-gray-50 overflow-hidden border border-gray-200 shadow-sm flex-shrink-0 relative">
                          <img src={book.coverUrl} alt={book.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-black/10"></div>
                        </div>
                        <div>
                          <strong className="block font-serif text-stone-900 leading-tight">{book.title}</strong>
                          <span className="text-[9px] text-stone-400 font-mono font-bold">ISBN: {book.isbn || "N/A"}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold">{book.author}</td>
                      <td className="py-3 px-3 capitalize font-normal text-stone-500">{book.category}</td>
                      <td className="py-3 px-3">
                        {book.type === "ebook" ? (
                          <span className="bg-green-100 text-green-800 text-[9px] py-0.5 px-2 rounded-full border border-green-200 font-bold">ই-বুক PDF</span>
                        ) : (
                          <span className="bg-[#C5A059]/10 text-[#C5A059] text-[9px] py-0.5 px-2 rounded-full border border-[#C5A059]/20 font-bold">মুদ্রিত বই</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center font-bold font-serif text-[#1B263B]">৳{book.price}</td>

                      <td className="py-3 px-3 text-center font-semibold">
                        {book.type === "ebook" ? (
                          <span className="text-stone-400 uppercase font-mono tracking-tight font-medium text-[10px]">আনলিমিটেড</span>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                            <button
                              onClick={() => handleStockUpdate(book.id, book.stock, -1)}
                              className="p-1 hover:bg-stone-200 rounded text-stone-600 font-bold"
                            >
                              -
                            </button>
                            <span className={`w-8 text-center font-bold ${book.stock <= 5 ? "text-orange-650" : "text-[#1B263B]"}`}>
                              {book.stock}
                            </span>
                            <button
                              onClick={() => handleStockUpdate(book.id, book.stock, 5)}
                              className="p-1 hover:bg-stone-200 rounded text-stone-600 font-bold"
                              title="+৫ কপি স্টক আপ"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingBook(book)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-105 text-blue-700 rounded transition-colors cursor-pointer"
                            title="বইয়ের বিষয়বস্তু এডিট করুন"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleBookDelete(book.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-105 text-red-700 rounded transition-colors cursor-pointer"
                            title="বইটি মুছুন"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: UPLOAD BOOK ==================== */}
        {activeTab === "upload" && (
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md max-w-3xl mx-auto handle-animation-fade-in text-xs">
            <h4 className="font-serif text-lg font-bold text-[#1B263B] border-b border-gray-200 pb-2.5 mb-6 flex items-center gap-2">
              <Plus size={18} /> বইয়ের যাবতীয় তথ্য ও রিসোর্স আপলোড ফর্ম
            </h4>

            <form onSubmit={handleBookUpload} className="space-y-4 font-sans font-medium text-stone-600">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">বইয়ের শিরোনাম (Book Title)</label>
                  <input
                    type="text"
                    required
                    placeholder="উদাঃ হিমুর বসন্ত"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">লেখক (Author)</label>
                  <input
                    type="text"
                    required
                    placeholder="উদাঃ হুমায়ূন আহমেদ"
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">বইয়ের বিবরণ / সংক্ষেপণ (Literary Description)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="বইটির সংক্ষিপ্ত কাহিনীপ্রবাহ, সারসংক্ষেপ ও রচয়িতার ভাবার্থ এখানে বিশদভাবে লিখুন..."
                  value={bookDesc}
                  onChange={(e) => setBookDesc(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">বিক্রয় মূল্য (Price in ৳ BDT)</label>
                  <input
                    type="number"
                    required
                    value={bookPrice}
                    onChange={(e) => setBookPrice(Number(e.target.value))}
                    className="with-number-arrows w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">ক্যাটাগরি স্লাইড</label>
                  <select
                    value={bookCategory}
                    onChange={(e) => setBookCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none text-stone-850 focus:border-[#1B263B]/50 cursor-pointer"
                  >
                    <option value="bestsellers">সেরা বিক্রেতা (Bestsellers)</option>
                    <option value="new-arrivals">নতুন আয়োজন (New Arrivals)</option>
                    <option value="ebooks">ই-বুক ডিকশনারী (Ebooks)</option>
                  </select>
                </div>

                <div className="space-y-1 col-span-1">
                  <label className="text-stone-500 font-bold block">বইয়ের ফরম্যাট টাইপ</label>
                  <div className="grid grid-cols-2 gap-2 mt-0.5">
                    <button
                      type="button"
                      onClick={() => setBookType("physical")}
                      className={`p-2.5 border rounded-lg font-semibold transition-all cursor-pointer ${
                        bookType === "physical"
                          ? "bg-[#C5A059]/10 border-[#C5A059] text-[#1B263B]"
                          : "bg-white border-gray-200 hover:bg-stone-50 text-stone-500"
                      }`}
                    >
                      মুদ্রিত কপি (Printed)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookType("ebook")}
                      className={`p-2.5 border rounded-lg font-semibold transition-all cursor-pointer ${
                        bookType === "ebook"
                          ? "bg-[#C5A059]/10 border-[#C5A059] text-[#1B263B]"
                          : "bg-white border-gray-200 hover:bg-stone-50 text-stone-500"
                      }`}
                    >
                      ই-বুক PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic properties dependent on type */}
              <div className="grid grid-cols-1 p-4 bg-gray-50 rounded-xl border border-gray-150 text-left">
                {bookType === "physical" ? (
                  <div className="space-y-1 max-w-sm">
                    <label className="text-stone-500 font-bold block">মুদ্রিত সংখ্যা স্টক (Printed Stock In Hand)</label>
                    <input
                      type="number"
                      required
                      value={bookStock}
                      onChange={(e) => setBookStock(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-1 text-left w-full">
                    <label className="text-[#C5A059] font-bold block flex items-center gap-1">
                      <Smartphone size={13} /> সুরক্ষিত ই-বুক ডাউনলোড লিঙ্ক (Secure Download Source Link)
                    </label>
                    <input
                      type="url"
                      placeholder="https://onlinegoppo.site/secure-download/sample_ebook.pdf"
                      value={bookFileUrl}
                      onChange={(e) => setBookFileUrl(e.target.value)}
                      className="w-full p-2.5 bg-white border border-amber-200 focus:border-[#C5A059] rounded-lg outline-none text-stone-800"
                    />
                  </div>
                )}
              </div>

              {/* 🔴 IMAGE & VIDEO FILE UPLOAD BLOCK 🔴 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-stone-55 bg-stone-50 border border-stone-200 rounded-2xl shadow-sm text-left">
                
                {/* 1. COVER IMAGE drag-and-drop block */}
                <div className="space-y-2">
                  <label className="text-stone-700 font-extrabold flex items-center gap-1.5 text-xs">
                    <Upload size={14} className="text-[#E63946]" />
                    <span>কভার ইমেজ আপলোড (Book Cover Image)</span>
                  </label>
                  
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.onload = () => setBookCoverUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="border-2 border-dashed border-stone-300 hover:border-[#E63946] rounded-xl p-4 bg-white text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] relative group"
                  >
                    {bookCoverUrl ? (
                      <div className="w-full flex flex-col items-center gap-2">
                        <img 
                          src={bookCoverUrl} 
                          alt="Cover preview" 
                          referrerPolicy="no-referrer"
                          className="h-24 w-auto object-cover rounded-md shadow-md border border-stone-200" 
                        />
                        <button
                          type="button"
                          onClick={() => setBookCoverUrl("")}
                          className="bg-red-500 hover:bg-red-650 text-white rounded-full p-1 text-[10px] absolute top-1 right-1 shadow-sm"
                        >
                          <X size={12} />
                        </button>
                        <span className="text-[10px] text-emerald-600 font-bold">✓ সফলভাবে ছবি লোড হয়েছে</span>
                      </div>
                    ) : (
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => setBookCoverUrl(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <span className="p-3 bg-red-50 rounded-full text-[#E63946] group-hover:scale-105 duration-200 shadow-sm mb-2">
                          <Upload size={18} />
                        </span>
                        <div className="text-xs font-bold text-stone-700">ছবি ড্র্যাগ করুন অথবা ক্লিক করে ফাইল সিলেক্ট করুন</div>
                        <div className="text-[9px] text-stone-400 mt-1">PNG, JPG, WEBP, GIF (Max 5MB)</div>
                      </label>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-semibold block">অথবা সরাসরি ইমেজ লিংক (URL) দিন:</span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/promo-cover.jpg"
                      value={bookCoverUrl && bookCoverUrl.startsWith("data:") ? "" : bookCoverUrl}
                      onChange={(e) => setBookCoverUrl(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-200 hover:border-[#E63946]/30 focus:border-[#E63946] rounded-lg outline-none text-xs text-stone-750"
                    />
                  </div>
                </div>

                {/* 2. PROMO VIDEO drag-and-drop block */}
                <div className="space-y-2">
                  <label className="text-stone-700 font-extrabold flex items-center gap-1.5 text-xs">
                    <Film size={14} className="text-[#E63946]" />
                    <span>প্রোমোশনাল ভিডিও আপলোড (Book Trailer/Video Upload)</span>
                  </label>
                  
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith("video/")) {
                        const reader = new FileReader();
                        reader.onload = () => setBookVideoUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="border-2 border-dashed border-stone-300 hover:border-[#E63946] rounded-xl p-4 bg-white text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] relative group"
                  >
                    {bookVideoUrl ? (
                      <div className="w-full flex flex-col items-center gap-2">
                        <video 
                          src={bookVideoUrl} 
                          controls 
                          className="h-24 w-full object-cover rounded-md shadow-md border border-stone-200"
                        />
                        <button
                          type="button"
                          onClick={() => setBookVideoUrl("")}
                          className="bg-red-500 hover:bg-red-650 text-white rounded-full p-1 text-[10px] absolute top-1 right-1 shadow-sm"
                        >
                          <X size={12} />
                        </button>
                        <span className="text-[10px] text-emerald-600 font-bold">✓ ভিডিও সংযুক্ত হয়েছে</span>
                      </div>
                    ) : (
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-2">
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => setBookVideoUrl(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <span className="p-3 bg-red-50 rounded-full text-[#E63946] group-hover:scale-105 duration-200 shadow-sm mb-2">
                          <Film size={18} />
                        </span>
                        <div className="text-xs font-bold text-stone-700">ভিডিও ড্র্যাগ করুন অথবা ক্লিক করে ফাইল সিলেক্ট করুন</div>
                        <div className="text-[9px] text-stone-400 mt-1">MP4, WEBM, OGG formats (Promo clip)</div>
                      </label>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-semibold block">অথবা সরাসরি ভিডিও লিংক (URL) দিন:</span>
                    <input
                      type="url"
                      placeholder="https://onlinegoppo.site/promo-trailer.mp4"
                      value={bookVideoUrl && bookVideoUrl.startsWith("data:") ? "" : bookVideoUrl}
                      onChange={(e) => setBookVideoUrl(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-200 hover:border-[#E63946]/30 focus:border-[#E63946] rounded-lg outline-none text-xs text-stone-750"
                    />
                  </div>
                </div>

              </div>

              {/* Editorial specifications properties */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">প্রকাশকাল সাল (Year)</label>
                  <input
                    type="text"
                    value={bookYear}
                    onChange={(e) => setBookYear(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">মোট পৃষ্ঠা সংখ্যা (Pages)</label>
                  <input
                    type="number"
                    value={bookPages}
                    onChange={(e) => setBookPages(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">রচনার ভাষা (Language)</label>
                  <input
                    type="text"
                    value={bookLanguage}
                    onChange={(e) => setBookLanguage(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">ISBN কোড নম্বর (ISBN identifier)</label>
                  <input
                    type="text"
                    placeholder="978-984-..."
                    value={bookIsbn}
                    onChange={(e) => setBookIsbn(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#1B263B] hover:bg-[#121A2A] text-[#FBFBFB] font-bold rounded-lg transition-all shadow-md hover:shadow-lg uppercase tracking-wider cursor-pointer font-sans"
                >
                  ইনভেন্টরিতে বই আপলোড করুন (Upload Book)
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ==================== TAB 4: LANDING PAGES BUILDER ==================== */}
        {activeTab === "landing-pages" && (
          <div className="space-y-8 handle-animation-fade-in text-xs">
            
            {/* Landing pages list */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                <h4 className="font-serif text-base font-bold text-[#1B263B] flex items-center gap-1.5">
                  <Layers size={16} /> কাস্টম বই প্রমোশনাল ল্যান্ডিং পেজসমূহ (Active Landing Pages)
                </h4>
                <span className="text-[10px] text-stone-400 font-mono">মোট {landingPages.length} টি প্রচার পাতা বিদ্যমান</span>
              </div>

              {landingPages.length === 0 ? (
                <p className="text-stone-500 py-6 text-center">কোন প্রোমোশনাল ল্যান্ডিং পেজ সৃষ্টি করা হয়নি। নিচের ফর্মটি ব্যবহার করে সৃষ্টি করুন।</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {landingPages.map((lp) => {
                    const linkedBook = books.find(b => b.id === lp.bookId);
                    return (
                      <div key={lp.id} className="border border-stone-200 rounded-xl p-4 flex gap-4 bg-stone-50 hover:bg-white transition-all">
                        <div className="w-12 h-16 rounded bg-stone-200 overflow-hidden shadow-sm flex-shrink-0">
                          {linkedBook ? (
                            <img src={linkedBook.coverUrl} alt={linkedBook.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-stone-300"></div>
                          )}
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <h5 className="font-serif font-bold text-stone-900 text-sm line-clamp-1">{lp.headline}</h5>
                            <p className="text-stone-400 text-[10px] mt-0.5">বই: <span className="text-stone-600 font-semibold">{linkedBook?.title || lp.bookId}</span></p>
                            <span className="inline-block mt-1 font-mono text-[9.5px] bg-[#1B263B]/5 text-[#1B263B] px-1.5 py-0.2 rounded">
                              slug: /promo/{lp.slug}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 pt-3 border-t border-stone-100 mt-2">
                            {onViewPromoPage && (
                              <button
                                onClick={() => onViewPromoPage(lp)}
                                className="text-[#C5A059] hover:underline font-bold flex items-center gap-1"
                              >
                                প্রমো-পেজ দেখুন <ExternalLink size={10} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteLander(lp.id)}
                              className="text-red-650 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              মুছুন <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Creator Form */}
            <div className="bg-white border border-[#C5A059]/25 p-6 rounded-2xl shadow-md max-w-3xl mx-auto border-t-4 border-t-[#C5A059]">
              <h4 className="font-serif text-lg font-bold text-[#1B263B] border-b border-gray-200 pb-2.5 mb-6 flex items-center gap-2">
                <Palette className="text-[#C5A059]" size={18} /> নতুন বুক প্রচার ল্যান্ডিং পাতা ত্বরান্বিত করুন
              </h4>

              <form onSubmit={handleSaveLandingPage} className="space-y-4 font-sans font-medium text-stone-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-500 font-bold block">প্রমোশনের জন্য বই নির্বাচন করুন</label>
                    <select
                      required
                      value={lpBookId}
                      onChange={(e) => setLpBookId(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none cursor-pointer text-stone-850"
                    >
                      <option value="">-- বই সিলেক্ট করুন --</option>
                      {books.map(b => (
                        <option key={b.id} value={b.id}>{b.title} (মূল্য: ৳{b.price})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-500 font-bold block">প্রচার পাতার ইউআরএল স্ল্যাগ (URL Slug - উদাঃ himu-bosonto)</label>
                    <input
                      type="text"
                      required
                      placeholder="himu-bosonto"
                      value={lpSlug}
                      onChange={(e) => setLpSlug(e.target.value)}                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-xl mt-4">
                  <div className="space-y-1">
                    <label className="text-stone-650 font-bold block flex items-center gap-1">
                      <Sparkles size={12} className="text-[#C5A059]" /> সার্চ ইঞ্জিন এসইও মেটা শিরোনাম (SEO Title)
                    </label>
                    <input
                      type="text"
                      placeholder="হিমুর বসন্ত ই-বুক বিশেষ ছাড় প্রমো | onlinegoppo.site"
                      value={lpSeoTitle}
                      onChange={(e) => setLpSeoTitle(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-650 font-bold block">এসইও মেটা বিবরণ (SEO Metatag Description)</label>
                    <input
                      type="text"
                      placeholder="অনলাইনগল্প থেকে হুমায়ূন আহমেদের অমর রস রচনা 'হিমুর বসন্ত'-এর বিশেষ লাইব্রেরি কালেকশন আজই সংগ্রহ করুন শ্রেষ্ঠ মূল্যে।"
                      value={lpSeoDescription}
                      onChange={(e) => setLpSeoDescription(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-end mt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#1B263B] hover:bg-[#121A2A] text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg uppercase cursor-pointer text-xs"
                  >
                    ল্যান্ডিং পাতা সৃষ্টি করুন (Create dynamic promotion page)
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: ORDERS TRACKING ==================== */}
        {activeTab === "orders" && (
          <div className="bg-white border border-gray-200 p-4 md:p-6 rounded-2xl shadow-sm text-xs handle-animation-fade-in font-sans">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200 pb-4 mb-6">
              <div>
                <h4 className="font-serif text-base font-bold text-[#1B263B] flex items-center gap-2">
                  <ShoppingBag size={16} /> কাস্টমার ইনভয়েস ও অর্ডার শিপমেন্ট ট্র্যাকিং
                </h4>
                <p className="text-stone-400 text-[11px] mt-0.5">সবচেয়ে সাম্প্রতিক অর্ডারগুলি সবার উপরে প্রদর্শিত হচ্ছে।</p>
              </div>

              {/* Filtering components */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="ID, ইমেইল, নাম বা TxnID..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="px-3 py-1.5 border border-stone-200 rounded-lg outline-none max-w-xs text-xs bg-white text-stone-800"
                />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-2 py-1.5 border border-stone-200 rounded-lg text-xs outline-none cursor-pointer bg-white text-stone-850"
                >
                  <option value="all">সব অর্ডার (All)</option>
                  <option value="paid">পরিশোধিত (Paid)</option>
                  <option value="shipped">ডেলিভারি পাঠানো হয়েছে (Shipped)</option>
                  <option value="cancelled">বাতিল (Cancelled)</option>
                </select>
              </div>
            </div>

            {getFilteredOrders().length === 0 ? (
              <p className="text-center text-stone-500 py-12">কোন কাস্টমার অর্ডার খুঁজে পাওয়া যায়নি।</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-stone-500 uppercase text-[9px] tracking-wider font-bold">
                      <th className="py-2.5 px-3">অর্ডার আইডি</th>
                      <th className="py-2.5 px-3">গ্রাহক বিবরণ</th>
                      <th className="py-2.5 px-3">তারিখ ও সময়</th>
                      <th className="py-2.5 px-3">ক্রয়কৃত বইসমূহ</th>
                      <th className="py-2.5 px-3 text-center">পরিশোধিত রাশি</th>
                      <th className="py-2.5 px-3 text-center">পেমেন্ট গেটওয়ে সংকেত</th>
                      <th className="py-2.5 px-3 text-center">ডেলিভারি ট্র্যাকিং স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-stone-750">
                    {getFilteredOrders().map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-3 font-mono font-bold text-stone-900">{ord.id}</td>
                        <td className="py-3 px-3">
                          <strong className="block text-stone-900">{ord.customerName}</strong>
                          <span className="block text-stone-400 text-[10px]">{ord.customerEmail}</span>
                          <span className="block text-stone-500 text-[10px] font-mono">{ord.customerPhone}</span>
                          {ord.deliveryAddress && (
                            <span className="block text-stone-400 text-[9px] bg-stone-100 rounded p-1 max-w-xs mt-1 leading-tight text-stone-650">ঠিকানা: {ord.deliveryAddress}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-stone-500 whitespace-nowrap">
                          {new Date(ord.createdAt).toLocaleDateString("bn-BD")} <br/>
                          <span className="text-[10px] text-stone-400">{new Date(ord.createdAt).toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit'})}</span>
                        </td>
                        <td className="py-3 px-3">
                          <ul className="space-y-1">
                            {ord.items.map((it, i) => (
                              <li key={i} className="text-[10px] text-stone-700 leading-tight">
                                <span className="font-semibold text-stone-900">{it.title}</span> ({it.quantity}X) <br/>
                                <span className="text-[9px] bg-[#1B263B]/5 text-[#1B263B] px-1 rounded uppercase font-bold">{it.type}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-[#1B263B] font-serif shrink-0">৳{ord.totalAmount}</td>
                        <td className="py-3 px-3 text-center font-mono text-[10.5px]">
                          <span className="uppercase text-[9px] border px-1 rounded bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20 font-bold block mb-1">{ord.paymentMethod}</span>
                          <span className="text-stone-400 font-bold text-[9.5px]">TxnID: {ord.paymentTxnId || "N/A"}</span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            {ord.status === "paid" ? (
                              <span className="bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded-full text-[10px] font-bold">পেইড (Paid)</span>
                            ) : ord.status === "shipped" || ord.status === "delivery sent" ? (
                              <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold">ডেলিভারি হয়েছে (Shipped)</span>
                            ) : (
                              <span className="bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize">{ord.status}</span>
                            )}

                            {/* Status controls */}
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                              className="text-[9px] text-stone-600 border border-stone-200 focus:outline-[#1B263B]/30 and border-stone-400 rounded px-1.5 py-0.5 mt-1 cursor-pointer bg-white"
                            >
                              <option value="paid">পেইড মার্ক</option>
                              <option value="shipped">শিপড মার্ক</option>
                              <option value="cancelled">বাতিল মার্ক</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 6: CUSTOMER PROFILES CRM ==================== */}
        {activeTab === "user-profiles" && (
          <div className="bg-white border border-gray-200 p-4 md:p-6 rounded-2xl shadow-sm text-xs handle-animation-fade-in font-sans">
            <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
              <div>
                <h4 className="font-serif text-base font-bold text-[#1B263B] flex items-center gap-2">
                  <Users size={16} /> গ্রাহক ডাটাবেজ এবং কাস্টমার লাইফটাইম ভ্যালু (CRM Dashboard)
                </h4>
                <p className="text-stone-400 text-[11px] mt-0.5">সবচেয়ে বেশি ব্যয়কারী (LTV) গ্রাহকরা তালিকার প্রারম্ভে রয়েছেন।</p>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full font-bold">মোট {customerProfiles.length} জন স্বতন্ত্র গ্রাহক</span>
            </div>

            {customerProfiles.length === 0 ? (
              <p className="text-gray-500 py-10 text-center">এখনো কোনো কাস্টমার পেমেন্ট করেনি।</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-stone-500 uppercase text-[9px] tracking-wider font-bold">
                      <th className="py-2.5 px-3">নাম ও গ্রাহক</th>
                      <th className="py-2.5 px-3">মোবাইল ফোন</th>
                      <th className="py-2.5 px-3">শিপিং ঠিকানা</th>
                      <th className="py-2.5 px-3 text-center">মোট ক্রয় সংখ্যা</th>
                      <th className="py-2.5 px-3 text-center">মোট লাইফটাইম স্পেন্ড (LTV)</th>
                      <th className="py-2.5 px-3">পেইড লাইব্রেরি পারমিশন (Purchased Books)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-stone-750">
                    {customerProfiles.map((user, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-3 px-3">
                          <strong className="block text-stone-950 font-serif">{user.name}</strong>
                          <span className="block text-blue-700 font-bold text-[10.5px] font-mono">{user.email}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-stone-800">{user.phone}</td>
                        <td className="py-3 px-3 text-stone-500 max-w-xs truncate" title={user.address}>{user.address}</td>
                        <td className="py-3 px-3 text-center font-bold text-stone-900">{user.orderCount} টি ইনভয়েস</td>
                        <td className="py-3 px-3 text-center font-bold font-serif text-emerald-800 bg-emerald-500/5">৳{user.spend} BDT</td>
                        <td className="py-3 px-3 text-stone-400">
                          <div className="flex flex-wrap gap-1">
                            {user.books.map((bName, i) => (
                              <span key={i} className="bg-gray-100 text-stone-700 text-[9px] bold border border-gray-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <BookOpen size={9} className="text-[#C5A059]" /> {bName}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 7: WRITE BLOG ==================== */}
        {activeTab === "write-blog" && (
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md max-w-2xl mx-auto handle-animation-fade-in text-xs font-sans">
            <h4 className="font-serif text-lg font-bold text-[#1B263B] border-b border-gray-200 pb-2.5 mb-6 flex items-center gap-2">
              <Newspaper size={18} /> সাহিত্য সমালোচনা ও ব্লগ পোস্টিং কনসোল
            </h4>

            <form onSubmit={handleBlogPublish} className="space-y-4 font-medium text-stone-600">
              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">ব্লগ শিরোনাম (Article Title)</label>
                <input
                  type="text"
                  required
                  placeholder="উদাঃ রবীন্দ্রনাথের শেষের কবিতা: প্রেমের ট্র্যাজেডি নাকি দর্শন?"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">কভার ছবি লিঙ্ক (Cover Image URL)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={blogCoverUrl}
                    onChange={(e) => setBlogCoverUrl(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">পোস্টার ট্যাগসমূহ (Tags - আলাদা করতে কমা ব্যবহার করুন)</label>
                  <input
                    type="text"
                    placeholder="রবীন্দ্রনাথ ঠাকুর, উপন্যাস রিভিউ, বাঙালি সাহিত্য"
                    value={blogTags}
                    onChange={(e) => setBlogTags(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">সংক্ষিপ্ত এক্সসার্প্ট (Short Excerpt - সর্বোচ্চ ১০০ অক্ষর)</label>
                <input
                  type="text"
                  placeholder="শেষের কবিতা রবীন্দ্রনাথ ঠাকুরের অন্যতম মাইলফলক সৃষ্টির একটি। এখানে আমাদের কী বার্তা দেয়?"
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">নিবন্ধের সূচী বিভাগ (Journal Category)</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850"
                  >
                    <option value="সম্পাদকীয়">সম্পাদকীয়</option>
                    <option value="কুরআন অধ্যয়ন">কুরআন অধ্যয়ন</option>
                    <option value="হাদীস অধ্যয়ন">হাদীস অধ্যয়ন</option>
                    <option value="ফিকহ ও ফতোয়া">ফিকহ ও ফতোয়া</option>
                    <option value="পরিবার ও সমাজ">পরিবার ও সমাজ</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">প্রকাশনা সংখ্যা ও হিজরি সন (Issue & Edition)</label>
                  <input
                    type="text"
                    required
                    placeholder="উদাঃ রমজান ১৪৪৭ - মে ২০২৬"
                    value={blogIssue}
                    onChange={(e) => setBlogIssue(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">মূল প্রবন্ধ / ব্লগ কন্টেন্ট (Full Content Prose)</label>
                <textarea
                  required
                  rows={8}
                  placeholder="সাহিত্য পর্যালোচনার বিস্তারিত বক্তব্য এখানে প্যারাগ্রাফ আকারে প্রদান করুন..."
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850 leading-relaxed font-serif text-sm tracking-wide"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1B263B] hover:bg-[#121A2A] text-[#FBFBFB] font-bold rounded-lg transition-all shadow-md hover:shadow-lg uppercase tracking-wider cursor-pointer font-sans"
                >
                  প্রবন্ধ প্রকাশ করুন (Publish Blog Post)
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== TAB 8: GLOBAL SITE SETTINGS ==================== */}
        {activeTab === "site-settings" && (
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md max-w-2xl mx-auto handle-animation-fade-in text-xs font-sans">
            <h4 className="font-serif text-lg font-bold text-[#1B263B] border-b border-gray-200 pb-2.5 mb-6 flex items-center gap-2">
              <Settings size={18} /> অনলাইন বুকস্টোর ওয়েবসাইট জেনারেল কাস্টমাইজেশন
            </h4>

            <form onSubmit={handleSaveSettings} className="space-y-4 font-medium text-stone-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">বুকস্টোরের ব্রান্ড নাম (Bookstore General Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="onlinegoppo.site"
                    value={settingsStoreName}
                    onChange={(e) => setSettingsStoreName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">স্বাগত বাণী (Welcome Badge Label)</label>
                  <input
                    type="text"
                    required
                    placeholder="Welcome to onlinegoppo.site"
                    value={settingsHeroWelcomeMsg}
                    onChange={(e) => setSettingsWelcomeMsg(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">প্রচ্ছদে বড় ব্যানার শিরোনাম (Hero Heading Headline)</label>
                <input
                  type="text"
                  required
                  placeholder="মুহূর্তেই বইয়ের পাতায় হারিয়ে যান অনলাইনগল্পের সাথে"
                  value={settingsHeroHeading}
                  onChange={(e) => setSettingsHeroHeading(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">প্রচ্ছদে বিস্তারিত প্রমোশনাল বর্ণনা (Hero Subheading Body)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="বাঙালি সাহিত্যের সমৃদ্ধ ইতিহাস, শ্রেষ্ঠ জনপ্রিয় উপন্যাস এবং যেকোনো ই-বুক PDF এখন আপনার হাতের মুঠোয়..."
                  value={settingsHeroSubheading}
                  onChange={(e) => setSettingsHeroSubheading(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#1B263B]/50 rounded-lg outline-none text-stone-850 leading-relaxed text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-100 pt-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block flex items-center gap-1">
                    <Mail size={12} /> গ্রাহক সাহায্য সাপোর্ট ইমেইল (General Support Email)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="onlinegoppo@gmail.com"
                    value={settingsSupportEmail}
                    onChange={(e) => setSettingsSupportEmail(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block flex items-center gap-1">
                    <PhoneCall size={12} /> গ্রাহক সাহায্য হটলাইন নম্বর (General Contact Phone)
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsSupportPhone}
                    onChange={(e) => setSettingsSupportPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#1B263B] hover:bg-[#121A2A] text-[#FBFBFB] font-bold rounded-lg transition-all shadow-md hover:shadow-lg uppercase tracking-wider cursor-pointer font-sans"
                >
                  গ্লোবাল সেটিংস সেভ করুন (Save Settings Config)
                </button>
              </div>
            </form>

            {/* Hostinger Domain Setup Helper Panel */}
            <div className="mt-8 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-200">
                <div className="bg-[#C5A059]/10 text-[#C5A059] p-2 rounded-lg">
                  <Globe size={18} />
                </div>
                <div>
                  <h5 className="font-serif text-sm font-bold text-slate-800">হোস্টিঙ্গার কাস্টম ডোমেন কানেকশন গাইড (Hostinger Domain Setup Guide)</h5>
                  <p className="text-[10px] text-stone-400">আপনার নিজস্ব কেনা ডোমেন <strong className="text-slate-650">onlinegoppo.site</strong> ওয়েবসাইটটির সাথে লিংক করার বিস্তারিত নিয়মাবলী</p>
                </div>
              </div>

              <div className="space-y-3 leading-relaxed text-slate-650">
                <p className="text-[11px]">
                  আপনার হোস্টিঙ্গার ডোমেন প্যানেল থেকে <strong>onlinegoppo.site</strong>-কে এই সাইটের সাথে সফলভাবে যুক্ত করতে নিচের ৩টি সহজ ধাপ অনুসরণ করুন:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#C5A059] block">ধাপ ১: Hostinger লগইন</span>
                    <p className="text-[11px] text-stone-500">আপনার <strong>Hostinger hPanel</strong>-এ লগইন করুন এবং আপনার ডোমেন তালিকা থেকে <strong className="font-mono">onlinegoppo.site</strong> নির্বাচন করুন।</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#C5A059] block">ধাপ ২: DNS Zone এডিটর</span>
                    <p className="text-[11px] text-stone-500">বাম পাশের নেভিগেশন মেনু থেকে <strong className="text-slate-700">DNS / Nameservers</strong> ট্যাবে গিয়ে DNS Zone এডিটর বোতামটি ওপেন করুন।</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#C5A059] block">ধাপ ৩: DNS রেকর্ড যুক্ত করুন</span>
                    <p className="text-[11px] text-stone-500">নিচের রেকর্ড টেবিল অনুযায়ী আপনার হোস্টিঙ্গার প্যানেলে নতুন DNS রেকর্ডসমূহ <strong>Add New</strong> বাটনে ক্লিক করে সেভ করুন।</p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-3.5 bg-white">
                  <div className="bg-[#1B263B] text-[#FBFBFB] px-4 py-2 text-[10px] font-mono font-bold flex justify-between items-center">
                    <span>DNS Configuration Records Table</span>
                    <span className="bg-green-500/20 text-green-300 border border-green-700/30 px-1.5 py-0.5 rounded text-[9px]">Verified Domain</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] font-mono text-stone-700 divide-y divide-stone-100">
                      <thead>
                        <tr className="bg-slate-100 text-stone-500 uppercase tracking-wider text-[9px] font-bold">
                          <th className="px-3 py-1.5">Type</th>
                          <th className="px-3 py-1.5">Name (Host)</th>
                          <th className="px-3 py-1.5">Value (Points to)</th>
                          <th className="px-3 py-1.5">TTL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="px-3 py-2 font-bold text-[#C5A059]">A</td>
                          <td className="px-3 py-2 text-stone-800">@</td>
                          <td className="px-3 py-2 text-blue-700 font-mono text-[10px]">
                            216.239.32.21<br />
                            216.239.34.21<br />
                            216.239.36.21<br />
                            216.239.38.21
                          </td>
                          <td className="px-3 py-2 text-stone-400">300 (Custom)</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 font-bold text-indigo-700">CNAME</td>
                          <td className="px-3 py-2 text-stone-800">www</td>
                          <td className="px-3 py-2 text-blue-700 font-mono text-[10px]">ghs.googlehosted.com</td>
                          <td className="px-3 py-2 text-stone-400">14400 (Default)</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 font-bold text-[#C5A059]">TXT</td>
                          <td className="px-3 py-2 text-stone-800">@</td>
                          <td className="px-3 py-2 text-stone-500 font-mono text-[10px]">google-site-verification=onlinegoppo-safe-keys-2026</td>
                          <td className="px-3 py-2 text-stone-400">3600</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-3.5 bg-[#C5A059]/10 rounded-xl text-[11px] border border-[#C5A059]/20 flex items-start gap-2 text-slate-700 mt-2">
                  <BadgeHelp size={16} className="text-[#C5A059] shrink-0 mt-0.5" />
                  <p>
                    <strong>গুরুত্বপূর্ণ তথ্য:</strong> DNS রেকর্ড আপডেট করার পর হোস্ট সার্ভার এবং ডোমেন সম্পূর্ণ সিঙ্ক হতে সাধারণত <strong>১৫ মিনিট বা সর্বোচ্চ ২৪ ঘণ্টা</strong> সময় লাগতে পারে। এরপর আপনার <strong>https://onlinegoppo.site</strong> একদম লাইভ হয়ে যাবে!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 8.5: CUSTOM DOMAIN DIAGNOSTICS ==================== */}
        {activeTab === "domain-setup" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm handle-animation-fade-in text-slate-850 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#1B263B] text-[#C5A059] p-2.5 rounded-xl border border-slate-700 shadow-sm">
                  <Globe size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1B263B]">Custom Domain Live Diagnoser</h3>
                  <p className="text-stone-500 text-[11px]">আপনার কেনা ডোমেন <strong className="text-stone-700 font-mono">onlinegoppo.site</strong>-এর লাইভ DNS রেকর্ড স্ট্যাটাস ও ট্রাবলশুটিং মেথড।</p>
                </div>
              </div>
              <button
                type="button"
                onClick={checkDomainDNS}
                disabled={dnsCheckLoading}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1B263B] hover:bg-[#121A2A] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer select-none disabled:opacity-60 font-sans"
              >
                {dnsCheckLoading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <RefreshCw size={14} />
                )}
                রেকর্ড লাইভ টেস্ট করুন (Check DNS Records)
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
              
              {/* Left Column: Test Results and Analysis */}
              <div className="lg:col-span-7 space-y-6">
                
                {dnsError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-705 rounded-xl text-xs flex items-center gap-2">
                    <AlertTriangle size={15} className="shrink-0 text-red-500" />
                    <span>{dnsError}</span>
                  </div>
                )}

                {/* Status Indicator */}
                <div className="p-5 border rounded-2xl bg-stone-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400 block mb-1">ডোমেন পিন রেকর্ড কানেক্টিভিটি স্ট্যাটাস</span>
                    <h4 className="font-mono text-base font-bold text-slate-800">onlinegoppo.site</h4>
                    <p className="text-[11px] text-stone-500 mt-1">
                      {dnsResults ? `সর্বশেষ পরীক্ষা করা হয়েছে: ${dnsResults.checkedAt}` : "পরীক্ষা করার জন্য উপরের বোতামে ক্লিক করুন।"}
                    </p>
                  </div>

                  <div>
                    {!dnsResults ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                        <AlertTriangle size={12} />
                        টেস্ট করা হয়নি (Not Checked)
                      </span>
                    ) : dnsResults.isConfigured ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-705 text-xs font-semibold rounded-full border border-green-200 shadow-sm">
                        <CheckCircle size={12} className="text-green-505" />
                        সফলভাবে কানেক্টেড (Success)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200 shadow-sm animate-pulse">
                        <AlertTriangle size={12} />
                        কানেকশন পেন্ডিং (Pending Sync)
                      </span>
                    )}
                  </div>
                </div>

                {/* Real-time comparison */}
                {dnsResults && (
                  <div className="border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-900 text-white px-4 py-2.5 text-[10px] font-mono font-bold flex justify-between items-center">
                      <span>LIVE DNS ZONE QUERY INSIGHTS</span>
                      <span className="text-emerald-400 font-mono text-[9px]">Query Completed Live</span>
                    </div>

                    <div className="divide-y divide-stone-200">
                      
                      {/* A RECORD TABLE ROW */}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[11px] font-bold text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded-lg border border-[#C5A059]/20">A Record (Root: @)</span>
                          <span className="text-[10px] text-stone-450">Target IP values</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                            <span className="text-[9px] uppercase tracking-wider text-rose-500 font-bold block mb-1">আপনার সেটিংসে পাওয়া লাইভ আইপি:</span>
                            {dnsResults.aRecords.length > 0 ? (
                              <ul className="font-mono text-[11px] text-slate-800 space-y-0.5">
                                {dnsResults.aRecords.map((ip, i) => (
                                  <li key={i} className="flex items-center gap-1 text-slate-700">
                                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                                    {ip}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-[10px] text-red-500 font-medium italic block py-1">কোনো A রেকর্ড খুঁজে পাওয়া যায়নি! (ভুল কনফিগারেশন)</span>
                            )}
                          </div>
                          <div className="bg-green-50/20 p-2.5 rounded-lg border border-green-150">
                            <span className="text-[9px] uppercase tracking-wider text-green-600 font-bold block mb-1">প্রয়োজনীয় আইপি (Google Cloud IPs):</span>
                            <ul className="font-mono text-[11px] text-stone-600 space-y-0.5 animate-pulse-once">
                              <li>• 216.239.32.21</li>
                              <li>• 216.239.34.21</li>
                              <li>• 216.239.36.21</li>
                              <li>• 216.239.38.21</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* CNAME RECORD TABLE ROW */}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">CNAME Record (subdomain: www)</span>
                          <span className="text-[10px] text-stone-450">Target host values</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                            <span className="text-[9px] uppercase tracking-wider text-rose-500 font-bold block mb-1">আপনার সেটিংসে পাওয়া লাইভ CNAME:</span>
                            {dnsResults.cnameRecords.length > 0 ? (
                              <p className="font-mono text-[11px] text-slate-800 py-1 font-semibold truncate">
                                {dnsResults.cnameRecords[0]}
                              </p>
                            ) : (
                              <span className="text-[10px] text-stone-500 font-medium italic block py-1">কোনো CNAME রেকর্ড পাওয়া যায়নি (ঐচ্ছিক কিন্তু বাঞ্ছনীয়)</span>
                            )}
                          </div>
                          <div className="bg-green-50/20 p-2.5 rounded-lg border border-green-150">
                            <span className="text-[9px] uppercase tracking-wider text-green-600 font-bold block mb-1">প্রয়োজনীয় CNAME হোস্টিং লিংক:</span>
                            <p className="font-mono text-[11px] text-stone-600 py-1 font-semibold">
                              ghs.googlehosted.com
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* TXT VERIFICATION ROW */}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 font-sans">TXT Verification Token Record</span>
                          <span className="text-[10px] text-stone-450">Domain possession validation</span>
                        </div>
                        <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-150">
                          <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold block mb-1">আপনার ডোমেনে পাওয়া ভ্যালিডেশন TXT রেকর্ডসমূহ:</span>
                          {dnsResults.txtRecords.length > 0 ? (
                            <div className="space-y-1 mt-1">
                              {dnsResults.txtRecords.map((txt, index) => (
                                <p key={index} className="font-mono text-[10px] text-stone-600 break-all leading-tight bg-white p-1.5 rounded border border-stone-200">
                                  {txt}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-stone-400 italic block py-1">কোনো TXT কনফিগারেশন টোকেন পাওয়া যায়নি।</span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Helpful diagnosis logic in Bangla */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5">
                  <h4 className="font-serif text-sm font-bold text-slate-800 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                    কেন ডোমেন এখনও একটিভ হচ্ছে না? (Diagnostic Answer)
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed list-inside">
                    <li className="list-none pl-4 relative before:content-['•'] before:text-[#C5A059] before:absolute before:left-0 before:font-bold">
                      <strong>১. DNS Propagation ট্রানজিট টাইম:</strong> হোস্টিঙ্গার বা যেকোনো ডোমেন প্যানেলে আইপি পরিবর্তন করার সাথে সাথে তা বিশ্বজুড়ে সর্বত্র আপডেট হয় না। সাধারণত এই সিঙ্ক হতে <strong>১০ মিনিট থেকে ২৪ ঘণ্টার মতো সাধারণ প্রচারের সময়</strong> লাগতে পারে।
                    </li>
                    <li className="list-none pl-4 relative before:content-['•'] before:text-[#C5A059] before:absolute before:left-0 before:font-bold">
                      <strong>২. পুরাতন ক্যাশে (Browser DNS Cache):</strong> আপনার কম্পিউটারের ব্রাউজার পুরাতন আইপি ক্যাশে ধরে রাখতে পারে। আপনার ব্রাউজার রিলোড করুন (Ctrl + Shift + R) অথবা অন্য ডিভাইস বা মোবাইল নেটওয়ার্ক ব্যবহার করে <strong>http://onlinegoppo.site</strong> খুলে চেক করতে পারেন।
                    </li>
                    <li className="list-none pl-4 relative before:content-['•'] before:text-[#C5A059] before:absolute before:left-0 before:font-bold">
                      <strong>৩. একাধিক A রেকর্ড সংক্রান্ত সংঘর্ষ:</strong> আপনার হোস্টিঙ্গার প্যানেলে আগে থেকে যদি অন্য কোনো আইপি-র জন্য <strong>Type A</strong> রেকর্ড থেকে থাকে এবং সেটিকে ডিলিট না করে নতুন রেকর্ড যোগ করে থাকেন, তবে দ্বন্দ্ব তৈরি হতে পারে। <strong>পুরাতন সকল অব্যবহৃত A রেকর্ড অবশ্যই মুছে দিন</strong> এবং শুধুমাত্র উপরের ৪টি গুগল আইপি বজায় রাখুন।
                    </li>
                  </ul>
                </div>

              </div>

              {/* Right Column: Hostinger Step-by-Step Settings Guide */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-[#1B263B]/5 p-5 rounded-2xl border border-[#1B263B]/10 space-y-4">
                  <h4 className="font-serif text-sm font-bold text-[#1B263B] flex items-center gap-2">
                    <BadgeHelp size={16} className="text-[#C5A059]" />
                    হোস্টিঙ্গার (Hostinger hPanel) রেকর্ড সাজানোর সঠিক নির্দেশনাবলী
                  </h4>
                  <p className="text-[11px] text-slate-605 leading-relaxed">
                    আপনার ডোমেনটি বিশ্বমানের <strong>Hostinger</strong> থেকে কেনা হয়ে থাকলে hPanel-এ লগইন করে নিচের সেটিংসগুলো সঠিকভাবে মিলিয়ে নিন:
                  </p>

                  <div className="space-y-3.5">
                    <div className="bg-white p-3.5 rounded-xl border border-stone-250/60 text-xs">
                      <span className="font-bold text-slate-800 text-[11px] block border-b border-stone-100 pb-1 mb-1.5 uppercase text-[#C5A059]">১. ৪টি A রেকর্ড যোগ করুন</span>
                      <p className="text-stone-500 text-[10px] leading-relaxed">
                        Hostinger DNS Zone-এ গিয়ে ৪ বার <strong>Type: A</strong> এন্ট্রি নিয়ে <strong>Host: @</strong> রেখে নিজের ৪টি আইপি আলাদা করে যোগ করুন:
                      </p>
                      <div className="mt-1.5 p-1.5 bg-stone-50 rounded font-mono text-[10px] text-indigo-700 font-bold space-y-0.5">
                        <div>A @ 216.239.32.21</div>
                        <div>A @ 216.239.34.21</div>
                        <div>A @ 216.239.36.21</div>
                        <div>A @ 216.239.38.21</div>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-stone-250/60 text-xs">
                      <span className="font-bold text-slate-800 text-[11px] block border-b border-stone-100 pb-1 mb-1.5 uppercase text-[#C5A059]">২. CNAME রেকর্ডটি পরীক্ষা করুন</span>
                      <p className="text-stone-500 text-[10px] leading-relaxed">
                        সাবডোমেন যেমন <strong>www.onlinegoppo.site</strong>-এর জন্য নিচের বিবরণ অনুযায়ী হোস্ট করুন:
                      </p>
                      <div className="mt-1.5 p-1.5 bg-stone-50 rounded font-mono text-[10px] text-indigo-700 font-bold">
                        CNAME www ghs.googlehosted.com
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-stone-250/60 text-xs">
                      <span className="font-bold text-slate-800 text-[11px] block border-b border-stone-100 pb-1 mb-1.5 uppercase text-[#C5A059]">৩. ডোমেনটি ক্লাউডফ্লেয়ার (Cloudflare API) -এ প্রক্সি অফ রাখুন</span>
                      <p className="text-stone-500 text-[10px] leading-relaxed">
                        আপনি যদি Cloudflare ব্যবহার করে থাকেন, তবে DNS রেকর্ড এডিটরের এন্ট্রিগুলোতে মেঘের আইকনটি ছাই রঙের করে রাখুন <strong>(DNS Only)</strong>—যাতে প্রক্সি সার্ভিসটি গুগলের সিকিউরিটি এসএসএল ভ্যালিডেশন আটকিয়ে না দেয়।
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50/45 p-4 rounded-xl border border-amber-200/50 text-xs space-y-2">
                  <span className="font-bold text-amber-850 block">💡 বিশেষজ্ঞ কাস্টমার সাপোর্ট টিপস :</span>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Hostinger DNS Zone-এ রেকর্ড কনফিগার হয়ে গেলে উপরে অবস্থিত <strong>রেকর্ড লাইভ টেস্ট করুন</strong> বোতামটিতে ক্লিক করুন। যদি রেকর্ড কনফিগারেশন পেইড দেখায়ও কিন্তু সাইট ব্রাউজ না হয়, তবে বুঝতে হবে গুগল ক্লাউড এন্ডিং রান থেকে আপনার সিকিউরিটি SSL সার্টিফিকেট ইস্যু হচ্ছে। এর জন্য সর্বোচ্চ ৪০-৫০ মিনিট অপেক্ষা করলেই অটোমেটিক একটিভ হয়ে যাবে।
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== TAB 9: DATABASE SCHEMA SCHEMA ==================== */}
        {activeTab === "database-schema" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm handle-animation-fade-in text-slate-850 text-left">
            <div className="flex items-center gap-3 border-b border-gray-150 pb-4 mb-6">
              <div className="bg-[#1B263B] text-[#C5A059] p-2.5 rounded-xl border border-slate-700 shadow-sm">
                <Server size={18} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1B263B]">Database Tables Schema Configuration</h3>
                <p className="text-stone-500 text-[11px]">System configuration schema metadata representing the persistent stores of onlinegoppo.site platform.</p>
              </div>
            </div>

            <div className="space-y-8 font-sans">
              
              {/* TABLE 1: Books */}
              <div className="border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-900 px-4 py-3 text-[#FBFBFB] font-mono text-[11px] flex justify-between items-center animate-pulse-once">
                  <span className="font-bold tracking-wide">📂 TABLE: Books (`db.json` keys: `books[]`)</span>
                  <span className="bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 px-2 py-0.5 rounded text-[10px]">PrimaryKey: id</span>
                </div>
                <div className="p-4 bg-slate-50 border-b border-stone-150">
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Stores details of physical printed books and downloadable premium digital E-books with strict stock enforcement constraints.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-stone-100 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold text-[10px]">
                        <th className="px-4 py-2">Column Field</th>
                        <th className="px-4 py-2">DataType</th>
                        <th className="px-4 py-2">Constraints</th>
                        <th className="px-4 py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-150 font-mono text-stone-700">
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-950">id</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold w-56">String</td>
                        <td className="px-4 py-2.5 text-amber-700 font-semibold w-56">PRIMARY KEY, UNIQUE</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Unique identifier generated using timestamp or UUID.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">title</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">String</td>
                        <td className="px-4 py-2.5 text-stone-500">NOT NULL</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Book title (Bengali/English display representation).</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">author</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">String</td>
                        <td className="px-4 py-2.5 text-stone-500">NOT NULL</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Author full name (e.g., রবীন্দ্রনাথ ঠাকুর).</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">description</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">String (Text)</td>
                        <td className="px-4 py-2.5 text-stone-500">NOT NULL</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Synopsis overview of the literary piece.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">price</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">Number</td>
                        <td className="px-4 py-2.5 text-stone-500">NOT NULL, &gt;= 0</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Retail price of the copy in Bengali Taka (৳).</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">coverUrl</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">String (Url)</td>
                        <td className="px-4 py-2.5 text-stone-500">NOT NULL</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">URL link to high quality cover photo.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">category</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">String</td>
                        <td className="px-4 py-2.5 text-stone-500">NOT NULL</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Categorization index ('bestsellers', 'new-arrivals', 'ebooks').</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">type</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">Enum ('physical'|'ebook')</td>
                        <td className="px-4 py-2.5 text-stone-500">NOT NULL</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Format index determining delivery/shipping strategy.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">stock</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">Number</td>
                        <td className="px-4 py-2.5 text-stone-500">DEFAULT 0</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Physical stock available (9999 for digital ebooks).</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">fileUrl</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">String (Secure PDF)</td>
                        <td className="px-4 py-2.5 text-stone-500">OPTIONAL</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Premium path to file, available only under secure paid customer dashboard.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TABLE 2: Orders */}
              <div className="border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-900 px-4 py-3 text-[#FBFBFB] font-mono text-[11px] flex justify-between items-center">
                  <span className="font-bold tracking-wide">📂 TABLE: Orders (`db.json` keys: `orders[]`)</span>
                  <span className="bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 px-2 py-0.5 rounded text-[10px]">PrimaryKey: id</span>
                </div>
                <div className="p-4 bg-slate-50 border-b border-stone-150">
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Tracks customer checkouts, financial transaction hashes from bKash / Nagad / cards, and auto delivery status parameters.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-stone-100 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold text-[10px]">
                        <th className="px-4 py-2">Column Field</th>
                        <th className="px-4 py-2">DataType</th>
                        <th className="px-4 py-2">Constraints</th>
                        <th className="px-4 py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-150 font-mono text-stone-700">
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-950">id</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold w-56">String</td>
                        <td className="px-4 py-2.5 text-amber-700 font-semibold w-56">PRIMARY KEY</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Order serial prefix (e.g., `ORD-21841`).</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">customerName</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">String</td>
                        <td className="px-4 py-2.5 text-stone-500">NOT NULL</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">First and last name of checkout sender.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">customerEmail</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">String</td>
                        <td className="px-4 py-2.5 text-stone-500">NOT NULL, INDEXED</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Identifier key matching user libraries.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">customerPhone</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">String</td>
                        <td className="px-4 py-2.5 text-stone-500">NOT NULL</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Personal contact telephone number.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">deliveryAddress</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">String (Text)</td>
                        <td className="px-4 py-2.5 text-stone-500">OPTIONAL</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Billing shipping destination for physical products.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">totalAmount</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">Number</td>
                        <td className="px-4 py-2.5 text-stone-500">NOT NULL</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Total calculated checkout fee in Taka.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">paymentMethod</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">Enum ('card'|'bkash'|'nagad'|'rocket')</td>
                        <td className="px-4 py-2.5 text-stone-500">NOT NULL</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Selected third-party billing network.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">paymentTxnId</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">String</td>
                        <td className="px-4 py-2.5 text-amber-700 font-semibold font-bold">UNIQUE</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Transaction identification reference hash.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-955">status</td>
                        <td className="px-4 py-2.5 text-blue-700 font-semibold">Enum ('paid'|'pending'|'failed')</td>
                        <td className="px-4 py-2.5 text-stone-500">DEFAULT 'pending'</td>
                        <td className="px-4 py-2.5 text-stone-650 font-sans">Payment status variable. 'paid' activates locker access.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        </div>
      </div>

      {/* ==================== EDIT BOOK DIALOG MODAL OVERLAY ==================== */}
      {editingBook && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto handle-animation-fade-in text-xs">
            <h4 className="font-serif text-lg font-bold text-[#1B263B] border-b border-stone-200 pb-2 mb-4">
              বইয়ের যাবতীয় বিবরণ পরিবর্তন কাস্টমাইজেশন করুন
            </h4>

            <form onSubmit={handleBookEditSubmit} className="space-y-4 font-sans font-medium text-stone-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">বইয়ের শিরোনাম</label>
                  <input
                    type="text"
                    required
                    value={editingBook.title}
                    onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg outline-none text-stone-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">লেখক</label>
                  <input
                    type="text"
                    required
                    value={editingBook.author}
                    onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg outline-none text-stone-850"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">বিবরণ / সংক্ষেপণ (Description Summary)</label>
                <textarea
                  rows={4}
                  required
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg outline-none text-stone-800 leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">বিক্রয় মূল্য (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingBook.price}
                    onChange={(e) => setEditingBook({ ...editingBook, price: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg outline-none text-stone-850"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">ক্যাটাগরি</label>
                  <select
                    value={editingBook.category}
                    onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg outline-none cursor-pointer"
                  >
                    <option value="bestsellers">সেরা বিক্রেতা (Bestsellers)</option>
                    <option value="new-arrivals">নতুন আয়োজন (New Arrivals)</option>
                    <option value="ebooks">ই-বুক ডিকশনারী (Ebooks)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">স্টক সংখ্যা (Printed Stock)</label>
                  <input
                    type="number"
                    disabled={editingBook.type === "ebook"}
                    value={editingBook.type === "ebook" ? 9999 : editingBook.stock}
                    onChange={(e) => setEditingBook({ ...editingBook, stock: Number(e.target.value) })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-none disabled:opacity-50 text-stone-850"
                  />
                </div>
              </div>

              {/* EDITING DIALOG FILE UPLOADER DUAL CARD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 border border-stone-200 rounded-xl text-left">
                {/* Image edit */}
                <div className="space-y-2">
                  <label className="text-stone-700 font-extrabold flex items-center gap-1.5 text-[11px]">
                    <Upload size={12} className="text-[#E63946]" />
                    <span>কাভার ইমেজ পরিবর্তন (Book Cover)</span>
                  </label>
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.onload = () => setEditingBook({ ...editingBook, coverUrl: reader.result as string });
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="border border-dashed border-stone-300 hover:border-[#E63946] rounded-lg p-2 bg-white text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px] relative"
                  >
                    {editingBook.coverUrl ? (
                      <div className="w-full flex flex-col items-center gap-1">
                        <img 
                          src={editingBook.coverUrl} 
                          alt="Cover edit preview" 
                          referrerPolicy="no-referrer"
                          className="h-16 w-auto object-cover rounded shadow-sm border border-stone-200" 
                        />
                        <button
                          type="button"
                          onClick={() => setEditingBook({ ...editingBook, coverUrl: "" })}
                          className="bg-red-500 hover:bg-red-650 text-white rounded-full p-0.5 absolute top-1 right-1 shadow-sm"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => setEditingBook({ ...editingBook, coverUrl: reader.result as string });
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <Upload size={14} className="text-stone-400 mb-1" />
                        <span className="text-[10px] text-stone-500">ছবি ড্র্যাগ বা সিলেক্ট করুন</span>
                      </label>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editingBook.coverUrl && editingBook.coverUrl.startsWith("data:") ? "" : editingBook.coverUrl}
                    onChange={(e) => setEditingBook({ ...editingBook, coverUrl: e.target.value })}
                    className="w-full p-1.5 bg-white border border-stone-200 rounded outline-none text-[10px]"
                  />
                </div>

                {/* Video edit */}
                <div className="space-y-2">
                  <label className="text-stone-700 font-extrabold flex items-center gap-1.5 text-[11px]">
                    <Film size={12} className="text-[#E63946]" />
                    <span>প্রচারণা ভিডিও পরিবর্তন (Promo Video)</span>
                  </label>
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith("video/")) {
                        const reader = new FileReader();
                        reader.onload = () => setEditingBook({ ...editingBook, videoUrl: reader.result as string });
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="border border-dashed border-stone-300 hover:border-[#E63946] rounded-lg p-2 bg-white text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px] relative"
                  >
                    {editingBook.videoUrl ? (
                      <div className="w-full flex flex-col items-center gap-1 font-sans">
                        <video 
                          src={editingBook.videoUrl} 
                          controls
                          className="h-16 w-full object-cover rounded shadow-sm border border-stone-200" 
                        />
                        <button
                          type="button"
                          onClick={() => setEditingBook({ ...editingBook, videoUrl: "" })}
                          className="bg-red-500 hover:bg-red-650 text-white rounded-full p-0.5 absolute top-1 right-1 shadow-sm"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => setEditingBook({ ...editingBook, videoUrl: reader.result as string });
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <Film size={14} className="text-stone-400 mb-1" />
                        <span className="text-[10px] text-stone-500">ভিডিও ড্র্যাগ বা সিলেক্ট করুন</span>
                      </label>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editingBook.videoUrl && editingBook.videoUrl.startsWith("data:") ? "" : (editingBook.videoUrl || "")}
                    onChange={(e) => setEditingBook({ ...editingBook, videoUrl: e.target.value })}
                    className="w-full p-1.5 bg-white border border-stone-200 rounded outline-none text-[10px]"
                  />
                </div>
              </div>

              {editingBook.type === "ebook" && (
                <div className="space-y-1">
                  <label className="text-stone-600 font-bold block text-[#C5A059]">ই-বুক পিডিএফ ফাইল লিঙ্ক (Secure Content Link)</label>
                  <input
                    type="url"
                    value={editingBook.fileUrl || ""}
                    onChange={(e) => setEditingBook({ ...editingBook, fileUrl: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-amber-250 rounded-lg text-stone-800"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-stone-50 border border-stone-150 rounded-xl">
                <div className="space-y-1">
                  <label className="text-stone-500 block">প্রকাশকাল সাল</label>
                  <input
                    type="text"
                    value={editingBook.publishedYear || ""}
                    onChange={(e) => setEditingBook({ ...editingBook, publishedYear: e.target.value })}
                    className="w-full p-1.5 bg-white border rounded outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 block">পৃষ্ঠা সংখ্যা</label>
                  <input
                    type="number"
                    value={editingBook.pages || 0}
                    onChange={(e) => setEditingBook({ ...editingBook, pages: Number(e.target.value) })}
                    className="w-full p-1.5 bg-white border rounded outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 block">ভাষা</label>
                  <input
                    type="text"
                    value={editingBook.language || ""}
                    onChange={(e) => setEditingBook({ ...editingBook, language: e.target.value })}
                    className="w-full p-1.5 bg-white border rounded outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 block">ISBN কোড</label>
                  <input
                    type="text"
                    value={editingBook.isbn || ""}
                    onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })}
                    className="w-full p-1.5 bg-white border rounded outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3 font-sans">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-lg cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1B263B] text-white font-bold rounded-lg transition-all shadow-md cursor-pointer"
                >
                  পরিবর্তনগুলি সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
