import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CalendarPlus,
  Check,
  Compass,
  Copy,
  FileText,
  Lightbulb,
  Loader2,
  Printer,
  Scale,
  ShieldCheck,
  Upload,
  Users,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { api } from '../lib/api';
import { useFirebase } from '../contexts/FirebaseContext';
import { useVoice } from '../hooks/useVoice';
import { OPPORTUNITIES } from '../data/catalog';
import { scrollIntoViewIfNeeded } from '../lib/smartScroll';
import { useI18n, useTranslatedOpportunities } from '../hooks/useI18n';
import { LanguageSelector } from '../components/LanguageSelector';
import type { DecodedDocumentResult, LanguageCode, ParentBriefReport } from '../types/domain';

export type ToolTab = 'decoder' | 'parents' | 'gap-detector' | 'what-can-i-do' | 'reality-check';

interface ToolsViewProps {
  initialTab?: ToolTab;
  initialParentPathway?: string | null;
  onClearInitialParentPathway: () => void;
  onOpenGuide: (slug: string) => void;
}

const STAGES: { value: string; labels: Record<LanguageCode, string> }[] = [
  { value: 'Class 8–10 (School)', labels: { en: 'Class 8–10 (School)', hi: 'कक्षा 8–10 (स्कूल)', te: '8–10 తరగతి (పాఠశాల)' } },
  { value: 'Completed Class 10', labels: { en: 'Completed Class 10', hi: '10वीं पास (Class 10 के बाद)', te: '10వ తరగతి పూర్తి' } },
  { value: 'Class 11–12 (Science / Commerce / Humanities)', labels: { en: 'Class 11–12 (Science / Commerce / Humanities)', hi: 'कक्षा 11–12 (Science / Commerce / Humanities)', te: 'ఇంటర్ / 11–12 (సైన్స్ / కామర్స్ / హ్యుమానిటీస్)' } },
  { value: 'Diploma / Polytechnic', labels: { en: 'Diploma / Polytechnic', hi: 'डिप्लोमा / पॉलिटेक्निक', te: 'డిప్లొమా / పాలిటెక్నిక్' } },
  { value: 'Undergraduate Student', labels: { en: 'Undergraduate Student', hi: 'स्नातक छात्र (UG)', te: 'డిగ్రీ విద్యార్థి (UG)' } },
  { value: 'Graduate / Job Seeker', labels: { en: 'Graduate / Job Seeker', hi: 'ग्रेजुएट / नौकरी की तलाश', te: 'గ్రాడ్యుయేట్ / ఉద్యోగ అన్వేషకులు' } },
  { value: 'Postgraduate Student', labels: { en: 'Postgraduate Student', hi: 'पोस्टग्रेजुएट छात्र (PG)', te: 'పీజీ విద్యార్థి (PG)' } },
  { value: 'Research Scholar', labels: { en: 'Research Scholar', hi: 'रिसर्च स्कॉलर (PhD / शोध)', te: 'పరిశోధన విద్యార్థి' } },
  { value: 'Early-Career Professional', labels: { en: 'Early-Career Professional', hi: 'अर्ली-करियर प्रोफेशनल', te: 'ప్రారంభ కెరీర్ నిపుణులు' } },
];

const PARENT_EXAMPLES: Record<LanguageCode, string[]> = {
  en: [
    'BS-MS Pure Science Research at IISER',
    'Industrial / Communication Design (NID / UCEED)',
    '5-Year Integrated Law (CLAT / NLU)',
    'Public-Funded MS in Germany after B.Tech',
    'Polytechnic Diploma + Lateral Entry Engineering',
  ],
  hi: [
    'IISER में 5-वर्षीय BS-MS Pure Science Research',
    'NID / UCEED से Industrial और Communication Design',
    'CLAT / NLU से 5-वर्षीय Integrated Law (BA LLB)',
    'B.Tech के बाद जर्मनी में कम फीस वाला MS',
    'Polytechnic Diploma + Lateral Entry B.Tech',
  ],
  te: [
    'IISER లో 5 ఏళ్ల BS-MS ప్యూర్ సైన్స్ రీసెర్చ్',
    'NID / UCEED ద్వారా డిజైన్ కోర్సులు',
    'CLAT / NLU ద్వారా 5 ఏళ్ల ఇంటిగ్రేటెడ్ లా (BA LLB)',
    'B.Tech తర్వాత జర్మనీలో తక్కువ ఫీజుతో MS',
    'పాలిటెక్నిక్ డిప్లొమా + లాటరల్ ఎంట్రీ ఇంజనీరింగ్',
  ],
};

const SPECIAL_PROMPTS: Record<
  'gap-detector' | 'what-can-i-do' | 'reality-check',
  Record<LanguageCode, string[]>
