# SMUNCH Frontend

A modern Vue.js web application for campus food delivery, built with Vue 3.

## Features

- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Real-time Updates**: Live order tracking and status updates
- **User Authentication**: Secure login/signup with profile management
- **Order Management**: Complete order flow from selection to payment
- **Location Services**: Dynamic room selection based on building and facility type
- **Payment Integration**: QR code payment system
- **Mobile Responsive**: Optimized for all device sizes

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git**

## Local Development Setup

### 1. Clone the Repository

```bash
# Clone the repository containing both Frontend and Backend
git clone https://github.com/regan-tan/smunch.git
cd SMUNCH-webapp/Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the Frontend directory with the following variables:

```env
VITE_ENVIRONMENT=local 
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
```

**Environment Variable Descriptions:**
- `VITE_ENVIRONMENT`: Set to `local` for local development
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_IMAGEKIT_PUBLIC_KEY`: Your ImageKit public key for image uploads

### 4. Start Backend Server

```bash
# Navigate to Backend directory and start the server
cd ../Backend
npm run dev
```

### 5. Start Frontend Development Server

```bash
# In a new terminal, navigate to Frontend directory
cd Frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
Frontend/
├── public/                 
├── src/
│   ├── assets/            # Images, CSS, and other assets
│   ├── components/        # Reusable Vue components        
│   ├── lib/               # External library configurations
│   ├── router/            # Vue Router configuration
│   ├── services/          # API services and external integrations
│   ├── stores/            # Pinia state management
│   ├── utility/           # Utility functions and helpers
│   ├── views/             # Page components
│   ├── App.vue            # Root component
│   └── main.js            # Application entry point
├── tests/                 # Test files
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
└── README.md             # This file
```

## Cloud Deployment

The frontend is deployed using Vercel. The live application can be accessed at: https://smunch-webapp-six.vercel.app/

## Dependencies

### Core Dependencies
- **Vue 3**: Progressive JavaScript framework
- **Vite**: Fast build tool and dev server
- **Pinia**: State management for Vue
- **Vue Router**: Official router for Vue.js
- **Axios**: HTTP client for API calls

### Development Dependencies
- **TypeScript**: Type safety
- **ESLint**: Code linting
- **Vitest**: Unit testing
- **Nightwatch**: E2E testing
