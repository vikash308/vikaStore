import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, User, Clock, ArrowRight, X } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Top 5 Wireless Headphones to Buy in 2026',
    excerpt: 'Looking for the best noise cancellation and battery life? We compare the industry-leading headphones from Sony, Bose, and Apple.',
    body: 'Music and focus go hand in hand, and noise-cancelling headphones have become essential for remote work and travel. In this comprehensive guide, we compare the Sony WH-1000XM5, Bose QuietComfort Ultra, and Apple AirPods Max. We look at three main components: comfort for long hours, the effectiveness of active noise cancellation (ANC), and sound profiles. While Apple offers premium metal build, Sony wins in battery life and microphone clarity, making it our top recommendation for business professionals.',
    tag: 'Tech',
    date: 'May 18, 2026',
    author: 'Aarav Mehta',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'How to Build an Ergonomic Work-From-Home Office',
    excerpt: 'Say goodbye to back pain. Here is how to configure your desk height, choose the right chair, and adjust your monitors.',
    body: 'Working from home offers flexibility, but it can take a toll on physical health if setup incorrectly. An ergonomic chair like the Herman Miller Aeron is a solid investment. Additionally, ensure your monitor is at eye level (about 20-30 inches away) to prevent neck strain. Your elbows should form a 90-degree angle when typing, and your feet must rest flat on the floor. Take short 5-minute stretching breaks every hour to maintain circulation.',
    tag: 'Home',
    date: 'May 12, 2026',
    author: 'Neha Sen',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Sustainable Fashion Trends: What to Look For',
    excerpt: 'Discover how to build a capsule wardrobe using organic cotton, recycled polyester, and ethically-sourced materials.',
    body: 'Fast fashion is one of the highest contributors to global waste. Moving towards a sustainable capsule wardrobe is simple: focus on quality over quantity. Choose natural, biodegradable materials like organic linen, organic cotton, and responsibly-sourced wool. Brands like Levi\'s now use waterless technology to reduce water footprint during denim production. Wash garments in cold water to extend lifecycle and prevent fiber shedding.',
    tag: 'Fashion',
    date: 'Apr 28, 2026',
    author: 'Sanya Kapoor',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80'
  }
];

export default function Blog() {
  const [posts, setPosts] = useState(BLOG_POSTS);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    document.title = "Blog & Guides | VikaStore";
  }, []);

  const filtered = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTag === 'All' || post.tag === activeTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">VikaStore Journal</span>
          <h1 className="text-4xl font-black">Lifestyle, Tech & Shopping Guides</h1>
          <p className="text-emerald-200">Tips, comparisons, and styling guides handpicked by our expert editors.</p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="max-w-6xl mx-auto px-4 mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Tag Filters */}
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['All', 'Tech', 'Home', 'Fashion'].map(tag => (
            <button 
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTag === tag ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 bg-white rounded-xl border border-gray-200">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">No articles found</h3>
            <p className="text-gray-500 mt-2">Try clearing your filters or changing your query.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map(post => (
              <div 
                key={post.id} 
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow group cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="h-48 overflow-hidden bg-gray-50 relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black uppercase px-2.5 py-1 rounded-lg">
                    {post.tag}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex gap-4 text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs font-bold text-emerald-600">
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-gray-400" /> {post.author}</span>
                    <span className="flex items-center gap-1">Read More <ArrowRight className="h-3.5 w-3.5" /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 relative"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-sm hover:bg-gray-100 rounded-full transition-colors z-10 shadow-sm border border-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              <div className="h-64 sm:h-80 bg-gray-100 relative">
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-6 left-6 bg-emerald-600 text-white text-xs font-black uppercase px-3 py-1.5 rounded-xl">
                  {selectedPost.tag}
                </span>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex gap-4 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {selectedPost.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {selectedPost.readTime}</span>
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> By {selectedPost.author}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug">{selectedPost.title}</h2>
                </div>

                <div className="text-gray-600 leading-relaxed space-y-4 text-base">
                  <p className="font-semibold text-gray-700 italic border-l-4 border-emerald-500 pl-4">
                    {selectedPost.excerpt}
                  </p>
                  <p>{selectedPost.body}</p>
                  <p>In conclusion, when purchasing new goods, always look for warranty details, compare key features, and choose sustainable brands that prioritize circular supply chain operations. Be sure to check back next week as we write about ergonomic home accessories and mechanical keyboards.</p>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    Back to Blog
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
