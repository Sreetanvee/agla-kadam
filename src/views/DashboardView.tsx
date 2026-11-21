import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  Bookmark,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Compass,
  Download,
  ExternalLink,
  Globe,
  LogOut,
  MessageSquare,
  Plus,
  Shield,
  Sparkles,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { COMPLETE_GUIDES, LEARNING_JOURNEYS, OPPORTUNITIES } from '../data/catalog';
import { useFirebase } from '../contexts/FirebaseContext';
import { useI18n, useTranslatedOpportunities } from '../hooks/useI18n';
import { ENGAGEMENT_STRINGS } from '../i18n/engagementStrings';
import { LanguageSelector } from '../components/LanguageSelector';
import { scrollIntoViewIfNeeded } from '../lib/smartScroll';
import type { AchievementRecord, SavedRoadmapRecord, StudentProfileData, StudentStage } from '../types/domain';
import type { AppRoute } from '../components/Navbar';

interface DashboardViewProps {
  onNavigate: (route: AppRoute) => void;
  onOpenGuide: (slug: string) => void;
  onOpenJourney: (journeyId: string) => void;
  onExplainToParents: (pathwayTitle: string) => void;
  onAskKadamAi?: (question: string) => void;
}

type DashboardTab =
  | 'overview'
  | 'roadmaps'
  | 'calendar'
  | 'locker'
  | 'saved'
  | 'ai-history'
  | 'profile';

const ACHIEVEMENT_CATEGORIES: { value: AchievementRecord['category']; fallback: string }[] = [
  { value: 'academic', fallback: 'Academic Milestone' },
  { value: 'examination', fallback: 'Competitive Examination' },
  { value: 'internship', fallback: 'Internship / Experience' },
  { value: 'research', fallback: 'Research / Paper / Patent' },
  { value: 'scholarship', fallback: 'Scholarship / Fellowship' },
  { value: 'certification', fallback: 'Skill / Certification' },
  { value: 'competition', fallback: 'Competition / Hackathon' },
  { value: 'startup', fallback: 'Startup / Project' },
  { value: 'volunteering', fallback: 'Volunteering / Leadership' },
];

const EMPTY_PROFILE: StudentProfileData = {
  educationLevel: '',
  stream: '',
  location: '',
  preferredLocation: '',
  budgetRange: '',
  interests: [],
  strengths: [],
  goals: [],
  trackPreferences: [],
};

function getRoadmapProgress(rm: SavedRoadmapRecord) {
  const total = rm.pathways.reduce(
    (acc, p) => acc + p.immediateActions.length + Math.min(2, p.shortTermMilestones.length),
    0
  );
  const completed = (rm.completedMilestones || []).length;
  const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  return { completed, total, pct };
}

function inferStagesFromProfile(profile: StudentProfileData | null): StudentStage[] {
  if (!profile) return [];
  const text = `${profile.educationLevel} ${profile.stream} ${profile.goals.join(' ')} ${profile.interests.join(' ')}`.toLowerCase();
  const matched: StudentStage[] = [];
  if (/(class 8|class 9|class 10|10th|ssc|school)/.test(text)) matched.push('after-10', 'school');
  if (/(class 11|class 12|11th|12th|inter|mpc|bipc|hec|cec|intermediate)/.test(text)) matched.push('class-11-12');
  if (/(diploma|polytechnic|iti)/.test(text)) matched.push('diploma');
  if (/(ug|undergrad|b\.tech|btech|b\.sc|bsc|b\.com|bcom|ba |bachelor|degree|1st year|2nd year|3rd year|final year)/.test(text)) matched.push('undergraduate');
  if (/(pg|postgrad|m\.tech|mtech|m\.sc|msc|mba|ma |master)/.test(text)) matched.push('postgraduate');
  if (/(phd|research|paper|scientist|fellowship)/.test(text)) matched.push('research');
  if (/(abroad|ms |germany|europe|canada|international|foreign)/.test(text)) matched.push('international');
  if (/(startup|founder|entrepreneur|patent)/.test(text)) matched.push('entrepreneurship');
  return matched;
}

