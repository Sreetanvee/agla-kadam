import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import multer from 'multer';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  CATEGORIES,
  COMPLETE_GUIDES,
  COMPLETE_GUIDE_MAP,
  LEARNING_JOURNEYS,
  OPPORTUNITIES,
  POSSIBILITY_MAP_ROOTS,
  TOPIC_INDEX,
  UNIVERSITIES,
  findRelevantCompleteGuides,
  searchCatalog,
} from './src/data/catalog';

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.json({ limit: '8mb' }));

// Simple per-IP rate limiter for AI endpoints
const aiRateBuckets = new Map<string, { count: number; resetAt: number }>();
function aiRateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const bucket = aiRateBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    aiRateBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    return next();
  }
  if (bucket.count >= 35) {
    return res.status(429).json({
      ok: false,
      error: 'Too many requests right now. Please wait a moment and try again.',
    });
  }
  bucket.count += 1;
  return next();
}

// Strict in-memory upload configuration (never writes sensitive student documents to disk)
const ALLOWED_DOC_MIMES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_DOC_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload PDF, PNG, JPG, or WEBP (max 5 MB).'));
    }
  },
});

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function handleAiError(res: express.Response, err: unknown) {
  const message = err instanceof Error ? err.message : 'Unexpected server error';
  console.error('[AGLA KADAM AI Error]', message);
  if (message.includes('API_KEY_INVALID') || message.includes('PERMISSION_DENIED') || message.includes('403')) {
    return res.status(503).json({
      ok: false,
      error: 'Kadam AI could not authenticate with the Gemini API. Please check GEMINI_API_KEY in Settings > Secrets.',
    });
  }
  if (message.includes('RESOURCE_EXHAUSTED') || message.includes('429')) {
    return res.status(429).json({
      ok: false,
      error: 'Kadam AI is temporarily rate-limited. Please try again shortly.',
    });
  }
  return res.status(500).json({ ok: false, error: message });
}

// ============================================================================
// VERSIONED PUBLIC CATALOG & SEARCH APIs (/api/v1/*) — Mobile & Web Ready
// ============================================================================

app.get('/api/v1/health', (_req, res) => {
  res.json({
    ok: true,
    data: {
      service: 'AGLA KADAM API',
      version: '1.0.0',
      completeGuides: COMPLETE_GUIDES.length,
      indexedTopics: TOPIC_INDEX.length,
      categories: CATEGORIES.length,
      journeys: LEARNING_JOURNEYS.length,
      opportunities: OPPORTUNITIES.length,
      universities: UNIVERSITIES.length,
    },
  });
});

app.get('/api/v1/catalog/summary', (_req, res) => {
  res.json({
    ok: true,
    data: {
      categories: CATEGORIES,
      completeGuidesCount: COMPLETE_GUIDES.length,
      totalTopicsCount: TOPIC_INDEX.length,
      journeysCount: LEARNING_JOURNEYS.length,
      opportunitiesCount: OPPORTUNITIES.length,
      universitiesCount: UNIVERSITIES.length,
      featuredGuides: COMPLETE_GUIDES.slice(0, 6),
      whatNobodyToldMe: OPPORTUNITIES.filter((o) => o.lesserKnown),
    },
  });
});

app.get('/api/v1/catalog/categories', (_req, res) => {
  res.json({ ok: true, data: CATEGORIES });
});

app.get('/api/v1/catalog/topics', (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category : '';
  const status = typeof req.query.status === 'string' ? req.query.status : '';
  const stage = typeof req.query.stage === 'string' ? req.query.stage : '';
  const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';

  let list = TOPIC_INDEX;
  if (category && category !== 'all') {
    list = list.filter((t) => t.categoryId === category);
  }
  if (status === 'complete' || status === 'scheduled') {
    list = list.filter((t) => t.status === status);
  }
  if (stage && stage !== 'all') {
    list = list.filter((t) => t.stages.includes(stage as never));
  }
  if (q) {
    list = list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }

  res.json({
    ok: true,
    data: list,
    meta: { total: list.length, complete: list.filter((x) => x.status === 'complete').length },
  });
});

app.get('/api/v1/catalog/guides/:slug', (req, res) => {
  const { slug } = req.params;
  const guide = COMPLETE_GUIDE_MAP[slug];
  if (guide) {
    return res.json({ ok: true, data: guide });
  }
  const indexed = TOPIC_INDEX.find((t) => t.slug === slug);
  if (indexed) {
    return res.json({ ok: true, data: indexed });
  }
  return res.status(404).json({ ok: false, error: 'Topic not found in The Agla Kadam Universe.' });
});

app.get('/api/v1/catalog/journeys', (_req, res) => {
  res.json({ ok: true, data: LEARNING_JOURNEYS });
});

app.get('/api/v1/catalog/possibilities', (_req, res) => {
  res.json({ ok: true, data: POSSIBILITY_MAP_ROOTS });
});

