import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 md:px-32">
      <div className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-center text-purple-900 mb-3">About Us</h1>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          A simple platform to discover internships and connect talent with opportunity.
        </p>

        <div className="w-full bg-white p-6 sm:p-8 border-t-4 border-purple-600 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What is InternshipYatra?</h2>
            <p className="text-gray-700 leading-relaxed">
              <span className="text-purple-800 font-semibold">InternshipYatra</span> helps students and
              job seekers find internship openings, build a professional profile, and apply directly from
              the platform. Recruiters can post roles and review applicants through their dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">For students</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Browse and filter internships by skills, location, and stipend</li>
              <li>Create a profile with resume, skills, and education</li>
              <li>Apply in a few clicks and track your applications</li>
              <li>Share a public profile when recruiters need to reach you</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">For recruiters</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Post internship openings with detailed descriptions</li>
              <li>Review applicants and their resumes in one place</li>
              <li>Reach candidates through profiles they choose to make public</li>
            </ul>
          </section>

          <section className="pt-2 border-t border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              Built by <span className="font-medium text-gray-900">Ravi Khokle</span> with a focus on
              making internships easier to find and apply for — without unnecessary complexity.
            </p>
          </section>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/"
              className="px-6 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded hover:bg-purple-700 transition-colors"
            >
              Browse Internships
            </Link>
            <Link
              to="/contact"
              className="px-6 py-2.5 border border-purple-600 text-purple-600 text-sm font-semibold rounded hover:bg-purple-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
