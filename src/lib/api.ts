import type {
  ChatMessage,
  CompleteGuide,
  DecodedDocumentResult,
  GeneratedRoadmap,
  LanguageCode,
  LearningJourney,
  Opportunity,
  ParentBriefReport,
  PossibilityRoot,
  StudentProfileData,
  University,
} from '../types/domain';

async function parseJson<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({ ok: false, error: 'Invalid server response' }));
  if (!res.ok || !body.ok) {
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return body.data as T;
}

export const api = {
  async sendChat(payload: {
    message: string;
    history: ChatMessage[];
    language: LanguageCode;
    noStupidMode: boolean;
    contextGuideSlug?: string;
    studentProfile?: StudentProfileData | null;
  }) {
    const res = await fetch('/api/v1/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseJson<{
      reply: string;
      citedGuides: { slug: string; title: string }[];
      isAiSuggestion: boolean;
    }>(res);
  },

  async generateRoadmap(profile: StudentProfileData & { language?: LanguageCode }) {
    const res = await fetch('/api/v1/ai/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return parseJson<GeneratedRoadmap>(res);
  },

  async decodeDocument(formData: FormData) {
    const res = await fetch('/api/v1/ai/decode-document', {
      method: 'POST',
      body: formData,
    });
    return parseJson<DecodedDocumentResult>(res);
  },

  async generateParentBrief(payload: {
    pathway: string;
    studentStage: string;
    concerns: string;
    language: LanguageCode;
  }) {
    const res = await fetch('/api/v1/ai/parent-brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseJson<ParentBriefReport>(res);
  },

  async runSpecialTool(payload: {
    tool: 'gap-detector' | 'what-can-i-do' | 'reality-check';
    input: string;
    stage: string;
    language: LanguageCode;
  }) {
    const res = await fetch('/api/v1/ai/special-tool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseJson<{
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
    }>(res);
  },

  async transcribeAudio(payload: { audioBase64: string; mimeType: string; language: LanguageCode }) {
    const res = await fetch('/api/v1/ai/voice/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseJson<{ transcript: string }>(res);
  },

  async synthesizeSpeech(payload: { text: string; language: LanguageCode }) {
    const res = await fetch('/api/v1/ai/voice/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseJson<{ audioBase64: string; mimeType: string }>(res);
  },

  async translateGuide(slug: string, language: Exclude<LanguageCode, 'en'>) {
    const res = await fetch('/api/v1/catalog/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'guide', id: slug, language }),
    });
    return parseJson<CompleteGuide>(res);
  },

  async translateJourney(journeyId: string, language: Exclude<LanguageCode, 'en'>) {
    const res = await fetch('/api/v1/catalog/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'journey', id: journeyId, language }),
    });
    return parseJson<LearningJourney>(res);
  },

  async translatePossibilityRoot(rootId: string, language: Exclude<LanguageCode, 'en'>) {
    const res = await fetch('/api/v1/catalog/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'possibilityRoot', id: rootId, language }),
    });
    return parseJson<PossibilityRoot>(res);
  },

  async translateOpportunities(ids: string[], language: Exclude<LanguageCode, 'en'>) {
    const res = await fetch('/api/v1/catalog/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'opportunities', ids, language }),
    });
    return parseJson<Record<string, Partial<Opportunity>>>(res);
  },

  async translateUniversities(ids: string[], language: Exclude<LanguageCode, 'en'>) {
    const res = await fetch('/api/v1/catalog/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'universities', ids, language }),
    });
    return parseJson<Record<string, Partial<University>>>(res);
  },
};
