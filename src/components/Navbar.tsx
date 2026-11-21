import { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';
import { useI18n } from '../hooks/useI18n';
import { LanguageSelector } from './LanguageSelector';

export type AppRoute =
  | 'home'
  | 'universe'
  | 'pathways'
  | 'discover'
  | 'roadmap'
  | 'kadam-ai'
  | 'tools'
  | 'dashboard';

interface NavbarProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export function Navbar({ activeRoute, onNavigate }: NavbarProps) {
  const { signOut } = useFirebase();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: { route: AppRoute; label: string }[] = [
    { route: 'dashboard', label: t.nav.dashboard },
    { route: 'universe', label: t.nav.universe },
    { route: 'pathways', label: t.nav.pathways },
    { route: 'discover', label: t.nav.discover },
    { route: 'roadmap', label: t.nav.roadmap },
    { route: 'kadam-ai', label: t.nav.kadamAi },
    { route: 'tools', label: t.nav.tools },
  ];

  const handleNav = (route: AppRoute) => {
    onNavigate(route);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EC]/95 backdrop-blur-sm border-b border-[#D9CFC0] print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 xl:gap-5">
        {/* Zone 1: Single-line editorial brand wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          title={`${t.common.brand} — ${t.footer.platformOverview}`}
          className="font-serif text-lg sm:text-xl xl:text-2xl font-semibold tracking-tight text-[#34483D] whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
        >
          {t.common.brand}
        </button>

        {/* Zone 2: Clean single-line typography navigation */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-3.5 xl:gap-5 min-w-0">
          {navLinks.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleNav(item.route)}
                className={`text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  isActive
                    ? 'text-[#34483D] border-[#34483D]'
                    : 'text-[#5C625A] border-transparent hover:text-[#34483D] hover:border-[#D9CFC0]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language selector & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="hidden sm:block">
            <LanguageSelector compact ariaLabel={t.common.languageLabel} />
          </div>

          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs xl:text-sm font-medium border border-[#34483D]/35 text-[#34483D] hover:bg-[#34483D] hover:text-[#F7F4EC] transition-colors whitespace-nowrap shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.common.signOut}</span>
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden p-2 text-[#34483D] border border-[#D9CFC0] hover:bg-[#E9E2D5] transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#D9CFC0] bg-[#FCFBF7] px-4 py-4 space-y-2">
          <div className="sm:hidden pb-3 mb-2 border-b border-[#E9E2D5] flex items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-wider text-[#5C625A]">{t.common.languageLabel}</span>
            <LanguageSelector compact ariaLabel={t.common.languageLabel} />
          </div>

          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`block w-full text-left px-3 py-2.5 text-sm font-medium transition-colors ${
              activeRoute === 'home'
                ? 'bg-[#E9E2D5] text-[#34483D]'
                : 'text-[#30342F] hover:bg-[#E9E2D5]/60'
            }`}
          >
            {t.nav.exploreOverview}
          </button>
          {navLinks.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleNav(item.route)}
                className={`block w-full text-left px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E9E2D5] text-[#34483D]'
                    : 'text-[#30342F] hover:bg-[#E9E2D5]/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
