import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Zap, User, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const TAB_PASSWORD = 'password';
const TAB_OTP = 'otp';

export default function Auth() {
  const [tab, setTab] = useState(TAB_PASSWORD);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const { signIn, signUp, resetPassword, signInWithOtp } = useAuthStore();
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isForgotPassword) {
        await resetPassword(email);
        toast.success('Password reset link sent! Check your inbox 📧');
        setIsForgotPassword(false);
      } else if (isLogin) {
        await signIn(email, password);
        toast.success('Welcome back! 🎉');
        navigate('/');
      } else {
        await signUp(email, password);
        toast.success('Account created! Please verify your email 📩');
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithOtp(email);
      setOtpSent(true);
      toast.success('Magic link sent! Check your inbox 🔮');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (tab === TAB_OTP) return otpSent ? 'Check Your Email' : 'Magic Link Login';
    if (isForgotPassword) return 'Reset Password';
    return isLogin ? 'Welcome Back' : 'Create Account';
  };

  const getSubtitle = () => {
    if (tab === TAB_OTP) return otpSent ? `We sent a magic link to ${email}` : 'Sign in instantly — no password needed';
    if (isForgotPassword) return 'Enter your email to receive a reset link';
    return isLogin ? 'Enter your details to continue shopping' : 'Join VikaStore and enjoy premium products';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-emerald-100 blur-3xl opacity-60" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-violet-100 blur-3xl opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            VikaStore
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
          {/* Tab switcher */}
          {!isForgotPassword && (
            <div className="flex border-b border-gray-100">
              {[
                { id: TAB_PASSWORD, label: 'Password', icon: Lock },
                { id: TAB_OTP, label: 'Magic Link', icon: Zap },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { setTab(id); setOtpSent(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
                    tab === id
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-7">
              <h2 className="text-2xl font-black text-gray-900 mb-1">{getTitle()}</h2>
              <p className="text-sm text-gray-500">{getSubtitle()}</p>
            </div>

            <AnimatePresence mode="wait">
              {/* ── OTP / Magic Link Tab ── */}
              {tab === TAB_OTP && (
                <motion.div key="otp"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                >
                  {otpSent ? (
                    <div className="text-center space-y-5 py-4">
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Click the link in your email to sign in automatically. No password required!</p>
                      </div>
                      <button
                        onClick={() => { setOtpSent(false); setEmail(''); }}
                        className="text-emerald-600 text-sm font-medium hover:text-emerald-700"
                      >
                        Use a different email
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleOtpSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email" required value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200"
                      >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Zap className="h-4 w-4" /> Send Magic Link</>}
                      </button>
                      <p className="text-center text-xs text-gray-400">
                        We'll send a one-click login link to your inbox
                      </p>
                    </form>
                  )}
                </motion.div>
              )}

              {/* ── Password Tab ── */}
              {tab === TAB_PASSWORD && (
                <motion.div key="password"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                >
                  <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    {/* Full Name (signup only) */}
                    {!isLogin && !isForgotPassword && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text" required value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="Your full name"
                            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email" required value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    {!isForgotPassword && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">Password</label>
                          {isLogin && (
                            <button type="button" onClick={() => setIsForgotPassword(true)}
                              className="text-xs font-medium text-emerald-600 hover:text-emerald-500">
                              Forgot password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="block w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <button type="submit" disabled={loading}
                      className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200"
                    >
                      {loading
                        ? <Loader2 className="h-5 w-5 animate-spin" />
                        : <>{isForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}<ArrowRight className="h-4 w-4" /></>
                      }
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    {isForgotPassword ? (
                      <button onClick={() => setIsForgotPassword(false)}
                        className="text-sm font-medium text-gray-500 hover:text-emerald-600">
                        ← Back to Sign In
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button onClick={() => setIsLogin(!isLogin)}
                          className="font-bold text-emerald-600 hover:text-emerald-500">
                          {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to our <span className="text-emerald-600 cursor-pointer">Terms</span> & <span className="text-emerald-600 cursor-pointer">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
}
