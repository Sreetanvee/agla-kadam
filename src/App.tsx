/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar, type AppRoute } from './components/Navbar';
import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext';
import { useI18n } from './hooks/useI18n';
import { AuthView } from './views/AuthView';
import { HomeView } from './views/HomeView';
import { UniverseView } from './views/UniverseView';
import { PathwaysView } from './views/PathwaysView';
import { DiscoverView } from './views/DiscoverView';
import { RoadmapView } from './views/RoadmapView';
import { KadamAiView } from './views/KadamAiView';
import { ToolsView, type ToolTab } from './views/ToolsView';
import { DashboardView } from './views/DashboardView';
import type { StudentStage } from './types/domain';

const VALID_ROUTES: AppRoute[] = [
  'dashboard',
  'home',
  'universe',
  'pathways',
  'discover',
  'roadmap',
  'kadam-ai',
  'tools',
];

function parseRouteFromHash(): AppRoute | null {
  const raw = window.location.hash.replace(/^#\/?/, '').trim() as AppRoute;
  return VALID_ROUTES.includes(raw) ? raw : null;
}

function AppShell() {
  const { user, authReady } = useFirebase();
  const { t } = useI18n();

  const [activeRoute, setActiveRoute] = useState<AppRoute>('dashboard');
  const prevUserUidRef = useRef<string | null>(null);

  // Cross-view deep-link state
  const [selectedGuideSlug, setSelectedGuideSlug] = useState<string | null>(null);
  const [universeStageFilter, setUniverseStageFilter] = useState<StudentStage | 'all'>('all');
  const [possibilityRootId, setPossibilityRootId] = useState<string>('class-10');
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | null>(null);
  const [aiContextSlug, setAiContextSlug] = useState<string | null>(null);
  const [activeToolTab, setActiveToolTab] = useState<ToolTab>('decoder');
  const [parentBriefPathway, setParentBriefPathway] = useState<string | null>(null);

  // Enforce authentication-first routing & redirect transitions
  useEffect(() => {
    if (!authReady) return;

    const currentUid = user?.uid ?? null;
    const prevUid = prevUserUidRef.current;

    if (!currentUid) {
      // Unauthenticated visitor: force URL hash to #login and reset private view state
      if (window.location.hash !== '#login') {
        window.history.replaceState(null, '', '#login');
      }
      setActiveRoute('dashboard');
      setSelectedGuideSlug(null);
      setSelectedJourneyId(null);
      prevUserUidRef.current = null;
      return;
    }

    // Fresh sign-in or initial load with persisted session
    if (prevUid !== currentUid) {
      const hashRoute = parseRouteFromHash();
      // Always redirect away from #login (or empty hash) straight to the main Dashboard
      const landingRoute: AppRoute = hashRoute && window.location.hash !== '#login' ? hashRoute : 'dashboard';
      setActiveRoute(landingRoute);
      if (window.location.hash !== `#${landingRoute}`) {
        window.history.replaceState(null, '', `#${landingRoute}`);
      }
      prevUserUidRef.current = currentUid;
      window.scrollTo({ top: 0 });
    }
  }, [authReady, user]);

  // Listen to browser hash navigation while enforcing auth protection
  useEffect(() => {
    const onHashChange = () => {
      if (!authReady) return;
      if (!user) {
        if (window.location.hash !== '#login') {
          window.history.replaceState(null, '', '#login');
        }
        return;
      }
      const next = parseRouteFromHash();
      if (!next) {
        // Redirect authenticated users trying to visit #login back to their dashboard
        setActiveRoute('dashboard');
        window.history.replaceState(null, '', '#dashboard');
      } else {
        setActiveRoute(next);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [authReady, user]);

  const navigateTo = (route: AppRoute) => {
    if (!user) return;
    setActiveRoute(route);
    if (window.location.hash !== `#${route}`) {
      window.history.pushState(null, '', `#${route}`);
    }
    if (route === 'universe' && activeRoute !== 'universe') {
      setSelectedGuideSlug(null);
    }
    if (route === 'pathways' && activeRoute !== 'pathways') {
      setSelectedJourneyId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenGuide = (slug: string) => {
    setSelectedGuideSlug(slug);
    setActiveRoute('universe');
    window.history.pushState(null, '', '#universe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenUniverseStage = (stage: StudentStage) => {
    setSelectedGuideSlug(null);
    setUniverseStageFilter(stage);
    setActiveRoute('universe');
    window.history.pushState(null, '', '#universe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStagePathway = (rootId: string) => {
    setPossibilityRootId(rootId);
    setSelectedJourneyId(null);
    setActiveRoute('pathways');
    window.history.pushState(null, '', '#pathways');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenJourney = (journeyId: string) => {
    setSelectedJourneyId(journeyId);
    setActiveRoute('pathways');
    window.history.pushState(null, '', '#pathways');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskKadamAi = (initialQuestion: string, contextSlug?: string) => {
    setAiInitialPrompt(initialQuestion);
    setAiContextSlug(contextSlug || null);
    setActiveRoute('kadam-ai');
    window.history.pushState(null, '', '#kadam-ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplainToParents = (pathwayTitle: string) => {
    setParentBriefPathway(pathwayTitle);
    setActiveToolTab('parents');
    setActiveRoute('tools');
    window.history.pushState(null, '', '#tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Serene branded loading gate while Firebase resolves persisted session
  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#F7F4EC] text-[#34483D] flex flex-col items-center justify-center px-6 text-center">
        <p className="font-serif text-3xl font-semibold tracking-tight">{t.common.brand}</p>
        <p className="text-sm text-[#5C625A] mt-1">{t.common.tagline}</p>
        <Loader2 className="w-5 h-5 animate-spin text-[#34483D] mt-6" />
      </div>
    );
  }

  // Authentication-First Entry Screen for unauthenticated visitors
  if (!user) {
    return <AuthView />;
  }

  // Authenticated Application Shell (all existing AGLA KADAM modules preserved)
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EC] text-[#30342F]">
      <Navbar activeRoute={activeRoute} onNavigate={navigateTo} />

      <main className="flex-1">
        {activeRoute === 'dashboard' && (
          <DashboardView
            onNavigate={navigateTo}
            onOpenGuide={handleOpenGuide}
            onOpenJourney={handleOpenJourney}
            onExplainToParents={handleExplainToParents}
            onAskKadamAi={(q) => handleAskKadamAi(q)}
          />
        )}

        {activeRoute === 'home' && (
          <HomeView
            onNavigate={navigateTo}
            onOpenGuide={handleOpenGuide}
            onOpenJourney={handleOpenJourney}
            onOpenStagePathway={handleOpenStagePathway}
            onOpenUniverseStage={handleOpenUniverseStage}
            onAskKadamAi={(q) => handleAskKadamAi(q)}
          />
        )}

        {activeRoute === 'universe' && (
          <UniverseView
            selectedSlug={selectedGuideSlug}
            initialStageFilter={universeStageFilter}
            onSelectGuide={setSelectedGuideSlug}
            onAskKadamAi={handleAskKadamAi}
            onOpenJourney={handleOpenJourney}
            onNavigate={navigateTo}
          />
        )}

        {activeRoute === 'pathways' && (
          <PathwaysView
            initialRootId={possibilityRootId}
            initialJourneyId={selectedJourneyId}
            onOpenGuide={handleOpenGuide}
            onExplainToParents={handleExplainToParents}
            onNavigate={navigateTo}
          />
        )}

        {activeRoute === 'discover' && (
          <DiscoverView
            onOpenGuide={handleOpenGuide}
            onAskKadamAi={(q) => handleAskKadamAi(q)}
          />
        )}

        {activeRoute === 'roadmap' && (
          <RoadmapView
            onOpenGuide={handleOpenGuide}
            onExplainToParents={handleExplainToParents}
          />
        )}

        {activeRoute === 'kadam-ai' && (
          <KadamAiView
            initialPrompt={aiInitialPrompt}
            initialContextSlug={aiContextSlug}
            onClearInitialPrompt={() => {
              setAiInitialPrompt(null);
              setAiContextSlug(null);
            }}
            onOpenGuide={handleOpenGuide}
          />
        )}

        {activeRoute === 'tools' && (
          <ToolsView
            initialTab={activeToolTab}
            initialParentPathway={parentBriefPathway}
            onClearInitialParentPathway={() => setParentBriefPathway(null)}
            onOpenGuide={handleOpenGuide}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#D9CFC0] bg-[#E9E2D5]/60 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#D9CFC0]">
            <div className="md:col-span-5 space-y-2">
              <p className="font-serif text-xl font-semibold text-[#34483D] tracking-tight">
                {t.common.brand}
              </p>
              <p className="text-sm font-medium text-[#30342F]">
                {t.common.tagline}
              </p>
              <p className="text-xs text-[#5C625A] leading-relaxed max-w-md pt-1">
                {t.footer.mission}
              </p>
            </div>

            <div className="md:col-span-3 space-y-2">
              <p className="text-xs uppercase tracking-[0.14em] text-[#5C625A]">{t.footer.exploreHeading}</p>
              <ul className="space-y-1.5 text-sm text-[#30342F]">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('dashboard')}
                    className="hover:text-[#34483D] hover:underline"
                  >
                    {t.footer.studentDashboard}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('home')}
                    className="hover:text-[#34483D] hover:underline"
                  >
                    {t.footer.platformOverview}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('universe')}
                    className="hover:text-[#34483D] hover:underline"
                  >
                    {t.footer.universeLink}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('pathways')}
                    className="hover:text-[#34483D] hover:underline"
                  >
                    {t.footer.pathwaysLink}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('discover')}
                    className="hover:text-[#34483D] hover:underline"
                  >
                    {t.footer.discoverLink}
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-2">
              <p className="text-xs uppercase tracking-[0.14em] text-[#5C625A]">
                {t.footer.verificationHeading}
              </p>
              <p className="text-xs text-[#5C625A] leading-relaxed">
                {t.footer.verificationBody}
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5C625A]">
            <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
            <p>{t.footer.batchInfo}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <AppShell />
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
