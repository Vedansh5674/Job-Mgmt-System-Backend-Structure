import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { Briefcase, User, LogOut, Menu, Moon, Sun, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, theme, toggleTheme, isSidebarOpen, toggleSidebar } = useStore();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200 text-slate-900'
      } backdrop-blur-md`}
    >
      <Link to="/" className="flex items-center gap-3 text-indigo-600 font-bold text-2xl tracking-tighter">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
          <Briefcase size={24} className="text-white" />
        </div>
        <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>JobPortal</span>
      </Link>

      {/* Desktop Links */}
      <div className={`hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest ${
        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
      }`}>
        <Link to="/jobs" className="hover:text-indigo-500 transition-colors">Find Jobs</Link>
        {user && <Link to="/applications" className="hover:text-indigo-500 transition-colors">Applications</Link>}
        {user?.role === 'recruiter' && (
          <Link to="/post-job" className="hover:text-indigo-500 transition-colors bg-indigo-600 px-6 py-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            Post Job
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl transition-all ${
            theme === 'dark' ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-500'
          }`}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {user ? (
          <div className="flex items-center gap-4">
            <button className={`p-2.5 rounded-xl transition-all ${
              theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              <Bell size={20} />
            </button>
            <div className={`h-8 w-px mx-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black leading-tight truncate max-w-[100px]">{user?.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dashboard</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                {user?.name?.[0] || 'U'}
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className={`px-6 py-2.5 text-sm font-black transition-colors ${
              theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}>
              Log in
            </Link>
            <Link to="/signup" className="px-8 py-3 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-500/30">
              Get Started
            </Link>
          </div>
        )}


        {/* Mobile Menu Button */}
        <button 
          onClick={toggleSidebar}
          className={`md:hidden p-2 rounded-xl transition-all ${
            theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Menu size={20} />
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
