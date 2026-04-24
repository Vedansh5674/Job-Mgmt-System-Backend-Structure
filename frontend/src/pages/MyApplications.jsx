import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Calendar, CheckCircle2, XCircle, Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/applications/my', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchApplications();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await axios.delete(`http://localhost:5000/api/applications/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setApplications(applications.filter(app => app._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const StatusTimeline = ({ status }) => {
    const steps = ['Pending', 'Reviewed', 'Accepted/Rejected'];
    const currentStatus = status === 'Rejected' ? 'Rejected' : status;
    const activeIndex = status === 'Pending' ? 0 : status === 'Reviewed' ? 1 : 2;
    const isError = status === 'Rejected';

    return (
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        {steps.map((step, index) => {
          const isPast = index < activeIndex;
          const isActive = index === activeIndex;
          const label = index === 2 && status === 'Rejected' ? 'Rejected' : index === 2 && status === 'Accepted' ? 'Accepted' : step;
          
          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isPast ? 'bg-indigo-500 text-white' : 
                  isActive ? (isError ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white ring-4 ring-indigo-500/20') : 
                  'bg-slate-700 text-slate-500'
                }`}>
                  {isPast ? <CheckCircle2 size={16} /> : <span>{index + 1}</span>}
                </div>
                <span className={`absolute -bottom-6 text-[10px] font-bold uppercase whitespace-nowrap tracking-wider ${
                  isActive ? (isError ? 'text-red-400' : 'text-indigo-400') : 'text-slate-500'
                }`}>
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${isPast ? 'bg-indigo-500' : 'bg-slate-700'}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!user) return <div className="text-center py-20 text-slate-400 font-bold">Please login to view your applications.</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tighter italic">MY JOURNEY</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm flex items-center gap-2">
            Track Applications <Clock size={16} className="text-indigo-500" />
          </p>
        </div>
        <div className="px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-4">
           <div className="text-center">
              <p className="text-2xl font-black text-white leading-none">{applications.length}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total</p>
           </div>
           <div className="w-px h-8 bg-slate-800" />
           <div className="text-center">
              <p className="text-2xl font-black text-emerald-500 leading-none">{applications.filter(a => a.status === 'Accepted').length}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Offers</p>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-800/50 animate-pulse rounded-[32px] border border-slate-800" />)}
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {applications.map((app) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={app._id}
                className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 p-8 rounded-[40px] hover:border-indigo-500/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8">
                   <button 
                    onClick={() => handleDelete(app._id)}
                    className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                    title="Withdraw Application"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="flex items-center gap-6 w-full lg:w-auto">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                      <Briefcase size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">{app.job.title}</h3>
                      <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">{app.job.company} • {app.job.location}</p>
                      <div className="flex items-center gap-2 mt-4 text-xs font-bold text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg w-fit">
                        <Calendar size={12} className="text-indigo-500" />
                        APPLIED {new Date(app.createdAt).toLocaleDateString().toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-auto pb-6 lg:pb-0">
                    <StatusTimeline status={app.status} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {applications.length === 0 && (
            <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
              <p className="text-slate-500 mb-6">You haven't applied to any jobs yet.</p>
              <Link to="/jobs" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all">
                Browse Jobs
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
