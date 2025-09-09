# Authority Dashboard

A responsive web application for civic authorities to manage and monitor citizen-reported issues.

## Features

- **Secure Authentication**: JWT-based login with role verification
- **Dashboard Overview**: Real-time statistics and issue status cards
- **Issue Management**: View, update, and assign civic issues
- **Interactive Map**: Visualize issue locations with status indicators
- **Responsive Design**: Works on desktop and mobile devices
- **Password Security**: Secure password validation and hashing

## Demo Credentials

- **Email**: admin@authority.gov
- **Password**: Authority123!

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend Server
```bash
npm run server
```

### 3. Start Frontend (New Terminal)
```bash
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Express.js, SQLite
- **Authentication**: JWT with bcrypt
- **Map**: Leaflet.js
- **Database**: SQLite (auto-created)

## API Endpoints

- `POST /api/auth/login` - Authority login
- `POST /api/auth/change-password` - Change password
- `GET /api/issues` - Get all issues
- `PUT /api/issues/:id/status` - Update issue status
- `GET /api/dashboard/stats` - Get dashboard statistics

## Security Features

- Role-based access control (Authority only)
- JWT token authentication
- Password hashing with bcrypt
- Secure session management
- Input validation and sanitization