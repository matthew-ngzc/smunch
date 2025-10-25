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

Create a `.env` file in the Backend directory using the `.env.example` as a template. It should look like this:

```env
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Turnstile (CAPTCHA)
TURNSTILE_SECRET_KEY=your_turnstile_secret_key

# Redis
REDIS_URL=your_redis_url
JWT_SECRET=your_jwt_secret_key

# Emails
SMUNCH_NAME=SMUNCH
SMUNCH_EMAIL=your_email
# use this if using nodemailer
SMUNCH_APP_PASS=your_app_password

# use these if using gmail API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token

# URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Payment
PAYNOW_NUMBER=your_phone_number

# DEV
NODE_ENV=development

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# telegram bot 
BOT_TOKEN=your_bot_token
BOT_USERNAME=your_bot_username
```

**Environment Variable Descriptions:**
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `FRONTEND_URL`: Frontend application URL for CORS
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `REDIS_URL`: Redis connection URL
- `JWT_SECRET`: Secret key for JWT token generation
- `SMUNCH_NAME`: Display/branding name
- `SMUNCH_EMAIL` — The sender Gmail address used by Nodemailer auth
- `SMUNCH_APP_PASS` — Gmail App Password used by Nodemailer
- `IMAGEKIT_PUBLIC_KEY`: ImageKit public key for image uploads
- `IMAGEKIT_PRIVATE_KEY`: ImageKit private key for image processing
- `IMAGEKIT_URL_ENDPOINT`: ImageKit URL endpoint
- `GOOGLE_CLIENT_ID` — OAuth client ID (used by your token-fetch script / Gmail API flow)
- `GOOGLE_CLIENT_SECRET` — OAuth client secret
- `GOOGLE_REFRESH_TOKEN` — Long-lived refresh token to obtain access tokens without re-auth
- `BACKEND_URL`: Backend URL for Swagger documentation

**Using Gmail API to send emails instead of nodmailer:**
- the reason for using this is because somtimes SMTP ports are blocked (e.g. render free tier)
- go to the google cloud platform
- activate gmail API
- create the credentials and store them (google client id, client secret)
- run the script below to generate the refreh token

**Updating Refresh Token:**
- once in awhile if using gmail API to send emails, the refresh token will expire. You will need to regenerate it.
- run the command below in the terminal in the "Backend" folder and follow the instructions given
```bash
npm run refresh
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` or `${BACKEND_URL}/api-docs`

### 5. Access API Documentation

Once the server is running, you can access the Swagger API documentation at:
`http://${BACKEND_URL}/api-docs`

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

The backend is deployed using Render. The live application can be accessed at: https://smunch.onrender.com

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
