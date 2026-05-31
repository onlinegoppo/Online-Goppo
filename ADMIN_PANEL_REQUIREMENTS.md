# Product Requirements Document (PRD)
## OnlineGoppo Admin Console & Book Management System

- **Document Version:** 1.0.0
- **Authors:** Professional Solutions Architecture Group
- **Status:** Approved
- **Date:** May 29, 2026
- **Target Application:** OnlineGoppo (A sleek bookstore inspired by high-end typography and digital-physical hybrid book lockers)

---

## 1. Executive Summary

This Product Requirements Document (PRD) defines the functional specifications and architectural boundaries for the **OnlineGoppo Admin Console**. This management portal is designed to give administrators comprehensive control over catalog curation, real-time inventory adjustments, customer transaction bookkeeping, secure digital PDF assets, user profile tracking, and dynamic book-specific promotional landing pages.

---

## 2. Technology Stack Evaluation & Recommendations

The user has requested guidance on selecting either the **MERN (MongoDB, Express, React, Node.js) Stack** or **React + Firebase** for the OnlineGoppo platform. Below is a comparative matrix to help make an informed selection:

### 2.1 Comparative Matrix

| Category | React + Firebase (Serverless) | MERN Stack (Traditional Server) |
| :--- | :--- | :--- |
| **Development Velocity** | **Exceptional.** Prebuilt auth, automatic database synchronization, and managed host services eliminate backend boilerplates. | **Moderate.** Requires manual setup of Express REST APIs, JWT/OAuth auth middleware, and database connections. |
| **Real-time Capabilities** | **Native.** Out-of-the-box WebSocket-based real-time listener subscription (Firestore snapshots) with no custom setup. | **Requires extra layers.** Must implement custom WebSockets (Socket.io) or event emitters to push database updates to client dashboards. |
| **File Storage Integration** | **Direct.** Firebase Storage handles client-side direct uploads with automatic integration, progress listeners, and custom token boundaries. | **Two-step execution.** Server must receive files via Multer/Busboy and upload them to cloud storage (S3/Cloudinary) or local directories. |
| **Operational Effort** | **Minimal (Zero Ops).** No server patching, scaling adjustments, or SSL administration. Managed fully by Google Cloud. | **Significant.** Server containers (Cloud Run/EC2) and database cluster sizing (Atlas) must be managed and scaled explicitly. |
| **Query Complexity** | **Moderate.** Relies on single-field filters, composite indexes, and collection-group queries. Doesn't support native deep SQL-like JOINs. | **Advanced.** Supports aggregation pipelines, complex indexing, sub-resource population (`$lookup`), and arbitrary joins. |
| **Security Modeling** | **Declarative.** Admin rights can be audited using serverless Attribute-Based Access Control (ABAC) via `firestore.rules`. | **Procedural.** Security logic is composed of layered middleware inside Node.js routers, manually guarding express entry-points. |

### 2.2 Final Architectural Recommendation

For the **OnlineGoppo Bookstore**, **React + Firebase + Node Serverless** is highly recommended as the most suitable ecosystem. 

**Why React + Firebase is the Superior Choice here:**
1. **Real-time Customer Dashboard:** Firestore's native snapshot propagation allows the Admin Panel to display transaction completions and inventory decreases without constant manual refreshes.
2. **Zero-Trust Digital Asset Lockers:** Since OnlineGoppo distributes both physical paperbacks and instant PDF downloads, Firebase Storage's fine-grained security rules make it trivial to restrict PDF download URLs strictly to authenticated owners, preventing raw link duplication.
3. **No DevOps Burden:** It fits perfectly with the existing containerized structure of the application. Placing API handlers that manage payment processor validations (bKash, Nagad) into serverless code prevents secret keys from reaching the client-side, maintaining modern security boundaries.

---

## 3. High-Level System Architecture

```
                                  +-----------------------+
                                  |     Vite + React      |
                                  |      Client App       |
                                  +-----------+-----------+
                                              |
                     +------------------------+-------------------------+
                     | (HTTPS API)                                      | (Firestore Client SDK)
                     v                                                  v
         +-----------+-----------+                         +------------+-----------+
         |   Node.js/Express     |                         |   Firebase Security    |
         |   Proxy Server (API)  |                         |   Rules (ABAC Layer)   |
         +-----------+-----------+                         +------------+-----------+
                     |                                                  |
                     | (Payment Tokens & SDK Actions)                   | (Auth & Read/Write)
                     v                                                  v
         +-----------+-----------+                         +------------+-----------+
         |  bKash/Nagad/Rocket   |                         |  Cloud Firestore &     |
         |  Merchant Gateways    |                         |  Firebase Auth Services|
         +-----------------------+                         +------------------------+
```

