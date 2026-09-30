import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, UserPlus, ShieldCheck, Mail, Lock, Sparkles, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { isSupabaseConfigured } from '../lib/supabase';

export const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, guestUser, signInWithEmail, signUpWithEmail, signInAsGuest, signOut } = useAuthStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setErrorMsg(error);
      } else {
        setInfoMsg('Account created successfully! Check your email for verification link if configured.');
      }
    } else {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setErrorMsg(error);
      } else {
        navigate('/plan');
      }
    }
    setLoading(false);
  };

  const handleGuest = () => {
    signInAsGuest();
    navigate('/plan');
  };

  // If already logged in, show user profile details and logout button
  if (user || guestUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">Active Travel Session</h2>
            <p className="text-xs text-slate-400 font-mono">
              {user ? user.email : guestUser?.email}
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                {user ? 'Supabase Authenticated' : 'Guest Traveler Mode'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-2 text-left">
            <div className="flex justify-between">
              <span>Account Type:</span>
              <strong className="text-white">{user ? 'Registered User' : 'Guest'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Database Sync:</span>
              <strong className="text-emerald-400">
                {isSupabaseConfigured() ? 'Live Supabase' : 'Local Storage Cache'}
              </strong>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => navigate('/itineraries')}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
            >
              View My Itineraries
            </button>
            <button
              onClick={() => signOut()}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('nav.signOut')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {isSignUp ? t('auth.signUpBtn') : t('auth.signInTitle')}
          </h2>
          <p className="text-xs text-slate-400">
            {t('auth.signInSubtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300">
            {infoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">
              {t('auth.emailLabel')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="traveler@india.com"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">
              {t('auth.passwordLabel')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            {loading ? 'Processing...' : isSignUp ? t('auth.signUpBtn') : t('auth.signInBtn')}
          </button>
        </form>

        <div className="relative flex items-center justify-center border-t border-slate-800 pt-4">
          <span className="bg-slate-900 px-3 text-[11px] uppercase text-slate-400 font-semibold absolute">
            Or Quick Access
          </span>
        </div>

        <button
          onClick={handleGuest}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <User className="w-4 h-4 text-blue-400" />
          <span>{t('auth.guestBtn')}</span>
        </button>

        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
            }}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.needAccount')}
          </button>
        </div>

        {/* Supabase status footer indicator */}
        <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {isSupabaseConfigured()
              ? 'Connected to Live Supabase Auth'
              : 'Supabase credentials in .env.example (Guest fallback active)'}
          </span>
        </div>
      </div>
    </div>
  );
};
