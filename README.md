📦 Promart — Smart Local eCommerce Platform
Promart is a full-featured multi-vendor retail automation platform that empowers local shop owners to sell products online and manage in-store operations. It integrates AI-powered product recommendations, real-time inventory management, and both online & offline billing — creating a seamless shopping experience for both sellers and customers.

🧩 Key Features

🔐 Role-based authentication using Firebase (Customer, Seller, Admin)

🛍️ Location-based shop discovery (Google Maps API)

🧠 AI-driven recommendations (Neural Collaborative Filtering + MBA)

🧾 Hybrid billing system: Online & Offline invoices

📦 Order tracking and cart management per shop

📊 Seller analytics (daily/weekly/monthly/yearly insights using Recharts)

🧑‍💼 Admin panel for seller verification, category/shop management

💸 Integrated Razorpay payment gateway

🌍 Hosted on Render, media stored using Firebase Storage

🚀 Tech Stack
Layer	Technology
Frontend	: React.js
Backend	: Spring Boot
Database	: MongoDB Atlas, Firebase
Auth & Media :	Firebase Auth + Storage
Maps & Geo	: Google Maps API
Charts	: Recharts (based on D3.js)
AI Models	: NCF + Flask API (for ML)
Hosting	: Render
Payment :	Razorpay

📂 Project Structure (Modules)

👤 Customer

Browse shops/products based on location

Personalized product suggestions

Dynamic cart (per-shop)

Live order tracking & order history

Shop by category, search with auto-suggestions

🛒 Seller
Manage product catalog, stock, and pricing

Generate offline bills with real-time sync

Access detailed sales analytics (fast/slow products)

Fulfill and track orders in real-time

🛠️ Admin
Approve/reject seller registrations

Manage product categories and shops

Oversee platform activity with full visibility

🧠 Recommendation System
Implemented using Neural Collaborative Filtering (NCF) via a Flask API

Generates personalized product suggestions based on user interaction patterns

Uses Market Basket Analysis for cross-selling (frequently bought together)

🧪 Testing
Tested thoroughly using:

✅ Unit Testing (Functions: Cart Total, Stock Check, Search Filter, etc.)

🔗 Integration Testing (API interactions, DB sync, Payment flow)

🌐 UI Testing (Responsiveness, Toasts, Cart, Checkout)

🔄 System Testing (End-to-end flows for all user roles)

🔧 Setup Instructions
Clone the repo:

bash
Copy
Edit
git clone https://github.com/yourusername/promart.git
Frontend Setup (React.js)

bash
Copy
Edit
cd frontend
npm install
npm start
Backend Setup (Spring Boot)

bash
Copy
Edit
cd backend
./mvnw spring-boot:run
Recommendation System (Flask API)

bash
Copy
Edit
cd ml-recommendation
pip install -r requirements.txt
python app.py
🔮 Future Enhancements
🤖 AI Chatbot for customer support

🎙️ Voice-based product search

📦 Subscription-based delivery model

🛡️ Fraud detection with anomaly detection

🌐 Multi-language and regional tax support

📃 License
This project is open-source under the MIT License.

