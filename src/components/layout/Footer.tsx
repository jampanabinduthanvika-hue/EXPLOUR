import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, MapPin, Database, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
                E
              </div>
              <span className="font-bold text-base text-white tracking-tight">Explour</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              India’s Context-Aware Dynamic Travel Intelligence Platform. Intelligently optimizes, visualizes, and adapts itineraries based on budget, weather, and real-world constraints.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Production Supabase Architecture</span>
            </div>
          </div>

          {/* Key Destinations */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Key Indian Circuits</h4>
            <ul className="space-y-2">
              <li><Link to="/explore?state=ladakh" className="hover:text-blue-400 transition-colors">Ladakh & Nubra Valley</Link></li>
              <li><Link to="/explore?state=kerala" className="hover:text-blue-400 transition-colors">Kerala Backwaters & Munnar</Link></li>
              <li><Link to="/explore?state=rajasthan" className="hover:text-blue-400 transition-colors">Rajasthan Royal Palaces</Link></li>
              <li><Link to="/explore?state=goa" className="hover:text-blue-400 transition-colors">North & South Goa Coastlines</Link></li>
              <li><Link to="/explore?state=jammu-kashmir" className="hover:text-blue-400 transition-colors">Kashmir & Gulmarg Gondola</Link></li>
            </ul>
          </div>

          {/* Platform Features */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Intelligence Features</h4>
            <ul className="space-y-2">
              <li><Link to="/plan" className="hover:text-blue-400 transition-colors">Context-Aware Trip Engine</Link></li>
              <li><Link to="/updates" className="hover:text-blue-400 transition-colors">Real-Time Travel Updates</Link></li>
              <li><Link to="/explore" className="hover:text-blue-400 transition-colors">100+ Verified Attractions</Link></li>
              <li><Link to="/supabase-setup" className="hover:text-blue-400 transition-colors">Database & Storage Schemas</Link></li>
              <li><Link to="/itineraries" className="hover:text-blue-400 transition-colors">Saved Offline Trips</Link></li>
            </ul>
          </div>

          {/* System Specs */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Architecture</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              100% serverless frontend deployable to Vercel/Netlify backed by Supabase PostgreSQL, Row Level Security, and Storage.
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Coverage:</span>
                <span className="font-semibold text-white">11 States & UTs</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Curated Records:</span>
                <span className="font-semibold text-blue-400">100+ Attractions</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Languages:</span>
                <span className="font-semibold text-emerald-400">EN / HI / TE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <div>
            © {new Date().getFullYear()} Explour India. Crafted for intelligent, practical travel.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built exclusively for India</span>
            <MapPin className="w-3.5 h-3.5 text-red-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};
