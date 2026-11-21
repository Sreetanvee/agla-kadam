import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  Check,
  Compass,
  Loader2,
  Users,
} from 'lucide-react';
import { api } from '../lib/api';
import { useFirebase } from '../contexts/FirebaseContext';
import { COMPLETE_GUIDE_MAP } from '../data/catalog';
import { scrollIntoViewIfNeeded } from '../lib/smartScroll';
import { useI18n } from '../hooks/useI18n';
import type { GeneratedRoadmap, LanguageCode, StudentProfileData } from '../types/domain';

interface RoadmapViewProps {
  onOpenGuide: (slug: string) => void;
  onExplainToParents: (pathwayTitle: string) => void;
}

const EDUCATION_LEVELS: { value: string; labels: Record<LanguageCode, string> }[] = [
  {
    value: 'School (Class 8–10)',
    labels: { en: 'School (Class 8–10)', hi: 'स्कूल (कक्षा 8–10)', te: 'పాఠశాల (8–10 తరగతి)' },
  },
  {
    value: 'Completed Class 10',
    labels: { en: 'Completed Class 10', hi: '10वीं पास (Class 10 के बाद)', te: '10వ తరగతి పూర్తి' },
  },
  {
    value: 'Class 11 / 12 (Intermediate)',
    labels: { en: 'Class 11 / 12 (Intermediate)', hi: 'कक्षा 11 / 12 (इंटरमीडिएट)', te: 'ఇంటర్ / 11 & 12 తరగతి' },
  },
  {
    value: 'Polytechnic / Diploma',
    labels: { en: 'Polytechnic / Diploma', hi: 'पॉलिटेक्निक / डिप्लोमा', te: 'పాలిటెక్నిక్ / డిప్లొమా' },
  },
  {
    value: 'Undergraduate Student',
    labels: { en: 'Undergraduate Student', hi: 'स्नातक छात्र (Undergraduate / UG)', te: 'డిగ్రీ విద్యార్థి (UG)' },
  },
  {
    value: 'Graduate / Job Seeker',
    labels: { en: 'Graduate / Job Seeker', hi: 'ग्रेजुएट / नौकरी की तलाश', te: 'గ్రాడ్యుయేట్ / ఉద్యోగ అన్వేషకులు' },
  },
  {
    value: 'Postgraduate Student',
    labels: { en: 'Postgraduate Student', hi: 'पोस्टग्रेजुएट छात्र (PG)', te: 'పీజీ విద్యార్థి (PG)' },
  },
  {
    value: 'Research Scholar',
    labels: { en: 'Research Scholar', hi: 'रिसर्च स्कॉलर (PhD / शोध)', te: 'పరిశోధన విద్యార్థి (Research)' },
  },
  {
    value: 'Early-Career Professional',
    labels: { en: 'Early-Career Professional', hi: 'अर्ली-करियर प्रोफेशनल', te: 'ప్రారంభ కెరీర్ నిపుణులు' },
  },
];

const BUDGET_OPTIONS: { value: string; labels: Record<LanguageCode, string> }[] = [
  {
    value: 'Minimal / Scholarships & Free Public Institutes Needed',
    labels: {
      en: 'Minimal (Scholarships & Public Fees Essential)',
      hi: 'न्यूनतम (स्कॉलरशिप और सरकारी कॉलेज की कम फीस आवश्यक)',
      te: 'కనిష్టం (స్కాలర్‌షిప్‌లు మరియు ప్రభుత్వ ఫీజులు అవసరం)',
    },
  },
  {
    value: 'Modest / Public Institutes & Scholarships',
    labels: {
      en: 'Modest (Up to ₹1–2L/year with aid)',
      hi: 'सीमित (सालाना ₹1–2 लाख तक, सहायता सहित)',
      te: 'మితం (సహాయంతో ఏడాదికి ₹1–2 లక్షల వరకు)',
    },
  },
  {
    value: 'Moderate / Education Loan Possible',
    labels: {
      en: 'Moderate (Up to ₹5L/year or Education Loan)',
      hi: 'मध्यम (सालाना ₹5 लाख तक या Education Loan संभव)',
      te: 'మధ్యస్థం (ఏడాదికి ₹5 లక్షల వరకు లేదా ఎడ్యుకేషన్ లోన్)',
    },
  },
  {
    value: 'Flexible / India or International',
    labels: {
      en: 'Flexible (Open to India or International)',
      hi: 'लचीला (भारत या विदेश दोनों के लिए खुला)',
      te: 'సరళం (భారతదేశం లేదా విదేశాలకు సిద్ధం)',
    },
  },
];

