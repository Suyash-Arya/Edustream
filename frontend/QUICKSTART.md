# ⚡ Quick Start Guide

Get the EduPlatform frontend running in 5 minutes!

## Prerequisites

- Node.js v16+ installed
- npm or yarn
- Backend server running on http://localhost:3000

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (2 min)
```bash
npm install
```

### Step 2: Configure Environment (.env file)
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:3000" > .env
echo "VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY" >> .env
```

Or create `.env` manually:
```
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
VITE_APP_NAME=EduPlatform
```

### Step 3: Start Development Server (1 min)
```bash
npm run dev
```

### Step 4: Open Browser (1 min)
Navigate to: `http://localhost:5173`

### Step 5: Test Authentication (1 min)
1. Click "Sign Up"
2. Create an account with test details
3. Verify you're redirected to browse page

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📂 Project Structure Overview

```
src/
├── api/           → API calls to backend
├── components/    → Reusable UI components
├── pages/         → Full page components
├── store/         → State management (Zustand)
├── hooks/         → Custom React hooks
├── styles/        → Global CSS
├── App.jsx        → Main routing
└── main.jsx       → Entry point
```

## 🔗 Key API Endpoints

### Authentication
- `POST /api/v1/user/signup` - Create account
- `POST /api/v1/user/signin` - Login
- `GET /api/v1/user/profile` - Get profile

### Courses
- `GET /api/v1/course/published` - Browse courses
- `POST /api/v1/course` - Create course (instructor)
- `GET /api/v1/course/:id` - Course details

## 🎯 Common Tasks

### Add a New Page
1. Create file in `src/pages/MyPage.jsx`
2. Add route in `src/App.jsx`:
```jsx
<Route path="/mypage" element={<MyPage />} />
```

### Create a Component
1. Create file in `src/components/MyComponent.jsx`
2. Import and use in pages

### Call Backend API
Use existing API modules:
```javascript
import { courseAPI } from '../api/courseAPI';

const courses = await courseAPI.getPublishedCourses();
```

### Show Notifications
```javascript
import { useNotification } from '../hooks/useNotification';

const { success, error } = useNotification();
success('Course created!');
error('Something went wrong');
```

## 🐛 Debugging

### Check API Connection
Open DevTools → Network tab:
1. Do an action (like sign in)
2. Look for API requests
3. Check response status (should be 200)

### View Stored Data
In DevTools → Console:
```javascript
// Check auth token
localStorage.getItem('authToken')

// Check user data
JSON.parse(localStorage.getItem('user'))
```

### Enable Debug Mode
In `src/api/axios.js`, add console logs:
```javascript
api.interceptors.request.use((config) => {
  console.log('Request:', config);
  return config;
});
```

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| API connection error | Ensure backend is running on http://localhost:3000 |
| Blank white page | Check browser console for errors |
| Can't sign in | Verify account exists, check password |
| Images not loading | Verify Cloudinary URLs are accessible |
| Slow performance | Clear browser cache, check network |

## 📚 Useful Resources

- [React Hooks](https://react.dev/reference/react)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Axios](https://axios-http.com/)

## 🎓 Learning Path

1. **Understand Structure**: Read `README.md`
2. **Set Up Local**: Follow this quick start
3. **Explore Pages**: Check `src/pages/` to see page structure
4. **Modify Components**: Edit files in `src/components/`
5. **Add Features**: Create new pages and connect to API
6. **Test**: Use browser DevTools to verify

## ✅ Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created
- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Can sign up and sign in
- [ ] Can browse courses
- [ ] No console errors

## 🎉 You're Ready!

Now you can:
- Browse and modify pages
- Create new components
- Add features
- Deploy to production

## 📞 Need Help?

1. Check `README.md` for detailed docs
2. Check `DEPLOYMENT.md` for deployment help
3. Review API files in `src/api/`
4. Check console errors in browser DevTools

---

**Happy Coding! 🚀**
