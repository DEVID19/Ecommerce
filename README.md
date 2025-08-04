# 💻 Zaptra – Electronics E-Commerce Platform

Zaptra is a modern, full-stack electronics store enabling users to browse, add to cart, and place orders—while admins manage products, orders, and analytics. Built with React, Redux Toolkit, Tailwind CSS, and powered by Appwrite for authentication, storage, and database.

🔗 **Live Demo:** [https://zaptra-electronics-store.vercel.app](https://zaptra-electronics-store.vercel.app)

---

## 🚀 Key Features

### 👤 Authentication & Profiles
- Sign up / login via Email & Google OAuth  
- Admin login only for specified emails (e.g. `admin1@gmail.com`, `admin2@gmail.com`, `admin3@gmail.com` with password `pass1234`)  
- Profile update modal to change name and avatar for both users and admins  

### 🛒 User Dashboard
- CRUD functionality: users can view, add, edit, delete products in cart  
- Place orders and view order history filtered by user  
- Search, sort, filter, and paginate products and order history  

### 🧑‍💼 Admin Console
- Full CRUD control for products, orders, and users  
- Analytics with Recharts (pie charts to visualize sales and user activities)  
- Search, filter, sort, and pagination for admin views  

### 🔒 Security & Route Protection
- Protected routes for cart and admin sections, accessible only to authenticated users  
- Role-based access ensures proper user/admin segregation  

### 🧩 UI & UX
- Mobile-first, responsive UI with Tailwind CSS  
- Clean component-based architecture with React and Redux Toolkit  
- Smooth interactions and notifications using react-hot-toast  

---

## 🛠️ Tech Stack

| Layer        | Tools & Technologies                        |
|--------------|----------------------------------------------|
| Frontend     | React, Redux Toolkit, React Router DOM, Tailwind CSS |
| Backend/API  | Appwrite (Authentication, Database, Storage) |
| Analytics    | Recharts (visual dashboards for admin)       |
| Utils        | Cloud-based storage and secure user data     |
| Hosting      | Vercel (Production-ready deployment)         |

---

## 📁 Folder Structure (Overview)

src/
├── components/ # Reusable UI components
├── context/ # Auth & app-wide context providers
├── lib/ # Appwrite client setup & service modules
├── pages/ # Login, Dashboard, Admin, User Profile pages
├── hooks/ # Custom hooks (useAuth, useCart, etc.)
└── App.jsx # Main app structure and routes


----

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/DEVID19/spendwise.git
cd spendwise
npm install
---
### 2. Add Environment Variables

3. **Create a `.env` file in the root directory and add your Appwrite credentials:**

```env
VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_API_KEY=your_protected_api_key
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_MAIN_BUCKET_ID=your_bucket_id

VITE_APPWRITE_PRODUCTS_COLLECTION_ID=your_products_collection_id
VITE_APPWRITE_CART_COLLECTION_ID=your_cart_collection_id
VITE_APPWRITE_ORDERS_COLLECTION_ID=your_orders_collection_id
VITE_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
VITE_APPWRITE_ADMINS_COLLECTION_ID=your_admins_collection_id


## 🌟 Give it a Star!

If you liked **Zaptra**, don’t forget to ⭐ the repo — it motivates me to build more awesome projects!
