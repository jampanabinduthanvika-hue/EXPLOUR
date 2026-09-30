import React from 'react';
import { CloudRain, Sun, Zap, Eye, AlertTriangle, ShieldCheck, Umbrella, Thermometer, Compass } from 'lucide-react';
import { WeatherAlertRecord, TravelAlertRecord } from '../../types';

interface WeatherAdvisoryBannerProps {
  weatherAlerts: WeatherAlertRecord[];
  travelAlerts: TravelAlertRecord[];
}

export const WeatherAdvisoryBanner: React.FC<WeatherAdvisoryBannerProps> = ({
  weatherAlerts,
  travelAlerts,
}) => {
  if (weatherAlerts.length === 0 && travelAlerts.length === 0) return null;

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case 'Rain':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'Thunderstorm':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Heat':
        return <Thermometer className="w-5 h-5 text-orange-400" />;
      case 'UV Alert':
        return <Sun className="w-5 h-5 text-amber-300" />;
      default:
        return <CloudRain className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Weather Alert Banner */}
      {weatherAlerts.map((w) => (
        <div
          key={w.id}
          className="bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                {getWeatherIcon(w.alert_type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/60">
                    {w.alert_type}
                  </span>
                  <h4 className="text-sm font-bold text-white">{w.title}</h4>
                </div>
                <p className="text-xs text-slate-300 mt-1">{w.description}</p>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 whitespace-nowrap">
              Valid: {w.valid_until}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3.5 text-xs">
            {/* Contextual Travel Advisory Tips */}
            <div>
              <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Contextual Advisory Tips
              </div>
              <ul className="space-y-1.5">
                {w.advisory.map((tip, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Indoor alternatives when bad weather */}
            {w.indoor_alternatives && w.indoor_alternatives.length > 0 && (
              <div>
                <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-2">
                  <Compass className="w-4 h-4 text-blue-400" />
                  Recommended Indoor Alternatives
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {w.indoor_alternatives.map((alt, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 text-xs"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Traffic & Crowd Alerts */}
      {travelAlerts.map((t) => (
        <div
          key={t.id}
          className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 flex items-start gap-3 text-xs"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-200 flex items-center gap-2">
              <span>{t.city_name} {t.alert_type} Notice</span>
              <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-amber-900/60 border border-amber-700/60 text-amber-300">
                {t.severity} priority
              </span>
            </div>
            <p className="text-amber-100/90 leading-relaxed">{t.message}</p>
            <div className="text-[11px] text-amber-300/80">Affected corridors: {t.impact_areas}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