app.get('/api/v1/catalog/opportunities', (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category : '';
  const stage = typeof req.query.stage === 'string' ? req.query.stage : '';
  const lesserKnownOnly = req.query.lesserKnown === 'true';
  const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';

  let list = OPPORTUNITIES;
  if (category && category !== 'all') {
    list = list.filter((o) => o.category === category);
  }
  if (stage && stage !== 'all') {
    list = list.filter((o) => o.stages.includes(stage as never));
  }
  if (lesserKnownOnly) {
    list = list.filter((o) => o.lesserKnown);
  }
  if (q) {
    list = list.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q) ||
        o.eligibilitySummary.toLowerCase().includes(q) ||
        o.benefitSummary.toLowerCase().includes(q)
    );
  }
  res.json({ ok: true, data: list });
});

app.get('/api/v1/catalog/universities', (req, res) => {
  const type = typeof req.query.type === 'string' ? req.query.type : '';
  const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
  let list = UNIVERSITIES;
  if (type && type !== 'all') {
    list = list.filter((u) => u.type === type);
  }
  if (q) {
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.shortName.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q) ||
        u.notableCourses.some((c) => c.toLowerCase().includes(q)) ||
        u.entranceExams.some((e) => e.toLowerCase().includes(q))
    );
  }
  res.json({ ok: true, data: list });
});

app.get('/api/v1/search', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.slice(0, 200) : '';
  res.json({ ok: true, data: searchCatalog(q) });
});

// ============================================================================
// SERVER-CACHED MULTILINGUAL EDUCATIONAL CONTENT TRANSLATION (/api/v1/catalog/translate)
// Translates full 16-section guides, journeys, pathways, opportunities, and universities
// into natural, student-friendly Hindi (हिन्दी) or Telugu (తెలుగు) while preserving
// official Indian exam/portal/technical terms and URLs.
// ============================================================================

const catalogTranslationCache = new Map<string, unknown>();

function getTargetLanguageInstruction(language: 'hi' | 'te'): string {
  if (language === 'hi') {
    return `Translate into clear, natural, everyday student-friendly Hindi (हिन्दी in Devanagari script) that Indian students and parents can read effortlessly—avoid overly rigid or archaic Sanskritized Hindi.
Preserve important English educational, exam, degree, financial, and portal terms where helpful (such as JEE Main, NEET, CUET, UPSC, GATE, CLAT, NSP, DigiLocker, APAAR, B.Tech, MBBS, PhD, CGPA, CTC, Patent, Peer Review, SOP, LOR, Startup, DPIIT) and explain them naturally in Hindi.
Keep all IDs, slugs, URLs, verification dates, and numbers intact. Never invent new facts or alter official URLs.`;
  }
  return `Translate into clear, natural, student-friendly Telugu (తెలుగు) that Indian students and parents can read effortlessly.
Preserve important English educational, exam, degree, financial, and portal terms where helpful (such as JEE Main, NEET, CUET, UPSC, GATE, CLAT, NSP, DigiLocker, B.Tech, MBBS, PhD, CGPA, CTC, Patent) and explain them naturally in Telugu.
Keep all IDs, slugs, URLs, verification dates, and numbers intact. Never invent new facts or alter official URLs.`;
}