const TRACK_PREFERENCES: { value: string; labels: Record<LanguageCode, string> }[] = [
  {
    value: 'Higher Education (India)',
    labels: { en: 'Higher Education (India)', hi: 'उच्च शिक्षा (भारत में)', te: 'ఉన్నత విద్య (భారతదేశం)' },
  },
  {
    value: 'Competitive Exams / Public Sector',
    labels: { en: 'Competitive Exams / Public Sector', hi: 'प्रतियोगी परीक्षाएँ / सरकारी क्षेत्र', te: 'పోటీ పరీక్షలు / ప్రభుత్వ రంగం' },
  },
  {
    value: 'First Job / Corporate / Industry',
    labels: { en: 'First Job / Corporate / Industry', hi: 'पहली नौकरी / कॉर्पोरेट / इंडस्ट्री', te: 'మొదటి ఉద్యోగం / కార్పొరేట్' },
  },
  {
    value: 'Research & Publishing',
    labels: { en: 'Research & Publishing', hi: 'रिसर्च और पेपर प्रकाशन', te: 'పరిశోధన & ప్రచురణ' },
  },
  {
    value: 'Startups & Entrepreneurship',
    labels: { en: 'Startups & Entrepreneurship', hi: 'स्टार्टअप्स और उद्यमिता', te: 'స్టార్టప్‌లు & వ్యవస్థాపకత' },
  },
  {
    value: 'Funded International Education',
    labels: { en: 'Funded International Education', hi: 'स्कॉलरशिप के साथ विदेश में पढ़ाई', te: 'ఫండెడ్ విదేశీ విద్య' },
  },
  {
    value: 'Skill-First / Vocational / Freelancing',
    labels: { en: 'Skill-First / Vocational / Freelancing', hi: 'स्किल-फर्स्ट / वोकेशनल / फ्रीलांसिंग', te: 'నైపుణ్య ఆధారిత / వృత్తి విద్య / ఫ్రీలాన్సింగ్' },
  },
];

const DEFAULT_PROFILE: StudentProfileData = {
  educationLevel: 'Undergraduate Student',
  stream: 'Computer Science / Engineering',
  location: 'Hyderabad, Telangana',
  preferredLocation: 'Anywhere in India or Funded Abroad',
  budgetRange: 'Modest / Public Institutes & Scholarships',
  interests: ['Technology', 'Research', 'Public Policy'],
  strengths: ['Analytical Thinking', 'Writing'],
  goals: ['Financial independence', 'Meaningful impactful work'],
  trackPreferences: ['Higher Education (India)', 'Research & Publishing', 'First Job / Corporate / Industry'],
};

