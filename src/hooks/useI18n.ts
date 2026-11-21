import { useEffect, useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { api } from '../lib/api';
import { TRANSLATIONS } from '../i18n/translations';
import {
  ACHIEVEMENT_CATEGORY_LABELS,
  CATEGORY_TRANSLATIONS,
  CLASS_12_STREAM_TRANSLATIONS,
  COMPLETE_GUIDE_LIST_TRANSLATIONS,
  JOURNEY_LIST_TRANSLATIONS,
  OPP_CATEGORY_LABELS,
  QUALIFICATION_GROUP_LABELS,
  STAGE_LABELS,
  TRACK_LABELS,
  getLanguageNativeName,
} from '../i18n/catalogTranslations';
import type {
  AchievementRecord,
  Category,
  CompleteGuide,
  LanguageCode,
  LearningJourney,
  Opportunity,
  OpportunityCategory,
  PossibilityRoot,
  StudentStage,
  University,
} from '../types/domain';

// Session-level client caches so switching languages or revisiting translated content is instant
const clientGuideCache = new Map<string, CompleteGuide>();
const clientJourneyCache = new Map<string, LearningJourney>();
const clientRootCache = new Map<string, PossibilityRoot>();
const clientOppCache = new Map<string, Partial<Opportunity>>();
const clientUniCache = new Map<string, Partial<University>>();

export function useI18n() {
  const { preferredLanguage, setPreferredLanguage } = useFirebase();
  const lang: LanguageCode = preferredLanguage;
  const t = TRANSLATIONS[lang];

  const getCategoryMeta = (cat: Category) => {
    if (lang === 'en') return { name: cat.name, shortName: cat.shortName, description: cat.description };
    const tr = CATEGORY_TRANSLATIONS[cat.id]?.[lang];
    return tr || { name: cat.name, shortName: cat.shortName, description: cat.description };
  };

  const getGuideListMeta = (slug: string, fallbackTitle: string, fallbackSummary: string) => {
    if (lang === 'en') return { title: fallbackTitle, summary: fallbackSummary };
    const tr = COMPLETE_GUIDE_LIST_TRANSLATIONS[slug]?.[lang];
    return tr || { title: fallbackTitle, summary: fallbackSummary };
  };

  const getJourneyListMeta = (id: string, fallbackTitle: string, fallbackSubtitle: string) => {
    if (lang === 'en') return { title: fallbackTitle, subtitle: fallbackSubtitle };
    const tr = JOURNEY_LIST_TRANSLATIONS[id]?.[lang];
    return tr || { title: fallbackTitle, subtitle: fallbackSubtitle };
  };

  const getStageLabel = (stage: StudentStage | 'all', englishFallback?: string) => {
    if (stage === 'all') return t.common.allStages;
    if (lang === 'en') return englishFallback || stage;
    return STAGE_LABELS[stage]?.[lang] || englishFallback || stage;
  };

  const getTrackLabel = (track: string) => {
    if (track === 'all') return t.common.allTracks;
    if (lang === 'en') return track.charAt(0).toUpperCase() + track.slice(1);
    return TRACK_LABELS[track]?.[lang] || track;
  };

  const getOppCategoryLabel = (cat: OpportunityCategory | 'all', englishFallback?: string) => {
    if (cat === 'all') return t.common.allCategories;
    if (lang === 'en') return englishFallback || cat;
    return OPP_CATEGORY_LABELS[cat]?.[lang] || englishFallback || cat;
  };

  const getAchievementCategoryLabel = (cat: AchievementRecord['category'], englishFallback: string) => {
    if (lang === 'en') return englishFallback;
    return ACHIEVEMENT_CATEGORY_LABELS[cat]?.[lang] || englishFallback;
  };

  const getQualificationLabel = (groupId: string) => {
    const entry = QUALIFICATION_GROUP_LABELS[groupId];
    if (!entry) return groupId;
    return entry[lang];
  };

  const getStreamMeta = (rootId: string) => {
    return CLASS_12_STREAM_TRANSLATIONS[rootId]?.[lang];
  };

  return {
    lang,
    setLang: setPreferredLanguage,
    t,
    getCategoryMeta,
    getGuideListMeta,
    getJourneyListMeta,
    getStageLabel,
    getTrackLabel,
    getOppCategoryLabel,
    getAchievementCategoryLabel,
    getQualificationLabel,
    getStreamMeta,
    getLanguageNativeName,
  };
}

export function useTranslatedGuide(guide: CompleteGuide | undefined, lang: LanguageCode) {
  const [translated, setTranslated] = useState<CompleteGuide | null>(null);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!guide || lang === 'en') {
      setTranslated(null);
      setTranslating(false);
      setError(false);
      return;
    }

    const cacheKey = `${lang}:${guide.slug}`;
    const cached = clientGuideCache.get(cacheKey);
    if (cached) {
      setTranslated(cached);
      setTranslating(false);
      setError(false);
      return;
    }

    let cancelled = false;
    setTranslating(true);
    setError(false);
    setTranslated(null);

    api
      .translateGuide(guide.slug, lang)
      .then((res) => {
        if (cancelled) return;
        clientGuideCache.set(cacheKey, res);
        setTranslated(res);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [guide?.slug, lang, retryCount]);

  return {
    guide: lang === 'en' ? guide : translated || guide,
    isTranslated: lang === 'en' || Boolean(translated),
    translating,
    error,
    retry: () => setRetryCount((c) => c + 1),
  };
}

export function useTranslatedJourney(journey: LearningJourney, lang: LanguageCode) {
  const [translated, setTranslated] = useState<LearningJourney | null>(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (lang === 'en') {
      setTranslated(null);
      setTranslating(false);
      return;
    }

    const cacheKey = `${lang}:${journey.id}`;
    const cached = clientJourneyCache.get(cacheKey);
    if (cached) {
      setTranslated(cached);
      setTranslating(false);
      return;
    }

    let cancelled = false;
    setTranslating(true);
    setTranslated(null);

    api
      .translateJourney(journey.id, lang)
      .then((res) => {
        if (cancelled) return;
        clientJourneyCache.set(cacheKey, res);
        setTranslated(res);
      })
      .catch(() => {
        // graceful fallback to verified English
      })
      .finally(() => {
        if (!cancelled) setTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [journey.id, lang]);

  return {
    journey: lang === 'en' ? journey : translated || journey,
    translating,
  };
}

export function useTranslatedPossibilityRoot(root: PossibilityRoot, lang: LanguageCode) {
  const [translated, setTranslated] = useState<PossibilityRoot | null>(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (lang === 'en') {
      setTranslated(null);
      setTranslating(false);
      return;
    }

    const cacheKey = `${lang}:${root.id}`;
    const cached = clientRootCache.get(cacheKey);
    if (cached) {
      setTranslated(cached);
      setTranslating(false);
      return;
    }

    let cancelled = false;
    setTranslating(true);
    setTranslated(null);

    api
      .translatePossibilityRoot(root.id, lang)
      .then((res) => {
        if (cancelled) return;
        clientRootCache.set(cacheKey, res);
        setTranslated(res);
      })
      .catch(() => {
        // graceful fallback
      })
      .finally(() => {
        if (!cancelled) setTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [root.id, lang]);

  return {
    root: lang === 'en' ? root : translated || root,
    translating,
  };
}

export function useTranslatedOpportunities(opps: Opportunity[], lang: LanguageCode) {
  const [map, setMap] = useState<Record<string, Partial<Opportunity>>>({});
  const [translating, setTranslating] = useState(false);

  const idsKey = opps.map((o) => o.id).join(',');

  useEffect(() => {
    if (lang === 'en' || opps.length === 0) {
      setMap({});
      setTranslating(false);
      return;
    }

    const immediate: Record<string, Partial<Opportunity>> = {};
    const missingIds: string[] = [];

    for (const o of opps) {
      const key = `${lang}:${o.id}`;
      const hit = clientOppCache.get(key);
      if (hit) immediate[o.id] = hit;
      else missingIds.push(o.id);
    }

    setMap(immediate);
    if (missingIds.length === 0) {
      setTranslating(false);
      return;
    }

    let cancelled = false;
    setTranslating(true);

    api
      .translateOpportunities(missingIds, lang)
      .then((res) => {
        if (cancelled) return;
        const merged = { ...immediate };
        for (const [id, item] of Object.entries(res)) {
          clientOppCache.set(`${lang}:${id}`, item);
          merged[id] = item;
        }
        setMap(merged);
      })
      .catch(() => {
        // fallback cleanly to English
      })
      .finally(() => {
        if (!cancelled) setTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [idsKey, lang]);

  return {
    opportunities:
      lang === 'en'
        ? opps
        : opps.map((o) => {
            const tr = map[o.id];
            return tr ? { ...o, ...tr, id: o.id, officialUrl: o.officialUrl } : o;
          }),
    translating,
  };
}

export function useTranslatedUniversities(unis: University[], lang: LanguageCode) {
  const [map, setMap] = useState<Record<string, Partial<University>>>({});
  const [translating, setTranslating] = useState(false);

  const idsKey = unis.map((u) => u.id).join(',');

  useEffect(() => {
    if (lang === 'en' || unis.length === 0) {
      setMap({});
      setTranslating(false);
      return;
    }

    const immediate: Record<string, Partial<University>> = {};
    const missingIds: string[] = [];

    for (const u of unis) {
      const key = `${lang}:${u.id}`;
      const hit = clientUniCache.get(key);
      if (hit) immediate[u.id] = hit;
      else missingIds.push(u.id);
    }

    setMap(immediate);
    if (missingIds.length === 0) {
      setTranslating(false);
      return;
    }

    let cancelled = false;
    setTranslating(true);

    api
      .translateUniversities(missingIds, lang)
      .then((res) => {
        if (cancelled) return;
        const merged = { ...immediate };
        for (const [id, item] of Object.entries(res)) {
          clientUniCache.set(`${lang}:${id}`, item);
          merged[id] = item;
        }
        setMap(merged);
      })
      .catch(() => {
        // fallback cleanly
      })
      .finally(() => {
        if (!cancelled) setTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [idsKey, lang]);

  return {
    universities:
      lang === 'en'
        ? unis
        : unis.map((u) => {
            const tr = map[u.id];
            return tr ? { ...u, ...tr, id: u.id, officialUrl: u.officialUrl } : u;
          }),
    translating,
  };
}