app.post('/api/v1/catalog/translate', aiRateLimit, async (req, res) => {
  try {
    const { kind, id, ids, language } = req.body ?? {};
    if (language !== 'hi' && language !== 'te') {
      return res.status(400).json({ ok: false, error: 'Language must be hi or te.' });
    }

    const ai = getAiClient();
    const langGuide = getTargetLanguageInstruction(language);

    if (kind === 'guide') {
      const slug = typeof id === 'string' ? id : '';
      const guide = COMPLETE_GUIDE_MAP[slug];
      if (!guide) {
        return res.status(404).json({ ok: false, error: 'Guide not found.' });
      }
      const cacheKey = `guide:${language}:${slug}`;
      if (catalogTranslationCache.has(cacheKey)) {
        return res.json({ ok: true, data: catalogTranslationCache.get(cacheKey) });
      }

      const translatablePayload = {
        title: guide.title,
        summary: guide.summary,
        beginnerSummary: guide.beginnerSummary,
        intermediateSummary: guide.intermediateSummary,
        advancedSummary: guide.advancedSummary,
        whatItIs: guide.whatItIs,
        whyItExists: guide.whyItExists,
        whoNeedsIt: guide.whoNeedsIt,
        howItWorks: guide.howItWorks,
        typesAndPathways: guide.typesAndPathways,
        eligibility: guide.eligibility,
        documentsAndRequirements: guide.documentsAndRequirements,
        stepByStepProcedure: guide.stepByStepProcedure,
        whatHappensNext: guide.whatHappensNext,
        opportunitiesAndBenefits: guide.opportunitiesAndBenefits,
        limitationsCostsRisks: guide.limitationsCostsRisks,
        commonMistakes: guide.commonMistakes,
        faqs: guide.faqs,
        officialResourceLabels: guide.officialResources.map((r) => ({ label: r.label, authority: r.authority })),
      };

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `${langGuide}\n\nTranslate EVERY field of this verified educational guide JSON into ${language === 'hi' ? 'Hindi (हिन्दी)' : 'Telugu (తెలుగు)'}. Return valid JSON with the EXACT same keys and array lengths.\n\nSOURCE JSON:\n${JSON.stringify(translatablePayload)}`,
        config: {
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const translated = JSON.parse((response.text || '{}').trim());
      const mergedGuide = {
        ...guide,
        title: translated.title || guide.title,
        summary: translated.summary || guide.summary,
        beginnerSummary: translated.beginnerSummary || guide.beginnerSummary,
        intermediateSummary: translated.intermediateSummary || guide.intermediateSummary,
        advancedSummary: translated.advancedSummary || guide.advancedSummary,
        whatItIs: translated.whatItIs || guide.whatItIs,
        whyItExists: translated.whyItExists || guide.whyItExists,
        whoNeedsIt: translated.whoNeedsIt || guide.whoNeedsIt,
        howItWorks: translated.howItWorks || guide.howItWorks,
        typesAndPathways: Array.isArray(translated.typesAndPathways) && translated.typesAndPathways.length > 0
          ? translated.typesAndPathways
          : guide.typesAndPathways,
        eligibility: Array.isArray(translated.eligibility) && translated.eligibility.length > 0
          ? translated.eligibility
          : guide.eligibility,
        documentsAndRequirements: Array.isArray(translated.documentsAndRequirements) && translated.documentsAndRequirements.length > 0
          ? translated.documentsAndRequirements
          : guide.documentsAndRequirements,
        stepByStepProcedure: Array.isArray(translated.stepByStepProcedure) && translated.stepByStepProcedure.length > 0
          ? translated.stepByStepProcedure
          : guide.stepByStepProcedure,
        whatHappensNext: translated.whatHappensNext || guide.whatHappensNext,
        opportunitiesAndBenefits: Array.isArray(translated.opportunitiesAndBenefits) && translated.opportunitiesAndBenefits.length > 0
          ? translated.opportunitiesAndBenefits
          : guide.opportunitiesAndBenefits,
        limitationsCostsRisks: Array.isArray(translated.limitationsCostsRisks) && translated.limitationsCostsRisks.length > 0
          ? translated.limitationsCostsRisks
          : guide.limitationsCostsRisks,
        commonMistakes: Array.isArray(translated.commonMistakes) && translated.commonMistakes.length > 0
          ? translated.commonMistakes
          : guide.commonMistakes,
        faqs: Array.isArray(translated.faqs) && translated.faqs.length > 0 ? translated.faqs : guide.faqs,
        officialResources: guide.officialResources.map((r, idx) => ({
          ...r,
          label: translated.officialResourceLabels?.[idx]?.label || r.label,
          authority: translated.officialResourceLabels?.[idx]?.authority || r.authority,
        })),
      };

      catalogTranslationCache.set(cacheKey, mergedGuide);
      return res.json({ ok: true, data: mergedGuide });
    }

    if (kind === 'journey') {
      const journeyId = typeof id === 'string' ? id : '';
      const journey = LEARNING_JOURNEYS.find((j) => j.id === journeyId);
      if (!journey) {
        return res.status(404).json({ ok: false, error: 'Learning journey not found.' });
      }
      const cacheKey = `journey:${language}:${journeyId}`;
      if (catalogTranslationCache.has(cacheKey)) {
        return res.json({ ok: true, data: catalogTranslationCache.get(cacheKey) });
      }

      const payload = {
        title: journey.title,
        subtitle: journey.subtitle,
        targetAudience: journey.targetAudience,
        estimatedHorizon: journey.estimatedHorizon,
        overview: journey.overview,
        stages: journey.stages.map((s) => ({
          stageNumber: s.stageNumber,
          title: s.title,
          timeframe: s.timeframe,
          prerequisites: s.prerequisites,
          keyDecisions: s.keyDecisions,
          documents: s.documents,
          nextActions: s.nextActions,
        })),
      };

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `${langGuide}\n\nTranslate EVERY field of this Learning Journey JSON into ${language === 'hi' ? 'Hindi (हिन्दी)' : 'Telugu (తెలుగు)'}. Keep stageNumber integers and exact JSON structure.\n\nSOURCE JSON:\n${JSON.stringify(payload)}`,
        config: {
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const translated = JSON.parse((response.text || '{}').trim());
      const mergedJourney = {
        ...journey,
        title: translated.title || journey.title,
        subtitle: translated.subtitle || journey.subtitle,
        targetAudience: translated.targetAudience || journey.targetAudience,
        estimatedHorizon: translated.estimatedHorizon || journey.estimatedHorizon,
        overview: translated.overview || journey.overview,
        stages: journey.stages.map((s, idx) => {
          const ts = translated.stages?.[idx];
          return ts
            ? {
                ...s,
                title: ts.title || s.title,
                timeframe: ts.timeframe || s.timeframe,
                prerequisites: Array.isArray(ts.prerequisites) ? ts.prerequisites : s.prerequisites,
                keyDecisions: Array.isArray(ts.keyDecisions) ? ts.keyDecisions : s.keyDecisions,
                documents: Array.isArray(ts.documents) ? ts.documents : s.documents,
                nextActions: Array.isArray(ts.nextActions) ? ts.nextActions : s.nextActions,
              }
            : s;
        }),
      };

      catalogTranslationCache.set(cacheKey, mergedJourney);
      return res.json({ ok: true, data: mergedJourney });
    }

    if (kind === 'possibilityRoot') {
      const rootId = typeof id === 'string' ? id : '';
      const root = POSSIBILITY_MAP_ROOTS.find((r) => r.id === rootId);
      if (!root) {
        return res.status(404).json({ ok: false, error: 'Possibility pathway root not found.' });
      }
      const cacheKey = `root:${language}:${rootId}`;
      if (catalogTranslationCache.has(cacheKey)) {
        return res.json({ ok: true, data: catalogTranslationCache.get(cacheKey) });
      }

      const payload = {
        label: root.label,
        shortLabel: root.shortLabel,
        description: root.description,
        branches: root.branches.map((b) => ({
          id: b.id,
          title: b.title,
          duration: b.duration,
          eligibility: b.eligibility,
          entranceExams: b.entranceExams,
          approximateCostNote: b.approximateCostNote,
          institutions: b.institutions,
          scholarships: b.scholarships,
          careerOutcomes: b.careerOutcomes,
          alternatives: b.alternatives,
          realityNote: b.realityNote,
        })),
      };

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `${langGuide}\n\nTranslate EVERY text field of this educational Possibility Map JSON into ${language === 'hi' ? 'Hindi (हिन्दी)' : 'Telugu (తెలుగు)'}. Keep all branch "id" fields unchanged.\n\nSOURCE JSON:\n${JSON.stringify(payload)}`,
        config: {
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const translated = JSON.parse((response.text || '{}').trim());
      const branchMap = new Map<string, Record<string, unknown>>(
        (Array.isArray(translated.branches) ? translated.branches : []).map((b: Record<string, unknown>) => [
          String(b.id || ''),
          b,
        ])
      );

      const mergedRoot = {
        ...root,
        label: translated.label || root.label,
        shortLabel: translated.shortLabel || root.shortLabel,
        description: translated.description || root.description,
        branches: root.branches.map((b, idx) => {
          const tb = branchMap.get(b.id) || translated.branches?.[idx];
          if (!tb) return b;
          return {
            ...b,
            title: (tb.title as string) || b.title,
            duration: (tb.duration as string) || b.duration,
            eligibility: (tb.eligibility as string) || b.eligibility,
            entranceExams: Array.isArray(tb.entranceExams) ? (tb.entranceExams as string[]) : b.entranceExams,
            approximateCostNote: (tb.approximateCostNote as string) || b.approximateCostNote,
            institutions: Array.isArray(tb.institutions) ? (tb.institutions as string[]) : b.institutions,
            scholarships: Array.isArray(tb.scholarships) ? (tb.scholarships as string[]) : b.scholarships,
            careerOutcomes: Array.isArray(tb.careerOutcomes) ? (tb.careerOutcomes as string[]) : b.careerOutcomes,
            alternatives: Array.isArray(tb.alternatives) ? (tb.alternatives as string[]) : b.alternatives,
            realityNote: (tb.realityNote as string) || b.realityNote,
          };
        }),
      };

      catalogTranslationCache.set(cacheKey, mergedRoot);
      return res.json({ ok: true, data: mergedRoot });
    }

    if (kind === 'opportunities') {
      const requestedIds = Array.isArray(ids)
        ? ids.filter((x): x is string => typeof x === 'string').slice(0, 30)
        : OPPORTUNITIES.map((o) => o.id);
      const result: Record<string, Record<string, unknown>> = {};
      const missing: typeof OPPORTUNITIES = [];

      for (const oppId of requestedIds) {
        const key = `opp:${language}:${oppId}`;
        if (catalogTranslationCache.has(key)) {
          result[oppId] = catalogTranslationCache.get(key) as Record<string, unknown>;
        } else {
          const opp = OPPORTUNITIES.find((o) => o.id === oppId);
          if (opp) missing.push(opp);
        }
      }

      if (missing.length > 0) {
        const payload = missing.map((o) => ({
          id: o.id,
          title: o.title,
          organization: o.organization,
          location: o.location,
          eligibilitySummary: o.eligibilitySummary,
          benefitSummary: o.benefitSummary,
          cycleWindow: o.cycleWindow,
          whatNobodyTellsYou: o.whatNobodyTellsYou || '',
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: `${langGuide}\n\nTranslate this array of Indian & international educational opportunities into ${language === 'hi' ? 'Hindi (हिन्दी)' : 'Telugu (తెలుగు)'}. Keep each "id" unchanged and return a JSON array.\n\nSOURCE JSON:\n${JSON.stringify(payload)}`,
          config: {
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        const parsed = JSON.parse((response.text || '[]').trim());
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && typeof item.id === 'string') {
              catalogTranslationCache.set(`opp:${language}:${item.id}`, item);
              result[item.id] = item;
            }
          }
        }
      }

      return res.json({ ok: true, data: result });
    }

    if (kind === 'universities') {
      const requestedIds = Array.isArray(ids)
        ? ids.filter((x): x is string => typeof x === 'string').slice(0, 30)
        : UNIVERSITIES.map((u) => u.id);
      const result: Record<string, Record<string, unknown>> = {};
      const missing: typeof UNIVERSITIES = [];

      for (const uniId of requestedIds) {
        const key = `uni:${language}:${uniId}`;
        if (catalogTranslationCache.has(key)) {
          result[uniId] = catalogTranslationCache.get(key) as Record<string, unknown>;
        } else {
          const uni = UNIVERSITIES.find((u) => u.id === uniId);
          if (uni) missing.push(uni);
        }
      }

      if (missing.length > 0) {
        const payload = missing.map((u) => ({
          id: u.id,
          name: u.name,
          location: u.location,
          eligibilitySummary: u.eligibilitySummary,
          admissionProcess: u.admissionProcess,
          feeNote: u.feeNote,
          scholarshipNote: u.scholarshipNote,
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: `${langGuide}\n\nTranslate this array of verified university profiles into ${language === 'hi' ? 'Hindi (हिन्दी)' : 'Telugu (తెలుగు)'}. Keep each "id" unchanged and return a JSON array.\n\nSOURCE JSON:\n${JSON.stringify(payload)}`,
          config: {
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        const parsed = JSON.parse((response.text || '[]').trim());
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && typeof item.id === 'string') {
              catalogTranslationCache.set(`uni:${language}:${item.id}`, item);
              result[item.id] = item;
            }
          }
        }
      }

      return res.json({ ok: true, data: result });
    }

    return res.status(400).json({ ok: false, error: 'Unsupported translation kind.' });
  } catch (err) {
    return handleAiError(res, err);
  }
});

// ============================================================================
// KADAM AI & INTELLIGENT GUIDANCE ENDPOINTS (Server-side @google/genai)
// ============================================================================

app.post('/api/v1/ai/chat', aiRateLimit, async (req, res) => {
  try {
    const {
      message,
      history = [],
      language = 'en',
      noStupidMode = true,
      contextGuideSlug,
      studentProfile,
    } = req.body ?? {};

    if (typeof message !== 'string' || message.trim().length === 0 || message.length > 4000) {
      return res.status(400).json({ ok: false, error: 'Please provide a question between 1 and 4000 characters.' });
    }

    const ai = getAiClient();
    const citedGuides = findRelevantCompleteGuides(
      `${message} ${contextGuideSlug ? COMPLETE_GUIDE_MAP[contextGuideSlug]?.title ?? '' : ''}`,
      3
    );

    const guideContextText = citedGuides
      .map((cg) => {
        const full = COMPLETE_GUIDE_MAP[cg.slug];
        return full
          ? `[Verified Guide: ${full.title} (verified ${full.lastVerifiedDate})]: ${full.beginnerSummary} Official links: ${full.officialResources.map((r) => `${r.label} (${r.url})`).join(', ')}`
          : '';
      })
      .filter(Boolean)
      .join('\n');

    const languageDirective =
      language === 'hi'
        ? 'DEFAULT LANGUAGE IS HINDI (हिन्दी): Respond warmly and clearly in natural, everyday student-friendly Hindi (Devanagari script). Keep important official Indian exam, degree, career, and portal names (like UPSC, GATE, CUET, JEE, NEET, CLAT, NSP, DigiLocker, B.Tech, PhD, Patent, CTC) in clear English alongside simple Hindi explanations so the student can understand easily and search official portals effortlessly.'
        : language === 'te'
          ? 'DEFAULT LANGUAGE IS TELUGU (తెలుగు): Respond warmly and clearly in natural Telugu (తెలుగు), keeping official Indian exam/portal names (like UPSC, GATE, CUET, DigiLocker, NSP) in English alongside Telugu explanations so the student can search official websites effortlessly.'
          : 'DEFAULT LANGUAGE IS ENGLISH: Respond in clear, warm, accessible English suitable for an Indian student who may be hearing about this topic for the very first time.';

    const autoLanguageRule =
      'AUTOMATIC LANGUAGE ADAPTATION: If the student writes their question in Hindi (Devanagari) OR Hinglish (Hindi mixed with English in Roman letters, e.g., "10th ke baad kya karu?" or "NSP scholarship kaise milegi?"), respond naturally in clear, student-friendly Hindi (Devanagari script) while preserving helpful English exam/portal terms. If they write in Telugu, respond in Telugu. Otherwise strictly follow the default language selected above.';

    const toneDirective = noStupidMode
      ? 'NO-QUESTION-IS-STUPID MODE IS ACTIVE: Explain from absolute zero without any judgement, condescension, or assumed jargon. Reassure the student warmly, define every acronym you mention, and break actions into tiny, calm steps.'
      : 'Provide crisp, structured, objective educational guidance with clear trade-offs and realistic expectations.';

    const profileSnippet = studentProfile?.educationLevel
      ? `Student Profile Context: Stage=${studentProfile.educationLevel}, Stream=${studentProfile.stream || 'Unspecified'}, Location=${studentProfile.location || 'India'}, Interests=${Array.isArray(studentProfile.interests) ? studentProfile.interests.join(', ') : 'Exploring'}.`
      : '';

    const systemInstruction = `You are Kadam AI, the educational guidance mentor for AGLA KADAM ("Your next step. Your future. Your choice.").
Your philosophy: Never dictate a student's future—reveal possibilities, explain options honestly, and empower informed choices.
${languageDirective}
${autoLanguageRule}
${toneDirective}
${profileSnippet}

STRICT INTEGRITY RULES:
1. Never invent live deadlines, fake cutoff numbers, or fabricated rankings. Remind students to check official portals for current-year dates/fees.
2. Distinguish clearly between Verified Knowledge Base Facts (grounded in the context below) and your AI Guidance / Suggestions.
3. If the student's question is incomplete or vague, answer the core concept cleanly first, then ask 1–2 gentle clarifying questions to tailor further.
4. Keep formatting scannable with short paragraphs and numbered steps. Avoid hype or corporate jargon.

RELEVANT VERIFIED AGLA KADAM GUIDES:
${guideContextText || 'None matched directly; provide general grounded guidance and advise verifying on official .gov.in / institutional websites.'}`;

    const recentHistory = Array.isArray(history)
      ? history.slice(-8).map((h: { role?: string; content?: string }) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(h.content || '').slice(0, 2000) }],
        }))
      : [];

    const response = await ai.models.generateContent({
       model: 'gemini-3.8-flash',
      contents: [
        ...recentHistory,
        { role: 'user', parts: [{ text: message.trim() }] },
      ],
      config: { systemInstruction },
    });

    return res.json({
      ok: true,
      data: {
        reply: response.text || 'I could not generate an answer right now. Please try rephrasing your question.',
        citedGuides,
        isAiSuggestion: true,
      },
    });
  } catch (err) {
    return handleAiError(res, err);
  }
});

app.post('/api/v1/ai/roadmap', aiRateLimit, async (req, res) => {
  try {
    const profile = req.body ?? {};
    if (!profile.educationLevel) {
      return res.status(400).json({ ok: false, error: 'Current education level is required.' });
    }

    const ai = getAiClient();
    const availableGuideSlugs = COMPLETE_GUIDES.map((g) => `${g.slug} (${g.title})`).join('; ');
    const roadmapLang =
      profile.language === 'hi'
        ? 'Write EVERY human-readable field (title, educationStage, summary, verifiedContextNote, and all pathway fields) in clear, natural, student-friendly Hindi (हिन्दी in Devanagari script), preserving important official Indian exam/degree/portal terms (like JEE, NEET, CUET, GATE, UPSC, NSP, IIT, NIT, PhD) alongside simple Hindi explanations.'
        : profile.language === 'te'
          ? 'Write EVERY human-readable field in clear, natural, student-friendly Telugu (తెలుగు), preserving important official Indian exam/degree/portal terms in English alongside Telugu explanations.'
          : 'Write all fields in clear, warm, accessible English.';

    const prompt = `Create a personalised multi-pathway educational & career roadmap ("My Next Kadam") for an Indian student with the following profile:
- Current Education: ${String(profile.educationLevel).slice(0, 80)}
- Qualification / Stream: ${String(profile.stream || 'General').slice(0, 80)}
- Current Location: ${String(profile.location || 'India').slice(0, 100)}
- Preferred Study/Work Location: ${String(profile.preferredLocation || 'Open across India or Abroad').slice(0, 100)}
- Budget Range: ${String(profile.budgetRange || 'Modest / Scholarship-friendly').slice(0, 80)}
- Interests: ${Array.isArray(profile.interests) ? profile.interests.join(', ') : 'Exploring broadly'}
- Strengths: ${Array.isArray(profile.strengths) ? profile.strengths.join(', ') : 'Willing to learn'}
- Goals: ${Array.isArray(profile.goals) ? profile.goals.join(', ') : 'Clarity and meaningful growth'}
- Preferred Tracks: ${Array.isArray(profile.trackPreferences) ? profile.trackPreferences.join(', ') : 'Open to Higher Education, Jobs, Research, or Startups'}

OUTPUT LANGUAGE REQUIREMENT:
${roadmapLang}

CRITICAL RULES:
- Generate EXACTLY 3 genuinely distinct pathways (do NOT force a single path!). For example: one primary academic/exam route, one applied skill/career/fellowship route, and one lesser-known research/interdisciplinary/entrepreneurial or global route.
- Never fabricate active exam dates or unverified rankings. State approximate public fee ranges honestly and remind students to verify current prospectuses.
- Keep pathway "id" as short ASCII slugs (e.g. "pathway-1", "pathway-2", "pathway-3") and ONLY cite exact English guide slugs from this verified list when populating recommendedGuideSlugs: ${availableGuideSlugs}`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            educationStage: { type: Type.STRING },
            summary: { type: Type.STRING },
            verifiedContextNote: { type: Type.STRING },
            pathways: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  trackLabel: { type: Type.STRING },
                  whyItFits: { type: Type.STRING },
                  immediateActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  shortTermMilestones: { type: Type.ARRAY, items: { type: Type.STRING } },
                  longTermMilestones: { type: Type.ARRAY, items: { type: Type.STRING } },
                  requiredQualifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                  examinations: { type: Type.ARRAY, items: { type: Type.STRING } },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  estimatedCostNote: { type: Type.STRING },
                  possibleInstitutions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  risksAndAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendedGuideSlugs: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: [
                  'id',
                  'title',
                  'trackLabel',
                  'whyItFits',
                  'immediateActions',
                  'shortTermMilestones',
                  'longTermMilestones',
                  'requiredQualifications',
                  'examinations',
                  'skills',
                  'estimatedCostNote',
                  'possibleInstitutions',
                  'opportunities',
                  'risksAndAlternatives',
                  'recommendedGuideSlugs',
                ],
              },
            },
          },
          required: ['title', 'educationStage', 'summary', 'verifiedContextNote', 'pathways'],
        },
      },
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    // Sanitize recommendedGuideSlugs against real complete guides
    if (Array.isArray(parsed.pathways)) {
      parsed.pathways = parsed.pathways.map((p: { recommendedGuideSlugs?: string[] }) => ({
        ...p,
        recommendedGuideSlugs: Array.isArray(p.recommendedGuideSlugs)
          ? p.recommendedGuideSlugs.filter((s) => Boolean(COMPLETE_GUIDE_MAP[s]))
          : [],
      }));
    }

    return res.json({ ok: true, data: parsed });
  } catch (err) {
    return handleAiError(res, err);
  }
});

