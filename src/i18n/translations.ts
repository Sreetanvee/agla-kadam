import type { LanguageCode } from '../types/domain';

export const LANGUAGE_OPTIONS: { code: LanguageCode; nativeLabel: string; shortLabel: string }[] = [
  { code: 'en', nativeLabel: 'English', shortLabel: 'EN' },
  { code: 'te', nativeLabel: 'తెలుగు', shortLabel: 'తెలుగు' },
  { code: 'hi', nativeLabel: 'हिन्दी', shortLabel: 'हिन्दी' },
];

export interface TranslationDictionary {
  common: {
    brand: string;
    tagline: string;
    taglineSpaced: string;
    loadingWorkspace: string;
    signOut: string;
    save: string;
    saved: string;
    cancel: string;
    delete: string;
    deleting: string;
    clear: string;
    resetFilters: string;
    back: string;
    continue: string;
    open: string;
    officialSite: string;
    officialPortal: string;
    listen: string;
    stopAudio: string;
    copy: string;
    copied: string;
    printPdf: string;
    translatingContent: string;
    translationError: string;
    retryTranslation: string;
    allStages: string;
    allCategories: string;
    allTracks: string;
    allStatuses: string;
    completeGuide: string;
    scheduled: string;
    batch: string;
    verified: string;
    minRead: string;
    savedToDashboard: string;
    saveGuide: string;
    markCompleted: string;
    completed: string;
    askKadamAi: string;
    explainToParents: string;
    languageLabel: string;
  };
  nav: {
    dashboard: string;
    universe: string;
    pathways: string;
    discover: string;
    roadmap: string;
    kadamAi: string;
    tools: string;
    exploreOverview: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    mission: string;
    exploreHeading: string;
    studentDashboard: string;
    platformOverview: string;
    universeLink: string;
    pathwaysLink: string;
    discoverLink: string;
    verificationHeading: string;
    verificationBody: string;
    copyright: string;
    batchInfo: string;
  };
  auth: {
    indiaAllStages: string;
    kicker: string;
    headline: string;
    subtitle: string;
    highlight1Title: string;
    highlight1Desc: string;
    highlight2Title: string;
    highlight2Desc: string;
    highlight3Title: string;
    highlight3Desc: string;
    protectedFooter: string;
    stagesFooter: string;
    signInKicker: string;
    welcomeBack: string;
    signInDesc: string;
    signUpKicker: string;
    beginNextStep: string;
    signUpDesc: string;
    backToSignIn: string;
    recoveryKicker: string;
    resetPasswordTitle: string;
    resetPasswordDesc: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    forgotPasswordLink: string;
    showPassword: string;
    hidePassword: string;
    signInBtn: string;
    signingInBtn: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    newPasswordPlaceholder: string;
    passwordHint: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    createAccountBtn: string;
    creatingAccountBtn: string;
    resetSentTitle: string;
    resetSentDescBefore: string;
    resetSentDescAfter: string;
    returnToSignIn: string;
    sendResetBtn: string;
    sendingResetBtn: string;
    orDivider: string;
    continueGoogle: string;
    newToApp: string;
    createAnAccount: string;
    alreadyHaveAccount: string;
    signInLink: string;
    rememberedPassword: string;
    privacyNote: string;
    errInvalidEmail: string;
    errMissingPassword: string;
    errShortName: string;
    errShortPassword: string;
    errPasswordMismatch: string;
    errResetEmail: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    exploreBtn: string;
    tryAsking: string;
    samples: string[];
    instantMatchesFor: string;
    universeTopicsHeading: string;
    discoverOppsHeading: string;
    noExactMatch: string;
    wantPlainAnswer: string;
    askKadamAbout: string;
    buildRoadmapBtn: string;
    openMapBtn: string;
    askKadamLanguages: string;
    fig1Caption: string;
    stat1Label: string;
    stat2Label: string;
    stat3Label: string;
    stat4Value: string;
    stat4Label: string;
    startKicker: string;
    startTitle: string;
    startDesc: string;
    possibilityMapCta: string;
    readGuidesCta: string;
    pillar1Kicker: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar1Caption: string;
    browseAllTopics: string;
    pillar2Kicker: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar2Caption: string;
    exploreMapBtn: string;
    generateRoadmapBtn: string;
    pillar3Kicker: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar3Caption: string;
    openDiscoverBtn: string;
    exploreJourneysBtn: string;
    nobodyToldKicker: string;
    nobodyToldTitle: string;
    runGapDetector: string;
    demoCycleNote: string;
    aiBannerKicker: string;
    aiBannerTitle: string;
    aiBannerDesc: string;
    openKadamAiBtn: string;
    decodeDocBtn: string;
  };
  universe: {
    kicker: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    categoryLabel: string;
    all18Categories: string;
    stageLabel: string;
    statusLabel: string;
    completeOnly: string;
    scheduledOnly: string;
    showingTopics: string;
    inCategory: string;
    noMatchTitle: string;
    noMatchDesc: string;
    resetAllFilters: string;
    askAiAboutQuery: string;
    backToUniverse: string;
    all150Topics: string;
    topicNotFound: string;
    scheduledForBatch: string;
    whyScheduledTitle: string;
    whyScheduledBody: string;
    getAiBriefing: string;
    readBatch1Guides: string;
    depthLabel: string;
    depthBeginner: string;
    depthIntermediate: string;
    depthAdvanced: string;
    secOverview: string;
    secWhatItIs: string;
    secWhyItExists: string;
    secWhoNeedsIt: string;
    secHowItWorks: string;
    secTypesPathways: string;
    secEligibility: string;
    secDocuments: string;
    secSteps: string;
    secWhatNext: string;
    secBenefits: string;
    secRisksCosts: string;
    secMistakes: string;
    secFaqs: string;
    secOfficialPortals: string;
    secRelatedGuides: string;
    onThisPage: string;
    askAiOnGuide: string;
    stepLabel: string;
    verifiedPortalNote: string;
  };
  pathways: {
    kicker: string;
    title: string;
    subtitle: string;
    tabMap: string;
    tabJourneys: string;
    step1Label: string;
    step1BLabel: string;
    step2TrackLabel: string;
    selectedCount: string;
    compareSelected: string;
    hideComparison: string;
    clearCompare: string;
    comparisonHeading: string;
    availablePathways: string;
    allPathwaysMobile: string;
    compareToggleAdd: string;
    compareToggleAdded: string;
    eligibilityLabel: string;
    durationLabel: string;
    examsLabel: string;
    costLabel: string;
    institutionsLabel: string;
    scholarshipsLabel: string;
    outcomesLabel: string;
    alternativesLabel: string;
    realityLabel: string;
    readFullGuide: string;
    selectJourneyMobile: string;
    journeyOverview: string;
    targetAudience: string;
    estimatedHorizon: string;
    stagesCompleted: string;
    stagePrerequisites: string;
    stageDecisions: string;
    stageDocuments: string;
    stageNextActions: string;
    linkedGuides: string;
    officialReferences: string;
    saveJourney: string;
    journeySaved: string;
  };
  discover: {
    kicker: string;
    title: string;
    subtitle: string;
    tabOpportunities: string;
    tabUniversities: string;
    verificationStandardLabel: string;
    verificationStandardBody: string;
    oppSearchPlaceholder: string;
    lesserKnownToggle: string;
    showingOpportunities: string;
    noOppsTitle: string;
    noOppsDesc: string;
    whatNobodyTellsYou: string;
    eligibility: string;
    benefits: string;
    cycleWindow: string;
    demoEntry: string;
    verifiedPortal: string;
    addToCalendar: string;
    addedToCalendar: string;
    share: string;
    shared: string;
    uniSearchPlaceholder: string;
    allInstitutionTypes: string;
    showingUniversities: string;
    noUnisTitle: string;
    noUnisDesc: string;
    established: string;
    notableCourses: string;
    entranceExams: string;
    admissionProcess: string;
    feeNote: string;
    scholarshipNote: string;
  };
  roadmap: {
    kicker: string;
    title: string;
    subtitle: string;
    step1Tab: string;
    step2Tab: string;
    step3Tab: string;
    step4Tab: string;
    stepCounter: string;
    eduStageLabel: string;
    streamLabel: string;
    streamPlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    destLabel: string;
    destPlaceholder: string;
    budgetLabel: string;
    interestsLabel: string;
    interestsPlaceholder: string;
    strengthsLabel: string;
    strengthsPlaceholder: string;
    goalsLabel: string;
    goalsPlaceholder: string;
    tracksPrompt: string;
    generateBtn: string;
    generatingBtn: string;
    aiPlanKicker: string;
    detailedViewBtn: string;
    compareAllBtn: string;
    saveRoadmapBtn: string;
    optionLabel: string;
    pathwayLabel: string;
    inspectMilestones: string;
    immediateHorizon: string;
    shortTermHorizon: string;
    longTermHorizon: string;
    requiredQualifications: string;
    keyExaminations: string;
    skillsToBuild: string;
    estimatedCost: string;
    possibleInstitutions: string;
    opportunitiesToWatch: string;
    risksAlternatives: string;
    verifiedGuidesHeading: string;
    immediateNextStep: string;
    keyRiskAlternative: string;
  };
  kadamAi: {
    kicker: string;
    title: string;
    subtitle: string;
    noStupidMode: string;
    newConversation: string;
    savedConversations: string;
    noConversations: string;
    welcomeTitle: string;
    welcomeSubtitle: string;
    youLabel: string;
    assistantHeader: string;
    citedGuidesHeading: string;
    thinkingText: string;
    recordingPlaceholder: string;
    inputPlaceholder: string;
    sendBtn: string;
    voiceStartTitle: string;
    voiceStopTitle: string;
    starters: string[];
  };
  tools: {
    kicker: string;
    title: string;
    subtitle: string;
    outputLanguage: string;
    tabDecoder: string;
    tabParents: string;
    tabGap: string;
    tabWhatCanIDo: string;
    tabReality: string;
    decoderTitle: string;
    decoderDesc: string;
    privacyTitle: string;
    privacyBody: string;
    decodingWhat: string;
    modeNotification: string;
    modeDocument: string;
    uploadLabel: string;
    chooseFile: string;
    chooseFileHint: string;
    pasteLabel: string;
    pastePlaceholder: string;
    decodeBtn: string;
    decodingBtn: string;
    whatYouReceive: string;
    zeroJargonTitle: string;
    receiveItems: string[];
    readingClauses: string;
    extractingSub: string;
    aiDecodedKicker: string;
    plainSummary: string;
    importantDates: string;
    eligibilityHighlights: string;
    requiredDocuments: string;
    feesClauses: string;
    stepByStepActions: string;
    risksRedFlags: string;
    parentsTitle: string;
    parentsDesc: string;
    pathwayInputLabel: string;
    pathwayPlaceholder: string;
    stageSelectLabel: string;
    concernsLabel: string;
    concernsPlaceholder: string;
    generateBriefBtn: string;
    generatingBriefBtn: string;
    respectfulClarity: string;
    tryCommonTopic: string;
    draftingBrief: string;
    familyBriefKicker: string;
    execSummary: string;
    whatInvolves: string;
    durationTimeline: string;
    realisticCost: string;
    careerOutlook: string;
    eligibilityExams: string;
    honestRisks: string;
    howParentsSupport: string;
    specialRunBtn: string;
    specialRunningBtn: string;
    whyItMatters: string;
    realityChallenges: string;
    immediateStep: string;
    relatedVerifiedGuides: string;
    curatedLesserKnown: string;
  };
  dashboard: {
    kicker: string;
    welcomePrefix: string;
    kpiRoadmaps: string;
    kpiDeadlines: string;
    kpiAchievements: string;
    kpiSaved: string;
    tabOverview: string;
    tabRoadmaps: string;
    tabCalendar: string;
    tabLocker: string;
    tabSaved: string;
    tabAiHistory: string;
    tabProfile: string;
    myRoadmapsHeading: string;
    viewAllRoadmaps: string;
    buildRoadmapLink: string;
    noRoadmapTitle: string;
    noRoadmapDesc: string;
    generateRoadmapCta: string;
    milestonesCompleted: string;
    openChecklist: string;
    upcomingDeadlinesHeading: string;
    manageCalendar: string;
    noDeadlinesText: string;
    savedItemsHeading: string;
    viewAll: string;
    noBookmarksHint: string;
    activeProgressHeading: string;
    openJourneys: string;
    noProgressHint: string;
    exploreHeading: string;
    completeProfileTitle: string;
    completeProfileDesc: string;
    setupProfileLink: string;
    pillarsReady: string;
    pillarOverview: string;
    pillarUniverse: string;
    pillarPathways: string;
    pillarDiscover: string;
    pillarAi: string;
    pillarTools: string;
    savedConversationsTitle: string;
    savedConversationsDesc: string;
    messagesCount: string;
    noConversationsYet: string;
    studentProfileTitle: string;
    studentProfileDesc: string;
    eduLevelLabel: string;
    streamDisciplineLabel: string;
    locationLabel: string;
    budgetLabel: string;
    interestsLabel: string;
    strengthsLabel: string;
    goalsLabel: string;
    saveProfileBtn: string;
    profileSavedToast: string;
    privacyTitle: string;
    privacyDesc: string;
    exportJsonBtn: string;
    clearAiHistoryBtn: string;
    confirmDeleteAiPrompt: string;
    confirmDeleteBtn: string;
    preferredLanguageTitle: string;
    preferredLanguageDesc: string;
    calendarTitle: string;
    calendarDesc: string;
    addDeadlineTitle: string;
    deadlineNamePlaceholder: string;
    dueDateLabel: string;
    officialUrlLabel: string;
    notesLabel: string;
    addDeadlineBtn: string;
    statusWatching: string;
    statusInProgress: string;
    statusSubmitted: string;
    lockerTitle: string;
    lockerDesc: string;
    lockerView: string;
    timelineView: string;
    addAchievementTitle: string;
    achievementTitleLabel: string;
    issuerLabel: string;
    dateEarnedLabel: string;
    reflectionLabel: string;
    skillsLabel: string;
    addAchievementBtn: string;
    noAchievementsYet: string;
    allSaved: string;
    guidesFilter: string;
    opportunitiesFilter: string;
    universitiesFilter: string;
    journeysFilter: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    common: {
      brand: 'AGLA KADAM',
      tagline: 'Your next step. Your future. Your choice.',
      taglineSpaced: 'Your next step · Your future · Your choice',
      loadingWorkspace: 'Loading your workspace...',
      signOut: 'Sign Out',
      save: 'Save',
      saved: 'Saved',
      cancel: 'Cancel',
      delete: 'Delete',
      deleting: 'Deleting...',
      clear: 'Clear',
      resetFilters: 'Reset Filters',
      back: 'Back',
      continue: 'Continue',
      open: 'Open',
      officialSite: 'Official site',
      officialPortal: 'Official Portal',
      listen: 'Listen',
      stopAudio: 'Stop Audio',
      copy: 'Copy',
      copied: 'Copied',
      printPdf: 'Print / Save PDF',
      translatingContent: 'Loading full explanation in your selected language...',
      translationError: 'Showing verified English text while translation reconnects.',
      retryTranslation: 'Retry translation',
      allStages: 'All Stages',
      allCategories: 'All Categories',
      allTracks: 'All Tracks',
      allStatuses: 'All Statuses',
      completeGuide: 'Complete Guide',
      scheduled: 'Scheduled',
      batch: 'Batch',
      verified: 'Verified',
      minRead: 'min read',
      savedToDashboard: 'Saved to Dashboard',
      saveGuide: 'Save Guide',
      markCompleted: 'Mark as Read',
      completed: 'Completed',
      askKadamAi: 'Ask Kadam AI',
      explainToParents: 'Explain to My Parents',
      languageLabel: 'Language',
    },
    nav: {
      dashboard: 'Dashboard',
      universe: 'Universe',
      pathways: 'Pathways',
      discover: 'Discover',
      roadmap: 'My Next Kadam',
      kadamAi: 'Kadam AI',
      tools: 'Tools',
      exploreOverview: 'Explore Overview',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
    },
    footer: {
      mission:
        'Built so no student in India misses an educational, financial, research, or career opportunity simply because nobody told them it existed.',
      exploreHeading: 'Explore',
      studentDashboard: 'Student Dashboard',
      platformOverview: 'Platform Overview',
      universeLink: 'The Agla Kadam Universe',
      pathwaysLink: 'Possibility Map & Journeys',
      discoverLink: 'Kadam Discover',
      verificationHeading: 'Verification & Privacy Standard',
      verificationBody:
        'Verified guides show their last-verified date and link directly to official institutional or government portals. Always confirm live exam dates, eligibility changes, and fees on official notices before applying. Uploaded documents in the Decoder are analyzed in memory and never stored.',
      copyright: 'AGLA KADAM. Educational guidance & opportunity discovery.',
      batchInfo: 'Batch 1 Verified Library (15 complete guides · 150-topic index across 18 categories)',
    },
    auth: {
      indiaAllStages: 'India · All Student Stages',
      kicker: 'Educational Guidance & Opportunity Discovery',
      headline: 'No student should miss an opportunity simply because nobody told them it existed.',
      subtitle:
        'From Class 10 decisions and national scholarships to research papers, patents, higher studies, and career pathways—explore verified guides, personal roadmaps, and Kadam AI in English, తెలుగు, and हिन्दी.',
      highlight1Title: 'The Agla Kadam Universe',
      highlight1Desc: '150 indexed topics across 18 categories with official government & institutional links.',
      highlight2Title: 'My Next Kadam & Kadam AI',
      highlight2Desc: 'Personalised multi-pathway roadmaps, document decoder, and voice-first mentoring.',
      highlight3Title: 'Private Student Workspace',
      highlight3Desc: 'Save guides, track exam deadlines, and build your personal Achievement Locker.',
      protectedFooter: 'Protected by Firebase Authentication & private per-student security rules',
      stagesFooter: 'School · UG · PG · Research · Early Career',
      signInKicker: 'Student Sign In',
      welcomeBack: 'Welcome back',
      signInDesc:
        'Sign in to open your AGLA KADAM dashboard, saved roadmaps, bookmarks, and upcoming opportunity deadlines.',
      signUpKicker: 'New Student Registration',
      beginNextStep: 'Begin your next step',
      signUpDesc:
        'Create your free AGLA KADAM account to save personalised roadmaps, track deadlines, and build your growth timeline.',
      backToSignIn: 'Back to Sign In',
      recoveryKicker: 'Account Recovery',
      resetPasswordTitle: 'Reset your password',
      resetPasswordDesc:
        'Enter your registered email address and we will send a secure password reset link via Firebase Authentication.',
      emailLabel: 'Email Address',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      forgotPasswordLink: 'Forgot password?',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      signInBtn: 'Sign In',
      signingInBtn: 'Signing in...',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'e.g., Ananya Sharma',
      newPasswordPlaceholder: 'Minimum 8 characters',
      passwordHint: 'Use at least 8 characters combining letters and numbers.',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter your password',
      createAccountBtn: 'Create Account',
      creatingAccountBtn: 'Creating account...',
      resetSentTitle: 'Password reset email sent',
      resetSentDescBefore: 'If an AGLA KADAM account exists for',
      resetSentDescAfter:
        'you will receive a password reset link shortly. Please also check your spam or promotions folder.',
      returnToSignIn: 'Return to Sign In',
      sendResetBtn: 'Send Password Reset Link',
      sendingResetBtn: 'Sending reset link...',
      orDivider: 'or',
      continueGoogle: 'Continue with Google',
      newToApp: 'New to AGLA KADAM?',
      createAnAccount: 'Create an account',
      alreadyHaveAccount: 'Already have an account?',
      signInLink: 'Sign in',
      rememberedPassword: 'Remembered your password?',
      privacyNote:
        'Your saved roadmaps, deadlines, and achievements stay private to your account. Documents decoded in our tools are analyzed in memory and never stored.',
      errInvalidEmail: 'Please enter a valid email address.',
      errMissingPassword: 'Please enter your password.',
      errShortName: 'Please enter your full name (at least 2 characters).',
      errShortPassword: 'Password must be at least 8 characters long.',
      errPasswordMismatch: 'Passwords do not match. Please re-enter your confirmation password.',
      errResetEmail: 'Please enter the email address associated with your account.',
    },
    home: {
      heroTitle: 'Your future has more possibilities than you think.',
      heroSubtitle:
        'Millions of students miss examinations, scholarships, research labs, patents, and careers simply because nobody told them they existed. AGLA KADAM reveals verified options from absolute zero—so every choice belongs to you.',
      searchPlaceholder: 'What have you always wanted to know?',
      exploreBtn: 'Explore',
      tryAsking: 'Try asking:',
      samples: ['How to file a patent', 'After Class 10', 'UPSC from zero', 'Funded study abroad', 'NSP scholarships'],
      instantMatchesFor: 'Instant matches for',
      universeTopicsHeading: 'Knowledge Universe Topics',
      discoverOppsHeading: 'Kadam Discover Opportunities',
      noExactMatch: 'No exact catalogue title matched—ask Kadam AI for a plain-language zero-to-one briefing below.',
      wantPlainAnswer: 'Want a plain-language answer in English, తెలుగు, or हिन्दी?',
      askKadamAbout: 'Ask Kadam AI about',
      buildRoadmapBtn: 'Build My Next Kadam',
      openMapBtn: 'Open Possibility Map',
      askKadamLanguages: 'Ask Kadam AI (EN · తెలుగు · हिन्दी)',
      fig1Caption: 'Fig. 1 — Every qualification is a threshold, not a boundary.',
      stat1Label: 'Indexed Topics Across 18 Domains',
      stat2Label: 'Batch 1 Complete 16-Section Guides',
      stat3Label: 'Connected Step-by-Step Journeys',
      stat4Value: 'EN · తెలుగు · हिन्दी',
      stat4Label: 'Voice & Document AI Mentor',
      startKicker: 'No matter where you start',
      startTitle: 'Begin from your current qualification',
      startDesc:
        'Select your stage to view visual branching pathways, eligible examinations, scholarships, and non-obvious alternatives.',
      possibilityMapCta: 'Possibility Map',
      readGuidesCta: 'Read Guides',
      pillar1Kicker: '01 · The Agla Kadam Universe',
      pillar1Title: 'An encyclopedia written for someone starting from zero',
      pillar1Desc:
        'Every complete guide explains what an opportunity is, why it exists, exact documents required, step-by-step procedures, hidden risks, common mistakes, and official government or institutional portals—with toggleable Beginner, Intermediate, and Advanced depth.',
      pillar1Caption: 'Fig. 2 — The Agla Kadam Universe: Beginner, Intermediate & Advanced clarity.',
      browseAllTopics: 'Browse all 18 categories & 150 topics',
      pillar2Kicker: '02 · Possibility Map & My Next Kadam',
      pillar2Title: 'Compare multiple pathways instead of accepting one forced track',
      pillar2Desc:
        'Explore branching academic, competitive, research, vocational, and entrepreneurial routes visually. Then build a personalised My Next Kadam plan that presents three distinct, honest pathways—complete with milestones, realistic costs, risks, and printable reports for parents.',
      pillar2Caption: 'Fig. 3 — Non-linear mobility across academic, technical, and research doors.',
      exploreMapBtn: 'Explore Possibility Map',
      generateRoadmapBtn: 'Generate Personal Roadmap',
      pillar3Kicker: '03 · Kadam Discover & Universities',
      pillar3Title: 'Scholarships, fellowships, labs, and verified institutions in one radar',
      pillar3Desc:
        'Filter scholarships, research internships, fellowships, hackathons, startup grants, and institutions across IITs, NITs, IIITs, IISERs, Central/State Universities, NLUs, NID, NIFT, and global universities—with official links, verification dates, and zero fabricated rankings.',
      pillar3Caption: 'Fig. 4 — Verified institutions and transparent opportunity tracking.',
      openDiscoverBtn: 'Open Kadam Discover',
      exploreJourneysBtn: 'Explore 11 Learning Journeys',
      nobodyToldKicker: 'What Nobody Told Me',
      nobodyToldTitle: 'High-impact opportunities most students hear about too late',
      runGapDetector: 'Run Opportunity Gap Detector →',
      demoCycleNote: 'Demonstration cycle · Check portal',
      aiBannerKicker: 'Kadam AI · Voice-First · Document Decoder',
      aiBannerTitle: 'Have an official notification, offer letter, or basic question you felt shy to ask?',
      aiBannerDesc:
        'Switch on No-Question-Is-Stupid Mode in English, Telugu, or Hindi, speak your question aloud, decode any marksheet or recruitment notification, or generate a clear Explain It to My Parents report.',
      openKadamAiBtn: 'Open Kadam AI',
      decodeDocBtn: 'Decode a Document or Notification',
    },
    universe: {
      kicker: 'The Agla Kadam Universe · Knowledge Library',
      title: '150 verified topics across 18 educational & career domains',
      subtitle:
        'Written for someone starting from zero—with 16 structured sections, official links, FAQs, and Beginner, Intermediate, or Advanced depth.',
      searchPlaceholder: 'Search exams, degrees, scholarships, patents, startups...',
      categoryLabel: 'Category',
      all18Categories: 'All 18 Categories (150 Topics)',
      stageLabel: 'Student Stage',
      statusLabel: 'Availability',
      completeOnly: 'Complete 16-Section Guides (15)',
      scheduledOnly: 'Scheduled Upcoming Batches (135)',
      showingTopics: 'Showing',
      inCategory: 'in',
      noMatchTitle: 'No matching topic in this filter view',
      noMatchDesc: 'Try resetting your filters or ask Kadam AI for an immediate zero-to-one explanation.',
      resetAllFilters: 'Reset All Filters',
      askAiAboutQuery: 'Ask Kadam AI instead',
      backToUniverse: 'Back to The Agla Kadam Universe',
      all150Topics: 'All 150 Topics in The Agla Kadam Universe',
      topicNotFound: 'Topic not found',
      scheduledForBatch: 'Scheduled for Editorial Batch',
      whyScheduledTitle: 'Why is this guide marked as Scheduled?',
      whyScheduledBody:
        'AGLA KADAM never publishes thin placeholder articles or unverified filler. Every complete guide is authored with all 16 verified sections, official links, and beginner-to-advanced depth in curated batches of 15.',
      getAiBriefing: 'Get an Immediate Zero-to-One Kadam AI Briefing',
      readBatch1Guides: 'Read Completed Batch 1 Guides',
      depthLabel: 'Explanation Depth',
      depthBeginner: 'Beginner (From Zero)',
      depthIntermediate: 'Intermediate',
      depthAdvanced: 'Advanced Detail',
      secOverview: 'Depth Summary',
      secWhatItIs: '1. What It Is',
      secWhyItExists: '2. Why It Exists',
      secWhoNeedsIt: '3. Who Needs It',
      secHowItWorks: '4. How It Works',
      secTypesPathways: '5. Types & Pathways',
      secEligibility: '6. Eligibility',
      secDocuments: '7. Documents & Requirements',
      secSteps: '8. Step-by-Step Procedure',
      secWhatNext: '9. What Happens Next',
      secBenefits: '10. Opportunities & Benefits',
      secRisksCosts: '11. Limitations, Costs & Risks',
      secMistakes: '12. Common Mistakes to Avoid',
      secFaqs: '13. Frequently Asked Questions',
      secOfficialPortals: '14. Official Government & Institutional Portals',
      secRelatedGuides: '15. Related Guides',
      onThisPage: 'Jump to Section',
      askAiOnGuide: 'Ask Kadam AI about this guide',
      stepLabel: 'Step',
      verifiedPortalNote: 'Always verify current-year notices, dates, and fees on these official portals.',
    },
    pathways: {
      kicker: 'Interactive Possibility Map & Learning Journeys',
      title: 'See every branch before choosing your next step',
      subtitle:
        'Select your qualification, narrow by stream or track, and view eligibility, exams, duration, opportunities, and next steps immediately beside your selection.',
      tabMap: 'Possibility Map',
      tabJourneys: '11 Learning Journeys',
      step1Label: 'Step 1 · Select Your Qualification',
      step1BLabel: 'Step 1B · Choose Your Class 11–12 Stream / Subject Combination',
      step2TrackLabel: 'Step 2 · Filter by Pathway Track',
      selectedCount: 'selected to compare',
      compareSelected: 'Compare Selected',
      hideComparison: 'Hide Comparison',
      clearCompare: 'Clear',
      comparisonHeading: 'Side-by-Side Pathway Comparison',
      availablePathways: 'Applicable Pathways',
      allPathwaysMobile: 'All Pathways',
      compareToggleAdd: '+ Compare',
      compareToggleAdded: '✓ In Compare',
      eligibilityLabel: 'Eligibility & Qualification',
      durationLabel: 'Duration',
      examsLabel: 'Relevant Examinations',
      costLabel: 'Approximate Cost & Aid',
      institutionsLabel: 'Representative Institutions',
      scholarshipsLabel: 'Scholarships & Financial Support',
      outcomesLabel: 'Career & Next Steps',
      alternativesLabel: 'Parallel & Backup Pathways',
      realityLabel: 'Honest Reality Note',
      readFullGuide: 'Read Complete Verified Guide',
      selectJourneyMobile: 'Choose a Learning Journey',
      journeyOverview: 'Journey Overview',
      targetAudience: 'Who This Journey Is For',
      estimatedHorizon: 'Typical Time Horizon',
      stagesCompleted: 'stages completed',
      stagePrerequisites: 'Prerequisites',
      stageDecisions: 'Key Decisions',
      stageDocuments: 'Documents Needed',
      stageNextActions: 'Next Actions',
      linkedGuides: 'Linked Guides',
      officialReferences: 'Official References',
      saveJourney: 'Save Journey',
      journeySaved: 'Saved Journey',
    },
    discover: {
      kicker: 'Kadam Discover · Verified Institutions',
      title: 'Opportunity Radar & University Discovery',
      subtitle:
        'Browse real Indian and international programmes with official links and verification dates. Sample cycle dates are transparently labelled as Demonstration Entries—we never fabricate active deadlines or rankings.',
      tabOpportunities: 'Opportunity Radar',
      tabUniversities: 'Universities & Courses',
      verificationStandardLabel: 'Verification Standard:',
      verificationStandardBody:
        'Every programme below is a real Indian or global programme linked directly to its official authority portal. Because live application deadlines change every cycle, sample dates marked Demonstration Entry are for calendar-planning demonstration—always confirm live opening/closing dates on the linked official portal.',
      oppSearchPlaceholder: 'Search scholarships, IIT internships, fellowships, exams...',
      lesserKnownToggle: 'What Nobody Told Me (Lesser-known only)',
      showingOpportunities: 'Showing',
      noOppsTitle: 'No opportunities match your current filters',
      noOppsDesc: 'Clear one or more filters to view all verified scholarships, fellowships, exams, and programmes.',
      whatNobodyTellsYou: 'What Nobody Tells You',
      eligibility: 'Eligibility',
      benefits: 'Benefits & Funding',
      cycleWindow: 'Typical Cycle',
      demoEntry: 'Demonstration Entry',
      verifiedPortal: 'Verified Portal',
      addToCalendar: 'Track Deadline',
      addedToCalendar: 'Added to Calendar',
      share: 'Share',
      shared: 'Copied Link',
      uniSearchPlaceholder: 'Search IIT, NIT, IISER, NLU, Central University, course, or exam...',
      allInstitutionTypes: 'All Institution Types',
      showingUniversities: 'Showing',
      noUnisTitle: 'No institutions match your current filter',
      noUnisDesc: 'Reset search or institution type to browse all verified universities and institutes.',
      established: 'Est.',
      notableCourses: 'Notable Courses',
      entranceExams: 'Entrance Exams',
      admissionProcess: 'Admission Process',
      feeNote: 'Fee Context',
      scholarshipNote: 'Scholarships & Aid',
    },
    roadmap: {
      kicker: 'My Next Kadam',
      title: 'Personalised Multi-Pathway Roadmap',
      subtitle:
        'AGLA KADAM never forces one narrow recommendation. Share your current stage, strengths, and constraints progressively to generate three distinct pathways—complete with immediate actions, milestones, costs, risks, and alternatives you can compare and save.',
      step1Tab: '01. Qualification',
      step2Tab: '02. Location & Budget',
      step3Tab: '03. Interests & Strengths',
      step4Tab: '04. Pathway Preferences',
      stepCounter: 'Step',
      eduStageLabel: 'Current Education Stage',
      streamLabel: 'Qualification, Stream, or Major',
      streamPlaceholder: 'e.g., Class 12 PCM, B.Com General, Diploma Mechanical, BA History...',
      cityLabel: 'Current City / State',
      cityPlaceholder: 'e.g., Jaipur, Rajasthan or Hyderabad, Telangana',
      destLabel: 'Preferred Study / Work Destination',
      destPlaceholder: 'Home state, Metro India, Europe, Anywhere...',
      budgetLabel: 'Budget / Financial Constraint',
      interestsLabel: 'Interests (comma-separated)',
      interestsPlaceholder: 'e.g., Biology, Law, Designing apps, Climate, Writing...',
      strengthsLabel: 'Strengths (comma-separated)',
      strengthsPlaceholder: 'e.g., Problem solving, Communication, Patience...',
      goalsLabel: 'Personal Goals (comma-separated)',
      goalsPlaceholder: 'e.g., Stable income in 2 years, Publish a paper, Serve public...',
      tracksPrompt: 'Which directions are you open to exploring? (Select multiple)',
      generateBtn: 'Generate My Next Kadam',
      generatingBtn: 'Mapping 3 Distinct Pathways...',
      aiPlanKicker: 'AI-Synthesised Multi-Pathway Plan · Verify Official Dates & Fees',
      detailedViewBtn: 'Detailed Pathway View',
      compareAllBtn: 'Compare All 3 Pathways',
      saveRoadmapBtn: 'Save Roadmap',
      optionLabel: 'Option',
      pathwayLabel: 'Pathway',
      inspectMilestones: 'Inspect full milestones →',
      immediateHorizon: 'Immediate (Next 30 Days)',
      shortTermHorizon: 'Short-Term (3–12 Months)',
      longTermHorizon: 'Long-Term (1–4 Years)',
      requiredQualifications: 'Required Qualifications',
      keyExaminations: 'Key Examinations',
      skillsToBuild: 'Skills to Build',
      estimatedCost: 'Estimated Cost & Aid Note',
      possibleInstitutions: 'Possible Institutions',
      opportunitiesToWatch: 'Opportunities to Watch',
      risksAlternatives: 'Risks & Backup Alternatives',
      verifiedGuidesHeading: 'Verified AGLA KADAM Guides for This Pathway',
      immediateNextStep: 'Immediate Next Step:',
      keyRiskAlternative: 'Key Risk / Alternative:',
    },
    kadamAi: {
      kicker: 'Kadam AI · Multilingual · Voice-First Mentor',
      title: 'Ask anything—starting from absolute zero',
      subtitle:
        'Every answer separates verified AGLA KADAM guides from AI-generated guidance and reminds you to confirm live dates on official portals.',
      noStupidMode: 'No-Question-Is-Stupid Mode',
      newConversation: 'New Conversation',
      savedConversations: 'Saved Conversations',
      noConversations: 'Your conversations will appear here.',
      welcomeTitle: 'No question is too basic here.',
      welcomeSubtitle:
        'Ask in everyday words—English, Telugu, Hindi, or mixed Hinglish are all welcome. You can also press the microphone button to speak your question aloud.',
      youLabel: 'You',
      assistantHeader: 'Kadam AI · AI-Generated Guidance (Verify live dates on official portals)',
      citedGuidesHeading: 'Verified AGLA KADAM Guides Referenced',
      thinkingText: 'Kadam AI is preparing a clear explanation...',
      recordingPlaceholder: 'Listening... click mic again when finished speaking.',
      inputPlaceholder: 'Ask your question in simple everyday words...',
      sendBtn: 'Send',
      voiceStartTitle: 'Ask by voice',
      voiceStopTitle: 'Stop voice recording',
      starters: [
        'I just finished Class 10 and everyone is forcing Science. What are all my real options?',
        'What is a patent and can an undergraduate student in India actually file one?',
        'Explain CTC vs In-Hand salary in an Indian job offer letter from absolute zero.',
        'How can a student from a small-town college get an IIT summer research internship?',
      ],
    },
    tools: {
      kicker: 'Practical Guidance Tools',
      title: 'Decode documents, compare realities, and prepare for family conversations',
      subtitle:
        'Every tool below is designed for real moments when students get stuck—reading a dense government notification, evaluating an offer letter, discovering missed fellowships, or explaining an unconventional path at home.',
      outputLanguage: 'Output Language:',
      tabDecoder: 'Notification & Document Decoder',
      tabParents: 'Explain It to My Parents',
      tabGap: 'Opportunity Gap Detector',
      tabWhatCanIDo: 'What Can I Do With This?',
      tabReality: 'Career Reality Check',
      decoderTitle: 'Explain This Notification or Document',
      decoderDesc:
        'Upload a PDF or photo (up to 5 MB) or paste text from an exam notification, scholarship circular, college admission letter, marksheet, or job offer letter.',
      privacyTitle: 'Ephemeral Privacy Processing',
      privacyBody:
        'Uploaded files are processed in memory and discarded immediately after analysis—never stored on disk or in your database. Please mask or crop sensitive ID numbers (Aadhaar, PAN, phone number) before uploading.',
      decodingWhat: 'What are you decoding?',
      modeNotification: 'Official Notification',
      modeDocument: 'Marksheet / Offer Letter',
      uploadLabel: 'Upload File (PDF, PNG, JPG, WEBP · Max 5 MB)',
      chooseFile: 'Choose a PDF or image to decode',
      chooseFileHint: 'Exam brochures, fee circulars, offer letters, admission letters',
      pasteLabel: 'Or Paste Notification / Document Text',
      pastePlaceholder: 'Paste eligibility rules, CTC breakup, notice period clauses, or scholarship terms...',
      decodeBtn: 'Decode Now',
      decodingBtn: 'Decoding in plain language...',
      whatYouReceive: 'What you will receive',
      zeroJargonTitle: 'Zero-jargon breakdown built for action',
      receiveItems: [
        '1. Plain-language summary of what the document actually means.',
        '2. Eligibility rules and hidden exclusions written simply.',
        '3. Extracted deadlines with one-click saving to your Opportunity Calendar.',
        '4. Required documents, certificates, and financial/CTC clauses decoded.',
        '5. Red flags, service-bond warnings, and next steps to verify officially.',
      ],
      readingClauses: 'Reading and translating clauses into plain language...',
      extractingSub: 'Extracting eligibility, dates, required documents, and potential risks.',
      aiDecodedKicker: 'AI-Decoded Explanation · Verify Against Original Source',
      plainSummary: 'Plain-Language Summary',
      importantDates: 'Important Dates Extracted',
      eligibilityHighlights: 'Eligibility Highlights',
      requiredDocuments: 'Required Documents',
      feesClauses: 'Fees, CTC, or Financial Clauses',
      stepByStepActions: 'Step-by-Step Next Actions',
      risksRedFlags: 'Risks, Fine Print & Red Flags',
      parentsTitle: 'Explain It to My Parents',
      parentsDesc:
        'Many families worry simply because a pathway is unfamiliar. Generate a calm, balanced, printable one-page brief covering duration, real costs, career stability, backup plans, and how parents can support.',
      pathwayInputLabel: 'Pathway, Degree, or Career to Explain',
      pathwayPlaceholder: 'e.g., B.Des at NID, BS-MS Research at IISER, CLAT & Law, MS in Germany',
      stageSelectLabel: 'Student Current Stage',
      concernsLabel: 'Main Family Questions or Concerns (Optional)',
      concernsPlaceholder: 'e.g., Total fees, job security after graduation, safety in another city, backup options',
      generateBriefBtn: 'Generate Family Brief',
      generatingBriefBtn: 'Preparing family brief...',
      respectfulClarity: 'Built for respectful clarity',
      tryCommonTopic: 'Try a common family conversation topic',
      draftingBrief: 'Drafting a balanced parent brief...',
      familyBriefKicker: 'AGLA KADAM · Family Discussion Brief',
      execSummary: 'Executive Summary',
      whatInvolves: 'What This Path Involves',
      durationTimeline: 'Duration & Timeline',
      realisticCost: 'Realistic Cost Estimate',
      careerOutlook: 'Career & Income Outlook',
      eligibilityExams: 'Eligibility & Key Examinations',
      honestRisks: 'Honest Risks & Backup Plans',
      howParentsSupport: 'How Parents Can Support',
      specialRunBtn: 'Analyze Now',
      specialRunningBtn: 'Analyzing possibilities...',
      whyItMatters: 'Why It Matters',
      realityChallenges: 'Reality & Challenges',
      immediateStep: 'Immediate Next Step',
      relatedVerifiedGuides: 'Related Verified Guides',
      curatedLesserKnown: 'Curated Lesser-Known Opportunities',
    },
    dashboard: {
      kicker: 'Student Dashboard · Your Next Step',
      welcomePrefix: 'Welcome back,',
      kpiRoadmaps: 'Saved Roadmaps',
      kpiDeadlines: 'Active Deadlines',
      kpiAchievements: 'Achievements Logged',
      kpiSaved: 'Saved Items',
      tabOverview: 'Overview',
      tabRoadmaps: 'Roadmaps',
      tabCalendar: 'Opportunity Calendar',
      tabLocker: 'Achievement Locker & Timeline',
      tabSaved: 'Saved & Progress',
      tabAiHistory: 'Kadam AI History',
      tabProfile: 'Profile & Privacy',
      myRoadmapsHeading: 'My Next Kadam Roadmaps',
      viewAllRoadmaps: 'View All Roadmaps →',
      buildRoadmapLink: 'Build Roadmap →',
      noRoadmapTitle: 'You have not saved a personalised roadmap yet.',
      noRoadmapDesc:
        'Answer a few quick questions about your stage, interests, and budget to compare 3 distinct pathways tailored to you.',
      generateRoadmapCta: 'Generate My Next Kadam',
      milestonesCompleted: 'milestone(s) completed',
      openChecklist: 'Open Checklist →',
      upcomingDeadlinesHeading: 'Upcoming Opportunity Deadlines',
      manageCalendar: 'Manage Calendar →',
      noDeadlinesText: 'No deadlines tracked yet. Add dates from Kadam Discover, the Notification Decoder, or your Opportunity Calendar.',
      savedItemsHeading: 'Saved Guides & Opportunities',
      viewAll: 'View All',
      noBookmarksHint: 'Bookmark guides, fellowships, or universities to build your personal reference shelf. Popular starting points:',
      activeProgressHeading: 'Active Learning Progress',
      openJourneys: 'Open Journeys →',
      noProgressHint: 'Mark completed guides in The Agla Kadam Universe or check off stages inside any Learning Journey to track progress here.',
      exploreHeading: 'Explore AGLA KADAM',
      completeProfileTitle: 'Complete your student profile',
      completeProfileDesc: 'Helps Kadam AI and My Next Kadam tailor suggestions to your exact stage and budget.',
      setupProfileLink: 'Set up profile',
      pillarsReady: 'Platform Pillars Ready to Explore',
      pillarOverview: 'Platform Overview & Global Search →',
      pillarUniverse: 'The Agla Kadam Universe (150 Topics · 18 Categories) →',
      pillarPathways: 'Interactive Possibility Map & 11 Learning Journeys →',
      pillarDiscover: 'Kadam Discover (Opportunities & Universities) →',
      pillarAi: 'Ask Kadam AI (English · తెలుగు · हिन्दी · Voice-First) →',
      pillarTools: 'Document Decoder, Parent Brief & Reality Check →',
      savedConversationsTitle: 'Saved Kadam AI Conversations',
      savedConversationsDesc: 'Review past mentor sessions or delete threads anytime.',
      messagesCount: 'messages',
      noConversationsYet: 'No saved Kadam AI conversations yet.',
      studentProfileTitle: 'Student Profile',
      studentProfileDesc: 'Used to personalise My Next Kadam roadmaps and Kadam AI explanations. Never shared publicly.',
      eduLevelLabel: 'Current Education Level',
      streamDisciplineLabel: 'Stream / Discipline',
      locationLabel: 'Current City / State',
      budgetLabel: 'Approximate Annual Study Budget',
      interestsLabel: 'Interests (comma separated)',
      strengthsLabel: 'Strengths (comma separated)',
      goalsLabel: 'Goals (comma separated)',
      saveProfileBtn: 'Save Profile',
      profileSavedToast: 'Profile updated in your workspace.',
      privacyTitle: 'Privacy & Data Control',
      privacyDesc:
        'Your data belongs to you. Uploaded documents in the Decoder are never saved to servers, and you can export or purge your saved records anytime.',
      exportJsonBtn: 'Export All Personal Data (JSON)',
      clearAiHistoryBtn: 'Clear All Kadam AI History',
      confirmDeleteAiPrompt: 'Permanently delete all saved Kadam AI conversation(s)?',
      confirmDeleteBtn: 'Confirm Delete',
      preferredLanguageTitle: 'Preferred Language',
      preferredLanguageDesc: 'Saved securely to your profile and restored automatically on future logins without resetting your progress.',
      calendarTitle: 'Opportunity Calendar',
      calendarDesc: 'Track examination, scholarship, internship, and admission dates calmly in one list.',
      addDeadlineTitle: 'Add Custom Deadline',
      deadlineNamePlaceholder: 'e.g., GATE Registration or NSP Scholarship',
      dueDateLabel: 'Due Date',
      officialUrlLabel: 'Official Portal URL (Optional)',
      notesLabel: 'Notes (Optional)',
      addDeadlineBtn: 'Add to Calendar',
      statusWatching: 'Watching',
      statusInProgress: 'In Progress',
      statusSubmitted: 'Submitted',
      lockerTitle: 'Achievement Locker & Growth Timeline',
      lockerDesc: 'Record certificates, projects, competitions, research, and milestones across your academic journey.',
      lockerView: 'Locker Grid',
      timelineView: 'Growth Timeline',
      addAchievementTitle: 'Log New Achievement',
      achievementTitleLabel: 'Achievement Title',
      issuerLabel: 'Issuing Institution / Organisation',
      dateEarnedLabel: 'Date Earned',
      reflectionLabel: 'Key Learning / Reflection (Optional)',
      skillsLabel: 'Skills Gained (comma separated)',
      addAchievementBtn: 'Save Achievement',
      noAchievementsYet: 'No achievements logged yet. Start building your personal academic & skill record.',
      allSaved: 'All',
      guidesFilter: 'Guides',
      opportunitiesFilter: 'Opportunities',
      universitiesFilter: 'Universities',
      journeysFilter: 'Journeys',
    },
  },

