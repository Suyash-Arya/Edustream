# API Integration & Deployment Guide

## 🔌 Backend Connection Setup

### 1. Ensure Backend is Running

```bash
# In your backend directory (server-solution)
npm install
npm run dev
# Backend should be running on http://localhost:3000
```

### 2. Frontend Environment Configuration

Create `.env` file in frontend root:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000

# Stripe Public Key (for payment processing)
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_TEST_KEY_HERE

# App Name
VITE_APP_NAME=EduPlatform
```

### 3. CORS Configuration

Ensure your backend has proper CORS settings:

```javascript
// Backend index.js
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  })
);
```

## 🧪 Testing the Connection

### 1. Start Backend
```bash
cd server-solution
npm run dev
```

### 2. Start Frontend
```bash
cd learning-platform-frontend
npm run dev
```

### 3. Test Authentication
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Create a test account
4. Verify token is saved in localStorage
5. Sign in with created account

### 4. Test Course Browsing
1. Go to "Browse Courses"
2. Create courses from instructor dashboard
3. Verify courses appear in browse page

## 🚀 Production Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Prepare Backend for Production

Deploy your backend first (Heroku, Railway, Render, etc.):

```bash
# Example: Heroku
cd server-solution
heroku create your-app-name
git push heroku main
```

#### Step 2: Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd learning-platform-frontend
vercel

# Follow the prompts and add environment variables
```

#### Step 3: Configure Environment Variables in Vercel

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add:
   - `VITE_API_URL`: Your production backend URL
   - `VITE_STRIPE_PUBLIC_KEY`: Your Stripe public key

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd learning-platform-frontend
netlify deploy

# Set up continuous deployment from GitHub
```

### Option 3: Traditional Server (AWS, DigitalOcean, etc.)

```bash
# Build the project
npm run build

# Copy dist folder to your server
scp -r dist/* user@your-server:/var/www/eduplatform/

# Configure nginx
# /etc/nginx/sites-available/eduplatform
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/eduplatform;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://your-backend-url;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/eduplatform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔐 Security Checklist

Before production deployment:

- [ ] Change all default credentials
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure environment variables
- [ ] Implement rate limiting
- [ ] Set up CORS properly
- [ ] Enable CSRF protection
- [ ] Use secure headers (Helmet)
- [ ] Implement input validation
- [ ] Enable MongoDB authentication
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Use environment variables for secrets
- [ ] Implement logging and monitoring
- [ ] Set up error tracking (Sentry, etc.)

## 📊 Performance Optimization

### 1. Build Optimization

```bash
# Generate bundle analysis
npm run build

# Check bundle size
npm ls
```

### 2. Code Splitting

Already implemented via React Router and dynamic imports.

### 3. Image Optimization

Ensure course thumbnails are:
- Compressed (use tools like ImageOptim)
- WebP format when possible
- Appropriate sizes

### 4. Caching Strategy

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
        }
      }
    }
  }
}
```

## 🔍 Monitoring & Logging

### 1. Error Tracking (Sentry)

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### 2. Analytics (Google Analytics, Mixpanel)

```javascript
// Track page views
useEffect(() => {
  // Send page view to analytics
  window.gtag?.pageview({
    page_path: location.pathname,
    page_title: document.title,
  });
}, [location]);
```

## 📧 Email Configuration (Optional)

For transactional emails (welcome, reset password, etc.):

### Using SendGrid

```javascript
// Backend setup
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: user.email,
  from: 'noreply@eduplatform.com',
  subject: 'Welcome to EduPlatform',
  html: `<h1>Welcome ${user.name}!</h1>`,
};

await sgMail.send(msg);
```

## 💳 Stripe Integration

### 1. Get API Keys

1. Sign up at stripe.com
2. Get your API keys from dashboard
3. Add to `.env`:
   - `VITE_STRIPE_PUBLIC_KEY`: pk_...
   - Backend: `STRIPE_SECRET_KEY`: sk_...

### 2. Test Payment

Use test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Require Auth**: 4000 0025 0000 3155

### 3. Webhooks

Configure Stripe webhooks to:
```
https://your-api.com/api/v1/purchase/webhook
```

## 🗄️ Database Backup & Recovery

```bash
# Backup MongoDB
mongodump --uri "mongodb+srv://user:password@cluster.mongodb.net/dbname"

# Restore MongoDB
mongorestore --uri "mongodb+srv://user:password@cluster.mongodb.net/dbname" ./dump

# Set up automated backups
# Use MongoDB Atlas Backup or similar service
```

## 📱 Environment Variables Checklist

### Development
```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_APP_NAME=EduPlatform
```

### Staging
```env
VITE_API_URL=https://api-staging.yourdomain.com
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_APP_NAME=EduPlatform Staging
```

### Production
```env
VITE_API_URL=https://api.yourdomain.com
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_APP_NAME=EduPlatform
```

## 🆘 Troubleshooting Deployment

### Issue: CORS errors in production

**Solution**: Ensure backend CORS configuration includes production URL

### Issue: Blank page after deployment

**Solution**: Check browser console, verify API URL in environment variables

### Issue: Stripe payment fails

**Solution**: Ensure Stripe API keys match environment, check webhook configuration

### Issue: Images not loading

**Solution**: Verify Cloudinary URL is accessible, check CORS headers

### Issue: Slow performance

**Solution**: 
- Enable gzip compression
- Use CDN for static assets
- Implement caching headers
- Optimize images

## 📞 Support & Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Stripe Documentation](https://stripe.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express Documentation](https://expressjs.com/)

---

**Need Help?** Check the troubleshooting section or create an issue.
