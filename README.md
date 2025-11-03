# NITC-Sports-Management-System
This project aims to manage the annual Inter-NIT sports tournament.

---

## 🧑‍💻 Author
- Setup for Harish Rana completed on September 22, 2025. Ready for the challenge!
- Setup for Virendra completed on September 22, 2025. Ready for the challenge!
- Setup for Achyut completed on September 26, 2025. Ready for the challenge!

---

# 🚀 Project Setup Guide

This project includes both **frontend** and **backend** components along with a **database seeder**.  
Follow the steps below to set up and run the application locally.

---

## 📂 Project Structure

```
root/
 ├── client/         # Frontend (React)
 ├── server/         # Backend (Express + MongoDB)
 ├── server/.env.sample  # Sample environment file
 ├── server/seeders/     # Database seeder scripts
 └── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

---

### 2. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ../client
npm install
```

---

### 3. Environment Variables

Copy the `.env.sample` file in the **server** directory and rename it to `.env`:
```bash
cd ../server
cp .env.sample .env
```

Now, open the `.env` file and update the following values as needed:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

---

### 4. Database Seeding (Optional)

To populate your database with sample data:
```bash
npm run seed
```

To clear seeded data:
```bash
npm run clear
```

*(Make sure MongoDB is running and `.env` is properly configured before seeding.)*

---

### 5. Run the Project

#### Start Backend
```bash
cd server
npm run dev
```

#### Start Frontend
Open a new terminal:
```bash
cd client
npm start
```

---

### 6. Access the App

Frontend: [http://localhost:3000](http://localhost:3000)  
Backend API: [http://localhost:5000](http://localhost:5000)

---

## 🧰 Tech Stack

- **Frontend:** React (Vite / CRA)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Seeder:** Custom data seeding scripts

---
