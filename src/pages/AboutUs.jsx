import { motion } from 'framer-motion';
import { Shield, Sparkles, Trophy, Users } from 'lucide-react';
import { useEffect } from 'react';

export default function AboutUs() {
  useEffect(() => {
    document.title = "About Us | VikaStore";
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1.5 rounded-full uppercase tracking-widest"
          >
            Our Journey
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black mt-4 mb-6 leading-tight"
          >
            We are redefining the way you shop online.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-200 text-lg leading-relaxed max-w-2xl mx-auto"
          >
            VikaStore started with a simple vision: to bridge the gap between quality products and convenient online shopping. Today, we bring thousands of curated products straight to your doorstep.
          </motion.p>
        </div>
      </section>

      {/* Stats Counter Row */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '50K+', label: 'Happy Customers' },
            { value: '20K+', label: 'Products Sold' },
            { value: '24/7', label: 'Support Available' },
            { value: '99.8%', label: 'Delivery Rate' }
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-600">{stat.value}</p>
              <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Mission & Vision */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900 leading-tight">Our Mission & Values</h2>
          <p className="text-gray-600 leading-relaxed">
            At VikaStore, we are committed to delivering excellence. We believe that premium products shouldn't come with a premium headache. Our curated collections of Electronics, Fashion, Furniture, and Accessories are source-verified to guarantee authenticity.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our company operates on three core principles: integrity in sourcing, absolute transparency in pricing, and a customer-first mindset that prioritizes long-term relationships over short-term gains.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Shield, title: 'Authenticity Guarantee', desc: '100% genuine products sourced directly from brands.' },
            { icon: Sparkles, title: 'Vetted Quality', desc: 'Every item goes through rigorous quality checks.' },
            { icon: Trophy, title: 'Top-tier Service', desc: 'Industry leading delivery times and returns.' },
            { icon: Users, title: 'Community Focused', desc: 'Dedicated to serving and empowering our patrons.' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2 hover:shadow-md transition-shadow">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-max">
                <item.icon className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership / Core Team */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-gray-900">Meet Our Team</h2>
          <p className="text-gray-500 mt-2 text-sm">The minds behind VikaStore dedicated to your satisfaction.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { name: 'Vikash Pandey', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
            { name: 'Rohan Sharma', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
            { name: 'Neha Gupta', role: 'Customer Experience Lead', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' }
          ].map((member, i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-center p-6 group hover:shadow-lg transition-shadow">
              <img 
                src={member.img} 
                alt={member.name} 
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-emerald-50 mb-4 group-hover:scale-105 transition-transform" 
              />
              <h4 className="font-bold text-gray-900">{member.name}</h4>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
