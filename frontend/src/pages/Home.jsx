import { Link } from "react-router-dom";
import AppIcon from "../components/AppIcon";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Learn Anything, Become Anything
              </h1>
              <p className="text-xl text-indigo-100 mb-8">
                Join millions of learners and start your journey with
                world-class courses from industry experts.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/browse"
                  className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition flex items-center gap-2"
                >
                  Explore Courses{" "}
                  <AppIcon name="arrow-right" className="w-5 h-5" />
                </Link>
                <Link
                  to="/signup"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-indigo-600 transition"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <AppIcon name="book-open" className="w-6 h-6" />
                    <p>10,000+ courses available</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <AppIcon name="users" className="w-6 h-6" />
                    <p>5 Million+ active learners</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <AppIcon name="trophy" className="w-6 h-6" />
                    <p>Expert instructors worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-main">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose EduStream?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <AppIcon name="book-open" className="w-8 h-8" />,
                title: "Diverse Courses",
                desc: "Learn from thousands of courses across all subjects and skill levels.",
              },
              {
                icon: <AppIcon name="users" className="w-8 h-8" />,
                title: "Expert Instructors",
                desc: "Learn from industry professionals and experienced educators.",
              },
              {
                icon: <AppIcon name="zap" className="w-8 h-8" />,
                title: "Learn at Your Pace",
                desc: "Study on your own schedule with lifetime access to course materials.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="card p-8 text-center hover:shadow-xl transition"
              >
                <div className="text-indigo-600 flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container-main text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of students already learning on EduStream
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Sign Up Now for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