  hi: {
    common: {
      brand: 'AGLA KADAM',
      tagline: 'आपका अगला कदम। आपका भविष्य। आपका चुनाव।',
      taglineSpaced: 'आपका अगला कदम · आपका भविष्य · आपका चुनाव',
      loadingWorkspace: 'आपका वर्कस्पेस लोड हो रहा है...',
      signOut: 'साइन आउट',
      save: 'सेव करें',
      saved: 'सेव किया गया',
      cancel: 'रद्द करें',
      delete: 'हटाएँ',
      deleting: 'हटाया जा रहा है...',
      clear: 'साफ़ करें',
      resetFilters: 'फ़िल्टर रीसेट करें',
      back: 'पीछे',
      continue: 'आगे बढ़ें',
      open: 'खोलें',
      officialSite: 'आधिकारिक वेबसाइट',
      officialPortal: 'आधिकारिक पोर्टल',
      listen: 'सुनें',
      stopAudio: 'ऑडियो रोकें',
      copy: 'कॉपी करें',
      copied: 'कॉपी हो गया',
      printPdf: 'प्रिंट / PDF सेव करें',
      translatingContent: 'हिन्दी में पूरा गाइड और विवरण तैयार हो रहा है...',
      translationError: 'हिन्दी अनुवाद लोड नहीं हो सका—अभी सत्यापित अंग्रेज़ी विवरण दिखाया जा रहा है।',
      retryTranslation: 'फिर से कोशिश करें',
      allStages: 'सभी स्तर (All Stages)',
      allCategories: 'सभी श्रेणियाँ',
      allTracks: 'सभी ट्रैक',
      allStatuses: 'सभी स्थितियाँ',
      completeGuide: 'पूर्ण गाइड',
      scheduled: 'आगामी बैच',
      batch: 'बैच',
      verified: 'सत्यापित',
      minRead: 'मिनट पढ़ें',
      savedToDashboard: 'डैशबोर्ड में सेव है',
      saveGuide: 'गाइड सेव करें',
      markCompleted: 'पढ़ा हुआ चिह्नित करें',
      completed: 'पूरा हुआ',
      askKadamAi: 'Kadam AI से पूछें',
      explainToParents: 'माता-पिता को समझाएँ',
      languageLabel: 'भाषा',
    },
    nav: {
      dashboard: 'डैशबोर्ड',
      universe: 'ज्ञान संसार',
      pathways: 'करियर रास्ते',
      discover: 'अवसर खोजें',
      roadmap: 'मेरा अगला कदम',
      kadamAi: 'Kadam AI',
      tools: 'टूल्स',
      exploreOverview: 'प्लेटफ़ॉर्म परिचय',
      openMenu: 'मेनू खोलें',
      closeMenu: 'मेनू बंद करें',
    },
    footer: {
      mission:
        'ताकि भारत का कोई भी विद्यार्थी सिर्फ़ इसलिए कोई शैक्षिक, छात्रवृत्ति, रिसर्च या करियर अवसर न खो दे क्योंकि किसी ने उसे इसके बारे में बताया ही नहीं था।',
      exploreHeading: 'एक्सप्लोर करें',
      studentDashboard: 'स्टूडेंट डैशबोर्ड',
      platformOverview: 'प्लेटफ़ॉर्म परिचय',
      universeLink: 'The Agla Kadam Universe (ज्ञान संसार)',
      pathwaysLink: 'Possibility Map और लर्निंग जर्नी',
      discoverLink: 'Kadam Discover (अवसर और विश्वविद्यालय)',
      verificationHeading: 'सत्यापन और गोपनीयता मानक',
      verificationBody:
        'सभी सत्यापित गाइड अंतिम सत्यापन तिथि और सीधे आधिकारिक सरकारी या संस्थागत पोर्टल के लिंक दिखाते हैं। आवेदन से पहले हमेशा आधिकारिक वेबसाइट पर ताज़ा तिथियाँ, पात्रता और शुल्क जाँचें। Document Decoder में अपलोड की गई फ़ाइलें केवल मेमोरी में जाँची जाती हैं और कभी सेव नहीं होतीं।',
      copyright: 'AGLA KADAM। शैक्षिक मार्गदर्शन और अवसर खोज मंच।',
      batchInfo: 'बैच 1 सत्यापित लाइब्रेरी (15 पूर्ण गाइड · 18 श्रेणियों में 150 विषय)',
    },
    auth: {
      indiaAllStages: 'भारत · सभी विद्यार्थी स्तर',
      kicker: 'शैक्षिक मार्गदर्शन और अवसर खोज',
      headline: 'किसी भी विद्यार्थी से कोई अवसर सिर्फ़ इसलिए नहीं छूटना चाहिए क्योंकि किसी ने उसे बताया नहीं।',
      subtitle:
        'कक्षा 10 के बाद के फैसलों और राष्ट्रीय छात्रवृत्तियों (Scholarships) से लेकर रिसर्च पेपर, पेटेंट, उच्च शिक्षा और करियर के रास्तों तक—सत्यापित गाइड, पर्सनल रोडमैप और Kadam AI को English, తెలుగు और हिन्दी में जानें।',
      highlight1Title: 'The Agla Kadam Universe',
      highlight1Desc: '18 श्रेणियों में 150 विषय, सीधे आधिकारिक सरकारी और विश्वविद्यालय पोर्टल लिंक के साथ।',
      highlight2Title: 'My Next Kadam और Kadam AI',
      highlight2Desc: 'व्यक्तिगत मल्टी-पाथवे रोडमैप, डॉक्यूमेंट डिकोडर और वॉइस-फ़र्स्ट मार्गदर्शन।',
      highlight3Title: 'निजी स्टूडेंट वर्कस्पेस',
      highlight3Desc: 'गाइड सेव करें, परीक्षा की अंतिम तिथियाँ ट्रैक करें और अपना Achievement Locker बनाएँ।',
      protectedFooter: 'Firebase Authentication और निजी स्टूडेंट सुरक्षा नियमों द्वारा सुरक्षित',
      stagesFooter: 'स्कूल · UG · PG · रिसर्च · शुरुआती करियर',
      signInKicker: 'स्टूडेंट साइन इन',
      welcomeBack: 'वापस स्वागत है',
      signInDesc:
        'अपने AGLA KADAM डैशबोर्ड, सेव किए गए रोडमैप, बुकमार्क और आगामी अवसरों की तिथियाँ देखने के लिए साइन इन करें।',
      signUpKicker: 'नया विद्यार्थी पंजीकरण',
      beginNextStep: 'अपना अगला कदम शुरू करें',
      signUpDesc:
        'पर्सनल रोडमैप सेव करने, डेडलाइन ट्रैक करने और अपनी ग्रोथ टाइमलाइन बनाने के लिए मुफ़्त AGLA KADAM अकाउंट बनाएँ।',
      backToSignIn: 'साइन इन पर वापस जाएँ',
      recoveryKicker: 'अकाउंट रिकवरी',
      resetPasswordTitle: 'पासवर्ड रीसेट करें',
      resetPasswordDesc:
        'अपना पंजीकृत ईमेल पता दर्ज करें—हम Firebase Authentication के ज़रिए पासवर्ड रीसेट लिंक भेजेंगे।',
      emailLabel: 'ईमेल पता (Email)',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'पासवर्ड (Password)',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
      forgotPasswordLink: 'पासवर्ड भूल गए?',
      showPassword: 'पासवर्ड दिखाएँ',
      hidePassword: 'पासवर्ड छिपाएँ',
      signInBtn: 'साइन इन करें',
      signingInBtn: 'साइन इन हो रहा है...',
      fullNameLabel: 'पूरा नाम (Full Name)',
      fullNamePlaceholder: 'जैसे, अनन्या शर्मा',
      newPasswordPlaceholder: 'कम से कम 8 अक्षर',
      passwordHint: 'अक्षरों और संख्याओं को मिलाकर कम से कम 8 कैरेक्टर का पासवर्ड बनाएँ।',
      confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
      confirmPasswordPlaceholder: 'पासवर्ड दोबारा लिखें',
      createAccountBtn: 'अकाउंट बनाएँ',
      creatingAccountBtn: 'अकाउंट बन रहा है...',
      resetSentTitle: 'पासवर्ड रीसेट ईमेल भेज दिया गया है',
      resetSentDescBefore: 'यदि इस ईमेल के लिए AGLA KADAM अकाउंट मौजूद है:',
      resetSentDescAfter:
        'तो आपको कुछ ही देर में पासवर्ड रीसेट लिंक मिल जाएगा। कृपया अपना स्पैम या प्रमोशन फ़ोल्डर भी जाँच लें।',
      returnToSignIn: 'साइन इन पर लौटें',
      sendResetBtn: 'पासवर्ड रीसेट लिंक भेजें',
      sendingResetBtn: 'लिंक भेजा जा रहा है...',
      orDivider: 'या',
      continueGoogle: 'Google के साथ जारी रखें',
      newToApp: 'AGLA KADAM पर नए हैं?',
      createAnAccount: 'नया अकाउंट बनाएँ',
      alreadyHaveAccount: 'पहले से अकाउंट है?',
      signInLink: 'साइन इन करें',
      rememberedPassword: 'पासवर्ड याद आ गया?',
      privacyNote:
        'आपके सेव किए गए रोडमैप, डेडलाइन और उपलब्धियाँ आपके अकाउंट में पूरी तरह निजी रहती हैं। डिकोडर में अपलोड डॉक्यूमेंट कभी स्टोर नहीं किए जाते।',
      errInvalidEmail: 'कृपया एक सही ईमेल पता दर्ज करें।',
      errMissingPassword: 'कृपया अपना पासवर्ड दर्ज करें।',
      errShortName: 'कृपया अपना पूरा नाम लिखें (कम से कम 2 अक्षर)।',
      errShortPassword: 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।',
      errPasswordMismatch: 'दोनों पासवर्ड मेल नहीं खा रहे हैं। कृपया दोबारा जाँचें।',
      errResetEmail: 'कृपया अपने अकाउंट से जुड़ा ईमेल पता दर्ज करें।',
    },
    home: {
      heroTitle: 'आपके भविष्य में आपकी सोच से कहीं ज़्यादा संभावनाएँ हैं।',
      heroSubtitle:
        'लाखों विद्यार्थी परीक्षाओं, छात्रवृत्तियों (Scholarships), रिसर्च लैब्स, पेटेंट और बेहतरीन करियर अवसरों से सिर्फ़ इसलिए चूक जाते हैं क्योंकि किसी ने उन्हें बताया ही नहीं। AGLA KADAM बिल्कुल शुरुआत (शून्य) से सत्यापित विकल्प दिखाता है—ताकि हर फैसला आपका हो।',
      searchPlaceholder: 'आप हमेशा से किस विषय के बारे में जानना चाहते थे?',
      exploreBtn: 'खोजें',
      tryAsking: 'यह पूछकर देखें:',
      samples: ['पेटेंट कैसे फाइल करें (Patent)', 'कक्षा 10 के बाद रास्ते', 'UPSC शुरुआत से', 'विदेश में स्कॉलरशिप पढ़ाई', 'NSP छात्रवृत्ति'],
      instantMatchesFor: 'तुरंत मिले परिणाम:',
      universeTopicsHeading: 'ज्ञान संसार के विषय (Universe Topics)',
      discoverOppsHeading: 'Kadam Discover के अवसर',
      noExactMatch: 'सूची में ठीक यही शीर्षक नहीं मिला—नीचे Kadam AI से सरल हिन्दी में पूरी जानकारी पाएँ।',
      wantPlainAnswer: 'क्या आप English, తెలుగు या हिन्दी में आसान भाषा में जवाब चाहते हैं?',
      askKadamAbout: 'Kadam AI से पूछें:',
      buildRoadmapBtn: 'मेरा अगला कदम रोडमैप बनाएँ',
      openMapBtn: 'Possibility Map खोलें',
      askKadamLanguages: 'Kadam AI से पूछें (EN · తెలుగు · हिन्दी)',
      fig1Caption: 'चित्र 1 — हर योग्यता एक नया द्वार है, कोई सीमा नहीं।',
      stat1Label: '18 क्षेत्रों में सूचीबद्ध विषय',
      stat2Label: 'बैच 1 के 16-भाग वाले पूर्ण गाइड',
      stat3Label: 'क्रमबद्ध लर्निंग जर्नी',
      stat4Value: 'EN · తెలుగు · हिन्दी',
      stat4Label: 'वॉइस और डॉक्यूमेंट AI मेंटर',
      startKicker: 'आप अभी किसी भी पड़ाव पर हों',
      startTitle: 'अपनी वर्तमान योग्यता से शुरुआत करें',
      startDesc:
        'अपना स्तर चुनें और आगे के रास्ते, योग्य परीक्षाएँ, छात्रवृत्तियाँ और कम-ज्ञात लेकिन शानदार विकल्प तुरंत देखें।',
      possibilityMapCta: 'Possibility Map देखें',
      readGuidesCta: 'गाइड पढ़ें',
      pillar1Kicker: '01 · The Agla Kadam Universe',
      pillar1Title: 'बिल्कुल शुरुआत से समझाने वाला ज्ञान कोष',
      pillar1Desc:
        'हर पूर्ण गाइड बताता है कि कोई अवसर क्या है, क्यों है, कौन-कौन से दस्तावेज़ चाहिए, आवेदन की चरण-दर-चरण प्रक्रिया क्या है, आम गलतियाँ और जोखिम क्या हैं—साथ ही सीधे आधिकारिक सरकारी व विश्वविद्यालय पोर्टल के लिंक।',
      pillar1Caption: 'चित्र 2 — ज्ञान संसार: शुरुआती, मध्यम और विस्तृत स्तर पर स्पष्ट जानकारी।',
      browseAllTopics: 'सभी 18 श्रेणियाँ और 150 विषय देखें',
      pillar2Kicker: '02 · Possibility Map और My Next Kadam',
      pillar2Title: 'एक ही रास्ते पर चलने के बजाय सभी विकल्पों की तुलना करें',
      pillar2Desc:
        'शैक्षिक, प्रतियोगी परीक्षा, रिसर्च, वोकेशनल और स्टार्टअप के रास्तों को एक साथ देखें। फिर अपना पर्सनल My Next Kadam रोडमैप बनाएँ जो आपको तीन अलग और व्यावहारिक विकल्प देता है—खर्च, जोखिम और माता-पिता के लिए प्रिंट करने योग्य रिपोर्ट सहित।',
      pillar2Caption: 'चित्र 3 — शिक्षा, तकनीक, रिसर्च और कौशल के बीच खुले रास्ते।',
      exploreMapBtn: 'Possibility Map देखें',
      generateRoadmapBtn: 'अपना रोडमैप बनाएँ',
      pillar3Kicker: '03 · Kadam Discover और विश्वविद्यालय',
      pillar3Title: 'छात्रवृत्तियाँ, फ़ेलोशिप, रिसर्च लैब और सत्यापित संस्थान एक ही जगह',
      pillar3Desc:
        'IIT, NIT, IIIT, IISER, केंद्रीय/राज्य विश्वविद्यालय, NLU, NID, NIFT और विदेशी संस्थानों के साथ छात्रवृत्तियाँ, इंटर्नशिप, हैकाथॉन और स्टार्टअप ग्रांट खोजें—सत्यापित लिंक और बिना किसी बनावटी रैंकिंग के।',
      pillar3Caption: 'चित्र 4 — सत्यापित संस्थान और पारदर्शी अवसर ट्रैकिंग।',
      openDiscoverBtn: 'Kadam Discover खोलें',
      exploreJourneysBtn: '11 लर्निंग जर्नी देखें',
      nobodyToldKicker: 'जो किसी ने नहीं बताया (What Nobody Told Me)',
      nobodyToldTitle: 'ऐसे बड़े अवसर जिनके बारे में ज़्यादातर छात्रों को बहुत देर से पता चलता है',
      runGapDetector: 'अवसर गैप डिटेक्टर चलाएँ →',
      demoCycleNote: 'डेमो चक्र तिथि · आधिकारिक पोर्टल जाँचें',
      aiBannerKicker: 'Kadam AI · वॉइस-फ़र्स्ट · डॉक्यूमेंट डिकोडर',
      aiBannerTitle: 'क्या आपके पास कोई सरकारी नोटिफ़िकेशन, ऑफ़र लेटर या ऐसा बुनियादी सवाल है जिसे पूछने में झिझक हो?',
      aiBannerDesc:
        'English, తెలుగు या हिन्दी में "कोई सवाल छोटा नहीं" मोड चालू करें, बोलकर सवाल पूछें, किसी भी मार्कशीट या भर्ती नोटिफ़िकेशन को आसान भाषा में समझें, या "माता-पिता को समझाएँ" रिपोर्ट बनाएँ।',
      openKadamAiBtn: 'Kadam AI खोलें',
      decodeDocBtn: 'डॉक्यूमेंट या नोटिफ़िकेशन समझें',
    },
    universe: {
      kicker: 'The Agla Kadam Universe · ज्ञान लाइब्रेरी',
      title: '18 शैक्षिक और करियर क्षेत्रों में 150 सत्यापित विषय',
      subtitle:
        'बिल्कुल शुरुआत से समझने के लिए—16 सुव्यवस्थित भागों, आधिकारिक लिंक, FAQs और शुरुआती/मध्यम/उन्नत स्तर के साथ।',
      searchPlaceholder: 'परीक्षा, डिग्री, छात्रवृत्ति, पेटेंट, स्टार्टअप खोजें...',
      categoryLabel: 'श्रेणी चुनें',
      all18Categories: 'सभी 18 श्रेणियाँ (150 विषय)',
      stageLabel: 'विद्यार्थी स्तर',
      statusLabel: 'उपलब्धता',
      completeOnly: 'पूर्ण 16-भाग वाले गाइड (15)',
      scheduledOnly: 'आगामी बैच के विषय (135)',
      showingTopics: 'दिखाए जा रहे विषय:',
      inCategory: 'श्रेणी:',
      noMatchTitle: 'इस फ़िल्टर में कोई विषय नहीं मिला',
      noMatchDesc: 'फ़िल्टर रीसेट करके देखें या तुरंत आसान हिन्दी में समझने के लिए Kadam AI से पूछें।',
      resetAllFilters: 'सभी फ़िल्टर रीसेट करें',
      askAiAboutQuery: 'Kadam AI से पूछें',
      backToUniverse: 'ज्ञान संसार (Universe) पर लौटें',
      all150Topics: 'The Agla Kadam Universe के सभी 150 विषय',
      topicNotFound: 'विषय नहीं मिला',
      scheduledForBatch: 'संपादकीय बैच के लिए निर्धारित:',
      whyScheduledTitle: 'यह गाइड "आगामी बैच" क्यों दिखा रहा है?',
      whyScheduledBody:
        'AGLA KADAM कभी अधूरे या असत्यापित लेख प्रकाशित नहीं करता। हर पूर्ण गाइड 16 सत्यापित भागों, आधिकारिक लिंक और आसान भाषा के साथ 15-15 के बैच में तैयार किया जाता है।',
      getAiBriefing: 'Kadam AI से अभी पूरा सरल विवरण पाएँ',
      readBatch1Guides: 'बैच 1 के पूर्ण गाइड पढ़ें',
      depthLabel: 'समझने का स्तर (Depth)',
      depthBeginner: 'शुरुआती (बिल्कुल शून्य से)',
      depthIntermediate: 'मध्यम स्तर',
      depthAdvanced: 'विस्तृत (Advanced)',
      secOverview: 'संक्षिप्त सार',
      secWhatItIs: '1. यह क्या है?',
      secWhyItExists: '2. यह क्यों ज़रूरी है?',
      secWhoNeedsIt: '3. यह किसके लिए है?',
      secHowItWorks: '4. यह कैसे काम करता है?',
      secTypesPathways: '5. प्रकार और विकल्प',
      secEligibility: '6. पात्रता (Eligibility)',
      secDocuments: '7. ज़रूरी दस्तावेज़ (Documents)',
      secSteps: '8. चरण-दर-चरण प्रक्रिया',
      secWhatNext: '9. इसके बाद क्या होता है?',
      secBenefits: '10. अवसर और लाभ',
      secRisksCosts: '11. सीमाएँ, खर्च और जोखिम',
      secMistakes: '12. किन आम गलतियों से बचें',
      secFaqs: '13. अक्सर पूछे जाने वाले सवाल (FAQs)',
      secOfficialPortals: '14. आधिकारिक सरकारी और संस्थागत पोर्टल',
      secRelatedGuides: '15. संबंधित गाइड',
      onThisPage: 'इस गाइड के भाग',
      askAiOnGuide: 'इस गाइड के बारे में Kadam AI से पूछें',
      stepLabel: 'चरण',
      verifiedPortalNote: 'आवेदन से पहले हमेशा इन आधिकारिक पोर्टलों पर ताज़ा तिथियाँ और शुल्क जाँचें।',
    },
    pathways: {
      kicker: 'इंटरैक्टिव Possibility Map और लर्निंग जर्नी',
      title: 'अपना अगला कदम चुनने से पहले हर रास्ता साफ़ देखें',
      subtitle:
        'अपनी योग्यता चुनें, स्ट्रीम या ट्रैक के अनुसार छाँटें, और पात्रता, परीक्षाएँ, अवधि, छात्रवृत्तियाँ तथा अगले कदम तुरंत सामने देखें।',
      tabMap: 'Possibility Map (रास्ते)',
      tabJourneys: '11 लर्निंग जर्नी',
      step1Label: 'चरण 1 · अपनी योग्यता चुनें',
      step1BLabel: 'चरण 1B · कक्षा 11–12 की स्ट्रीम / विषय संयोजन चुनें',
      step2TrackLabel: 'चरण 2 · ट्रैक के अनुसार छाँटें',
      selectedCount: 'तुलना के लिए चुने गए',
      compareSelected: 'चुने गए रास्तों की तुलना करें',
      hideComparison: 'तुलना छिपाएँ',
      clearCompare: 'साफ़ करें',
      comparisonHeading: 'रास्तों की आमने-सामने तुलना',
      availablePathways: 'उपलब्ध करियर और शिक्षा रास्ते',
      allPathwaysMobile: 'सभी रास्ते देखें',
      compareToggleAdd: '+ तुलना करें',
      compareToggleAdded: '✓ तुलना में शामिल',
      eligibilityLabel: 'पात्रता और योग्यता (Eligibility)',
      durationLabel: 'अवधि (Duration)',
      examsLabel: 'संबंधित परीक्षाएँ (Exams)',
      costLabel: 'अनुमानित खर्च और सहायता',
      institutionsLabel: 'प्रमुख संस्थान (Institutions)',
      scholarshipsLabel: 'छात्रवृत्तियाँ और आर्थिक सहायता',
      outcomesLabel: 'करियर और आगे के कदम',
      alternativesLabel: 'समानांतर और बैकअप विकल्प',
      realityLabel: 'ईमानदार वास्तविकता (Reality Note)',
      readFullGuide: 'पूरा सत्यापित गाइड पढ़ें',
      selectJourneyMobile: 'लर्निंग जर्नी चुनें',
      journeyOverview: 'यात्रा का परिचय',
      targetAudience: 'यह यात्रा किसके लिए है',
      estimatedHorizon: 'अनुमानित समय अवधि',
      stagesCompleted: 'चरण पूरे हुए',
      stagePrerequisites: 'ज़रूरी आधार (Prerequisites)',
      stageDecisions: 'मुख्य निर्णय',
      stageDocuments: 'ज़रूरी दस्तावेज़',
      stageNextActions: 'अगले कदम',
      linkedGuides: 'जुड़े हुए गाइड',
      officialReferences: 'आधिकारिक संदर्भ',
      saveJourney: 'जर्नी सेव करें',
      journeySaved: 'जर्नी सेव है',
    },
    discover: {
      kicker: 'Kadam Discover · सत्यापित अवसर और संस्थान',
      title: 'अवसर रडार और विश्वविद्यालय खोज',
      subtitle:
        'आधिकारिक लिंक और सत्यापन तिथि के साथ वास्तविक भारतीय और अंतर्राष्ट्रीय कार्यक्रम देखें। नमूना तिथियाँ स्पष्ट रूप से "डेमो प्रविष्टि" के रूप में चिह्नित हैं—हम कभी फ़र्ज़ी डेडलाइन या रैंकिंग नहीं दिखाते।',
      tabOpportunities: 'अवसर रडार (Opportunities)',
      tabUniversities: 'विश्वविद्यालय और कोर्स',
      verificationStandardLabel: 'सत्यापन मानक:',
      verificationStandardBody:
        'नीचे दिया गया हर कार्यक्रम वास्तविक है और सीधे आधिकारिक पोर्टल से जुड़ा है। चूँकि आवेदन की तिथियाँ हर वर्ष बदलती हैं, "डेमो प्रविष्टि" वाली तिथियाँ कैलेंडर अभ्यास के लिए हैं—आवेदन से पहले हमेशा आधिकारिक वेबसाइट पर ताज़ा तिथियाँ जाँचें।',
      oppSearchPlaceholder: 'छात्रवृत्ति, IIT इंटर्नशिप, फ़ेलोशिप, परीक्षा खोजें...',
      lesserKnownToggle: 'कम-ज्ञात बड़े अवसर (What Nobody Told Me)',
      showingOpportunities: 'दिखाए जा रहे अवसर:',
      noOppsTitle: 'इस फ़िल्टर से कोई अवसर मेल नहीं खाया',
      noOppsDesc: 'सभी सत्यापित छात्रवृत्तियाँ, फ़ेलोशिप और परीक्षाएँ देखने के लिए फ़िल्टर रीसेट करें।',
      whatNobodyTellsYou: 'जो ज़्यादातर छात्रों को नहीं बताया जाता',
      eligibility: 'पात्रता',
      benefits: 'लाभ और आर्थिक सहायता',
      cycleWindow: 'सामान्य समय चक्र',
      demoEntry: 'डेमो प्रविष्टि',
      verifiedPortal: 'सत्यापित पोर्टल',
      addToCalendar: 'डेडलाइन ट्रैक करें',
      addedToCalendar: 'कैलेंडर में जुड़ गया',
      share: 'शेयर करें',
      shared: 'लिंक कॉपी हुआ',
      uniSearchPlaceholder: 'IIT, NIT, IISER, NLU, केंद्रीय विश्वविद्यालय, कोर्स या परीक्षा खोजें...',
      allInstitutionTypes: 'सभी संस्थान प्रकार',
      showingUniversities: 'दिखाए जा रहे संस्थान:',
      noUnisTitle: 'इस फ़िल्टर से कोई संस्थान नहीं मिला',
      noUnisDesc: 'सभी सत्यापित विश्वविद्यालय देखने के लिए खोज या फ़िल्टर रीसेट करें।',
      established: 'स्थापना',
      notableCourses: 'प्रमुख पाठ्यक्रम (Courses)',
      entranceExams: 'प्रवेश परीक्षाएँ',
      admissionProcess: 'प्रवेश प्रक्रिया',
      feeNote: 'शुल्क जानकारी',
      scholarshipNote: 'छात्रवृत्ति और सहायता',
    },
    roadmap: {
      kicker: 'मेरा अगला कदम (My Next Kadam)',
      title: 'व्यक्तिगत मल्टी-पाथवे रोडमैप',
      subtitle:
        'AGLA KADAM कभी आप पर एक ही रास्ता नहीं थोपता। अपना स्तर, रुचियाँ और बजट बताएँ और तीन अलग-अलग व्यावहारिक रास्ते पाएँ—अगले 30 दिन के कदम, माइलस्टोन, खर्च, जोखिम और बैकअप विकल्पों सहित।',
      step1Tab: '01. योग्यता',
      step2Tab: '02. स्थान और बजट',
      step3Tab: '03. रुचियाँ और ताक़त',
      step4Tab: '04. पसंदीदा दिशाएँ',
      stepCounter: 'चरण',
      eduStageLabel: 'वर्तमान शैक्षिक स्तर',
      streamLabel: 'योग्यता, स्ट्रीम या विषय',
      streamPlaceholder: 'जैसे, कक्षा 12 PCM, B.Com, डिप्लोमा मैकेनिकल, BA इतिहास...',
      cityLabel: 'वर्तमान शहर / राज्य',
      cityPlaceholder: 'जैसे, जयपुर, राजस्थान या लखनऊ, उत्तर प्रदेश',
      destLabel: 'पढ़ाई / काम के लिए पसंदीदा स्थान',
      destPlaceholder: 'अपना राज्य, भारत के बड़े शहर, विदेश, कहीं भी...',
      budgetLabel: 'बजट / आर्थिक सीमा',
      interestsLabel: 'रुचियाँ (कॉमा से अलग लिखें)',
      interestsPlaceholder: 'जैसे, जीवविज्ञान, कानून, ऐप डिज़ाइन, पर्यावरण, लेखन...',
      strengthsLabel: 'आपकी ताक़त (कॉमा से अलग लिखें)',
      strengthsPlaceholder: 'जैसे, समस्या सुलझाना, हिन्दी और अंग्रेज़ी संवाद, धैर्य...',
      goalsLabel: 'व्यक्तिगत लक्ष्य (कॉमा से अलग लिखें)',
      goalsPlaceholder: 'जैसे, 2 साल में अच्छी नौकरी, रिसर्च पेपर लिखना, लोक सेवा...',
      tracksPrompt: 'आप किन-किन दिशाओं को देखना चाहते हैं? (एक से अधिक चुनें)',
      generateBtn: 'मेरा अगला कदम रोडमैप बनाएँ',
      generatingBtn: '3 अलग-अलग रास्ते तैयार हो रहे हैं...',
      aiPlanKicker: 'AI-निर्मित मल्टी-पाथवे योजना · आधिकारिक तिथियाँ और शुल्क जाँचें',
      detailedViewBtn: 'विस्तृत रास्ता देखें',
      compareAllBtn: 'तीनों रास्तों की तुलना करें',
      saveRoadmapBtn: 'रोडमैप सेव करें',
      optionLabel: 'विकल्प',
      pathwayLabel: 'रास्ता',
      inspectMilestones: 'पूरे चरण और माइलस्टोन देखें →',
      immediateHorizon: 'तत्काल (अगले 30 दिन)',
      shortTermHorizon: 'अल्पकालिक (3–12 महीने)',
      longTermHorizon: 'दीर्घकालिक (1–4 वर्ष)',
      requiredQualifications: 'आवश्यक योग्यताएँ',
      keyExaminations: 'प्रमुख परीक्षाएँ',
      skillsToBuild: 'सीखने योग्य कौशल (Skills)',
      estimatedCost: 'अनुमानित खर्च और छात्रवृत्ति नोट',
      possibleInstitutions: 'संभावित संस्थान',
      opportunitiesToWatch: 'ध्यान रखने योग्य अवसर',
      risksAlternatives: 'जोखिम और बैकअप विकल्प',
      verifiedGuidesHeading: 'इस रास्ते के लिए सत्यापित AGLA KADAM गाइड',
      immediateNextStep: 'तुरंत अगला कदम:',
      keyRiskAlternative: 'मुख्य जोखिम / विकल्प:',
    },
    kadamAi: {
      kicker: 'Kadam AI · बहुभाषी · वॉइस-फ़र्स्ट मेंटर',
      title: 'बिल्कुल शुरुआत से कुछ भी पूछें—बिना किसी झिझक के',
      subtitle:
        'हर उत्तर सत्यापित AGLA KADAM गाइड और AI मार्गदर्शन को अलग-अलग दिखाता है और आधिकारिक पोर्टल पर ताज़ा तिथियाँ जाँचने की याद दिलाता है।',
      noStupidMode: 'कोई सवाल छोटा नहीं मोड (बिल्कुल आसान भाषा)',
      newConversation: 'नई बातचीत शुरू करें',
      savedConversations: 'सेव की गई बातचीत',
      noConversations: 'आपकी बातचीत यहाँ सेव होगी।',
      welcomeTitle: 'यहाँ कोई भी सवाल छोटा या बुनियादी नहीं है।',
      welcomeSubtitle:
        'आप सरल हिन्दी, हिंग्लिश (Hindi-English), English या తెలుగు में पूछ सकते हैं। बोलकर पूछने के लिए माइक बटन दबाएँ।',
      youLabel: 'आप',
      assistantHeader: 'Kadam AI · AI मार्गदर्शन (आधिकारिक पोर्टल पर ताज़ा तिथियाँ जाँचें)',
      citedGuidesHeading: 'संदर्भित सत्यापित AGLA KADAM गाइड',
      thinkingText: 'Kadam AI आपके लिए सरल और स्पष्ट उत्तर तैयार कर रहा है...',
      recordingPlaceholder: 'सुन रहे हैं... बोलना पूरा होने पर माइक फिर दबाएँ।',
      inputPlaceholder: 'अपना सवाल आसान शब्दों में हिन्दी या हिंग्लिश में लिखें...',
      sendBtn: 'भेजें',
      voiceStartTitle: 'बोलकर पूछें',
      voiceStopTitle: 'रिकॉर्डिंग रोकें',
      starters: [
        'मैंने अभी 10वीं पास की है और सब Science लेने को कह रहे हैं। मेरे पास और कौन-कौन से अच्छे विकल्प हैं?',
        'Patent (पेटेंट) क्या होता है और क्या भारत में कॉलेज का छात्र अपना पेटेंट फाइल कर सकता है?',
        'नौकरी के ऑफ़र लेटर में CTC और In-Hand Salary का अंतर बिल्कुल शुरुआत से समझाएँ।',
        'छोटे शहर के कॉलेज का छात्र IIT समर रिसर्च इंटर्नशिप (Summer Research Internship) कैसे पा सकता है?',
      ],
    },
    tools: {
      kicker: 'व्यावहारिक मार्गदर्शन टूल्स',
      title: 'दस्तावेज़ समझें, सच्चाई जाँचें और परिवार से बातचीत की तैयारी करें',
      subtitle:
        'हर टूल विद्यार्थियों की असली उलझनों के लिए बनाया गया है—सरकारी नोटिफ़िकेशन पढ़ना, जॉब ऑफ़र लेटर समझना, छूटी हुई छात्रवृत्तियाँ खोजना या घर पर नया करियर समझाना।',
      outputLanguage: 'उत्तर की भाषा:',
      tabDecoder: 'नोटिफ़िकेशन और डॉक्यूमेंट डिकोडर',
      tabParents: 'माता-पिता को समझाएँ',
      tabGap: 'अवसर गैप डिटेक्टर',
      tabWhatCanIDo: 'इससे मैं क्या कर सकता हूँ?',
      tabReality: 'करियर रियलिटी चेक',
      decoderTitle: 'इस नोटिफ़िकेशन या डॉक्यूमेंट को आसान भाषा में समझें',
      decoderDesc:
        'परीक्षा नोटिफ़िकेशन, छात्रवृत्ति सर्कुलर, कॉलेज एडमिशन लेटर, मार्कशीट या जॉब ऑफ़र लेटर का PDF/फ़ोटो (5 MB तक) अपलोड करें या टेक्स्ट पेस्ट करें।',
      privacyTitle: 'पूर्ण गोपनीयता सुरक्षा',
      privacyBody:
        'अपलोड की गई फ़ाइलें केवल मेमोरी में पढ़ी जाती हैं और तुरंत हटा दी जाती हैं—कभी सेव नहीं होतीं। कृपया अपलोड से पहले आधार, PAN या फ़ोन नंबर छिपा दें।',
      decodingWhat: 'आप क्या समझना चाहते हैं?',
      modeNotification: 'आधिकारिक नोटिफ़िकेशन',
      modeDocument: 'मार्कशीट / ऑफ़र लेटर',
      uploadLabel: 'फ़ाइल अपलोड करें (PDF, PNG, JPG, WEBP · अधिकतम 5 MB)',
      chooseFile: 'डिकोड करने के लिए PDF या फ़ोटो चुनें',
      chooseFileHint: 'परीक्षा ब्रोशर, शुल्क नोटिस, ऑफ़र लेटर, प्रवेश पत्र',
      pasteLabel: 'या नोटिफ़िकेशन / दस्तावेज़ का टेक्स्ट पेस्ट करें',
      pastePlaceholder: 'पात्रता नियम, CTC विवरण, नोटिस पीरियड या छात्रवृत्ति शर्तें यहाँ पेस्ट करें...',
      decodeBtn: 'अभी आसान भाषा में समझें',
      decodingBtn: 'आसान भाषा में विश्लेषण हो रहा है...',
      whatYouReceive: 'आपको क्या मिलेगा',
      zeroJargonTitle: 'बिना कठिन शब्दों के साफ़ और उपयोगी जानकारी',
      receiveItems: [
        '1. दस्तावेज़ का असली मतलब सरल और साफ़ भाषा में।',
        '2. पात्रता नियम और छिपी हुई शर्तें आसानी से।',
        '3. महत्वपूर्ण तिथियाँ जिन्हें एक क्लिक में कैलेंडर में सेव किया जा सके।',
        '4. ज़रूरी दस्तावेज़, सर्टिफ़िकेट और फीस/CTC शर्तों की व्याख्या।',
        '5. सावधानियाँ, सर्विस बॉन्ड चेतावनियाँ और अगले आधिकारिक कदम।',
      ],
      readingClauses: 'दस्तावेज़ की शर्तों को आसान भाषा में समझा जा रहा है...',
      extractingSub: 'पात्रता, तिथियाँ, ज़रूरी दस्तावेज़ और संभावित जोखिम निकाले जा रहे हैं।',
      aiDecodedKicker: 'AI-आधारित सरल व्याख्या · मूल दस्तावेज़ से मिलाएँ',
      plainSummary: 'सरल सारांश',
      importantDates: 'महत्वपूर्ण तिथियाँ',
      eligibilityHighlights: 'पात्रता के मुख्य बिंदु',
      requiredDocuments: 'आवश्यक दस्तावेज़',
      feesClauses: 'शुल्क, CTC या वित्तीय शर्तें',
      stepByStepActions: 'चरण-दर-चरण अगले कदम',
      risksRedFlags: 'जोखिम, बारीक शर्तें और सावधानियाँ',
      parentsTitle: 'माता-पिता को समझाएँ (Explain It to My Parents)',
      parentsDesc:
        'कई बार परिवार सिर्फ़ इसलिए चिंतित होता है क्योंकि उन्हें नए करियर रास्ते की पूरी जानकारी नहीं होती। अवधि, वास्तविक खर्च, नौकरी की स्थिरता और बैकअप योजना के साथ एक संतुलित, प्रिंट करने योग्य रिपोर्ट बनाएँ।',
      pathwayInputLabel: 'कौन-सा करियर, डिग्री या रास्ता समझाना है?',
      pathwayPlaceholder: 'जैसे, NID से B.Des, IISER में BS-MS रिसर्च, CLAT और Law, जर्मनी में MS',
      stageSelectLabel: 'विद्यार्थी का वर्तमान स्तर',
      concernsLabel: 'परिवार के मुख्य सवाल या चिंताएँ (वैकल्पिक)',
      concernsPlaceholder: 'जैसे, कुल खर्च, पढ़ाई के बाद नौकरी की सुरक्षा, दूसरे शहर में सुरक्षा, बैकअप विकल्प',
      generateBriefBtn: 'परिवार के लिए रिपोर्ट बनाएँ',
      generatingBriefBtn: 'संतुलित रिपोर्ट तैयार हो रही है...',
      respectfulClarity: 'सम्मानजनक और स्पष्ट संवाद के लिए',
      tryCommonTopic: 'परिवार के आम विषयों में से चुनें',
      draftingBrief: 'माता-पिता के लिए संतुलित विवरण तैयार हो रहा है...',
      familyBriefKicker: 'AGLA KADAM · पारिवारिक चर्चा रिपोर्ट',
      execSummary: 'मुख्य सारांश',
      whatInvolves: 'इस रास्ते में क्या होता है',
      durationTimeline: 'अवधि और समय-रेखा',
      realisticCost: 'अनुमानित वास्तविक खर्च',
      careerOutlook: 'करियर और आय की संभावनाएँ',
      eligibilityExams: 'पात्रता और प्रमुख परीक्षाएँ',
      honestRisks: 'ईमानदार जोखिम और बैकअप योजना',
      howParentsSupport: 'माता-पिता कैसे सहयोग कर सकते हैं',
      specialRunBtn: 'विश्लेषण करें',
      specialRunningBtn: 'संभावनाएँ खोजी जा रही हैं...',
      whyItMatters: 'यह क्यों महत्वपूर्ण है',
      realityChallenges: 'वास्तविकता और चुनौतियाँ',
      immediateStep: 'तुरंत अगला कदम',
      relatedVerifiedGuides: 'संबंधित सत्यापित गाइड',
      curatedLesserKnown: 'चुनिंदा कम-ज्ञात अवसर',
    },
    dashboard: {
      kicker: 'स्टूडेंट डैशबोर्ड · आपका अगला कदम',
      welcomePrefix: 'स्वागत है,',
      kpiRoadmaps: 'सेव किए रोडमैप',
      kpiDeadlines: 'सक्रिय डेडलाइन',
      kpiAchievements: 'दर्ज उपलब्धियाँ',
      kpiSaved: 'सेव की सामग्री',
      tabOverview: 'सारांश',
      tabRoadmaps: 'रोडमैप',
      tabCalendar: 'अवसर कैलेंडर',
      tabLocker: 'उपलब्धि लॉकर और टाइमलाइन',
      tabSaved: 'सेव और प्रगति',
      tabAiHistory: 'Kadam AI इतिहास',
      tabProfile: 'प्रोफ़ाइल और गोपनीयता',
      myRoadmapsHeading: 'मेरे अगला कदम रोडमैप',
      viewAllRoadmaps: 'सभी रोडमैप देखें →',
      buildRoadmapLink: 'रोडमैप बनाएँ →',
      noRoadmapTitle: 'आपने अभी तक कोई व्यक्तिगत रोडमैप सेव नहीं किया है।',
      noRoadmapDesc:
        'अपने स्तर, रुचियों और बजट के बारे में कुछ आसान सवालों के जवाब देकर अपने लिए 3 अलग-अलग रास्तों की तुलना करें।',
      generateRoadmapCta: 'मेरा अगला कदम बनाएँ',
      milestonesCompleted: 'चरण पूरे हुए',
      openChecklist: 'चेकलिस्ट खोलें →',
      upcomingDeadlinesHeading: 'आगामी अवसर और परीक्षा तिथियाँ',
      manageCalendar: 'कैलेंडर प्रबंधित करें →',
      noDeadlinesText: 'अभी कोई अंतिम तिथि ट्रैक नहीं की गई है। Kadam Discover, Document Decoder या अवसर कैलेंडर से तिथियाँ जोड़ें।',
      savedItemsHeading: 'सेव किए गए गाइड और अवसर',
      viewAll: 'सभी देखें',
      noBookmarksHint: 'अपनी व्यक्तिगत अध्ययन सूची बनाने के लिए गाइड, छात्रवृत्तियाँ या विश्वविद्यालय बुकमार्क करें। लोकप्रिय शुरुआत:',
      activeProgressHeading: 'सीखने की सक्रिय प्रगति',
      openJourneys: 'लर्निंग जर्नी देखें →',
      noProgressHint: 'अपनी प्रगति ट्रैक करने के लिए ज्ञान संसार में पढ़े गए गाइड या किसी लर्निंग जर्नी के चरण चिह्नित करें।',
      exploreHeading: 'AGLA KADAM एक्सप्लोर करें',
      completeProfileTitle: 'अपनी विद्यार्थी प्रोफ़ाइल पूरी करें',
      completeProfileDesc: 'इससे Kadam AI और My Next Kadam आपके स्तर और बजट के अनुसार सटीक सुझाव दे पाते हैं।',
      setupProfileLink: 'प्रोफ़ाइल सेट करें',
      pillarsReady: 'मुख्य सुविधाएँ तैयार हैं',
      pillarOverview: 'प्लेटफ़ॉर्म परिचय और ग्लोबल सर्च →',
      pillarUniverse: 'The Agla Kadam Universe (150 विषय · 18 श्रेणियाँ) →',
      pillarPathways: 'इंटरैक्टिव Possibility Map और 11 लर्निंग जर्नी →',
      pillarDiscover: 'Kadam Discover (अवसर और विश्वविद्यालय) →',
      pillarAi: 'Kadam AI से पूछें (English · తెలుగు · हिन्दी · वॉइस-फ़र्स्ट) →',
      pillarTools: 'डॉक्यूमेंट डिकोडर, पेरेंट रिपोर्ट और रियलिटी चेक →',
      savedConversationsTitle: 'सेव की गई Kadam AI बातचीत',
      savedConversationsDesc: 'पुरानी बातचीत फिर से पढ़ें या कभी भी हटाएँ।',
      messagesCount: 'संदेश',
      noConversationsYet: 'अभी कोई Kadam AI बातचीत सेव नहीं है।',
      studentProfileTitle: 'विद्यार्थी प्रोफ़ाइल',
      studentProfileDesc: 'इसका उपयोग केवल आपके रोडमैप और Kadam AI मार्गदर्शन को बेहतर बनाने के लिए होता है। यह कभी सार्वजनिक नहीं होती।',
      eduLevelLabel: 'वर्तमान शिक्षा स्तर',
      streamDisciplineLabel: 'स्ट्रीम / विषय',
      locationLabel: 'वर्तमान शहर / राज्य',
      budgetLabel: 'अनुमानित वार्षिक पढ़ाई का बजट',
      interestsLabel: 'रुचियाँ (कॉमा से अलग)',
      strengthsLabel: 'ताक़त (कॉमा से अलग)',
      goalsLabel: 'लक्ष्य (कॉमा से अलग)',
      saveProfileBtn: 'प्रोफ़ाइल सेव करें',
      profileSavedToast: 'आपकी प्रोफ़ाइल सेव हो गई है।',
      privacyTitle: 'गोपनीयता और डेटा नियंत्रण',
      privacyDesc:
        'आपका डेटा पूरी तरह आपका है। डिकोडर में अपलोड दस्तावेज़ कभी सर्वर पर सेव नहीं होते, और आप कभी भी अपना डेटा डाउनलोड या हटा सकते हैं।',
      exportJsonBtn: 'मेरा पूरा डेटा डाउनलोड करें (JSON)',
      clearAiHistoryBtn: 'पूरा Kadam AI इतिहास हटाएँ',
      confirmDeleteAiPrompt: 'क्या आप सभी सेव की गई Kadam AI बातचीत स्थायी रूप से हटाना चाहते हैं?',
      confirmDeleteBtn: 'हटाने की पुष्टि करें',
      preferredLanguageTitle: 'पसंदीदा भाषा (Language)',
      preferredLanguageDesc: 'यह आपकी प्रोफ़ाइल में सुरक्षित रूप से सेव होती है और अगली बार लॉग इन करने पर बिना किसी डेटा नुकसान के अपने आप लागू होती है।',
      calendarTitle: 'अवसर कैलेंडर (Opportunity Calendar)',
      calendarDesc: 'परीक्षा, छात्रवृत्ति, इंटर्नशिप और प्रवेश की अंतिम तिथियों को एक ही शांत सूची में ट्रैक करें।',
      addDeadlineTitle: 'नई डेडलाइन जोड़ें',
      deadlineNamePlaceholder: 'जैसे, GATE रजिस्ट्रेशन या NSP छात्रवृत्ति',
      dueDateLabel: 'अंतिम तिथि',
      officialUrlLabel: 'आधिकारिक पोर्टल लिंक (वैकल्पिक)',
      notesLabel: 'नोट्स (वैकल्पिक)',
      addDeadlineBtn: 'कैलेंडर में जोड़ें',
      statusWatching: 'नज़र में है',
      statusInProgress: 'आवेदन जारी',
      statusSubmitted: 'जमा किया गया',
      lockerTitle: 'उपलब्धि लॉकर और ग्रोथ टाइमलाइन',
      lockerDesc: 'अपने सर्टिफ़िकेट, प्रोजेक्ट, प्रतियोगिताएँ, रिसर्च और शैक्षिक उपलब्धियाँ एक जगह सहेजें।',
      lockerView: 'लॉकर ग्रिड',
      timelineView: 'ग्रोथ टाइमलाइन',
      addAchievementTitle: 'नई उपलब्धि दर्ज करें',
      achievementTitleLabel: 'उपलब्धि का शीर्षक',
      issuerLabel: 'प्रदान करने वाली संस्था',
      dateEarnedLabel: 'प्राप्ति तिथि',
      reflectionLabel: 'आपने क्या सीखा (वैकल्पिक)',
      skillsLabel: 'सीखे गए कौशल (कॉमा से अलग)',
      addAchievementBtn: 'उपलब्धि सेव करें',
      noAchievementsYet: 'अभी कोई उपलब्धि दर्ज नहीं है। अपना व्यक्तिगत शैक्षिक और कौशल रिकॉर्ड बनाना शुरू करें।',
      allSaved: 'सभी',
      guidesFilter: 'गाइड',
      opportunitiesFilter: 'अवसर',
      universitiesFilter: 'विश्वविद्यालय',
      journeysFilter: 'लर्निंग जर्नी',
    },
  },

