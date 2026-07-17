import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Heart, LogOut, Lock, Upload, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useNotification } from "../hooks/useNotification";
import { authAPI } from "../api/authAPI";

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, signout, loading } = useAuthStore();
  const { success, error } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [wishlistCourses, setWishlistCourses] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar || "https://via.placeholder.com/100",
  );
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: null,
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const readStoredCourses = (key) => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const refreshProfileCollections = () => {
    setEnrolledCourses(readStoredCourses("edu_enrolled_courses"));
    setWishlistCourses(readStoredCourses("edu_wishlist"));
  };

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user?.avatar]);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      bio: user?.bio || "",
      avatar: null,
    });
  }, [user?.name, user?.bio]);

  useEffect(() => {
    refreshProfileCollections();
    const handleProfileDataUpdate = () => refreshProfileCollections();
    window.addEventListener("profile-data-updated", handleProfileDataUpdate);
    return () => {
      window.removeEventListener(
        "profile-data-updated",
        handleProfileDataUpdate,
      );
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setAvatarPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("bio", formData.bio);
      if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      const response = await updateProfile(data);
      const updatedUser = response?.data || response?.user || response;
      if (updatedUser?.avatar) {
        setAvatarPreview(updatedUser.avatar);
      }
      success("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, avatar: null }));
      setIsEditing(false);
    } catch (err) {
      error(err.message || "Failed to update profile");
    }
  };

  const handleSignout = async () => {
    await signout();
    navigate("/");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword.length < 8) {
      error("New password must be at least 8 characters long");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      error("New password and confirmation do not match");
      return;
    }
    if (passwordForm.newPassword === passwordForm.currentPassword) {
      error("New password must be different from current password");
      return;
    }

    setPasswordLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change password",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      error('Please type "DELETE" to confirm');
      return;
    }

    setDeleteLoading(true);
    try {
      await authAPI.deleteAccount();
      success("Account deleted successfully");
      await signout();
      navigate("/");
    } catch (err) {
      error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete account",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div>
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6">
                <img
                  src={
                    avatarPreview ||
                    user?.avatar ||
                    "https://via.placeholder.com/100"
                  }
                  alt={user?.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.name}
                </h2>
                <p className="text-gray-600 capitalize">{user?.role}</p>
              </div>

              <div className="space-y-2 mb-6">
                <a
                  href="#my-courses"
                  className="block p-3 rounded-lg hover:bg-gray-100 transition"
                >
                  My Courses
                </a>
                <a
                  href="#wishlist"
                  className="block p-3 rounded-lg hover:bg-gray-100 transition"
                >
                  Wishlist
                </a>
                <a
                  href="#settings"
                  className="block p-3 rounded-lg hover:bg-gray-100 transition"
                >
                  Settings
                </a>
              </div>

              <button
                onClick={handleSignout}
                className="btn-danger w-full flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Profile Information</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary text-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          avatarPreview ||
                          user?.avatar ||
                          "https://via.placeholder.com/80"
                        }
                        alt={user?.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-600 transition">
                          <Upload className="w-5 h-5" />
                          <span>Change photo</span>
                          <input
                            type="file"
                            name="avatar"
                            onChange={handleChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      className="input-field"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900 mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="text-gray-900 mt-1">{user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Bio
                    </label>
                    <p className="text-gray-900 mt-1">
                      {user?.bio || "No bio added yet"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Role
                    </label>
                    <p className="text-gray-900 mt-1 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div id="my-courses" className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold">My Courses</h3>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                  {enrolledCourses.length} enrolled
                </span>
              </div>

              {enrolledCourses.length > 0 ? (
                <div className="space-y-3">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {course.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {course.category || "Course"}
                          </p>
                        </div>
                        <a
                          href={`/course/${course.id}`}
                          className="text-sm font-semibold text-indigo-600"
                        >
                          Open
                        </a>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-indigo-600"
                          style={{ width: `${course.progress || 25}%` }}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Progress: {course.progress || 25}%
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Enroll in a course to see it appear here.
                </p>
              )}
            </div>

            <div id="wishlist" className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold">Wishlist</h3>
                <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-700">
                  {wishlistCourses.length} saved
                </span>
              </div>

              {wishlistCourses.length > 0 ? (
                <div className="space-y-3">
                  {wishlistCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {course.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {course.category || "Saved for later"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/course/${course.id}`}
                          className="text-sm font-semibold text-indigo-600"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Use the wishlist button on a course page to save it here.
                </p>
              )}
            </div>

            {/* Account Settings */}
            <div id="settings" className="card p-6">
              <h3 className="text-2xl font-bold mb-6">Account Settings</h3>

              <div className="space-y-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold">Change Password</p>
                      <p className="text-sm text-gray-600">
                        Update your password regularly
                      </p>
                    </div>
                  </div>
                  <span className="text-indigo-600">&gt;</span>
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold">Delete Account</p>
                      <p className="text-sm text-gray-600">
                        Permanently delete your account
                      </p>
                    </div>
                  </div>
                  <span className="text-red-600">&gt;</span>
                </button>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="card p-6">
              <h3 className="text-2xl font-bold mb-6">Learning Progress</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">
                    {enrolledCourses.length}
                  </p>
                  <p className="text-sm text-gray-600">Courses Enrolled</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    {Math.round(
                      enrolledCourses.reduce(
                        (sum, course) => sum + (course.progress || 25),
                        0,
                      ) / Math.max(1, enrolledCourses.length),
                    )}
                    %
                  </p>
                  <p className="text-sm text-gray-600">Overall Progress</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">
                    {
                      enrolledCourses.filter(
                        (course) => (course.progress || 25) >= 100,
                      ).length
                    }
                  </p>
                  <p className="text-sm text-gray-600">Certificates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordForm({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmText("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-2 text-red-600">
              Delete Account
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This action is permanent and cannot be undone. All your data,
              enrolled courses, and progress will be lost.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="font-bold">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              placeholder="DELETE"
            />
            <button
              onClick={handleDeleteAccount}
              disabled={deleteLoading || deleteConfirmText !== "DELETE"}
              className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {deleteLoading ? "Deleting..." : "Permanently Delete Account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