app.post('/api/v1/ai/decode-document', aiRateLimit, (req, res) => {
  upload.single('file')(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ ok: false, error: uploadErr.message });
    }
    try {
      const mode = req.body?.mode === 'notification' ? 'Official Notification' : 'Student Document (Marksheet / Certificate / Offer Letter / Admission Letter)';
      const language =
        req.body?.language === 'hi'
          ? 'clear, natural, student-friendly Hindi (हिन्दी in Devanagari script, keeping key official/technical terms like CTC, CGPA, NSP, DigiLocker explained clearly in Hindi)'
          : req.body?.language === 'te'
            ? 'Telugu (తెలుగు with key official terms in English)'
            : 'Plain, beginner-friendly English';
      const pastedText = typeof req.body?.text === 'string' ? req.body.text.trim().slice(0, 15000) : '';
      const file = req.file;

      if (!file && !pastedText) {
        return res.status(400).json({
          ok: false,
          error: 'Please upload a PDF/image (max 5 MB) or paste the document/notification text.',
        });
      }

      const ai = getAiClient();
      const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

      if (file) {
        parts.push({
          inlineData: {
            mimeType: file.mimetype,
            data: file.buffer.toString('base64'),
          },
        });
      }

      parts.push({
        text: `Analyze this ${mode} for an Indian student in ${language}.
Explain what it actually means in zero-jargon language.
If it is an official exam/scholarship/admission notification, extract exact eligibility, important dates, required documents, application fees, step-by-step actions, and hidden pitfalls.
If it is an offer letter, marksheet, or admission document, decode CTC vs fixed pay, bonds/notice periods, credit/CGPA meanings, fee clauses, and red flags.
NEVER invent facts not present in the source—if a detail is missing or illegible, say so transparently.
${pastedText ? `\nPASTED TEXT:\n${pastedText}` : ''}`,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              documentType: { type: Type.STRING },
              plainSummary: { type: Type.STRING },
              eligibilityHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
              importantDates: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING },
                  },
                  required: ['label', 'value'],
                },
              },
              requiredDocuments: { type: Type.ARRAY, items: { type: Type.STRING } },
              feesOrFinancialTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
              stepByStepNextActions: { type: Type.ARRAY, items: { type: Type.STRING } },
              risksAndRedFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
              verificationReminder: { type: Type.STRING },
            },
            required: [
              'documentType',
              'plainSummary',
              'eligibilityHighlights',
              'importantDates',
              'requiredDocuments',
              'feesOrFinancialTerms',
              'stepByStepNextActions',
              'risksAndRedFlags',
              'verificationReminder',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text || '{}').trim());
      return res.json({ ok: true, data: parsed });
    } catch (err) {
      return handleAiError(res, err);
    }
  });
});

