import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  PlusCircle,
  Bell,
  Search,
  Users
} from 'lucide-react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, theme, isSidebarOpen, toggleSidebar } = useStore();
  const location = useLocation();

  const seekerLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Find Jobs', icon: Search, path: '/jobs' },
    { name: 'Applications', icon: FileText, path: '/applications' },
  ];

  const recruiterLinks = [
    { name: 'Recruiter Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Post a Job', icon: PlusCircle, path: '/post-job' },
    { name: 'My Listings', icon: Briefcase, path: '/jobs' },
    { name: 'Candidates', icon: Users, path: '/candidates' },
  ];

  const links = user?.role === 'recruiter' ? recruiterLinks : seekerLinks;

  return (
    <motion.div 
      animate={{ width: isSidebarOpen ? 280 : 88 }}
      className={`fixed top-0 left-0 h-screen z-50 transition-colors duration-300 border-r flex flex-col ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <Briefcase className="text-white" size={24} />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`font-black text-xl tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
            >
              JobPortal
            </motion.span>
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.path} 
              to={link.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : (theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900')
              }`}
            >
              <link.icon size={22} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-bold text-sm"
                >
                  {link.name}
                </motion.span>
              )}
              {!isSidebarOpen && (
                <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all origin-left bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap z-50">
                  {link.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800/50">
        <button 
          onClick={toggleSidebar}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
            theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          {isSidebarOpen && <span className="font-bold text-sm">Collapse Sidebar</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
