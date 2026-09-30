import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { useAuthStore } from './store/useAuthStore';
import './i18n/i18n';

// Code splitting & lazy loading for performance
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const PlannerPage = lazy(() => import('./pages/PlannerPage').then((m) => ({ default: m.PlannerPage })));
const ExplorePage = lazy(() => import('./pages/ExplorePage').then((m) => ({ default: m.ExplorePage })));
const FeedPage = lazy(() => import('./pages/FeedPage').then((m) => ({ default: m.FeedPage })));
const MyItinerariesPage = lazy(() => import('./pages/MyItinerariesPage').then((m) => ({ default: m.MyItinerariesPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const SupabaseSetupPage = lazy(() => import('./pages/SupabaseSetupPage').then((m) => ({ default: m.SupabaseSetupPage })));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
    <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin" />
    <span className="text-xs font-medium text-slate-400">Loading Explour Travel Intelligence...</span>
  </div>
);

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/plan" element={<PlannerPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/updates" element={<FeedPage />} />
              <Route path="/itineraries" element={<MyItinerariesPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/supabase-setup" element={<SupabaseSetupPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
