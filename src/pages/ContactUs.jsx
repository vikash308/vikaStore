import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Contact Us | VikaStore";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you! Your message has been received.");
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl font-black mb-4"
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="text-emerald-200"
          >
            Have a question, feedback, or need help? Send us a message, and our support team will reply within 24 hours.
          </motion.p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-5 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h3 className="text-xl font-black text-gray-900 mb-2 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
              Contact Information
            </h3>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Call Us</p>
                <p className="text-gray-600 text-sm mt-0.5">1800-202-9898</p>
                <p className="text-gray-400 text-xs mt-0.5">Mon - Sat, 9 AM - 6 PM IST</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Email Us</p>
                <p className="text-gray-600 text-sm mt-0.5">support@vikastore.com</p>
                <p className="text-gray-400 text-xs mt-0.5">For queries, order updates, and issues</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Our Headquarters</p>
                <p className="text-gray-600 text-sm mt-0.5">VikaStore HQ, Bandra Kurla Complex</p>
                <p className="text-gray-400 text-xs mt-0.5">Mumbai, Maharashtra, 400051</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Support Hours</p>
                <p className="text-gray-600 text-sm mt-0.5">24/7 Digital Assistant</p>
                <p className="text-gray-400 text-xs mt-0.5">Human replies: Mon-Sat, 9AM-8PM</p>
              </div>
            </div>
          </div>

          {/* Stylized Google Map Placeholder */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-48 relative flex items-center justify-center text-center p-4">
            <div className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80')" }}></div>
            <div className="relative z-10 space-y-2">
              <MapPin className="h-8 w-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-gray-950 text-sm">Find us on Maps</p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-emerald-700 font-bold hover:underline inline-block bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100"
              >
                Open Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h3 className="text-2xl font-black text-gray-900 mb-6">Send Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" required
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm bg-gray-50/50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" required
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm bg-gray-50/50 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
              <input 
                type="text" required
                value={form.subject}
                onChange={e => setForm({...form, subject: e.target.value})}
                placeholder="Product Inquiry, Order Delay..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm bg-gray-50/50 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
              <textarea 
                rows={5} required
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm bg-gray-50/50 focus:bg-white resize-none transition-colors"
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
            >
              {loading ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
