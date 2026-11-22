import type { Locale } from '@/lib/i18n';

// Localized UI copy for the bespoke (non-markdown) surfaces — shell chrome, home, portfolio,
// contact, privacy, training stub, and the index/fallback strings. Content-body pages
// (expertise, work, practice) live as markdown under content/en/; this file is the chrome and
// the conversion pages. Dutch shows the English values for now (see `nl` below, ADR-0002).

export interface Dictionary {
  shell: {
    skipToContent: string;
    nav: { home: string };
    tasterCta: string;
    themeToggle: string;
    footerTagline: string;
    footerNavHeading: string;
    footerConnectHeading: string;
    privacy: string;
    rights: string;
    builtWith: string;
  };
  fallback: { notice: string };
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroLede: string;
    primaryWork: string;
    primaryContact: string;
    introHeading: string;
    introBody: string;
    introDuration: string;
    proofHeading: string;
    proofLede: string;
    proofPoints: { metric: string; label: string; href: string }[];
    buildHeading: string;
    buildLede: string;
    buildPoints: { title: string; body: string; href: string }[];
    buildCta: string;
    buildCtaBody: string;
    practiceHeading: string;
    practiceLede: string;
    practicePoints: { title: string; body: string; href: string }[];
    practiceCta: string;
    tasterHeading: string;
    tasterBody: string;
    tasterCta: string;
  };
  portfolio: {
    title: string;
    lede: string;
    narrative: string;
    maturityWorking: string;
    maturityReference: string;
    provesHeading: string;
    viewRepo: string;
    linksGatedNotice: string;
    honesty: string;
  };
  contact: {
    title: string;
    lede: string;
    emailHeading: string;
    emailHint: string;
    whatsappHeading: string;
    whatsappHint: string;
    whatsappPlaceholder: string;
    whatsappCta: string;
    whatsappDefault: string;
    tasterHeading: string;
    tasterBody: string;
    tasterCta: string;
    elsewhereHeading: string;
    locationHeading: string;
    linkedin: string;
    github: string;
  };
  privacy: {
    title: string;
    lastUpdated: string;
    body: string;
    /** Added to the body only once a course video is live (FS-0012): the click-to-load YouTube player. */
    youtube: string;
  };
  references: {
    title: string;
    lede: string;
    heading: string;
    homeLede: string;
    allCta: string;
    readCaseStudy: string;
    linkedin: string;
    alsoOnLinkedIn: string;
    workedTogether: string;
    /** `{language}` is replaced with the language name in the reader's locale. */
    inLanguage: string;
    translatedFrom: string;
    collectedHeading: string;
    collectedBody: string;
    collectedLinkedin: string;
    contactHeading: string;
    contactBody: string;
    contactCta: string;
  };
  training: {
    title: string;
    lede: string;
    body: string;
    ctaHeading: string;
    ctaBody: string;
    cta: string;
  };
  indexes: {
    expertiseTitle: string;
    expertiseLede: string;
    expertiseGroups: { domain: { heading: string; lede: string }; practice: { heading: string; lede: string } };
    workTitle: string;
    workLede: string;
    workHonesty: string;
    disagreementLabel: string;
    evidenceLabel: string;
    portfolioLabel: string;
    readMore: string;
    backToIndex: { expertise: string; work: string };
  };
  /** The Practice section (FS-0013): the filterable list, and an entry's page furniture. */
  practice: {
    title: string;
    lede: string;
    /** The filter rows' labels. */
    filterKind: string;
    filterTopic: string;
    filterTech: string;
    all: string;
    clear: string;
    /** "{n} of {total}", announced when the filter changes. */
    showing: string;
    empty: string;
    kind: { guideline: string; pattern: string; article: string };
    kindPlural: { guideline: string; pattern: string; article: string };
    lastRevised: string;
    status: { revised: string; retired: string };
    supersedes: string;
    supersededBy: string;
    related: string;
    drawnFrom: string;
    previous: string;
    next: string;
    backToIndex: string;
  };
}

