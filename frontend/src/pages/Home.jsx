import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/jobs?q=${keyword}`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-73px)]">
      {/* Hero Section */}
      <section className="relative py-20 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            The #1 job platform for developers
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Find your next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">
              dream career
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Connect with top companies hiring for remote, full-time, and internship roles. 
            Join thousands of professionals already working at their dream jobs.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-3xl bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2 shadow-2xl shadow-black/40"
        >
          <div className="flex-1 flex items-center px-4 w-full border-b md:border-b-0 md:border-r border-slate-700 pb-2 md:pb-0">
            <Search className="text-slate-500 mr-3" size={20} />
            <input 
              type="text" 
              placeholder="Job title, keywords, or company..."
              className="bg-transparent border-none outline-none text-white w-full py-3 text-sm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="flex-1 flex items-center px-4 w-full">
            <MapPin className="text-slate-500 mr-3" size={20} />
            <input 
              type="text" 
              placeholder="Location..."
              className="bg-transparent border-none outline-none text-white w-full py-3 text-sm"
            />
          </div>
          <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all whitespace-nowrap"
          >
            Search Jobs
          </button>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 w-full max-w-4xl">
          {[
            { label: 'Live Jobs', value: '12k+' },
            { label: 'Companies', value: '450+' },
            { label: 'New Daily', value: '100+' },
            { label: 'Hired', value: '8k+' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white mb-1">{stat.value}</span>
              <span className="text-slate-500 text-sm uppercase tracking-wider font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories / Bento Section Placeholder */}
      <section className="bg-slate-900/50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white">Popular Categories</h2>
            <button className="text-indigo-400 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Software Engineering', 'Design', 'Marketing', 'Data Science'].map((cat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-slate-800 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-750 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                  <TrendingUp className="text-indigo-400 group-hover:text-white" size={24} />
                </div>
                <p className="text-white font-bold mb-1">{cat}</p>
                <p className="text-slate-500 text-sm">2,300+ open roles</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
