import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { Mail, Lock, ArrowRight, UserPlus, LogIn, CheckCircle2, Zap } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        await authAPI.register(email, password);
        alert('Account created successfully. You can now sign in.');
        setIsRegistering(false);
      } else {
        const data = await authAPI.login(email, password);
        localStorage.setItem('token', data.access_token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(isRegistering ? 'Registration failed. Check your details.' : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"></div>

      <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] w-full max-w-md relative z-10 border border-white/5 bg-slate-900/40 backdrop-blur-2xl transition-all shadow-2xl">
        
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex gap-2.5 mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/10">
                <Zap className="text-amber-400" size={36} strokeWidth={2.5}/>
            </div>
            <div className="w-16 h-16 bg-teal-500/10 rounded-3xl flex items-center justify-center border border-teal-500/20 shadow-lg shadow-teal-500/10">
                <CheckCircle2 className="text-teal-400" size={36} strokeWidth={2.5}/>
            </div>
          </div>

          <div className="flex flex-col font-black tracking-tighter italic leading-none text-5xl md:text-6xl text-white">
            <span className="hover:text-teal-400 transition-colors cursor-default">TA</span>
            <span className="text-teal-400 hover:text-white transition-colors cursor-default">SK</span>
            <span className="text-sm md:text-base font-bold not-italic tracking-[0.4em] mt-2 uppercase text-slate-500">Manager_</span>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent mt-8 mb-4"></div>
          
          <p className="text-teal-400/80 text-[11px] font-black tracking-[0.2em] uppercase italic">
            {isRegistering ? 'CREATE NEW ACCOUNT' : 'SYSTEM ACCESS'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-3 animate-shake">
            <Zap size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-teal-400 transition-colors" size={20} />
              <input
                type="email"
                required
                placeholder="email@example.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl focus:border-teal-500/50 outline-none transition-all text-white font-medium placeholder:text-slate-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-teal-400 transition-colors" size={20} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl focus:border-teal-500/50 outline-none transition-all text-white font-medium placeholder:text-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-slate-900 font-black italic py-4 px-6 rounded-2xl hover:bg-teal-400 shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 tracking-tighter text-lg"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
            ) : (
              <>
                {isRegistering ? 'SIGN UP' : 'SIGN IN'}
                {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />}
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-teal-500/40 font-black text-[10px] uppercase tracking-[0.2em] hover:text-teal-400 transition-colors flex items-center gap-2 mx-auto transition-all italic"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}