export function RoadmapView({ onOpenGuide, onExplainToParents }: RoadmapViewProps) {
  const { studentProfile, saveStudentProfile, saveRoadmap, user } = useFirebase();
  const { lang, t, getGuideListMeta } = useI18n();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<StudentProfileData>(studentProfile || DEFAULT_PROFILE);
  const [interestInput, setInterestInput] = useState((studentProfile?.interests || DEFAULT_PROFILE.interests).join(', '));
  const [strengthInput, setStrengthInput] = useState((studentProfile?.strengths || DEFAULT_PROFILE.strengths).join(', '));
  const [goalInput, setGoalInput] = useState((studentProfile?.goals || DEFAULT_PROFILE.goals).join(', '));

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<GeneratedRoadmap | null>(null);
  const [activePathwayIndex, setActivePathwayIndex] = useState(0);
  const [compareMode, setCompareMode] = useState(false);
  const [savedConfirmed, setSavedConfirmed] = useState(false);

  const builderRef = useRef<HTMLElement | null>(null);
  const generatedResultsRef = useRef<HTMLElement | null>(null);
  const pathwayBlueprintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (studentProfile) {
      setForm(studentProfile);
      setInterestInput(studentProfile.interests.join(', '));
      setStrengthInput(studentProfile.strengths.join(', '));
      setGoalInput(studentProfile.goals.join(', '));
    }
  }, [studentProfile]);

  const toggleTrack = (track: string) => {
    setForm((prev) => ({
      ...prev,
      trackPreferences: prev.trackPreferences.includes(track)
        ? prev.trackPreferences.filter((item) => item !== track)
        : [...prev.trackPreferences, track],
    }));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setSavedConfirmed(false);
    const cleanedProfile: StudentProfileData = {
      ...form,
      interests: interestInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 12),
      strengths: strengthInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 12),
      goals: goalInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 10),
    };

    try {
      if (user) {
        await saveStudentProfile(cleanedProfile);
      }
      const roadmap = await api.generateRoadmap({ ...cleanedProfile, language: lang });
      setGenerated(roadmap);
      setActivePathwayIndex(0);
      setCompareMode(false);
      // Immediately bring the newly generated 3-pathway roadmap into view
      setTimeout(() => {
        scrollIntoViewIfNeeded(generatedResultsRef.current, { forceAlign: true });
      }, 40);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate roadmap.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveRoadmap = async () => {
    if (!generated) return;
    const savedId = await saveRoadmap({
      title: generated.title,
      educationStage: generated.educationStage,
      summary: generated.summary,
      pathways: generated.pathways,
      selectedPathwayId: generated.pathways[activePathwayIndex]?.id,
    });
    if (savedId) {
      setSavedConfirmed(true);
    }
  };

  const activePathway = generated?.pathways[activePathwayIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <header className="max-w-3xl space-y-3 border-b border-[#D9CFC0] pb-8">
        <p className="text-xs uppercase tracking-widest text-[#B87961]">{t.roadmap.kicker}</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#34483D]">
          {t.roadmap.title}
        </h1>
        <p className="text-base text-[#5C625A] leading-relaxed">
          {t.roadmap.subtitle}
        </p>
      </header>

      {/* Progressive 4-Step Builder */}
      <section ref={builderRef} className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 sm:p-8 space-y-6 scroll-target">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E9E2D5] pb-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-medium">
            {[
              [1, t.roadmap.step1Tab],
              [2, t.roadmap.step2Tab],
              [3, t.roadmap.step3Tab],
              [4, t.roadmap.step4Tab],
            ].map(([num, label]) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setStep(num as number);
                  scrollIntoViewIfNeeded(builderRef.current);
                }}
                className={`pb-1 border-b-2 transition-colors whitespace-nowrap ${
                  step === num
                    ? 'border-[#34483D] text-[#34483D]'
                    : 'border-transparent text-[#5C625A] hover:text-[#34483D]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#5C625A] tabular-nums">
            {t.roadmap.stepCounter} {step} / 4
          </span>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-[#5C625A]">
                {t.roadmap.eduStageLabel}
              </label>
              <select
                value={form.educationLevel}
                onChange={(e) => setForm({ ...form, educationLevel: e.target.value })}
                className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm"
              >
                {EDUCATION_LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.labels[lang]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-[#5C625A]">
                {t.roadmap.streamLabel}
              </label>
              <input
                type="text"
                value={form.stream}
                onChange={(e) => setForm({ ...form, stream: e.target.value })}
                placeholder={t.roadmap.streamPlaceholder}
                className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-[#5C625A]">
                {t.roadmap.cityLabel}
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder={t.roadmap.cityPlaceholder}
                className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-[#5C625A]">
                {t.roadmap.destLabel}
              </label>
              <input
                type="text"
                value={form.preferredLocation}
                onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })}
                placeholder={t.roadmap.destPlaceholder}
                className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-[#5C625A]">
                {t.roadmap.budgetLabel}
              </label>
              <select
                value={form.budgetRange}
                onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
                className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm"
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.labels[lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-[#5C625A]">
                {t.roadmap.interestsLabel}
              </label>
              <textarea
                rows={3}
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                placeholder={t.roadmap.interestsPlaceholder}
                className="w-full border border-[#D9CFC0] bg-[#F7F4EC] p-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-[#5C625A]">
                {t.roadmap.strengthsLabel}
              </label>
              <textarea
                rows={3}
                value={strengthInput}
                onChange={(e) => setStrengthInput(e.target.value)}
                placeholder={t.roadmap.strengthsPlaceholder}
                className="w-full border border-[#D9CFC0] bg-[#F7F4EC] p-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-[#5C625A]">
                {t.roadmap.goalsLabel}
              </label>
              <textarea
                rows={3}
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder={t.roadmap.goalsPlaceholder}
                className="w-full border border-[#D9CFC0] bg-[#F7F4EC] p-3 text-sm"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-[#5C625A]">
              {t.roadmap.tracksPrompt}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {TRACK_PREFERENCES.map((track) => {
                const selected = form.trackPreferences.includes(track.value);
                return (
                  <button
                    key={track.value}
                    type="button"
                    onClick={() => toggleTrack(track.value)}
                    className={`px-4 py-2 text-xs font-medium border transition-colors ${
                      selected
                        ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                        : 'bg-[#F7F4EC] text-[#30342F] border-[#D9CFC0] hover:bg-[#E9E2D5]'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {track.labels[lang]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#E9E2D5] flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="px-4 py-2 text-xs font-medium border border-[#D9CFC0] text-[#34483D] disabled:opacity-40 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t.common.back}
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              className="px-5 py-2.5 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] inline-flex items-center gap-1.5"
            >
              {t.common.continue} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={generating}
              onClick={handleGenerate}
              className="px-6 py-2.5 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] disabled:opacity-60 inline-flex items-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> {t.roadmap.generatingBtn}
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" /> {t.roadmap.generateBtn}
                </>
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 border border-[#B87961] bg-[#B87961]/10 text-sm text-[#9B5F49]">
            {error}
          </div>
        )}
      </section>

      {/* Generated 3-Pathway Output */}
      {generated && (
        <section ref={generatedResultsRef} className="space-y-8 scroll-target">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9CFC0] pb-6">
            <div className="space-y-2 max-w-3xl">
              <p className="text-xs uppercase tracking-widest text-[#B87961]">
                {t.roadmap.aiPlanKicker}
              </p>
              <h2 className="font-serif text-3xl text-[#34483D]">{generated.title}</h2>
              <p className="text-sm text-[#5C625A] leading-relaxed">{generated.summary}</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCompareMode((c) => !c);
                  scrollIntoViewIfNeeded(generatedResultsRef.current);
                }}
                className="px-4 py-2 border border-[#34483D] text-xs font-medium text-[#34483D] hover:bg-[#E9E2D5]"
              >
                {compareMode ? t.roadmap.detailedViewBtn : t.roadmap.compareAllBtn}
              </button>
              <button
                type="button"
                onClick={handleSaveRoadmap}
                className="px-4 py-2 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] inline-flex items-center gap-1.5"
              >
                {savedConfirmed ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> {t.common.savedToDashboard}
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5" /> {t.roadmap.saveRoadmapBtn}
                  </>
                )}
              </button>
            </div>
          </div>

          {compareMode ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {generated.pathways.map((p, idx) => (
                <div key={p.id || idx} className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 space-y-4">
                  <p className="text-xs uppercase tracking-widest text-[#B87961]">
                    {t.roadmap.optionLabel} 0{idx + 1} · {p.trackLabel}
                  </p>
                  <h3 className="font-serif text-2xl text-[#34483D]">{p.title}</h3>
                  <p className="text-xs text-[#5C625A] leading-relaxed">{p.whyItFits}</p>
                  <div className="space-y-2 text-xs text-[#30342F] pt-2 border-t border-[#E9E2D5]">
                    <p><strong>{t.roadmap.keyExaminations}:</strong> {p.examinations.join(', ')}</p>
                    <p><strong>{t.roadmap.estimatedCost}:</strong> {p.estimatedCostNote}</p>
                    <p><strong>{t.roadmap.immediateNextStep}:</strong> {p.immediateActions[0]}</p>
                    <p><strong>{t.roadmap.keyRiskAlternative}:</strong> {p.risksAndAlternatives[0]}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePathwayIndex(idx);
                      setCompareMode(false);
                      setTimeout(() => {
                        scrollIntoViewIfNeeded(pathwayBlueprintRef.current, { forceAlign: true });
                      }, 30);
                    }}
                    className="text-xs font-medium text-[#34483D] underline underline-offset-4"
                  >
                    {t.roadmap.inspectMilestones} →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            activePathway && (
              <div className="space-y-6">
                {/* Pathway Selector Tabs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {generated.pathways.map((p, idx) => (
                    <button
                      key={p.id || idx}
                      type="button"
                      onClick={() => {
                        setActivePathwayIndex(idx);
                        scrollIntoViewIfNeeded(pathwayBlueprintRef.current);
                      }}
                      className={`p-5 text-left border transition-colors ${
                        idx === activePathwayIndex
                          ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                          : 'bg-[#FCFBF7] text-[#30342F] border-[#D9CFC0] hover:bg-[#E9E2D5]'
                      }`}
                    >
                      <p className="text-xs uppercase tracking-wider opacity-75">
                        {t.roadmap.pathwayLabel} 0{idx + 1} · {p.trackLabel}
                      </p>
                      <p className="font-serif text-xl mt-1">{p.title}</p>
                    </button>
                  ))}
                </div>

                {/* Selected Pathway Full Blueprint */}
                <div
                  ref={pathwayBlueprintRef}
                  className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 sm:p-8 space-y-8 scroll-target"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E9E2D5] pb-5">
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-3xl text-[#34483D]">{activePathway.title}</h3>
                      <p className="text-sm text-[#5C625A] leading-relaxed max-w-3xl">
                        {activePathway.whyItFits}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onExplainToParents(activePathway.title)}
                      className="px-4 py-2 border border-[#34483D] text-xs font-medium text-[#34483D] hover:bg-[#E9E2D5] inline-flex items-center gap-1.5 shrink-0"
                    >
                      <Users className="w-3.5 h-3.5" /> {t.common.explainToParents}
                    </button>
                  </div>

                  {/* Three-Horizon Milestones */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#F7F4EC] p-5 border border-[#E9E2D5] space-y-2.5">
                      <p className="text-xs uppercase tracking-widest text-[#B87961]">{t.roadmap.immediateHorizon}</p>
                      <ul className="space-y-2 text-sm text-[#30342F]">
                        {activePathway.immediateActions.map((a, i) => <li key={i}>• {a}</li>)}
                      </ul>
                    </div>
                    <div className="bg-[#F7F4EC] p-5 border border-[#E9E2D5] space-y-2.5">
                      <p className="text-xs uppercase tracking-widest text-[#34483D]">{t.roadmap.shortTermHorizon}</p>
                      <ul className="space-y-2 text-sm text-[#30342F]">
                        {activePathway.shortTermMilestones.map((m, i) => <li key={i}>• {m}</li>)}
                      </ul>
                    </div>
                    <div className="bg-[#F7F4EC] p-5 border border-[#E9E2D5] space-y-2.5">
                      <p className="text-xs uppercase tracking-widest text-[#5C625A]">{t.roadmap.longTermHorizon}</p>
                      <ul className="space-y-2 text-sm text-[#30342F]">
                        {activePathway.longTermMilestones.map((m, i) => <li key={i}>• {m}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* Qualifications, Exams, Skills, Costs, Institutions, Risks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-[#5C625A] mb-1">{t.roadmap.requiredQualifications}</h4>
                        <p>{activePathway.requiredQualifications.join(' · ')}</p>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-[#5C625A] mb-1">{t.roadmap.keyExaminations}</h4>
                        <p>{activePathway.examinations.join(' · ')}</p>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-[#5C625A] mb-1">{t.roadmap.skillsToBuild}</h4>
                        <p>{activePathway.skills.join(' · ')}</p>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-[#5C625A] mb-1">{t.roadmap.estimatedCost}</h4>
                        <p>{activePathway.estimatedCostNote}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-[#5C625A] mb-1">{t.roadmap.possibleInstitutions}</h4>
                        <p>{activePathway.possibleInstitutions.join(' · ')}</p>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-[#5C625A] mb-1">{t.roadmap.opportunitiesToWatch}</h4>
                        <ul className="space-y-1">
                          {activePathway.opportunities.map((o, i) => <li key={i}>• {o}</li>)}
                        </ul>
                      </div>
                      <div className="bg-[#E9E2D5]/55 p-4 space-y-1">
                        <h4 className="text-xs uppercase tracking-widest text-[#B87961] font-semibold">
                          {t.roadmap.risksAlternatives}
                        </h4>
                        <ul className="space-y-1 text-xs sm:text-sm">
                          {activePathway.risksAndAlternatives.map((r, i) => <li key={i}>• {r}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Linked Verified Guides */}
                  {activePathway.recommendedGuideSlugs.length > 0 && (
                    <div className="pt-4 border-t border-[#D9CFC0] space-y-2">
                      <p className="text-xs uppercase tracking-widest text-[#5C625A]">
                        {t.roadmap.verifiedGuidesHeading}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {activePathway.recommendedGuideSlugs.map((slug) => {
                          const g = COMPLETE_GUIDE_MAP[slug];
                          if (!g) return null;
                          const localized = getGuideListMeta(slug, g.title, g.summary);
                          return (
                            <button
                              key={slug}
                              type="button"
                              onClick={() => onOpenGuide(slug)}
                              className="text-xs font-medium text-[#34483D] underline underline-offset-4 hover:text-[#B87961]"
                            >
                              {localized.title} →
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          <p className="text-xs text-[#5C625A]">{generated.verifiedContextNote}</p>
        </section>
      )}
    </div>
  );
}
