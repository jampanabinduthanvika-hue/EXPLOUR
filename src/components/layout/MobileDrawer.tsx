import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Compass, MapPin, BookmarkCheck, Radio, Database, LogIn, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../common/LanguageSelector';
import { useAuthStore } from '../../store/useAuthStore';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user, guestUser, signOut } = useAuthStore();

  if (!isOpen) return null;

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Compass },
    { to: '/plan', label: t('nav.planMyTrip'), icon: MapPin },
    { to: '/explore', label: t('nav.explore'), icon: Compass },
    { to: '/itineraries', label: t('nav.myItineraries'), icon: BookmarkCheck },
    { to: '/updates', label: t('nav.travelUpdates'), icon: Radio },
    { to: '/supabase-setup', label: t('nav.database'), icon: Database },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-slate-900 border-l border-slate-800 p-6 shadow-2xl flex flex-col justify-between z-50">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
                E
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">Explour</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 mb-6">
            <div className="text-xs uppercase font-semibold text-slate-400 px-3 mb-2">Language</div>
            <div className="px-3">
              <LanguageSelector />
            </div>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Footer in Drawer */}
        <div className="pt-6 border-t border-slate-800">
          {user || guestUser ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 px-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                  <User className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-white truncate">
                    {user?.email || guestUser?.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {user ? 'Verified Account' : 'Guest Traveler'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('nav.signOut')}
              </button>
            </div>
          ) : (
            <NavLink
              to="/auth"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md transition-colors"
            >
              <LogIn className="w-4 h-4" />
              {t('nav.signIn')}
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};
