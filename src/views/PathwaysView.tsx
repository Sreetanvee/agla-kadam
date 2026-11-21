import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUp,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  Compass,
  ExternalLink,
  GitBranch,
  Loader2,
  Scale,
  Users,
  X,
} from 'lucide-react';
import {
  COMPLETE_GUIDE_MAP,
  LEARNING_JOURNEYS,
  OPPORTUNITIES,
  POSSIBILITY_MAP_ROOTS,
} from '../data/catalog';
import { useFirebase } from '../contexts/FirebaseContext';
import {
  useI18n,
  useTranslatedJourney,
  useTranslatedOpportunities,
  useTranslatedPossibilityRoot,
} from '../hooks/useI18n';
import { ENGAGEMENT_STRINGS } from '../i18n/engagementStrings';
import { scrollIntoViewIfNeeded } from '../lib/smartScroll';
import type { AppRoute } from '../components/Navbar';
import type { PossibilityBranch, StudentStage } from '../types/domain';

interface PathwaysViewProps {
  initialRootId?: string;
  initialJourneyId?: string | null;
  onOpenGuide: (slug: string) => void;
  onExplainToParents: (pathwayTitle: string) => void;
  onNavigate?: (route: AppRoute) => void;
}

const CLASS_12_STREAM_IDS = ['class-12-science', 'class-12-commerce', 'class-12-humanities'] as const;

type TopQualificationGroup =
  | 'class-10'
  | 'class-12'
  | 'diploma'
  | 'undergraduate'
  | 'postgraduate-research'
  | 'alternative-vocational';

const TOP_QUALIFICATIONS: { id: TopQualificationGroup; defaultRootId: string; stages: StudentStage[] }[] = [
  { id: 'class-10', defaultRootId: 'class-10', stages: ['school', 'after-10'] },
  { id: 'class-12', defaultRootId: 'class-12-science', stages: ['class-11-12'] },
  { id: 'diploma', defaultRootId: 'diploma', stages: ['diploma'] },
  { id: 'undergraduate', defaultRootId: 'undergraduate', stages: ['undergraduate'] },
  { id: 'postgraduate-research', defaultRootId: 'postgraduate-research', stages: ['postgraduate', 'research'] },
  { id: 'alternative-vocational', defaultRootId: 'alternative-vocational', stages: ['entrepreneurship', 'early-career', 'diploma'] },
];

const CLASS_12_STREAMS: { rootId: string; fallbackLabel: string; fallbackHint: string }[] = [
  {
    rootId: 'class-12-science',
    fallbackLabel: 'Science (PCM / PCB / PCMB)',
    fallbackHint: 'Engineering, Pure Sciences, Medicine, Design, Tech & Law',
  },
  {
    rootId: 'class-12-commerce',
    fallbackLabel: 'Commerce & Economics',
    fallbackHint: 'CA/CS/CMA, Economics, Finance, Management & Law',
  },
  {
    rootId: 'class-12-humanities',
    fallbackLabel: 'Humanities & Social Sciences',
    fallbackHint: 'Law, Public Policy, Liberal Arts, Design, Journalism & UPSC',
  },
];

function getQualificationGroup(rootId: string): TopQualificationGroup {
  if (CLASS_12_STREAM_IDS.includes(rootId as (typeof CLASS_12_STREAM_IDS)[number])) {
    return 'class-12';
  }
  const match = TOP_QUALIFICATIONS.find((q) => q.id === rootId);
  return match ? match.id : 'class-10';
}

