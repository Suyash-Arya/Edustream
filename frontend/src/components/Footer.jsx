import AppIcon from "./AppIcon";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-700 text-white mt-20">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <span className="w-8 h-8 rounded-lg bg-gold-400 flex items-center justify-center flex-shrink-0">
                <AppIcon name="play" className="w-3.5 h-3.5 text-ink-800" />
              </span>
              <h3 className="text-lg font-display font-bold">EduStream</h3>
            </div>
            <p className="text-ink-200">
              Learn anything, anywhere, anytime. High-quality online courses
              from industry experts.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-ink-100">Platform</h4>
            <ul className="space-y-2 text-ink-300">
              <li>
                <a href="#" className="hover:text-gold-300 transition">
                  Browse Courses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-300 transition">
                  Become Instructor
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-300 transition">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-ink-100">Support</h4>
            <ul className="space-y-2 text-ink-300">
              <li>
                <a href="#" className="hover:text-gold-300 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-300 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-300 transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-ink-100">Legal</h4>
            <ul className="space-y-2 text-ink-300">
              <li>
                <a href="#" className="hover:text-gold-300 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-300 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-300 transition">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-500 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-ink-300 mb-4 md:mb-0">
            &copy; {currentYear} EduStream. All rights reserved.
          </p>
          <p className="text-ink-300 flex items-center space-x-1">
            <span>Made with</span>
            <AppIcon name="heart" className="w-4 h-4 text-gold-400" />
            <span>for learners worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
