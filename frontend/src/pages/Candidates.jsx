import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useStore from '../store/useStore';
import { Users, Search, Mail, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Candidates = () => {
  const { user, theme } = useStore();

  // Fetch all applications for recruiter's jobs
  // In a real app, you might have a dedicated endpoint for this
  const { data: jobs = [] } = useQuery({
    queryKey: ['myJobs'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/api/v1/jobs/my', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return data;
    },
    enabled: !!user && user.role === 'recruiter'
  });

  return (
    <div className="space-y-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Talent Pool</h1>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
          Global <span className="text-indigo-500">Candidates</span>
        </p>
      </div>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search by name, skill, or role..." 
          className={`w-full pl-16 pr-8 py-5 rounded-[24px] border outline-none transition-all ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 focus:border-indigo-500' : 'bg-white border-slate-200 focus:border-indigo-400 shadow-sm'
          }`}
        />
      </div>

      <div className={`p-8 rounded-[40px] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4 mb-8 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] px-4">
          <div className="w-12 shrink-0">Avatar</div>
          <div className="flex-1">Candidate Details</div>
          <div className="w-32 text-center">Applied Role</div>
          <div className="w-32 text-right">Actions</div>
        </div>

        <div className="space-y-4">
           {/* Placeholder for candidate list integration */}
           <p className="text-slate-500 italic text-center py-20">Talent pool visualization is being synchronized with your active job slots...</p>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