export function PathwaysView({
  initialRootId = 'class-10',
  initialJourneyId = null,
  onOpenGuide,
  onExplainToParents,
  onNavigate,
}: PathwaysViewProps) {
  const { user, learningProgress, updateLearningProgress, isBookmarked, toggleBookmark } = useFirebase();
  const {
    lang,
    t,
    getQualificationLabel,
    getStreamMeta,
    getTrackLabel,
    getJourneyListMeta,
    getGuideListMeta,
    getOppCategoryLabel,
  } = useI18n();
  const eng = ENGAGEMENT_STRINGS[lang].pathways;

  const [activeTab, setActiveTab] = useState<'map' | 'journeys'>(
    initialJourneyId ? 'journeys' : 'map'
  );
  const [selectedRootId, setSelectedRootId] = useState<string>(initialRootId);
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [activeJourneyId, setActiveJourneyId] = useState<string>(
    initialJourneyId || LEARNING_JOURNEYS[0].id
  );

  // Viewport anchor refs for calm, intelligent positioning
  const explorerRef = useRef<HTMLDivElement | null>(null);
  const streamStepRef = useRef<HTMLDivElement | null>(null);
  const dossierRef = useRef<HTMLDivElement | null>(null);
  const comparisonRef = useRef<HTMLElement | null>(null);
  const journeyDetailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialRootId) {
      setSelectedRootId(initialRootId);
      setTrackFilter('all');
    }
  }, [initialRootId]);

  useEffect(() => {
    if (initialJourneyId) {
      setActiveTab('journeys');
      setActiveJourneyId(initialJourneyId);
    }
  }, [initialJourneyId]);

  const activeGroup = getQualificationGroup(selectedRootId);

  const rawCurrentRoot =
    POSSIBILITY_MAP_ROOTS.find((r) => r.id === selectedRootId) || POSSIBILITY_MAP_ROOTS[0];
  const rawActiveJourney =
    LEARNING_JOURNEYS.find((j) => j.id === activeJourneyId) || LEARNING_JOURNEYS[0];

  // Unconditional top-level translation hooks
  const { root: currentRoot, translating: translatingRoot } = useTranslatedPossibilityRoot(
    rawCurrentRoot,
    lang
  );
  const { journey: activeJourney, translating: translatingJourney } = useTranslatedJourney(
    rawActiveJourney,
    lang
  );

  const stageMatchedOppsRaw = useMemo(() => {
    const groupMeta = TOP_QUALIFICATIONS.find((q) => q.id === activeGroup);
    const stages = new Set(groupMeta?.stages || []);
    return OPPORTUNITIES.filter((opp) => opp.stages.some((s) => stages.has(s)))
      .sort((a, b) => Number(Boolean(b.lesserKnown)) - Number(Boolean(a.lesserKnown)))
      .slice(0, 3);
  }, [activeGroup]);

  const { opportunities: stageMatchedOpps } = useTranslatedOpportunities(
    stageMatchedOppsRaw,
    lang
  );

  const availableTracks = useMemo(() => {
    return Array.from(new Set(currentRoot.branches.map((b) => b.trackType)));
  }, [currentRoot]);

  const visibleBranches = useMemo(() => {
    if (trackFilter === 'all') return currentRoot.branches;
    return currentRoot.branches.filter((b) => b.trackType === trackFilter);
  }, [currentRoot, trackFilter]);

  const selectedBranch: PossibilityBranch =
    visibleBranches.find((b) => b.id === selectedBranchId) ||
    visibleBranches[0] ||
    currentRoot.branches[0];

  // Prefer translated branch from currentRoot if available, otherwise fall back to catalog
  const allBranches = useMemo(() => {
    const currentById = new Map(currentRoot.branches.map((b) => [b.id, b]));
    return POSSIBILITY_MAP_ROOTS.flatMap((r) =>
      r.branches.map((b) => currentById.get(b.id) || b)
    );
  }, [currentRoot]);

  const comparedBranches = compareIds
    .map((id) => allBranches.find((b) => b.id === id))
    .filter((b): b is PossibilityBranch => Boolean(b));

  const handleSelectQualificationGroup = (group: (typeof TOP_QUALIFICATIONS)[number]) => {
    const nextRootId =
      group.id === 'class-12' && activeGroup === 'class-12'
        ? selectedRootId
        : group.defaultRootId;
    const targetRoot =
      POSSIBILITY_MAP_ROOTS.find((r) => r.id === nextRootId) || POSSIBILITY_MAP_ROOTS[0];
    setSelectedRootId(nextRootId);
    setTrackFilter('all');
    setSelectedBranchId(targetRoot.branches[0]?.id || '');
    if (group.id === 'class-12') {
      scrollIntoViewIfNeeded(streamStepRef.current || explorerRef.current);
    } else {
      scrollIntoViewIfNeeded(explorerRef.current);
    }
  };

  const handleSelectStream = (rootId: string) => {
    const targetRoot = POSSIBILITY_MAP_ROOTS.find((r) => r.id === rootId) || POSSIBILITY_MAP_ROOTS[0];
    setSelectedRootId(rootId);
    setTrackFilter('all');
    setSelectedBranchId(targetRoot.branches[0]?.id || '');
    scrollIntoViewIfNeeded(explorerRef.current);
  };

  const handleSelectTrack = (track: string) => {
    setTrackFilter(track);
    const nextList =
      track === 'all'
        ? currentRoot.branches
        : currentRoot.branches.filter((b) => b.trackType === track);
    if (nextList[0]) {
      setSelectedBranchId(nextList[0].id);
    }
    scrollIntoViewIfNeeded(explorerRef.current);
  };

  const handleSelectBranch = (branchId: string) => {
    setSelectedBranchId(branchId);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      scrollIntoViewIfNeeded(dossierRef.current, { forceAlign: true });
    } else {
      scrollIntoViewIfNeeded(dossierRef.current);
    }
  };

  const toggleCompare = (branchId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(branchId)) return prev.filter((id) => id !== branchId);
      if (prev.length >= 3) return [...prev.slice(1), branchId];
      return [...prev, branchId];
    });
  };

  const handleOpenComparison = () => {
    setShowComparison(true);
    scrollIntoViewIfNeeded(comparisonRef.current, { forceAlign: true });
  };

  const handleSelectJourney = (journeyId: string) => {
    setActiveJourneyId(journeyId);
    scrollIntoViewIfNeeded(journeyDetailRef.current, { forceAlign: window.innerWidth < 1024 });
  };

  const journeyProgress = learningProgress.find(
    (p) => p.itemType === 'journey' && p.itemId === activeJourney.id
  );
  const completedStages = journeyProgress?.completedSteps || [];
  const totalStages = activeJourney.stages.length;
  const completedStageCount = activeJourney.stages.filter((s) =>
    completedStages.includes(`stage_${s.stageNumber}`)
  ).length;
  const journeyPct = totalStages > 0 ? Math.round((completedStageCount / totalStages) * 100) : 0;
  const isJourneyComplete = totalStages > 0 && completedStageCount === totalStages;

  const firstLinkedGuideSlug = useMemo(() => {
    for (const s of activeJourney.stages) {
      const found = s.linkedGuideSlugs.find((slug) => Boolean(COMPLETE_GUIDE_MAP[slug]));
      if (found) return found;
    }
    return null;
  }, [activeJourney]);

  const handleToggleJourneyStage = async (stageNum: number) => {
    if (!user) return;
    const key = `stage_${stageNum}`;
    const next = completedStages.includes(key)
      ? completedStages.filter((k) => k !== key)
      : [...completedStages, key];
    const pct = Math.round((next.length / activeJourney.stages.length) * 100);
    await updateLearningProgress({
      itemType: 'journey',
      itemId: activeJourney.id,
      title: rawActiveJourney.title,
      completedSteps: next,
      percentComplete: pct,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-7">
      {/* Compact Editorial Header & Mode Switch */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-[#D9CFC0] pb-6">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs uppercase tracking-widest text-[#B87961]">{t.pathways.kicker}</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#34483D]">{t.pathways.title}</h1>
          <p className="text-sm sm:text-base text-[#5C625A] leading-relaxed">{t.pathways.subtitle}</p>
        </div>

        <div className="inline-flex border border-[#D9CFC0] bg-[#FCFBF7] p-1 shrink-0 self-start">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'map'
                ? 'bg-[#34483D] text-[#F7F4EC]'
                : 'text-[#5C625A] hover:text-[#34483D]'
            }`}
          >
            {t.pathways.tabMap}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('journeys')}
            className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'journeys'
                ? 'bg-[#34483D] text-[#F7F4EC]'
                : 'text-[#5C625A] hover:text-[#34483D]'
            }`}
          >
            {t.pathways.tabJourneys}
          </button>
        </div>
      </header>

      {activeTab === 'map' ? (
        <div className="space-y-6">
          {/* Step 1: Qualification Selector + Immediate Step 1B Stream Reveal for Class 12 */}
          <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-5 space-y-4">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-widest text-[#5C625A]">
                  {t.pathways.step1Label}
                </p>
                {translatingRoot && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#34483D]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t.common.translatingContent}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {TOP_QUALIFICATIONS.map((q) => {
                  const active = activeGroup === q.id;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleSelectQualificationGroup(q)}
                      className={`px-3.5 py-2 text-xs font-medium border transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                          : 'bg-[#F7F4EC] text-[#30342F] border-[#D9CFC0] hover:bg-[#E9E2D5]'
                      }`}
                    >
                      {getQualificationLabel(q.id)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progressive Step 1B: Stream / Subject Combination immediately visible for Class 11 & 12 */}
            {activeGroup === 'class-12' && (
              <div
                ref={streamStepRef}
                className="pt-4 border-t border-[#E9E2D5] space-y-2.5 scroll-target"
              >
                <p className="text-xs uppercase tracking-widest text-[#B87961]">
                  {t.pathways.step1BLabel}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CLASS_12_STREAMS.map((stream) => {
                    const active = selectedRootId === stream.rootId;
                    const tr = getStreamMeta(stream.rootId);
                    return (
                      <button
                        key={stream.rootId}
                        type="button"
                        onClick={() => handleSelectStream(stream.rootId)}
                        className={`text-left p-3.5 border transition-colors ${
                          active
                            ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                            : 'bg-[#F7F4EC] text-[#30342F] border-[#D9CFC0] hover:border-[#34483D]'
                        }`}
                      >
                        <p className="text-sm font-medium">{tr?.label || stream.fallbackLabel}</p>
                        <p
                          className={`text-xs mt-1 leading-snug ${
                            active ? 'text-[#E9E2D5]/85' : 'text-[#5C625A]'
                          }`}
                        >
                          {tr?.hint || stream.fallbackHint}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Track Filter Strip */}
            {availableTracks.length > 1 && (
              <div className="pt-3 border-t border-[#E9E2D5] flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#5C625A] mr-1">
                  {eng.filterPathwaysLabel}
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectTrack('all')}
                  className={`px-3 py-1 text-xs font-medium border transition-colors ${
                    trackFilter === 'all'
                      ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                      : 'bg-[#F7F4EC] text-[#5C625A] border-[#D9CFC0] hover:text-[#34483D]'
                  }`}
                >
                  {eng.allCountPrefix} ({currentRoot.branches.length})
                </button>
                {availableTracks.map((track) => {
                  const active = trackFilter === track;
                  return (
                    <button
                      key={track}
                      type="button"
                      onClick={() => handleSelectTrack(track)}
                      className={`px-3 py-1 text-xs font-medium border transition-colors ${
                        active
                          ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                          : 'bg-[#F7F4EC] text-[#5C625A] border-[#D9CFC0] hover:text-[#34483D]'
                      }`}
                    >
                      {getTrackLabel(track)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Side-by-Side Comparison Matrix — Positioned directly above explorer when opened */}
          {showComparison && comparedBranches.length > 0 && (
            <section
              ref={comparisonRef}
              className="border border-[#34483D] bg-[#FCFBF7] p-6 sm:p-8 space-y-6 scroll-target"
            >
              <div className="flex items-center justify-between gap-4 border-b border-[#D9CFC0] pb-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#B87961]">
                    {eng.pathwayComparisonKicker}
                  </p>
                  <h2 className="font-serif text-2xl text-[#34483D]">
                    {eng.sideBySideMatrixTitle} ({comparedBranches.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowComparison(false)}
                  className="p-2 text-[#5C625A] hover:text-[#34483D]"
                  aria-label={eng.closeComparison}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#D9CFC0]">
                      <th className="py-3 pr-4 text-xs uppercase tracking-wider text-[#5C625A] w-36">
                        {eng.dimensionLabel}
                      </th>
                      {comparedBranches.map((b) => (
                        <th key={b.id} className="py-3 px-4 font-serif text-lg text-[#34483D] min-w-[220px]">
                          {b.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E2D5]">
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[#5C625A]">{t.pathways.durationLabel}</td>
                      {comparedBranches.map((b) => (
                        <td key={b.id} className="py-3 px-4 tabular-nums">{b.duration}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[#5C625A]">{t.pathways.eligibilityLabel}</td>
                      {comparedBranches.map((b) => (
                        <td key={b.id} className="py-3 px-4">{b.eligibility}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[#5C625A]">{t.pathways.examsLabel}</td>
                      {comparedBranches.map((b) => (
                        <td key={b.id} className="py-3 px-4">{b.entranceExams.join(', ')}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[#5C625A]">{t.pathways.costLabel}</td>
                      {comparedBranches.map((b) => (
                        <td key={b.id} className="py-3 px-4">{b.approximateCostNote}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[#5C625A]">{t.pathways.outcomesLabel}</td>
                      {comparedBranches.map((b) => (
                        <td key={b.id} className="py-3 px-4">{b.careerOutcomes.join(' · ')}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[#5C625A]">{t.pathways.realityLabel}</td>
                      {comparedBranches.map((b) => (
                        <td key={b.id} className="py-3 px-4 text-[#5C625A]">{b.realityNote}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Two-Zone Adjacent Explorer (Left Pathways List + Right Sticky Instant Dossier) */}
          <div
            ref={explorerRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start scroll-target"
          >
            {/* Left Zone: Applicable Pathways */}
            <div className="lg:col-span-5 border border-[#D9CFC0] bg-[#FCFBF7] p-5 space-y-4">
              <div className="space-y-1 pb-3.5 border-b border-[#E9E2D5]">
                <p className="text-xs uppercase tracking-widest text-[#B87961] inline-flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" /> {eng.applicablePathwaysLabel} ({visibleBranches.length})
                </p>
                <h2 className="font-serif text-xl sm:text-2xl text-[#34483D]">{currentRoot.label}</h2>
                <p className="text-xs text-[#5C625A] leading-relaxed">{currentRoot.description}</p>
              </div>

              <div className="space-y-2.5">
                {visibleBranches.map((branch, idx) => {
                  const isSelected = selectedBranch.id === branch.id;
                  const isCompared = compareIds.includes(branch.id);
                  return (
                    <div
                      key={branch.id}
                      className={`border editorial-card ${
                        isSelected
                          ? 'border-[#34483D] bg-[#F7F4EC]'
                          : 'border-[#E9E2D5] bg-[#FCFBF7]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectBranch(branch.id)}
                        className="w-full text-left p-3.5 space-y-1"
                      >
                        <p className="text-xs text-[#5C625A]">
                          <span className="tabular-nums text-[#8B9B83]">0{idx + 1}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{getTrackLabel(branch.trackType)}</span>
                          <span aria-hidden="true"> · </span>
                          <span className="tabular-nums">{branch.duration}</span>
                        </p>
                        <p className="font-serif text-base sm:text-lg text-[#34483D] leading-snug">
                          {branch.title}
                        </p>
                      </button>
                      <div className="px-3.5 pb-2.5 flex items-center justify-between text-xs border-t border-[#E9E2D5]/70 pt-2">
                        <span className="text-[#5C625A] truncate max-w-[190px]">
                          {branch.entranceExams[0]}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCompare(branch.id)}
                          className={`font-medium transition-colors whitespace-nowrap ${
                            isCompared
                              ? 'text-[#B87961]'
                              : 'text-[#34483D] hover:text-[#B87961]'
                          }`}
                        >
                          {isCompared ? eng.comparingLabel : eng.addCompareShort}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {compareIds.length > 0 && (
                <div className="pt-3 border-t border-[#D9CFC0] flex items-center justify-between gap-3">
                  <span className="text-xs text-[#5C625A] tabular-nums">
                    {compareIds.length}/3 {t.pathways.selectedCount}
                  </span>
                  <button
                    type="button"
                    onClick={handleOpenComparison}
                    className="px-4 py-2 bg-[#B87961] text-[#FCFBF7] text-xs font-medium hover:bg-[#9B5F49] transition-colors inline-flex items-center gap-1.5"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    {eng.compareSideBySide}
                  </button>
                </div>
              )}
            </div>

            {/* Right Zone: Sticky Instant Pathway Dossier */}
            <div
              ref={dossierRef}
              className="lg:col-span-7 lg:sticky lg:top-20 border border-[#D9CFC0] bg-[#FCFBF7] p-6 sm:p-7 space-y-5 scroll-target"
            >
              <div className="space-y-2 border-b border-[#E9E2D5] pb-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-[#5C625A]">
                    <span className="uppercase tracking-widest text-[#B87961] font-medium">
                      {getTrackLabel(selectedBranch.trackType)} · {eng.pathwaySuffix}
                    </span>
                    <span aria-hidden="true"> · </span>
                    <span className="tabular-nums">
                      {eng.durationPrefix}: {selectedBranch.duration}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollIntoViewIfNeeded(explorerRef.current, { forceAlign: true })}
                    className="lg:hidden inline-flex items-center gap-1 text-xs font-medium text-[#34483D] hover:underline shrink-0"
                  >
                    <ArrowUp className="w-3.5 h-3.5" /> {t.pathways.allPathwaysMobile}
                  </button>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#34483D]">
                  {selectedBranch.title}
                </h2>
                <p className="text-sm text-[#30342F] leading-relaxed">
                  <strong className="font-medium text-[#34483D]">{t.pathways.eligibilityLabel}: </strong>
                  {selectedBranch.eligibility}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div className="space-y-1.5">
                  <h3 className="text-xs uppercase tracking-widest text-[#5C625A]">
                    {t.pathways.examsLabel}
                  </h3>
                  <ul className="space-y-1 text-[#30342F]">
                    {selectedBranch.entranceExams.map((ex) => (
                      <li key={ex}>• {ex}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs uppercase tracking-widest text-[#5C625A]">
                    {t.pathways.costLabel}
                  </h3>
                  <p className="text-[#30342F] leading-relaxed">
                    <span className="font-medium tabular-nums">{selectedBranch.duration}.</span>{' '}
                    {selectedBranch.approximateCostNote}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs uppercase tracking-widest text-[#5C625A]">
                    {t.pathways.scholarshipsLabel}
                  </h3>
                  <ul className="space-y-1 text-[#30342F]">
                    {selectedBranch.scholarships.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs uppercase tracking-widest text-[#5C625A]">
                    {t.pathways.institutionsLabel}
                  </h3>
                  <ul className="space-y-1 text-[#30342F]">
                    {selectedBranch.institutions.map((inst) => (
                      <li key={inst}>• {inst}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs uppercase tracking-widest text-[#5C625A]">
                    {t.pathways.outcomesLabel}
                  </h3>
                  <ul className="space-y-1 text-[#30342F]">
                    {selectedBranch.careerOutcomes.map((c) => (
                      <li key={c}>• {c}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs uppercase tracking-widest text-[#5C625A]">
                    {t.pathways.alternativesLabel}
                  </h3>
                  <ul className="space-y-1 text-[#30342F]">
                    {selectedBranch.alternatives.map((a) => (
                      <li key={a}>• {a}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-[#E9E2D5]/60 p-4 space-y-1">
                <p className="text-xs uppercase tracking-widest text-[#34483D] font-semibold">
                  {t.pathways.realityLabel}
                </p>
                <p className="text-sm text-[#30342F] leading-relaxed">{selectedBranch.realityNote}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {selectedBranch.relatedGuideSlug && COMPLETE_GUIDE_MAP[selectedBranch.relatedGuideSlug] && (
                  <button
                    type="button"
                    onClick={() => onOpenGuide(selectedBranch.relatedGuideSlug!)}
                    className="group px-5 py-2.5 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] transition-colors inline-flex items-center gap-2"
                  >
                    <span>{t.pathways.readFullGuide}</span>
                    <ArrowRight className="w-3.5 h-3.5 editorial-arrow" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onExplainToParents(selectedBranch.title)}
                  className="px-5 py-2.5 border border-[#34483D] text-[#34483D] text-xs font-medium hover:bg-[#E9E2D5] transition-colors inline-flex items-center gap-2"
                >
                  <Users className="w-3.5 h-3.5" />
                  {t.common.explainToParents}
                </button>
                <button
                  type="button"
                  onClick={() => toggleCompare(selectedBranch.id)}
                  className="px-4 py-2.5 border border-[#D9CFC0] text-xs font-medium text-[#30342F] hover:bg-[#E9E2D5] transition-colors"
                >
                  {compareIds.includes(selectedBranch.id) ? eng.removeCompareLong : eng.addCompareLong}
                </button>
              </div>

              {/* Contextual Stage-Matched Verified Opportunities */}
              {stageMatchedOpps.length > 0 && (
                <div className="pt-4 border-t border-[#E9E2D5] space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-widest text-[#5C625A]">
                      {eng.matchingOppsHeading}
                    </p>
                    {onNavigate && (
                      <button
                        type="button"
                        onClick={() => onNavigate('discover')}
                        className="text-xs font-medium text-[#34483D] hover:text-[#B87961] transition-colors"
                      >
                        {eng.viewAllDiscover} →
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {stageMatchedOpps.map((opp) => (
                      <a
                        key={opp.id}
                        href={opp.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="editorial-card border border-[#E9E2D5] bg-[#F7F4EC] p-3 flex flex-col justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <p className="text-[11px] text-[#B87961]">
                            {getOppCategoryLabel(opp.category)}
                          </p>
                          <p className="text-xs font-medium text-[#34483D] leading-snug line-clamp-2">
                            {opp.title}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#5C625A]">
                          {t.common.officialSite} <ExternalLink className="w-3 h-3" />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 11 Connected Step-by-Step Learning Journeys */
        <div className="space-y-5">
          {/* Mobile Compact Journey Selector — Result appears IMMEDIATELY below */}
          <div className="lg:hidden border border-[#D9CFC0] bg-[#FCFBF7] p-4 space-y-2">
            <label
              htmlFor="mobile-journey-select"
              className="block text-xs uppercase tracking-widest text-[#5C625A]"
            >
              {eng.chooseBlueprintMobile}
            </label>
            <select
              id="mobile-journey-select"
              value={activeJourney.id}
              onChange={(e) => handleSelectJourney(e.target.value)}
              className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2.5 text-sm text-[#30342F]"
            >
              {LEARNING_JOURNEYS.map((j, idx) => {
                const jMeta = getJourneyListMeta(j.id, j.title, j.subtitle);
                return (
                  <option key={j.id} value={j.id}>
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}. {jMeta.title}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Desktop Sticky Journey Sidebar */}
            <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto space-y-1 pr-1">
              <p className="text-xs uppercase tracking-widest text-[#5C625A] mb-3">
                {eng.blueprintsHeading}
              </p>
              {LEARNING_JOURNEYS.map((j, idx) => {
                const active = j.id === activeJourney.id;
                const jMeta = getJourneyListMeta(j.id, j.title, j.subtitle);
                const jp = learningProgress.find(
                  (p) => p.itemType === 'journey' && p.itemId === j.id
                );
                const pct = jp?.percentComplete || 0;
                return (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => handleSelectJourney(j.id)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-start justify-between gap-2.5 ${
                      active
                        ? 'bg-[#34483D] text-[#F7F4EC] font-medium'
                        : 'text-[#30342F] hover:bg-[#E9E2D5]'
                    }`}
                  >
                    <span className="flex items-start gap-2.5">
                      <span className="tabular-nums opacity-70 shrink-0">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <span>{jMeta.title}</span>
                    </span>
                    {pct > 0 && (
                      <span
                        className={`text-[11px] tabular-nums shrink-0 ${
                          active ? 'text-[#E9E2D5]' : 'text-[#34483D] font-medium'
                        }`}
                      >
                        {pct >= 100 ? '✓' : `${Math.round(pct)}%`}
                      </span>
                    )}
                  </button>
                );
              })}
            </aside>

            <div
              ref={journeyDetailRef}
              className="lg:col-span-8 border border-[#D9CFC0] bg-[#FCFBF7] p-6 sm:p-8 space-y-8 scroll-target"
            >
              <div className="space-y-4 border-b border-[#D9CFC0] pb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-[#5C625A]">
                    <span className="text-[#B87961] uppercase tracking-widest font-medium">
                      {eng.learningJourneyKicker}
                    </span>
                    <span aria-hidden="true"> · </span>
                    <span>{activeJourney.estimatedHorizon}</span>
                    <span aria-hidden="true"> · </span>
                    <span className="tabular-nums">
                      {t.common.verified} {activeJourney.lastVerifiedDate}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      toggleBookmark({
                        itemType: 'journey',
                        itemId: activeJourney.id,
                        title: activeJourney.title,
                        category: eng.learningJourneyKicker,
                      })
                    }
                    className="text-xs font-medium text-[#34483D] inline-flex items-center gap-1.5 hover:text-[#B87961] transition-colors"
                  >
                    {isBookmarked('journey', activeJourney.id) ? (
                      <>
                        <BookmarkCheck className="w-4 h-4" /> {t.pathways.journeySaved}
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" /> {t.pathways.saveJourney}
                      </>
                    )}
                  </button>
                </div>

                {translatingJourney && (
                  <p className="inline-flex items-center gap-1.5 text-xs text-[#34483D]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t.common.translatingContent}
                  </p>
                )}

                <h2 className="font-serif text-3xl text-[#34483D]">{activeJourney.title}</h2>
                <p className="text-sm text-[#30342F] leading-relaxed">{activeJourney.overview}</p>
                <p className="text-xs text-[#5C625A]">
                  <strong className="text-[#34483D]">{eng.whoThisIsFor}:</strong>{' '}
                  {activeJourney.targetAudience}
                </p>

                {/* Rewarding Journey Progress Strip */}
                {user && (
                  <div className="bg-[#F7F4EC] border border-[#E9E2D5] p-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-medium text-[#34483D] inline-flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-[#B87961]" />
                        {eng.journeyProgressTitle}
                      </span>
                      <span className="text-[#5C625A] tabular-nums">
                        <strong className="text-[#34483D]">
                          {completedStageCount}/{totalStages}
                        </strong>{' '}
                        {eng.stagesDoneOf} · {journeyPct}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#E9E2D5] w-full overflow-hidden">
                      <div
                        className="h-full bg-[#34483D] progress-fill"
                        style={{ width: `${journeyPct}%` }}
                      />
                    </div>
                    {completedStageCount === 0 && (
                      <p className="text-[11px] text-[#5C625A]">{eng.signInToTrackHint}</p>
                    )}
                  </div>
                )}

                {/* Calm Completion Milestone State when 100% Done */}
                {isJourneyComplete && (
                  <div className="border border-[#8B9B83] bg-[#34483D]/[0.05] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#34483D] shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-[#34483D]">{eng.journeyCompleteTitle}</p>
                        <p className="text-xs text-[#5C625A] leading-relaxed">
                          {eng.journeyCompleteDesc}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      {firstLinkedGuideSlug && (
                        <button
                          type="button"
                          onClick={() => onOpenGuide(firstLinkedGuideSlug)}
                          className="px-3.5 py-2 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] transition-colors"
                        >
                          {eng.journeyCompleteNextGuide}
                        </button>
                      )}
                      {onNavigate && (
                        <button
                          type="button"
                          onClick={() => onNavigate('discover')}
                          className="px-3.5 py-2 border border-[#34483D] text-[#34483D] text-xs font-medium hover:bg-[#E9E2D5] transition-colors"
                        >
                          {eng.journeyCompleteDiscover}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Connected Stages */}
              <div className="space-y-5">
                {activeJourney.stages.map((stage) => {
                  const done = completedStages.includes(`stage_${stage.stageNumber}`);
                  return (
                    <div
                      key={stage.stageNumber}
                      className={`border p-5 sm:p-6 space-y-4 transition-colors ${
                        done
                          ? 'border-[#8B9B83] bg-[#34483D]/[0.04]'
                          : 'border-[#E9E2D5] bg-[#F7F4EC]/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-[#B87961] font-medium uppercase tracking-wider tabular-nums">
                            {eng.stageWord} 0{stage.stageNumber} · {stage.timeframe}
                          </p>
                          <h3 className="font-serif text-xl text-[#34483D] mt-1">{stage.title}</h3>
                        </div>
                        {user && (
                          <button
                            type="button"
                            onClick={() => handleToggleJourneyStage(stage.stageNumber)}
                            className={`text-xs font-medium inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 border transition-colors ${
                              done
                                ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                                : 'border-[#D9CFC0] bg-[#FCFBF7] text-[#34483D] hover:border-[#34483D]'
                            }`}
                          >
                            {done ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> {eng.completedStage}
                              </>
                            ) : (
                              <>
                                <Circle className="w-3.5 h-3.5 text-[#8B9B83]" /> {eng.markDone}
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-wider text-[#5C625A]">
                            {t.pathways.stagePrerequisites}
                          </p>
                          <ul className="space-y-1 text-[#30342F]">
                            {stage.prerequisites.map((p) => (
                              <li key={p}>• {p}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-wider text-[#5C625A]">
                            {t.pathways.stageDecisions}
                          </p>
                          <ul className="space-y-1 text-[#30342F]">
                            {stage.keyDecisions.map((d) => (
                              <li key={d}>• {d}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-wider text-[#5C625A]">
                            {t.pathways.stageDocuments}
                          </p>
                          <ul className="space-y-1 text-[#30342F]">
                            {stage.documents.map((doc) => (
                              <li key={doc}>• {doc}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-wider text-[#5C625A]">
                            {t.pathways.stageNextActions}
                          </p>
                          <ul className="space-y-1 text-[#30342F]">
                            {stage.nextActions.map((a) => (
                              <li key={a}>→ {a}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {stage.linkedGuideSlugs.length > 0 && (
                        <div className="pt-3 border-t border-[#D9CFC0] flex flex-wrap gap-3">
                          {stage.linkedGuideSlugs.map((slug) => {
                            const g = COMPLETE_GUIDE_MAP[slug];
                            if (!g) return null;
                            const gMeta = getGuideListMeta(g.slug, g.title, g.summary);
                            return (
                              <button
                                key={slug}
                                type="button"
                                onClick={() => onOpenGuide(slug)}
                                className="text-xs font-medium text-[#34483D] underline underline-offset-4 hover:text-[#B87961] transition-colors"
                              >
                                {eng.readGuidePrefix}: {gMeta.title}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Official Journey Links */}
              <div className="pt-4 border-t border-[#D9CFC0] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-5 text-xs">
                  {activeJourney.officialReferences.map((ref) => (
                    <a
                      key={ref.url}
                      href={ref.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-[#34483D] hover:text-[#B87961] transition-colors"
                    >
                      {ref.label} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onExplainToParents(activeJourney.title)}
                  className="px-4 py-2 border border-[#34483D] text-xs font-medium text-[#34483D] hover:bg-[#E9E2D5] transition-colors"
                >
                  {eng.explainJourneyParents}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
