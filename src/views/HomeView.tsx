import { useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Compass,
  ExternalLink,
  Lightbulb,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { scrollIntoViewIfNeeded } from '../lib/smartScroll';
import {
  COMPLETE_GUIDES,
  LEARNING_JOURNEYS,
  OPPORTUNITIES,
  TOPIC_INDEX,
  searchCatalog,
} from '../data/catalog';
import { QUALIFICATION_GROUP_LABELS } from '../i18n/catalogTranslations';
import { ENGAGEMENT_STRINGS, type NobodyFilterKey } from '../i18n/engagementStrings';
import { useI18n, useTranslatedOpportunities } from '../hooks/useI18n';
import { EditorialImage } from '../components/EditorialImage';
import type { AppRoute } from '../components/Navbar';
import type { StudentStage } from '../types/domain';

interface HomeViewProps {
  onNavigate: (route: AppRoute) => void;
  onOpenGuide: (slug: string) => void;
  onOpenJourney: (journeyId: string) => void;
  onOpenStagePathway: (rootId: string) => void;
  onOpenUniverseStage: (stage: StudentStage) => void;
  onAskKadamAi: (initialQuestion: string) => void;
}

const STAGE_CARDS: {
  groupId: string;
  stage: StudentStage;
  rootId: string;
}[] = [
  { groupId: 'class-10', stage: 'after-10', rootId: 'class-10' },
  { groupId: 'class-12', stage: 'class-11-12', rootId: 'class-12-science' },
  { groupId: 'diploma', stage: 'diploma', rootId: 'diploma' },
  { groupId: 'undergraduate', stage: 'undergraduate', rootId: 'undergraduate' },
  { groupId: 'postgraduate-research', stage: 'research', rootId: 'postgraduate-research' },
  { groupId: 'alternative-vocational', stage: 'early-career', rootId: 'alternative-vocational' },
];

const NOBODY_FILTER_KEYS: NobodyFilterKey[] = ['all', 'school', 'college', 'scholarships'];

export function HomeView({
  onNavigate,
  onOpenGuide,
  onOpenJourney,
  onOpenStagePathway,
  onOpenUniverseStage,
  onAskKadamAi,
}: HomeViewProps) {
  const { lang, t, getGuideListMeta, getOppCategoryLabel } = useI18n();
  const engHome = ENGAGEMENT_STRINGS[lang].home;

  const [query, setQuery] = useState('');
  const [nobodyFilter, setNobodyFilter] = useState<NobodyFilterKey>('all');
  const searchResultsRef = useRef<HTMLDivElement | null>(null);

  const searchResults = useMemo(() => searchCatalog(query), [query]);

  const lesserKnownBase = useMemo(() => {
    const allLesserKnown = OPPORTUNITIES.filter((o) => o.lesserKnown);
    if (nobodyFilter === 'all') return allLesserKnown.slice(0, 6);
    if (nobodyFilter === 'school') {
      return allLesserKnown.filter((o) =>
        o.stages.some((s) => s === 'school' || s === 'after-10' || s === 'class-11-12')
      );
    }
    if (nobodyFilter === 'college') {
      return allLesserKnown.filter((o) =>
        o.stages.some((s) => s === 'undergraduate' || s === 'postgraduate' || s === 'research' || s === 'entrepreneurship')
      ).slice(0, 6);
    }
    return allLesserKnown.filter(
      (o) =>
        o.category === 'scholarship' ||
        o.category === 'international' ||
        o.category === 'exchange' ||
        o.category === 'fellowship' ||
        o.category === 'startup-programme'
    ).slice(0, 6);
  }, [nobodyFilter]);

  const { opportunities: lesserKnownOpps } = useTranslatedOpportunities(lesserKnownBase, lang);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      onNavigate('universe');
      return;
    }
    if (searchResults.topics.length > 0 && searchResults.topics[0].status === 'complete') {
      onOpenGuide(searchResults.topics[0].slug);
    } else {
      onAskKadamAi(query.trim());
    }
  };

  return (
    <div className="bg-[#F7F4EC] text-[#30342F]">
      {/* Hero Section: Editorial Asymmetric Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <p className="text-xs font-medium tracking-widest uppercase text-[#B87961]">
                {t.common.taglineSpaced}
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.16] font-semibold text-[#34483D]">
                {t.home.heroTitle}
              </h1>
              <p className="text-base sm:text-lg text-[#5C625A] leading-relaxed max-w-2xl">
                {t.home.heroSubtitle}
              </p>
            </div>

            {/* Global Search Bar */}
            <div className="space-y-3 max-w-2xl">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row border border-[#34483D] bg-[#FCFBF7]">
                <div className="flex items-center flex-1 px-4 py-3.5 gap-3">
                  <Search className="w-5 h-5 text-[#5C625A] shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.home.searchPlaceholder}
                    aria-label={t.home.searchPlaceholder}
                    className="w-full bg-transparent text-base text-[#30342F] placeholder:text-[#5C625A]/80 focus:outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      aria-label={t.common.clear}
                      onClick={() => setQuery('')}
                      className="text-[#5C625A] hover:text-[#34483D]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors whitespace-nowrap shrink-0"
                >
                  {t.home.exploreBtn}
                </button>
              </form>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#5C625A]">
                <span>{t.home.tryAsking}</span>
                {t.home.samples.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setQuery(sample);
                      scrollIntoViewIfNeeded(searchResultsRef.current);
                    }}
                    className="underline decoration-[#D9CFC0] underline-offset-4 hover:text-[#34483D] transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>

              {/* Instant Live Search Results Panel — Inline Directly Below Search Bar */}
              {query.trim().length > 0 && (
                <div
                  ref={searchResultsRef}
                  className="border border-[#34483D]/35 bg-[#FCFBF7] p-5 space-y-4 scroll-target"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-[#E9E2D5] pb-2.5 text-xs text-[#5C625A]">
                    <span>
                      {t.home.instantMatchesFor} <strong className="text-[#34483D]">&ldquo;{query.trim()}&rdquo;</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="text-[#34483D] hover:underline"
                    >
                      {t.common.clear}
                    </button>
                  </div>

                  {searchResults.topics.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#5C625A] mb-2">
                        {t.home.universeTopicsHeading}
                      </p>
                      <div className="divide-y divide-[#E9E2D5]">
                        {searchResults.topics.slice(0, 4).map((topic) => {
                          const meta = getGuideListMeta(topic.slug, topic.title, topic.summary);
                          return (
                            <button
                              key={topic.slug}
                              type="button"
                              onClick={() => onOpenGuide(topic.slug)}
                              className="w-full text-left py-2.5 flex items-start justify-between gap-4 hover:bg-[#F7F4EC] px-2 -mx-2 transition-colors"
                            >
                              <div>
                                <p className="text-sm font-medium text-[#34483D]">{meta.title}</p>
                                <p className="text-xs text-[#5C625A] mt-0.5 line-clamp-1">{meta.summary}</p>
                              </div>
                              <span className="text-xs text-[#8B9B83] whitespace-nowrap shrink-0">
                                {topic.status === 'complete'
                                  ? t.common.completeGuide
                                  : `${t.common.batch} ${topic.batchNumber}`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {searchResults.opportunities.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#5C625A] mb-2">
                        {t.home.discoverOppsHeading}
                      </p>
                      <div className="space-y-1.5">
                        {searchResults.opportunities.slice(0, 2).map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => onNavigate('discover')}
                            className="w-full text-left py-1.5 text-sm text-[#30342F] hover:text-[#34483D] flex items-center justify-between gap-4"
                          >
                            <span>{o.title}</span>
                            <span className="text-xs text-[#5C625A] shrink-0">{o.organization}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.topics.length === 0 && searchResults.opportunities.length === 0 && (
                    <p className="text-sm text-[#5C625A]">{t.home.noExactMatch}</p>
                  )}

                  <div className="pt-2 border-t border-[#E9E2D5] flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[#5C625A]">{t.home.wantPlainAnswer}</p>
                    <button
                      type="button"
                      onClick={() => onAskKadamAi(query.trim())}
                      className="text-xs font-medium text-[#34483D] underline underline-offset-4 hover:text-[#B87961] whitespace-nowrap shrink-0"
                    >
                      {t.home.askKadamAbout} &ldquo;{query.trim().slice(0, 28)}&rdquo; →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Strip */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('roadmap')}
                className="group px-6 py-3 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>{t.home.buildRoadmapBtn}</span>
                <ArrowRight className="w-4 h-4 editorial-arrow" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('pathways')}
                className="px-6 py-3 border border-[#34483D] text-[#34483D] text-sm font-medium hover:bg-[#E9E2D5] transition-colors whitespace-nowrap shrink-0"
              >
                {t.home.openMapBtn}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('kadam-ai')}
                className="text-sm font-medium text-[#34483D] underline underline-offset-4 decoration-[#B87961] hover:text-[#B87961] transition-colors whitespace-nowrap shrink-0"
              >
                {t.home.askKadamLanguages}
              </button>
            </div>
          </div>

          {/* Right Column: Bespoke Editorial Artwork */}
          <div className="lg:col-span-5 flex flex-col">
            <EditorialImage
              src="/src/assets/images/hero_editorial_pathways_1795234423898.jpg"
              alt="Sunlit Indian university colonnade framing a scholar's journal and brass compass"
              caption={t.home.fig1Caption}
              aspectClass="aspect-[4/3] lg:h-full lg:aspect-auto"
              className="flex-1 flex flex-col"
            />
          </div>
        </div>

        {/* Full-Width Quantitative Reference Bar Below Hero Split */}
        <div className="mt-14 pt-8 border-t border-[#D9CFC0] grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <p className="font-serif text-3xl text-[#34483D] tabular-nums">{TOPIC_INDEX.length}</p>
            <p className="text-xs uppercase tracking-wider text-[#5C625A] mt-1">
              {t.home.stat1Label}
            </p>
          </div>
          <div>
            <p className="font-serif text-3xl text-[#34483D] tabular-nums">{COMPLETE_GUIDES.length}</p>
            <p className="text-xs uppercase tracking-wider text-[#5C625A] mt-1">
              {t.home.stat2Label}
            </p>
          </div>
          <div>
            <p className="font-serif text-3xl text-[#34483D] tabular-nums">{LEARNING_JOURNEYS.length}</p>
            <p className="text-xs uppercase tracking-wider text-[#5C625A] mt-1">
              {t.home.stat3Label}
            </p>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl text-[#34483D] tabular-nums">{t.home.stat4Value}</p>
            <p className="text-xs uppercase tracking-wider text-[#5C625A] mt-1">
              {t.home.stat4Label}
            </p>
          </div>
        </div>
      </section>

      {/* Start From Where You Are Today */}
      <section className="border-t border-[#D9CFC0] bg-[#FCFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-widest text-[#B87961] mb-2">
              {t.home.startKicker}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#34483D]">
              {t.home.startTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#5C625A] mt-3 leading-relaxed">
              {t.home.startDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#D9CFC0]">
            {STAGE_CARDS.map((card, idx) => {
              const groupInfo = QUALIFICATION_GROUP_LABELS[card.groupId];
              const cardLabel = groupInfo ? groupInfo[lang] : card.groupId;
              const cardSub = groupInfo
                ? lang === 'hi'
                  ? groupInfo.homeSubHi
                  : lang === 'te'
                    ? groupInfo.homeSubTe
                    : groupInfo.homeSubEn
                : '';

              return (
                <div
                  key={card.groupId}
                  className="group p-7 border-r border-b border-[#D9CFC0] bg-[#FCFBF7] hover:bg-[#F7F4EC] transition-colors flex flex-col justify-between gap-6"
                >
                  <div>
                    <p className="text-xs text-[#8B9B83] tabular-nums mb-2">0{idx + 1}</p>
                    <h3 className="font-serif text-xl text-[#34483D]">{cardLabel}</h3>
                    <p className="text-sm text-[#5C625A] mt-2 leading-relaxed">{cardSub}</p>
                  </div>
                  <div className="flex items-center gap-5 text-xs font-medium text-[#34483D]">
                    <button
                      type="button"
                      onClick={() => onOpenStagePathway(card.rootId)}
                      className="inline-flex items-center gap-1.5 hover:text-[#B87961] transition-colors"
                    >
                      <span>{t.home.possibilityMapCta}</span>
                      <ArrowRight className="w-3.5 h-3.5 editorial-arrow" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenUniverseStage(card.stage)}
                      className="text-[#5C625A] hover:text-[#34483D] underline underline-offset-4 transition-colors"
                    >
                      {t.home.readGuidesCta}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Four Core Pillars Editorial Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-20">
        {/* Pillar 1: The Agla Kadam Universe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <EditorialImage
              src="/src/assets/images/universe_library_archive_1795234422983.jpg"
              alt="Scholarly library alcove representing The Agla Kadam Universe knowledge library"
              caption={t.home.pillar1Caption}
            />
          </div>
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs uppercase tracking-widest text-[#B87961]">{t.home.pillar1Kicker}</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#34483D]">
              {t.home.pillar1Title}
            </h2>
            <p className="text-base text-[#5C625A] leading-relaxed reading-measure">
              {t.home.pillar1Desc}
            </p>
            <div className="divide-y divide-[#D9CFC0] border-t border-b border-[#D9CFC0]">
              {COMPLETE_GUIDES.slice(0, 4).map((guide) => {
                const meta = getGuideListMeta(guide.slug, guide.title, guide.summary);
                return (
                  <button
                    key={guide.slug}
                    type="button"
                    onClick={() => onOpenGuide(guide.slug)}
                    className="group w-full py-3.5 flex items-center justify-between gap-4 text-left hover:bg-[#FCFBF7]/80 px-2 -mx-2 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#34483D] group-hover:text-[#B87961] transition-colors">
                        {meta.title}
                      </p>
                      <p className="text-xs text-[#5C625A] mt-0.5">
                        {t.common.verified} {guide.lastVerifiedDate} · {guide.readingTimeMinutes} {t.common.minRead}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B87961] shrink-0 editorial-arrow" />
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => onNavigate('universe')}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#34483D] hover:text-[#B87961] transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              {t.home.browseAllTopics}
            </button>
          </div>
        </div>

        {/* Pillar 2: Interactive Possibility Map & My Next Kadam */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-5">
            <p className="text-xs uppercase tracking-widest text-[#B87961]">{t.home.pillar2Kicker}</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#34483D]">
              {t.home.pillar2Title}
            </h2>
            <p className="text-base text-[#5C625A] leading-relaxed reading-measure">
              {t.home.pillar2Desc}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('pathways')}
                className="px-5 py-2.5 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                {t.home.exploreMapBtn}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('roadmap')}
                className="px-5 py-2.5 border border-[#34483D] text-[#34483D] text-sm font-medium hover:bg-[#E9E2D5] transition-colors"
              >
                {t.home.generateRoadmapBtn}
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <EditorialImage
              src="/src/assets/images/possibility_map_compass_1795234424202.jpg"
              alt="Cartographic compass showing branching educational pathways"
              caption={t.home.pillar2Caption}
            />
          </div>
        </div>

        {/* Pillar 3: Kadam Discover & Universities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <EditorialImage
              src="/src/assets/images/discover_horizon_campus_1795234422914.jpg"
              alt="Indian university sandstone colonnade courtyard at morning light"
              caption={t.home.pillar3Caption}
            />
          </div>
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs uppercase tracking-widest text-[#B87961]">{t.home.pillar3Kicker}</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#34483D]">
              {t.home.pillar3Title}
            </h2>
            <p className="text-base text-[#5C625A] leading-relaxed reading-measure">
              {t.home.pillar3Desc}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('discover')}
                className="group px-5 py-2.5 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors inline-flex items-center gap-2"
              >
                <span>{t.home.openDiscoverBtn}</span>
                <ArrowRight className="w-4 h-4 editorial-arrow" />
              </button>
              <button
                type="button"
                onClick={() => onOpenJourney('write-publish-research-paper')}
                className="px-5 py-2.5 border border-[#34483D] text-[#34483D] text-sm font-medium hover:bg-[#E9E2D5] transition-colors"
              >
                {t.home.exploreJourneysBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Discovery Spotlight: What Nobody Told Me */}
      <section className="border-t border-[#D9CFC0] bg-[#E9E2D5]/55">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs uppercase tracking-widest text-[#B87961] inline-flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> {t.home.nobodyToldKicker}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#34483D]">
                {t.home.nobodyToldTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#5C625A] leading-relaxed">
                {engHome.nobodySubtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('discover')}
                className="text-xs font-medium text-[#34483D] underline underline-offset-4 hover:text-[#B87961] whitespace-nowrap"
              >
                {engHome.exploreAllDiscover} →
              </button>
              <button
                type="button"
                onClick={() => onNavigate('tools')}
                className="px-4 py-2 border border-[#34483D] bg-[#FCFBF7] text-xs font-medium text-[#34483D] hover:bg-[#34483D] hover:text-[#F7F4EC] transition-colors whitespace-nowrap"
              >
                {t.home.runGapDetector}
              </button>
            </div>
          </div>

          {/* Interactive Focus Filters */}
          <div className="flex flex-wrap gap-2">
            {NOBODY_FILTER_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setNobodyFilter(key)}
                className={`px-4 py-2 text-xs font-medium border transition-colors whitespace-nowrap ${
                  nobodyFilter === key
                    ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                    : 'bg-[#FCFBF7] text-[#30342F] border-[#D9CFC0] hover:border-[#34483D]'
                }`}
              >
                {engHome.nobodyFilters[key]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lesserKnownOpps.map((opp) => (
              <article
                key={opp.id}
                className="bg-[#FCFBF7] border border-[#D9CFC0] p-6 flex flex-col justify-between gap-5 editorial-lift"
              >
                <div className="space-y-3">
                  <p className="text-xs text-[#5C625A]">
                    <span className="uppercase tracking-wider text-[#B87961] font-medium">
                      {getOppCategoryLabel(opp.category)}
                    </span>
                    <span aria-hidden="true"> · </span>
                    <span>{opp.organization}</span>
                  </p>
                  <h3 className="font-serif text-xl text-[#34483D] leading-snug">{opp.title}</h3>

                  <div className="bg-[#F7F4EC] border border-[#E9E2D5] p-3.5 space-y-1">
                    <p className="text-[11px] uppercase tracking-wider text-[#B87961] font-medium">
                      {engHome.whyNobodyTellsLabel}
                    </p>
                    <p className="text-sm text-[#30342F] leading-relaxed">
                      {opp.whatNobodyTellsYou || opp.benefitSummary}
                    </p>
                  </div>

                  <dl className="space-y-1.5 text-xs text-[#5C625A] pt-1">
                    <div>
                      <dt className="inline font-medium text-[#34483D]">{engHome.eligibilityLabel}: </dt>
                      <dd className="inline">{opp.eligibilitySummary}</dd>
                    </div>
                    <div className="flex items-center gap-1.5 tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-[#8B9B83] shrink-0" />
                      <span>
                        {opp.dataOrigin === 'demonstration' ? t.home.demoCycleNote : opp.cycleWindow}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#34483D] shrink-0" />
                      <span>
                        {opp.sourceName} · {t.common.verified} {opp.lastVerifiedDate}
                      </span>
                    </div>
                  </dl>
                </div>

                <div className="pt-4 border-t border-[#E9E2D5] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => onAskKadamAi(`${engHome.askAiTemplatePrefix} "${opp.title}" (${opp.organization}).`)}
                    className="inline-flex items-center gap-1.5 font-medium text-[#34483D] hover:text-[#B87961] transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {engHome.askAiAboutThis}
                  </button>
                  <a
                    href={opp.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-[#34483D] hover:text-[#B87961] transition-colors"
                  >
                    {t.common.officialSite} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Kadam AI + Special Tools Editorial Invitation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="bg-[#34483D] text-[#F7F4EC] p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <p className="text-xs uppercase tracking-widest text-[#E9E2D5]/80">
              {t.home.aiBannerKicker}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F4EC]">
              {t.home.aiBannerTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#E9E2D5] leading-relaxed max-w-2xl">
              {t.home.aiBannerDesc}
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              type="button"
              onClick={() => onNavigate('kadam-ai')}
              className="px-6 py-3.5 bg-[#F7F4EC] text-[#34483D] text-sm font-semibold hover:bg-[#E9E2D5] transition-colors inline-flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              {t.home.openKadamAiBtn}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('tools')}
              className="px-6 py-3.5 border border-[#F7F4EC]/40 text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {t.home.decodeDocBtn}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
