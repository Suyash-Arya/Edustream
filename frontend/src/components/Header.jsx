import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppIcon from "./AppIcon";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signout, isAuthenticated, isInstructor } = useAuthStore();
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();
  const isUserInstructor = isInstructor();

  const handleSignout = async () => {
    await signout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container-main flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <AppIcon name="bar-chart-3" className="w-8 h-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-900">EduStream</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/browse"
            className="text-gray-700 hover:text-indigo-600 transition"
          >
            Browse
          </Link>
          {isUserInstructor && (
            <Link
              to="/instructor/dashboard"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
              >
                <AppIcon name="user" className="w-5 h-5" />
                <span>{user?.name}</span>
              </Link>
              <button
                onClick={handleSignout}
                className="btn-secondary flex items-center space-x-2"
              >
                <AppIcon name="log-out" className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/signin" className="btn-secondary">
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <AppIcon name="x" className="w-6 h-6" />
          ) : (
            <AppIcon name="menu" className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container-main py-4 space-y-4">
            <Link
              to="/browse"
              className="block text-gray-700 hover:text-indigo-600"
            >
              Browse
            </Link>
            {isUserInstructor && (
              <Link
                to="/instructor/dashboard"
                className="block text-gray-700 hover:text-indigo-600"
              >
                Dashboard
              </Link>
            )}
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-indigo-600"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignout}
                  className="w-full btn-secondary text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="block btn-secondary text-center">
                  Sign In
                </Link>
                <Link to="/signup" className="block btn-primary text-center">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
