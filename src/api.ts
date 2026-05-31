/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book, BlogPost, Order, SalesAnalytics, SiteSettings, LandingPage } from "./types";

const BASE_URL = ""; // Relative paths since server holds Vite dev middlewares

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("onlinegoppo_admin_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

function getAuthHeadersNoBody(): Record<string, string> {
  const token = localStorage.getItem("onlinegoppo_admin_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; token: string; email: string; storeName: string }> {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Login credentials failed");
  }
  return res.json();
}

export async function fetchBooks(): Promise<Book[]> {
  const res = await fetch(`${BASE_URL}/api/books`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function createBook(book: Omit<Book, "id">): Promise<Book> {
  const res = await fetch(`${BASE_URL}/api/books`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to create book");
  return res.json();
}

export async function updateBook(id: string, book: Partial<Book>): Promise<Book> {
  const res = await fetch(`${BASE_URL}/api/books/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to update book");
  return res.json();
}

export async function deleteBook(id: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/books/${id}`, {
    method: "DELETE",
    headers: getAuthHeadersNoBody(),
  });
  if (!res.ok) throw new Error("Failed to delete book");
  const data = await res.json();
  return data.success;
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  const res = await fetch(`${BASE_URL}/api/blogs`);
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

export async function createBlog(blog: Omit<BlogPost, "id" | "date">): Promise<BlogPost> {
  const res = await fetch(`${BASE_URL}/api/blogs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(blog),
  });
  if (!res.ok) throw new Error("Failed to create blog post");
  return res.json();
}

export interface CheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  cartItems: { id: string; quantity: number }[];
  paymentMethod: "card" | "bkash" | "nagad" | "rocket";
  paymentDetails: {
    cardNumber?: string;
    cardExpiry?: string;
    cvv?: string;
    mobileWalletNumber?: string;
    otpCode?: string;
    pinCode?: string;
  };
}

export interface CheckoutResult {
  success: boolean;
  message: string;
  order: Order;
  txnId: string;
  deliveryNotice: string;
  hasEbooks: boolean;
}

export async function processCheckout(payload: CheckoutPayload): Promise<CheckoutResult> {
  const res = await fetch(`${BASE_URL}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Checkout validation failed");
  }
  return res.json();
}

export interface UserLibraryResponse {
  email: string;
  orders: Order[];
  library: Book[];
}

export async function fetchUserLibrary(email: string): Promise<UserLibraryResponse> {
  const res = await fetch(`${BASE_URL}/api/user/library?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Failed to fetch user library");
  return res.json();
}

export async function fetchAnalytics(): Promise<SalesAnalytics> {
  const res = await fetch(`${BASE_URL}/api/admin/analytics`, {
    headers: getAuthHeadersNoBody(),
  });
  if (!res.ok) throw new Error("Failed to fetch sales analytics");
  return res.json();
}

export async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch(`${BASE_URL}/api/settings`);
  if (!res.ok) throw new Error("Failed to fetch site settings");
  return res.json();
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await fetch(`${BASE_URL}/api/settings`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to update site settings");
  return res.json();
}

export async function fetchLandingPages(): Promise<LandingPage[]> {
  const res = await fetch(`${BASE_URL}/api/landing-pages`);
  if (!res.ok) throw new Error("Failed to fetch landing pages");
  return res.json();
}

export async function createLandingPage(page: Partial<LandingPage>): Promise<LandingPage> {
  const res = await fetch(`${BASE_URL}/api/landing-pages`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(page),
  });
  if (!res.ok) throw new Error("Failed to save landing page");
  return res.json();
}

export async function deleteLandingPage(id: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/landing-pages/${id}`, {
    method: "DELETE",
    headers: getAuthHeadersNoBody(),
  });
  if (!res.ok) throw new Error("Failed to delete landing page");
  const data = await res.json();
  return data.success;
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    headers: getAuthHeadersNoBody(),
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  const res = await fetch(`${BASE_URL}/api/orders/${id}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}

