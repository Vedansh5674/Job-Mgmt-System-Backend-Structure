import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, Briefcase, MapPin, DollarSign, AlignLeft, Building2 } from 'lucide-react';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    type: 'Full-time'
  });

  if (!user || user.role !== 'recruiter') {
    return <div className="text-center py-20 text-slate-400">Only recruiters can post jobs.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/jobs', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigate('/jobs');
    } catch (err) {
      console.error(err);
      alert('Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 shadow-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">Post a New Job</h1>
          <p className="text-slate-400">Reach thousands of talented developers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Job Title</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="Senior React Developer"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-11 pr-4 text-sm focus:border-indigo-500 outline-none transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="TechCorp Inc."
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-11 pr-4 text-sm focus:border-indigo-500 outline-none transition-all"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="New York, NY or Remote"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-11 pr-4 text-sm focus:border-indigo-500 outline-none transition-all"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Job Type</label>
              <select 
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 px-4 text-sm focus:border-indigo-500 outline-none transition-all appearance-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Remote</option>
                <option>Internship</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Salary Range</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="$120k - $150k"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-11 pr-4 text-sm focus:border-indigo-500 outline-none transition-all"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Job Description</label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 text-slate-500" size={18} />
              <textarea 
                required
                rows="6"
                placeholder="Describe the role, requirements, and benefits..."
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-11 pr-4 text-sm focus:border-indigo-500 outline-none transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={18} /> <span>Publish Job Listing</span></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
