import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { Search, MapPin, Briefcase, Filter, Loader2, X, Send, Paperclip, Bookmark, BookmarkCheck, ChevronDown, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const JobListings = () => {
  const { user, theme } = useStore();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyMode, setApplyMode] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [applying, setApplying] = useState(false);
  const [bookmarked, setBookmarked] = useState(user?.bookmarks || []);
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');

  // Sync bookmarked state with user data
  useEffect(() => {
    if (user?.bookmarks) {
      setBookmarked(user.bookmarks);
    }
  }, [user]);

  // React Query for fetching jobs
  const { data: jobs = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['jobs', debouncedSearch, filterType, locationFilter, minSalary, skillsFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('keyword', debouncedSearch);
      if (filterType !== 'All') params.append('type', filterType);
      if (locationFilter) params.append('location', locationFilter);
      if (minSalary) params.append('minSalary', minSalary);
      if (skillsFilter) params.append('skills', skillsFilter);

      const { data } = await axios.get(`http://localhost:5000/api/jobs?${params.toString()}`);
      return data;
    }
  });

  // Client side sorting (filtering is now backend)
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'Salary') {
      const salaryA = parseInt(a.salary?.replace(/[^0-9]/g, '') || '0');
      const salaryB = parseInt(b.salary?.replace(/[^0-9]/g, '') || '0');
      return salaryB - salaryA;
    }
    if (sortBy === 'Latest') {
      return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
    }
    return 0;
  });

  const toggleBookmark = async (id) => {
    if (!user) return alert('Please login to bookmark jobs');
    try {
      const { data } = await axios.put(`http://localhost:5000/api/jobs/bookmark/${id}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setBookmarked(data);
      // Update local storage/store if needed
      const updatedUser = { ...user, bookmarks: data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      // useStore update is handled by the component re-rendering with new state or we could add a setBookmarks to store
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to apply');
    setApplying(true);
    try {
      await axios.post('http://localhost:5000/api/applications', {
        jobId: selectedJob._id,
        resumeUrl
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Application submitted successfully!');
      setApplyMode(false);
      setSelectedJob(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-6 py-12 transition-colors duration-300`}>
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="w-full md:max-w-xl">
          <h1 className={`text-4xl font-extrabold mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Browse Open Roles
          </h1>
          <div className="relative group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
            <input 
              type="text" 
              placeholder="Filter by title, skills, or company..."
              className={`w-full border py-4 pl-12 pr-4 outline-none transition-all rounded-2xl shadow-lg ${
                theme === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            aria-label="Toggle Advanced Filters"
          >
            <Filter size={18} />
            Filters
            <ChevronDown size={14} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <div className={`p-1 flex items-center gap-1 rounded-xl ${theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100'}`}>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`bg-transparent outline-none p-1.5 text-xs font-bold transition-colors cursor-pointer ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}
              aria-label="Sort Jobs"
            >
              <option value="Latest">Latest</option>
              <option value="Salary">Highest Salary</option>
              <option value="Relevance">Relevance</option>
            </select>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/10 p-1.5 rounded-2xl">
            {['All', 'Full-time', 'Remote', 'Internship'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filterType === type 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : `hover:bg-indigo-500/10 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`overflow-hidden mb-12 rounded-3xl border p-8 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
              <div className="space-y-4">
                <p className={`font-bold uppercase tracking-widest text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Min Salary</p>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input 
                    type="number" 
                    placeholder="e.g. 50000"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <p className={`font-bold uppercase tracking-widest text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Location Filter</p>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input 
                    type="text" 
                    placeholder="e.g. Remote, NY"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <p className={`font-bold uppercase tracking-widest text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Skills (comma separated)</p>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input 
                    type="text" 
                    placeholder="e.g. React, Node"
                    value={skillsFilter}
                    onChange={(e) => setSkillsFilter(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <p className={`font-bold uppercase tracking-widest text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Sort By</p>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none cursor-pointer ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <option value="Latest">Latest</option>
                  <option value="Salary">Highest Salary</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
          <p className="text-slate-400">Loading open roles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedJobs.map((job) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={job._id}
                className={`p-6 rounded-3xl border transition-all group flex flex-col ${
                  theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700/50 hover:border-indigo-500/50' 
                  : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {job.company[0]}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleBookmark(job._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        bookmarked.includes(job._id) ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 hover:text-indigo-400'
                      }`}
                    >
                      {bookmarked.includes(job._id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                    </button>
                    <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      {job.type}
                    </span>
                  </div>
                </div>

                <h3 className={`text-xl font-bold mb-2 group-hover:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{job.title}</h3>
                <p className="text-slate-500 font-medium mb-4">{job.company}</p>
                
                <div className="flex flex-col gap-2 mb-8">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold mb-4">
                    <DollarSign size={16} className="text-emerald-500" />
                    <span>{job.salary || 'Competitive Pay'}</span>
                  </div>
                  
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-400 text-[10px] rounded-lg border border-slate-700/50">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="text-[10px] text-slate-500 font-bold">+{job.skills.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className={`mt-auto pt-6 border-t flex items-center justify-between ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-100'}`}>
                  <span className="text-xs text-slate-400 italic">Posted via JobPortal</span>
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-500/10"
                  >
                    Details
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Details/Apply Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedJob(null); setApplyMode(false); }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => { setSelectedJob(null); setApplyMode(false); }}
                className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="p-8">
                {!applyMode ? (
                  <>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 font-bold text-2xl">
                        {selectedJob.company[0]}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">{selectedJob.title}</h2>
                        <p className="text-indigo-400 font-medium text-lg">{selectedJob.company}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="space-y-1">
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Location</p>
                        <p className="text-white flex items-center gap-2"><MapPin size={16} /> {selectedJob.location}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Type</p>
                        <p className="text-white flex items-center gap-2"><Briefcase size={16} /> {selectedJob.type}</p>
                      </div>
                    </div>

                    <div className="mb-10">
                      <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-3">Job Description</p>
                      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedJob.description}
                      </div>
                    </div>

                    {selectedJob.skills && selectedJob.skills.length > 0 && (
                      <div className="mb-10">
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-3">Required Skills</p>
                        <div className="flex flex-wrap gap-3">
                          {selectedJob.skills.map((skill, i) => (
                            <span key={i} className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-sm font-bold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => setApplyMode(true)}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20"
                    >
                      Apply Now
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleApply} className="py-4">
                    <h2 className="text-2xl font-bold text-white mb-2">Apply for {selectedJob.title}</h2>
                    <p className="text-slate-400 mb-8">at {selectedJob.company}</p>

                    <div className="space-y-2 mb-8">
                      <label className="text-sm font-medium text-slate-300 ml-1">Resume Link (Google Drive/Dropbox)</label>
                      <div className="relative">
                        <Paperclip className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="url" 
                          required
                          placeholder="https://drive.google.com/..."
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-11 pr-4 text-sm focus:border-indigo-500 outline-none transition-all"
                          value={resumeUrl}
                          onChange={(e) => setResumeUrl(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setApplyMode(false)}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold transition-all"
                      >
                        Back
                      </button>
                      <button 
                        type="submit" 
                        disabled={applying}
                        className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                      >
                        {applying ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Submit Application</>}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!loading && filteredJobs.length === 0 && (
        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
          <p className="text-slate-500 text-lg">No jobs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default JobListings;