> = {
  'gap-detector': {
    en: [
      'Class 11 PCB student from a rural district who does not want only MBBS',
      'Final-year B.Com student interested in policy, finance, and government fellowships',
      '1st-year M.Sc Biotechnology student looking for paid research internships and PhD fellowships',
    ],
    hi: [
      'ग्रामीण ज़िले का कक्षा 11 PCB छात्र जो केवल MBBS के अलावा बेहतर विकल्प जानना चाहता है',
      'अंतिम वर्ष का B.Com छात्र जिसे पॉलिसी, फाइनेंस और सरकारी फेलोशिप में रुचि है',
      'M.Sc Biotechnology प्रथम वर्ष का छात्र जिसे पेड रिसर्च इंटर्नशिप और PhD फेलोशिप चाहिए',
    ],
    te: [
      'కేవలం MBBS కాకుండా ఇతర మంచి అవకాశాలు తెలుసుకోవాలనుకునే ఇంటర్ BiPC విద్యార్థి',
      'పాలసీ, ఫైనాన్స్ మరియు ప్రభుత్వ ఫెలోషిప్‌లపై ఆసక్తి ఉన్న ఫైనల్ ఇయర్ B.Com విద్యార్థి',
      'పెయిడ్ రీసెర్చ్ ఇంటర్న్‌షిప్‌లు మరియు PhD ఫెలోషిప్‌ల కోసం చూస్తున్న M.Sc విద్యార్థి',
    ],
  },
  'what-can-i-do': {
    en: [
      'Polytechnic Diploma in Civil Engineering',
      'B.A. Economics + Excel & SQL',
      'Class 12 Humanities with strong writing and public speaking skills',
    ],
    hi: [
      'Civil Engineering में पॉलिटेक्निक डिप्लोमा',
      'B.A. Economics के साथ Excel और SQL की जानकारी',
      'कक्षा 12 आर्ट्स/ह्यूमैनिटीज़ जिसमें लिखने और बोलने की अच्छी क्षमता है',
    ],
    te: [
      'సివిల్ ఇంజనీరింగ్‌లో పాలిటెక్నిక్ డిప్లొమా',
      'B.A. ఎకనామిక్స్ + Excel & SQL నైపుణ్యాలు',
      'రచన మరియు పబ్లిక్ స్పీకింగ్ నైపుణ్యాలతో ఇంటర్ హ్యుమానిటీస్',
    ],
  },
  'reality-check': {
    en: [
      'UPSC Civil Services Examination (IAS/IPS)',
      'Private MBA vs CAT IIM / Tier-1 MBA',
      'B.Tech Computer Science from a non-premier college in 2026',
    ],
    hi: [
      'UPSC सिविल सेवा परीक्षा (IAS/IPS) की वास्तविकता और बैकअप प्लान',
      'प्राइवेट MBA बनाम CAT के ज़रिए IIM / Tier-1 MBA',
      'सामान्य कॉलेज से B.Tech Computer Science करने के बाद वास्तविक करियर विकल्प',
    ],
    te: [
      'UPSC సివిల్ సర్వీసెస్ (IAS/IPS) పరీక్ష వాస్తవాలు మరియు బ్యాకప్ ప్లాన్',
      'ప్రైవేట్ MBA vs CAT ద్వారా IIM / టైర్-1 MBA',
      'సాధారణ కాలేజీలో B.Tech కంప్యూటర్ సైన్స్ తర్వాత వాస్తవ కెరీర్ మార్గాలు',
    ],
  },
};

const SPECIAL_COPY: Record<
  LanguageCode,
  {
    gapDesc: string;
    whatDesc: string;
    realityDesc: string;
    stageLabel: string;
    gapInputLabel: string;
    whatInputLabel: string;
    realityInputLabel: string;
    gapPlaceholder: string;
    whatPlaceholder: string;
    realityPlaceholder: string;
    quickPrompts: string;
    loadingMsg: string;
    aiKicker: string;
    curatedKicker: string;
    curatedSub: string;
    trackedLabel: string;
    trackLabel: string;
  }
> = {
  en: {
    gapDesc:
      'Share your current course, background, and goals. We will highlight high-impact fellowships, scholarships, exams, and programmes students in your exact situation routinely miss.',
    whatDesc:
      'Enter any degree, diploma, subject combination, or skill you already have—or are considering—to see concrete academic, government, research, private, and startup routes.',
    realityDesc:
      'Cut through coaching-industry hype. Get an honest view of selection odds, preparation time, real costs, daily work realities, and sensible fallback options.',
    stageLabel: 'Student Stage',
    gapInputLabel: 'Describe your background, stream & interests',
    whatInputLabel: 'Qualification, degree, subject, or skill',
    realityInputLabel: 'Exam, degree, or career path to evaluate',
    gapPlaceholder:
      'e.g., 2nd-year B.Tech ECE student from a Tier-3 college, interested in hardware research and public-sector careers, family income under 4 LPA.',
    whatPlaceholder:
      'e.g., B.Sc Mathematics from a state university, comfortable with Python and teaching.',
    realityPlaceholder:
      'e.g., Dropping 2 years after B.Tech exclusively to prepare for UPSC CSE without a backup job.',
    quickPrompts: 'Quick Prompts to Try',
    loadingMsg: 'Building a grounded, realistic analysis...',
    aiKicker: 'AI Guidance · Cross-Check Dates on Official Portals',
    curatedKicker: 'What Nobody Told Me · Missed Opportunity Explorer',
    curatedSub: 'High-value Indian & global programmes students rarely hear about early enough',
    trackedLabel: 'Tracked',
    trackLabel: 'Track',
  },
  hi: {
    gapDesc:
      'अपना वर्तमान कोर्स, पृष्ठभूमि और लक्ष्य साझा करें। हम ऐसी उपयोगी fellowships, scholarships, परीक्षाएँ और कार्यक्रम बताएँगे जो आपकी स्थिति के छात्र अक्सर चूक जाते हैं।',
    whatDesc:
      'अपनी कोई भी डिग्री, डिप्लोमा, विषय संयोजन या स्किल लिखें—और जानें कि उससे पढ़ाई, सरकारी परीक्षा, रिसर्च, प्राइवेट नौकरी और स्टार्टअप के कौन से ठोस रास्ते खुलते हैं।',
    realityDesc:
      'कोचिंग प्रचार से दूर हटकर चयन की वास्तविक संभावना, तैयारी का समय, असली खर्च, रोज़ के काम की सच्चाई और समझदारी भरा Plan B जानें।',
    stageLabel: 'छात्र का स्तर',
    gapInputLabel: 'अपनी पृष्ठभूमि, स्ट्रीम और रुचियाँ लिखें',
    whatInputLabel: 'योग्यता, डिग्री, विषय या स्किल',
    realityInputLabel: 'जिस परीक्षा, डिग्री या करियर की सच्चाई जाननी है',
    gapPlaceholder:
      'जैसे: Tier-3 कॉलेज में B.Tech ECE दूसरे वर्ष का छात्र, हार्डवेयर रिसर्च और सरकारी अवसरों में रुचि, पारिवारिक आय 4 लाख से कम।',
    whatPlaceholder:
      'जैसे: स्टेट यूनिवर्सिटी से B.Sc Mathematics, Python और पढ़ाने में अच्छी पकड़।',
    realityPlaceholder:
      'जैसे: बिना किसी बैकअप नौकरी के B.Tech के बाद 2 साल सिर्फ़ UPSC CSE की तैयारी करना।',
    quickPrompts: 'आज़माने के लिए त्वरित उदाहरण',
    loadingMsg: 'व्यावहारिक और वास्तविक विश्लेषण तैयार हो रहा है...',
    aiKicker: 'AI मार्गदर्शन · आधिकारिक पोर्टल पर तिथियाँ ज़रूर जाँचें',
    curatedKicker: 'जो किसी ने नहीं बताया · छूटे अवसरों की सूची',
    curatedSub: 'ऐसे उच्च-मूल्य भारतीय व अंतर्राष्ट्रीय कार्यक्रम जिनके बारे में छात्रों को समय पर पता नहीं चलता',
    trackedLabel: 'ट्रैक किया गया',
    trackLabel: 'ट्रैक करें',
  },
  te: {
    gapDesc:
      'మీ ప్రస్తుత కోర్సు, నేపథ్యం మరియు లక్ష్యాలను పంచుకోండి. మీ దశలో విద్యార్థులు తరచూ కోల్పోయే ముఖ్యమైన ఫెలోషిప్‌లు, స్కాలర్‌షిప్‌లు మరియు పరీక్షలను మేము చూపుతాము.',
    whatDesc:
      'మీ దగ్గర ఉన్న ఏదైనా డిగ్రీ, డిప్లొమా, సబ్జెక్ట్ లేదా నైపుణ్యాన్ని నమోదు చేసి, దానితో తెరుచుకునే చదువు, ప్రభుత్వ, పరిశోధన, ప్రైవేట్ మరియు స్టార్టప్ మార్గాలను చూడండి.',
    realityDesc:
      'కోచింగ్ ప్రకటనలకు అతీతంగా ఎంపిక అవకాశాలు, ప్రిపరేషన్ సమయం, నిజమైన ఖర్చు, రోజువారీ పని వాస్తవాలు మరియు సురక్షితమైన Plan B తెలుసుకోండి.',
    stageLabel: 'విద్యార్థి దశ',
    gapInputLabel: 'మీ నేపథ్యం, స్ట్రీమ్ & ఆసక్తులను వివరించండి',
    whatInputLabel: 'అర్హత, డిగ్రీ, సబ్జెక్ట్ లేదా నైపుణ్యం',
    realityInputLabel: 'విశ్లేషించాల్సిన పరీక్ష, డిగ్రీ లేదా కెరీర్ మార్గం',
    gapPlaceholder:
      'ఉదా: Tier-3 కాలేజీలో B.Tech ECE 2వ సంవత్సరం విద్యార్థి, హార్డ్‌వేర్ రీసెర్చ్ మరియు ప్రభుత్వ రంగాలపై ఆసక్తి.',
    whatPlaceholder:
      'ఉదా: స్టేట్ యూనివర్సిటీ నుండి B.Sc మ్యాథమెటిక్స్, Python మరియు బోధనలో ఆసక్తి.',
    realityPlaceholder:
      'ఉదా: బ్యాకప్ ఉద్యోగం లేకుండా B.Tech తర్వాత 2 ఏళ్లు కేవలం UPSC CSE కోసం ప్రిపేర్ అవ్వడం.',
    quickPrompts: 'ప్రయత్నించడానికి ఉదాహరణలు',
    loadingMsg: 'వాస్తవిక విశ్లేషణ సిద్ధమవుతోంది...',
    aiKicker: 'AI మార్గదర్శకత్వం · అధికారిక పోర్టల్‌లో తేదీలను తనిఖీ చేయండి',
    curatedKicker: 'ఎవరూ చెప్పనివి · మిస్ అయిన అవకాశాల జాబితా',
    curatedSub: 'విద్యార్థులకు సమయానికి తెలియని విలువైన భారతీయ మరియు అంతర్జాతీయ కార్యక్రమాలు',
    trackedLabel: 'ట్రాక్ చేయబడింది',
    trackLabel: 'ట్రాక్ చేయండి',
  },
};

