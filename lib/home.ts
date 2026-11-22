import { EARLIER_WORK_ANCHOR, earlierWork } from '@/lib/site';

// Where the track record cards and the What I do lines of the home page lead (maestro story
// art-spqwxpsqc3, following the decision art-896t5kxfka §5). The texts are in lib/dictionaries.ts
// (`home.trackCards`, `home.whatLines`), verbatim from the approved site copy, in the same order as
// the lists here; this file holds addresses only, written as paths under the locale segment. Every
// one is a page or an anchor that exists, and a test follows each.

const GATEWAY = '/work/cloud-gateway';
const ADAPTER = '/work/integration-adapter';
const SECURITY_DATA_LAKE = earlierWork.find((e) => e.id === 'earlier-security-data-lake')!.id;

/**
 * The four track record cards. `largeFrom` names the case study whose own `large` text is the
 * card's large text (the same words as its row on the Work page, so there is one source); a card
 * with none has its large text in the dictionary.
 */
export const trackRecordCards: readonly { href: string; largeFrom: string | null }[] = [
  { href: GATEWAY, largeFrom: 'cloud-gateway' },
  { href: GATEWAY, largeFrom: null },
  { href: ADAPTER, largeFrom: 'integration-adapter' },
  { href: `/work#${SECURITY_DATA_LAKE}`, largeFrom: null },
];

/** The six What I do lines: Cloud gateway, Integration adapter, both products, Cloud gateway, Simple first, Earlier work. */
export const whatIDoHrefs: readonly string[] = [
  GATEWAY,
  ADAPTER,
  '/work',
  GATEWAY,
  '/practice/articles/simple-first',
  `/work#${EARLIER_WORK_ANCHOR}`,
];
