# NITC-Sports-Management-System
This project aims to manage the annual Inter-NIT sports tournament.

# Key Features
 - User Authentication: Secure login for different roles (Admin, Coach, Player).
 - Team Management: Coaches can register teams and manage their player rosters.
 - Match Scheduling: Admins can create and schedule matches for various sports.
 - Live Score Updates: Real-time score updates for ongoing matches.
 - Dynamic Standings: Automatic generation of points tables and rankings.
 - Public Portal: A public-facing site for anyone to view schedules, scores, and team stats.

---

## 🧑‍💻 Author
- Setup for [Srinath](https://github.com/Srinathmp) completed on September 22, 2025. Ready for the challenge!
- Setup for [Harish Rana](https://github.com/HarishRa9a/) completed on September 22, 2025. Ready for the challenge!
- Setup for [Virendra](https://github.com/Virendra0410) completed on September 22, 2025. Ready for the challenge!
- Setup for [Achyut](https://github.com/achyutprabhakar) completed on September 26, 2025. Ready for the challenge!

---

## 🧰 Tech Stack

- **Frontend:** React (Vite / CRA)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Seeder:** Custom data seeding scripts

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
git clone https://github.com/Srinathmp/NITC-Sports-Management-System.git
cd NITC-Sports-Management-System
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
npm run seed:import
```

To clear seeded data:
```bash
npm run seed:destroy
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