app.post('/api/v1/ai/parent-brief', aiRateLimit, async (req, res) => {
  try {
    const { pathway, studentStage, concerns, language = 'en' } = req.body ?? {};
    if (typeof pathway !== 'string' || !pathway.trim()) {
      return res.status(400).json({ ok: false, error: 'Please specify the pathway or career to explain.' });
    }
    const ai = getAiClient();
    const langLabel =
      language === 'hi'
        ? 'respectful, warm, clear Hindi (हिन्दी in Devanagari script) suitable for Indian parents, keeping official exam and degree names easy to recognize'
        : language === 'te'
          ? 'respectful, clear Telugu (తెలుగు) suitable for Indian parents'
          : 'respectful, calm, clear English suitable for Indian parents';

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Write an honest, respectful, well-structured "Explain It to My Parents" report in ${langLabel}.
Chosen Pathway / Option: ${pathway.trim().slice(0, 200)}
Student's Current Stage: ${String(studentStage || 'Student in India').slice(0, 100)}
Specific Family Questions or Concerns: ${String(concerns || 'Job security, cost, duration, and backup options').slice(0, 400)}

Be balanced, factual, and realistic—never oversell or hide risks. Highlight scholarships/public affordability, concrete backup plans, and constructive ways parents can help.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pathwayTitle: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            whatThisPathInvolves: { type: Type.STRING },
            durationAndTimeline: { type: Type.STRING },
            eligibilityAndExams: { type: Type.ARRAY, items: { type: Type.STRING } },
            realisticCostEstimate: { type: Type.STRING },
            careerAndIncomeOutlook: { type: Type.STRING },
            risksAndBackupPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
            howParentsCanSupport: { type: Type.ARRAY, items: { type: Type.STRING } },
            verifiedDisclaimer: { type: Type.STRING },
          },
          required: [
            'pathwayTitle',
            'executiveSummary',
            'whatThisPathInvolves',
            'durationAndTimeline',
            'eligibilityAndExams',
            'realisticCostEstimate',
            'careerAndIncomeOutlook',
            'risksAndBackupPlan',
            'howParentsCanSupport',
            'verifiedDisclaimer',
          ],
        },
      },
    });

    return res.json({ ok: true, data: JSON.parse((response.text || '{}').trim()) });
  } catch (err) {
    return handleAiError(res, err);
  }
});

