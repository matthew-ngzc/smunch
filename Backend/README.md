# SMUNCH Backend

A Node.js Express API server for the SMUNCH campus food delivery platform, built with Express.js and Supabase.

## Features

- **RESTful API**: Complete CRUD operations for orders, users, and merchants
- **Authentication**: JWT-based authentication with secure token management
- **Real-time Updates**: WebSocket support for live order tracking
- **Payment Integration**: PayNow QR code generation and payment processing
- **Email Services**: Automated email notifications using Resend
- **File Upload**: Image upload and processing with ImageKit integration
- **Cron Jobs**: Automated background tasks and scheduling
- **API Documentation**: Swagger UI for interactive API documentation
- **Rate Limiting**: Security measures to prevent abuse
- **Error Handling**: Comprehensive error management and logging

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
cd SMUNCH-webapp/Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The .env has been uploaded as a .txt file in devpost. Please refer to "Backend and Frontend ENV variables.txt" file. 
Create a `.env` file in the Backend directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Redis Configuration (Optional)
REDIS_URL=your_redis_url

# Backend URL for Swagger
BACKEND_URL=http://localhost:3000
```

**Environment Variable Descriptions:**
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `FRONTEND_URL`: Frontend application URL for CORS
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `JWT_SECRET`: Secret key for JWT token generation
- `RESEND_API_KEY`: API key for email services
- `IMAGEKIT_PUBLIC_KEY`: ImageKit public key for image uploads
- `IMAGEKIT_PRIVATE_KEY`: ImageKit private key for image processing
- `IMAGEKIT_URL_ENDPOINT`: ImageKit URL endpoint
- `REDIS_URL`: Redis connection URL (optional)
- `BACKEND_URL`: Backend URL for Swagger documentation

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Access API Documentation

Once the server is running, you can access the Swagger API documentation at:
`http://localhost:3000/api-docs`

## Project Structure

```
Backend/
├── src/
│   ├── config/           # Configuration files (Swagger, etc.)
│   ├── constants/        # Application constants and enums
│   ├── controllers/      # Request handlers and business logic
│   ├── cron/            # Scheduled tasks and cron jobs
│   ├── lib/             # External service configurations
│   ├── middlewares/     # Express middlewares (auth, error handling)
│   ├── models/          # Data models and database schemas
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic and external integrations
│   ├── utils/           # Utility functions and helpers
│   └── index.js         # Application entry point
├── bot.py               # Telegram bot integration
├── backendbot.py        # Additional bot functionality
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Cloud Deployment

The backend is deployed using Render. The live application can be accessed at: https://smunch-webapp.onrender.com

## Dependencies

### Core Dependencies
- **Express.js**: Web application framework for building APIs
- **Supabase**: Database and authentication service
- **JWT**: JSON Web Token authentication
- **CORS**: Cross-origin resource sharing middleware
- **dotenv**: Environment variable management
- **bcryptjs**: Password hashing and verification
- **nodemailer**: Email functionality and notifications
- **qrcode**: QR code generation for payments
- **playwright**: Web automation and testing
- **node-cron**: Scheduled tasks and background jobs
- **axios**: HTTP client for external API calls
- **cookie-parser**: Cookie parsing middleware
- **crc-full**: CRC calculation utilities
- **get-stream**: Stream handling utilities
- **ioredis**: Redis client for caching
- **jimp**: Image processing and manipulation
- **luxon**: Date and time manipulation
- **node-fetch**: HTTP request library
- **paynow-generator**: PayNow QR code generation
- **pdfkit**: PDF generation and manipulation
- **resend**: Email service integration
- **swagger-jsdoc**: API documentation generation
- **swagger-ui-express**: Swagger UI for API documentation
- **uuid**: Unique identifier generation

### Development Dependencies
- **nodemon**: Development server with auto-restart functionality
