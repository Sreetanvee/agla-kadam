import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  ExternalLink,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  CATEGORIES,
  CATEGORY_MAP,
  COMPLETE_GUIDES,
  COMPLETE_GUIDE_MAP,
  LEARNING_JOURNEYS,
  OPPORTUNITIES,
  TOPIC_INDEX,
} from '../data/catalog';
import { useFirebase } from '../contexts/FirebaseContext';
import { useI18n, useTranslatedGuide, useTranslatedOpportunities } from '../hooks/useI18n';
import { ENGAGEMENT_STRINGS } from '../i18n/engagementStrings';
import { useVoice } from '../hooks/useVoice';
import { scrollIntoViewIfNeeded } from '../lib/smartScroll';
import type { AppRoute } from '../components/Navbar';
import type { ExplanationDepth, StudentStage } from '../types/domain';

interface UniverseViewProps {
  selectedSlug: string | null;
  initialStageFilter?: StudentStage | 'all';
  onSelectGuide: (slug: string | null) => void;
  onAskKadamAi: (question: string, contextSlug?: string) => void;
  onOpenJourney?: (journeyId: string) => void;
  onNavigate?: (route: AppRoute) => void;
}

const STAGE_OPTIONS: { value: StudentStage | 'all'; fallback: string }[] = [
  { value: 'all', fallback: 'All Stages' },
  { value: 'school', fallback: 'School' },
  { value: 'after-10', fallback: 'After Class 10' },
  { value: 'class-11-12', fallback: 'Class 11–12' },
  { value: 'diploma', fallback: 'Diploma' },
  { value: 'undergraduate', fallback: 'Undergraduate' },
  { value: 'postgraduate', fallback: 'Postgraduate' },
  { value: 'research', fallback: 'Research' },
  { value: 'graduate-jobseeker', fallback: 'Job Seekers' },
  { value: 'entrepreneurship', fallback: 'Startups' },
  { value: 'international', fallback: 'International' },
];

