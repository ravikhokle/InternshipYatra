import { useState } from "react";
import { Link } from "react-router-dom";
import { handleError, handleSuccess } from "../Utils";
import axiosInstance from "../api/axiosInstance";

const CONTACT_EMAIL = "ravikhokle1@gmail.com";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return handleError("Please fill in name, email, and message");
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/contact/send", {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      if (response.data.success) {
        handleSuccess("Message sent successfully");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 text-sm border border-gray-300 rounded outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 bg-white";

  return (
    <div className="min-h-screen bg-gray-50 md:px-32">
      <div className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-center text-purple-900 mb-10">
          Contact Us
        </h1>

        <div className="w-full bg-white p-6 sm:p-8 border-t-4 border-purple-600">
          <p className="text-lg text-gray-700 mb-4">
            Have a question about internships, your account, or posting a role? Reach out to the{" "}
            <span className="text-purple-800 font-semibold">InternshipYatra</span> team — we&apos;re happy to help.
          </p>
          <p className="text-lg text-gray-700 mb-8">
            Fill in the form below and we&apos;ll get back to you within 1–2 business days.
          </p>

          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Your email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className={`${inputClass} resize-y min-h-[120px]`}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            <div className="md:col-span-2 space-y-5 text-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Get in touch</h2>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Email</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-purple-600 hover:underline break-all">
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">LinkedIn</p>
                <a
                  href="https://in.linkedin.com/in/ravikhokle"
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  Ravi Khokle
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">GitHub</p>
                <a
                  href="https://github.com/ravikhokle"
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  ravikhokle
                </a>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed pt-2">
                We typically respond within 1–2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
