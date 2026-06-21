# Fable - Ebook Sharing Platform

Fable is a digital platform that connects ebook lovers, readers, and collectors with talented writers. Users can browse, discover, and read original ebooks. Writers can upload and manage their creations, while an admin oversees the entire system.

## Live URL

[Deployed on Vercel](https://fable-ebook.vercel.app)

## Admin Credentials

- Email: admin@fable.com
- Password: Admin@123

## Key Features

- User registration with email/password and Google OAuth login
- Role-based dashboards (User, Writer, Admin)
- Browse ebooks with search, filter, sort, and pagination
- Ebook purchase via Stripe payment integration
- Bookmark and wishlist system
- imgBB image upload for ebook covers and profile pictures
- Dark/light mode toggle
- Framer Motion animations
- Analytics dashboard with charts (Recharts)
- Responsive design for mobile and desktop

## NPM Packages Used

### Client (Next.js)
- next, react, react-dom
- framer-motion (animations)
- lucide-react (icons)
- js-cookie (token management)
- react-hot-toast (notifications)
- recharts (charts)
- @react-oauth/google (Google OAuth)

### Server (Express.js)
- express, mongoose (database)
- bcryptjs, jsonwebtoken (authentication)
- stripe (payment)
- nodemailer (email invoices)
- cors, cookie-parser
- axios (HTTP requests)
- dotenv (environment variables)

## Environment Variables

### Client (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Server (.env)
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
```

## Getting Started

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Run seed script to populate database
cd ../server
npm run seed

# Start server (from server directory)
npm start

# Start client (from client directory, new terminal)
cd ../client
npm run dev