app.post('/api/v1/ai/special-tool', aiRateLimit, async (req, res) => {
  try {
    const { tool, input, stage, language = 'en' } = req.body ?? {};
    if (typeof input !== 'string' || !input.trim()) {
      return res.status(400).json({ ok: false, error: 'Please provide your qualification, skill, or career query.' });
    }
    const ai = getAiClient();
    const langLabel =
      language === 'hi'
        ? 'clear, natural, student-friendly Hindi (हिन्दी in Devanagari script, keeping official English exam and portal names explained clearly)'
        : language === 'te'
          ? 'Telugu (తెలుగు with English official names)'
          : 'clear English';

    const toolInstructions: Record<string, string> = {
      'gap-detector': `Act as the AGLA KADAM Opportunity Gap & Missed Opportunity Explorer. Identify 5 concrete, genuinely lesser-known scholarships, research fellowships, exams, government schemes, internships, or alternative pathways in India/globally that a student with this profile typically never hears about.`,
      'what-can-i-do': `Act as "What Can I Do With This?". Given a student's qualification, degree, subject, or skill, reveal 5 diverse, concrete pathways—including mainstream, interdisciplinary, government, research, and independent/entrepreneurial options.`,
      'reality-check': `Act as "Career Reality Check". Give a candid, compassionate, unvarnished reality check on the student's chosen career/exam: actual daily work, competition ratios, hidden costs/time, common misconceptions, realistic 3-year outcomes, and smart Plan B pairings.`,
    };

    const selectedPrompt = toolInstructions[String(tool)] || toolInstructions['what-can-i-do'];

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `${selectedPrompt}
Respond in ${langLabel}.
Student Stage: ${String(stage || 'General').slice(0, 80)}
Student Input: ${input.trim().slice(0, 800)}
Never invent live deadlines or fake rankings. Be specific about real Indian & global institutions, official portals, and next actions.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            overview: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  whyItMatters: { type: Type.STRING },
                  realityAndChallenges: { type: Type.STRING },
                  immediateStep: { type: Type.STRING },
                },
                required: ['title', 'category', 'whyItMatters', 'realityAndChallenges', 'immediateStep'],
              },
            },
            closingNote: { type: Type.STRING },
          },
          required: ['headline', 'overview', 'items', 'closingNote'],
        },
      },
    });

    return res.json({
      ok: true,
      data: {
        ...JSON.parse((response.text || '{}').trim()),
        relatedGuides: findRelevantCompleteGuides(input, 3),
      },
    });
  } catch (err) {
    return handleAiError(res, err);
  }
});

// Voice-First Learning: Transcribe spoken student question (EN/TE)
app.post('/api/v1/ai/voice/transcribe', aiRateLimit, async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', language = 'en' } = req.body ?? {};
    if (typeof audioBase64 !== 'string' || audioBase64.length < 20 || audioBase64.length > 7_000_000) {
      return res.status(400).json({ ok: false, error: 'Valid audio recording is required.' });
    }
    const ai = getAiClient();
    const response = await ai.models.generateContent({
     model: 'gemini-3.8-flash',
      contents: {
        parts: [
          { inlineData: { mimeType, data: audioBase64 } },
          {
            text:
              language === 'hi'
                ? 'Transcribe this student audio faithfully in Hindi (Devanagari script) or mixed Hindi-English exactly as spoken. Return only the transcript text.'
                : language === 'te'
                  ? 'Transcribe this student audio faithfully in Telugu or mixed Telugu-English exactly as spoken. Return only the transcript text.'
                  : 'Transcribe this student question clearly in English. Return only the transcript text.',
          },
        ],
      },
    });
    return res.json({ ok: true, data: { transcript: (response.text || '').trim() } });
  } catch (err) {
    return handleAiError(res, err);
  }
});

// Voice-First Learning: Read aloud explanation via Gemini TTS (WAV)
app.post('/api/v1/ai/voice/speak', aiRateLimit, async (req, res) => {
  try {
    const { text, language = 'en' } = req.body ?? {};
    if (typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ ok: false, error: 'Text is required for audio readout.' });
    }
    const cleanText = text.replace(/[#*_`>]/g, '').trim().slice(0, 1400);
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style:
                  language === 'hi'
                    ? 'Warm, calm, encouraging Indian educational mentor speaking clearly in natural Hindi'
                    : language === 'te'
                      ? 'Warm, calm, encouraging educational mentor speaking clearly'
                      : 'Warm, calm, articulate educational mentor explaining clearly to a student',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ ok: false, error: 'Could not generate speech audio.' });
    }
    return res.json({ ok: true, data: { audioBase64: base64Audio, mimeType: 'audio/wav' } });
  } catch (err) {
    return handleAiError(res, err);
  }
});

// ============================================================================
// VITE DEV MIDDLEWARE / PRODUCTION STATIC SPA SERVING
// ============================================================================

async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const disableHmr = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: disableHmr ? false : true,
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`AGLA KADAM server running at http://localhost:${PORT}`);
  });
}

startServer();