export function DashboardView({
  onNavigate,
  onOpenGuide,
  onOpenJourney,
  onExplainToParents,
  onAskKadamAi,
}: DashboardViewProps) {
  const {
    user,
    userDisplayName,
    authReady,
    signingIn,
    authError,
    studentProfile,
    bookmarks,
    deadlines,
    achievements,
    roadmaps,
    conversations,
    learningProgress,
    signInWithGoogle,
    signOut,
    saveStudentProfile,
    toggleBookmark,
    addDeadline,
    updateDeadlineStatus,
    deleteDeadline,
    addAchievement,
    deleteAchievement,
    toggleRoadmapMilestone,
    deleteRoadmap,
    deleteConversation,
    exportAllUserData,
    clearAllAiHistory,
  } = useFirebase();

  const {
    lang,
    t,
    getGuideListMeta,
    getJourneyListMeta,
    getAchievementCategoryLabel,
    getLanguageNativeName,
    getOppCategoryLabel,
  } = useI18n();
  const eng = ENGAGEMENT_STRINGS[lang].dashboard;

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [lockerMode, setLockerMode] = useState<'locker' | 'timeline'>('locker');
  const [savedFilter, setSavedFilter] = useState<'all' | 'guide' | 'opportunity' | 'university' | 'journey'>('all');
  const tabPanelRef = useRef<HTMLDivElement | null>(null);

  const selectTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    scrollIntoViewIfNeeded(tabPanelRef.current);
  };

  // New deadline form
  const [dlTitle, setDlTitle] = useState('');
  const [dlCategory, setDlCategory] = useState('Examination');
  const [dlDate, setDlDate] = useState('');
  const [dlUrl, setDlUrl] = useState('');
  const [dlNotes, setDlNotes] = useState('');
  const [dlSaving, setDlSaving] = useState(false);

  // New achievement form
  const [achTitle, setAchTitle] = useState('');
  const [achCategory, setAchCategory] = useState<AchievementRecord['category']>('academic');
  const [achIssuer, setAchIssuer] = useState('');
  const [achDate, setAchDate] = useState('');
  const [achUrl, setAchUrl] = useState('');
  const [achSkills, setAchSkills] = useState('');
  const [achReflection, setAchReflection] = useState('');
  const [achSaving, setAchSaving] = useState(false);

  // Profile editor state
  const [profileForm, setProfileForm] = useState<StudentProfileData>(studentProfile || EMPTY_PROFILE);
  const [interestsInput, setInterestsInput] = useState('');
  const [strengthsInput, setStrengthsInput] = useState('');
  const [goalsInput, setGoalsInput] = useState('');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Privacy confirmation state
  const [confirmClearAi, setConfirmClearAi] = useState(false);
  const [clearingAi, setClearingAi] = useState(false);

  useEffect(() => {
    if (studentProfile) {
      setProfileForm(studentProfile);
      setInterestsInput(studentProfile.interests.join(', '));
      setStrengthsInput(studentProfile.strengths.join(', '));
      setGoalsInput(studentProfile.goals.join(', '));
    }
  }, [studentProfile]);

  const filteredBookmarks = useMemo(() => {
    if (savedFilter === 'all') return bookmarks;
    return bookmarks.filter((b) => b.itemType === savedFilter);
  }, [bookmarks, savedFilter]);

  const upcomingDeadlines = useMemo(
    () => deadlines.filter((d) => d.status !== 'submitted'),
    [deadlines]
  );

  // Contextual recommendations matched to studentProfile & unread guides
  const completedGuideSlugs = useMemo(
    () =>
      new Set(
        learningProgress
          .filter((p) => p.itemType === 'guide' && p.percentComplete >= 100)
          .map((p) => p.itemId)
      ),
    [learningProgress]
  );

  const activeJourneyCount = useMemo(
    () => learningProgress.filter((p) => p.itemType === 'journey' && p.percentComplete > 0).length,
    [learningProgress]
  );

  const totalCheckedMilestones = useMemo(
    () => roadmaps.reduce((acc, rm) => acc + (rm.completedMilestones || []).length, 0),
    [roadmaps]
  );

  const recommendedItems = useMemo(() => {
    const inferredStages = inferStagesFromProfile(studentProfile);
    const stageSet = new Set(inferredStages);

    const guides = COMPLETE_GUIDES.filter((g) => !completedGuideSlugs.has(g.slug))
      .sort((a, b) => {
        const scoreA = a.stages.filter((s) => stageSet.has(s)).length;
        const scoreB = b.stages.filter((s) => stageSet.has(s)).length;
        return scoreB - scoreA;
      })
      .slice(0, 2);

    const opps = OPPORTUNITIES.filter((o) => o.lesserKnown)
      .sort((a, b) => {
        const scoreA = a.stages.filter((s) => stageSet.has(s)).length;
        const scoreB = b.stages.filter((s) => stageSet.has(s)).length;
        return scoreB - scoreA;
      })
      .slice(0, 2);

    const journey =
      LEARNING_JOURNEYS.find((j) =>
        inferredStages.length > 0
          ? j.targetAudience.toLowerCase().includes(inferredStages[0].replace('-', ' '))
          : true
      ) || LEARNING_JOURNEYS[0];

    return { guides, opps, journey };
  }, [studentProfile, completedGuideSlugs]);

  const { opportunities: recommendedOpps } = useTranslatedOpportunities(
    recommendedItems.opps,
    lang
  );

  if (!authReady) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[#5C625A]">
        {t.common.loadingWorkspace}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-8 sm:p-12">
          <p className="text-xs uppercase tracking-[0.14em] text-[#B87961] mb-2">
            {t.dashboard.kicker}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#34483D]">
            {t.auth.welcomeBack}
          </h1>
          <p className="mt-4 text-[#5C625A] text-base leading-relaxed max-w-2xl">
            {t.auth.signInDesc}
          </p>
          {authError && (
            <p className="mt-6 text-sm text-[#9B3B2B] bg-[#FBF2EE] border border-[#E5BFB2] px-4 py-3">
              {authError}
            </p>
          )}
          <div className="mt-8">
            <button
              type="button"
              disabled={signingIn}
              onClick={() => signInWithGoogle()}
              className="px-6 py-3 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors disabled:opacity-60"
            >
              {signingIn ? t.auth.signingInBtn : t.auth.continueGoogle}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dlTitle.trim() || !dlDate.trim()) return;
    setDlSaving(true);
    try {
      await addDeadline({
        title: dlTitle.trim(),
        category: dlCategory,
        dueDate: dlDate.trim(),
        officialUrl: dlUrl.trim() || undefined,
        notes: dlNotes.trim() || undefined,
      });
      setDlTitle('');
      setDlDate('');
      setDlUrl('');
      setDlNotes('');
    } finally {
      setDlSaving(false);
    }
  };

  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle.trim() || !achIssuer.trim() || !achDate.trim()) return;
    setAchSaving(true);
    try {
      await addAchievement({
        title: achTitle.trim(),
        category: achCategory,
        issuer: achIssuer.trim(),
        dateEarned: achDate.trim(),
        verificationUrl: achUrl.trim() || undefined,
        reflection: achReflection.trim() || undefined,
        skills: achSkills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 15),
      });
      setAchTitle('');
      setAchIssuer('');
      setAchDate('');
      setAchUrl('');
      setAchSkills('');
      setAchReflection('');
    } finally {
      setAchSaving(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStudentProfile({
      ...profileForm,
      interests: interestsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      strengths: strengthsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      goals: goalsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2500);
  };

  const handleExportJson = () => {
    const json = exportAllUserData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agla-kadam-personal-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAllAi = async () => {
    setClearingAi(true);
    try {
      await clearAllAiHistory();
      setConfirmClearAi(false);
    } finally {
      setClearingAi(false);
    }
  };

  const getDeadlineStatusLabel = (status: string) => {
    if (status === 'in_progress') return t.dashboard.statusInProgress;
    if (status === 'submitted') return t.dashboard.statusSubmitted;
    return t.dashboard.statusWatching;
  };

  const getBookmarkTypeLabel = (itemType: string) => {
    if (itemType === 'guide') return t.dashboard.guidesFilter;
    if (itemType === 'opportunity') return t.dashboard.opportunitiesFilter;
    if (itemType === 'university') return t.dashboard.universitiesFilter;
    if (itemType === 'journey') return t.dashboard.journeysFilter;
    return itemType;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Workspace Header */}
      <header className="border-b border-[#D9CFC0] pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#B87961] mb-1">
              {t.dashboard.kicker}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#34483D]">
              {t.dashboard.welcomePrefix}, {userDisplayName || user.displayName || 'Student'}
            </h1>
            <p className="text-sm text-[#5C625A] mt-1">
              {user.email}
              {studentProfile?.educationLevel ? ` · ${studentProfile.educationLevel}` : ''}
              {studentProfile?.stream ? ` · ${studentProfile.stream}` : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <LanguageSelector compact ariaLabel={t.common.languageLabel} />
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-[#D9CFC0] text-[#30342F] hover:bg-[#E9E2D5] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> {t.common.signOut}
            </button>
          </div>
        </div>

        {/* Quiet Tabular KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <button
            type="button"
            onClick={() => selectTab('roadmaps')}
            className="text-left border border-[#D9CFC0] bg-[#FCFBF7] p-4 editorial-card"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-[#5C625A]">{t.dashboard.kpiRoadmaps}</p>
            <p className="font-serif text-3xl font-semibold text-[#34483D] tabular-nums mt-1">
              {roadmaps.length}
            </p>
          </button>
          <button
            type="button"
            onClick={() => selectTab('calendar')}
            className="text-left border border-[#D9CFC0] bg-[#FCFBF7] p-4 editorial-card"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-[#5C625A]">{t.dashboard.kpiDeadlines}</p>
            <p className="font-serif text-3xl font-semibold text-[#34483D] tabular-nums mt-1">
              {upcomingDeadlines.length}
            </p>
          </button>
          <button
            type="button"
            onClick={() => selectTab('locker')}
            className="text-left border border-[#D9CFC0] bg-[#FCFBF7] p-4 editorial-card"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-[#5C625A]">{t.dashboard.kpiAchievements}</p>
            <p className="font-serif text-3xl font-semibold text-[#34483D] tabular-nums mt-1">
              {achievements.length}
            </p>
          </button>
          <button
            type="button"
            onClick={() => selectTab('saved')}
            className="text-left border border-[#D9CFC0] bg-[#FCFBF7] p-4 editorial-card"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-[#5C625A]">{t.dashboard.kpiSaved}</p>
            <p className="font-serif text-3xl font-semibold text-[#34483D] tabular-nums mt-1">
              {bookmarks.length}
            </p>
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[#E9E2D5]">
          {(
            [
              ['overview', t.dashboard.tabOverview],
              ['roadmaps', `${t.dashboard.tabRoadmaps} (${roadmaps.length})`],
              ['calendar', `${t.dashboard.tabCalendar} (${deadlines.length})`],
              ['locker', `${t.dashboard.tabLocker} (${achievements.length})`],
              ['saved', `${t.dashboard.tabSaved} (${bookmarks.length})`],
              ['ai-history', `${t.dashboard.tabAiHistory} (${conversations.length})`],
              ['profile', t.dashboard.tabProfile],
            ] as [DashboardTab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => selectTab(id)}
              className={`px-4 py-2 text-sm font-medium border transition-colors ${
                activeTab === id
                  ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                  : 'bg-[#FCFBF7] text-[#30342F] border-[#D9CFC0] hover:border-[#34483D]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div ref={tabPanelRef} className="scroll-target">
        {/* ===================================================================
            TAB 1: OVERVIEW
           =================================================================== */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              {/* Saved Roadmaps Preview */}
              <section className="border border-[#D9CFC0] bg-[#FCFBF7] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl font-semibold text-[#34483D] flex items-center gap-2">
                    <Compass className="w-5 h-5" /> {t.dashboard.myRoadmapsHeading}
                  </h2>
                  <button
                    type="button"
                    onClick={() => (roadmaps.length > 0 ? selectTab('roadmaps') : onNavigate('roadmap'))}
                    className="text-xs font-medium text-[#34483D] hover:underline"
                  >
                    {roadmaps.length > 0 ? `${t.dashboard.viewAllRoadmaps} →` : `${t.dashboard.buildRoadmapLink} →`}
                  </button>
                </div>
                {roadmaps.length === 0 ? (
                  <div className="bg-[#F7F4EC] border border-[#E9E2D5] p-5 space-y-3">
                    <p className="text-sm font-medium text-[#34483D]">{eng.emptyRoadmapsTitle}</p>
                    <p className="text-xs text-[#5C625A] leading-relaxed">{eng.emptyRoadmapsDesc}</p>
                    <button
                      type="button"
                      onClick={() => onNavigate('roadmap')}
                      className="group inline-flex items-center gap-1.5 px-4 py-2 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] transition-colors"
                    >
                      <span>{t.dashboard.generateRoadmapCta}</span>
                      <ArrowRight className="w-3.5 h-3.5 editorial-arrow" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {roadmaps.slice(0, 2).map((rm) => {
                      const prog = getRoadmapProgress(rm);
                      return (
                        <div
                          key={rm.id}
                          className="border border-[#E9E2D5] bg-[#F7F4EC] p-4 space-y-3 editorial-card"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <p className="text-xs uppercase tracking-[0.1em] text-[#B87961]">
                                {rm.educationStage} · {rm.pathways.length} {eng.pathwaysWord}
                              </p>
                              <p className="font-serif text-lg font-semibold text-[#34483D]">
                                {rm.title}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => selectTab('roadmaps')}
                              className="text-xs font-medium text-[#34483D] hover:underline shrink-0 self-start sm:self-center"
                            >
                              {t.dashboard.openChecklist} →
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-[#5C625A] tabular-nums">
                              <span>
                                {prog.completed}/{prog.total} {t.dashboard.milestonesCompleted}
                              </span>
                              <span className="font-medium text-[#34483D]">{prog.pct}%</span>
                            </div>
                            <div className="h-1.5 bg-[#E9E2D5] w-full overflow-hidden">
                              <div
                                className="h-full bg-[#34483D] progress-fill"
                                style={{ width: `${prog.pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Next Deadlines */}
              <section className="border border-[#D9CFC0] bg-[#FCFBF7] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl font-semibold text-[#34483D] flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> {t.dashboard.upcomingDeadlinesHeading}
                  </h2>
                  <button
                    type="button"
                    onClick={() => selectTab('calendar')}
                    className="text-xs font-medium text-[#34483D] hover:underline"
                  >
                    {t.dashboard.manageCalendar} →
                  </button>
                </div>
                {upcomingDeadlines.length === 0 ? (
                  <div className="bg-[#F7F4EC] border border-[#E9E2D5] p-5 space-y-3">
                    <p className="text-sm font-medium text-[#34483D]">{eng.emptyDeadlinesTitle}</p>
                    <p className="text-xs text-[#5C625A] leading-relaxed">{eng.emptyDeadlinesDesc}</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => onNavigate('discover')}
                        className="px-3.5 py-2 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] transition-colors"
                      >
                        {eng.browseDiscoverCta}
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('tools')}
                        className="px-3.5 py-2 border border-[#34483D] text-[#34483D] text-xs font-medium hover:bg-[#E9E2D5] transition-colors"
                      >
                        {eng.openDecoderCta}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E9E2D5]">
                    {upcomingDeadlines.slice(0, 5).map((dl) => (
                      <div key={dl.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#30342F]">{dl.title}</p>
                          <p className="text-xs text-[#5C625A]">
                            {dl.category || t.dashboard.tabCalendar} · {eng.statusPrefix}:{' '}
                            {getDeadlineStatusLabel(dl.status)}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-[#B87961] tabular-nums shrink-0">
                          {dl.dueDate}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Saved Guides & Opportunities Preview */}
              <section className="border border-[#D9CFC0] bg-[#FCFBF7] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl font-semibold text-[#34483D] flex items-center gap-2">
                    <Bookmark className="w-5 h-5" /> {t.dashboard.savedItemsHeading}
                  </h2>
                  <button
                    type="button"
                    onClick={() => selectTab('saved')}
                    className="text-xs font-medium text-[#34483D] hover:underline"
                  >
                    {t.dashboard.viewAll} ({bookmarks.length}) →
                  </button>
                </div>
                {bookmarks.length === 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-[#5C625A]">{eng.emptySavedDesc}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(['after-class-10-pathways', 'scholarships-financial-assistance-india'] as const).map(
                        (slug) => {
                          const g = COMPLETE_GUIDES.find((item) => item.slug === slug);
                          if (!g) return null;
                          const meta = getGuideListMeta(g.slug, g.title, g.summary);
                          return (
                            <button
                              key={slug}
                              type="button"
                              onClick={() => onOpenGuide(slug)}
                              className="text-left border border-[#E9E2D5] bg-[#F7F4EC] p-3.5 editorial-card"
                            >
                              <p className="text-xs uppercase tracking-[0.1em] text-[#B87961]">
                                {eng.recommendedGuideTag}
                              </p>
                              <p className="text-sm font-medium text-[#34483D] mt-0.5">{meta.title}</p>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E9E2D5]">
                    {bookmarks.slice(0, 5).map((b) => (
                      <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.1em] text-[#B87961]">
                            {getBookmarkTypeLabel(b.itemType)}
                          </p>
                          <p className="text-sm font-medium text-[#30342F]">{b.title}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (b.itemType === 'guide') onOpenGuide(b.itemId);
                            else if (b.itemType === 'journey') onOpenJourney(b.itemId);
                            else onNavigate('discover');
                          }}
                          className="text-xs font-medium text-[#34483D] hover:underline shrink-0"
                        >
                          {t.common.open} →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Active Learning Progress */}
              <section className="border border-[#D9CFC0] bg-[#FCFBF7] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl font-semibold text-[#34483D]">
                    {t.dashboard.activeProgressHeading}
                  </h2>
                  <button
                    type="button"
                    onClick={() => onNavigate('pathways')}
                    className="text-xs font-medium text-[#34483D] hover:underline"
                  >
                    {t.dashboard.openJourneys} →
                  </button>
                </div>
                {learningProgress.length === 0 ? (
                  <div className="bg-[#F7F4EC] border border-[#E9E2D5] p-5 space-y-3">
                    <p className="text-sm font-medium text-[#34483D]">{eng.emptyProgressTitle}</p>
                    <p className="text-xs text-[#5C625A] leading-relaxed">{eng.emptyProgressDesc}</p>
                    <button
                      type="button"
                      onClick={() => onNavigate('pathways')}
                      className="px-3.5 py-2 border border-[#34483D] text-[#34483D] text-xs font-medium hover:bg-[#E9E2D5] transition-colors"
                    >
                      {eng.startFirstJourneyCta}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {learningProgress.slice(0, 6).map((lp) => {
                      const pct = Math.round(lp.percentComplete);
                      return (
                        <div key={lp.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                lp.itemType === 'guide'
                                  ? onOpenGuide(lp.itemId)
                                  : onOpenJourney(lp.itemId)
                              }
                              className="font-medium text-[#34483D] hover:underline text-left inline-flex items-center gap-1.5"
                            >
                              {pct >= 100 && (
                                <CheckCircle2 className="w-4 h-4 text-[#34483D] shrink-0" />
                              )}
                              <span>{lp.title}</span>
                            </button>
                            <span className="text-xs text-[#5C625A] tabular-nums shrink-0">
                              {pct}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-[#E9E2D5] w-full overflow-hidden">
                            <div
                              className="h-full bg-[#34483D] progress-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* Right Rail: Learning Momentum, Contextual Recommendations & Platform Pillars */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quiet Learning Momentum Summary */}
              {(completedGuideSlugs.size > 0 || activeJourneyCount > 0 || totalCheckedMilestones > 0) && (
                <section className="border border-[#8B9B83] bg-[#FCFBF7] p-6 space-y-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#B87961]">
                    {eng.overallProgressTitle}
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="border border-[#E9E2D5] bg-[#F7F4EC] p-3">
                      <p className="font-serif text-2xl font-semibold text-[#34483D] tabular-nums">
                        {completedGuideSlugs.size}
                      </p>
                      <p className="text-[11px] text-[#5C625A] mt-0.5">{eng.guidesCompletedLabel}</p>
                    </div>
                    <div className="border border-[#E9E2D5] bg-[#F7F4EC] p-3">
                      <p className="font-serif text-2xl font-semibold text-[#34483D] tabular-nums">
                        {activeJourneyCount}
                      </p>
                      <p className="text-[11px] text-[#5C625A] mt-0.5">{eng.journeysStartedLabel}</p>
                    </div>
                    <div className="border border-[#E9E2D5] bg-[#F7F4EC] p-3">
                      <p className="font-serif text-2xl font-semibold text-[#34483D] tabular-nums">
                        {totalCheckedMilestones}
                      </p>
                      <p className="text-[11px] text-[#5C625A] mt-0.5">{eng.milestonesCheckedLabel}</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Contextual Recommendations for the Student */}
              <section className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#B87961] inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> {eng.recommendedHeading}
                  </p>
                  <p className="text-xs text-[#5C625A] leading-relaxed">{eng.recommendedSubtitle}</p>
                </div>

                <div className="divide-y divide-[#E9E2D5] border-t border-[#E9E2D5]">
                  {recommendedItems.guides.map((g) => {
                    const meta = getGuideListMeta(g.slug, g.title, g.summary);
                    return (
                      <button
                        key={g.slug}
                        type="button"
                        onClick={() => onOpenGuide(g.slug)}
                        className="group w-full py-3.5 text-left flex items-start justify-between gap-3 hover:text-[#B87961] transition-colors"
                      >
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-[#B87961]">
                            {eng.recommendedGuideTag}
                          </p>
                          <p className="text-sm font-medium text-[#34483D] mt-0.5">{meta.title}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#34483D] shrink-0 mt-1 editorial-arrow" />
                      </button>
                    );
                  })}

                  {recommendedOpps.map((opp) => (
                    <a
                      key={opp.id}
                      href={opp.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group py-3.5 flex items-start justify-between gap-3 hover:text-[#B87961] transition-colors"
                    >
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-[#8B9B83]">
                          {eng.recommendedOppTag} · {getOppCategoryLabel(opp.category)}
                        </p>
                        <p className="text-sm font-medium text-[#34483D] mt-0.5">{opp.title}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#34483D] shrink-0 mt-1" />
                    </a>
                  ))}

                  {recommendedItems.journey && (
                    <button
                      type="button"
                      onClick={() => onOpenJourney(recommendedItems.journey.id)}
                      className="group w-full py-3.5 text-left flex items-start justify-between gap-3 hover:text-[#B87961] transition-colors"
                    >
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-[#B87961]">
                          {eng.recommendedPathwayTag}
                        </p>
                        <p className="text-sm font-medium text-[#34483D] mt-0.5">
                          {
                            getJourneyListMeta(
                              recommendedItems.journey.id,
                              recommendedItems.journey.title,
                              recommendedItems.journey.subtitle
                            ).title
                          }
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#34483D] shrink-0 mt-1 editorial-arrow" />
                    </button>
                  )}
                </div>
              </section>

              {/* Explore AGLA KADAM Pillars */}
              <section className="border border-[#D9CFC0] bg-[#E9E2D5]/50 p-6 space-y-4">
                <h2 className="font-serif text-xl font-semibold text-[#34483D]">
                  {t.dashboard.exploreHeading}
                </h2>
                {!studentProfile && (
                  <div className="bg-[#FCFBF7] border border-[#D9CFC0] p-4">
                    <p className="text-sm font-medium text-[#34483D]">{t.dashboard.completeProfileTitle}</p>
                    <p className="text-xs text-[#5C625A] mt-1">{t.dashboard.completeProfileDesc}</p>
                    <button
                      type="button"
                      onClick={() => selectTab('profile')}
                      className="group mt-3 text-xs font-medium text-[#34483D] hover:underline inline-flex items-center gap-1"
                    >
                      <span>{t.dashboard.setupProfileLink}</span>
                      <ArrowRight className="w-3.5 h-3.5 editorial-arrow" />
                    </button>
                  </div>
                )}
                <div className="bg-[#FCFBF7] border border-[#D9CFC0] p-4 space-y-2.5">
                  <p className="text-sm font-medium text-[#34483D]">{t.dashboard.pillarsReady}</p>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <button
                        type="button"
                        onClick={() => onNavigate('home')}
                        className="text-[#34483D] font-medium hover:underline"
                      >
                        {t.dashboard.pillarOverview} →
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => onNavigate('universe')}
                        className="text-[#34483D] font-medium hover:underline"
                      >
                        {t.dashboard.pillarUniverse} →
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => onNavigate('pathways')}
                        className="text-[#34483D] font-medium hover:underline"
                      >
                        {t.dashboard.pillarPathways} →
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => onNavigate('discover')}
                        className="text-[#34483D] font-medium hover:underline"
                      >
                        {t.dashboard.pillarDiscover} →
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => onNavigate('kadam-ai')}
                        className="text-[#34483D] font-medium hover:underline"
                      >
                        {t.dashboard.pillarAi} →
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => onNavigate('tools')}
                        className="text-[#B87961] font-medium hover:underline"
                      >
                        {t.dashboard.pillarTools} →
                      </button>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: SAVED ROADMAPS
           =================================================================== */}
        {activeTab === 'roadmaps' && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#34483D]">
                  {eng.savedRoadmapsTitle}
                </h2>
                <p className="text-sm text-[#5C625A]">{eng.savedRoadmapsDesc}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('roadmap')}
                className="px-4 py-2 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4" /> {eng.createNewRoadmapLabel}
              </button>
            </div>

            {roadmaps.length === 0 ? (
              <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-10 text-center space-y-4">
                <Compass className="w-8 h-8 text-[#8B9B83] mx-auto" />
                <div className="space-y-1.5">
                  <p className="font-serif text-xl text-[#34483D]">{eng.emptyRoadmapsTitle}</p>
                  <p className="text-sm text-[#5C625A] max-w-md mx-auto leading-relaxed">
                    {eng.emptyRoadmapsDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('roadmap')}
                  className="px-5 py-2.5 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] transition-colors"
                >
                  {t.dashboard.generateRoadmapCta}
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {roadmaps.map((rm) => {
                  const completedSet = new Set(rm.completedMilestones || []);
                  const prog = getRoadmapProgress(rm);
                  return (
                    <article key={rm.id} className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 sm:p-8 space-y-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E9E2D5] pb-5">
                        <div className="space-y-1.5 flex-1">
                          <p className="text-xs uppercase tracking-[0.12em] text-[#B87961]">
                            {rm.educationStage}
                          </p>
                          <h3 className="font-serif text-2xl font-semibold text-[#34483D]">
                            {rm.title}
                          </h3>
                          {rm.summary && (
                            <p className="text-sm text-[#5C625A] max-w-3xl">{rm.summary}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteRoadmap(rm.id)}
                          className="text-xs text-[#9B3B2B] hover:underline inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> {eng.deleteRoadmapLabel}
                        </button>
                      </div>

                      {/* Rewarding Roadmap Milestone Progress Bar */}
                      <div className="bg-[#F7F4EC] border border-[#E9E2D5] p-4 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-medium text-[#34483D] inline-flex items-center gap-1.5">
                            {prog.pct >= 100 && <CheckCircle2 className="w-4 h-4 text-[#34483D]" />}
                            {prog.pct >= 100 ? eng.allMilestonesComplete : eng.roadmapProgressLabel}
                          </span>
                          <span className="text-[#5C625A] tabular-nums">
                            <strong className="text-[#34483D]">
                              {prog.completed}/{prog.total}
                            </strong>{' '}
                            {eng.milestonesWord} · {prog.pct}%
                          </span>
                        </div>
                        <div className="h-2 bg-[#E9E2D5] w-full overflow-hidden">
                          <div
                            className="h-full bg-[#34483D] progress-fill"
                            style={{ width: `${prog.pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {rm.pathways.map((p) => (
                          <div
                            key={p.id}
                            className="border border-[#E9E2D5] bg-[#F7F4EC] p-5 flex flex-col justify-between gap-4"
                          >
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs uppercase tracking-[0.1em] text-[#B87961]">
                                  {p.trackLabel}
                                </p>
                                <h4 className="font-serif text-lg font-semibold text-[#34483D]">
                                  {p.title}
                                </h4>
                              </div>
                              <p className="text-xs text-[#5C625A] leading-relaxed">{p.whyItFits}</p>

                              <div>
                                <p className="text-xs font-medium text-[#34483D] mb-2">
                                  {eng.actionMilestonesLabel}
                                </p>
                                <ul className="space-y-2">
                                  {[...p.immediateActions, ...p.shortTermMilestones.slice(0, 2)].map(
                                    (step, idx) => {
                                      const key = `${p.id}_${idx}`;
                                      const done = completedSet.has(key);
                                      return (
                                        <li key={key}>
                                          <button
                                            type="button"
                                            onClick={() => toggleRoadmapMilestone(rm.id, key)}
                                            className="flex items-start gap-2 text-left text-xs text-[#30342F] hover:text-[#34483D] transition-colors"
                                          >
                                            {done ? (
                                              <CheckCircle2 className="w-4 h-4 text-[#34483D] shrink-0 mt-0.5" />
                                            ) : (
                                              <Circle className="w-4 h-4 text-[#8B9B83] shrink-0 mt-0.5" />
                                            )}
                                            <span className={done ? 'line-through text-[#5C625A]' : ''}>
                                              {step}
                                            </span>
                                          </button>
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-[#E9E2D5] flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => onExplainToParents(p.title)}
                                className="text-xs font-medium text-[#34483D] hover:underline inline-flex items-center gap-1"
                              >
                                <Users className="w-3.5 h-3.5" /> {t.common.explainToParents}
                              </button>
                              {p.recommendedGuideSlugs?.[0] && (
                                <button
                                  type="button"
                                  onClick={() => onOpenGuide(p.recommendedGuideSlugs[0])}
                                  className="text-xs text-[#B87961] hover:underline"
                                >
                                  {eng.openGuideLink} →
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ===================================================================
            TAB 3: OPPORTUNITY CALENDAR
           =================================================================== */}
        {activeTab === 'calendar' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 border border-[#D9CFC0] bg-[#FCFBF7] p-6">
              <h2 className="font-serif text-xl font-semibold text-[#34483D] mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" /> {t.dashboard.addDeadlineTitle}
              </h2>
              <form onSubmit={handleAddDeadline} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                    {t.dashboard.deadlineNamePlaceholder}
                  </label>
                  <input
                    type="text"
                    required
                    value={dlTitle}
                    onChange={(e) => setDlTitle(e.target.value)}
                    placeholder={t.dashboard.deadlineNamePlaceholder}
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                      {eng.categoryLabel}
                    </label>
                    <select
                      value={dlCategory}
                      onChange={(e) => setDlCategory(e.target.value)}
                      className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                    >
                      <option value="Examination">{eng.oppCategories.examination}</option>
                      <option value="Scholarship">{eng.oppCategories.scholarship}</option>
                      <option value="Internship">{eng.oppCategories.internship}</option>
                      <option value="Fellowship">{eng.oppCategories.fellowship}</option>
                      <option value="Admission">{eng.oppCategories.admission}</option>
                      <option value="Research">{eng.oppCategories.research}</option>
                      <option value="Other">{eng.oppCategories.other}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                      {t.dashboard.dueDateLabel}
                    </label>
                    <input
                      type="date"
                      required
                      value={dlDate}
                      onChange={(e) => setDlDate(e.target.value)}
                      className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm tabular-nums"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                    {t.dashboard.officialUrlLabel}
                  </label>
                  <input
                    type="url"
                    value={dlUrl}
                    onChange={(e) => setDlUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                    {t.dashboard.notesLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={dlNotes}
                    onChange={(e) => setDlNotes(e.target.value)}
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={dlSaving}
                  className="w-full py-2.5 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors disabled:opacity-60"
                >
                  {dlSaving ? eng.savingLabel : t.dashboard.addDeadlineBtn}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-serif text-2xl font-semibold text-[#34483D]">
                  {t.dashboard.calendarTitle}
                </h2>
                <p className="text-xs text-[#5C625A]">{eng.sortedNote}</p>
              </div>
              {deadlines.length === 0 ? (
                <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-8 space-y-4">
                  <Calendar className="w-7 h-7 text-[#8B9B83]" />
                  <div className="space-y-1">
                    <p className="font-serif text-xl text-[#34483D]">{eng.emptyDeadlinesTitle}</p>
                    <p className="text-sm text-[#5C625A] leading-relaxed">{eng.emptyDeadlinesDesc}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigate('discover')}
                      className="px-4 py-2 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] transition-colors"
                    >
                      {eng.browseDiscoverCta}
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('tools')}
                      className="px-4 py-2 border border-[#34483D] text-[#34483D] text-xs font-medium hover:bg-[#E9E2D5] transition-colors"
                    >
                      {eng.openDecoderCta}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {deadlines.map((dl) => {
                    const locked = dl.status === 'submitted';
                    return (
                      <div
                        key={dl.id}
                        className="border border-[#D9CFC0] bg-[#FCFBF7] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 editorial-card"
                      >
                        <div className="space-y-1">
                          <p className="text-xs text-[#5C625A]">
                            {dl.category || t.dashboard.tabCalendar} · {eng.duePrefix}{' '}
                            <span className="font-medium text-[#B87961] tabular-nums">{dl.dueDate}</span>
                          </p>
                          <h3 className="font-serif text-lg font-semibold text-[#34483D]">
                            {dl.title}
                          </h3>
                          {dl.notes && <p className="text-xs text-[#5C625A]">{dl.notes}</p>}
                          {dl.officialUrl && (
                            <a
                              href={dl.officialUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#34483D] hover:underline"
                            >
                              {t.common.officialPortal} <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {locked ? (
                            <span className="text-xs font-medium text-[#34483D] px-3 py-1.5 bg-[#E9E2D5]">
                              {eng.submittedLocked}
                            </span>
                          ) : (
                            <select
                              aria-label={`${eng.statusPrefix}: ${dl.title}`}
                              value={dl.status}
                              onChange={(e) =>
                                updateDeadlineStatus(
                                  dl.id,
                                  e.target.value as 'watching' | 'in_progress' | 'submitted'
                                )
                              }
                              className="border border-[#D9CFC0] bg-[#F7F4EC] px-2.5 py-1.5 text-xs text-[#30342F]"
                            >
                              <option value="watching">{t.dashboard.statusWatching}</option>
                              <option value="in_progress">{t.dashboard.statusInProgress}</option>
                              <option value="submitted">{t.dashboard.statusSubmitted}</option>
                            </select>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteDeadline(dl.id)}
                            aria-label={`${t.common.delete} ${dl.title}`}
                            className="p-1.5 text-[#5C625A] hover:text-[#9B3B2B]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ===================================================================
            TAB 4: ACHIEVEMENT LOCKER & GROWTH TIMELINE
           =================================================================== */}
        {activeTab === 'locker' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 border border-[#D9CFC0] bg-[#FCFBF7] p-6">
              <h2 className="font-serif text-xl font-semibold text-[#34483D] mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" /> {t.dashboard.addAchievementTitle}
              </h2>
              <form onSubmit={handleAddAchievement} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                    {t.dashboard.achievementTitleLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={achTitle}
                    onChange={(e) => setAchTitle(e.target.value)}
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                      {eng.categoryLabel}
                    </label>
                    <select
                      value={achCategory}
                      onChange={(e) =>
                        setAchCategory(e.target.value as AchievementRecord['category'])
                      }
                      className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-2.5 py-2 text-sm"
                    >
                      {ACHIEVEMENT_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {getAchievementCategoryLabel(c.value, c.fallback)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                      {t.dashboard.dateEarnedLabel}
                    </label>
                    <input
                      type="date"
                      required
                      value={achDate}
                      onChange={(e) => setAchDate(e.target.value)}
                      className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-2.5 py-2 text-sm tabular-nums"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                    {t.dashboard.issuerLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={achIssuer}
                    onChange={(e) => setAchIssuer(e.target.value)}
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                    {t.dashboard.skillsLabel}
                  </label>
                  <input
                    type="text"
                    value={achSkills}
                    onChange={(e) => setAchSkills(e.target.value)}
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                    {eng.verificationLinkOptional}
                  </label>
                  <input
                    type="url"
                    value={achUrl}
                    onChange={(e) => setAchUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                    {t.dashboard.reflectionLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={achReflection}
                    onChange={(e) => setAchReflection(e.target.value)}
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={achSaving}
                  className="w-full py-2.5 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors disabled:opacity-60"
                >
                  {achSaving ? eng.savingLabel : t.dashboard.addAchievementBtn}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#34483D]">
                    {lockerMode === 'locker' ? t.dashboard.lockerTitle : t.dashboard.timelineView}
                  </h2>
                  <p className="text-xs text-[#5C625A]">{t.dashboard.lockerDesc}</p>
                </div>
                <div className="inline-flex border border-[#D9CFC0] bg-[#FCFBF7]">
                  <button
                    type="button"
                    onClick={() => setLockerMode('locker')}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      lockerMode === 'locker'
                        ? 'bg-[#34483D] text-[#F7F4EC]'
                        : 'text-[#30342F] hover:bg-[#E9E2D5]'
                    }`}
                  >
                    {t.dashboard.lockerView}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLockerMode('timeline')}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      lockerMode === 'timeline'
                        ? 'bg-[#34483D] text-[#F7F4EC]'
                        : 'text-[#30342F] hover:bg-[#E9E2D5]'
                    }`}
                  >
                    {t.dashboard.timelineView}
                  </button>
                </div>
              </div>

              {achievements.length === 0 ? (
                <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-8 space-y-3">
                  <Award className="w-7 h-7 text-[#8B9B83]" />
                  <p className="font-serif text-xl text-[#34483D]">{eng.emptyLockerTitle}</p>
                  <p className="text-sm text-[#5C625A] leading-relaxed">{eng.emptyLockerDesc}</p>
                </div>
              ) : lockerMode === 'locker' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((a) => (
                    <div
                      key={a.id}
                      className="border border-[#D9CFC0] bg-[#FCFBF7] p-5 flex flex-col justify-between gap-3 editorial-card"
                    >
                      <div className="space-y-1.5">
                        <p className="text-xs text-[#5C625A]">
                          {getAchievementCategoryLabel(a.category, a.category)} ·{' '}
                          <span className="tabular-nums">{a.dateEarned}</span>
                        </p>
                        <h3 className="font-serif text-lg font-semibold text-[#34483D]">{a.title}</h3>
                        <p className="text-xs font-medium text-[#30342F]">{a.issuer}</p>
                        {a.reflection && (
                          <p className="text-xs text-[#5C625A] leading-relaxed">{a.reflection}</p>
                        )}
                        {a.skills && a.skills.length > 0 && (
                          <p className="text-xs text-[#B87961] pt-1">
                            {a.skills.join(' · ')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-[#E9E2D5]">
                        {a.verificationUrl ? (
                          <a
                            href={a.verificationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-medium text-[#34483D] hover:underline inline-flex items-center gap-1"
                          >
                            {eng.verifyLinkLabel} <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-[#5C625A]">{eng.personalRecordLabel}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteAchievement(a.id)}
                          className="text-xs text-[#5C625A] hover:text-[#9B3B2B]"
                          aria-label={`${t.common.delete} ${a.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-l border-[#D9CFC0] pl-6 space-y-6 ml-2">
                  {achievements.map((a) => (
                    <div key={a.id} className="relative border border-[#D9CFC0] bg-[#FCFBF7] p-5">
                      <span className="absolute -left-[29px] top-6 w-2.5 h-2.5 bg-[#34483D]" />
                      <p className="text-xs uppercase tracking-[0.12em] text-[#B87961] tabular-nums">
                        {a.dateEarned} · {getAchievementCategoryLabel(a.category, a.category)}
                      </p>
                      <h3 className="font-serif text-lg font-semibold text-[#34483D] mt-1">
                        {a.title}
                      </h3>
                      <p className="text-xs text-[#30342F] mt-0.5">{a.issuer}</p>
                      {a.reflection && (
                        <p className="text-sm text-[#5C625A] mt-2 leading-relaxed">{a.reflection}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ===================================================================
            TAB 5: SAVED BOOKMARKS & LEARNING PROGRESS
           =================================================================== */}
        {activeTab === 'saved' && (
          <section className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-semibold text-[#34483D] flex items-center gap-2">
                <Bookmark className="w-5 h-5" /> {eng.savedLibraryTitle}
              </h2>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ['all', t.dashboard.allSaved],
                    ['guide', t.dashboard.guidesFilter],
                    ['journey', t.dashboard.journeysFilter],
                    ['opportunity', t.dashboard.opportunitiesFilter],
                    ['university', t.dashboard.universitiesFilter],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSavedFilter(key)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                      savedFilter === key
                        ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                        : 'bg-[#FCFBF7] text-[#30342F] border-[#D9CFC0] hover:border-[#34483D]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {filteredBookmarks.length === 0 ? (
              <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-8 sm:p-10 text-center space-y-4">
                <BookOpen className="w-7 h-7 text-[#8B9B83] mx-auto" />
                <div className="space-y-1">
                  <p className="font-serif text-xl text-[#34483D]">{eng.emptySavedTitle}</p>
                  <p className="text-sm text-[#5C625A] max-w-md mx-auto leading-relaxed">
                    {eng.emptySavedDesc}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('universe')}
                    className="px-4 py-2 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] transition-colors"
                  >
                    {eng.browseUniverseCta}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('discover')}
                    className="px-4 py-2 border border-[#34483D] text-[#34483D] text-xs font-medium hover:bg-[#E9E2D5] transition-colors"
                  >
                    {eng.browseDiscoverCta}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBookmarks.map((b) => (
                  <div
                    key={b.id}
                    className="border border-[#D9CFC0] bg-[#FCFBF7] p-5 flex flex-col justify-between gap-4 editorial-card"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-[#B87961]">
                        {getBookmarkTypeLabel(b.itemType)}
                        {b.category ? ` · ${b.category}` : ''}
                      </p>
                      <h3 className="font-serif text-lg font-semibold text-[#34483D] mt-1">
                        {b.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#E9E2D5]">
                      <button
                        type="button"
                        onClick={() => {
                          if (b.itemType === 'guide') onOpenGuide(b.itemId);
                          else if (b.itemType === 'journey') onOpenJourney(b.itemId);
                          else onNavigate('discover');
                        }}
                        className="text-xs font-medium text-[#34483D] hover:underline"
                      >
                        {t.common.open} →
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toggleBookmark({
                            itemType: b.itemType,
                            itemId: b.itemId,
                            title: b.title,
                            category: b.category,
                          })
                        }
                        className="text-xs text-[#5C625A] hover:text-[#9B3B2B]"
                      >
                        {eng.removeLabel}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ===================================================================
            TAB 6: KADAM AI HISTORY
           =================================================================== */}
        {activeTab === 'ai-history' && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#34483D] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> {t.dashboard.savedConversationsTitle}
                </h2>
                <p className="text-sm text-[#5C625A]">{t.dashboard.savedConversationsDesc}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('kadam-ai')}
                className="px-4 py-2 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors"
              >
                {t.home.openKadamAiBtn}
              </button>
            </div>

            {conversations.length === 0 ? (
              <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-8 sm:p-10 text-center space-y-4">
                <MessageSquare className="w-7 h-7 text-[#8B9B83] mx-auto" />
                <div className="space-y-1">
                  <p className="font-serif text-xl text-[#34483D]">{eng.emptyAiTitle}</p>
                  <p className="text-sm text-[#5C625A] max-w-md mx-auto leading-relaxed">
                    {eng.emptyAiDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onAskKadamAi
                      ? onNavigate('kadam-ai')
                      : onNavigate('kadam-ai')
                  }
                  className="px-5 py-2.5 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] transition-colors"
                >
                  {eng.askFirstQuestionCta}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((conv) => (
                  <div key={conv.id} className="border border-[#D9CFC0] bg-[#FCFBF7] p-5 editorial-card">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-[#5C625A]">
                          {getLanguageNativeName(conv.language)} · {conv.messages.length}{' '}
                          {t.dashboard.messagesCount}
                        </p>
                        <h3 className="font-serif text-lg font-semibold text-[#34483D] mt-0.5">
                          {conv.title}
                        </h3>
                        {conv.messages[conv.messages.length - 1] && (
                          <p className="text-xs text-[#5C625A] mt-2 line-clamp-2">
                            {conv.messages[conv.messages.length - 1].content}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteConversation(conv.id)}
                        className="text-xs text-[#5C625A] hover:text-[#9B3B2B] inline-flex items-center gap-1 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> {t.common.delete}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ===================================================================
            TAB 7: PROFILE & PRIVACY CONTROLS
           =================================================================== */}
        {activeTab === 'profile' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 border border-[#D9CFC0] bg-[#FCFBF7] p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-semibold text-[#34483D] mb-1 flex items-center gap-2">
                <User className="w-5 h-5" /> {t.dashboard.studentProfileTitle}
              </h2>
              <p className="text-sm text-[#5C625A] mb-6">{t.dashboard.studentProfileDesc}</p>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                      {t.dashboard.eduLevelLabel}
                    </label>
                    <input
                      type="text"
                      value={profileForm.educationLevel}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, educationLevel: e.target.value }))
                      }
                      className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                      {t.dashboard.streamDisciplineLabel}
                    </label>
                    <input
                      type="text"
                      value={profileForm.stream}
                      onChange={(e) => setProfileForm((p) => ({ ...p, stream: e.target.value }))}
                      className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                      {t.dashboard.locationLabel}
                    </label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm((p) => ({ ...p, location: e.target.value }))}
                      className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                      {t.dashboard.budgetLabel}
                    </label>
                    <input
                      type="text"
                      value={profileForm.budgetRange}
                      onChange={(e) => setProfileForm((p) => ({ ...p, budgetRange: e.target.value }))}
                      className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                    {t.dashboard.interestsLabel}
                  </label>
                  <input
                    type="text"
                    value={interestsInput}
                    onChange={(e) => setInterestsInput(e.target.value)}
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                    {t.dashboard.strengthsLabel}
                  </label>
                  <input
                    type="text"
                    value={strengthsInput}
                    onChange={(e) => setStrengthsInput(e.target.value)}
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#5C625A] mb-1">
                    {t.dashboard.goalsLabel}
                  </label>
                  <input
                    type="text"
                    value={goalsInput}
                    onChange={(e) => setGoalsInput(e.target.value)}
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3 py-2 text-sm"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors"
                  >
                    {t.dashboard.saveProfileBtn}
                  </button>
                  {profileSavedToast && (
                    <span className="text-xs font-medium text-[#34483D] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t.dashboard.profileSavedToast}
                    </span>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-5 space-y-6">
              {/* Preferred Language Settings Card */}
              <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 sm:p-8 space-y-4">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#34483D] flex items-center gap-2">
                    <Globe className="w-5 h-5" /> {t.dashboard.preferredLanguageTitle}
                  </h2>
                  <p className="text-sm text-[#5C625A] mt-1.5 leading-relaxed">
                    {t.dashboard.preferredLanguageDesc}
                  </p>
                </div>
                <LanguageSelector showIcon ariaLabel={t.common.languageLabel} />
              </div>

              {/* Privacy & Data Control */}
              <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#34483D] flex items-center gap-2">
                    <Shield className="w-5 h-5" /> {t.dashboard.privacyTitle}
                  </h2>
                  <p className="text-sm text-[#5C625A] mt-2 leading-relaxed">
                    {t.dashboard.privacyDesc}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-[#E9E2D5]">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="w-full py-2.5 px-4 border border-[#34483D] text-[#34483D] text-sm font-medium hover:bg-[#E9E2D5] transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> {t.dashboard.exportJsonBtn}
                  </button>

                  {!confirmClearAi ? (
                    <button
                      type="button"
                      disabled={conversations.length === 0}
                      onClick={() => setConfirmClearAi(true)}
                      className="w-full py-2.5 px-4 border border-[#E5BFB2] text-[#9B3B2B] text-sm font-medium hover:bg-[#FBF2EE] transition-colors disabled:opacity-50"
                    >
                      {t.dashboard.clearAiHistoryBtn} ({conversations.length})
                    </button>
                  ) : (
                    <div className="border border-[#E5BFB2] bg-[#FBF2EE] p-4 space-y-3">
                      <p className="text-xs text-[#9B3B2B]">
                        {t.dashboard.confirmDeleteAiPrompt} ({conversations.length})
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={clearingAi}
                          onClick={handleClearAllAi}
                          className="px-3 py-1.5 text-xs font-medium bg-[#9B3B2B] text-white"
                        >
                          {clearingAi ? t.common.deleting : t.dashboard.confirmDeleteBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmClearAi(false)}
                          className="px-3 py-1.5 text-xs border border-[#D9CFC0] bg-white text-[#30342F]"
                        >
                          {t.common.cancel}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
