import { CATEGORIES, TOPIC_INDEX } from './categoriesAndTopics';
import { GUIDES_BATCH_1_PART_A } from './guidesBatch1PartA';
import { GUIDES_BATCH_1_PART_B } from './guidesBatch1PartB';
import { LEARNING_JOURNEYS } from './journeys';
import { POSSIBILITY_MAP_ROOTS } from './possibilityMap';
import { OPPORTUNITIES, UNIVERSITIES } from './universitiesAndOpportunities';
import type { CompleteGuide, TopicIndexEntry } from '../types/domain';

export const COMPLETE_GUIDES: CompleteGuide[] = [
  ...GUIDES_BATCH_1_PART_A,
  ...GUIDES_BATCH_1_PART_B,
];

export const COMPLETE_GUIDE_MAP: Record<string, CompleteGuide> = Object.fromEntries(
  COMPLETE_GUIDES.map((g) => [g.slug, g])
);

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

const EVERYDAY_SYNONYMS: Record<string, string[]> = {
  collector: ['upsc', 'ias', 'civil services'],
  police: ['ips', 'upsc', 'nda'],
  money: ['scholarship', 'nsp', 'financial aid', 'loan', 'stipend'],
  free: ['scholarship', 'nptel', 'swayam', 'public', 'tuition'],
  abroad: ['international', 'study abroad', 'daad', 'erasmus', 'ielts', 'passport'],
  foreign: ['international', 'study abroad', 'passport', 'apostille'],
  invention: ['patent', 'ipindia', 'intellectual property'],
  idea: ['patent', 'startup', 'nidhi prayas'],
  company: ['startup', 'dpiit', 'incubator'],
  business: ['startup', 'freelancing', 'commerce'],
  lawyer: ['clat', 'nlu', 'law', 'judiciary'],
  judge: ['judiciary', 'clat', 'law'],
  paper: ['research paper', 'peer review', 'publish'],
  journal: ['peer review', 'research paper', 'scopus'],
  job: ['resume', 'offer letter', 'internship', 'placement'],
  salary: ['offer letter', 'ctc', 'first salary', 'tax'],
  documents: ['digilocker', 'pan', 'passport', 'apaar'],
  diploma: ['polytechnic', 'lateral entry', 'after class 10'],
  confused: ['after class 10', 'beyond engineering', 'decision'],
};

export function expandSearchTerms(rawQuery: string): string[] {
  const cleaned = rawQuery.toLowerCase().trim();
  if (!cleaned) return [];
  const words = cleaned.split(/\s+/).filter((w) => w.length > 1);
  const expanded = new Set<string>([cleaned, ...words]);
  for (const word of words) {
    for (const [key, syns] of Object.entries(EVERYDAY_SYNONYMS)) {
      if (word.includes(key) || key.includes(word)) {
        syns.forEach((s) => expanded.add(s));
      }
    }
  }
  return Array.from(expanded);
}

export function scoreMatch(haystack: string, terms: string[]): number {
  const lower = haystack.toLowerCase();
  let score = 0;
  for (const t of terms) {
    if (lower.includes(t)) {
      score += t.length > 4 ? 3 : 2;
    }
  }
  return score;
}

export function searchCatalog(query: string) {
  const terms = expandSearchTerms(query);
  if (terms.length === 0) {
    return {
      topics: TOPIC_INDEX.filter((t) => t.status === 'complete').slice(0, 6),
      journeys: LEARNING_JOURNEYS.slice(0, 4),
      opportunities: OPPORTUNITIES.slice(0, 4),
      universities: UNIVERSITIES.slice(0, 4),
    };
  }

  const topics = TOPIC_INDEX.map((topic) => {
    const text = `${topic.title} ${topic.summary} ${topic.keywords.join(' ')} ${CATEGORY_MAP[topic.categoryId]?.name ?? ''}`;
    const bonus = topic.status === 'complete' ? 2 : 0;
    return { item: topic, score: scoreMatch(text, terms) + bonus };
  })
    .filter((x) => x.score > (x.item.status === 'complete' ? 2 : 0))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((x) => x.item);

  const journeys = LEARNING_JOURNEYS.map((j) => ({
    item: j,
    score: scoreMatch(`${j.title} ${j.subtitle} ${j.overview}`, terms),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => x.item);

  const opportunities = OPPORTUNITIES.map((o) => ({
    item: o,
    score: scoreMatch(`${o.title} ${o.organization} ${o.category} ${o.eligibilitySummary} ${o.benefitSummary}`, terms),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => x.item);

  const universities = UNIVERSITIES.map((u) => ({
    item: u,
    score: scoreMatch(`${u.name} ${u.shortName} ${u.type} ${u.location} ${u.notableCourses.join(' ')} ${u.entranceExams.join(' ')}`, terms),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => x.item);

  return { topics, journeys, opportunities, universities };
}

export function findRelevantCompleteGuides(text: string, limit = 3): { slug: string; title: string }[] {
  const terms = expandSearchTerms(text);
  if (terms.length === 0) return [];
  return COMPLETE_GUIDES.map((g) => ({
    slug: g.slug,
    title: g.title,
    score: scoreMatch(`${g.title} ${g.summary} ${g.keywords.join(' ')}`, terms),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ slug, title }) => ({ slug, title }));
}

export {
  CATEGORIES,
  TOPIC_INDEX,
  LEARNING_JOURNEYS,
  POSSIBILITY_MAP_ROOTS,
  OPPORTUNITIES,
  UNIVERSITIES,
};
export type { TopicIndexEntry };
