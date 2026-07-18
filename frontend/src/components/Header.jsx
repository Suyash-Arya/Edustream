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
    <header className="bg-ink-600 sticky top-0 z-50 shadow-md">
      <nav className="container-main flex justify-between items-center py-3.5">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <span className="w-9 h-9 rounded-lg bg-gold-400 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-300 transition-colors">
            <AppIcon name="play" className="w-4 h-4 text-ink-800" />
          </span>
          <span className="text-xl font-display font-bold text-white tracking-tight">
            EduStream
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/browse"
            className="text-ink-100 hover:text-gold-300 transition font-medium"
          >
            Browse
          </Link>
          {isUserInstructor && (
            <Link
              to="/instructor/dashboard"
              className="text-ink-100 hover:text-gold-300 transition font-medium"
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
                className="flex items-center space-x-2 text-ink-100 hover:text-gold-300 transition"
              >
                <span className="w-8 h-8 rounded-full bg-ink-500 flex items-center justify-center">
                  <AppIcon name="user" className="w-4 h-4" />
                </span>
                <span className="font-medium">{user?.name}</span>
              </Link>
              <button
                onClick={handleSignout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-ink-400 text-ink-100 hover:bg-ink-500 transition-colors font-medium"
              >
                <AppIcon name="log-out" className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-ink-100 hover:text-gold-300 transition font-medium"
              >
                Sign In
              </Link>
              <Link to="/signup" className="btn-accent">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
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
        <div className="md:hidden border-t border-ink-500 bg-ink-600 animate-slideDown">
          <div className="container-main py-4 space-y-4">
            <Link
              to="/browse"
              className="block text-ink-100 hover:text-gold-300 font-medium"
            >
              Browse
            </Link>
            {isUserInstructor && (
              <Link
                to="/instructor/dashboard"
                className="block text-ink-100 hover:text-gold-300 font-medium"
              >
                Dashboard
              </Link>
            )}
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="block text-ink-100 hover:text-gold-300 font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignout}
                  className="w-full px-4 py-2 rounded-lg border border-ink-400 text-ink-100 text-left font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="block px-4 py-2 rounded-lg border border-ink-400 text-ink-100 text-center font-medium"
                >
                  Sign In
                </Link>
                <Link to="/signup" className="block btn-accent text-center">
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