  te: {
    common: {
      brand: 'AGLA KADAM',
      tagline: 'మీ తదుపరి అడుగు. మీ భవిష్యత్తు. మీ ఎంపిక.',
      taglineSpaced: 'మీ తదుపరి అడుగు · మీ భవిష్యత్తు · మీ ఎంపిక',
      loadingWorkspace: 'మీ వర్క్‌స్పేస్ లోడ్ అవుతోంది...',
      signOut: 'సైన్ అవుట్',
      save: 'సేవ్ చేయండి',
      saved: 'సేవ్ అయింది',
      cancel: 'రద్దు చేయండి',
      delete: 'తొలగించండి',
      deleting: 'తొలగించబడుతోంది...',
      clear: 'క్లియర్ చేయండి',
      resetFilters: 'ఫిల్టర్లు రీసెట్ చేయండి',
      back: 'వెనక్కి',
      continue: 'కొనసాగండి',
      open: 'తెరవండి',
      officialSite: 'అధికారిక వెబ్‌సైట్',
      officialPortal: 'అధికారిక పోర్టల్',
      listen: 'వినండి',
      stopAudio: 'ఆడియో ఆపండి',
      copy: 'కాపీ చేయండి',
      copied: 'కాపీ అయింది',
      printPdf: 'ప్రింట్ / PDF సేవ్',
      translatingContent: 'తెలుగులో పూర్తి గైడ్ మరియు వివరాలు లోడ్ అవుతున్నాయి...',
      translationError: 'తెలుగు అనువాదం లోడ్ కాలేదు—ప్రస్తుతం ధృవీకరించిన ఆంగ్ల వివరాలు చూపుతున్నాము.',
      retryTranslation: 'మళ్లీ ప్రయత్నించండి',
      allStages: 'అన్ని దశలు',
      allCategories: 'అన్ని విభాగాలు',
      allTracks: 'అన్ని ట్రాక్‌లు',
      allStatuses: 'అన్ని స్థితులు',
      completeGuide: 'పూర్తి గైడ్',
      scheduled: 'తదుపరి బ్యాచ్',
      batch: 'బ్యాచ్',
      verified: 'ధృవీకరించబడింది',
      minRead: 'నిమిషాలు చదవండి',
      savedToDashboard: 'డ్యాష్‌బోర్డ్‌లో సేవ్ అయింది',
      saveGuide: 'గైడ్ సేవ్ చేయండి',
      markCompleted: 'పూర్తయినట్లు గుర్తించండి',
      completed: 'పూర్తయింది',
      askKadamAi: 'Kadam AI ని అడగండి',
      explainToParents: 'తల్లిదండ్రులకు వివరించండి',
      languageLabel: 'భాష',
    },
    nav: {
      dashboard: 'డ్యాష్‌బోర్డ్',
      universe: 'విజ్ఞాన భాండాగారం',
      pathways: 'కెరీర్ మార్గాలు',
      discover: 'అవకాశాలు',
      roadmap: 'నా తదుపరి అడుగు',
      kadamAi: 'Kadam AI',
      tools: 'టూల్స్',
      exploreOverview: 'ప్లాట్‌ఫారమ్ పరిచయం',
      openMenu: 'మెనూ తెరవండి',
      closeMenu: 'మెనూ మూసివేయండి',
    },
    footer: {
      mission:
        'భారతదేశంలోని ఏ విద్యార్థి కూడా కేవలం తమకు తెలియకపోవడం వల్ల విద్య, స్కాలర్‌షిప్, పరిశోధన లేదా కెరీర్ అవకాశాన్ని కోల్పోకూడదనే లక్ష్యంతో నిర్మించబడింది.',
      exploreHeading: 'అన్వేషించండి',
      studentDashboard: 'స్టూడెంట్ డ్యాష్‌బోర్డ్',
      platformOverview: 'ప్లాట్‌ఫారమ్ పరిచయం',
      universeLink: 'The Agla Kadam Universe',
      pathwaysLink: 'Possibility Map & జర్నీలు',
      discoverLink: 'Kadam Discover',
      verificationHeading: 'ధృవీకరణ & గోప్యతా ప్రమాణం',
      verificationBody:
        'ధృవీకరించిన గైడ్లు చివరి తనిఖీ తేదీ మరియు అధికారిక ప్రభుత్వ/విశ్వవిద్యాలయ పోర్టల్ లింకులను చూపుతాయి. దరఖాస్తు చేసే ముందు ఎల్లప్పుడూ అధికారిక పోర్టల్‌లో తాజా తేదీలు మరియు ఫీజులు తనిఖీ చేయండి. డీకోడర్‌లో అప్‌లోడ్ చేసిన ఫైళ్ళు ఎప్పుడూ స్టోర్ చేయబడవు.',
      copyright: 'AGLA KADAM. విద్యా మార్గదర్శకత్వం మరియు అవకాశాల వేదిక.',
      batchInfo: 'బ్యాచ్ 1 ధృవీకరించిన లైబ్రరీ (15 పూర్తి గైడ్లు · 18 విభాగాలలో 150 అంశాలు)',
    },
    auth: {
      indiaAllStages: 'భారతదేశం · అన్ని విద్యార్థి దశలు',
      kicker: 'విద్యా మార్గదర్శకత్వం & అవకాశాల అన్వేషణ',
      headline: 'కేవలం ఎవరూ చెప్పకపోవడం వల్ల ఏ విద్యార్థి కూడా అవకాశాన్ని కోల్పోకూడదు.',
      subtitle:
        '10వ తరగతి తర్వాత నిర్ణయాలు, స్కాలర్‌షిప్‌ల నుండి పరిశోధన పత్రాలు, పేటెంట్లు, ఉన్నత విద్య మరియు కెరీర్ మార్గాల వరకు—English, తెలుగు మరియు हिन्दीలో ధృవీకరించిన గైడ్లు, రోడ్‌మ్యాప్‌లు మరియు Kadam AI పొందండి.',
      highlight1Title: 'The Agla Kadam Universe',
      highlight1Desc: 'అధికారిక ప్రభుత్వ & సంస్థాగత లింకులతో 18 విభాగాలలో 150 అంశాలు.',
      highlight2Title: 'My Next Kadam & Kadam AI',
      highlight2Desc: 'వ్యక్తిగత బహుళ-మార్గ రోడ్‌మ్యాప్‌లు, డాక్యుమెంట్ డీకోడర్ మరియు వాయిస్ మార్గదర్శకత్వం.',
      highlight3Title: 'వ్యక్తిగత విద్యార్థి వర్క్‌స్పేస్',
      highlight3Desc: 'గైడ్లు సేవ్ చేయండి, పరీక్ష గడువులు ట్రాక్ చేయండి మరియు మీ Achievement Locker నిర్మించండి.',
      protectedFooter: 'Firebase Authentication & వ్యక్తిగత భద్రతా నియమాలతో సురక్షితం',
      stagesFooter: 'స్కూల్ · UG · PG · పరిశోధన · ప్రారంభ కెరీర్',
      signInKicker: 'విద్యార్థి సైన్ ఇన్',
      welcomeBack: 'తిరిగి స్వాగతం',
      signInDesc: 'మీ AGLA KADAM డ్యాష్‌బోర్డ్, రోడ్‌మ్యాప్‌లు, బుక్‌మార్క్‌లు మరియు గడువులను చూడటానికి సైన్ ఇన్ చేయండి.',
      signUpKicker: 'కొత్త విద్యార్థి నమోదు',
      beginNextStep: 'మీ తదుపరి అడుగు ప్రారంభించండి',
      signUpDesc: 'రోడ్‌మ్యాప్‌లు సేవ్ చేయడానికి, గడువులు ట్రాక్ చేయడానికి ఉచిత AGLA KADAM ఖాతాను సృష్టించండి.',
      backToSignIn: 'సైన్ ఇన్‌కు తిరిగి వెళ్ళండి',
      recoveryKicker: 'ఖాతా పునరుద్ధరణ',
      resetPasswordTitle: 'పాస్‌వర్డ్ రీసెట్ చేయండి',
      resetPasswordDesc: 'మీ నమోదిత ఇమెయిల్ చిరునామాను నమోదు చేయండి—మేము పాస్‌వర్డ్ రీసెట్ లింక్ పంపుతాము.',
      emailLabel: 'ఇమెయిల్ చిరునామా',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'పాస్‌వర్డ్',
      passwordPlaceholder: 'మీ పాస్‌వర్డ్ నమోదు చేయండి',
      forgotPasswordLink: 'పాస్‌వర్డ్ మర్చిపోయారా?',
      showPassword: 'పాస్‌వర్డ్ చూపించు',
      hidePassword: 'పాస్‌వర్డ్ దాచు',
      signInBtn: 'సైన్ ఇన్ చేయండి',
      signingInBtn: 'సైన్ ఇన్ అవుతోంది...',
      fullNameLabel: 'పూర్తి పేరు',
      fullNamePlaceholder: 'ఉదా., అనన్య శర్మ',
      newPasswordPlaceholder: 'కనీసం 8 అక్షరాలు',
      passwordHint: 'అక్షరాలు మరియు అంకెలతో కనీసం 8 అక్షరాల పాస్‌వర్డ్ ఎంచుకోండి.',
      confirmPasswordLabel: 'పాస్‌వర్డ్ నిర్ధారించండి',
      confirmPasswordPlaceholder: 'పాస్‌వర్డ్ మళ్ళీ నమోదు చేయండి',
      createAccountBtn: 'ఖాతా సృష్టించండి',
      creatingAccountBtn: 'ఖాతా సృష్టించబడుతోంది...',
      resetSentTitle: 'పాస్‌వర్డ్ రీసెట్ ఇమెయిల్ పంపబడింది',
      resetSentDescBefore: 'ఈ ఇమెయిల్‌కు AGLA KADAM ఖాతా ఉంటే:',
      resetSentDescAfter: 'కొద్దిసేపట్లో మీకు పాస్‌వర్డ్ రీసెట్ లింక్ అందుతుంది. దయచేసి స్పామ్ ఫోల్డర్ కూడా తనిఖీ చేయండి.',
      returnToSignIn: 'సైన్ ఇన్‌కు తిరిగి వెళ్ళండి',
      sendResetBtn: 'రీసెట్ లింక్ పంపండి',
      sendingResetBtn: 'పంపబడుతోంది...',
      orDivider: 'లేదా',
      continueGoogle: 'Google తో కొనసాగండి',
      newToApp: 'AGLA KADAM కి కొత్తవారా?',
      createAnAccount: 'కొత్త ఖాతా సృష్టించండి',
      alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
      signInLink: 'సైన్ ఇన్ చేయండి',
      rememberedPassword: 'పాస్‌వర్డ్ గుర్తుకు వచ్చిందా?',
      privacyNote: 'మీ సేవ్ చేసిన రోడ్‌మ్యాప్‌లు, గడువులు మరియు విజయాలు పూర్తిగా గోప్యంగా ఉంటాయి.',
      errInvalidEmail: 'దయచేసి సరైన ఇమెయిల్ చిరునామాను నమోదు చేయండి.',
      errMissingPassword: 'దయచేసి మీ పాస్‌వర్డ్ నమోదు చేయండి.',
      errShortName: 'దయచేసి మీ పూర్తి పేరు నమోదు చేయండి (కనీసం 2 అక్షరాలు).',
      errShortPassword: 'పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి.',
      errPasswordMismatch: 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు. దయచేసి మళ్ళీ తనిఖీ చేయండి.',
      errResetEmail: 'దయచేసి మీ ఖాతాకు సంబంధించిన ఇమెయిల్ నమోదు చేయండి.',
    },
    home: {
      heroTitle: 'మీ భవిష్యత్తులో మీరు అనుకున్న దానికంటే ఎక్కువ అవకాశాలు ఉన్నాయి.',
      heroSubtitle:
        'లక్షలాది మంది విద్యార్థులు కేవలం తెలియకపోవడం వల్లే పరీక్షలు, స్కాలర్‌షిప్‌లు, రీసెర్చ్ ల్యాబ్‌లు, పేటెంట్లు మరియు కెరీర్లను కోల్పోతున్నారు. AGLA KADAM పూర్తిగా సున్నా నుండి ధృవీకరించిన ఎంపికలను చూపుతుంది.',
      searchPlaceholder: 'మీరు ఎప్పుడూ తెలుసుకోవాలనుకున్నది ఏమిటి?',
      exploreBtn: 'అన్వేషించండి',
      tryAsking: 'ఇవి అడిగి చూడండి:',
      samples: ['పేటెంట్ ఎలా ఫైల్ చేయాలి', '10వ తరగతి తర్వాత', 'UPSC సున్నా నుండి', 'విదేశాల్లో స్కాలర్‌షిప్ విద్య', 'NSP స్కాలర్‌షిప్‌లు'],
      instantMatchesFor: 'తక్షణ ఫలితాలు:',
      universeTopicsHeading: 'విజ్ఞాన భాండాగారం అంశాలు',
      discoverOppsHeading: 'Kadam Discover అవకాశాలు',
      noExactMatch: 'ఖచ్చితమైన శీర్షిక దొరకలేదు—సులభమైన వివరణ కోసం Kadam AI ని అడగండి.',
      wantPlainAnswer: 'English, తెలుగు లేదా हिन्दी లో సులభమైన సమాధానం కావాలా?',
      askKadamAbout: 'Kadam AI ని అడగండి:',
      buildRoadmapBtn: 'నా తదుపరి అడుగు రోడ్‌మ్యాప్',
      openMapBtn: 'Possibility Map తెరవండి',
      askKadamLanguages: 'Kadam AI ని అడగండి (EN · తెలుగు · हिन्दी)',
      fig1Caption: 'చిత్రం 1 — ప్రతి అర్హత ఒక కొత్త ద్వారం, పరిమితి కాదు.',
      stat1Label: '18 విభాగాలలో అంశాలు',
      stat2Label: 'బ్యాచ్ 1 పూర్తి 16-విభాగాల గైడ్లు',
      stat3Label: 'దశలవారీ లెర్నింగ్ జర్నీలు',
      stat4Value: 'EN · తెలుగు · हिन्दी',
      stat4Label: 'వాయిస్ & డాక్యుమెంట్ AI మెంటర్',
      startKicker: 'మీరు ఎక్కడ ఉన్నా సరే',
      startTitle: 'మీ ప్రస్తుత అర్హత నుండి ప్రారంభించండి',
      startDesc: 'మీ దశను ఎంచుకుని తదుపరి మార్గాలు, పరీక్షలు, స్కాలర్‌షిప్‌లు మరియు ప్రత్యామ్నాయాలను చూడండి.',
      possibilityMapCta: 'Possibility Map',
      readGuidesCta: 'గైడ్లు చదవండి',
      pillar1Kicker: '01 · The Agla Kadam Universe',
      pillar1Title: 'సున్నా నుండి నేర్చుకునేవారి కోసం విజ్ఞాన భాండాగారం',
      pillar1Desc:
        'ప్రతి పూర్తి గైడ్ అవకాశం ఏమిటి, ఎందుకు ఉంది, అవసరమైన డాక్యుమెంట్లు, దశలవారీ విధానం, సాధారణ తప్పులు మరియు అధికారిక పోర్టల్ లింకులను వివరిస్తుంది.',
      pillar1Caption: 'చిత్రం 2 — విజ్ఞాన భాండాగారం: ప్రాథమిక, మధ్యస్థ మరియు అధునాతన స్పష్టత.',
      browseAllTopics: 'అన్ని 18 విభాగాలు & 150 అంశాలు చూడండి',
      pillar2Kicker: '02 · Possibility Map & My Next Kadam',
      pillar2Title: 'ఒకే మార్గాన్ని అంగీకరించకుండా బహుళ మార్గాలను పోల్చండి',
      pillar2Desc:
        'విద్యా, పోటీ పరీక్ష, పరిశోధన మరియు వృత్తి మార్గాలను చూడండి. ఆపై మూడు విభిన్న మార్గాలతో మీ వ్యక్తిగత My Next Kadam ప్రణాళికను రూపొందించండి.',
      pillar2Caption: 'చిత్రం 3 — విద్యా, సాంకేతిక మరియు పరిశోధన ద్వారాలు.',
      exploreMapBtn: 'Possibility Map చూడండి',
      generateRoadmapBtn: 'వ్యక్తిగత రోడ్‌మ్యాప్ రూపొందించండి',
      pillar3Kicker: '03 · Kadam Discover & విశ్వవిద్యాలయాలు',
      pillar3Title: 'స్కాలర్‌షిప్‌లు, ఫెలోషిప్‌లు మరియు ధృవీకరించిన సంస్థలు ఒకే చోట',
      pillar3Desc:
        'IITలు, NITలు, IISERలు, NLUలు, కేంద్ర/రాష్ట్ర విశ్వవిద్యాలయాలు మరియు అంతర్జాతీయ సంస్థలతో పాటు స్కాలర్‌షిప్‌లు మరియు ఇంటర్న్‌షిప్‌లను శోధించండి.',
      pillar3Caption: 'చిత్రం 4 — ధృవీకరించిన సంస్థలు మరియు పారదర్శక అవకాశాల ట్రాకింగ్.',
      openDiscoverBtn: 'Kadam Discover తెరవండి',
      exploreJourneysBtn: '11 లెర్నింగ్ జర్నీలు చూడండి',
      nobodyToldKicker: 'ఎవరూ చెప్పనివి (What Nobody Told Me)',
      nobodyToldTitle: 'చాలా మంది విద్యార్థులకు ఆలస్యంగా తెలిసే అద్భుతమైన అవకాశాలు',
      runGapDetector: 'అవకాశాల గ్యాప్ డిటెక్టర్ →',
      demoCycleNote: 'డెమో చక్రం · పోర్టల్ తనిఖీ చేయండి',
      aiBannerKicker: 'Kadam AI · వాయిస్-ఫస్ట్ · డాక్యుమెంట్ డీకోడర్',
      aiBannerTitle: 'అధికారిక నోటిఫికేషన్, ఆఫర్ లెటర్ లేదా అడగడానికి సంకోచించే ప్రాథమిక ప్రశ్న ఉందా?',
      aiBannerDesc:
        'English, తెలుగు లేదా हिन्दी లో "ఏ ప్రశ్న చిన్నది కాదు" మోడ్ ఆన్ చేసి, మాట్లాడి అడగండి లేదా ఏదైనా డాక్యుమెంట్ అర్థం చేసుకోండి.',
      openKadamAiBtn: 'Kadam AI తెరవండి',
      decodeDocBtn: 'డాక్యుమెంట్ లేదా నోటిఫికేషన్ డీకోడ్ చేయండి',
    },
    universe: {
      kicker: 'The Agla Kadam Universe · విజ్ఞాన లైబ్రరీ',
      title: '18 విద్యా & కెరీర్ రంగాలలో 150 ధృవీకరించిన అంశాలు',
      subtitle: 'సున్నా నుండి అర్థమయ్యేలా—16 విభాగాలు, అధికారిక లింకులు, FAQs మరియు 3 స్థాయిల వివరణలతో.',
      searchPlaceholder: 'పరీక్షలు, డిగ్రీలు, స్కాలర్‌షిప్‌లు, పేటెంట్లు శోధించండి...',
      categoryLabel: 'విభాగం',
      all18Categories: 'అన్ని 18 విభాగాలు (150 అంశాలు)',
      stageLabel: 'విద్యార్థి దశ',
      statusLabel: 'లభ్యత',
      completeOnly: 'పూర్తి 16-విభాగాల గైడ్లు (15)',
      scheduledOnly: 'రాబోయే బ్యాచ్‌లు (135)',
      showingTopics: 'చూపుతున్న అంశాలు:',
      inCategory: 'విభాగం:',
      noMatchTitle: 'ఈ ఫిల్టర్‌లో అంశాలు దొరకలేదు',
      noMatchDesc: 'ఫిల్టర్లను రీసెట్ చేయండి లేదా Kadam AI ని అడగండి.',
      resetAllFilters: 'అన్ని ఫిల్టర్లు రీసెట్ చేయండి',
      askAiAboutQuery: 'Kadam AI ని అడగండి',
      backToUniverse: 'విజ్ఞాన భాండాగారానికి తిరిగి వెళ్ళండి',
      all150Topics: 'The Agla Kadam Universe లోని అన్ని 150 అంశాలు',
      topicNotFound: 'అంశం కనుగొనబడలేదు',
      scheduledForBatch: 'షెడ్యూల్ చేసిన బ్యాచ్:',
      whyScheduledTitle: 'ఈ గైడ్ షెడ్యూల్ చేయబడిందని ఎందుకు చూపుతోంది?',
      whyScheduledBody:
        'AGLA KADAM ఎప్పుడూ అసంపూర్ణ వ్యాసాలను ప్రచురించదు. ప్రతి పూర్తి గైడ్ 16 ధృవీకరించిన విభాగాలతో 15 గైడ్ల బ్యాచ్‌లలో రూపొందించబడుతుంది.',
      getAiBriefing: 'Kadam AI ద్వారా తక్షణ పూర్తి వివరణ పొందండి',
      readBatch1Guides: 'బ్యాచ్ 1 పూర్తి గైడ్లు చదవండి',
      depthLabel: 'వివరణ స్థాయి',
      depthBeginner: 'ప్రాథమికం (సున్నా నుండి)',
      depthIntermediate: 'మధ్యస్థం',
      depthAdvanced: 'విస్తృత వివరాలు',
      secOverview: 'సారాంశం',
      secWhatItIs: '1. ఇది ఏమిటి?',
      secWhyItExists: '2. ఇది ఎందుకు ఉంది?',
      secWhoNeedsIt: '3. ఇది ఎవరికి అవసరం?',
      secHowItWorks: '4. ఇది ఎలా పనిచేస్తుంది?',
      secTypesPathways: '5. రకాలు & మార్గాలు',
      secEligibility: '6. అర్హత (Eligibility)',
      secDocuments: '7. అవసరమైన డాక్యుమెంట్లు',
      secSteps: '8. దశలవారీ విధానం',
      secWhatNext: '9. ఆ తర్వాత ఏమి జరుగుతుంది?',
      secBenefits: '10. అవకాశాలు & ప్రయోజనాలు',
      secRisksCosts: '11. పరిమితులు, ఖర్చులు & రిస్క్‌లు',
      secMistakes: '12. నివారించాల్సిన సాధారణ తప్పులు',
      secFaqs: '13. తరచుగా అడిగే ప్రశ్నలు (FAQs)',
      secOfficialPortals: '14. అధికారిక ప్రభుత్వ & సంస్థాగత పోర్టల్‌లు',
      secRelatedGuides: '15. సంబంధిత గైడ్లు',
      onThisPage: 'విభాగానికి వెళ్ళండి',
      askAiOnGuide: 'ఈ గైడ్ గురించి Kadam AI ని అడగండి',
      stepLabel: 'దశ',
      verifiedPortalNote: 'తాజా తేదీలు మరియు ఫీజులను ఎల్లప్పుడూ ఈ అధికారిక పోర్టల్‌లలో ధృవీకరించండి.',
    },
    pathways: {
      kicker: 'ఇంటరాక్టివ్ Possibility Map & లెర్నింగ్ జర్నీలు',
      title: 'మీ తదుపరి అడుగు ఎంచుకునే ముందు ప్రతి మార్గాన్ని చూడండి',
      subtitle: 'మీ అర్హతను ఎంచుకుని, స్ట్రీమ్ లేదా ట్రాక్ ద్వారా అర్హత, పరీక్షలు, వ్యవధి మరియు తదుపరి అడుగులను వెంటనే చూడండి.',
      tabMap: 'Possibility Map',
      tabJourneys: '11 లెర్నింగ్ జర్నీలు',
      step1Label: 'దశ 1 · మీ అర్హతను ఎంచుకోండి',
      step1BLabel: 'దశ 1B · 11–12వ తరగతి స్ట్రీమ్ ఎంచుకోండి',
      step2TrackLabel: 'దశ 2 · ట్రాక్ ద్వారా ఫిల్టర్ చేయండి',
      selectedCount: 'పోల్చడానికి ఎంచుకున్నవి',
      compareSelected: 'ఎంచుకున్నవి పోల్చండి',
      hideComparison: 'పోలిక దాచండి',
      clearCompare: 'క్లియర్',
      comparisonHeading: 'మార్గాల ప్రత్యక్ష పోలిక',
      availablePathways: 'అందుబాటులో ఉన్న మార్గాలు',
      allPathwaysMobile: 'అన్ని మార్గాలు',
      compareToggleAdd: '+ పోల్చండి',
      compareToggleAdded: '✓ పోలికలో ఉంది',
      eligibilityLabel: 'అర్హత & విద్యార్హత',
      durationLabel: 'వ్యవధి',
      examsLabel: 'సంబంధిత పరీక్షలు',
      costLabel: 'అంచనా ఖర్చు & సహాయం',
      institutionsLabel: 'ప్రముఖ సంస్థలు',
      scholarshipsLabel: 'స్కాలర్‌షిప్‌లు & ఆర్థిక సహాయం',
      outcomesLabel: 'కెరీర్ & తదుపరి అడుగులు',
      alternativesLabel: 'సమాంతర & బ్యాకప్ మార్గాలు',
      realityLabel: 'నిజాయితీ వాస్తవ గమనిక',
      readFullGuide: 'పూర్తి ధృవీకరించిన గైడ్ చదవండి',
      selectJourneyMobile: 'లెర్నింగ్ జర్నీ ఎంచుకోండి',
      journeyOverview: 'జర్నీ పరిచయం',
      targetAudience: 'ఇది ఎవరి కోసం',
      estimatedHorizon: 'అంచనా సమయం',
      stagesCompleted: 'దశలు పూర్తయ్యాయి',
      stagePrerequisites: 'ముందస్తు అవసరాలు',
      stageDecisions: 'కీలక నిర్ణయాలు',
      stageDocuments: 'అవసరమైన డాక్యుమెంట్లు',
      stageNextActions: 'తదుపరి చర్యలు',
      linkedGuides: 'సంబంధిత గైడ్లు',
      officialReferences: 'అధికారిక సూచనలు',
      saveJourney: 'జర్నీ సేవ్ చేయండి',
      journeySaved: 'సేవ్ చేసిన జర్నీ',
    },
    discover: {
      kicker: 'Kadam Discover · ధృవీకరించిన సంస్థలు',
      title: 'అవకాశాల రాడార్ & విశ్వవిద్యాలయాల అన్వేషణ',
      subtitle: 'అధికారిక లింకులు మరియు ధృవీకరణ తేదీలతో నిజమైన భారతీయ మరియు అంతర్జాతీయ కార్యక్రమాలను చూడండి.',
      tabOpportunities: 'అవకాశాల రాడార్',
      tabUniversities: 'విశ్వవిద్యాలయాలు & కోర్సులు',
      verificationStandardLabel: 'ధృవీకరణ ప్రమాణం:',
      verificationStandardBody:
        'క్రింద ఉన్న ప్రతి కార్యక్రమం నిజమైనది మరియు అధికారిక పోర్టల్‌కు లింక్ చేయబడింది. దరఖాస్తు చేసే ముందు ఎల్లప్పుడూ అధికారిక వెబ్‌సైట్‌లో తాజా తేదీలను తనిఖీ చేయండి.',
      oppSearchPlaceholder: 'స్కాలర్‌షిప్‌లు, IIT ఇంటర్న్‌షిప్‌లు, ఫెలోషిప్‌లు శోధించండి...',
      lesserKnownToggle: 'తక్కువ తెలిసిన ముఖ్య అవకాశాలు (What Nobody Told Me)',
      showingOpportunities: 'చూపుతున్న అవకాశాలు:',
      noOppsTitle: 'ప్రస్తుత ఫిల్టర్‌లకు అవకాశాలు దొరకలేదు',
      noOppsDesc: 'అన్ని అవకాశాలను చూడటానికి ఫిల్టర్లను రీసెట్ చేయండి.',
      whatNobodyTellsYou: 'చాలా మందికి తెలియని విషయం',
      eligibility: 'అర్హత',
      benefits: 'ప్రయోజనాలు & నిధులు',
      cycleWindow: 'సాధారణ సమయం',
      demoEntry: 'డెమో ఎంట్రీ',
      verifiedPortal: 'ధృవీకరించిన పోర్టల్',
      addToCalendar: 'గడువు ట్రాక్ చేయండి',
      addedToCalendar: 'క్యాలెండర్‌లో చేర్చబడింది',
      share: 'షేర్ చేయండి',
      shared: 'లింక్ కాపీ అయింది',
      uniSearchPlaceholder: 'IIT, NIT, IISER, NLU, విశ్వవిద్యాలయం లేదా కోర్సు శోధించండి...',
      allInstitutionTypes: 'అన్ని సంస్థల రకాలు',
      showingUniversities: 'చూపుతున్న సంస్థలు:',
      noUnisTitle: 'ప్రస్తుత ఫిల్టర్‌కు సంస్థలు దొరకలేదు',
      noUnisDesc: 'అన్ని సంస్థలను చూడటానికి ఫిల్టర్లను రీసెట్ చేయండి.',
      established: 'స్థాపన',
      notableCourses: 'ప్రముఖ కోర్సులు',
      entranceExams: 'ప్రవేశ పరీక్షలు',
      admissionProcess: 'ప్రవేశ విధానం',
      feeNote: 'ఫీజు వివరాలు',
      scholarshipNote: 'స్కాలర్‌షిప్‌లు & సహాయం',
    },
    roadmap: {
      kicker: 'My Next Kadam',
      title: 'వ్యక్తిగత బహుళ-మార్గ రోడ్‌మ్యాప్',
      subtitle: 'మీ దశ, బలాలు మరియు బడ్జెట్‌ను పంచుకుని మూడు విభిన్న ఆచరణాత్మక మార్గాలను రూపొందించండి.',
      step1Tab: '01. అర్హత',
      step2Tab: '02. ప్రాంతం & బడ్జెట్',
      step3Tab: '03. ఆసక్తులు & బలాలు',
      step4Tab: '04. మార్గ ప్రాధాన్యతలు',
      stepCounter: 'దశ',
      eduStageLabel: 'ప్రస్తుత విద్యా దశ',
      streamLabel: 'అర్హత, స్ట్రీమ్ లేదా ప్రధాన అంశం',
      streamPlaceholder: 'ఉదా., ఇంటర్ BiPC, B.Com, డిప్లొమా మెకానికల్...',
      cityLabel: 'ప్రస్తుత నగరం / రాష్ట్రం',
      cityPlaceholder: 'ఉదా., హైదరాబాద్, తెలంగాణ లేదా విజయవాడ',
      destLabel: 'చదువు / ఉద్యోగానికి ఇష్టమైన ప్రాంతం',
      destPlaceholder: 'స్వంత రాష్ట్రం, భారతదేశం, విదేశాలు...',
      budgetLabel: 'బడ్జెట్ / ఆర్థిక పరిమితి',
      interestsLabel: 'ఆసక్తులు (కామాతో వేరు చేయండి)',
      interestsPlaceholder: 'ఉదా., జీవశాస్త్రం, న్యాయశాస్త్రం, డిజైన్...',
      strengthsLabel: 'మీ బలాలు (కామాతో వేరు చేయండి)',
      strengthsPlaceholder: 'ఉదా., సమస్య పరిష్కారం, కమ్యూనికేషన్...',
      goalsLabel: 'వ్యక్తిగత లక్ష్యాలు (కామాతో వేరు చేయండి)',
      goalsPlaceholder: 'ఉదా., 2 ఏళ్లలో ఉద్యోగం, రీసెర్చ్ పేపర్...',
      tracksPrompt: 'మీరు ఏ దిశలను అన్వేషించడానికి సిద్ధంగా ఉన్నారు? (బహుళ ఎంపికలు)',
      generateBtn: 'నా తదుపరి అడుగు రూపొందించండి',
      generatingBtn: '3 విభిన్న మార్గాలు సిద్ధమవుతున్నాయి...',
      aiPlanKicker: 'AI రూపొందించిన బహుళ-మార్గ ప్రణాళిక · అధికారిక తేదీలు తనిఖీ చేయండి',
      detailedViewBtn: 'వివరణాత్మక మార్గం',
      compareAllBtn: '3 మార్గాలను పోల్చండి',
      saveRoadmapBtn: 'రోడ్‌మ్యాప్ సేవ్ చేయండి',
      optionLabel: 'ఎంపిక',
      pathwayLabel: 'మార్గం',
      inspectMilestones: 'పూర్తి మైలురాళ్లను చూడండి →',
      immediateHorizon: 'తక్షణమే (రాబోయే 30 రోజులు)',
      shortTermHorizon: 'స్వల్పకాలికం (3–12 నెలలు)',
      longTermHorizon: 'దీర్ఘకాలికం (1–4 సంవత్సరాలు)',
      requiredQualifications: 'అవసరమైన అర్హతలు',
      keyExaminations: 'ప్రధాన పరీక్షలు',
      skillsToBuild: 'నేర్చుకోవాల్సిన నైపుణ్యాలు',
      estimatedCost: 'అంచనా ఖర్చు & సహాయం',
      possibleInstitutions: 'సంభావ్య సంస్థలు',
      opportunitiesToWatch: 'గమనించాల్సిన అవకాశాలు',
      risksAlternatives: 'రిస్క్‌లు & ప్రత్యామ్నాయాలు',
      verifiedGuidesHeading: 'ఈ మార్గానికి సంబంధించిన ధృవీకరించిన గైడ్లు',
      immediateNextStep: 'తక్షణ తదుపరి అడుగు:',
      keyRiskAlternative: 'ప్రధాన రిస్క్ / ప్రత్యామ్నాయం:',
    },
    kadamAi: {
      kicker: 'Kadam AI · బహుభాషా · వాయిస్-ఫస్ట్ మెంటర్',
      title: 'సున్నా నుండి ఏదైనా సంకోచం లేకుండా అడగండి',
      subtitle: 'ప్రతి సమాధానం ధృవీకరించిన గైడ్లను మరియు AI మార్గదర్శకత్వాన్ని స్పష్టంగా వేరు చేసి చూపుతుంది.',
      noStupidMode: 'ఏ ప్రశ్న చిన్నది కాదు మోడ్',
      newConversation: 'కొత్త సంభాషణ',
      savedConversations: 'సేవ్ చేసిన సంభాషణలు',
      noConversations: 'మీ సంభాషణలు ఇక్కడ కనిపిస్తాయి.',
      welcomeTitle: 'నమస్కారం! ఏ ప్రశ్న అయినా సంకోచం లేకుండా అడగండి.',
      welcomeSubtitle: 'పరీక్షలు, స్కాలర్‌షిప్‌లు, రీసెర్చ్, పేటెంట్లు లేదా కెరీర్ల గురించి తెలుగు, హిందీ లేదా ఇంగ్లీషులో అడగండి.',
      youLabel: 'మీరు',
      assistantHeader: 'Kadam AI · AI మార్గదర్శకత్వం (అధికారిక పోర్టల్‌లో తేదీలు తనిఖీ చేయండి)',
      citedGuidesHeading: 'సూచించిన ధృవీకరించిన AGLA KADAM గైడ్లు',
      thinkingText: 'Kadam AI స్పష్టమైన వివరణను సిద్ధం చేస్తోంది...',
      recordingPlaceholder: 'వింటున్నాము... మాట్లాడటం పూర్తయ్యాక మైక్ నొక్కండి.',
      inputPlaceholder: 'మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి లేదా మైక్ నొక్కి మాట్లాడండి...',
      sendBtn: 'పంపండి',
      voiceStartTitle: 'మాట్లాడి అడగండి',
      voiceStopTitle: 'రికార్డింగ్ ఆపండి',
      starters: [
        'నేను 10వ తరగతి పూర్తి చేశాను. సైన్స్ కాకుండా నాకు ఉన్న మంచి కెరీర్ దారులు ఏమిటి?',
        'భారతదేశంలో విద్యార్థులు స్కాలర్‌షిప్‌లకు (NSP) ఎలా దరఖాస్తు చేయాలి?',
        'రీసెర్చ్ పేపర్ ఎలా రాయాలి మరియు నకిలీ జర్నల్స్‌ను ఎలా గుర్తించాలి?',
        'తక్కువ ఖర్చుతో విదేశాల్లో చదువుకోవడానికి ఉన్న స్కాలర్‌షిప్‌లు ఏమిటి?',
      ],
    },
    tools: {
      kicker: 'ఆచరణాత్మక మార్గదర్శక టూల్స్',
      title: 'డాక్యుమెంట్లను అర్థం చేసుకోండి, వాస్తవాలను పోల్చండి మరియు కుటుంబంతో మాట్లాడండి',
      subtitle: 'ప్రభుత్వ నోటిఫికేషన్లు, ఆఫర్ లెటర్లు, స్కాలర్‌షిప్‌లు మరియు కుటుంబ చర్చల కోసం రూపొందించిన టూల్స్.',
      outputLanguage: 'సమాధాన భాష:',
      tabDecoder: 'నోటిఫికేషన్ & డాక్యుమెంట్ డీకోడర్',
      tabParents: 'తల్లిదండ్రులకు వివరించండి',
      tabGap: 'అవకాశాల గ్యాప్ డిటెక్టర్',
      tabWhatCanIDo: 'దీనితో నేను ఏమి చేయగలను?',
      tabReality: 'కెరీర్ రియాలిటీ చెక్',
      decoderTitle: 'ఈ నోటిఫికేషన్ లేదా డాక్యుమెంట్‌ను సులభంగా అర్థం చేసుకోండి',
      decoderDesc: 'పరీక్ష నోటిఫికేషన్, స్కాలర్‌షిప్ సర్క్యులర్, మార్క్‌షీట్ లేదా ఆఫర్ లెటర్ PDF/ఫోటో అప్‌లోడ్ చేయండి లేదా టెక్స్ట్ పేస్ట్ చేయండి.',
      privacyTitle: 'పూర్తి గోప్యత భద్రత',
      privacyBody: 'అప్‌లోడ్ చేసిన ఫైళ్ళు మెమరీలో మాత్రమే విశ్లేషించబడి వెంటనే తొలగించబడతాయి—ఎప్పుడూ సేవ్ చేయబడవు.',
      decodingWhat: 'మీరు ఏమి అర్థం చేసుకోవాలనుకుంటున్నారు?',
      modeNotification: 'అధికారిక నోటిఫికేషన్',
      modeDocument: 'మార్క్‌షీట్ / ఆఫర్ లెటర్',
      uploadLabel: 'ఫైల్ అప్‌లోడ్ (PDF, PNG, JPG, WEBP · గరిష్టం 5 MB)',
      chooseFile: 'PDF లేదా ఫోటో ఎంచుకోండి',
      chooseFileHint: 'పరీక్ష బ్రోచర్లు, ఫీజు నోటీసులు, ఆఫర్ లెటర్లు',
      pasteLabel: 'లేదా టెక్స్ట్ పేస్ట్ చేయండి',
      pastePlaceholder: 'అర్హత నియమాలు, CTC వివరాలు లేదా స్కాలర్‌షిప్ నిబంధనలు పేస్ట్ చేయండి...',
      decodeBtn: 'ఇప్పుడే డీకోడ్ చేయండి',
      decodingBtn: 'సులభ భాషలో విశ్లేషిస్తోంది...',
      whatYouReceive: 'మీకు లభించే వివరాలు',
      zeroJargonTitle: 'కఠిన పదాలు లేని స్పష్టమైన వివరణ',
      receiveItems: [
        '1. డాక్యుమెంట్ యొక్క అసలు అర్థం సులభమైన భాషలో.',
        '2. అర్హత నియమాలు మరియు ముఖ్య షరతులు.',
        '3. క్యాలెండర్‌లో సేవ్ చేయగల ముఖ్యమైన తేదీలు.',
        '4. అవసరమైన డాక్యుమెంట్లు మరియు ఫీజు/CTC వివరాలు.',
        '5. జాగ్రత్తలు, బాండ్ హెచ్చరికలు మరియు తదుపరి అడుగులు.',
      ],
      readingClauses: 'నిబంధనలను సులభ భాషలోకి మారుస్తోంది...',
      extractingSub: 'అర్హత, తేదీలు, డాక్యుమెంట్లు మరియు రిస్క్‌లను సేకరిస్తోంది.',
      aiDecodedKicker: 'AI-డీకోడ్ వివరణ · మూల డాక్యుమెంట్‌తో సరిచూడండి',
      plainSummary: 'సులభమైన సారాంశం',
      importantDates: 'ముఖ్యమైన తేదీలు',
      eligibilityHighlights: 'అర్హత ముఖ్యాంశాలు',
      requiredDocuments: 'అవసరమైన డాక్యుమెంట్లు',
      feesClauses: 'ఫీజులు, CTC లేదా ఆర్థిక నిబంధనలు',
      stepByStepActions: 'దశలవారీ తదుపరి చర్యలు',
      risksRedFlags: 'రిస్క్‌లు & జాగ్రత్తలు',
      parentsTitle: 'తల్లిదండ్రులకు వివరించండి',
      parentsDesc: 'కొత్త కెరీర్ మార్గం గురించి వ్యవధి, ఖర్చు, ఉద్యోగ భద్రత మరియు బ్యాకప్ ప్రణాళికలతో స్పష్టమైన రిపోర్ట్ రూపొందించండి.',
      pathwayInputLabel: 'వివరించాల్సిన కెరీర్ లేదా డిగ్రీ',
      pathwayPlaceholder: 'ఉదా., NID లో B.Des, IISER లో BS-MS రీసెర్చ్, CLAT & లా',
      stageSelectLabel: 'విద్యార్థి ప్రస్తుత దశ',
      concernsLabel: 'కుటుంబం యొక్క ప్రధాన ప్రశ్నలు (ఐచ్ఛికం)',
      concernsPlaceholder: 'ఉదా., మొత్తం ఫీజు, ఉద్యోగ భద్రత, బ్యాకప్ ఎంపికలు',
      generateBriefBtn: 'కుటుంబ నివేదిక రూపొందించండి',
      generatingBriefBtn: 'నివేదిక సిద్ధమవుతోంది...',
      respectfulClarity: 'గౌరవప్రదమైన స్పష్టత కోసం',
      tryCommonTopic: 'సాధారణ అంశాన్ని ఎంచుకోండి',
      draftingBrief: 'తల్లిదండ్రుల కోసం నివేదిక రూపొందిస్తోంది...',
      familyBriefKicker: 'AGLA KADAM · కుటుంబ చర్చా నివేదిక',
      execSummary: 'ప్రధాన సారాంశం',
      whatInvolves: 'ఈ మార్గంలో ఏమి ఉంటుంది',
      durationTimeline: 'వ్యవధి & కాలక్రమం',
      realisticCost: 'అంచనా వాస్తవ ఖర్చు',
      careerOutlook: 'కెరీర్ & ఆదాయ అవకాశాలు',
      eligibilityExams: 'అర్హత & ప్రధాన పరీక్షలు',
      honestRisks: 'నిజాయితీ రిస్క్‌లు & బ్యాకప్ ప్రణాళికలు',
      howParentsSupport: 'తల్లిదండ్రులు ఎలా సహకరించవచ్చు',
      specialRunBtn: 'విశ్లేషించండి',
      specialRunningBtn: 'విశ్లేషిస్తోంది...',
      whyItMatters: 'ఇది ఎందుకు ముఖ్యం',
      realityChallenges: 'వాస్తవికత & సవాళ్లు',
      immediateStep: 'తక్షణ తదుపరి అడుగు',
      relatedVerifiedGuides: 'సంబంధిత ధృవీకరించిన గైడ్లు',
      curatedLesserKnown: 'ఎంపిక చేసిన తక్కువ తెలిసిన అవకాశాలు',
    },
    dashboard: {
      kicker: 'స్టూడెంట్ డ్యాష్‌బోర్డ్ · మీ తదుపరి అడుగు',
      welcomePrefix: 'తిరిగి స్వాగతం,',
      kpiRoadmaps: 'సేవ్ చేసిన రోడ్‌మ్యాప్‌లు',
      kpiDeadlines: 'సక్రియ గడువులు',
      kpiAchievements: 'నమోదైన విజయాలు',
      kpiSaved: 'సేవ్ చేసినవి',
      tabOverview: 'సారాంశం',
      tabRoadmaps: 'రోడ్‌మ్యాప్‌లు',
      tabCalendar: 'అవకాశాల క్యాలెండర్',
      tabLocker: 'విజయాల లాకర్ & టైమ్‌లైన్',
      tabSaved: 'సేవ్ & పురోగతి',
      tabAiHistory: 'Kadam AI చరిత్ర',
      tabProfile: 'ప్రొఫైల్ & గోప్యత',
      myRoadmapsHeading: 'నా తదుపరి అడుగు రోడ్‌మ్యాప్‌లు',
      viewAllRoadmaps: 'అన్ని రోడ్‌మ్యాప్‌లు →',
      buildRoadmapLink: 'రోడ్‌మ్యాప్ నిర్మించండి →',
      noRoadmapTitle: 'మీరు ఇంకా వ్యక్తిగత రోడ్‌మ్యాప్ సేవ్ చేయలేదు.',
      noRoadmapDesc: 'మీ దశ, ఆసక్తులు మరియు బడ్జెట్ ఆధారంగా 3 విభిన్న మార్గాలను పోల్చండి.',
      generateRoadmapCta: 'నా తదుపరి అడుగు రూపొందించండి',
      milestonesCompleted: 'మైలురాళ్లు పూర్తయ్యాయి',
      openChecklist: 'చెక్‌లిస్ట్ తెరవండి →',
      upcomingDeadlinesHeading: 'రాబోయే అవకాశాల గడువులు',
      manageCalendar: 'క్యాలెండర్ నిర్వహించండి →',
      noDeadlinesText: 'ఇంకా గడువులు ట్రాక్ చేయబడలేదు. Kadam Discover లేదా క్యాలెండర్ నుండి జోడించండి.',
      savedItemsHeading: 'సేవ్ చేసిన గाइडలు & అవకాశాలు',
      viewAll: 'అన్నీ చూడండి',
      noBookmarksHint: 'మీ వ్యక్తిగత జాబితా కోసం గైడ్లు, ఫెలోషిప్‌లు లేదా విశ్వవిద్యాలయాలను బుక్‌మార్క్ చేయండి:',
      activeProgressHeading: 'నేర్చుకునే పురోగతి',
      openJourneys: 'జర్నీలు తెరవండి →',
      noProgressHint: 'పురోగతిని ట్రాక్ చేయడానికి గైడ్లు లేదా జర్నీ దశలను పూర్తయినట్లు గుర్తించండి.',
      exploreHeading: 'AGLA KADAM అన్వేషించండి',
      completeProfileTitle: 'మీ విద్యార్థి ప్రొఫైల్ పూర్తి చేయండి',
      completeProfileDesc: 'Kadam AI మరియు My Next Kadam ఖచ్చితమైన సూచనలు ఇవ్వడానికి సహాయపడుతుంది.',
      setupProfileLink: 'ప్రొఫైల్ సెటప్ చేయండి',
      pillarsReady: 'ప్రధాన విభాగాలు సిద్ధంగా ఉన్నాయి',
      pillarOverview: 'ప్లాట్‌ఫారమ్ పరిచయం & శోధన →',
      pillarUniverse: 'The Agla Kadam Universe (150 అంశాలు · 18 విభాగాలు) →',
      pillarPathways: 'Possibility Map & 11 లెర్నింగ్ జర్నీలు →',
      pillarDiscover: 'Kadam Discover (అవకాశాలు & విశ్వవిద్యాలయాలు) →',
      pillarAi: 'Kadam AI (English · తెలుగు · हिन्दी · వాయిస్) →',
      pillarTools: 'డాక్యుమెంట్ డీకోడర్, పేరెంట్ రిపోర్ట్ & రియాలిటీ చెక్ →',
      savedConversationsTitle: 'సేవ్ చేసిన Kadam AI సంభాషణలు',
      savedConversationsDesc: 'గత సంభాషణలను సమీక్షించండి లేదా తొలగించండి.',
      messagesCount: 'సందేశాలు',
      noConversationsYet: 'ఇంకా Kadam AI సంభాషణలు సేవ్ చేయబడలేదు.',
      studentProfileTitle: 'విద్యార్థి ప్రొఫైల్',
      studentProfileDesc: 'మీ రోడ్‌మ్యాప్ మరియు Kadam AI సూచనల కోసం మాత్రమే ఉపయోగించబడుతుంది.',
      eduLevelLabel: 'ప్రస్తుత విద్యా స్థాయి',
      streamDisciplineLabel: 'స్ట్రీమ్ / విభాగం',
      locationLabel: 'ప్రస్తుత నగరం / రాష్ట్రం',
      budgetLabel: 'అంచనా వార్షిక విద్యా బడ్జెట్',
      interestsLabel: 'ఆసక్తులు (కామాతో వేరు)',
      strengthsLabel: 'బలాలు (కామాతో వేరు)',
      goalsLabel: 'లక్ష్యాలు (కామాతో వేరు)',
      saveProfileBtn: 'ప్రొఫైల్ సేవ్ చేయండి',
      profileSavedToast: 'మీ ప్రొఫైల్ సేవ్ చేయబడింది.',
      privacyTitle: 'గోప్యత & డేటా నియంత్రణ',
      privacyDesc: 'మీ డేటా పూర్తిగా మీదే. మీరు ఎప్పుడైనా మీ డేటాను డౌన్‌లోడ్ చేయవచ్చు లేదా తొలగించవచ్చు.',
      exportJsonBtn: 'మొత్తం వ్యక్తిగత డేటా ఎగుమతి (JSON)',
      clearAiHistoryBtn: 'మొత్తం Kadam AI చరిత్రను క్లియర్ చేయండి',
      confirmDeleteAiPrompt: 'సేవ్ చేసిన అన్ని Kadam AI సంభాషణలను శాశ్వతంగా తొలగించాలా?',
      confirmDeleteBtn: 'తొలగించు',
      preferredLanguageTitle: 'ప్రాధాన్యత భాష',
      preferredLanguageDesc: 'మీ ప్రొఫైల్‌లో సేవ్ చేయబడుతుంది మరియు భవిష్యత్తు లాగిన్లలో మీ పురోగతి కోల్పోకుండా స్వయంచాలకంగా వర్తిస్తుంది.',
      calendarTitle: 'అవకాశాల క్యాలెండర్',
      calendarDesc: 'పరీక్ష, స్కాలర్‌షిప్, ఇంటర్న్‌షిప్ మరియు ప్రవేశ గడువులను ఒకే చోట ట్రాక్ చేయండి.',
      addDeadlineTitle: 'కొత్త గడువు జోడించండి',
      deadlineNamePlaceholder: 'ఉదా., GATE రిజిస్ట్రేషన్ లేదా NSP స్కాలర్‌షిప్',
      dueDateLabel: 'చివరి తేదీ',
      officialUrlLabel: 'అధికారిక పోర్టల్ URL (ఐచ్ఛికం)',
      notesLabel: 'గమనికలు (ఐచ్ఛికం)',
      addDeadlineBtn: 'క్యాలెండర్‌లో చేర్చండి',
      statusWatching: 'గమనిస్తున్నాము',
      statusInProgress: 'ప్రక్రియలో ఉంది',
      statusSubmitted: 'సమర్పించబడింది',
      lockerTitle: 'విజయాల లాకర్ & వృద్ధి టైమ్‌లైన్',
      lockerDesc: 'మీ సర్టిఫికెట్లు, ప్రాజెక్టులు, పరిశోధన మరియు విజయాలను నమోదు చేయండి.',
      lockerView: 'లాకర్ గ్రిడ్',
      timelineView: 'వృద్ధి టైమ్‌లైన్',
      addAchievementTitle: 'కొత్త విజయం నమోదు చేయండి',
      achievementTitleLabel: 'విజయం శీర్షిక',
      issuerLabel: 'జారీ చేసిన సంస్థ',
      dateEarnedLabel: 'పొందిన తేదీ',
      reflectionLabel: 'నేర్చుకున్న అంశం (ఐచ్ఛికం)',
      skillsLabel: 'నైపుణ్యాలు (కామాతో వేరు)',
      addAchievementBtn: 'విజయం సేవ్ చేయండి',
      noAchievementsYet: 'ఇంకా విజయాలు నమోదు చేయబడలేదు.',
      allSaved: 'అన్నీ',
      guidesFilter: 'గైడ్లు',
      opportunitiesFilter: 'అవకాశాలు',
      universitiesFilter: 'విశ్వవిద్యాలయాలు',
      journeysFilter: 'జర్నీలు',
    },
  },
};
