import { useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Calendar,
  CalendarPlus,
  Check,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MessageSquare,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { COMPLETE_GUIDES, OPPORTUNITIES, UNIVERSITIES } from '../data/catalog';
import { useFirebase } from '../contexts/FirebaseContext';
import { scrollIntoViewIfNeeded } from '../lib/smartScroll';
import {
  useI18n,
  useTranslatedOpportunities,
  useTranslatedUniversities,
} from '../hooks/useI18n';
import { ENGAGEMENT_STRINGS } from '../i18n/engagementStrings';
import type { InstitutionType, Opportunity, OpportunityCategory, StudentStage } from '../types/domain';

interface DiscoverViewProps {
  onOpenGuide?: (slug: string) => void;
  onAskKadamAi?: (question: string) => void;
}

const OPP_CATEGORIES: { value: OpportunityCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'scholarship', label: 'Scholarships' },
  { value: 'internship', label: 'Internships' },
  { value: 'research', label: 'Research Positions' },
  { value: 'fellowship', label: 'Fellowships' },
  { value: 'hackathon', label: 'Hackathons' },
  { value: 'competition', label: 'Competitions' },
  { value: 'conference', label: 'Conferences' },
  { value: 'workshop', label: 'Workshops' },
  { value: 'exchange', label: 'Exchanges' },
  { value: 'entrance-exam', label: 'Entrance Exams' },
  { value: 'government-recruitment', label: 'Govt Recruitment' },
  { value: 'startup-programme', label: 'Startup Programmes' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'international', label: 'International' },
];

const STAGE_FILTER_OPTIONS: { value: StudentStage | 'all'; fallback: string }[] = [
  { value: 'all', fallback: 'All Student Stages' },
  { value: 'school', fallback: 'School / Class 8–10' },
  { value: 'class-11-12', fallback: 'Class 11 & 12' },
  { value: 'diploma', fallback: 'Diploma' },
  { value: 'undergraduate', fallback: 'Undergraduate' },
  { value: 'postgraduate', fallback: 'Postgraduate' },
  { value: 'research', fallback: 'Research' },
  { value: 'entrepreneurship', fallback: 'Entrepreneurship' },
  { value: 'international', fallback: 'International' },
];

const UNI_TYPES: (InstitutionType | 'all')[] = [
  'all',
  'IIT',
  'NIT',
  'IISER',
  'Central University',
  'State University',
  'Deemed University',
  'Private University',
  'NLU',
  'NID',
  'NIFT',
  'International',
];

function findRelatedGuideForOpportunity(opp: Opportunity) {
  if (opp.category === 'scholarship') {
    return COMPLETE_GUIDES.find((g) => g.slug === 'scholarships-financial-assistance-india');
  }
  if (opp.category === 'research' || opp.category === 'conference') {
    return COMPLETE_GUIDES.find((g) => g.slug === 'undergraduate-research-and-publications');
  }
  if (opp.category === 'international' || opp.category === 'exchange') {
    return COMPLETE_GUIDES.find((g) => g.slug === 'study-abroad-india-complete-guide');
  }
  if (opp.category === 'government-recruitment') {
    return COMPLETE_GUIDES.find((g) => g.slug === 'upsc-state-psc-government-exams');
  }
  if (opp.category === 'startup-programme') {
    return COMPLETE_GUIDES.find((g) => g.slug === 'student-startups-and-incubation');
  }
  const stageSet = new Set(opp.stages);
  return COMPLETE_GUIDES.find((g) => g.stages.some((s) => stageSet.has(s)));
}

