// ================================
// CONTACT PAGE
// ================================
export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
          <p className="text-center text-gray-300">
            Have questions, feedback, or partnership inquiries? We’d love to hear from you.
          </p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
            />

            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 transition px-4 py-3 rounded-lg font-semibold"
            >
              Send Message
            </button>
          </form>

          <div className="border-t border-gray-700 pt-4 text-sm text-gray-400">
            <p>Email: support@trendwatch.app</p>
            <p>Business & Partnerships: partners@trendwatch.app</p>
            <p className="mt-2">Response time: 24–48 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}