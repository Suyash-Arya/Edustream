import { Link } from "react-router-dom";
import AppIcon from "../components/AppIcon";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-light py-20 md:py-28 overflow-hidden">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-semibold tracking-widest text-ink-600 bg-ink-50 px-3 py-1.5 rounded-full mb-6 uppercase">
                10,000+ courses, zero fluff
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-ink-800 leading-[1.1]">
                Learn skills that
                <br />
                actually{" "}
                <span className="marker-highlight text-ink-800">stick</span>.
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                Join millions of learners building real skills with
                world-class courses from working practitioners.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/browse"
                  className="btn-primary flex items-center gap-2 text-base"
                >
                  Explore Courses
                  <AppIcon name="arrow-right" className="w-5 h-5" />
                </Link>
                <Link to="/signup" className="btn-secondary text-base">
                  Get Started
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 ruled-paper">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="w-11 h-11 rounded-lg bg-ink-50 flex items-center justify-center flex-shrink-0">
                      <AppIcon
                        name="book-open"
                        className="w-5 h-5 text-ink-600"
                      />
                    </span>
                    <p className="font-medium text-ink-800">
                      10,000+ courses available
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-11 h-11 rounded-lg bg-gold-50 flex items-center justify-center flex-shrink-0">
                      <AppIcon name="users" className="w-5 h-5 text-gold-600" />
                    </span>
                    <p className="font-medium text-ink-800">
                      5 Million+ active learners
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-11 h-11 rounded-lg bg-ink-50 flex items-center justify-center flex-shrink-0">
                      <AppIcon
                        name="trophy"
                        className="w-5 h-5 text-ink-600"
                      />
                    </span>
                    <p className="font-medium text-ink-800">
                      Expert instructors worldwide
                    </p>
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
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4 text-ink-800">
            Why choose EduStream?
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-xl mx-auto">
            Everything you need to go from curious to capable, at your own
            pace.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <AppIcon name="book-open" className="w-7 h-7" />,
                title: "Diverse Courses",
                desc: "Learn from thousands of courses across all subjects and skill levels.",
              },
              {
                icon: <AppIcon name="users" className="w-7 h-7" />,
                title: "Expert Instructors",
                desc: "Learn from industry professionals and experienced educators.",
              },
              {
                icon: <AppIcon name="zap" className="w-7 h-7" />,
                title: "Learn at Your Pace",
                desc: "Study on your own schedule with lifetime access to course materials.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="card p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-ink-50 text-ink-600 flex items-center justify-center mx-auto mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-bold mb-3 text-ink-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-ink-600 text-white py-16">
        <div className="container-main text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to start learning?
          </h2>
          <p className="text-lg text-ink-200 mb-8">
            Join thousands of students already learning on EduStream
          </p>
          <Link to="/signup" className="inline-block btn-accent text-base">
            Sign Up Now for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
