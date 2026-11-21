import type { LanguageCode } from '../types/domain';

export type NobodyFilterKey = 'all' | 'school' | 'college' | 'scholarships';

export interface AiPromptCategory {
  id: string;
  label: string;
  prompts: string[];
}

export interface EngagementStrings {
  universe: {
    readProgressLabel: string;
    readProgressOf: string;
    guidesRead: string;
    completedBannerTitle: string;
    completedBannerDesc: string;
    nextRecommendedGuide: string;
    relatedOpportunitiesHeading: string;
    relatedJourneyHeading: string;
    openJourneyCta: string;
    exploreAllOppsCta: string;
    emptyEncouragement: string;
    popularQuickTopics: string;
    readBadge: string;
    openTopicCta: string;
    readGuideCta: string;
    complete16SectionLabel: string;
    instantAiAvailable: string;
  };
  pathways: {
    journeyProgressTitle: string;
    stagesDoneOf: string;
    journeyCompleteTitle: string;
    journeyCompleteDesc: string;
    journeyCompleteNextGuide: string;
    journeyCompleteDiscover: string;
    markDone: string;
    completedStage: string;
    stageWord: string;
    matchingOppsHeading: string;
    viewAllDiscover: string;
    compareSideBySide: string;
    comparingLabel: string;
    addCompareShort: string;
    removeCompareLong: string;
    addCompareLong: string;
    closeComparison: string;
    dimensionLabel: string;
    pathwayComparisonKicker: string;
    sideBySideMatrixTitle: string;
    applicablePathwaysLabel: string;
    pathwaySuffix: string;
    durationPrefix: string;
    explainJourneyParents: string;
    learningJourneyKicker: string;
    whoThisIsFor: string;
    readGuidePrefix: string;
    blueprintsHeading: string;
    chooseBlueprintMobile: string;
    filterPathwaysLabel: string;
    allCountPrefix: string;
    signInToTrackHint: string;
  };
  dashboard: {
    recommendedHeading: string;
    recommendedSubtitle: string;
    recommendedGuideTag: string;
    recommendedOppTag: string;
    recommendedPathwayTag: string;
    roadmapProgressLabel: string;
    milestonesWord: string;
    allMilestonesComplete: string;
    overallProgressTitle: string;
    guidesCompletedLabel: string;
    journeysStartedLabel: string;
    milestonesCheckedLabel: string;
    emptyRoadmapsTitle: string;
    emptyRoadmapsDesc: string;
    emptyDeadlinesTitle: string;
    emptyDeadlinesDesc: string;
    browseDiscoverCta: string;
    openDecoderCta: string;
    emptyLockerTitle: string;
    emptyLockerDesc: string;
    emptySavedTitle: string;
    emptySavedDesc: string;
    browseUniverseCta: string;
    emptyProgressTitle: string;
    emptyProgressDesc: string;
    startFirstJourneyCta: string;
    emptyAiTitle: string;
    emptyAiDesc: string;
    askFirstQuestionCta: string;
    personalRecordLabel: string;
    verifyLinkLabel: string;
    removeLabel: string;
    deleteRoadmapLabel: string;
    createNewRoadmapLabel: string;
    savedRoadmapsTitle: string;
    savedRoadmapsDesc: string;
    actionMilestonesLabel: string;
    openGuideLink: string;
    duePrefix: string;
    submittedLocked: string;
    sortedNote: string;
    savingLabel: string;
    categoryLabel: string;
    verificationLinkOptional: string;
    savedLibraryTitle: string;
    pathwaysWord: string;
    statusPrefix: string;
    oppCategories: {
      examination: string;
      scholarship: string;
      internship: string;
      fellowship: string;
      admission: string;
      research: string;
      other: string;
    };
  };
  home: {
    nobodySubtitle: string;
    nobodyFilters: Record<NobodyFilterKey, string>;
    eligibilityLabel: string;
    cycleLabel: string;
    sourceLabel: string;
    askAiAboutThis: string;
    exploreAllDiscover: string;
    whyNobodyTellsLabel: string;
    askAiTemplatePrefix: string;
  };
  kadamAi: {
    suggestedHeading: string;
    categories: AiPromptCategory[];
    followUpHeading: string;
    followUpsDefault: string[];
    followUpsWithGuide: (guideTitle: string) => string[];
    emptyHistoryEncouragement: string;
    tipLine: string;
  };
  discover: {
    eligibilityHeading: string;
    benefitsHeading: string;
    cycleAndSourceHeading: string;
    relatedGuideLabel: string;
    askAiAboutOpp: string;
    emptyHintCta: string;
    askAiForQueryPrefix: string;
  };
}