interface SpecialToolResponse {
  headline: string;
  overview: string;
  items: {
    title: string;
    category: string;
    whyItMatters: string;
    realityAndChallenges: string;
    immediateStep: string;
  }[];
  closingNote: string;
  relatedGuides: { slug: string; title: string }[];
}

export function ToolsView({
  initialTab = 'decoder',
  initialParentPathway = null,
  onClearInitialParentPathway,
  onOpenGuide,
}: ToolsViewProps) {
  const {
    preferredLanguage,
    studentProfile,
    addDeadline,
    isBookmarked,
    toggleBookmark,
  } = useFirebase();
  const { lang, setLang, t, getGuideListMeta, getLanguageNativeName } = useI18n();

  const [activeTab, setActiveTab] = useState<ToolTab>(initialTab);
  const [language, setLanguage] = useState<LanguageCode>(preferredLanguage);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setLanguage(preferredLanguage);
  }, [preferredLanguage]);

  // Voice readout for decoded results
  const { speakingId, speakText, stopSpeaking } = useVoice();
  const isSpeakingDecoded = speakingId === 'decoded-result';

  // ---- 1. Notification & Document Decoder state ----
  const [decoderMode, setDecoderMode] = useState<'notification' | 'document'>('notification');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [decoding, setDecoding] = useState(false);
  const [decoderError, setDecoderError] = useState<string | null>(null);
  const [decodedResult, setDecodedResult] = useState<DecodedDocumentResult | null>(null);
  const [addedDates, setAddedDates] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---- 2. Explain It to My Parents state ----
  const [parentPathway, setParentPathway] = useState('');
  const [parentStage, setParentStage] = useState(studentProfile?.educationLevel || STAGES[2].value);
  const [parentConcerns, setParentConcerns] = useState('');
  const [parentLoading, setParentLoading] = useState(false);
  const [parentError, setParentError] = useState<string | null>(null);
  const [parentReport, setParentReport] = useState<ParentBriefReport | null>(null);
  const [copiedParentBrief, setCopiedParentBrief] = useState(false);

  useEffect(() => {
    if (initialParentPathway) {
      setActiveTab('parents');
      setParentPathway(initialParentPathway);
      onClearInitialParentPathway();
    }
  }, [initialParentPathway, onClearInitialParentPathway]);

  // ---- 3-5. Special Tools (Gap Detector, What Can I Do, Reality Check) ----
  const [toolStage, setToolStage] = useState(studentProfile?.educationLevel || STAGES[4].value);
  const [toolInput, setToolInput] = useState('');
  const [toolLoading, setToolLoading] = useState(false);
  const [toolError, setToolError] = useState<string | null>(null);
  const [toolResults, setToolResults] = useState<
    Partial<Record<'gap-detector' | 'what-can-i-do' | 'reality-check', SpecialToolResponse>>
  >({});
  const [trackedOpps, setTrackedOpps] = useState<Record<string, boolean>>({});

  // Smart viewport anchors
  const toolWorkspaceRef = useRef<HTMLDivElement | null>(null);
  const decoderResultRef = useRef<HTMLDivElement | null>(null);
  const parentFormRef = useRef<HTMLDivElement | null>(null);
  const parentResultRef = useRef<HTMLDivElement | null>(null);
  const specialFormRef = useRef<HTMLDivElement | null>(null);
  const specialResultRef = useRef<HTMLDivElement | null>(null);

  const lesserKnownBase = useMemo(() => OPPORTUNITIES.filter((o) => o.lesserKnown), []);
  const { opportunities: lesserKnownOpps } = useTranslatedOpportunities(
    activeTab === 'gap-detector' ? lesserKnownBase : [],
    lang
  );

  const toolTabs: { id: ToolTab; label: string }[] = [
    { id: 'decoder', label: t.tools.tabDecoder },
    { id: 'parents', label: t.tools.tabParents },
    { id: 'gap-detector', label: t.tools.tabGap },
    { id: 'what-can-i-do', label: t.tools.tabWhatCanIDo },
    { id: 'reality-check', label: t.tools.tabReality },
  ];

  const sc = SPECIAL_COPY[lang];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setDecoderError(null);
    if (!f) {
      setSelectedFile(null);
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setDecoderError(
        lang === 'hi'
          ? 'कृपया 5 MB से छोटी फाइल चुनें।'
          : lang === 'te'
          ? 'దయచేసి 5 MB కంటే తక్కువ పరిమాణం గల ఫైల్ ఎంచుకోండి.'
          : 'Please choose a file smaller than 5 MB.'
      );
      setSelectedFile(null);
      return;
    }
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(f.type)) {
      setDecoderError(
        lang === 'hi'
          ? 'समर्थित फाइल प्रकार: PDF, PNG, JPG या WEBP।'
          : lang === 'te'
          ? 'మద్దతు ఉన్న ఫైల్ రకాలు: PDF, PNG, JPG, లేదా WEBP.'
          : 'Supported file types: PDF, PNG, JPG, or WEBP.'
      );
      setSelectedFile(null);
      return;
    }
    setSelectedFile(f);
  };

  const handleDecode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !pastedText.trim()) {
      setDecoderError(
        lang === 'hi'
          ? 'कृपया विश्लेषण के लिए PDF/तस्वीर अपलोड करें या आधिकारिक टेक्स्ट पेस्ट करें।'
          : lang === 'te'
          ? 'దయచేసి విశ్లేషణ కోసం PDF/చిత్రాన్ని అప్‌లోడ్ చేయండి లేదా టెక్స్ట్ పేస్ట్ చేయండి.'
          : 'Upload a PDF/image or paste the official text to analyze.'
      );
      return;
    }
    setDecoding(true);
    setDecoderError(null);
    setDecodedResult(null);
    try {
      const fd = new FormData();
      fd.append('mode', decoderMode);
      fd.append('language', language);
      if (pastedText.trim()) fd.append('text', pastedText.trim());
      if (selectedFile) fd.append('file', selectedFile);
      const result = await api.decodeDocument(fd);
      setDecodedResult(result);
      setTimeout(() => {
        scrollIntoViewIfNeeded(decoderResultRef.current, {
          forceAlign: window.innerWidth < 1024,
        });
      }, 40);
    } catch (err) {
      setDecoderError(err instanceof Error ? err.message : 'Could not analyze this document.');
    } finally {
      setDecoding(false);
    }
  };

  const handleAddDecodedDate = async (label: string, value: string) => {
    const key = `${label}_${value}`;
    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(value.trim())
      ? value.trim()
      : value.slice(0, 32);
    await addDeadline({
      title: `${decodedResult?.documentType || 'Document'} — ${label}`.slice(0, 190),
      category: decoderMode === 'notification' ? 'Official Notification' : 'Document Deadline',
      dueDate: parsedDate,
      notes: `AGLA KADAM Document Decoder (${value})`,
    });
    setAddedDates((prev) => ({ ...prev, [key]: true }));
  };

  const handleGenerateParentBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentPathway.trim()) {
      setParentError(
        lang === 'hi'
          ? 'कृपया वह करियर, डिग्री या रास्ता लिखें जिसे आप समझाना चाहते हैं।'
          : lang === 'te'
          ? 'దయచేసి మీరు వివరించాలనుకునే కెరీర్, డిగ్రీ లేదా మార్గాన్ని నమోదు చేయండి.'
          : 'Enter the career, degree, or pathway you want to explain.'
      );
      return;
    }
    setParentLoading(true);
    setParentError(null);
    setParentReport(null);
    try {
      const report = await api.generateParentBrief({
        pathway: parentPathway.trim(),
        studentStage: parentStage,
        concerns: parentConcerns.trim() || 'Cost, job stability, duration, and backup options',
        language,
      });
      setParentReport(report);
      setTimeout(() => {
        scrollIntoViewIfNeeded(parentResultRef.current, {
          forceAlign: window.innerWidth < 1024,
        });
      }, 40);
    } catch (err) {
      setParentError(err instanceof Error ? err.message : 'Could not generate the family brief.');
    } finally {
      setParentLoading(false);
    }
  };

  const handleCopyParentBrief = async () => {
    if (!parentReport) return;
    const text = [
      `${t.tools.familyBriefKicker}: ${parentReport.pathwayTitle}`,
      '',
      `${t.tools.execSummary}: ${parentReport.executiveSummary}`,
      '',
      `${t.tools.whatInvolves}: ${parentReport.whatThisPathInvolves}`,
      `${t.tools.durationTimeline}: ${parentReport.durationAndTimeline}`,
      `${t.tools.eligibilityExams}: ${parentReport.eligibilityAndExams.join('; ')}`,
      `${t.tools.realisticCost}: ${parentReport.realisticCostEstimate}`,
      `${t.tools.careerOutlook}: ${parentReport.careerAndIncomeOutlook}`,
      `${t.tools.honestRisks}: ${parentReport.risksAndBackupPlan.join('; ')}`,
      `${t.tools.howParentsSupport}: ${parentReport.howParentsCanSupport.join('; ')}`,
      '',
      parentReport.verifiedDisclaimer,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedParentBrief(true);
      setTimeout(() => setCopiedParentBrief(false), 2500);
    } catch {
      // ignore clipboard restrictions
    }
  };

  const handleRunSpecialTool = async (
    tool: 'gap-detector' | 'what-can-i-do' | 'reality-check',
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (!toolInput.trim()) {
      setToolError(
        lang === 'hi'
          ? 'सटीक विश्लेषण के लिए कृपया संक्षिप्त जानकारी लिखें।'
          : lang === 'te'
          ? 'ఖచ్చితమైన విశ్లేషణ కోసం దయచేసి సంక్షిప్త వివరణ నమోదు చేయండి.'
          : 'Please enter a short description so we can analyze it accurately.'
      );
      return;
    }
    setToolLoading(true);
    setToolError(null);
    try {
      const data = await api.runSpecialTool({
        tool,
        input: toolInput.trim(),
        stage: toolStage,
        language,
      });
      setToolResults((prev) => ({ ...prev, [tool]: data }));
      setTimeout(() => {
        scrollIntoViewIfNeeded(specialResultRef.current, {
          forceAlign: window.innerWidth < 1024,
        });
      }, 40);
    } catch (err) {
      setToolError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setToolLoading(false);
    }
  };

  const activeSpecialResult =
    activeTab === 'gap-detector' || activeTab === 'what-can-i-do' || activeTab === 'reality-check'
      ? toolResults[activeTab]
      : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Editorial Header */}
      <header className="border-b border-[#D9CFC0] pb-8 mb-8 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#B87961] mb-2">
              {t.tools.kicker}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#34483D] tracking-tight">
              {t.tools.title}
            </h1>
            <p className="mt-3 text-[#5C625A] text-base leading-relaxed">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-xs uppercase tracking-[0.12em] text-[#5C625A]">
              {t.tools.outputLanguage}:
            </span>
            <LanguageSelector
              value={language}
              onChange={(next) => {
                setLanguage(next);
                setLang(next);
              }}
              ariaLabel={t.common.languageLabel}
            />
          </div>
        </div>

        {/* Clean segmented tool bar */}
        <div
          role="tablist"
          aria-label={t.tools.kicker}
          className="mt-8 flex flex-wrap gap-2 border-t border-[#E9E2D5] pt-6"
        >
          {toolTabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveTab(tab.id);
                  setToolError(null);
                  setToolInput('');
                  scrollIntoViewIfNeeded(toolWorkspaceRef.current);
                }}
                className={`px-4 py-2.5 text-sm font-medium border transition-colors ${
                  isSelected
                    ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                    : 'bg-[#FCFBF7] text-[#30342F] border-[#D9CFC0] hover:border-[#34483D]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      <div ref={toolWorkspaceRef} className="scroll-target">
      {/* ===================================================================
          TAB 1: NOTIFICATION & DOCUMENT DECODER
         =================================================================== */}
      {activeTab === 'decoder' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-20 bg-[#FCFBF7] border border-[#D9CFC0] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[#34483D] mb-2">
              <FileText className="w-5 h-5" />
              <h2 className="font-serif text-2xl font-semibold">
                {t.tools.decoderTitle}
              </h2>
            </div>
            <p className="text-sm text-[#5C625A] leading-relaxed mb-6">
              {t.tools.decoderDesc}
            </p>

            {/* Privacy Assurance */}
            <div className="bg-[#E9E2D5]/70 border border-[#D9CFC0] p-4 mb-6 text-xs text-[#30342F] leading-relaxed flex gap-3">
              <ShieldCheck className="w-4 h-4 text-[#34483D] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#34483D] mb-0.5">{t.tools.privacyTitle}</p>
                <p className="text-[#5C625A]">{t.tools.privacyBody}</p>
              </div>
            </div>

            <form onSubmit={handleDecode} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2">
                  {t.tools.decodingWhat}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecoderMode('notification')}
                    className={`px-3 py-2.5 text-sm font-medium border text-left transition-colors ${
                      decoderMode === 'notification'
                        ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                        : 'bg-[#F7F4EC] text-[#30342F] border-[#D9CFC0] hover:border-[#34483D]'
                    }`}
                  >
                    {t.tools.modeNotification}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecoderMode('document')}
                    className={`px-3 py-2.5 text-sm font-medium border text-left transition-colors ${
                      decoderMode === 'document'
                        ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                        : 'bg-[#F7F4EC] text-[#30342F] border-[#D9CFC0] hover:border-[#34483D]'
                    }`}
                  >
                    {t.tools.modeDocument}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2">
                  {t.tools.uploadLabel}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="flex items-center justify-between gap-3 border border-[#34483D] bg-[#F7F4EC] px-4 py-3 text-sm">
                    <span className="truncate font-medium text-[#34483D]">
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-[#5C625A] hover:text-[#30342F]"
                      aria-label={t.common.clear}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-dashed border-[#8B9B83] bg-[#F7F4EC] hover:bg-[#E9E2D5]/50 px-4 py-6 text-center transition-colors"
                  >
                    <Upload className="w-5 h-5 text-[#34483D] mx-auto mb-2" />
                    <span className="block text-sm font-medium text-[#34483D]">
                      {t.tools.chooseFile}
                    </span>
                    <span className="block text-xs text-[#5C625A] mt-1">
                      {t.tools.chooseFileHint}
                    </span>
                  </button>
                )}
              </div>

              <div>
                <label
                  htmlFor="decoder-text"
                  className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2"
                >
                  {t.tools.pasteLabel}
                </label>
                <textarea
                  id="decoder-text"
                  rows={5}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={t.tools.pastePlaceholder}
                  className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm text-[#30342F] focus:outline-none focus:border-[#34483D]"
                />
              </div>

              {decoderError && (
                <p className="text-sm text-[#9B3B2B] bg-[#FBF2EE] border border-[#E5BFB2] px-3.5 py-2.5">
                  {decoderError}
                </p>
              )}

              <button
                type="submit"
                disabled={decoding}
                className="w-full py-3 px-5 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {decoding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.tools.decodingBtn}
                  </>
                ) : (
                  <>
                    {t.tools.decodeBtn}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div ref={decoderResultRef} className="lg:col-span-7 scroll-target">
            {!decodedResult && !decoding && (
              <div className="border border-[#D9CFC0] bg-[#E9E2D5]/40 p-8 sm:p-10">
                <p className="text-xs uppercase tracking-[0.14em] text-[#B87961] mb-2">
                  {t.tools.whatYouReceive}
                </p>
                <h3 className="font-serif text-2xl font-semibold text-[#34483D] mb-4">
                  {t.tools.zeroJargonTitle}
                </h3>
                <ul className="space-y-3 text-sm text-[#30342F]">
                  {t.tools.receiveItems.map((item, i) => (
                    <li key={i}>
                      {i + 1}. {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {decoding && (
              <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-10 text-center">
                <Loader2 className="w-7 h-7 animate-spin text-[#34483D] mx-auto mb-3" />
                <p className="font-serif text-xl text-[#34483D]">{t.tools.readingClauses}</p>
                <p className="text-sm text-[#5C625A] mt-1">{t.tools.extractingSub}</p>
              </div>
            )}

            {decodedResult && (
              <article className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E9E2D5] pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#B87961] mb-1">
                      {t.tools.aiDecodedKicker}
                    </p>
                    <h3 className="font-serif text-2xl font-semibold text-[#34483D]">
                      {decodedResult.documentType}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      isSpeakingDecoded
                        ? stopSpeaking()
                        : speakText(
                            'decoded-result',
                            `${decodedResult.documentType}. ${decodedResult.plainSummary}. ${decodedResult.stepByStepNextActions.join('. ')}`,
                            language
                          )
                    }
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-[#D9CFC0] text-[#34483D] hover:bg-[#E9E2D5]"
                  >
                    {isSpeakingDecoded ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                    {isSpeakingDecoded ? t.common.stopAudio : t.common.listen}
                  </button>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2">
                    {t.tools.plainSummary}
                  </h4>
                  <p className="text-sm sm:text-base text-[#30342F] leading-relaxed">
                    {decodedResult.plainSummary}
                  </p>
                </div>

                {decodedResult.importantDates.length > 0 && (
                  <div className="border-t border-[#E9E2D5] pt-5">
                    <h4 className="text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-3">
                      {t.tools.importantDates}
                    </h4>
                    <div className="space-y-2">
                      {decodedResult.importantDates.map((d, idx) => {
                        const key = `${d.label}_${d.value}`;
                        const saved = addedDates[key];
                        return (
                          <div
                            key={idx}
                            className="flex flex-wrap items-center justify-between gap-3 bg-[#F7F4EC] border border-[#E9E2D5] px-4 py-2.5"
                          >
                            <div className="text-sm">
                              <span className="font-medium text-[#34483D]">{d.label}: </span>
                              <span className="text-[#30342F] tabular-nums">{d.value}</span>
                            </div>
                            <button
                              type="button"
                              disabled={saved}
                              onClick={() => handleAddDecodedDate(d.label, d.value)}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#34483D] hover:underline disabled:opacity-60"
                            >
                              {saved ? (
                                <>
                                  <Check className="w-3.5 h-3.5" /> {t.discover.addedToCalendar}
                                </>
                              ) : (
                                <>
                                  <CalendarPlus className="w-3.5 h-3.5" /> {t.discover.addToCalendar}
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#E9E2D5] pt-5">
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2">
                      {t.tools.eligibilityHighlights}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-[#30342F] list-disc pl-4">
                      {decodedResult.eligibilityHighlights.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2">
                      {t.tools.requiredDocuments}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-[#30342F] list-disc pl-4">
                      {decodedResult.requiredDocuments.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {decodedResult.feesOrFinancialTerms.length > 0 && (
                  <div className="border-t border-[#E9E2D5] pt-5">
                    <h4 className="text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2">
                      {t.tools.feesClauses}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-[#30342F] list-disc pl-4">
                      {decodedResult.feesOrFinancialTerms.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-[#E9E2D5] pt-5">
                  <h4 className="text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2">
                    {t.tools.stepByStepActions}
                  </h4>
                  <ol className="space-y-2 text-sm text-[#30342F] list-decimal pl-5">
                    {decodedResult.stepByStepNextActions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>

                {decodedResult.risksAndRedFlags.length > 0 && (
                  <div className="bg-[#FBF2EE] border border-[#E5BFB2] p-4">
                    <h4 className="text-xs uppercase tracking-[0.12em] text-[#9B3B2B] mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {t.tools.risksRedFlags}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-[#30342F] list-disc pl-4">
                      {decodedResult.risksAndRedFlags.map((risk, i) => (
                        <li key={i}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-xs text-[#5C625A] border-t border-[#E9E2D5] pt-4">
                  {decodedResult.verificationReminder}
                </p>
              </article>
            )}
          </div>
        </section>
      )}

      {/* ===================================================================
          TAB 2: EXPLAIN IT TO MY PARENTS
         =================================================================== */}
      {activeTab === 'parents' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div
            ref={parentFormRef}
            className="lg:col-span-5 lg:sticky lg:top-20 bg-[#FCFBF7] border border-[#D9CFC0] p-6 sm:p-8 print:hidden scroll-target"
          >
            <div className="flex items-center gap-2 text-[#34483D] mb-2">
              <Users className="w-5 h-5" />
              <h2 className="font-serif text-2xl font-semibold">{t.tools.parentsTitle}</h2>
            </div>
            <p className="text-sm text-[#5C625A] leading-relaxed mb-6">
              {t.tools.parentsDesc}
            </p>

            <form onSubmit={handleGenerateParentBrief} className="space-y-5">
              <div>
                <label
                  htmlFor="parent-pathway"
                  className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2"
                >
                  {t.tools.pathwayInputLabel}
                </label>
                <input
                  id="parent-pathway"
                  type="text"
                  value={parentPathway}
                  onChange={(e) => setParentPathway(e.target.value)}
                  placeholder={t.tools.pathwayPlaceholder}
                  className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm text-[#30342F] focus:outline-none focus:border-[#34483D]"
                />
              </div>

              <div>
                <label
                  htmlFor="parent-stage"
                  className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2"
                >
                  {t.tools.stageSelectLabel}
                </label>
                <select
                  id="parent-stage"
                  value={parentStage}
                  onChange={(e) => setParentStage(e.target.value)}
                  className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm text-[#30342F] focus:outline-none focus:border-[#34483D]"
                >
                  {STAGES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.labels[lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="parent-concerns"
                  className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2"
                >
                  {t.tools.concernsLabel}
                </label>
                <textarea
                  id="parent-concerns"
                  rows={3}
                  value={parentConcerns}
                  onChange={(e) => setParentConcerns(e.target.value)}
                  placeholder={t.tools.concernsPlaceholder}
                  className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm text-[#30342F] focus:outline-none focus:border-[#34483D]"
                />
              </div>

              {parentError && (
                <p className="text-sm text-[#9B3B2B] bg-[#FBF2EE] border border-[#E5BFB2] px-3.5 py-2.5">
                  {parentError}
                </p>
              )}

              <button
                type="submit"
                disabled={parentLoading}
                className="w-full py-3 px-5 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {parentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.tools.generatingBriefBtn}
                  </>
                ) : (
                  <>
                    {t.tools.generateBriefBtn} ({getLanguageNativeName(language)})
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div ref={parentResultRef} className="lg:col-span-7 scroll-target">
            {!parentReport && !parentLoading && (
              <div className="border border-[#D9CFC0] bg-[#E9E2D5]/40 p-8 sm:p-10 print:hidden">
                <p className="text-xs uppercase tracking-[0.14em] text-[#B87961] mb-2">
                  {t.tools.respectfulClarity}
                </p>
                <h3 className="font-serif text-2xl font-semibold text-[#34483D] mb-3">
                  {t.tools.tryCommonTopic}
                </h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {PARENT_EXAMPLES[lang].map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => {
                        setParentPathway(example);
                        scrollIntoViewIfNeeded(parentFormRef.current);
                      }}
                      className="text-xs px-3 py-2 border border-[#D9CFC0] bg-[#FCFBF7] text-[#30342F] hover:border-[#34483D] text-left"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {parentLoading && (
              <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-10 text-center print:hidden">
                <Loader2 className="w-7 h-7 animate-spin text-[#34483D] mx-auto mb-3" />
                <p className="font-serif text-xl text-[#34483D]">{t.tools.draftingBrief}</p>
              </div>
            )}

            {parentReport && (
              <article className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 sm:p-9 space-y-6 print:border-0 print:p-0">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#D9CFC0] pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#B87961] mb-1">
                      {t.tools.familyBriefKicker}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#34483D]">
                      {parentReport.pathwayTitle}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 print:hidden">
                    <button
                      type="button"
                      onClick={handleCopyParentBrief}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#D9CFC0] text-[#34483D] hover:bg-[#E9E2D5]"
                    >
                      {copiedParentBrief ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> {t.common.copied}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> {t.common.copy}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#34483D] text-[#F7F4EC] hover:bg-[#26362D]"
                    >
                      <Printer className="w-3.5 h-3.5" /> {t.common.printPdf}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-1.5">
                    {t.tools.execSummary}
                  </h4>
                  <p className="text-sm sm:text-base text-[#30342F] leading-relaxed">
                    {parentReport.executiveSummary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#E9E2D5] pt-5">
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-1.5">
                      {t.tools.whatInvolves}
                    </h4>
                    <p className="text-sm text-[#30342F] leading-relaxed">
                      {parentReport.whatThisPathInvolves}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-1.5">
                      {t.tools.durationTimeline}
                    </h4>
                    <p className="text-sm text-[#30342F] leading-relaxed">
                      {parentReport.durationAndTimeline}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#E9E2D5] pt-5">
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-1.5">
                      {t.tools.realisticCost}
                    </h4>
                    <p className="text-sm text-[#30342F] leading-relaxed">
                      {parentReport.realisticCostEstimate}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-1.5">
                      {t.tools.careerOutlook}
                    </h4>
                    <p className="text-sm text-[#30342F] leading-relaxed">
                      {parentReport.careerAndIncomeOutlook}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#E9E2D5] pt-5">
                  <h4 className="text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2">
                    {t.tools.eligibilityExams}
                  </h4>
                  <ul className="space-y-1.5 text-sm text-[#30342F] list-disc pl-4">
                    {parentReport.eligibilityAndExams.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#E9E2D5] pt-5">
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.12em] text-[#B87961] mb-2">
                      {t.tools.honestRisks}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-[#30342F] list-disc pl-4">
                      {parentReport.risksAndBackupPlan.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.12em] text-[#34483D] mb-2">
                      {t.tools.howParentsSupport}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-[#30342F] list-disc pl-4">
                      {parentReport.howParentsCanSupport.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="text-xs text-[#5C625A] border-t border-[#E9E2D5] pt-4">
                  {parentReport.verifiedDisclaimer}
                </p>
              </article>
            )}
          </div>
        </section>
      )}

      {/* ===================================================================
          TABS 3, 4, 5: GAP DETECTOR / WHAT CAN I DO / REALITY CHECK
         =================================================================== */}
      {(activeTab === 'gap-detector' ||
        activeTab === 'what-can-i-do' ||
        activeTab === 'reality-check') && (
        <section className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div
              ref={specialFormRef}
              className="lg:col-span-5 lg:sticky lg:top-20 bg-[#FCFBF7] border border-[#D9CFC0] p-6 sm:p-8 scroll-target"
            >
              <div className="flex items-center gap-2 text-[#34483D] mb-2">
                {activeTab === 'gap-detector' && <Lightbulb className="w-5 h-5" />}
                {activeTab === 'what-can-i-do' && <Compass className="w-5 h-5" />}
                {activeTab === 'reality-check' && <Scale className="w-5 h-5" />}
                <h2 className="font-serif text-2xl font-semibold">
                  {activeTab === 'gap-detector' && t.tools.tabGap}
                  {activeTab === 'what-can-i-do' && t.tools.tabWhatCanIDo}
                  {activeTab === 'reality-check' && t.tools.tabReality}
                </h2>
              </div>
              <p className="text-sm text-[#5C625A] leading-relaxed mb-6">
                {activeTab === 'gap-detector' && sc.gapDesc}
                {activeTab === 'what-can-i-do' && sc.whatDesc}
                {activeTab === 'reality-check' && sc.realityDesc}
              </p>

              <form onSubmit={(e) => handleRunSpecialTool(activeTab, e)} className="space-y-5">
                <div>
                  <label
                    htmlFor="special-stage"
                    className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2"
                  >
                    {sc.stageLabel}
                  </label>
                  <select
                    id="special-stage"
                    value={toolStage}
                    onChange={(e) => setToolStage(e.target.value)}
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm text-[#30342F] focus:outline-none focus:border-[#34483D]"
                  >
                    {STAGES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.labels[lang]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="special-input"
                    className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-2"
                  >
                    {activeTab === 'gap-detector' && sc.gapInputLabel}
                    {activeTab === 'what-can-i-do' && sc.whatInputLabel}
                    {activeTab === 'reality-check' && sc.realityInputLabel}
                  </label>
                  <textarea
                    id="special-input"
                    rows={4}
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    placeholder={
                      activeTab === 'gap-detector'
                        ? sc.gapPlaceholder
                        : activeTab === 'what-can-i-do'
                        ? sc.whatPlaceholder
                        : sc.realityPlaceholder
                    }
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm text-[#30342F] focus:outline-none focus:border-[#34483D]"
                  />
                </div>

                {toolError && (
                  <p className="text-sm text-[#9B3B2B] bg-[#FBF2EE] border border-[#E5BFB2] px-3.5 py-2.5">
                    {toolError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={toolLoading}
                  className="w-full py-3 px-5 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {toolLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.tools.specialRunningBtn}
                    </>
                  ) : (
                    <>
                      {t.tools.specialRunBtn}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div ref={specialResultRef} className="lg:col-span-7 scroll-target">
              {!activeSpecialResult && !toolLoading && (
                <div className="border border-[#D9CFC0] bg-[#E9E2D5]/40 p-8">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#B87961] mb-2">
                    {sc.quickPrompts}
                  </p>
                  <div className="space-y-2.5 mt-4">
                    {SPECIAL_PROMPTS[activeTab][lang].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => {
                          setToolInput(prompt);
                          scrollIntoViewIfNeeded(specialFormRef.current);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm bg-[#FCFBF7] border border-[#D9CFC0] text-[#30342F] hover:border-[#34483D]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {toolLoading && (
                <div className="border border-[#D9CFC0] bg-[#FCFBF7] p-10 text-center">
                  <Loader2 className="w-7 h-7 animate-spin text-[#34483D] mx-auto mb-3" />
                  <p className="font-serif text-xl text-[#34483D]">{sc.loadingMsg}</p>
                </div>
              )}

              {activeSpecialResult && (
                <article className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 sm:p-8 space-y-6">
                  <div className="border-b border-[#E9E2D5] pb-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#B87961] mb-1">
                      {sc.aiKicker}
                    </p>
                    <h3 className="font-serif text-2xl font-semibold text-[#34483D]">
                      {activeSpecialResult.headline}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-[#5C625A] leading-relaxed">
                      {activeSpecialResult.overview}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {activeSpecialResult.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="border border-[#E9E2D5] bg-[#F7F4EC] p-5 space-y-2.5"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h4 className="font-serif text-lg font-semibold text-[#34483D]">
                            {item.title}
                          </h4>
                          <span className="text-xs uppercase tracking-[0.1em] text-[#B87961]">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm text-[#30342F] leading-relaxed">
                          <strong className="font-medium text-[#34483D]">{t.tools.whyItMatters}: </strong>
                          {item.whyItMatters}
                        </p>
                        <p className="text-sm text-[#5C625A] leading-relaxed">
                          <strong className="font-medium text-[#30342F]">{t.tools.realityChallenges}: </strong>
                          {item.realityAndChallenges}
                        </p>
                        <p className="text-sm text-[#34483D] pt-1 border-t border-[#E9E2D5]">
                          <strong className="font-medium">{t.tools.immediateStep}: </strong>
                          {item.immediateStep}
                        </p>
                      </div>
                    ))}
                  </div>

                  {activeSpecialResult.relatedGuides.length > 0 && (
                    <div className="border-t border-[#E9E2D5] pt-5">
                      <p className="text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-3">
                        {t.tools.relatedVerifiedGuides}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activeSpecialResult.relatedGuides.map((g) => {
                          const localized = getGuideListMeta(g.slug, g.title, '');
                          return (
                            <button
                              key={g.slug}
                              type="button"
                              onClick={() => onOpenGuide(g.slug)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#34483D] text-[#34483D] hover:bg-[#34483D] hover:text-[#F7F4EC] transition-colors"
                            >
                              {localized.title}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-[#5C625A] border-t border-[#E9E2D5] pt-4">
                    {activeSpecialResult.closingNote}
                  </p>
                </article>
              )}
            </div>
          </div>

          {/* Curated "What Nobody Told Me" Missed Opportunity Explorer (always shown under Gap Detector) */}
          {activeTab === 'gap-detector' && (
            <div className="border-t border-[#D9CFC0] pt-10">
              <div className="max-w-3xl mb-6">
                <p className="text-xs uppercase tracking-[0.14em] text-[#B87961] mb-1">
                  {sc.curatedKicker}
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#34483D]">
                  {sc.curatedSub}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lesserKnownOpps.map((opp) => {
                  const saved = isBookmarked('opportunity', opp.id);
                  const tracked = trackedOpps[opp.id];
                  return (
                    <div
                      key={opp.id}
                      className="border border-[#D9CFC0] bg-[#FCFBF7] p-6 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2.5">
                        <p className="text-xs text-[#5C625A]">
                          {opp.organization} · {opp.cycleWindow}
                        </p>
                        <h4 className="font-serif text-lg font-semibold text-[#34483D]">
                          {opp.title}
                        </h4>
                        {opp.whatNobodyTellsYou && (
                          <p className="text-sm text-[#30342F] leading-relaxed">
                            {opp.whatNobodyTellsYou}
                          </p>
                        )}
                        <p className="text-xs text-[#5C625A]">
                          {t.discover.eligibility}: {opp.eligibilitySummary}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E9E2D5]">
                        <a
                          href={opp.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-[#34483D] hover:underline"
                        >
                          {t.common.officialPortal} ↗
                        </a>
                        <div className="flex items-center gap-3">
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
                            className="text-xs text-[#5C625A] hover:text-[#34483D] inline-flex items-center gap-1"
                          >
                            {saved ? (
                              <>
                                <BookmarkCheck className="w-3.5 h-3.5 text-[#34483D]" /> {t.common.saved}
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-3.5 h-3.5" /> {t.common.save}
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            disabled={tracked}
                            onClick={async () => {
                              await addDeadline({
                                title: opp.title,
                                category: opp.category,
                                dueDate: opp.sampleDeadlineDate,
                                officialUrl: opp.officialUrl,
                                notes: `${t.discover.cycleWindow}: ${opp.cycleWindow}.`,
                              });
                              setTrackedOpps((prev) => ({ ...prev, [opp.id]: true }));
                            }}
                            className="text-xs font-medium text-[#34483D] hover:underline disabled:opacity-60 inline-flex items-center gap-1"
                          >
                            {tracked ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> {sc.trackedLabel}
                              </>
                            ) : (
                              <>
                                <CalendarPlus className="w-3.5 h-3.5" /> {sc.trackLabel}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
      </div>
    </div>
  );
}
