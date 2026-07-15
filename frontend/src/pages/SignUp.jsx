import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppIcon from "../components/AppIcon";
import { useAuthStore } from "../store/authStore";
import { useNotification } from "../hooks/useNotification";

export default function SignUp() {
  const navigate = useNavigate();
  const { signup, loading } = useAuthStore();
  const { success, error } = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      error("Password must be at least 8 characters");
      return;
    }

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      success("Account created successfully!");
      navigate("/browse");
    } catch (err) {
      error(err.message || "Failed to create account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md card p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Join EduStream and start learning
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <AppIcon
                name="user"
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field auth-input-with-icon"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <AppIcon
                name="mail"
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field auth-input-with-icon"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a:
            </label>
            <div className="space-y-2">
              {[
                { value: "student", label: "Student", icon: "user" },
                {
                  value: "instructor",
                  label: "Instructor",
                  icon: "user-check",
                },
              ].map((role) => {
                return (
                  <label
                    key={role.value}
                    className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <AppIcon name={role.icon} className="w-5 h-5 mr-2" />
                    <span>{role.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <AppIcon
                name="lock"
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field auth-input-with-icon pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <AppIcon
                  name={showPassword ? "eye-off" : "eye"}
                  className="w-4 h-4"
                />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <AppIcon
                name="lock"
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input-field auth-input-with-icon pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                <AppIcon
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  className="w-4 h-4"
                />
              </button>
            </div>
          </div>

          <button className="btn-primary w-full mt-6" type="submit">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