---

## 4. Functional Requirements Specification

### 4.1 Book & Catalog Management Module (Add / Edit / Remove)
Allows coordinators to modify the active catalogue, specifying metadata for physical paperbacks and e-book downloads.

- **F4.1.1 Add/Create Record:** Form supporting book cover visual upload, descriptive titles, catalog classification (e.g., bestsellers, new-arrivals), ISBN code, pricing structure (in BDT ৳), and inventory levels.
- **F4.1.2 Format Adaptation:** Dynamic toggles supporting dual publishing formats:
  - **Physical:** Sets an inventory stock counter (`stock`) and dynamic decrementor limits. Block sales when stock is zero.
  - **E-Book (Digital):** Unlocks a restricted area to anchor the secure URL linking to the primary PDF (`fileUrl`). Employs client limits to hide this URL from non-buyers.
- **F4.1.3 Edit Details:** Overwrites existing descriptors containing name, rating indicators, overview synopsis, category labels, language, page length, and release year. Inline update mechanisms are locked on immutable properties like ID elements.
- **F4.1.4 Secure Cover CDN:** Supports hosting cover art files securely, ensuring compliance with the Referrer-Policy to prevent image blockage on consumer dashboards.
- **F4.1.5 Batch Cleanup / Remove:** Safeguards transaction records by marking books as archived/deactivated rather than physically purging database rows if they are linked to historical consumer orders.

---

### 4.2 Dynamic Landing Page Management Builder
This module allows administrators to create fully custom, typography-focused visual landing pages for premium titles to maximize high-converting promotional outreach.

- **F4.2.1 Page Creator interface:** A streamlined builder linking a selected book record to a custom URL slug (e.g., `/promo/[book-id]`).
- **F4.2.2 Visual Editor Elements:** Enables customizing dedicated layout modules:
  - **Hero Segment:** Big scale cover image layout, custom headlines, promotional subtitles, and elegant background blocks.
  - **Narrative Column:** Multi-paragraph review sections, quote panels for literary endorsements, and embedded author video review URLs.
  - **Specifications Table:** Highlighted font layouts for page length, bindings, publisher annotations, and translation attributes.
  - **Dynamic Action Footer:** High-visibility checkout buttons binding the exact pricing model to direct gateway integrations (bKash, Rocket, credit cards).
- **F4.2.3 Metadata Controller:** Editor fields to configure page-level SEO attributes (Meta Title, Description, and Social Share Open Graph graph posters) to optimize search indexing and social sharing.

---

### 4.3 User & Access Management Module
Provides absolute visibility over customer records and active administrative credentials.

- **F4.3.1 Customer Profile List:** Visual tracking of email addresses, contact details, total lifetime orders, and date of first registration.
- **F4.3.2 Digital Delivery Lockers:** Enables admins to audit individual user lockers and see precisely which e-book links have been issued to them.
- **F4.3.3 Access Allocation (RBAC Roles):** Assign privilege tiers to accounts:
  - **Super-Admin:** Full access to inventory, sales logs, user profiles, system settings, and custom configurations.
  - **Store Manager/Editor:** Managed access exclusively to inventory updates and blog creations; cannot view aggregate earnings, financial spreadsheets, or user credentials.
  - **Customer:** Restricted strictly to client interfaces and and their personal e-book lockers.
- **F4.3.4 Security Session Auditing:** Real-time visibility into active administrative sessions to protect transaction and customer profile databases.

---

### 4.4 Real-time Order Tracking & Analytics Console
Visual and analytical engine designed to output direct business diagnostics, keeping operations streamlined.

- **F4.4.1 Invoicing Ledger:** Real-time stream of invoices featuring invoice status indicators:
  - `paid`: Transaction has cleared; PDF lockers are populated.
  - `pending`: Waiting for verification codes.
  - `failed`: Abandoned cart, failed card validation, or expired transaction token.
- **F4.4.2 Revenue Dynamics Graph:** A time-series bar chart reflecting weekly/monthly earnings with hover tooltips displaying concrete numerical totals.
- **F4.4.3 Distribution Split Analytics:** Real-time representation comparing physical paperback sales (subject to physical distribution networks) and electronic deliveries (automated downloads).
- **F4.4.4 Inventory Stock Alert Sentinel:** Automatically triggers warning badges next to paperback titles when remaining warehouse stock decreases below 5 copies.

