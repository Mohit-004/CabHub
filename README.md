# CabHub - Premium Indian Ride-Hailing Platform 🚖🇮🇳

CabHub is a comprehensive, full-stack ride-hailing solution tailored specifically for the Indian market. Designed with an "Incredible India" aesthetic (Saffron, Chakra Blue, and Emerald Green), it provides a premium and localized experience across three distinct portals: Passenger, Driver (Pilot), and Admin.

## 🎯 Purpose and Origin

**Why was this built?**
CabHub was built to demonstrate a scalable, real-time, microservices-oriented frontend architecture communicating with a robust monolithic Node.js backend. The purpose is to provide a complete, end-to-end template for a modern mobility application, addressing localization, real-time geospatial tracking, and role-based access control.

**How was it created?**
The project is structured as a monorepo containing three separate React (Vite) applications for the frontends and an Express.js server for the backend. Real-time bidirectional communication is powered by Socket.io, enabling live ride tracking and instantaneous dispatching.

## ✨ Key Features

### 👤 Passenger Portal
*   **Vibrant Booking Dashboard:** Book rides with estimated fares in INR (₹).
*   **Real-time Tracking:** Map integration (Leaflet) centered on Indian hubs to track arriving cabs.
*   **Ride History:** View past trips, fares, and ratings.
*   **Secure Authentication:** JWT-based login and registration.

### 🚕 Driver Portal (Bharat Nav)
*   **Command Center Interface:** Accept incoming ride missions dynamically.
*   **Pilot Identity Hub:** Manage driver credentials and verified vehicle registry data.
*   **Treasury (Earnings):** View total earnings and completed mission archives.
*   **Status Toggle:** Go "On Duty" or "Off Duty" to control dispatch visibility.

### 🛡️ Admin Portal (Global Command)
*   **Fleet Intelligence Map:** Live overview of all active and available vehicles across the city (Bengaluru).
*   **Data Visualization:** High-fidelity dashboard tracking total users, active task forces, and live revenue.
*   **Security Feeds:** Simulated system integrity checks and alert feeds.

## 🛠️ Technology Stack

*   **Frontend Apps:** React 18, Vite, React Router, Framer Motion (Animations), Lucide React (Icons), React-Leaflet (Maps), Vanilla CSS (Custom Design System).
*   **Backend Server:** Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), Axios.
*   **Real-time Communication:** Socket.io.

## 🚀 Getting Started

Follow these instructions to clone and run the CabHub ecosystem locally.

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd CabHub
```

### 2. Setting Up the Backend
The backend powers the database modeling and real-time socket connections.

```bash
cd backend
npm install
```

**Environment Variables:**
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cabhub   # Or your MongoDB Atlas connection string
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002
JWT_SECRET=your_super_secret_key_here
```

**Run the Backend:**
```bash
npm run dev
```
*The server will start on `http://localhost:5000`.*

### 3. Setting Up the Frontend Apps
You will need to run the frontend apps on separate terminal instances.

**Passenger App:**
```bash
cd apps/passenger-app
npm install
npm run dev
```

**Driver App:**
```bash
cd apps/driver-app
npm install
npm run dev
```

**Admin App:**
```bash
cd apps/admin-app
npm install
npm run dev
```

### 4. Running the Complete System
To experience the full flow:
1.  Ensure MongoDB is running locally or your Atlas URI is correct.
2.  Start the **Backend** (Port 5000).
3.  Start the **Driver App** and log in/register. Toggle "On Duty".
4.  Start the **Passenger App** and log in/register. Request a ride.
5.  Watch the real-time request appear on the Driver's dashboard.
6.  Start the **Admin App** to view the live dashboard statistics.

---

