#  Appointment Booking System  
A full-stack appointment scheduling system built for the BirdChime full-stack developer assignment.

This system allows users to view available time slots, schedule appointments, manage bookings, cancel appointments, and view all saved appointments.


## Features

### Frontend (React)
- Weekly calendar with 30-minute time slots (9 AM – 5 PM, Mon–Fri)
- Form to book appointments  
- Prevents double booking (backend validation)  
- Confirmation + error messages  
- View all appointments  
- Pagination  
- Search by name  
- Cancel appointment  
- Edit appointment  
- Excel export  
- Dark / Light theme toggle  
- Dashboard summary (today / past / upcoming counts)

---

###  Backend (Node.js + Express + MongoDB)
- REST API for all operations
- Double-booking prevention
- Validation for:
  - Business hours only
  - Weekdays only
  - No past-date booking
- MongoDB for data persistence
- Clean JSON responses
- Error handling and HTTP status codes

---

##  Folder Structure

appointment-system/
│── backend/ # Express API
│ ├── models/
│ ├── routes/
│ ├── server.js
│ ├── package.json
│ └── .env
│
└── frontend/ # React UI
├── src/
├── package.json
├── public/
└── README.md

yaml
Copy code

---

#  Tech Stack

### Frontend
- React  
- Bootstrap  
- Context API (theme toggle)  
- Axios  
- XLSX + FileSaver  

### Backend
- Node.js  
- Express.js  
- MongoDB (Atlas)  
- Mongoose  
- CORS  
- dotenv  

---

# API Documentation

## **1. Get all appointments**
GET /api/appointments

css
Copy code
Response:
```json
[
  {
    "_id": "123",
    "name": "John Doe",
    "email": "john@gmail.com",
    "phone": "9876543210",
    "reason": "Consultation",
    "date": "2025-11-28",
    "time": "12:30 PM"
  }
]
2. Get available slots
bash
Copy code
GET /api/appointments/available?date=2025-11-30
3. Create appointment
bash
Copy code
POST /api/appointments
Body:

json
Copy code
{
  "name": "John",
  "email": "john@gmail.com",
  "phone": "98765",
  "reason": "Dental",
  "date": "2025-11-29",
  "time": "09:00 AM"
}
4. Delete appointment
bash
Copy code
DELETE /api/appointments/:id
Local Setup Instructions
1. Clone Repo
bash
Copy code
git clone https://github.com/AdithyaaAbhi/appointment-system.git
2. Backend Setup
bash
Copy code
cd backend
npm install
Create .env file:

ini
Copy code
MONGO_URI=your-mongodb-url
PORT=5000
Start backend:

powershell
Copy code
npm start
3. Frontend Setup
powershell
Copy code
cd frontend
npm install
npm start
Frontend will start at:

arduino
Copy code
http://localhost:3000
Backend will run at:

arduino
Copy code
http://localhost:5000
Deployment
Frontend (Vercel)
arduino
Copy code
npm run build
Upload /build folder or connect GitHub repo → deploy automatically.

Backend (Render)
Create new Web Service

Add environment variable MONGO_URI

Build command: npm install

Start command: node server.js

 Assumptions
Only one appointment allowed per time slot

Business hours: 9 AM – 5 PM

Weekdays only (Mon–Fri)

Only future bookings allowed

 Future Improvements
Email reminders

SMS notifications

Authentication (Admin panel)

Calendar monthly view

Drag/drop scheduling

Appointment rescheduling

Automated tests (Jest / Supertest)

 Author
Adithya — Full Stack Developer
(React + Node + MongoDB)

yaml
Copy code

---

#  You're ready for deployment + submission!
Just paste this README into:

appointment-system/README.md

yaml
Copy code

or the repo root.

---

If you want, I can also:

 Write a professional email for your submission  
 Help you deploy backend/frontend step-by-step  
 Create a short video script explaining your project  

Just say **"Next"** 
