import { useState } from 'react';
import useStore from '../store/useStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  ChevronRight,
  BrainCircuit,
  Zap,
  Target,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const Dashboard = () => {
  const { user, theme } = useStore();
  
  // Fetch seeker applications
  const { data: applications = [] } = useQuery({
    queryKey: ['myApplications'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/api/v1/applications/my', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return data;
    },
    enabled: !!user && user.role === 'seeker'
  });

  // Recruiter: Fetch my posted jobs
  const { data: myJobs = [], refetch: refetchJobs } = useQuery({
    queryKey: ['myJobs'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/api/v1/jobs/my', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return data;
    },
    enabled: !!user && user.role === 'recruiter'
  });

  // Seeker: Fetch AI job recommendations
  const { data: aiRecommendations = [], isLoading: loadingAiRecs } = useQuery({
    queryKey: ['aiRecommendations'],
    queryFn: async () => {
      // Use user's skills if available, otherwise use a default set for demo
      const skills = user.skills?.length > 0 ? user.skills : ['React', 'Node.js', 'Javascript'];
      const { data } = await axios.post('http://localhost:5000/api/v1/jobs/recommendations/ai', { skills }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return data;
    },
    enabled: !!user && user.role === 'seeker'
  });

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Recruiter: Fetch applicants for selected job
  const { data: applicants = [], isLoading: loadingApplicants } = useQuery({
    queryKey: ['jobApplicants', selectedJobId],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:5000/api/v1/applications/job/${selectedJobId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return data;
    },
    enabled: !!selectedJobId
  });

  const handleUpdateStatus = async (appId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await axios.put(`http://localhost:5000/api/v1/applications/${appId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      alert(`Status updated to ${newStatus}`);
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAnalyzeResume = async (appId, resumeText) => {
    setAnalyzingId(appId);
    try {
      const { data } = await axios.post('http://localhost:5000/api/v1/applications/analyze', { 
        resumeText: resumeText || "This is a placeholder resume text for analysis.",
        jobId: selectedJobId 
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setAiAnalysis(prev => ({ ...prev, [appId]: data }));
    } catch (err) {
      alert('Failed to analyze resume with AI');
    } finally {
      setAnalyzingId(null);
    }
  };

  // Mock data for Recruiter charts
  const recruiterStats = [
    { name: 'Mon', apps: 4 },
    { name: 'Tue', apps: 7 },
    { name: 'Wed', apps: 5 },
    { name: 'Thu', apps: 12 },
    { name: 'Fri', apps: 9 },
    { name: 'Sat', apps: 3 },
    { name: 'Sun', apps: 2 },
  ];

  const pieData = [
    { name: 'Dev', value: 400 },
    { name: 'Design', value: 300 },
    { name: 'Marketing', value: 100 },
    { name: 'Other', value: 200 },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-500 mb-6">
          <Briefcase size={32} />
        </div>
        <h2 className="text-2xl font-black mb-2">Access Denied</h2>
        <p className="text-slate-500 max-w-xs mx-auto mb-8">Please login to access your command center and track your progress.</p>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-xl shadow-indigo-500/20">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2 tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
          Overview <ChevronRight size={14} /> <span className="text-indigo-500">Analytics</span>
        </p>
      </div>

      {user?.role === 'seeker' ? (
        <div className="space-y-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Applications', value: applications.length, icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { label: 'Upcoming Interviews', value: '2', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
              { label: 'Saved Jobs', value: '12', icon: Target, color: 'text-rose-500', bg: 'bg-rose-500/10' },
              { label: 'Profile Views', value: '84', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className={`p-6 rounded-[32px] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm shadow-slate-200/50'}`}
              >
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-3xl font-black mb-1">{stat.value}</p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className={`lg:col-span-2 p-8 rounded-[40px] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black mb-1">Recent Applications</h3>
                  <p className="text-slate-500 text-xs font-medium">Track your application status in real-time</p>
                </div>
                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black transition-all hover:scale-105 active:scale-95">View Analytics</button>
              </div>
              <div className="space-y-4">
                {applications.length > 0 ? applications.slice(0, 4).map((app, i) => (
                  <div key={i} className={`group p-5 rounded-3xl border transition-all cursor-pointer ${
                    theme === 'dark' ? 'bg-slate-950/50 border-slate-800/50 hover:border-indigo-500' : 'bg-slate-50/50 border-slate-100 hover:border-indigo-500'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 glass flex items-center justify-center rounded-2xl text-indigo-500 font-black text-xl shadow-lg">
                          {app.job?.company?.[0] || 'J'}
                        </div>
                        <div>
                          <p className="font-black text-lg group-hover:text-indigo-500 transition-colors">{app.job?.title}</p>
                          <p className="text-slate-500 text-sm font-bold">{app.job?.company} • {app.job?.location || 'Remote'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          app.status === 'applied' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {app.status}
                        </span>
                        <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-tight">Applied 2 days ago</p>
                      </div>
                    </div>
                  </div>
                )) : <p className="text-slate-500 italic text-center py-10">No recent applications found.</p>}
              </div>
            </div>

            {/* AI Insights Sidebar */}
            <div className="space-y-8">
              {/* Score Widget */}
              <div className={`p-8 rounded-[40px] border relative overflow-hidden ${theme === 'dark' ? 'bg-indigo-900/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'}`}>
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                    <BrainCircuit size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black leading-tight">AI Resume Score</h3>
                    <p className="text-[10px] font-bold text-indigo-500/60 uppercase tracking-widest">Powered by DeepMind</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center mb-8 relative">
                   <div className="w-32 h-32 rounded-full border-[10px] border-slate-200 dark:border-slate-800 flex items-center justify-center">
                      <span className="text-3xl font-black">85%</span>
                      <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90">
                        <circle cx="64" cy="64" r="59" fill="transparent" stroke="currentColor" strokeWidth="10" strokeDasharray="371" strokeDashoffset={371 * (1 - 0.85)} className="text-indigo-500" strokeLinecap="round" />
                      </svg>
                   </div>
                </div>
                
                <p className="text-sm font-bold text-slate-500 text-center mb-6">
                  Your profile is in the top <span className="text-indigo-500">15%</span> for Frontend Lead roles.
                </p>

                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Boost your score</p>
                  <div className="flex flex-wrap gap-2">
                    {['GraphQL', 'Typescript Lead', 'AWS'].map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/20 rounded-xl text-[10px] font-black text-indigo-500">
                        + {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`p-8 rounded-[40px] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-lg font-black mb-6">Match Alerts</h3>
                <div className="space-y-4">
                  {loadingAiRecs ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="animate-spin text-indigo-500" size={24} />
                    </div>
                  ) : aiRecommendations.length > 0 ? aiRecommendations.map((job, i) => (
                    <div key={job._id} className={`p-4 rounded-2xl border flex items-center justify-between group cursor-pointer transition-all ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 hover:border-indigo-500' : 'bg-slate-50 border-slate-100 hover:border-indigo-400'
                    }`}>
                      <div>
                        <p className="font-bold text-sm">{job.title}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{job.company} • {job.salary || 'Competitive'}</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-500 italic text-center py-4">No AI recommendations yet. Add more skills to your profile!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Recruiter Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <div className={`lg:col-span-2 p-8 rounded-[40px] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-2xl font-black mb-1">Applicant Flow</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                       <TrendingUp size={14} className="text-emerald-500" /> +24% increase from last week
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {['1D', '1W', '1M'].map(t => (
                      <button key={t} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${t === '1W' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recruiterStats}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                      <Tooltip 
                        cursor={{fill: theme === 'dark' ? '#1e293b' : '#f8fafc', radius: 8}} 
                        contentStyle={{borderRadius: '24px', background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                      />
                      <Bar dataKey="apps" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className={`p-8 rounded-[40px] border flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="text-xl font-black mb-8 w-full">Candidate Mix</h3>
                <div className="h-[250px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-black">1.2k</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center leading-tight">Total<br/>Candidates</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8 w-full">
                  {pieData.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor: COLORS[i]}} />
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{d.name}</p>
                        <p className="text-xs font-black">{d.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          
          <div className={`p-8 rounded-[40px] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black mb-1">{selectedJobId ? 'Manage Applicants' : 'Active Roles'}</h2>
                <p className="text-slate-500 text-sm font-bold">
                  {selectedJobId ? `Reviewing candidates for ${myJobs.find(j => j._id === selectedJobId)?.title}` : 'Manage your current job listings and applicants'}
                </p>
              </div>
              {selectedJobId ? (
                <button 
                  onClick={() => setSelectedJobId(null)}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl text-sm font-black transition-all hover:bg-slate-700"
                >
                  <ArrowLeft size={16} /> Back to Jobs
                </button>
              ) : (
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all">Create New Slot</button>
              )}
            </div>
            
            {!selectedJobId ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myJobs.length > 0 ? myJobs.map((job, i) => (
                  <div 
                    key={job._id} 
                    onClick={() => setSelectedJobId(job._id)}
                    className={`p-6 rounded-[32px] border flex items-center justify-between hover:border-indigo-500/50 transition-all group cursor-pointer ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800/50' : 'bg-slate-50 border-slate-100 shadow-sm shadow-slate-200/50'
                  }`}>
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-indigo-500 shadow-xl shadow-black/5">
                          <span className="text-2xl font-black leading-none italic">{i + 1}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest mt-1">POS</span>
                       </div>
                       <div>
                          <p className="font-black text-lg group-hover:text-indigo-500 transition-colors">{job.title}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{job.location} • {job.type}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500`}>
                          Active
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <ChevronRight size={20} />
                        </div>
                    </div>
                  </div>
                )) : <p className="text-slate-500 italic py-10 text-center col-span-2">No active roles found. Start by creating a new job slot.</p>}
              </div>
            ) : (
              <div className="space-y-4">
                {loadingApplicants ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-indigo-500" size={40} />
                  </div>
                ) : applicants.length > 0 ? applicants.map((app) => (
                  <div key={app._id} className={`p-6 rounded-[32px] border flex flex-col md:flex-row items-center justify-between gap-6 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800/50' : 'bg-slate-50 border-slate-100 shadow-sm'
                  }`}>
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-xl">
                        {app.applicant?.name?.[0]}
                      </div>
                      <div>
                        <p className="font-black text-lg">{app.applicant?.name}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{app.applicant?.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
                      <a 
                        href={app.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all"
                      >
                        <FileText size={14} /> Resume
                      </a>
                      
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[18px]">
                        <button
                          onClick={() => handleAnalyzeResume(app._id, app.resumeText)}
                          disabled={analyzingId === app._id}
                          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                            aiAnalysis[app._id] ? 'bg-indigo-500 text-white' : 'bg-white dark:bg-slate-900 text-indigo-500'
                          }`}
                        >
                          {analyzingId === app._id ? <Loader2 size={12} className="animate-spin" /> : <BrainCircuit size={12} />}
                          {aiAnalysis[app._id] ? `AI Match: ${aiAnalysis[app._id].score}%` : 'Analyze with AI'}
                        </button>

                        {['Reviewed', 'Accepted', 'Rejected'].map(status => (
                          <button
                            key={status}
                            disabled={updatingStatus}
                            onClick={() => handleUpdateStatus(app._id, status)}
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                              app.status === status 
                              ? (status === 'Accepted' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : status === 'Rejected' ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white shadow-lg')
                              : 'text-slate-500 hover:bg-white dark:hover:bg-slate-900'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )) : <p className="text-slate-500 italic py-20 text-center">No applicants yet for this role.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
