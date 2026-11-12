# Sweety – Blood Glucose Tracker

Sweety is a web-based blood glucose tracking application that helps users record, manage, and monitor their daily blood glucose readings. It provides daily and monthly reports, visual glucose trends, and a dedicated section to manage doctor and appointment information.

## Features

### Authentication

- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Protected API routes.

### Blood Glucose Management

- Add, view, edit, and delete glucose readings.
- Record readings across four daily time slots:
  - Morning (fasting)
  - After breakfast
  - After lunch
  - After dinner
- Prevent duplicate readings for the same date and time slot.
- View recent readings from the dashboard.

### Reports and Analytics

- Daily glucose report.
- Monthly glucose summary.
- Minimum, maximum, and average glucose values.
- Interactive monthly glucose trend chart.

### Doctor's Corner

- Save doctor and clinic information.
- Manage appointment date and time.
- Store consultation notes and questions.
- Edit or delete saved doctor information.
- Doctor details persist using browser localStorage.

## Technology Stack

| Layer          | Technologies            |
| -------------- | ----------------------- |
| Frontend       | React, TypeScript, Vite |
| Styling        | Tailwind CSS            |
| Charts         | Recharts                |
| Backend        | Node.js, Express.js     |
| Database       | PostgreSQL              |
| ORM            | Prisma                  |
| Authentication | JWT, bcrypt             |

## Project Structure

```text
sweety/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── Reports/
│   │   │   ├── Doctor/
│   │   │   └── Dashboard.tsx
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js (v20 or later recommended)
- npm
- PostgreSQL
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd sweety
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory using `.env.example` as a reference.

Configure the following environment variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/sweety_db?schema=public"
JWT_SECRET="your_secure_random_secret"
PORT=5000
```

Create a PostgreSQL database named `sweety_db` before running migrations.

Run database migrations:

```bash
npx prisma migrate deploy
```

Generate the Prisma client:

```bash
npx prisma generate
```

Seed the database with a demo user and sample glucose readings:

```bash
npm run seed
```

Start the backend development server:

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 3. Frontend Setup

Open another terminal and navigate to the client directory:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory using `client/.env.example` as a reference.

Configure the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## Demo Account

The seed script creates a demo account:

| Field    | Value           |
| -------- | --------------- |
| Email    | demo@sweety.com |
| Password | Sweety@123      |

The seed script also inserts sample glucose readings for the demo account.

## API Endpoints

All endpoints use the `/api` prefix.

### Authentication

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Register a new user |
| POST   | `/auth/login`    | Authenticate user   |

### User

| Method | Endpoint    | Description                    |
| ------ | ----------- | ------------------------------ |
| GET    | `/users/me` | Get authenticated user profile |

### Glucose Readings

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| POST   | `/readings`     | Add a glucose reading |
| GET    | `/readings`     | Get user readings     |
| PUT    | `/readings/:id` | Update a reading      |
| DELETE | `/readings/:id` | Delete a reading      |

### Reports

| Method | Endpoint                         | Description               |
| ------ | -------------------------------- | ------------------------- |
| GET    | `/reports/daily?date=YYYY-MM-DD` | Get daily report          |
| GET    | `/reports/monthly/current`       | Get current month report  |
| GET    | `/reports/monthly/previous`      | Get previous month report |

Protected endpoints require a JWT token in the Authorization header:

```text
Authorization: Bearer YOUR_TOKEN
```

## Testing

The application was manually tested to verify its main workflows.

### Authentication

- User registration with valid and invalid details.
- Login with correct and incorrect credentials.
- Password hashing using bcrypt.
- JWT authentication for protected routes.

### Glucose Readings

- Create, retrieve, update, and delete readings.
- Validate reading data.
- Prevent duplicate readings for the same date and time slot.

### Reports

- Verify daily glucose reports.
- Verify current and previous monthly reports.
- Check minimum, maximum, and average glucose calculations.

### Frontend

- Verify dashboard, readings, reports, and doctor information.
- Verify doctor information persists after refreshing the browser.
- Verify responsive layout and navigation.

## Assumptions and Notes

- Each user can record up to four glucose readings per day, one for each predefined time slot.
- A user cannot create duplicate readings for the same date and time slot.
- Glucose readings are stored in mg/dL.
- Doctor information is stored locally in the browser using localStorage and is not synchronized across devices.
- The application uses JWT authentication for protected backend endpoints.

## Future Improvements

- Export glucose reports as PDF.
- Add glucose reading reminders.
- Add doctor information synchronization through the backend.
- Improve analytics with weekly and yearly glucose trends.
- Add deployment and cloud database support.

## License

This project was developed as a learning and application assignment.
