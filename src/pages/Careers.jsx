import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Calendar, X, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const OPEN_ROLES = [
  {
    id: 1,
    title: 'Senior React Developer',
    department: 'Engineering',
    location: 'Remote (India)',
    salary: '₹18,00,000 - ₹24,00,000 / year',
    type: 'Full-time',
    description: 'We are looking for a Senior React Developer to join our core product team. You will lead development of our e-commerce client, improve web performance, and collaborate with UX designers.',
    requirements: ['4+ years of professional React experience', 'Solid understanding of Web Performance & Bundling', 'Experience with TailwindCSS and Framer Motion']
  },
  {
    id: 2,
    title: 'Product UI/UX Designer',
    department: 'Design',
    location: 'Mumbai, India (Hybrid)',
    salary: '₹12,00,000 - ₹16,00,000 / year',
    type: 'Full-time',
    description: 'Join us to design the future of premium e-commerce interfaces. You will create user flows, wireframes, style guides, and design systems in Figma.',
    requirements: ['3+ years UI/UX Design experience with portfolio', 'Proficiency in Figma, design systems, and mobile-first layouts', 'Understanding of basic HTML/CSS is a plus']
  },
  {
    id: 3,
    title: 'Logistics Operations Lead',
    department: 'Supply Chain',
    location: 'Mumbai, India',
    salary: '₹8,00,000 - ₹12,00,000 / year',
    type: 'Full-time',
    description: 'Ensure orders are dispatched on time and handle vendor relationships. You will optimize packaging operations and coordinate with express delivery partners.',
    requirements: ['Experience with ERP tools and inventory databases', 'Prior operations experience in e-commerce logistics', 'Strong communication and problem-solving skills']
  }
];

export default function Careers() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', portfolio: '', resume: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "Careers | VikaStore";
  }, []);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.resume) {
      toast.error("Please fill in Name, Email, and provide a Resume link.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      toast.success("Application submitted successfully!");
    }, 1500);
  };

  const handleCloseModal = () => {
    setSelectedRole(null);
    setSuccess(false);
    setFormData({ name: '', email: '', portfolio: '', resume: '', message: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Careers</span>
          <h1 className="text-4xl sm:text-5xl font-black">Build the Future of E-Commerce</h1>
          <p className="text-emerald-200 max-w-2xl mx-auto">
            We are looking for passionate, driven individuals who want to craft world-class shopping experiences. Join a fast-growing team that values creative thinking, customer obsession, and work-life harmony.
          </p>
        </div>
      </section>

      {/* Perks and Benefits */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Why Work With Us?</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { title: 'Work From Anywhere', desc: 'Remote-first culture with hybrid office space options for collab sessions.' },
            { title: 'Health & Wellness', desc: 'Comprehensive medical coverage for you and your direct family members.' },
            { title: 'Learning Allowance', desc: 'Annual budget for courses, books, and attending tech/design conferences.' }
          ].map((perk, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
              <h4 className="font-extrabold text-gray-950 text-lg">{perk.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Job Openings */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-black text-gray-900 mb-8">Current Openings</h2>
        <div className="space-y-6">
          {OPEN_ROLES.map(role => (
            <div key={role.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg">{role.department}</span>
                  <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-lg">{role.type}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{role.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-2 font-medium">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {role.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {role.salary}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRole(role)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer self-start md:self-center"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form Modal */}
      <AnimatePresence>
        {selectedRole && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-8 border border-gray-100 relative"
            >
              <button 
                onClick={handleCloseModal}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              {!success ? (
                <>
                  <div className="mb-6">
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider">{selectedRole.department}</span>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">Apply for {selectedRole.title}</h3>
                  </div>

                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Link to Resume / CV</label>
                      <input 
                        type="url" required
                        value={formData.resume}
                        onChange={e => setFormData({...formData, resume: e.target.value})}
                        placeholder="https://drive.google.com/file/d/... or Linkedin URL"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Link to Portfolio (Optional)</label>
                      <input 
                        type="url"
                        value={formData.portfolio}
                        onChange={e => setFormData({...formData, portfolio: e.target.value})}
                        placeholder="https://behance.net/john or GitHub"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Introduce Yourself</label>
                      <textarea 
                        rows={3}
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        placeholder="Why are you a good fit for this role?"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm resize-none"
                      />
                    </div>

                    <button 
                      type="submit" disabled={submitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                    >
                      {submitting ? 'Submitting Application...' : 'Submit Application'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
                  <h3 className="text-2xl font-black text-gray-900">Application Submitted!</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Thank you for applying for the **{selectedRole.title}** position. We have sent a confirmation email to **{formData.email}** and our hiring team will get back to you shortly.
                  </p>
                  <button 
                    onClick={handleCloseModal}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-6 py-3 rounded-xl border border-emerald-200 mt-4"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
