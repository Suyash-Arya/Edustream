import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  ShoppingCart,
  Sparkles,
  Heart,
} from "lucide-react";
import { useCourseStore } from "../store/courseStore";
import { useAuthStore } from "../store/authStore";
import { purchaseAPI } from "../api/purchaseAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNotification } from "../hooks/useNotification";

const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () =>
      reject(new Error("Unable to load the payment gateway."));
    document.body.appendChild(script);
  });
};

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentCourse, loading, getCourseDetails } = useCourseStore();
  const { isAuthenticated, user } = useAuthStore();
  const { success, error } = useNotification();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoCheckoutOrder, setDemoCheckoutOrder] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const isLearningView = location.pathname.includes("/course-progress/");

  useEffect(() => {
    getCourseDetails(courseId);
  }, [courseId, getCourseDetails]);

  useEffect(() => {
    if (searchParams.get("view") === "course") {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const wishlist = JSON.parse(localStorage.getItem("edu_wishlist") || "[]");
      setIsWishlisted(wishlist.some((item) => item.id === courseId));
    } catch {
      setIsWishlisted(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const enrolledCourses = JSON.parse(
        localStorage.getItem("edu_enrolled_courses") || "[]",
      );
      setIsEnrolled(enrolledCourses.some((item) => item.id === courseId));
    } catch {
      setIsEnrolled(false);
    }
  }, [courseId]);

  useEffect(() => {
    const baseCount =
      currentCourse?.course?.enrolledStudents?.length ||
      currentCourse?.enrolledStudents?.length ||
      0;
    setStudentCount(baseCount + (isEnrolled ? 1 : 0));
  }, [currentCourse, isEnrolled]);

  const syncCollection = (key, item) => {
    if (typeof window === "undefined") return;
    try {
      const current = JSON.parse(localStorage.getItem(key) || "[]");
      const exists = current.some((entry) => entry.id === item.id);
      const updated = exists ? current : [...current, item];
      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(new Event("profile-data-updated"));
    } catch {
      // Ignore storage errors for the demo flow
    }
  };

  const handleWishlistToggle = () => {
    if (!courseData) return;

    try {
      const stored = JSON.parse(localStorage.getItem("edu_wishlist") || "[]");
      const exists = stored.some((item) => item.id === courseId);
      const next = exists
        ? stored.filter((item) => item.id !== courseId)
        : [
            ...stored,
            {
              id: courseId,
              title: courseData?.title || "Course",
              category: courseData?.category || "Course",
            },
          ];

      localStorage.setItem("edu_wishlist", JSON.stringify(next));
      setIsWishlisted(!exists);
      window.dispatchEvent(new Event("profile-data-updated"));
      success(exists ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      error("Unable to update wishlist right now");
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated()) {
      navigate("/signin");
      return;
    }

    setIsPurchasing(true);
    try {
      let useDemoFlow = false;
      try {
        await loadRazorpayScript();
      } catch {
        useDemoFlow = true;
      }

      const response = await purchaseAPI.createRazorpayOrder(courseId);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to start enrollment.");
      }

      const order = response.order;
      const courseName =
        response?.course?.name || courseData?.title || "EduStream course";

      if (response.demo || useDemoFlow) {
        setDemoCheckoutOrder({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency || "INR",
          courseName,
        });
        setPaymentConfirmed(false);
        setShowDemoModal(true);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_demo",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "EduStream",
        description: courseName,
        order_id: order.id,
        prefill: {
          name: user?.name || "Learner",
          email: user?.email || "",
        },
        theme: {
          color: "#4f46e5",
        },
        handler: async (paymentResponse) => {
          try {
            await purchaseAPI.verifyRazorpayPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              courseId,
            });
            setIsEnrolled(true);
            success("Enrollment successful! You can now access the course.");
            navigate(`/course-progress/${courseId}`);
          } catch (verifyError) {
            error(
              verifyError?.message || "Payment was not completed successfully.",
            );
          }
        },
        modal: {
          ondismiss: () => {
            error("Payment was cancelled. No charges were made.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      error(err?.message || "Failed to process purchase");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleDemoPayment = async () => {
    if (!demoCheckoutOrder) return;

    setIsPurchasing(true);
    try {
      await purchaseAPI.verifyRazorpayPayment({
        razorpay_order_id: demoCheckoutOrder.orderId,
        razorpay_payment_id: `demo_${Date.now()}`,
        razorpay_signature: "demo-signature",
        courseId,
      });
      syncCollection("edu_enrolled_courses", {
        id: courseId,
        title: courseData?.title || "Course",
        category: courseData?.category || "Course",
        progress: 10,
      });
      setIsEnrolled(true);
      setPaymentConfirmed(true);
      success("Enrollment successful! You can now access the course.");
    } catch (verifyError) {
      error(verifyError?.message || "Payment was not completed successfully.");
    } finally {
      setIsPurchasing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!currentCourse) {
    return (
      <div className="container-main py-12 text-center">
        <p className="text-gray-600">Course not found</p>
      </div>
    );
  }

  const { course } = currentCourse || currentCourse;
  const courseData = course || currentCourse;

  const courseModules =
    Array.isArray(courseData.lectures) && courseData.lectures.length > 0
      ? courseData.lectures.map((lecture, idx) => {
          const titleText = (lecture.title || `Module ${idx + 1}`).trim();
          const categoryName = (courseData.category || "").toLowerCase();

          const moduleTemplates = {
            programming: [
              {
                title: "Project Setup",
                description: `Build the foundation for ${courseData.title || "this course"} with the right tools and environment.`,
              },
              {
                title: "Core Concepts",
                description:
                  "Understand the main principles behind the topic and how they connect in practice.",
              },
              {
                title: "Hands-on Build",
                description:
                  "Apply the concepts by creating a real feature or project step by step.",
              },
              {
                title: "Testing and Deployment",
                description:
                  "Review your work, fix issues, and prepare it for real-world use.",
              },
            ],
            design: [
              {
                title: "Design Foundations",
                description:
                  "Learn layout, hierarchy, and visual balance for better user experiences.",
              },
              {
                title: "Wireframing",
                description:
                  "Turn ideas into a clear structure before moving into detailed visuals.",
              },
              {
                title: "Visual System",
                description:
                  "Create a consistent experience using typography, color, and spacing.",
              },
              {
                title: "Prototype and Review",
                description:
                  "Refine the experience and prepare it for feedback or presentation.",
              },
            ],
            data: [
              {
                title: "Data Foundations",
                description:
                  "Learn the basics of working with datasets and common analysis methods.",
              },
              {
                title: "Exploratory Analysis",
                description:
                  "Explore patterns and trends to understand the story behind the data.",
              },
              {
                title: "Modeling Basics",
                description:
                  "Apply simple modeling concepts to make predictions or decisions.",
              },
              {
                title: "Insights and Reporting",
                description:
                  "Present your findings clearly through charts, summaries, and examples.",
              },
            ],
          };

          const modulePlan = categoryName.includes("design")
            ? moduleTemplates.design
            : categoryName.includes("data")
              ? moduleTemplates.data
              : moduleTemplates.programming;

          const template = modulePlan[idx] || modulePlan[modulePlan.length - 1];
          const moduleTitle =
            titleText.includes("Module") || titleText.includes("Lecture")
              ? template.title
              : titleText;
          const moduleDescription = lecture.description || template.description;

          return {
            title: moduleTitle,
            description: moduleDescription,
            duration: lecture.duration || `${Math.max(8, 10 + idx)} min`,
          };
        })
      : (() => {
          const categoryName = (courseData.category || "").toLowerCase();
          const templates = categoryName.includes("design")
            ? [
                {
                  title: "Design Foundations",
                  description:
                    "Learn layout, hierarchy, and visual balance for better user experiences.",
                },
                {
                  title: "Wireframing",
                  description:
                    "Turn ideas into a clear structure before moving into detailed visuals.",
                },
                {
                  title: "Visual System",
                  description:
                    "Create a consistent experience using typography, color, and spacing.",
                },
                {
                  title: "Interaction Patterns",
                  description:
                    "Design clear flows and interactions that guide the user smoothly.",
                },
                {
                  title: "UI Refinement",
                  description:
                    "Polish the interface so it feels more complete and user-friendly.",
                },
                {
                  title: "Prototype and Review",
                  description:
                    "Refine the experience and prepare it for feedback or presentation.",
                },
              ]
            : categoryName.includes("data")
              ? [
                  {
                    title: "Data Foundations",
                    description:
                      "Learn the basics of working with datasets and common analysis methods.",
                  },
                  {
                    title: "Exploratory Analysis",
                    description:
                      "Explore patterns and trends to understand the story behind the data.",
                  },
                  {
                    title: "Modeling Basics",
                    description:
                      "Apply simple modeling concepts to make predictions or decisions.",
                  },
                  {
                    title: "Validation Techniques",
                    description:
                      "Check the quality of your results and improve reliability.",
                  },
                  {
                    title: "Visualization Skills",
                    description:
                      "Turn analysis into clear charts and visuals that communicate insights.",
                  },
                  {
                    title: "Insights and Reporting",
                    description:
                      "Present your findings clearly through charts, summaries, and examples.",
                  },
                ]
              : [
                  {
                    title: "Project Setup",
                    description: `Build the foundation for ${courseData.title || "this course"} with the right tools and environment.`,
                  },
                  {
                    title: "Core Concepts",
                    description:
                      "Understand the main principles behind the topic and how they connect in practice.",
                  },
                  {
                    title: "Hands-on Build",
                    description:
                      "Apply the concepts by creating a real feature or project step by step.",
                  },
                  {
                    title: "Debugging and Refinement",
                    description:
                      "Identify issues, improve the implementation, and strengthen reliability.",
                  },
                  {
                    title: "Performance Basics",
                    description:
                      "Learn how to improve speed, quality, and maintainability in the build.",
                  },
                  {
                    title: "Testing and Deployment",
                    description:
                      "Review your work, fix issues, and prepare it for real-world use.",
                  },
                ];

          const moduleCount = Math.max(
            6,
            Math.min(6, courseData.totalLectures || 6),
          );
          return Array.from({ length: moduleCount }, (_, idx) => {
            const template = templates[idx] || templates[templates.length - 1];
            return {
              title: template.title,
              description: template.description,
              duration: `${Math.max(8, 12 + idx)} min`,
            };
          });
        })();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.18),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)]">
      {showDemoModal && demoCheckoutOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  QR payment
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  Scan to pay
                </h3>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {!paymentConfirmed ? (
              <>
                <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50 p-4 text-center">
                  <div className="mx-auto mb-3 flex h-32 w-32 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <svg viewBox="0 0 120 120" className="h-28 w-28">
                      <rect
                        x="8"
                        y="8"
                        width="24"
                        height="24"
                        rx="3"
                        fill="#4338ca"
                      />
                      <rect
                        x="88"
                        y="8"
                        width="24"
                        height="24"
                        rx="3"
                        fill="#4338ca"
                      />
                      <rect
                        x="8"
                        y="88"
                        width="24"
                        height="24"
                        rx="3"
                        fill="#4338ca"
                      />
                      <rect
                        x="32"
                        y="32"
                        width="16"
                        height="16"
                        rx="2"
                        fill="#4338ca"
                      />
                      <rect
                        x="56"
                        y="32"
                        width="16"
                        height="16"
                        rx="2"
                        fill="#4338ca"
                      />
                      <rect
                        x="80"
                        y="32"
                        width="16"
                        height="16"
                        rx="2"
                        fill="#4338ca"
                      />
                      <rect
                        x="32"
                        y="56"
                        width="16"
                        height="16"
                        rx="2"
                        fill="#4338ca"
                      />
                      <rect
                        x="56"
                        y="56"
                        width="16"
                        height="16"
                        rx="2"
                        fill="#4338ca"
                      />
                      <rect
                        x="80"
                        y="56"
                        width="16"
                        height="16"
                        rx="2"
                        fill="#4338ca"
                      />
                      <rect
                        x="56"
                        y="80"
                        width="16"
                        height="16"
                        rx="2"
                        fill="#4338ca"
                      />
                      <rect
                        x="32"
                        y="80"
                        width="16"
                        height="16"
                        rx="2"
                        fill="#e0e7ff"
                      />
                      <rect
                        x="80"
                        y="80"
                        width="16"
                        height="16"
                        rx="2"
                        fill="#e0e7ff"
                      />
                      <rect
                        x="104"
                        y="32"
                        width="8"
                        height="8"
                        rx="2"
                        fill="#4338ca"
                      />
                      <rect
                        x="104"
                        y="48"
                        width="8"
                        height="8"
                        rx="2"
                        fill="#4338ca"
                      />
                      <rect
                        x="104"
                        y="64"
                        width="8"
                        height="8"
                        rx="2"
                        fill="#4338ca"
                      />
                      <rect
                        x="104"
                        y="80"
                        width="8"
                        height="8"
                        rx="2"
                        fill="#4338ca"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    Scan this demo QR code
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Pay {demoCheckoutOrder.currency}{" "}
                    {Math.round(demoCheckoutOrder.amount / 100)} to confirm
                    enrollment.
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Course</span>
                    <span className="font-semibold text-slate-900">
                      {demoCheckoutOrder.courseName}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Reference</span>
                    <span className="font-mono text-xs text-slate-600">
                      {demoCheckoutOrder.orderId}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowDemoModal(false)}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDemoPayment}
                    disabled={isPurchasing}
                    className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
                  >
                    {isPurchasing ? "Processing..." : "Confirm Payment"}
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-xl text-white">
                  ✓
                </div>
                <h4 className="text-lg font-semibold text-emerald-800">
                  Enrollment confirmed
                </h4>
                <p className="mt-2 text-sm text-emerald-700">
                  Your payment was received and your access is now active.
                </p>
                <button
                  onClick={() => navigate(`/course-progress/${courseId}`)}
                  className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Open Learning View
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-700 text-white py-12 shadow-lg">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-indigo-50 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Premium learning experience
              </div>
              <h1 className="text-4xl font-bold mb-4 mt-4">
                {courseData.title}
              </h1>
              {courseData.subtitle && (
                <p className="text-xl text-indigo-100 mb-4">
                  {courseData.subtitle}
                </p>
              )}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <span>4.5 (128 reviews)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{studentCount} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{courseData.totalLectures || 0} lectures</span>
                </div>
              </div>
              <p className="mt-6 text-indigo-100">
                Instructor:{" "}
                <span className="font-semibold">
                  {courseData.instructor?.name}
                </span>
              </p>
            </div>

            {/* Purchase Card */}
            <div className="rounded-2xl border border-white/20 bg-white/95 p-6 text-slate-800 shadow-2xl backdrop-blur">
              <div className="text-4xl font-bold text-indigo-600 mb-4">
                ${courseData.price}
              </div>
              <img
                src={courseData.thumbnail}
                alt={courseData.title}
                className="w-full rounded-xl mb-4 object-cover h-40 shadow-sm"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (isEnrolled || isLearningView) {
                      navigate(`/course-progress/${courseId}`);
                      return;
                    }
                    handlePurchase();
                  }}
                  disabled={isPurchasing}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-indigo-400 ${
                    isEnrolled
                      ? "bg-emerald-600"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isPurchasing ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {isEnrolled ? (
                        <BookOpen className="w-5 h-5" />
                      ) : (
                        <ShoppingCart className="w-5 h-5" />
                      )}
                      {isEnrolled || isLearningView
                        ? "Continue Learning"
                        : "Enroll Now"}
                    </>
                  )}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                    isWishlisted
                      ? "border-pink-200 bg-pink-50 text-pink-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-pink-300 hover:text-pink-600"
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>
              </div>
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-700">
                30-day money-back guarantee
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLearningView && (
        <div className="container-main py-6">
          <section className="card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  Learning hub
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                  Resume your progress
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Your learning path is ready. Pick up where you left off and
                  keep moving forward.
                </p>
              </div>
              <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
                10% complete • 1 lesson in progress
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Next up</p>
                <p className="mt-2 text-sm text-slate-600">
                  {courseData.title} • Module 1:{" "}
                  {courseModules[0]?.title || "Getting started"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Study goal
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Review the core ideas and finish the first practice task.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Content Section */}
      <div className="container-main py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="card p-6">
              <h2 className="text-2xl font-bold mb-4">About this course</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {courseData.description}
              </p>
            </section>

            {/* What you'll learn */}
            <section className="card p-6">
              <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
              <ul className="space-y-3">
                {(() => {
                  const topicHints = {
                    programming: [
                      "Build a working project using modern tools and workflows",
                      "Understand core concepts through hands-on practice",
                      "Learn debugging, testing, and deployment basics",
                    ],
                    design: [
                      "Create polished interfaces with strong visual structure",
                      "Apply user-centered design principles to real screens",
                      "Turn ideas into clear wireframes and prototypes",
                    ],
                    data: [
                      "Work with data confidently using practical examples",
                      "Learn how to analyze patterns and communicate insights",
                      "Understand the basics of machine learning workflows",
                    ],
                    default: [
                      "Gain a strong foundation in the subject matter",
                      "Practice with guided examples and exercises",
                      "Learn methods you can apply right away",
                    ],
                  };

                  const categoryKey = (courseData.category || "")
                    .toLowerCase()
                    .includes("design")
                    ? "design"
                    : (courseData.category || "").toLowerCase().includes("data")
                      ? "data"
                      : (courseData.category || "")
                            .toLowerCase()
                            .includes("program") ||
                          (courseData.category || "")
                            .toLowerCase()
                            .includes("web")
                        ? "programming"
                        : "default";

                  return (topicHints[categoryKey] || topicHints.default).map(
                    (item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ),
                  );
                })()}
              </ul>
            </section>

            {/* Course Content */}
            <section className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Course Content</h2>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                  {courseModules.length} modules
                </span>
              </div>

              <div className="space-y-3">
                {courseModules.map((module, idx) => (
                  <div
                    key={`${module.title}-${idx}`}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {module.title}
                          </span>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {module.duration}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info Card */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Course Details</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="font-semibold text-gray-900">
                    {courseData.category}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Level</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {courseData.level}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total Lectures</p>
                  <p className="font-semibold text-gray-900">
                    {courseData.totalLectures || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-900">
                    {courseData.totalDuration || "Self-paced"}
                  </p>
                </div>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Instructor</h3>
              <div className="flex items-center gap-4">
                <img
                  src={
                    courseData.instructor?.avatar ||
                    "https://via.placeholder.com/60?text=Instructor"
                  }
                  alt={courseData.instructor?.name || "Instructor"}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{courseData.instructor?.name}</p>
                  <p className="text-sm text-gray-600">Instructor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