---

### 4.5 Site Settings & Workspace Customization
Enables changing overall site appearance and store variables to fit changes in season or branding directives.

- **F4.5.1 Branding Typography & Visual Layouts:** Inputs to redefine application subtitle arrays, primary logo markings, and overall legal metadata printed across footer sectors.
- **F4.5.2 Hero Spotlight Configuration:** Sliders managing banner slides, action labels, and corresponding target sections (e.g., connecting a spring banner to `/promo/landing-page-id`).
- **F4.5.3 Support & Contact Registry:** Control centers modifying hotline cell numbers, merchant support email addresses, company physical warehouse coordinates, and dynamic social media handles.

---

## 5. Structured Data Model Schemas

Recommended data schemas aligning with the current system's architecture:

```typescript
/**
 * Core Book Object
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverUrl: string;
  category: string; 
  type: 'physical' | 'ebook';
  stock: number;         // 0 for purely digital e-books
  fileUrl?: string;       // Restricted back-end path to PDF download
  publishedYear: string;
  pages: number;
  rating: number;         // Calculated rating scale 1 to 5
  language: string;       // Default 'Bengali'
  isbn?: string;          // International Standard Book Number
}

/**
 * Dynamic Promotional Landing Page Model
 */
export interface LandingPage {
  id: string;
  bookId: string;         // Linked original book id
  slug: string;           // Custom URL subpath, e.g. /spotlight/himu-bosonto
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  design: {
    heroHeadline: string;
    heroSubtitle: string;
    heroBgColor: string;  // e.g. '#1B263B'
    heroAccentColor: string; // e.g. '#C5A059'
    promoQuote: string;
    promoQuoteAuthor: string;
    narrativeHtml: string;// Custom promotional narrative (Markdown/HTML compatible)
  };
  isActive: boolean;
  createdAt: string;
  viewCount: number;      // Conversion tracking
}

/**
 * Enhanced User Account Record
 */
export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'admin' | 'editor' | 'customer';
  shippingAddress: string;
  lockerBookIds: string[]; // Active e-book download grants
  createdAt: string;
  lastActive: string;
}

/**
 * Customer Invoice Orders
 */
export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
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
```

---

## 6. Secure ABAC Guarding & Rules Design
In a React + Firebase architecture, we enforce **Attribute-Based Access Control (ABAC)**. Identity properties reside securely in administrative catalogs inside the Firestore database, rather than client-trusted variables.

Below is the blueprint for core security rules governing access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Default Deny-All Core Boundary
    match /{document=**} {
      allow read, write: if false;
    }

    // Helper Primitives
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Check if the authenticating email exists in the trusted administrator registry
    function isAdmin() {
      return isSignedIn() && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // Check if user is requesting their own personal files
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Catalog Rules: Accessible for read by anyone, but writes require admin authentication
    match /books/{bookId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Custom Landing Pages: Publicly reader compatible, but creation requires admin
    match /landingPages/{pageId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Orders collection - Customers can only view their own orders, Admins can manage all
    match /orders/{orderId} {
      allow create: if isSignedIn();
      allow read: if isAdmin() || (isSignedIn() && resource.data.customerEmail == request.auth.token.email);
      allow update, delete: if isAdmin();
    }

    // User Lockers: Highly isolated to prevent PII leaks or asset URL scraping
    match /users/{userId}/public/profile {
      allow read: if true;
      allow write: if isOwner(userId) || isAdmin();
    }

    match /users/{userId}/private/locker {
      allow read: if isOwner(userId) || isAdmin();
      allow write: if isAdmin(); // Securely populated only after transactional gateway clearances
    }
  }
}
```

---

## 7. Operational Success Criteria

To ensure a seamless deployment of the Book Haven admin ecosystem, the operational platform must satisfy the following checks:

1. **Non-Blocking File Pipelines:** Uploading a PDF eBook file (typically 10-50MB) must process fully via background workers, allowing the administrator to continue interacting with inventory sheets.
2. **Atomic Inventory Reductions:** Checks must guarantee that if a physical paperback sale is updated, the warehouse inventory counts are decremented atomically, preventing over-sales.
3. **Responsive Visual Rendering:** Graph distributions must resize fluidly to prevent UI breakage on tablets or ultra-wide monitors.
4. **Immediate Delivery Locker Provisioning:** The moment a checkout order changes status from `pending` to `paid`, the corresponding eBook ID must be atomically written into the user's `lockerBookIds` array, providing instant secure file locker access.
