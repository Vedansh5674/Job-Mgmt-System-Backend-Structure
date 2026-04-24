import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, Eye, EyeOff, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import useStore from '../store/useStore';
import axios from 'axios';
import { motion } from 'framer-motion';

const AuthPage = ({ mode = 'login' }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'seeker' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, theme } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'signup' ? '/api/users' : '/api/users/login';
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, formData);
      login(data);
      navigate('/dashboard'); // Direct to dashboard after login
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
    }`}>
      {/* Visual Side Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 border-r border-slate-800/50">
        <img 
          src="file:///C:/Users/Dell/.gemini/antigravity/brain/24cc2b4b-51e5-4bed-aaa3-cf94fc09361b/modern_workspace_auth_1776489660773.png" 
          alt="Workspace" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:opacity-100 transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        <div className="relative z-10 p-20 flex flex-col justify-end h-full">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
           >
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/40">
                <Briefcase size={32} className="text-white" />
              </div>
              <h2 className="text-5xl font-black mb-6 tracking-tighter leading-tight text-white">
                Unlock your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">professional potential.</span>
              </h2>
              <div className="space-y-4">
                 {[
                   'AI-Powered Job Matching',
                   'Real-time Application Tracking',
                   'Modern Recruiter Insights'
                 ].map((feature, i) => (
                   <div key={i} className="flex items-center gap-3 text-slate-400 font-bold">
                     <CheckCircle2 size={18} className="text-indigo-500" />
                     {feature}
                   </div>
                 ))}
              </div>
           </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center px-10 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
             <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Briefcase size={24} className="text-white" />
             </div>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-black mb-3 tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 font-bold text-sm">
              {mode === 'login' ? "Please enter your credentials to continue" : "Join thousands of professionals in our ecosystem"}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold flex items-center gap-3"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe"
                    className={`w-full border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${
                      theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                    }`}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="you@example.com"
                  className={`w-full border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                  }`}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                {mode === 'login' && <button type="button" className="text-xs font-black text-indigo-500 hover:underline">Forgot?</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className={`w-full border rounded-2xl py-4 pl-12 pr-12 text-sm font-bold outline-none transition-all ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                  }`}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Joining as...</label>
                <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, role: 'seeker'})}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black transition-all ${formData.role === 'seeker' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-400'}`}
                  >
                    Job Seeker
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, role: 'recruiter'})}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black transition-all ${formData.role === 'recruiter' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-400'}`}
                  >
                    Recruiter
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white py-4.5 rounded-2xl font-black transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 font-bold text-sm">
            {mode === 'login' ? "New to the platform?" : "Already have an account?"}{' '}
            <Link to={mode === 'login' ? "/signup" : "/login"} className="text-indigo-500 hover:underline">
              {mode === 'login' ? "Register now" : "Log in here"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