export function DiscoverView({ onOpenGuide, onAskKadamAi }: DiscoverViewProps) {
  const { isBookmarked, toggleBookmark, addDeadline } = useFirebase();
  const { lang, t, getOppCategoryLabel, getStageLabel, getGuideListMeta } = useI18n();
  const eng = ENGAGEMENT_STRINGS[lang].discover;

  const [tab, setTab] = useState<'opportunities' | 'universities'>('opportunities');
  const [oppQuery, setOppQuery] = useState('');
  const [oppCat, setOppCat] = useState<OpportunityCategory | 'all'>('all');
  const [oppStage, setOppStage] = useState<StudentStage | 'all'>('all');
  const [lesserKnownOnly, setLesserKnownOnly] = useState(false);

  const [uniQuery, setUniQuery] = useState('');
  const [uniType, setUniType] = useState<InstitutionType | 'all'>('all');

  const [sharedId, setSharedId] = useState<string | null>(null);
  const [trackedId, setTrackedId] = useState<string | null>(null);

  const oppResultsRef = useRef<HTMLDivElement | null>(null);
  const uniResultsRef = useRef<HTMLDivElement | null>(null);

  const filteredOpps = useMemo(() => {
    const q = oppQuery.trim().toLowerCase();
    return OPPORTUNITIES.filter((o) => {
      if (oppCat !== 'all' && o.category !== oppCat) return false;
      if (oppStage !== 'all' && !o.stages.includes(oppStage)) return false;
      if (lesserKnownOnly && !o.lesserKnown) return false;
      if (q) {
        const hay = `${o.title} ${o.organization} ${o.eligibilitySummary} ${o.benefitSummary} ${o.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [oppQuery, oppCat, oppStage, lesserKnownOnly]);

  const filteredUnis = useMemo(() => {
    const q = uniQuery.trim().toLowerCase();
    return UNIVERSITIES.filter((u) => {
      if (uniType !== 'all' && u.type !== uniType) return false;
      if (q) {
        const hay = `${u.name} ${u.shortName} ${u.location} ${u.type} ${u.notableCourses.join(' ')} ${u.entranceExams.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [uniQuery, uniType]);

  const { opportunities: displayedOpps, translating: translatingOpps } =
    useTranslatedOpportunities(tab === 'opportunities' ? filteredOpps : [], lang);

  const { universities: displayedUnis, translating: translatingUnis } =
    useTranslatedUniversities(tab === 'universities' ? filteredUnis : [], lang);

  const handleShareOpportunity = async (opp: Opportunity) => {
    const text = `${opp.title} — ${opp.organization}\n${t.discover.eligibility}: ${opp.eligibilitySummary}\n${t.common.officialPortal}: ${opp.officialUrl}\n(AGLA KADAM)`;
    try {
      if (navigator.share) {
        await navigator.share({ title: opp.title, text, url: opp.officialUrl });
      } else {
        await navigator.clipboard.writeText(text);
      }
      setSharedId(opp.id);
      setTimeout(() => setSharedId(null), 2400);
    } catch {
      // User cancelled native share
    }
  };

  const handleTrackDeadline = async (opp: Opportunity) => {
    await addDeadline({
      title: opp.title,
      category: opp.category,
      dueDate: opp.sampleDeadlineDate,
      officialUrl: opp.officialUrl,
      notes:
        opp.dataOrigin === 'demonstration'
          ? `${t.discover.demoEntry} (${opp.cycleWindow}). ${opp.officialUrl}`
          : `${t.discover.cycleWindow}: ${opp.cycleWindow}.`,
    });
    setTrackedId(opp.id);
    setTimeout(() => setTrackedId(null), 2400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#D9CFC0] pb-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-widest text-[#B87961]">
            {t.discover.kicker}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#34483D]">
            {t.discover.title}
          </h1>
          <p className="text-base text-[#5C625A] leading-relaxed">
            {t.discover.subtitle}
          </p>
        </div>

        <div className="inline-flex border border-[#D9CFC0] bg-[#FCFBF7] p-1 shrink-0 self-start">
          <button
            type="button"
            onClick={() => setTab('opportunities')}
            className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              tab === 'opportunities'
                ? 'bg-[#34483D] text-[#F7F4EC]'
                : 'text-[#5C625A] hover:text-[#34483D]'
            }`}
          >
            {t.discover.tabOpportunities} ({OPPORTUNITIES.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('universities')}
            className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              tab === 'universities'
                ? 'bg-[#34483D] text-[#F7F4EC]'
                : 'text-[#5C625A] hover:text-[#34483D]'
            }`}
          >
            {t.discover.tabUniversities} ({UNIVERSITIES.length})
          </button>
        </div>
      </header>

      {tab === 'opportunities' ? (
        <div className="space-y-8">
          {/* Transparent Data Integrity Notice */}
          <div className="border border-[#D9CFC0] bg-[#E9E2D5]/50 px-5 py-3.5 text-xs text-[#30342F] leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#34483D] shrink-0 mt-0.5" />
            <p>
              <strong>{t.discover.verificationStandardLabel}:</strong> {t.discover.verificationStandardBody}
            </p>
          </div>

          {/* Search & Filters */}
          <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            <div className="md:col-span-4 flex items-center gap-2.5 border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2.5 focus-within:border-[#34483D] transition-colors">
              <Search className="w-4 h-4 text-[#5C625A] shrink-0" />
              <input
                type="text"
                value={oppQuery}
                onChange={(e) => setOppQuery(e.target.value)}
                placeholder={t.discover.oppSearchPlaceholder}
                className="w-full bg-transparent text-sm focus:outline-none"
              />
              {oppQuery && (
                <button
                  type="button"
                  aria-label={t.common.clear}
                  onClick={() => setOppQuery('')}
                  className="text-[#5C625A] hover:text-[#34483D]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="md:col-span-3">
              <select
                aria-label={t.common.allCategories}
                value={oppCat}
                onChange={(e) => {
                  setOppCat(e.target.value as OpportunityCategory | 'all');
                  scrollIntoViewIfNeeded(oppResultsRef.current);
                }}
                className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2.5 text-sm"
              >
                {OPP_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {getOppCategoryLabel(c.value, c.label)}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                aria-label={t.common.allStages}
                value={oppStage}
                onChange={(e) => {
                  setOppStage(e.target.value as StudentStage | 'all');
                  scrollIntoViewIfNeeded(oppResultsRef.current);
                }}
                className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2.5 text-sm"
              >
                {STAGE_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {getStageLabel(opt.value, opt.fallback)}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex items-center">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#34483D] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={lesserKnownOnly}
                  onChange={(e) => {
                    setLesserKnownOnly(e.target.checked);
                    scrollIntoViewIfNeeded(oppResultsRef.current);
                  }}
                  className="accent-[#34483D] w-4 h-4"
                />
                {t.discover.lesserKnownToggle}
              </label>
            </div>
          </div>

          {/* Live Results Summary */}
          <div
            ref={oppResultsRef}
            className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C625A] scroll-target"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="tabular-nums">
                <strong className="text-[#34483D]">{filteredOpps.length}</strong> {t.discover.showingOpportunities}
              </span>
              {translatingOpps && (
                <span className="inline-flex items-center gap-1.5 text-[#34483D]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {t.common.translatingContent}
                </span>
              )}
            </div>
            {(oppQuery || oppCat !== 'all' || oppStage !== 'all' || lesserKnownOnly) && (
              <button
                type="button"
                onClick={() => {
                  setOppQuery('');
                  setOppCat('all');
                  setOppStage('all');
                  setLesserKnownOnly(false);
                }}
                className="text-[#34483D] font-medium underline underline-offset-4 hover:text-[#B87961]"
              >
                {t.common.resetFilters}
              </button>
            )}
          </div>

          {/* Opportunity Feed */}
          {displayedOpps.length === 0 ? (
            <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-8 sm:p-10 text-center space-y-4">
              <p className="font-serif text-xl text-[#34483D]">{t.discover.noOppsTitle}</p>
              <p className="text-sm text-[#5C625A] max-w-md mx-auto leading-relaxed">
                {t.discover.noOppsDesc}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOppQuery('');
                    setOppCat('all');
                    setOppStage('all');
                    setLesserKnownOnly(false);
                  }}
                  className="px-4 py-2 border border-[#34483D] text-[#34483D] text-xs font-medium hover:bg-[#E9E2D5] transition-colors"
                >
                  {t.common.resetFilters}
                </button>
                {oppQuery.trim() && onAskKadamAi && (
                  <button
                    type="button"
                    onClick={() => onAskKadamAi(`${eng.askAiForQueryPrefix} "${oppQuery.trim()}".`)}
                    className="px-4 py-2 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] transition-colors inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {eng.emptyHintCta} &ldquo;{oppQuery.trim().slice(0, 24)}&rdquo;
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {displayedOpps.map((opp) => {
                const saved = isBookmarked('opportunity', opp.id);
                const relatedGuide = findRelatedGuideForOpportunity(opp);
                const relatedGuideMeta = relatedGuide
                  ? getGuideListMeta(relatedGuide.slug, relatedGuide.title, relatedGuide.summary)
                  : null;

                return (
                  <article
                    key={opp.id}
                    className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 sm:p-7 space-y-5 editorial-card"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-[#E9E2D5] pb-4">
                      <div className="space-y-1.5 flex-1">
                        <p className="text-xs text-[#5C625A]">
                          <span className="uppercase tracking-wider text-[#B87961] font-medium">
                            {getOppCategoryLabel(opp.category, opp.category.replace('-', ' '))}
                          </span>
                          <span aria-hidden="true"> · </span>
                          <span>{opp.organization}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{opp.location}</span>
                        </p>
                        <h2 className="font-serif text-2xl text-[#34483D] leading-snug">{opp.title}</h2>
                      </div>

                      <div className="text-xs text-[#5C625A] lg:text-right shrink-0 space-y-1 tabular-nums">
                        <p className="font-medium text-[#34483D] inline-flex lg:justify-end items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#34483D]" />
                          {opp.dataOrigin === 'demonstration'
                            ? t.discover.demoEntry
                            : t.discover.verifiedPortal}
                        </p>
                        <p>
                          {opp.sourceName} · {t.common.verified} {opp.lastVerifiedDate}
                        </p>
                      </div>
                    </div>

                    {/* Structured 3-Column Scannable Metadata Strip */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-[#F7F4EC] border border-[#E9E2D5] p-3.5 space-y-1">
                        <p className="text-[11px] uppercase tracking-wider text-[#5C625A] inline-flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#34483D]" />
                          {eng.eligibilityHeading}
                        </p>
                        <p className="text-xs sm:text-sm text-[#30342F] leading-relaxed">
                          {opp.eligibilitySummary}
                        </p>
                      </div>

                      <div className="bg-[#F7F4EC] border border-[#E9E2D5] p-3.5 space-y-1">
                        <p className="text-[11px] uppercase tracking-wider text-[#5C625A] inline-flex items-center gap-1.5 font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-[#B87961]" />
                          {eng.benefitsHeading}
                        </p>
                        <p className="text-xs sm:text-sm text-[#30342F] leading-relaxed">
                          {opp.benefitSummary}
                        </p>
                      </div>

                      <div className="bg-[#F7F4EC] border border-[#E9E2D5] p-3.5 space-y-1">
                        <p className="text-[11px] uppercase tracking-wider text-[#5C625A] inline-flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#34483D]" />
                          {eng.cycleAndSourceHeading}
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-[#34483D] tabular-nums">
                          {opp.cycleWindow}
                        </p>
                        <p className="text-xs text-[#5C625A]">{opp.sourceName}</p>
                      </div>
                    </div>

                    {opp.whatNobodyTellsYou && (
                      <p className="text-xs text-[#34483D] bg-[#E9E2D5]/55 px-4 py-3 leading-relaxed">
                        <strong>{t.discover.whatNobodyTellsYou}:</strong> {opp.whatNobodyTellsYou}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <a
                          href={opp.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] transition-colors inline-flex items-center gap-1.5"
                        >
                          {t.common.officialPortal} <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            toggleBookmark({
                              itemType: 'opportunity',
                              itemId: opp.id,
                              title: opp.title,
                              category: opp.category,
                            })
                          }
                          className="px-3.5 py-2 border border-[#D9CFC0] bg-[#F7F4EC] text-xs font-medium text-[#34483D] hover:bg-[#E9E2D5] transition-colors inline-flex items-center gap-1.5"
                        >
                          {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                          {saved ? t.common.saved : t.common.save}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTrackDeadline(opp)}
                          className="px-3.5 py-2 border border-[#D9CFC0] bg-[#F7F4EC] text-xs font-medium text-[#34483D] hover:bg-[#E9E2D5] transition-colors inline-flex items-center gap-1.5"
                        >
                          {trackedId === opp.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#34483D]" /> {t.discover.addedToCalendar}
                            </>
                          ) : (
                            <>
                              <CalendarPlus className="w-3.5 h-3.5" /> {t.discover.addToCalendar}
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleShareOpportunity(opp)}
                          className="px-3 py-2 text-xs font-medium text-[#5C625A] hover:text-[#34483D] transition-colors inline-flex items-center gap-1.5"
                        >
                          {sharedId === opp.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#34483D]" /> {t.discover.shared}
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5" /> {t.discover.share}
                            </>
                          )}
                        </button>
                      </div>

                      {/* Contextual Links: Related Verified Guide & Kadam AI */}
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        {relatedGuide && relatedGuideMeta && onOpenGuide && (
                          <button
                            type="button"
                            onClick={() => onOpenGuide(relatedGuide.slug)}
                            className="inline-flex items-center gap-1.5 font-medium text-[#34483D] underline underline-offset-4 hover:text-[#B87961] transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>
                              {eng.relatedGuideLabel}: {relatedGuideMeta.title}
                            </span>
                          </button>
                        )}
                        {onAskKadamAi && (
                          <button
                            type="button"
                            onClick={() =>
                              onAskKadamAi(
                                `Explain eligibility, documents, and how to prepare for "${opp.title}" (${opp.organization}).`
                              )
                            }
                            className="inline-flex items-center gap-1 text-[#B87961] font-medium hover:text-[#34483D] transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {eng.askAiAboutOpp}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* University & Course Discovery */
        <div className="space-y-6">
          <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3.5">
            <div className="md:col-span-7 flex items-center gap-2.5 border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 focus-within:border-[#34483D] transition-colors">
              <Search className="w-4 h-4 text-[#5C625A] shrink-0" />
              <input
                type="text"
                value={uniQuery}
                onChange={(e) => setUniQuery(e.target.value)}
                placeholder={t.discover.uniSearchPlaceholder}
                className="w-full bg-transparent text-sm focus:outline-none"
              />
              {uniQuery && (
                <button
                  type="button"
                  aria-label={t.common.clear}
                  onClick={() => setUniQuery('')}
                  className="text-[#5C625A] hover:text-[#34483D]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="md:col-span-5">
              <select
                aria-label={t.discover.allInstitutionTypes}
                value={uniType}
                onChange={(e) => {
                  setUniType(e.target.value as InstitutionType | 'all');
                  scrollIntoViewIfNeeded(uniResultsRef.current);
                }}
                className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm"
              >
                {UNI_TYPES.map((typeOption) => (
                  <option key={typeOption} value={typeOption}>
                    {typeOption === 'all' ? t.discover.allInstitutionTypes : typeOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            ref={uniResultsRef}
            className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C625A] scroll-target"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="tabular-nums">
                <strong className="text-[#34483D]">{filteredUnis.length}</strong> {t.discover.showingUniversities}
              </span>
              {translatingUnis && (
                <span className="inline-flex items-center gap-1.5 text-[#34483D]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {t.common.translatingContent}
                </span>
              )}
            </div>
            {(uniQuery || uniType !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setUniQuery('');
                  setUniType('all');
                }}
                className="text-[#34483D] font-medium underline underline-offset-4 hover:text-[#B87961]"
              >
                {t.common.resetFilters}
              </button>
            )}
          </div>

          {displayedUnis.length === 0 ? (
            <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-8 sm:p-10 text-center space-y-3">
              <p className="font-serif text-xl text-[#34483D]">{t.discover.noUnisTitle}</p>
              <p className="text-sm text-[#5C625A]">{t.discover.noUnisDesc}</p>
              <button
                type="button"
                onClick={() => {
                  setUniQuery('');
                  setUniType('all');
                }}
                className="px-4 py-2 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] transition-colors"
              >
                {t.common.resetFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedUnis.map((uni) => {
                const saved = isBookmarked('university', uni.id);
                return (
                  <article
                    key={uni.id}
                    className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 space-y-4 flex flex-col justify-between editorial-card"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-[#5C625A]">
                            <span className="text-[#B87961] font-medium">{uni.type}</span>
                            <span aria-hidden="true"> · </span>
                            <span>{uni.location}</span>
                            <span aria-hidden="true"> · </span>
                            <span className="tabular-nums">
                              {t.discover.established} {uni.established}
                            </span>
                          </p>
                          <h2 className="font-serif text-2xl text-[#34483D] mt-1">{uni.name}</h2>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            toggleBookmark({
                              itemType: 'university',
                              itemId: uni.id,
                              title: uni.name,
                              category: uni.type,
                            })
                          }
                          aria-label={saved ? t.common.saved : t.common.save}
                          className="p-2 border border-[#D9CFC0] text-[#34483D] hover:bg-[#E9E2D5] transition-colors"
                        >
                          {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="text-xs sm:text-sm space-y-2 text-[#30342F]">
                        <p>
                          <strong className="text-[#34483D]">{t.discover.notableCourses}: </strong>
                          {uni.notableCourses.join(' · ')}
                        </p>
                        <p>
                          <strong className="text-[#34483D]">{t.discover.entranceExams}: </strong>
                          {uni.entranceExams.join(', ')}
                        </p>
                        <p>
                          <strong className="text-[#34483D]">{t.discover.admissionProcess}: </strong>
                          {uni.admissionProcess}
                        </p>
                        <p>
                          <strong className="text-[#34483D]">{t.discover.feeNote}: </strong>
                          {uni.feeNote} {uni.scholarshipNote}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E9E2D5] flex items-center justify-between text-xs text-[#5C625A]">
                      <span className="tabular-nums">
                        {t.common.verified} {uni.lastVerifiedDate}
                      </span>
                      <a
                        href={uni.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-[#34483D] hover:text-[#B87961] transition-colors"
                      >
                        {t.common.officialSite} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
