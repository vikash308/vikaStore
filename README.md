# VikaStore - Multi-Vendor E-Commerce Platform

VikaStore is a full-featured, multi-vendor e-commerce web application built with **React, Vite, Tailwind CSS, and Supabase**. It provides distinct experiences for three types of users: **Customers**, **Sellers**, and **Admins**.

**🔗 [Live Demo](https://vika-store-teal.vercel.app)**

## 🌟 Key Features

### 👤 Customer Features
- **Authentication**: Secure Login/Signup powered by Supabase Auth.
- **Product Discovery**: Browse products, view detailed descriptions, and see "Sold By" seller details.
- **Shopping Cart & Wishlist**: Add products to cart or save them for later in a personalized wishlist.
- **Checkout Process**: Complete checkout flow including Address Management.
- **Payments**: Supports mock Cash on Delivery (COD) and simulated Online Payments (Dodo Payments UI).
- **Order Tracking**: Customers can view their past orders and order statuses.
- **Reviews & Ratings**: Leave reviews and star ratings on purchased products.

### 🏪 Seller Features
- **Seller Dashboard**: A dedicated portal to manage products and track sales.
- **Product Management**: Add new products, upload product images, and set pricing/stock.
- **Order Fulfillment**: Track which customers bought their specific products.

### 👑 Admin Features
- **Admin Dashboard**: Centralized control panel for platform management.
- **Order Management**: View all orders placed across the platform.
- **User & Role Management**: Approve pending sellers and manage user roles.

## 🛠️ Technology Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion (Animations), Lucide React (Icons).
- **Backend**: Supabase (PostgreSQL, Authentication, Row Level Security, Storage).
- **State Management**: Zustand (Cart, Wishlist, Auth state).
- **Routing**: React Router DOM.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- A Supabase Project

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
To set up the Supabase database, run the provided SQL scripts in your Supabase SQL Editor in the following order:
1. `supabase_schema.sql`: Creates all necessary tables (`profiles`, `products`, `orders`, `addresses`, etc.), Storage buckets, and Row Level Security (RLS) policies.
2. `01_seller_features.sql`: Adds multi-vendor capabilities, updates RLS for sellers, and adds the `seller_id` relationship to products.
3. `02_seed_mock_data.sql`: A utility script to assign roles (Admin/Seller) to specific email addresses and populate the database with mock products.

### 5. Running the App
Start the development server:
```bash
npm run dev
```

## 🔒 Security
- **Row Level Security (RLS)** is strictly enforced at the database level.
- Customers can only view their own orders and addresses.
- Sellers can only modify their own products.
- Admins have elevated privileges to oversee all platform data.

## 📄 License
This project is for educational and portfolio purposes.
