# Citizen Issue Reporter

A mobile application for citizens to report civic issues like potholes, water leaks, and other municipal problems.

## Features

- **Report Issues**: Citizens can report civic problems with photos and location
- **Real-time Updates**: WebSocket integration for live issue status updates
- **Category Management**: Issues categorized by type (Road, Water, Electricity, etc.)
- **Upvoting System**: Community can upvote important issues
- **Authority Dashboard**: Officials can update issue status and respond
- **Offline Support**: App works offline and syncs when connected

## Tech Stack

### Backend
- **Express.js** - Main API server
- **FastAPI** - Alternative Python backend
- **PostgreSQL** - Database (Railway hosted)
- **Socket.io** - Real-time communication
- **TypeScript** - Type safety

### Mobile Frontend
- **React Native** - Cross-platform mobile app
- **Expo** - Development and deployment platform
- **AsyncStorage** - Local data persistence
- **Axios** - API communication

## Project Structure

```
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Server entry point
│   ├── fastapi-backend/    # Alternative Python backend
│   ├── schema.sql          # Database schema
│   └── setup-database.js   # Database initialization
├── mobile-frontend/        # React Native mobile app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── screens/        # App screens
│   │   ├── services/       # API and storage services
│   │   └── types/          # TypeScript definitions
│   └── App.tsx            # App entry point
└── RAILWAY_SETUP.md       # Database setup guide
```

## Setup Instructions

### 1. Database Setup
1. Create a PostgreSQL database on [Railway](https://railway.app)
2. Copy the connection string
3. Create `.env` file in `backend/` folder:
```
DATABASE_URL=your-railway-connection-string
```
4. Initialize database:
```bash
cd backend
node setup-database.js
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3. Mobile App Setup
```bash
cd mobile-frontend
npm install
npm start
```

## API Endpoints

### Issues
- `GET /issues` - Get all issues
- `POST /issues` - Create new issue
- `POST /issues/:id/upvote` - Upvote an issue
- `PUT /issues/:id/status` - Update issue status

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
PORT=5000
```

### Mobile (.env.local)
```
API_BASE_URL=http://localhost:5000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License