import { Link } from 'react-router-dom';
import { Bell, Search, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import useStore from '../../store/useStore';
import Sidebar from '../Sidebar';

const DashboardLayout = ({ children }) => {
  const { user, theme, toggleTheme, logout, isSidebarOpen } = useStore();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div 
        className="transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? '280px' : '88px' }}
      >
        {/* Topbar */}
        <header className={`h-20 px-8 flex items-center justify-between sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300 ${
          theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200 text-slate-900'
        }`}>
          {/* Breadcrumbs or Page Title could go here */}
          <div className="flex items-center gap-4 flex-1">
             <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
               theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
             } border`}>
                <Search size={18} className="text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Quick search..." 
                  className="bg-transparent border-none outline-none text-sm w-48 md:w-64"
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all ${
                theme === 'dark' ? 'bg-slate-900 hover:bg-slate-800 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
              }`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <button className={`p-2.5 rounded-xl transition-all relative ${
              theme === 'dark' ? 'bg-slate-900 hover:bg-slate-800 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
            }`}>
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-100 dark:border-slate-950" />
            </button>

            <div className={`h-8 w-px mx-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black leading-tight">{user?.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
                {user?.name?.[0] || 'U'}
              </div>
              <button 
                onClick={logout}
                className={`p-2.5 rounded-xl transition-all ${
                  theme === 'dark' ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-red-500'
                }`}
                title="Log out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
