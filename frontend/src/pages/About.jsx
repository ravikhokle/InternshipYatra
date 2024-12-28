import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 md:px-32">
      <div className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-center text-purple-900 mb-10">
          About Us
        </h1>
        <div className="w-full bg-white p-6 border-t-4 border-purple-600">
          <p className="text-lg text-gray-700 mb-4">
            Welcome to <span className="text-purple-800 font-semibold">Internship Kro</span>, where opportunities meet passion and growth becomes a journey.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Founded by <strong className="text-gray-800">Ravi Khokle</strong>, a passionate and driven individual with a vision to bridge the gap between education and real-world experiences, this platform is built on the belief that internships are the cornerstone of professional growth. Ravi’s journey as a full-stack web developer and his dedication to empowering young professionals inspire our mission to create meaningful career pathways.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Our platform connects enthusiastic learners with industry-leading opportunities. Whether you're a student eager to explore your field, a recent graduate seeking practical exposure, or a professional looking to upskill, we’re here to help you take the next step in your career.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            At <span className="text-purple-800 font-semibold">Internship Kro</span>, we are committed to cultivating talent, fostering innovation, and inspiring excellence. By partnering with top organizations across various domains, we ensure you gain hands-on experience, develop critical skills, and build a network that propels you toward success.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Join us and embark on a transformative journey where internships are more than just a stepping stone – they’re a launchpad for your future.
          </p>
          <p className="text-lg text-gray-800 font-semibold">
            Together, let’s turn ambition into achievement!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