export function UniverseView({
  selectedSlug,
  initialStageFilter = 'all',
  onSelectGuide,
  onAskKadamAi,
  onOpenJourney,
  onNavigate,
}: UniverseViewProps) {
  const { isBookmarked, toggleBookmark, learningProgress, updateLearningProgress, user } =
    useFirebase();
  const {
    lang,
    t,
    getCategoryMeta,
    getGuideListMeta,
    getJourneyListMeta,
    getStageLabel,
    getOppCategoryLabel,
  } = useI18n();
  const eng = ENGAGEMENT_STRINGS[lang].universe;
  const { speakingId, speakText, stopSpeaking } = useVoice();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<StudentStage | 'all'>(initialStageFilter);
  const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'scheduled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [depth, setDepth] = useState<ExplanationDepth>('beginner');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Unconditional top-level hooks for guide & contextual opportunity translation
  const rawCompleteGuide = selectedSlug ? COMPLETE_GUIDE_MAP[selectedSlug] : undefined;
  const {
    guide: completeGuide,
    translating: translatingGuide,
    error: translateError,
    retry: retryTranslation,
  } = useTranslatedGuide(rawCompleteGuide, lang);

  const matchingOpportunitiesRaw = useMemo(() => {
    if (!rawCompleteGuide) return [];
    const guideStages = new Set(rawCompleteGuide.stages);
    const scored = OPPORTUNITIES.map((opp) => {
      const stageOverlap = opp.stages.filter((s) => guideStages.has(s)).length;
      return { opp, score: stageOverlap * 2 + (opp.lesserKnown ? 1 : 0) };
    })
      .filter((x) => x.score > 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.opp);
    return scored.length > 0 ? scored : OPPORTUNITIES.filter((o) => o.lesserKnown).slice(0, 2);
  }, [rawCompleteGuide]);

  const { opportunities: matchingOpportunities } = useTranslatedOpportunities(
    matchingOpportunitiesRaw,
    lang
  );

  const connectedJourney = useMemo(() => {
    if (!selectedSlug) return null;
    return (
      LEARNING_JOURNEYS.find((j) =>
        j.stages.some((s) => s.linkedGuideSlugs.includes(selectedSlug))
      ) || null
    );
  }, [selectedSlug]);

  const completedGuideSlugs = useMemo(() => {
    return new Set(
      learningProgress
        .filter((p) => p.itemType === 'guide' && p.percentComplete >= 100)
        .map((p) => p.itemId)
    );
  }, [learningProgress]);

  const completedBatch1Count = useMemo(
    () => COMPLETE_GUIDES.filter((g) => completedGuideSlugs.has(g.slug)).length,
    [completedGuideSlugs]
  );

  useEffect(() => {
    setStageFilter(initialStageFilter);
  }, [initialStageFilter]);

  useEffect(() => {
    stopSpeaking();
    setOpenFaqIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedSlug]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    scrollIntoViewIfNeeded(resultsRef.current);
  };

  const handleStageChange = (stage: StudentStage | 'all') => {
    setStageFilter(stage);
    scrollIntoViewIfNeeded(resultsRef.current);
  };

  const handleStatusChange = (status: 'all' | 'complete' | 'scheduled') => {
    setStatusFilter(status);
    scrollIntoViewIfNeeded(resultsRef.current);
  };

  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TOPIC_INDEX.filter((topic) => {
      if (activeCategory !== 'all' && topic.categoryId !== activeCategory) return false;
      if (stageFilter !== 'all' && !topic.stages.includes(stageFilter)) return false;
      if (statusFilter !== 'all' && topic.status !== statusFilter) return false;
      if (q) {
        const meta = getGuideListMeta(topic.slug, topic.title, topic.summary);
        const catObj = CATEGORY_MAP[topic.categoryId];
        const catMeta = catObj ? getCategoryMeta(catObj) : null;
        const hay = `${topic.title} ${topic.summary} ${meta.title} ${meta.summary} ${topic.keywords.join(' ')} ${catObj?.name ?? ''} ${catMeta?.name ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [activeCategory, stageFilter, statusFilter, searchQuery, lang]);

  // If a specific topic/guide is opened
  if (selectedSlug) {
    const indexedTopic = TOPIC_INDEX.find((topic) => topic.slug === selectedSlug);

    if (!indexedTopic) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <button
            type="button"
            onClick={() => onSelectGuide(null)}
            className="inline-flex items-center gap-2 text-sm text-[#34483D] hover:text-[#B87961] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> {t.universe.backToUniverse}
          </button>
          <h1 className="font-serif text-3xl text-[#34483D]">{t.universe.topicNotFound}</h1>
        </div>
      );
    }

    const cat = CATEGORY_MAP[indexedTopic.categoryId];
    const catMeta = cat ? getCategoryMeta(cat) : null;

    // Transparent Scheduled Batch View (never fake placeholder or empty text!)
    if (!completeGuide) {
      const topicMeta = getGuideListMeta(indexedTopic.slug, indexedTopic.title, indexedTopic.summary);
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <button
            type="button"
            onClick={() => onSelectGuide(null)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#34483D] hover:text-[#B87961] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t.universe.backToUniverse}
          </button>

          <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-8 sm:p-10 space-y-6">
            <p className="text-xs uppercase tracking-widest text-[#B87961]">
              {cat?.number} · {catMeta?.name} · {t.universe.scheduledForBatch} {indexedTopic.batchNumber}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#34483D]">{topicMeta.title}</h1>
            <p className="text-base text-[#30342F] leading-relaxed reading-measure">{topicMeta.summary}</p>

            <div className="border-t border-b border-[#E9E2D5] py-5 space-y-2 text-sm text-[#5C625A]">
              <p className="font-medium text-[#34483D]">{t.universe.whyScheduledTitle}</p>
              <p className="leading-relaxed">
                {t.universe.whyScheduledBody}{' '}
                <strong className="text-[#34483D]">
                  {t.common.batch} {indexedTopic.batchNumber}
                </strong>
                .
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() =>
                  onAskKadamAi(
                    `Please give me a complete, beginner-friendly explanation from zero on: "${indexedTopic.title}". Cover what it is, eligibility, documents required, step-by-step process, risks, and which official Indian/global portals to verify.`,
                    indexedTopic.slug
                  )
                }
                className="px-6 py-3 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                {t.universe.getAiBriefing}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('complete');
                  onSelectGuide(null);
                }}
                className="px-6 py-3 border border-[#34483D] text-[#34483D] text-sm font-medium hover:bg-[#E9E2D5] transition-colors"
              >
                {t.universe.readBatch1Guides}
              </button>
            </div>
          </div>
        </div>
      );
    }

    const saved = isBookmarked('guide', completeGuide.slug);
    const isCompleted = completedGuideSlugs.has(completeGuide.slug);
    const nextSuggestedSlug = completeGuide.relatedGuideSlugs.find(
      (s) => COMPLETE_GUIDE_MAP[s] && !completedGuideSlugs.has(s)
    ) || completeGuide.relatedGuideSlugs.find((s) => Boolean(COMPLETE_GUIDE_MAP[s]));
    const nextSuggestedGuide = nextSuggestedSlug ? COMPLETE_GUIDE_MAP[nextSuggestedSlug] : null;
    const nextSuggestedMeta = nextSuggestedGuide
      ? getGuideListMeta(nextSuggestedGuide.slug, nextSuggestedGuide.title, nextSuggestedGuide.summary)
      : null;

    const depthSummary =
      depth === 'beginner'
        ? completeGuide.beginnerSummary
        : depth === 'intermediate'
          ? completeGuide.intermediateSummary
          : completeGuide.advancedSummary;

    const audioScript = `${completeGuide.title}. ${depthSummary} ${completeGuide.whatItIs} ${completeGuide.howItWorks}`;

    return (
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <button
          type="button"
          onClick={() => onSelectGuide(null)}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#34483D] hover:text-[#B87961] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> {t.universe.all150Topics}
        </button>

        {/* Subtle translation status bar */}
        {translatingGuide && (
          <div className="mb-6 border border-[#D9CFC0] bg-[#FCFBF7] px-4 py-3 text-xs text-[#34483D] flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>{t.common.translatingContent}</span>
          </div>
        )}
        {!translatingGuide && translateError && lang !== 'en' && (
          <div className="mb-6 border border-[#D9CFC0] bg-[#E9E2D5]/60 px-4 py-3 text-xs text-[#30342F] flex flex-wrap items-center justify-between gap-3">
            <span>{t.common.translationError}</span>
            <button
              type="button"
              onClick={retryTranslation}
              className="inline-flex items-center gap-1.5 font-medium text-[#34483D] underline underline-offset-4 hover:text-[#B87961]"
            >
              <RefreshCw className="w-3.5 h-3.5" /> {t.common.retryTranslation}
            </button>
          </div>
        )}

        {/* Editorial Guide Header */}
        <header className="pb-8 border-b border-[#D9CFC0] space-y-5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5C625A]">
            <span className="uppercase tracking-widest text-[#B87961] font-medium">
              {cat?.number} · {catMeta?.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {t.common.completeGuide} ({t.common.batch} {completeGuide.batchNumber})
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {t.common.verified} {completeGuide.lastVerifiedDate}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {completeGuide.readingTimeMinutes} {t.common.minRead}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#34483D] leading-tight max-w-4xl">
            {completeGuide.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() =>
                toggleBookmark({
                  itemType: 'guide',
                  itemId: completeGuide.slug,
                  title: completeGuide.title,
                  category: catMeta?.shortName || cat?.shortName,
                })
              }
              className={`px-4 py-2 text-xs font-medium border inline-flex items-center gap-2 transition-colors ${
                saved
                  ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                  : 'border-[#34483D] text-[#34483D] hover:bg-[#E9E2D5]'
              }`}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {saved ? t.common.savedToDashboard : t.common.saveGuide}
            </button>

            <button
              type="button"
              onClick={() => speakText(completeGuide.slug, audioScript, lang)}
              className="px-4 py-2 text-xs font-medium border border-[#D9CFC0] bg-[#FCFBF7] text-[#30342F] hover:bg-[#E9E2D5] inline-flex items-center gap-2 transition-colors"
            >
              {speakingId === completeGuide.slug ? (
                <>
                  <VolumeX className="w-4 h-4 text-[#B87961]" /> {t.common.stopAudio}
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#34483D]" /> {t.common.listen}
                </>
              )}
            </button>

            {user && (
              <button
                type="button"
                onClick={() =>
                  updateLearningProgress({
                    itemType: 'guide',
                    itemId: completeGuide.slug,
                    title: completeGuide.title,
                    completedSteps: isCompleted ? [] : ['completed'],
                    percentComplete: isCompleted ? 0 : 100,
                  })
                }
                className={`px-4 py-2 text-xs font-medium border inline-flex items-center gap-2 transition-colors ${
                  isCompleted
                    ? 'border-[#34483D] bg-[#34483D]/10 text-[#34483D]'
                    : 'border-[#D9CFC0] text-[#5C625A] hover:text-[#34483D] hover:border-[#34483D]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCompleted ? t.common.completed : t.common.markCompleted}
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                onAskKadamAi(
                  `I am reading the guide "${completeGuide.title}". Can you explain how this applies to my situation?`,
                  completeGuide.slug
                )
              }
              className="px-4 py-2 text-xs font-medium bg-[#B87961] text-[#FCFBF7] hover:bg-[#9B5F49] inline-flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              {t.common.askKadamAi}
            </button>
          </div>

          {/* Rewarding Reading Completion State */}
          {isCompleted && (
            <div className="border border-[#8B9B83] bg-[#34483D]/[0.04] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#34483D] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#34483D]">{eng.completedBannerTitle}</p>
                  <p className="text-xs text-[#5C625A] leading-relaxed">{eng.completedBannerDesc}</p>
                </div>
              </div>
              {nextSuggestedGuide && nextSuggestedMeta && (
                <button
                  type="button"
                  onClick={() => onSelectGuide(nextSuggestedGuide.slug)}
                  className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#34483D] border border-[#34483D] bg-[#FCFBF7] px-3.5 py-2 hover:bg-[#34483D] hover:text-[#F7F4EC] transition-colors shrink-0 self-start sm:self-center"
                >
                  <span>{eng.nextRecommendedGuide}</span>
                  <ArrowRight className="w-3.5 h-3.5 editorial-arrow" />
                </button>
              )}
            </div>
          )}
        </header>

        {/* Asymmetric 70/30 Editorial Reading Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
          {/* Main Reading Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Explanation Depth Switcher */}
            <section className="bg-[#FCFBF7] border border-[#D9CFC0] p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-serif text-xl text-[#34483D]">{t.universe.depthLabel}</h2>
                <div className="inline-flex border border-[#D9CFC0] bg-[#F7F4EC] p-1">
                  {(
                    [
                      ['beginner', t.universe.depthBeginner],
                      ['intermediate', t.universe.depthIntermediate],
                      ['advanced', t.universe.depthAdvanced],
                    ] as [ExplanationDepth, string][]
                  ).map(([lvl, label]) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDepth(lvl)}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                        depth === lvl
                          ? 'bg-[#34483D] text-[#F7F4EC]'
                          : 'text-[#5C625A] hover:text-[#34483D]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-base text-[#30342F] leading-relaxed reading-measure">
                {depthSummary}
              </p>
            </section>

            {/* 01. What It Is / Why / Who / How */}
            <section id="sec-basics" className="space-y-6 reading-measure">
              <div>
                <h2 className="font-serif text-2xl text-[#34483D] mb-2">
                  01. {t.universe.secWhatItIs}
                </h2>
                <p className="text-base text-[#30342F] leading-relaxed">{completeGuide.whatItIs}</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#34483D] mb-2">
                  02. {t.universe.secWhyItExists}
                </h2>
                <p className="text-base text-[#30342F] leading-relaxed">{completeGuide.whyItExists}</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#34483D] mb-2">
                  03. {t.universe.secWhoNeedsIt}
                </h2>
                <p className="text-base text-[#30342F] leading-relaxed">{completeGuide.whoNeedsIt}</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#34483D] mb-2">
                  04. {t.universe.secHowItWorks}
                </h2>
                <p className="text-base text-[#30342F] leading-relaxed">{completeGuide.howItWorks}</p>
              </div>
            </section>

            {/* 05. Types and Pathways */}
            <section id="sec-pathways" className="space-y-4 pt-6 border-t border-[#D9CFC0]">
              <h2 className="font-serif text-2xl text-[#34483D]">
                05. {t.universe.secTypesPathways}
              </h2>
              <div className="divide-y divide-[#D9CFC0] border-t border-b border-[#D9CFC0]">
                {completeGuide.typesAndPathways.map((item) => (
                  <div key={item.title} className="py-4 space-y-1">
                    <h3 className="font-medium text-base text-[#34483D]">{item.title}</h3>
                    <p className="text-sm text-[#5C625A] leading-relaxed reading-measure">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 06. Eligibility & 07. Documents */}
            <section id="sec-eligibility" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#D9CFC0]">
              <div className="space-y-3">
                <h2 className="font-serif text-2xl text-[#34483D]">
                  06. {t.universe.secEligibility}
                </h2>
                <ul className="space-y-2.5 text-sm text-[#30342F] leading-relaxed">
                  {completeGuide.eligibility.map((e, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="text-[#B87961] font-medium tabular-nums">{i + 1}.</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h2 className="font-serif text-2xl text-[#34483D]">
                  07. {t.universe.secDocuments}
                </h2>
                <ul className="space-y-2.5 text-sm text-[#30342F] leading-relaxed">
                  {completeGuide.documentsAndRequirements.map((d, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="text-[#8B9B83] font-medium">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 08. Step-by-Step Procedure */}
            <section id="sec-steps" className="space-y-5 pt-6 border-t border-[#D9CFC0]">
              <h2 className="font-serif text-2xl text-[#34483D]">08. {t.universe.secSteps}</h2>
              <ol className="space-y-5">
                {completeGuide.stepByStepProcedure.map((s) => (
                  <li key={s.step} className="flex gap-4 items-start">
                    <span className="w-8 h-8 shrink-0 border border-[#34483D] text-[#34483D] text-xs font-semibold flex items-center justify-center tabular-nums">
                      0{s.step}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-base font-medium text-[#34483D]">{s.title}</h3>
                      <p className="text-sm text-[#5C625A] leading-relaxed reading-measure">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* 09. What Happens Next */}
            <section id="sec-next" className="space-y-2 pt-6 border-t border-[#D9CFC0] reading-measure">
              <h2 className="font-serif text-2xl text-[#34483D]">09. {t.universe.secWhatNext}</h2>
              <p className="text-base text-[#30342F] leading-relaxed">{completeGuide.whatHappensNext}</p>
            </section>

            {/* 10. Benefits & 11. Limitations/Risks */}
            <section id="sec-tradeoffs" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#D9CFC0]">
              <div className="space-y-3">
                <h2 className="font-serif text-2xl text-[#34483D]">
                  10. {t.universe.secBenefits}
                </h2>
                <ul className="space-y-2.5 text-sm text-[#30342F] leading-relaxed">
                  {completeGuide.opportunitiesAndBenefits.map((b, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="text-[#34483D] font-semibold">+</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h2 className="font-serif text-2xl text-[#34483D]">
                  11. {t.universe.secRisksCosts}
                </h2>
                <ul className="space-y-2.5 text-sm text-[#30342F] leading-relaxed">
                  {completeGuide.limitationsCostsRisks.map((r, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="text-[#B87961] font-semibold">!</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 12. Common Mistakes */}
            <section id="sec-mistakes" className="bg-[#E9E2D5]/60 p-6 sm:p-8 space-y-3">
              <h2 className="font-serif text-2xl text-[#34483D]">
                12. {t.universe.secMistakes}
              </h2>
              <ul className="space-y-2.5 text-sm text-[#30342F] leading-relaxed">
                {completeGuide.commonMistakes.map((m, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="text-[#B87961] font-semibold tabular-nums">{i + 1}.</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 13. Frequently Asked Questions */}
            <section id="sec-faqs" className="space-y-4 pt-6 border-t border-[#D9CFC0]">
              <h2 className="font-serif text-2xl text-[#34483D]">13. {t.universe.secFaqs}</h2>
              <div className="divide-y divide-[#D9CFC0] border-t border-b border-[#D9CFC0]">
                {completeGuide.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={faq.question} className="py-4">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between gap-4 text-left hover:text-[#B87961] transition-colors"
                      >
                        <span className="font-medium text-base text-[#34483D]">{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[#5C625A] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#5C625A] shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <p className="mt-3 text-sm text-[#5C625A] leading-relaxed reading-measure">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Margin Rail: Official Resources, Contextual Opportunities, Journey & Related Guides */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 space-y-4">
                <p className="text-xs uppercase tracking-widest text-[#B87961]">
                  {t.universe.secOfficialPortals}
                </p>
                <p className="text-xs text-[#5C625A] leading-relaxed">
                  {t.common.verified}{' '}
                  <strong className="text-[#34483D] tabular-nums">{completeGuide.lastVerifiedDate}</strong>.{' '}
                  {t.universe.verifiedPortalNote}
                </p>
                <ul className="divide-y divide-[#E9E2D5] border-t border-[#E9E2D5]">
                  {completeGuide.officialResources.map((res) => (
                    <li key={res.url} className="py-3">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-start justify-between gap-2 text-sm font-medium text-[#34483D] hover:text-[#B87961] transition-colors"
                      >
                        <span>{res.label}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-1" />
                      </a>
                      <p className="text-xs text-[#5C625A] mt-0.5">{res.authority}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contextual Recommendation: Connected Learning Journey */}
              {connectedJourney && onOpenJourney && (
                <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 space-y-3 editorial-card">
                  <p className="text-xs uppercase tracking-widest text-[#B87961] inline-flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" /> {eng.relatedJourneyHeading}
                  </p>
                  <p className="font-serif text-lg text-[#34483D] leading-snug">
                    {getJourneyListMeta(connectedJourney.id, connectedJourney.title, connectedJourney.subtitle).title}
                  </p>
                  <p className="text-xs text-[#5C625A] leading-relaxed">
                    {getJourneyListMeta(connectedJourney.id, connectedJourney.title, connectedJourney.subtitle).subtitle}
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenJourney(connectedJourney.id)}
                    className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#34483D] hover:text-[#B87961] transition-colors pt-1"
                  >
                    <span>{eng.openJourneyCta}</span>
                    <ArrowRight className="w-3.5 h-3.5 editorial-arrow" />
                  </button>
                </div>
              )}

              {/* Contextual Recommendations: Matching Verified Opportunities */}
              {matchingOpportunities.length > 0 && (
                <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-[#5C625A]">
                    {eng.relatedOpportunitiesHeading}
                  </p>
                  <div className="divide-y divide-[#E9E2D5]">
                    {matchingOpportunities.map((opp) => (
                      <div key={opp.id} className="py-3 space-y-1">
                        <p className="text-[11px] text-[#B87961]">
                          {getOppCategoryLabel(opp.category)} · {opp.cycleWindow}
                        </p>
                        <a
                          href={opp.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-start justify-between gap-2 text-sm font-medium text-[#34483D] hover:text-[#B87961] transition-colors"
                        >
                          <span>{opp.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('discover')}
                      className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#34483D] hover:text-[#B87961] transition-colors pt-1"
                    >
                      <span>{eng.exploreAllOppsCta}</span>
                      <ArrowRight className="w-3.5 h-3.5 editorial-arrow" />
                    </button>
                  )}
                </div>
              )}

              {/* Related Complete Guides */}
              <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 space-y-3">
                <p className="text-xs uppercase tracking-widest text-[#5C625A]">
                  {t.universe.secRelatedGuides}
                </p>
                <div className="divide-y divide-[#E9E2D5]">
                  {completeGuide.relatedGuideSlugs.map((relSlug) => {
                    const rel = COMPLETE_GUIDE_MAP[relSlug];
                    if (!rel) return null;
                    const relMeta = getGuideListMeta(rel.slug, rel.title, rel.summary);
                    return (
                      <button
                        key={rel.slug}
                        type="button"
                        onClick={() => onSelectGuide(rel.slug)}
                        className="group w-full py-3 text-left flex items-center justify-between gap-3 text-sm text-[#34483D] hover:text-[#B87961] transition-colors"
                      >
                        <span>{relMeta.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 editorial-arrow" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>
    );
  }

  // Main Universe Catalogue View
  const activeCatObj = activeCategory !== 'all' ? CATEGORY_MAP[activeCategory] : null;
  const activeCatMeta = activeCatObj ? getCategoryMeta(activeCatObj) : null;
  const readPct = Math.round((completedBatch1Count / COMPLETE_GUIDES.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-7">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-2.5">
          <p className="text-xs uppercase tracking-widest text-[#B87961]">{t.universe.kicker}</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#34483D]">{t.universe.title}</h1>
          <p className="text-sm sm:text-base text-[#5C625A] leading-relaxed">{t.universe.subtitle}</p>
        </div>

        {/* Quiet Reading Progress Summary */}
        {user && (
          <div className="border border-[#D9CFC0] bg-[#FCFBF7] px-5 py-4 min-w-[240px] space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="uppercase tracking-wider text-[#5C625A]">{eng.readProgressLabel}</span>
              <span className="font-medium text-[#34483D] tabular-nums">{readPct}%</span>
            </div>
            <div className="h-1.5 bg-[#E9E2D5] w-full overflow-hidden">
              <div className="h-full bg-[#34483D] progress-fill" style={{ width: `${readPct}%` }} />
            </div>
            <p className="text-xs text-[#5C625A] tabular-nums">
              <strong className="text-[#34483D]">{completedBatch1Count}</strong> {eng.readProgressOf}{' '}
              {COMPLETE_GUIDES.length} {eng.guidesRead}
            </p>
          </div>
        )}
      </header>

      {/* Search & Filter Controls */}
      <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-4 sm:p-5 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 flex items-center gap-2.5 border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 focus-within:border-[#34483D] transition-colors">
            <Search className="w-4 h-4 text-[#5C625A] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.universe.searchPlaceholder}
              className="w-full bg-transparent text-sm text-[#30342F] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label={t.common.clear}
                onClick={() => setSearchQuery('')}
                className="text-[#5C625A] hover:text-[#34483D]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile / Tablet Compact Category Picker so Results Appear Immediately Below */}
          <div className="md:col-span-4 lg:hidden">
            <select
              aria-label={t.universe.categoryLabel}
              value={activeCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full h-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2.5 text-sm text-[#30342F]"
            >
              <option value="all">
                {t.universe.all18Categories} ({TOPIC_INDEX.length})
              </option>
              {CATEGORIES.map((cat) => {
                const catMeta = getCategoryMeta(cat);
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.number}. {catMeta.name} ({cat.topicCount})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="md:col-span-3 lg:col-span-3">
            <select
              aria-label={t.universe.stageLabel}
              value={stageFilter}
              onChange={(e) => handleStageChange(e.target.value as StudentStage | 'all')}
              className="w-full h-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2.5 text-sm text-[#30342F]"
            >
              {STAGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {getStageLabel(o.value, o.fallback)}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-12 lg:col-span-4 flex border border-[#D9CFC0] bg-[#F7F4EC] p-1">
            {(
              [
                ['all', `${t.common.allStatuses} (${TOPIC_INDEX.length})`],
                ['complete', `${t.universe.completeOnly} (${COMPLETE_GUIDES.length})`],
                ['scheduled', t.universe.scheduledOnly],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => handleStatusChange(val)}
                className={`flex-1 py-1.5 text-xs font-medium transition-colors whitespace-nowrap px-2 ${
                  statusFilter === val
                    ? 'bg-[#34483D] text-[#F7F4EC]'
                    : 'text-[#5C625A] hover:text-[#34483D]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Sticky Category Sidebar + Instant Topic Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto space-y-1 pr-1">
          <p className="text-xs uppercase tracking-widest text-[#5C625A] mb-3">
            {t.universe.categoryLabel}
          </p>
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#34483D] text-[#F7F4EC] font-medium'
                : 'text-[#30342F] hover:bg-[#E9E2D5]'
            }`}
          >
            <span>{t.universe.all18Categories}</span>
            <span className="text-xs tabular-nums opacity-80">{TOPIC_INDEX.length}</span>
          </button>
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            const catMeta = getCategoryMeta(cat);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors ${
                  active
                    ? 'bg-[#34483D] text-[#F7F4EC] font-medium'
                    : 'text-[#30342F] hover:bg-[#E9E2D5]'
                }`}
              >
                <span className="truncate">
                  <span className="tabular-nums opacity-65 mr-2">{cat.number}</span>
                  {catMeta.name}
                </span>
                <span className="text-xs tabular-nums opacity-75 shrink-0">{cat.topicCount}</span>
              </button>
            );
          })}
        </aside>

        <div ref={resultsRef} className="lg:col-span-8 space-y-5 scroll-target">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9CFC0] pb-3 text-xs text-[#5C625A]">
            <span className="tabular-nums">
              <strong className="text-[#34483D]">{filteredTopics.length}</strong> {t.universe.showingTopics}
              {activeCatObj && activeCatMeta
                ? ` · ${activeCatObj.number}. ${activeCatMeta.name}`
                : ''}{' '}
              ({filteredTopics.filter((item) => item.status === 'complete').length}{' '}
              {t.universe.completeOnly})
            </span>
            {(activeCategory !== 'all' || stageFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setStageFilter('all');
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="text-[#34483D] font-medium underline underline-offset-4 hover:text-[#B87961]"
              >
                {t.common.resetFilters}
              </button>
            )}
          </div>

          {filteredTopics.length === 0 ? (
            <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-8 sm:p-10 text-center space-y-5">
              <BookOpen className="w-7 h-7 text-[#8B9B83] mx-auto" />
              <div className="space-y-1.5">
                <p className="font-serif text-xl text-[#34483D]">{t.universe.noMatchTitle}</p>
                <p className="text-sm text-[#5C625A] max-w-md mx-auto leading-relaxed">
                  {eng.emptyEncouragement}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setStageFilter('all');
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 border border-[#34483D] text-[#34483D] text-xs font-medium hover:bg-[#E9E2D5] transition-colors"
                >
                  {t.universe.resetAllFilters}
                </button>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onAskKadamAi(searchQuery)}
                    className="px-5 py-2 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] transition-colors"
                  >
                    {t.universe.askAiAboutQuery}
                  </button>
                )}
              </div>
              <div className="pt-4 border-t border-[#E9E2D5] space-y-2">
                <p className="text-xs text-[#5C625A]">{eng.popularQuickTopics}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {COMPLETE_GUIDES.slice(0, 3).map((g) => {
                    const meta = getGuideListMeta(g.slug, g.title, g.summary);
                    return (
                      <button
                        key={g.slug}
                        type="button"
                        onClick={() => onSelectGuide(g.slug)}
                        className="text-xs text-[#34483D] border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-1.5 hover:border-[#34483D] transition-colors"
                      >
                        {meta.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#D9CFC0] border-b border-[#D9CFC0]">
              {filteredTopics.map((topic) => {
                const catObj = CATEGORY_MAP[topic.categoryId];
                const catMeta = catObj ? getCategoryMeta(catObj) : null;
                const topicMeta = getGuideListMeta(topic.slug, topic.title, topic.summary);
                const complete = topic.status === 'complete';
                const isRead = completedGuideSlugs.has(topic.slug);
                return (
                  <article
                    key={topic.slug}
                    className="group py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-[#FCFBF7] px-3 -mx-3 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <p className="text-xs text-[#5C625A] flex flex-wrap items-center gap-x-1.5">
                        <span>{catMeta?.shortName || catObj?.shortName}</span>
                        <span aria-hidden="true">·</span>
                        <span className={complete ? 'text-[#34483D] font-medium' : 'text-[#B87961]'}>
                          {complete
                            ? `${eng.complete16SectionLabel} · ${t.common.verified} ${topic.lastVerifiedDate}`
                            : `${t.common.scheduled} ${t.common.batch} ${topic.batchNumber} · ${eng.instantAiAvailable}`}
                        </span>
                        {isRead && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 text-[#34483D] font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {eng.readBadge}
                            </span>
                          </>
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => onSelectGuide(topic.slug)}
                        className="text-left font-serif text-xl text-[#34483D] hover:text-[#B87961] transition-colors"
                      >
                        {topicMeta.title}
                      </button>
                      <p className="text-sm text-[#5C625A] leading-relaxed">{topicMeta.summary}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectGuide(topic.slug)}
                      className={`px-4 py-2 text-xs font-medium whitespace-nowrap shrink-0 self-start transition-colors inline-flex items-center gap-1.5 ${
                        complete
                          ? 'bg-[#34483D] text-[#F7F4EC] hover:bg-[#26362D]'
                          : 'border border-[#D9CFC0] text-[#34483D] hover:bg-[#E9E2D5]'
                      }`}
                    >
                      <span>{complete ? eng.readGuideCta : eng.openTopicCta}</span>
                      <ArrowRight className="w-3.5 h-3.5 editorial-arrow" />
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
