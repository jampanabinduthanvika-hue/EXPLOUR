import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Compass, MapPin, BookmarkCheck, Radio, Database, LogIn, User, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../common/LanguageSelector';
import { MobileDrawer } from './MobileDrawer';
import { useAuthStore } from '../../store/useAuthStore';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, guestUser } = useAuthStore();

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Compass },
    { to: '/plan', label: t('nav.planMyTrip'), icon: MapPin },
    { to: '/explore', label: t('nav.explore'), icon: Compass },
    { to: '/itineraries', label: t('nav.myItineraries'), icon: BookmarkCheck },
    { to: '/updates', label: t('nav.travelUpdates'), icon: Radio },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center font-extrabold text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              Explour
              <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/70 border border-blue-800/60 px-1.5 py-0.2 rounded">
                India
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/supabase-setup"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                isActive
                  ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
                  : 'border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-800/50'
              }`
            }
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Hub</span>
          </NavLink>
        </nav>

        {/* Right Action Items */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageSelector />

          {user || guestUser ? (
            <Link
              to="/auth"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 hover:border-blue-500 text-slate-200 text-xs font-medium transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center">
                <User className="w-3 h-3" />
              </div>
              <span className="max-w-[120px] truncate">{user?.email || guestUser?.name}</span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('nav.signIn')}</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <LanguageSelector />
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
};