export const ENGAGEMENT_STRINGS: Record<LanguageCode, EngagementStrings> = {
  en: {
    universe: {
      readProgressLabel: 'Your Batch 1 Reading Progress',
      readProgressOf: 'of',
      guidesRead: 'complete guides read',
      completedBannerTitle: 'Guide marked as read',
      completedBannerDesc: 'Saved to your Student Dashboard learning progress. Ready for the next connected topic?',
      nextRecommendedGuide: 'Continue to next guide',
      relatedOpportunitiesHeading: 'Matching Verified Opportunities',
      relatedJourneyHeading: 'Connected Learning Journey',
      openJourneyCta: 'Open step-by-step journey',
      exploreAllOppsCta: 'Explore all in Kadam Discover',
      emptyEncouragement: 'Nothing matched this exact combination — you can reset filters or ask Kadam AI directly for a plain-language explanation.',
      popularQuickTopics: 'Popular starting guides:',
      readBadge: 'Read',
      openTopicCta: 'View Topic',
      readGuideCta: 'Read Guide',
      complete16SectionLabel: 'Complete 16-Section Guide',
      instantAiAvailable: 'Instant AI Briefing Available',
    },
    pathways: {
      journeyProgressTitle: 'Journey Progress',
      stagesDoneOf: 'stages completed',
      journeyCompleteTitle: 'Journey blueprint completed',
      journeyCompleteDesc: 'You have checked off every stage in this blueprint. Keep momentum by verifying live opportunities or building a personalised roadmap.',
      journeyCompleteNextGuide: 'Explore related guides',
      journeyCompleteDiscover: 'Check Kadam Discover',
      markDone: 'Mark Done',
      completedStage: 'Completed',
      stageWord: 'Stage',
      matchingOppsHeading: 'Verified Opportunities for This Stage',
      viewAllDiscover: 'Browse all in Kadam Discover',
      compareSideBySide: 'Compare Side-by-Side',
      comparingLabel: '✓ Comparing',
      addCompareShort: '+ Compare',
      removeCompareLong: 'Remove from Comparison',
      addCompareLong: 'Add to Comparison',
      closeComparison: 'Close comparison',
      dimensionLabel: 'Dimension',
      pathwayComparisonKicker: 'Pathway Comparison',
      sideBySideMatrixTitle: 'Side-by-Side Choice Matrix',
      applicablePathwaysLabel: 'Applicable Pathways',
      pathwaySuffix: 'Pathway',
      durationPrefix: 'Duration',
      explainJourneyParents: 'Explain This Journey to My Parents',
      learningJourneyKicker: 'Learning Journey',
      whoThisIsFor: 'Who this is for',
      readGuidePrefix: 'Read Guide',
      blueprintsHeading: '11 Step-by-Step Blueprints',
      chooseBlueprintMobile: 'Choose a Learning Journey (11 Blueprints)',
      filterPathwaysLabel: 'Filter pathways:',
      allCountPrefix: 'All',
      signInToTrackHint: 'Check off stages as you complete them — saved automatically to your Dashboard.',
    },
    dashboard: {
      recommendedHeading: 'Recommended Next Steps for You',
      recommendedSubtitle: 'Curated from our verified library and lesser-known opportunities to match where you are.',
      recommendedGuideTag: 'Verified Guide',
      recommendedOppTag: 'Lesser-Known Opportunity',
      recommendedPathwayTag: 'Learning Journey',
      roadmapProgressLabel: 'Milestone Progress',
      milestonesWord: 'milestones',
      allMilestonesComplete: 'All tracked milestones completed',
      overallProgressTitle: 'Your Learning Momentum',
      guidesCompletedLabel: 'Guides Read',
      journeysStartedLabel: 'Active Journeys',
      milestonesCheckedLabel: 'Milestones Checked',
      emptyRoadmapsTitle: 'Your personalised roadmap starts here',
      emptyRoadmapsDesc: 'Answer a few short questions about your stage, stream, and budget to compare three realistic pathways side by side.',
      emptyDeadlinesTitle: 'No deadlines on your calendar yet',
      emptyDeadlinesDesc: 'Track entrance exams, scholarships, or fellowship windows here so important dates never slip past.',
      browseDiscoverCta: 'Explore Kadam Discover',
      openDecoderCta: 'Decode an Official Notice',
      emptyLockerTitle: 'Start recording your achievements',
      emptyLockerDesc: 'Board scores, NPTEL courses, workshops, hackathons, projects, or volunteering — logging them now makes CVs, SOPs, and scholarship forms effortless later.',
      emptySavedTitle: 'Your personal reference shelf is open',
      emptySavedDesc: 'Save guides, journeys, scholarships, or universities as you explore so you can revisit them anytime.',
      browseUniverseCta: 'Browse The Universe',
      emptyProgressTitle: 'Track every step you take',
      emptyProgressDesc: 'Mark complete guides as read or check off stages inside any Learning Journey to see your progress build here.',
      startFirstJourneyCta: 'Start a Learning Journey',
      emptyAiTitle: 'Your mentor conversations will appear here',
      emptyAiDesc: 'Ask Kadam AI anything in English, Telugu, or Hindi — from choosing a stream to understanding scholarship eligibility.',
      askFirstQuestionCta: 'Ask Kadam AI a Question',
      personalRecordLabel: 'Personal record',
      verifyLinkLabel: 'Verify',
      removeLabel: 'Remove',
      deleteRoadmapLabel: 'Delete Roadmap',
      createNewRoadmapLabel: 'Create New Roadmap',
      savedRoadmapsTitle: 'Saved Personal Roadmaps',
      savedRoadmapsDesc: 'Check off immediate and short-term milestones as you complete them.',
      actionMilestonesLabel: 'Action Milestones',
      openGuideLink: 'Open Guide',
      duePrefix: 'Due',
      submittedLocked: 'Submitted (Locked)',
      sortedNote: 'Sorted chronologically · Submitted items are locked against accidental edits',
      savingLabel: 'Saving...',
      categoryLabel: 'Category',
      verificationLinkOptional: 'Verification Link (Optional)',
      savedLibraryTitle: 'Saved Library Items',
      pathwaysWord: 'pathways',
      statusPrefix: 'Status',
      oppCategories: {
        examination: 'Examination',
        scholarship: 'Scholarship',
        internship: 'Internship',
        fellowship: 'Fellowship',
        admission: 'Admission',
        research: 'Research',
        other: 'Other',
      },
    },
    home: {
      nobodySubtitle: 'Real Indian and global programmes, fellowships, and grants that students outside metro coaching circles rarely hear about.',
      nobodyFilters: {
        all: 'All Insights',
        school: 'School & Class 12',
        college: 'College & Research',
        scholarships: 'Scholarships & Global',
      },
      eligibilityLabel: 'Who can apply',
      cycleLabel: 'Typical cycle',
      sourceLabel: 'Source',
      askAiAboutThis: 'Ask Kadam AI about this',
      exploreAllDiscover: 'View all in Kadam Discover',
      whyNobodyTellsLabel: 'What nobody tells students',
      askAiTemplatePrefix: 'Explain step by step how I can prepare and apply for',
    },
    kadamAi: {
      suggestedHeading: 'Not sure what to ask? Start with one of these:',
      categories: [
        {
          id: 'pathways',
          label: 'Choosing a Path',
          prompts: [
            'I am in Class 10 and confused between Science, Commerce, and Humanities. How do I decide?',
            'What strong career options exist after Class 12 without JEE or NEET?',
          ],
        },
        {
          id: 'exams',
          label: 'Exams & Admissions',
          prompts: [
            'Explain CUET UG vs JEE vs IISER Aptitude Test in simple terms.',
            'How does GATE help beyond M.Tech admissions — including PSU jobs and PhD stipends?',
          ],
        },
        {
          id: 'scholarships',
          label: 'Scholarships & Aid',
          prompts: [
            'Which central and state scholarships can an Indian college student apply for via NSP?',
            'How can I fund a Master’s degree abroad without taking a huge private loan?',
          ],
        },
        {
          id: 'research',
          label: 'Research, Internships & Skills',
          prompts: [
            'How can a student from a non-IIT college get a funded summer research internship?',
            'How do I write my first research paper or apply for the LAMP Fellowship?',
          ],
        },
      ],
      followUpHeading: 'Helpful follow-up questions',
      followUpsDefault: [
        'What documents should I keep ready for this?',
        'What common mistakes do students make here?',
        'How do I explain this option clearly to my parents?',
      ],
      followUpsWithGuide: (guideTitle: string) => [
        `Give me a 30-day action checklist for ${guideTitle}.`,
        `What are the most common mistakes students make in ${guideTitle}?`,
        `Are there any scholarships or fee waivers connected to ${guideTitle}?`,
      ],
      emptyHistoryEncouragement: 'Start a conversation on the right — your questions and verified guide links are saved privately here.',
      tipLine: 'Tip: You can type in English, Telugu, Hindi, or Hinglish, or tap the mic to speak.',
    },
    discover: {
      eligibilityHeading: 'Eligibility',
      benefitsHeading: 'What You Gain',
      cycleAndSourceHeading: 'Cycle & Official Source',
      relatedGuideLabel: 'Related Guide',
      askAiAboutOpp: 'Ask Kadam AI',
      emptyHintCta: 'Ask Kadam AI about',
      askAiForQueryPrefix: 'Tell me about verified scholarships, internships, or programmes related to',
    },
  },

  te: {
    universe: {
      readProgressLabel: 'మీ బ్యాచ్ 1 పఠన పురోగతి',
      readProgressOf: 'లో',
      guidesRead: 'పూర్తి గైడ్‌లు చదివారు',
      completedBannerTitle: 'గైడ్ చదివినట్లు గుర్తించబడింది',
      completedBannerDesc: 'మీ స్టూడెంట్ డాష్‌బోర్డ్ పురోగతిలో సేవ్ చేయబడింది. తదుపరి సంబంధిత అంశాన్ని చదవడానికి సిద్ధమా?',
      nextRecommendedGuide: 'తదుపరి గైడ్‌కు వెళ్ళండి',
      relatedOpportunitiesHeading: 'సంబంధిత ధృవీకరించబడిన అవకాశాలు',
      relatedJourneyHeading: 'అనుసంధానిత లెర్నింగ్ జర్నీ',
      openJourneyCta: 'దశలవారీ ప్రయాణాన్ని తెరవండి',
      exploreAllOppsCta: 'కదం డిస్కవర్‌లో అన్నీ చూడండి',
      emptyEncouragement: 'ఈ ఫిల్టర్‌లకు సరిపోయే అంశాలు లేవు — ఫిల్టర్‌లను రీసెట్ చేయండి లేదా కదం AIని నేరుగా అడగండి.',
      popularQuickTopics: 'ప్రారంభించడానికి ప్రముఖ గైడ్‌లు:',
      readBadge: 'చదివారు',
      openTopicCta: 'అంశాన్ని చూడండి',
      readGuideCta: 'గైడ్ చదవండి',
      complete16SectionLabel: 'పూర్తి 16-విభాగాల గైడ్',
      instantAiAvailable: 'తక్షణ AI వివరణ అందుబాటులో ఉంది',
    },
    pathways: {
      journeyProgressTitle: 'ప్రయాణ పురోగతి',
      stagesDoneOf: 'దశలు పూర్తయ్యాయి',
      journeyCompleteTitle: 'లెర్నింగ్ జర్నీ బ్లూప్రింట్ పూర్తయింది',
      journeyCompleteDesc: 'ఈ ప్రయాణంలోని అన్ని దశలను మీరు పూర్తి చేశారు. తదుపరి అడుగు కోసం అవకాశాలను చూడండి లేదా వ్యక్తిగత రోడ్‌మ్యాప్ నిర్మించండి.',
      journeyCompleteNextGuide: 'సంబంధిత గైడ్‌లు చూడండి',
      journeyCompleteDiscover: 'కదం డిస్కవర్ చూడండి',
      markDone: 'పూర్తయినట్లు గుర్తించండి',
      completedStage: 'పూర్తయింది',
      stageWord: 'దశ',
      matchingOppsHeading: 'ఈ దశకు సరిపోయే ధృవీకరించబడిన అవకాశాలు',
      viewAllDiscover: 'కదం డిస్కవర్‌లో అన్నీ చూడండి',
      compareSideBySide: 'పక్కపక్కనే పోల్చండి',
      comparingLabel: '✓ పోల్చుతున్నారు',
      addCompareShort: '+ పోల్చండి',
      removeCompareLong: 'పోలిక నుండి తొలగించండి',
      addCompareLong: 'పోలికకు జోడించండి',
      closeComparison: 'పోలిక మూసివేయండి',
      dimensionLabel: 'అంశం',
      pathwayComparisonKicker: 'మార్గాల పోలిక',
      sideBySideMatrixTitle: 'పక్కపక్కనే ఎంపిక పట్టిక',
      applicablePathwaysLabel: 'అందుబాటులో ఉన్న మార్గాలు',
      pathwaySuffix: 'మార్గం',
      durationPrefix: 'వ్యవధి',
      explainJourneyParents: 'ఈ ప్రయాణాన్ని నా తల్లిదండ్రులకు వివరించండి',
      learningJourneyKicker: 'లెర్నింగ్ జర్నీ',
      whoThisIsFor: 'ఇది ఎవరి కోసం',
      readGuidePrefix: 'గైడ్ చదవండి',
      blueprintsHeading: '11 దశలవారీ బ్లూప్రింట్‌లు',
      chooseBlueprintMobile: 'లెర్నింగ్ జర్నీని ఎంచుకోండి (11 బ్లూప్రింట్‌లు)',
      filterPathwaysLabel: 'మార్గాలను ఫిల్టర్ చేయండి:',
      allCountPrefix: 'అన్నీ',
      signInToTrackHint: 'మీరు పూర్తి చేసిన దశలను టిక్ చేయండి — డాష్‌బోర్డ్‌లో స్వయంచాలకంగా సేవ్ అవుతాయి.',
    },
    dashboard: {
      recommendedHeading: 'మీ కోసం సూచించిన తదుపరి అడుగులు',
      recommendedSubtitle: 'మీ ప్రస్తుత దశకు సరిపోయే ధృవీకరించబడిన గైడ్‌లు మరియు తక్కువ తెలిసిన అవకాశాలు.',
      recommendedGuideTag: 'ధృవీకరించబడిన గైడ్',
      recommendedOppTag: 'తక్కువ తెలిసిన అవకాశం',
      recommendedPathwayTag: 'లెర్నింగ్ జర్నీ',
      roadmapProgressLabel: 'మైలురాళ్ల పురోగతి',
      milestonesWord: 'మైలురాళ్లు',
      allMilestonesComplete: 'అన్ని మైలురాళ్లు పూర్తయ్యాయి',
      overallProgressTitle: 'మీ అభ్యాస పురోగతి',
      guidesCompletedLabel: 'చదివిన గైడ్‌లు',
      journeysStartedLabel: 'సక్రియ జర్నీలు',
      milestonesCheckedLabel: 'పూర్తయిన మైలురాళ్లు',
      emptyRoadmapsTitle: 'మీ వ్యక్తిగత రోడ్‌మ్యాప్ ఇక్కడ ప్రారంభమవుతుంది',
      emptyRoadmapsDesc: 'మీ దశ, స్ట్రీమ్ మరియు బడ్జెట్ గురించి కొన్ని ప్రశ్నలకు సమాధానం ఇచ్చి 3 స్పష్టమైన మార్గాలను పోల్చండి.',
      emptyDeadlinesTitle: 'మీ క్యాలెండర్‌లో ఇంకా గడువులు లేవు',
      emptyDeadlinesDesc: 'ప్రవేశ పరీక్షలు, స్కాలర్‌షిప్‌లు లేదా ఫెలోషిప్ తేదీలను ఇక్కడ ట్రాక్ చేయండి.',
      browseDiscoverCta: 'కదం డిస్కవర్ చూడండి',
      openDecoderCta: 'అధికారిక నోటీసును అర్థం చేసుకోండి',
      emptyLockerTitle: 'మీ విజయాలను నమోదు చేయడం ప్రారంభించండి',
      emptyLockerDesc: 'బోర్డ్ ఫలితాలు, NPTEL కోర్సులు, వర్క్‌షాప్‌లు, హ్యాకథాన్‌లు లేదా ప్రాజెక్ట్‌లను ఇప్పుడే సేవ్ చేస్తే తర్వాత CV మరియు SOP రాయడం సులభమవుతుంది.',
      emptySavedTitle: 'మీ వ్యక్తిగత రిఫరెన్స్ షెల్ఫ్ సిద్ధంగా ఉంది',
      emptySavedDesc: 'మీరు చూసిన ముఖ్యమైన గైడ్‌లు, స్కాలర్‌షిప్‌లు లేదా విశ్వవిద్యాలయాలను ఇక్కడ సేవ్ చేసుకోండి.',
      browseUniverseCta: 'యూనివర్స్ చూడండి',
      emptyProgressTitle: 'మీ ప్రతి అడుగును ట్రాక్ చేయండి',
      emptyProgressDesc: 'గైడ్‌లను చదివినట్లు గుర్తించండి లేదా ఏదైనా లెర్నింగ్ జర్నీలో దశలను టిక్ చేయండి.',
      startFirstJourneyCta: 'లెర్నింగ్ జర్నీ ప్రారంభించండి',
      emptyAiTitle: 'మీ మెంటర్ సంభాషణలు ఇక్కడ కనిపిస్తాయి',
      emptyAiDesc: 'స్ట్రీమ్ ఎంపిక నుండి స్కాలర్‌షిప్ అర్హత వరకు ఏదైనా తెలుగు, హిందీ లేదా ఇంగ్లీష్‌లో కదం AIని అడగండి.',
      askFirstQuestionCta: 'కదం AIని ప్రశ్న అడగండి',
      personalRecordLabel: 'వ్యక్తిగత రికార్డు',
      verifyLinkLabel: 'ధృవీకరించండి',
      removeLabel: 'తొలగించండి',
      deleteRoadmapLabel: 'రోడ్‌మ్యాప్ తొలగించండి',
      createNewRoadmapLabel: 'కొత్త రోడ్‌మ్యాప్ సృష్టించండి',
      savedRoadmapsTitle: 'సేవ్ చేసిన వ్యక్తిగత రోడ్‌మ్యాప్‌లు',
      savedRoadmapsDesc: 'తక్షణ మరియు స్వల్పకాలిక మైలురాళ్లను పూర్తి చేసిన కొద్దీ టిక్ చేయండి.',
      actionMilestonesLabel: 'చర్య మైలురాళ్లు',
      openGuideLink: 'గైడ్ తెరవండి',
      duePrefix: 'గడువు',
      submittedLocked: 'సమర్పించబడింది (లాక్ చేయబడింది)',
      sortedNote: 'తేదీ క్రమంలో అమర్చబడింది · సమర్పించిన అంశాలు పొరపాటు మార్పుల నుండి రక్షించబడతాయి',
      savingLabel: 'సేవ్ అవుతోంది...',
      categoryLabel: 'విభాగం',
      verificationLinkOptional: 'ధృవీకరణ లింక్ (ఐచ్ఛికం)',
      savedLibraryTitle: 'సేవ్ చేసిన లైబ్రరీ అంశాలు',
      pathwaysWord: 'మార్గాలు',
      statusPrefix: 'స్థితి',
      oppCategories: {
        examination: 'పరీక్ష',
        scholarship: 'స్కాలర్‌షిప్',
        internship: 'ఇంటర్న్‌షిప్',
        fellowship: 'ఫెలోషిప్',
        admission: 'ప్రవేశం',
        research: 'పరిశోధన',
        other: 'ఇతర',
      },
    },
    home: {
      nobodySubtitle: 'చాలా మంది విద్యార్థులకు తెలియని నిజమైన భారతీయ మరియు అంతర్జాతీయ స్కాలర్‌షిప్‌లు, ఫెలోషిప్‌లు మరియు పరిశోధన అవకాశాలు.',
      nobodyFilters: {
        all: 'అన్ని అంశాలు',
        school: 'పాఠశాల & ఇంటర్ (12వ)',
        college: 'కాలేజీ & పరిశోధన',
        scholarships: 'స్కాలర్‌షిప్‌లు & గ్లోబల్',
      },
      eligibilityLabel: 'ఎవరు దరఖాస్తు చేయవచ్చు',
      cycleLabel: 'సాధారణ సమయం',
      sourceLabel: 'మూలం',
      askAiAboutThis: 'దీని గురించి కదం AIని అడగండి',
      exploreAllDiscover: 'కదం డిస్కవర్‌లో అన్నీ చూడండి',
      whyNobodyTellsLabel: 'ఎవరూ చెప్పని ముఖ్య విషయం',
      askAiTemplatePrefix: 'దీనికి నేను ఎలా సిద్ధమవ్వాలి మరియు ఎలా దరఖాస్తు చేయాలి దశలవారీగా వివరించండి:',
    },
    kadamAi: {
      suggestedHeading: 'ఏం అడగాలో తెలియడం లేదా? వీటిలో ఒకదానితో ప్రారంభించండి:',
      categories: [
        {
          id: 'pathways',
          label: 'మార్గాన్ని ఎంచుకోవడం',
          prompts: [
            'నేను 10వ తరగతిలో ఉన్నాను. సైన్స్, కామర్స్ మరియు హ్యుమానిటీస్ మధ్య ఎలా నిర్ణయించుకోవాలి?',
            'JEE లేదా NEET లేకుండా ఇంటర్ (12వ తరగతి) తర్వాత ఉన్న మంచి కెరీర్ మార్గాలు ఏమిటి?',
          ],
        },
        {
          id: 'exams',
          label: 'పరీక్షలు & ప్రవేశాలు',
          prompts: [
            'CUET UG, JEE మరియు IISER Aptitude Test మధ్య తేడాను సులభంగా వివరించండి.',
            'GATE పరీక్ష M.Tech మాత్రమే కాకుండా PSU ఉద్యోగాలు మరియు PhD స్టైపెండ్‌కు ఎలా ఉపయోగపడుతుంది?',
          ],
        },
        {
          id: 'scholarships',
          label: 'స్కాలర్‌షిప్‌లు & ఆర్థిక సహాయం',
          prompts: [
            'భారతీయ కాలేజీ విద్యార్థులు NSP ద్వారా ఏ కేంద్ర మరియు రాష్ట్ర స్కాలర్‌షిప్‌లకు దరఖాస్తు చేయవచ్చు?',
            'భారీ లోన్ తీసుకోకుండా విదేశాల్లో మాస్టర్స్ (MS) ఎలా చదవవచ్చు?',
          ],
        },
        {
          id: 'research',
          label: 'పరిశోధన, ఇంటర్న్‌షిప్ & నైపుణ్యాలు',
          prompts: [
            'IIT కాని కాలేజీ విద్యార్థి ఫండెడ్ సమ్మర్ రీసెర్చ్ ఇంటర్న్‌షిప్ ఎలా పొందవచ్చు?',
            'నా మొదటి రీసెర్చ్ పేపర్ ఎలా రాయాలి లేదా LAMP ఫెలోషిప్‌కు ఎలా దరఖాస్తు చేయాలి?',
          ],
        },
      ],
      followUpHeading: 'తదుపరి ఉపయోగకరమైన ప్రశ్నలు',
      followUpsDefault: [
        'దీని కోసం ఏ పత్రాలు (documents) సిద్ధంగా ఉంచుకోవాలి?',
        'ఇక్కడ విద్యార్థులు సాధారణంగా చేసే తప్పులు ఏమిటి?',
        'ఈ ఎంపికను నా తల్లిదండ్రులకు స్పష్టంగా ఎలా వివరించాలి?',
      ],
      followUpsWithGuide: (guideTitle: string) => [
        `${guideTitle} కోసం 30 రోజుల కార్యాచరణ ప్రణాళిక ఇవ్వండి.`,
        `${guideTitle} విషయంలో విద్యార్థులు చేసే సాధారణ తప్పులు ఏమిటి?`,
        `${guideTitle} కి సంబంధించిన స్కాలర్‌షిప్‌లు లేదా ఫీజు రాయితీలు ఉన్నాయా?`,
      ],
      emptyHistoryEncouragement: 'కుడివైపు సంభాషణను ప్రారంభించండి — మీ ప్రశ్నలు మరియు గైడ్ లింక్‌లు ఇక్కడ గోప్యంగా సేవ్ అవుతాయి.',
      tipLine: 'సూచన: మీరు తెలుగు, హిందీ లేదా ఇంగ్లీష్‌లో టైప్ చేయవచ్చు లేదా మైక్ నొక్కి మాట్లాడవచ్చు.',
    },
    discover: {
      eligibilityHeading: 'అర్హత',
      benefitsHeading: 'మీకు లభించే ప్రయోజనం',
      cycleAndSourceHeading: 'సమయం & అధికారిక మూలం',
      relatedGuideLabel: 'సంబంధిత గైడ్',
      askAiAboutOpp: 'కదం AIని అడగండి',
      emptyHintCta: 'దీని గురించి కదం AIని అడగండి:',
      askAiForQueryPrefix: 'దీనికి సంబంధించిన ధృవీకరించబడిన స్కాలర్‌షిప్‌లు, ఇంటర్న్‌షిప్‌లు లేదా ప్రోగ్రామ్‌ల గురించి చెప్పండి:',
    },
  },

  hi: {
    universe: {
      readProgressLabel: 'आपकी बैच 1 पठन प्रगति',
      readProgressOf: 'में से',
      guidesRead: 'पूर्ण गाइड पढ़े गए',
      completedBannerTitle: 'गाइड पढ़ा हुआ चिह्नित किया गया',
      completedBannerDesc: 'यह आपके स्टूडेंट डैशबोर्ड की प्रगति में सहेजा गया है। क्या आप अगले जुड़े विषय को पढ़ना चाहेंगे?',
      nextRecommendedGuide: 'अगले गाइड पर जाएँ',
      relatedOpportunitiesHeading: 'संबंधित सत्यापित अवसर',
      relatedJourneyHeading: 'जुड़ी हुई लर्निंग जर्नी',
      openJourneyCta: 'चरण-दर-चरण यात्रा खोलें',
      exploreAllOppsCta: 'कदम डिस्कवर में सभी अवसर देखें',
      emptyEncouragement: 'इस फ़िल्टर से कोई विषय नहीं मिला — फ़िल्टर रीसेट करें या सीधे कदम AI से सरल भाषा में पूछें।',
      popularQuickTopics: 'शुरुआत के लिए उपयोगी गाइड:',
      readBadge: 'पढ़ा गया',
      openTopicCta: 'विषय देखें',
      readGuideCta: 'गाइड पढ़ें',
      complete16SectionLabel: 'पूर्ण 16-भाग गाइड',
      instantAiAvailable: 'तत्काल AI संक्षिप्त विवरण उपलब्ध',
    },
    pathways: {
      journeyProgressTitle: 'यात्रा की प्रगति',
      stagesDoneOf: 'चरण पूर्ण',
      journeyCompleteTitle: 'लर्निंग जर्नी ब्लूप्रिंट पूरा हुआ',
      journeyCompleteDesc: 'आपने इस यात्रा के सभी चरण पूरे कर लिए हैं। अब संबंधित अवसर देखें या अपना व्यक्तिगत रोडमैप बनाएँ।',
      journeyCompleteNextGuide: 'संबंधित गाइड देखें',
      journeyCompleteDiscover: 'कदम डिस्कवर देखें',
      markDone: 'पूर्ण चिह्नित करें',
      completedStage: 'पूर्ण',
      stageWord: 'चरण',
      matchingOppsHeading: 'इस स्तर के लिए सत्यापित अवसर',
      viewAllDiscover: 'कदम डिस्कवर में सभी देखें',
      compareSideBySide: 'आमने-सामने तुलना करें',
      comparingLabel: '✓ तुलना में शामिल',
      addCompareShort: '+ तुलना करें',
      removeCompareLong: 'तुलना से हटाएँ',
      addCompareLong: 'तुलना में जोड़ें',
      closeComparison: 'तुलना बंद करें',
      dimensionLabel: 'मानदंड',
      pathwayComparisonKicker: 'मार्ग तुलना',
      sideBySideMatrixTitle: 'आमने-सामने विकल्प तालिका',
      applicablePathwaysLabel: 'उपलब्ध मार्ग',
      pathwaySuffix: 'मार्ग',
      durationPrefix: 'अवधि',
      explainJourneyParents: 'यह यात्रा मेरे माता-पिता को समझाएँ',
      learningJourneyKicker: 'लर्निंग जर्नी',
      whoThisIsFor: 'यह किसके लिए है',
      readGuidePrefix: 'गाइड पढ़ें',
      blueprintsHeading: '11 चरण-दर-चरण ब्लूप्रिंट',
      chooseBlueprintMobile: 'लर्निंग जर्नी चुनें (11 ब्लूप्रिंट)',
      filterPathwaysLabel: 'मार्ग फ़िल्टर करें:',
      allCountPrefix: 'सभी',
      signInToTrackHint: 'जैसे-जैसे चरण पूरे हों, उन्हें टिक करें — आपकी प्रगति डैशबोर्ड में सहेजी जाती है।',
    },
    dashboard: {
      recommendedHeading: 'आपके लिए सुझाए गए अगले कदम',
      recommendedSubtitle: 'आपकी शिक्षा स्थिति के अनुसार चुने गए सत्यापित गाइड और कम ज्ञात अवसर।',
      recommendedGuideTag: 'सत्यापित गाइड',
      recommendedOppTag: 'कम ज्ञात अवसर',
      recommendedPathwayTag: 'लर्निंग जर्नी',
      roadmapProgressLabel: 'माइलस्टोन प्रगति',
      milestonesWord: 'माइलस्टोन',
      allMilestonesComplete: 'सभी माइलस्टोन पूरे हो गए',
      overallProgressTitle: 'आपकी सीखने की गति',
      guidesCompletedLabel: 'पढ़े गए गाइड',
      journeysStartedLabel: 'सक्रिय यात्राएँ',
      milestonesCheckedLabel: 'पूर्ण माइलस्टोन',
      emptyRoadmapsTitle: 'आपका व्यक्तिगत रोडमैप यहाँ से शुरू होता है',
      emptyRoadmapsDesc: 'अपने स्तर, स्ट्रीम और बजट के बारे में कुछ सरल सवालों के जवाब दें और 3 व्यावहारिक मार्गों की तुलना करें।',
      emptyDeadlinesTitle: 'आपके कैलेंडर में अभी कोई समय-सीमा नहीं है',
      emptyDeadlinesDesc: 'प्रवेश परीक्षाओं, छात्रवृत्तियों या फ़ेलोशिप की अंतिम तिथियाँ यहाँ सहेजें ताकि कोई अवसर न छूटे।',
      browseDiscoverCta: 'कदम डिस्कवर देखें',
      openDecoderCta: 'आधिकारिक नोटिस समझें',
      emptyLockerTitle: 'अपनी उपलब्धियाँ दर्ज करना शुरू करें',
      emptyLockerDesc: 'बोर्ड परिणाम, NPTEL कोर्स, वर्कशॉप, हैकाथॉन, प्रोजेक्ट या वॉलंटियरिंग — अभी दर्ज करने से बाद में CV और SOP बनाना आसान हो जाता है।',
      emptySavedTitle: 'आपकी व्यक्तिगत संदर्भ शेल्फ़ तैयार है',
      emptySavedDesc: 'जो भी गाइड, यात्रा, छात्रवृत्ति या विश्वविद्यालय उपयोगी लगे, उसे यहाँ सहेजें।',
      browseUniverseCta: 'ज्ञान ब्रह्मांड देखें',
      emptyProgressTitle: 'अपने हर कदम की प्रगति देखें',
      emptyProgressDesc: 'किसी पूर्ण गाइड को पढ़ा हुआ चिह्नित करें या लर्निंग जर्नी के चरण टिक करें, आपकी प्रगति यहाँ दिखेगी।',
      startFirstJourneyCta: 'लर्निंग जर्नी शुरू करें',
      emptyAiTitle: 'आपकी मेंटर बातचीत यहाँ दिखाई देगी',
      emptyAiDesc: 'स्ट्रीम चुनने से लेकर स्कॉलरशिप पात्रता तक कुछ भी हिन्दी, तेलुगु या अंग्रेज़ी में कदम AI से पूछें।',
      askFirstQuestionCta: 'कदम AI से सवाल पूछें',
      personalRecordLabel: 'व्यक्तिगत रिकॉर्ड',
      verifyLinkLabel: 'सत्यापित करें',
      removeLabel: 'हटाएँ',
      deleteRoadmapLabel: 'रोडमैप हटाएँ',
      createNewRoadmapLabel: 'नया रोडमैप बनाएँ',
      savedRoadmapsTitle: 'सहेजे गए व्यक्तिगत रोडमैप',
      savedRoadmapsDesc: 'तात्कालिक और अल्पकालिक माइलस्टोन पूरे होने पर उन्हें टिक करें।',
      actionMilestonesLabel: 'कार्य माइलस्टोन',
      openGuideLink: 'गाइड खोलें',
      duePrefix: 'अंतिम तिथि',
      submittedLocked: 'जमा किया गया (लॉक)',
      sortedNote: 'तिथि के क्रम में व्यवस्थित · जमा किए गए आइटम अनजाने बदलाव से सुरक्षित हैं',
      savingLabel: 'सहेजा जा रहा है...',
      categoryLabel: 'श्रेणी',
      verificationLinkOptional: 'सत्यापन लिंक (वैकल्पिक)',
      savedLibraryTitle: 'सहेजी गई लाइब्रेरी सामग्री',
      pathwaysWord: 'मार्ग',
      statusPrefix: 'स्थिति',
      oppCategories: {
        examination: 'परीक्षा',
        scholarship: 'छात्रवृत्ति',
        internship: 'इंटर्नशिप',
        fellowship: 'फ़ेलोशिप',
        admission: 'प्रवेश',
        research: 'अनुसंधान',
        other: 'अन्य',
      },
    },
    home: {
      nobodySubtitle: 'ऐसे वास्तविक भारतीय और अंतरराष्ट्रीय कार्यक्रम, फ़ेलोशिप और अनुदान जिनके बारे में बड़े कोचिंग शहरों के बाहर छात्रों को शायद ही बताया जाता है।',
      nobodyFilters: {
        all: 'सभी जानकारी',
        school: 'स्कूल और 12वीं',
        college: 'कॉलेज और रिसर्च',
        scholarships: 'छात्रवृत्ति और ग्लोबल',
      },
      eligibilityLabel: 'कौन आवेदन कर सकता है',
      cycleLabel: 'सामान्य समय-सीमा',
      sourceLabel: 'आधिकारिक स्रोत',
      askAiAboutThis: 'इस बारे में कदम AI से पूछें',
      exploreAllDiscover: 'कदम डिस्कवर में सभी अवसर देखें',
      whyNobodyTellsLabel: 'जो छात्रों को कम बताया जाता है',
      askAiTemplatePrefix: 'मुझे चरण-दर-चरण समझाएँ कि मैं इसके लिए कैसे तैयारी और आवेदन कर सकता/सकती हूँ:',
    },
    kadamAi: {
      suggestedHeading: 'समझ नहीं आ रहा क्या पूछें? इनमें से किसी एक से शुरुआत करें:',
      categories: [
        {
          id: 'pathways',
          label: 'सही मार्ग चुनना',
          prompts: [
            'मैं 10वीं में हूँ और साइंस, कॉमर्स व आर्ट्स में उलझा हूँ। सही स्ट्रीम कैसे चुनूँ?',
            'JEE या NEET के बिना 12वीं के बाद कौन से अच्छे करियर विकल्प हैं?',
          ],
        },
        {
          id: 'exams',
          label: 'परीक्षाएँ और प्रवेश',
          prompts: [
            'CUET UG, JEE और IISER Aptitude Test में अंतर सरल भाषा में समझाएँ।',
            'GATE परीक्षा सिर्फ़ M.Tech के अलावा PSU नौकरी और PhD स्टाइपेंड में कैसे मदद करती है?',
          ],
        },
        {
          id: 'scholarships',
          label: 'छात्रवृत्ति और आर्थिक सहायता',
          prompts: [
            'भारत के कॉलेज छात्र NSP पोर्टल से कौन-सी प्रमुख छात्रवृत्तियों के लिए आवेदन कर सकते हैं?',
            'बड़ा लोन लिए बिना विदेश में मास्टर्स (MS) की पढ़ाई कैसे की जा सकती है?',
          ],
        },
        {
          id: 'research',
          label: 'रिसर्च, इंटर्नशिप और कौशल',
          prompts: [
            'नॉन-IIT कॉलेज का छात्र फ़ंडेड समर रिसर्च इंटर्नशिप कैसे प्राप्त कर सकता है?',
            'मैं अपना पहला रिसर्च पेपर कैसे लिखूँ या LAMP फ़ेलोशिप के लिए कैसे आवेदन करूँ?',
          ],
        },
      ],
      followUpHeading: 'उपयोगी अगले सवाल',
      followUpsDefault: [
        'इसके लिए मुझे कौन-से दस्तावेज़ (documents) तैयार रखने चाहिए?',
        'इसमें छात्र आमतौर पर कौन-सी गलतियाँ करते हैं?',
        'मैं यह विकल्प अपने माता-पिता को साफ़ तरीके से कैसे समझाऊँ?',
      ],
      followUpsWithGuide: (guideTitle: string) => [
        `${guideTitle} के लिए 30 दिन की कार्य-योजना बनाएँ।`,
        `${guideTitle} में छात्र कौन-सी सामान्य गलतियाँ करते हैं?`,
        `क्या ${guideTitle} से जुड़ी कोई छात्रवृत्ति या शुल्क छूट उपलब्ध है?`,
      ],
      emptyHistoryEncouragement: 'दाईं ओर बातचीत शुरू करें — आपके सवाल और सत्यापित गाइड लिंक यहाँ सुरक्षित रहेंगे।',
      tipLine: 'सुझाव: आप हिन्दी, Hinglish, तेलुगु या अंग्रेज़ी में लिख सकते हैं, या माइक दबाकर बोल सकते हैं।',
    },
    discover: {
      eligibilityHeading: 'पात्रता',
      benefitsHeading: 'आपको क्या मिलता है',
      cycleAndSourceHeading: 'समय-सीमा और आधिकारिक स्रोत',
      relatedGuideLabel: 'संबंधित गाइड',
      askAiAboutOpp: 'कदम AI से पूछें',
      emptyHintCta: 'कदम AI से इस बारे में पूछें:',
      askAiForQueryPrefix: 'इससे संबंधित सत्यापित छात्रवृत्तियों, इंटर्नशिप या कार्यक्रमों के बारे में बताएँ:',
    },
  },
};
