import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, Truck, RefreshCw, CreditCard, User, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ_DATA = [
  {
    category: 'Shipping',
    icon: Truck,
    questions: [
      { q: 'How long does shipping take?', a: 'Standard shipping takes 3-5 business days depending on your location. Express delivery (available in select metro cities) takes 24-48 hours.' },
      { q: 'Do you ship internationally?', a: 'Currently, VikaStore only operates and ships within India. We plan to expand to international markets in the future.' },
      { q: 'How can I track my order?', a: 'Once your order is shipped, a tracking link will be updated in your order history page under My Account > Orders. You will also receive an SMS with tracking details.' }
    ]
  },
  {
    category: 'Returns',
    icon: RefreshCw,
    questions: [
      { q: 'What is your return policy?', a: 'We offer a 10-day return policy on most items. Products must be returned in their original packaging with all tags intact.' },
      { q: 'How do I request a refund?', a: 'Go to your Orders page, find the order you want to return, and click on Request Refund. A courier partner will pick up the item within 48 hours, and refunds will be processed to the original payment mode.' },
      { q: 'Can I exchange an item?', a: 'We do not support direct exchanges. Please return the item for a refund and place a new order for the preferred variant.' }
    ]
  },
  {
    category: 'Payments',
    icon: CreditCard,
    questions: [
      { q: 'What payment modes are accepted?', a: 'We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), and Cash on Delivery (COD).' },
      { q: 'Is COD available for all products?', a: 'COD is available for orders below ₹10,000. Orders above this threshold must be pre-paid using cards or UPI for security reasons.' },
      { q: 'Is my payment transaction secure?', a: 'Yes. All payments are processed through secure, PCI-DSS compliant partner gateways (Dodo Payments) with 256-bit encryption.' }
    ]
  }
];

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('Shipping');
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    document.title = "Help Center | VikaStore";
  }, []);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Find questions matching active category or matching search
  const currentCategoryData = FAQ_DATA.find(d => d.category === activeCategory) || FAQ_DATA[0];
  
  const displayQuestions = search.trim() === '' 
    ? currentCategoryData.questions 
    : FAQ_DATA.flatMap(cat => cat.questions).filter(q => 
        q.q.toLowerCase().includes(search.toLowerCase()) || 
        q.a.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <HelpCircle className="h-12 w-12 text-emerald-400 mx-auto" />
          <h1 className="text-4xl font-black">How can we help you today?</h1>
          {/* Search bar */}
          <div className="relative max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 mt-6 overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search help articles and questions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm focus:outline-none text-gray-950 font-medium placeholder-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Tabs by Category (only show if not searching) */}
      {search.trim() === '' && (
        <section className="max-w-4xl mx-auto px-4 mt-8 flex justify-center gap-4 flex-wrap">
          {FAQ_DATA.map(cat => {
            const Icon = cat.icon;
            return (
              <button 
                key={cat.category}
                onClick={() => { setActiveCategory(cat.category); setOpenIndex(null); }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all border cursor-pointer ${
                  activeCategory === cat.category 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/10' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.category}
              </button>
            );
          })}
        </section>
      )}

      {/* Accordion Questions */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-4">
          <h3 className="text-xl font-black text-gray-900 mb-6">
            {search.trim() === '' ? `${activeCategory} FAQs` : 'Search Results'}
          </h3>

          {displayQuestions.length === 0 ? (
            <div className="text-center py-10 text-gray-500 font-medium">
              No matching questions found. Try search keywords like "shipping", "refund", or "UPI".
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {displayQuestions.map((faq, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <button 
                    onClick={() => handleToggle(i)}
                    className="w-full flex items-center justify-between gap-4 text-left font-bold text-gray-900 hover:text-emerald-700 transition-colors py-2"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openIndex === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed bg-gray-50 p-4 rounded-xl">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Help Support Card */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-8 text-center text-white mt-12 space-y-4">
          <MessageSquare className="h-10 w-10 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold">Still have questions?</h3>
          <p className="text-emerald-200 text-sm max-w-sm mx-auto">Our support team is always ready to assist you with order issues, refund tracking, and corporate queries.</p>
          <Link 
            to="/contact" 
            className="inline-flex bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}
