# Citizen Issue Reporter

A React Native mobile app that allows citizens to report civic issues like potholes, water leakage, garbage, and lack of street lights.

## Features

- **Home Screen**: Map view with nearby issues and list of recent reports
- **Report Issue**: Category selection, description input, and photo upload
- **My Issues**: Track your reported issues with status updates
- **Issue Details**: View detailed information, status timeline, and upvote issues
- **Notifications**: Get updates on your reported issues

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on device/simulator:
```bash
npm run android  # For Android
npm run ios      # For iOS
```

## App Structure

- `/screens/` - All screen components
- `/types/` - TypeScript type definitions
- `/data/` - Mock data for development
- `/app/` - Main app layout and navigation

## Technologies Used

- React Native with Expo
- React Navigation (Stack & Bottom Tabs)
- TypeScript
- Expo Vector Icons
- Local state management with React hooks

## Status

Development version with mock data. Ready for backend integration.