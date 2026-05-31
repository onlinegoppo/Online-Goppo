/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverUrl: string;
  category: string; // 'bestsellers' | 'new-arrivals' | 'ebooks' | 'fiction' | 'poetry' etc.
  type: 'physical' | 'ebook';
  stock: number;         // For physical books
  fileUrl?: string;       // For e-books (PDF file path/download link)
  publishedYear: string;
  pages: number;
  rating: number;         // 1 to 5
  language: string;       // e.g. 'Bengali', 'English'
  isbn?: string;
  videoUrl?: string; // Optional book promo or trailer video
  translator?: string;
  publisher?: string;
  edition?: string;
  country?: string;
  previewPages?: string[]; // Content strings for each page of the free preview!
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  coverUrl: string;
  tags: string[];
  category?: string; // e.g. 'আল কুরআন', 'তালীমুল ইসলাম', 'সম্পাদকীয়'
  issue?: string;    // e.g. 'রমজান ১৪৪৭ - মে ২০২৬'
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string; // Optional for purely digital orders
  items: {
    bookId: string;
    title: string;
    price: number;
    quantity: number;
    type: 'physical' | 'ebook';
  }[];
  totalAmount: number;
  paymentMethod: 'card' | 'bkash' | 'nagad' | 'rocket';
  paymentTxnId: string;
  status: 'paid' | 'pending' | 'failed';
  createdAt: string;
}

export interface SalesAnalytics {
  totalRevenue: number;
  physicalSalesCount: number;
  ebookSalesCount: number;
  totalOrdersCount: number;
  categorySales: { [category: string]: number };
  dailySales: { date: string; amount: number }[];
}

export interface SiteSettings {
  storeName: string;
  heroHeading: string;
  heroSubheading: string;
  heroWelcomeMsg: string;
  supportEmail: string;
  supportPhone: string;
}

export interface LandingPage {
  id: string;
  bookId: string;
  slug: string;
  headline: string;
  subheading: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  promoText: string;
  promoQuote?: string;
  promoQuoteAuthor?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
}
