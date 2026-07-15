# EduPlatform Frontend

A production-ready React frontend for an online learning platform (similar to Udemy). Built with React 18, Vite, Tailwind CSS, and Zustand.

## 🚀 Features

### Core Features
- **User Authentication**: Sign up, sign in, sign out
- **Course Browsing**: Browse published courses with search and filters
- **Course Details**: View detailed course information, instructor details, and lectures
- **User Profile**: Manage user profile, avatar, bio
- **Instructor Dashboard**: Create and manage courses
- **Payment Integration**: Stripe checkout integration
- **Progress Tracking**: Track course progress

### Additional Features
- Role-based access control (Student, Instructor, Admin)
- Responsive design (mobile, tablet, desktop)
- Toast notifications
- Loading states
- Error handling
- Persistent authentication

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running (from the server-solution)

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
VITE_APP_NAME=EduPlatform
```

For local development, the API URL should be `http://localhost:3000` (or your backend server URL).

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Production Build

```bash
npm run build
```

This generates optimized files in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
learning-platform-frontend/
├── src/
│   ├── api/              # API service files
│   │   ├── axios.js      # Axios instance with interceptors
│   │   ├── authAPI.js    # Authentication endpoints
│   │   ├── courseAPI.js  # Course endpoints
│   │   ├── purchaseAPI.js # Payment endpoints
│   │   └── progressAPI.js # Progress endpoints
│   ├── components/       # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── CourseCard.jsx
│   │   └── CreateCourseModal.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── BrowseCourses.jsx
│   │   ├── CourseDetails.jsx
│   │   ├── SignUp.jsx
│   │   ├── SignIn.jsx
│   │   ├── Profile.jsx
│   │   └── InstructorDashboard.jsx
│   ├── store/           # Zustand stores
│   │   ├── authStore.js
│   │   └── courseStore.js
│   ├── hooks/           # Custom hooks
│   │   └── useNotification.js
│   ├── styles/          # Global styles
│   │   └── global.css
│   ├── App.jsx          # Main app component
│   └── main.jsx         # React entry point
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── package.json         # Dependencies and scripts
└── .env.example         # Environment variables template
```

## 🔑 Key Features Explained

### Authentication
- Uses JWT tokens stored in localStorage
- Automatic token injection in API requests
- Automatic logout on token expiry
- Role-based access control

### State Management
- Zustand for global state (auth, courses)
- localStorage for persistence
- Automatic sync with backend

### API Integration
- Axios instance with interceptors
- Centralized error handling
- Request/response transformation
- Automatic token refresh

### Styling
- Tailwind CSS for utility-first styling
- Custom CSS variables for themes
- Responsive design breakpoints
- Dark mode ready (can be extended)

## 🔐 API Endpoints Used

### Authentication
- `POST /api/v1/user/signup` - Create account
- `POST /api/v1/user/signin` - Sign in
- `POST /api/v1/user/signout` - Sign out
- `GET /api/v1/user/profile` - Get profile
- `PATCH /api/v1/user/profile` - Update profile
- `PATCH /api/v1/user/change-password` - Change password
- `DELETE /api/v1/user/account` - Delete account

### Courses
- `GET /api/v1/course/published` - Get published courses
- `GET /api/v1/course/search` - Search courses
- `GET /api/v1/course/c/:courseId` - Get course details
- `POST /api/v1/course` - Create course (instructor)
- `GET /api/v1/course` - Get my courses (instructor)
- `PATCH /api/v1/course/c/:courseId` - Update course
- `POST /api/v1/course/c/:courseId/lectures` - Add lecture
- `GET /api/v1/course/c/:courseId/lectures` - Get lectures

### Purchases
- `POST /api/v1/purchase/checkout/create-checkout-session` - Create Stripe session
- `GET /api/v1/purchase` - Get purchased courses
- `GET /api/v1/purchase/course/:courseId/detail-with-status` - Check purchase status

### Progress
- `GET /api/v1/progress/course/:courseId` - Get course progress
- `PATCH /api/v1/progress/course/:courseId/lecture/:lectureId` - Update lecture progress

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#6366f1',    // Indigo
      secondary: '#8b5cf6',  // Purple
      // Add your custom colors
    }
  }
}
```

### Components
All components are modular and can be customized:
- Edit component files in `src/components/`
- Modify styles in component JSX or `src/styles/global.css`

### Pages
To add new pages:
1. Create new file in `src/pages/`
2. Add route in `src/App.jsx`
3. Use protected routes for authenticated pages

## 🚨 Troubleshooting

### API Connection Issues
1. Ensure backend is running on `http://localhost:3000`
2. Check CORS settings in backend
3. Verify `VITE_API_URL` in `.env`

### CORS Errors
- Backend should have `CLIENT_URL` set to `http://localhost:5173`
- Check Express CORS configuration

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check token in browser DevTools
- Verify JWT token format

### Build Errors
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Clear cache: `npm cache clean --force`

## 📦 Dependencies

### Frontend
- **react**: UI library
- **react-dom**: DOM rendering
- **react-router-dom**: Routing
- **axios**: HTTP client
- **zustand**: State management
- **react-toastify**: Notifications
- **lucide-react**: Icons
- **@stripe/stripe-js**: Stripe integration
- **framer-motion**: Animations
- **date-fns**: Date utilities

### Development
- **vite**: Build tool
- **tailwindcss**: CSS framework
- **postcss**: CSS processor
- **eslint**: Code linting

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
1. Update `vite.config.js`:
```javascript
export default {
  base: '/repository-name/',
  // ... other config
}
```
2. Build and deploy to gh-pages

### Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📝 License

MIT License - feel free to use this project

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions:
1. Check existing issues
2. Create a new issue with details
3. Contact support team

## 🎯 Future Enhancements

- [ ] Wishlist functionality
- [ ] Course reviews and ratings
- [ ] Video player integration
- [ ] Certificate generation
- [ ] Real-time notifications
- [ ] Social features (comments, discussions)
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Advanced analytics

---

**Happy Learning! 🎓**