const en: Dictionary = {
  shell: {
    skipToContent: 'Skip to content',
    nav: { home: 'Home' },
    tasterCta: 'Book a taster',
    themeToggle: 'Toggle theme',
    footerTagline: 'Senior Solution Architect — Data & Integration. I design the backbone, build what runs on it, and get the organisation to adopt both.',
    footerNavHeading: 'Site',
    footerConnectHeading: 'Connect',
    privacy: 'Privacy',
    rights: 'All rights reserved.',
    builtWith: 'Built as a static site: Next.js, exported and served by nginx.',
  },
  fallback: {
    notice: 'This page is not yet translated — showing the English version.',
  },
  home: {
    heroEyebrow: 'Senior Solution Architect — Data & Integration',
    heroTitle: 'I design the data and integration backbone, build what runs on it, and get the organisation to adopt both.',
    heroLede:
      'Twenty-odd years designing the data, integration and streaming platforms that enterprises run on, almost never with a mandate behind me: 18–20 product teams onto one platform, three estates onto one event contract, a finance function that had to trust a number before it would use it. Systems in production, with the decisions written down where people could argue with them.',
    primaryWork: 'See selected work',
    primaryContact: 'Start a conversation',
    introHeading: 'Start here',
    introBody:
      'A short introduction: who I am, the kind of estate I work in, and how I run an architecture across teams that do not report to me.',
    introDuration: 'Running time',
    proofHeading: 'Track record',
    proofLede:
      'Four numbers from work that shipped. Each links to the case study behind it, including the argument.',
    proofPoints: [
      { metric: '18–20 teams, no mandate', label: 'Product teams consolidated onto one API platform by making the platform cheaper than staying put. ~€250–300k a year saved.', href: '/work/cloud-gateway' },
      { metric: '20+ data products, 30+ sources', label: 'Streaming data from 30+ source systems turned into 20+ domain-owned data products on Kafka. Schema rules let producers ship without a change board.', href: '/work/cloudera-kafka' },
      { metric: '~30+ company codes', label: 'SAP Finance ledgers into Snowflake, adopted because Finance could reconcile the numbers itself.', href: '/work/sap-snowflake' },
      { metric: '~1.5B+ req/month', label: 'Federated cross-cloud API platform across AWS and Azure (Cloud Gateway), server-side errors under 0.03%', href: '/work/cloud-gateway' },
    ],
    practiceHeading: 'How I get it adopted',
    practiceLede:
      'The design is usually the easier half. Whether anything ships is decided by the teams who each already have something that works, the function that has to trust a number, and the contract somebody signed four years ago. Three situations.',
    practicePoints: [
      {
        title: 'Twenty teams, no authority to move any of them',
        body: 'Asking for a mandate would have produced twenty exceptions. So the platform had to be cheaper for a team than staying put, and the first teams to move were the ones with the worst existing setup.',
        href: '/work/cloud-gateway',
      },
      {
        title: 'Three teams, three definitions of “done”',
        body: 'For SAP the job ended at “the events are on the broker”; for the cloud team it started at “we consume what is there”. Everything that mattered sat in the gap. I wrote the boundary down and took the unglamorous half myself.',
        href: '/work/sap-event-backbone',
      },
      {
        title: 'A finance organisation with no reason to believe me',
        body: 'Explaining the pipeline changed nothing. A reconciliation Finance could run themselves against their own ledger did. Adoption followed the check.',
        href: '/work/sap-snowflake',
      },
    ],
    practiceCta: 'How I work across an organisation',
    buildHeading: 'What I build',
    buildLede:
      'Five areas, in the order I am usually hired for.',
    buildPoints: [
      {
        title: 'Data & lakehouse',
        body: 'Medallion lakehouses, contracts where the source hands off, and CDC pipelines that stay reliable, built so the numbers reconcile against the system people already believe.',
        href: '/expertise/data-and-lakehouse',
      },
      {
        title: 'Integration architecture',
        body: 'The backbone that lets enterprise systems talk: legacy ESB estates decommissioned wave by wave onto event-driven, API-led, domain-owned platforms.',
        href: '/expertise/integration-architecture',
      },
      {
        title: 'Event-driven & streaming',
        body: 'Kafka and broker-based integration as the backbone of the estate, with schema evolution governed in the registry so producers can ship without a change board.',
        href: '/expertise/event-driven-streaming',
      },
      {
        title: 'APIs & gateways',
        body: 'API platforms that scale across dozens of teams: gateway strategy, one security model, and the developer experience that gets them adopted.',
        href: '/expertise/apis-and-gateways',
      },
      {
        title: 'AI & automation',
        body: 'AI integrated the way any other supplier system is: behind a contract, with an evaluation gate before release, and the model kept outside the runtime so it stays replaceable.',
        href: '/expertise/ai-and-automation',
      },
    ],
    buildCta: 'See the code behind it',
    buildCtaBody:
      'Public repositories you can clone and run: the “active customer” question, the SAP↔Snowflake decision, the Fabric-or-Databricks decision, the modernization lab, the streaming platform and the identity service.',
    tasterHeading: 'Training',
    tasterBody:
      'I also teach architecture and product teams to direct AI agents. The full programme is coming; for now, book a taster.',
    tasterCta: 'Book a taster',
  },
  portfolio: {
    title: 'Portfolio',
    lede: 'Working code behind the positioning, in three areas: deciding and modelling the target, moving an estate onto it, and running the platform underneath. Every repository here is public, runs end to end, and says in its own README where the demo stops and production would begin.',
    narrative: 'Working code, and what it proves',
    maturityWorking: 'Working — runs end-to-end',
    maturityReference: 'Reference architecture',
    provesHeading: 'What it proves',
    viewRepo: 'View repository',
    linksGatedNotice:
      'A repository is listed here once it is public and licensed. Anything still being built is not on this page.',
    honesty:
      'All of these run end to end; clone any of them and bring it up. Two caveats. They run on synthetic data, so the claim is the architecture and the mechanics, and every README says where real data would go instead. And the three blueprint-style repositories are documents first: what runs is the decision engine, the cost model and the simulation behind the document. None of them is a production system.',
  },
  contact: {
    title: 'Contact',
    lede: 'The fastest way to start a conversation.',
    emailHeading: 'Email',
    emailHint: 'The best first step. I reply to specifics faster than to “let’s connect”.',
    whatsappHeading: 'WhatsApp',
    whatsappHint:
      'Quicker than email if you just want to ask something. Your own WhatsApp opens with the text below already typed. You press send, so I get your number and can reply in the same thread. Nothing is sent from this page.',
    whatsappPlaceholder: 'What would you like to ask?',
    whatsappCta: 'Open WhatsApp',
    whatsappDefault: 'Hi Farid, I found you via faridgurbanov.com. I would like to ask about ',
    tasterHeading: 'Book a training taster',
    tasterBody: 'Curious about the training? Email me with “taster” and your team’s context, and I’ll propose a short session.',
    tasterCta: 'Email about a taster',
    elsewhereHeading: 'Elsewhere',
    locationHeading: 'Based in',
    linkedin: 'LinkedIn',
    github: 'GitHub',
  },
  privacy: {
    title: 'Privacy',
    lastUpdated: 'Last updated: 17 September 2026',
    body: `This is a static website. It has no backend, no database, no contact form, and no analytics.

**What this site collects:** nothing. There is no form that submits data to me, and no tracking or advertising scripts run on these pages. The message box on the contact page is not a form; it only builds a WhatsApp link in your own browser, and it never sends anything.

**Cookies:** this site sets no non-essential cookies. The only client-side state is your light/dark theme preference, stored locally in your own browser; it is never sent anywhere.

**If you use the WhatsApp link:** the site has no chat widget and runs no code from Meta. The WhatsApp button is an ordinary link to WhatsApp's official click-to-chat address. Nothing is sent when you type in the message box. The text is only used to pre-fill the chat, and your own WhatsApp app sends it when you press send. If you do choose that channel, **Meta processes your WhatsApp number and your message as a third party**, under their terms and not mine, and I receive your number so I can reply. If you would rather not involve Meta, use email; that path stays between the two of us.

**When you email me:** if you choose to email the address on the contact page, your message and email address reach my personal mailbox. I use that information only to reply to and follow up on your enquiry. The lawful basis is my legitimate interest in responding to people who contact me. I keep correspondence only as long as needed for the conversation and any resulting work, and I do not sell or share it.

**Hosting:** the site is served as static files from my own server. The hosting layer may process technical request data (such as your IP address) in server logs for security and to keep the site running, which is standard for any website.

**References:** the references page and the case studies quote people I have worked with, with their name, photo, role at the time and a link to their public LinkedIn profile. Each of them agreed to that before it went live, and any of them can have it taken down by emailing me.

**Your rights:** you can ask me what correspondence I hold about you, to correct it, or to delete it. Email the address on the contact page and I will action it.`,
    youtube: `**If you watch a course video:** an episode page shows a still image served from my own server, and nothing loads from YouTube until you press play. When you do, the video plays in YouTube's privacy-enhanced player (youtube-nocookie.com), and **Google processes your IP address and viewing data as a third party**, under their terms and not mine.`,
  },
  references: {
    title: 'References',
    lede: 'People I worked with, on the work in the case studies. Their words, unedited, and a link to each of them so you can check.',
    heading: 'In their words',
    homeLede: 'People I worked with, in their own words. Each links to their LinkedIn profile; the full set is on the references page.',
    allCta: 'All references',
    readCaseStudy: 'Read the case study',
    linkedin: 'LinkedIn',
    alsoOnLinkedIn: 'Also on my LinkedIn',
    workedTogether: 'worked together',
    inLanguage: 'In {language}.',
    translatedFrom: 'Translated from {language}, with their approval.',
    collectedHeading: 'How these were collected',
    collectedBody: 'Each person read this page before it went live and agreed to their name, photo, role and words being on it, with the link to their profile. Quotes are verbatim; where I shortened one, the cut is marked. Anyone here can have theirs taken down with one email.',
    collectedLinkedin: 'Some of them are also recommendations on my LinkedIn profile, where you can read them at the source.',
    contactHeading: 'Ask someone I worked with',
    contactBody: 'If you would rather hear it from someone else first, the people quoted on the references page were on these engagements, and each links to their profile. For a live conversation, ask me and I will make an introduction.',
    contactCta: 'References',
  },
  training: {
    title: 'Training',
    lede: 'AI training for architecture and product teams, taught by someone who ships.',
    body: `Most AI training is delivered by people who have never put an agentic system into production. I have, and I teach teams to direct AI the way a senior engineer would: writing specs an agent can execute, evaluating what comes back, and telling real capability from hype.

The full programme (two tiers, an offer ladder, and a plain-language EU AI Act explainer) is being built and validated with real teams now. I would rather get it right with a few pilots than publish a brochure.

If that sounds useful to your team, book a short taster.`,
    ctaHeading: 'Book a taster',
    ctaBody: 'A short session for your team, no commitment. Tell me your context and I’ll tailor it.',
    cta: 'Book a taster',
  },
  indexes: {
    expertiseTitle: 'Expertise',
    expertiseLede: 'How I get an architecture decided and adopted, and what I build once it is.',
    expertiseGroups: {
      domain: {
        heading: 'What I build',
        lede: 'The five areas I work in, in the order I am usually hired for.',
      },
      practice: {
        heading: 'How I work',
        lede: 'The part of an architect\u2019s job that is not the diagram: deciding, recording, and getting people who report elsewhere to come along.',
      },
    },
    workTitle: 'Selected work',
    workLede: 'Five client engagements, with numbers. Clients are abstracted where confidentiality requires; the metrics are as delivered. Each one carries the disagreement it had to survive, because that is usually what decided whether it shipped.',
    workHonesty: 'These are the engagements I can describe accurately and defend under questioning, including what each one cost the teams it landed on. Self-built demos live on the portfolio, labelled as demos.',
    disagreementLabel: 'The disagreement',
    evidenceLabel: 'Evidenced by',
    portfolioLabel: 'Portfolio',
    readMore: 'Read more',
    backToIndex: { expertise: 'All expertise', work: 'All selected work' },
  },
  practice: {
    title: 'Practice',
    lede: 'How I work, written down where it can be argued with. Guidelines are the standing rules I bring to an engagement, patterns the solutions I reuse, and articles the longer pieces they came from.',
    filterKind: 'Show',
    filterTopic: 'Topic',
    filterTech: 'Technology',
    all: 'All',
    clear: 'Clear filters',
    showing: '{n} of {total}',
    empty: 'Nothing matches these filters.',
    kind: { guideline: 'Guideline', pattern: 'Pattern', article: 'Article' },
    kindPlural: { guideline: 'Guidelines', pattern: 'Patterns', article: 'Articles' },
    lastRevised: 'Last revised',
    status: { revised: 'Revised', retired: 'Retired' },
    supersedes: 'Replaces',
    supersededBy: 'Replaced by',
    related: 'Where I applied it',
    drawnFrom: 'Extracted from this article',
    previous: 'Previous',
    next: 'Next',
    backToIndex: 'Back to Practice',
  },
};

// Dutch shows the English copy under the fallback notice until the owner approves the Dutch (US-0002).
// Only the notice is Dutch; everything else is the English dictionary, so an English-only change
// reaches both languages. The Dutch story replaces this with the approved copy.
const nl: Dictionary = {
  ...en,
  fallback: {
    notice: 'Deze pagina is nog niet vertaald. Je ziet de Engelse versie.',
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, nl };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
