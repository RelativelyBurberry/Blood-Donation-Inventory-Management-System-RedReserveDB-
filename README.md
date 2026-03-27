# RedReserveDB – Blood Donation Inventory Management System

Production-ready full-stack blood inventory platform with JWT authentication, role-based dashboards, real-time inventory workflows, and hospital-grade request tracking.

## Tech Stack
- Frontend: React (hooks, React Router, Chart.js)
- Backend: Node.js + Express
- Database: MySQL
- API: RESTful

## Quick Start

### 1) Database Setup
1. Create the database and tables:
   - Run [schema.sql](C:/Users/Nipun/Desktop/VIT/DBMS Project/RedReserve GitHub/Blood-Donation-Inventory-Management-System-RedReserveDB-/RedReserveDB/database/schema.sql)
2. Seed base data:
   - Run [insert.sql](C:/Users/Nipun/Desktop/VIT/DBMS Project/RedReserve GitHub/Blood-Donation-Inventory-Management-System-RedReserveDB-/RedReserveDB/database/insert.sql)

### 2) Backend Setup
1. Update env in [backend/.env](C:/Users/Nipun/Desktop/VIT/DBMS Project/RedReserve GitHub/Blood-Donation-Inventory-Management-System-RedReserveDB-/RedReserveDB/backend/.env)
2. Install dependencies and start:
   - `cd RedReserveDB/backend`
   - `npm install`
   - `npm run seed` (creates demo admin/hospital/donor logins)
   - `npm run dev`

### 3) Frontend Setup
1. Start frontend:
   - `cd RedReserveDB/frontend`
   - `npm install`
   - `npm start`

## Demo Credentials (after seeding)
- Admin: `admin@redreserve.com` / `Admin@123`
- Hospital: `hospital@redreserve.com` / `Hospital@123`
- Donor: `donor@redreserve.com` / `Donor@123`

## API Examples

### Auth
```
POST /api/auth/login
{
  "email": "admin@redreserve.com",
  "password": "Admin@123"
}
```

```
POST /api/auth/register/donor
{
  "userId": "U11",
  "firstName": "Asha",
  "lastName": "Kumar",
  "email": "asha@redreserve.com",
  "phoneNumber": "9000000001",
  "gender": "Female",
  "dob": "1995-01-15",
  "bloodGroup": "O+",
  "lastDonationDate": "2026-01-01",
  "password": "Donor@123"
}
```

### Inventory
```
POST /api/inventory
Authorization: Bearer <token>
{
  "bloodGroup": "O+",
  "quantity": 5,
  "expiryDate": "2026-05-01",
  "donorId": "U01",
  "bankId": "BB01"
}
```

### Requests
```
POST /api/requests
Authorization: Bearer <hospital-token>
{
  "requestId": "R200",
  "bloodGroup": "A+",
  "quantity": 2,
  "hospitalId": "H01",
  "patientId": "P200",
  "urgency": "High"
}
```

```
POST /api/requests/R200/approve
Authorization: Bearer <admin-token>
```

## Core Features
- JWT authentication with Admin / Hospital / Donor roles
- Inventory CRUD with expiry validation and zero-negative stock guarantees
- Blood request workflow (Pending → Approved → Fulfilled / Rejected)
- Admin dashboard with charts and expiring alerts
- Donor management and donation history tracking
- Real-time-ish refresh via polling

## Notes
- All API routes are prefixed with `/api`.
- Inventory auto-reserves units on approval and marks as used on fulfillment.
