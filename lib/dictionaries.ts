import type { Locale } from '@/lib/i18n';

// Localized UI copy for the bespoke (non-markdown) surfaces — shell chrome, home, contact,
// privacy, references, and the index/fallback strings. Content-body pages
// (work, practice) live as markdown under content/en/; this file is the chrome and
// the conversion pages. Dutch shows the English values for now (see `nl` below, ADR-0002).

export interface Dictionary {
  shell: {
    skipToContent: string;
    nav: { home: string };
    themeToggle: string;
    footerAiStatement: string;
    privacy: string;
    privacyLine: string;
  };
  fallback: { notice: string };
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroIntro: string[];
    primaryContact: string;
    primaryWork: string;
    howHeading: string;
    howLine: string;
    howBody: string[];
    howCta: string;
  };
  contact: {
    title: string;
    lede: string;
    contractLabel: string;
    contractValue: string;
    basedLabel: string;
    basedValue: string;
    languagesLabel: string;
    languagesValue: string;
    email: string;
    whatsapp: string;
    linkedin: string;
  };
  privacy: {
    title: string;
    lastUpdated: string;
    body: string;
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
  };
  indexes: {
    workTitle: string;
    workIntro: string;
    whereItStands: string;
    earlierHeading: string;
    earlierLine: string;
    alsoHeading: string;
    alsoLine: string;
    backToIndex: { work: string };
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
    themeToggle: 'Toggle theme',
    // art-4fzvp6bqm0: the one statement on how AI is used, verbatim from the approved copy (Footer).
    footerAiStatement: 'How AI is used here. The code and some notes on this site are built with AI assistance. The decisions and the client work are mine.',
    privacy: 'Privacy',
    // art-r903t1r2tp: the rest of the footer's privacy line, "Privacy · Nothing about you is collected".
    privacyLine: 'Nothing about you is collected',
  },
  fallback: {
    notice: 'This page is not yet translated — showing the English version.',
  },
  // Every text of the home page is verbatim from the approved site copy, section "Home" (maestro story art-9947n0hg99).
  home: {
    heroEyebrow: 'Hands-on · AWS and Azure · Eindhoven',
    heroTitle: 'Platform and Integration Architect',
    heroIntro: [
      'I have worked with a range of infrastructure, cloud and on-prem, mostly AWS and Azure, in retail, telecom and manufacturing.',
      'Since October 2023 I am in the integration platform team of a large Dutch grocery retailer. I was in charge of building two new platform products that are now rolled out across the company and replace IBM products. They are based on AWS and Azure native services, with the governance and self-service that I initially built and that we now expand with the team.',
    ],
    primaryContact: 'Start a conversation',
    primaryWork: 'See the work',
    howHeading: 'How I work',
    howLine: 'In my own words.',
    howBody: [
      'I break and structure a complex problem, and then guide or drive its implementation.',
      'I work in the middle of design, delivery and engineering. I love engineering, and I keep one hand in the low level of engineering on the solutions I work with.',
      'Usually the successful solution is not based on technical brilliance. It is based on the combination of what the technology can do, what the organization is currently running, where it is ultimately trying to be, and the organizational capacity in terms of people and processes that are in place.',
    ],
    howCta: 'Read more in Practice',
  },
  // art-r903t1r2tp: the Contact part of the home page, verbatim from the approved site copy, section
  // "Contact" (the text) and "Texts shown in the design that were missing above" (rows, buttons).
  contact: {
    title: 'Contact',
    lede: 'Write to me about an integration platform, an API platform, or a move off legacy middleware. A short message about what you are trying to get done is enough. I answer myself.',
    contractLabel: 'How I contract',
    contractValue: 'Freelance, through my own company',
    basedLabel: 'Based',
    basedValue: 'Eindhoven, Netherlands',
    languagesLabel: 'Languages',
    languagesValue: 'English, Dutch (B1)',
    email: 'Send an email',
    whatsapp: 'WhatsApp',
    linkedin: 'LinkedIn',
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
  },
  indexes: {
    // art-vvzsw9ap9e: verbatim from the approved site copy, section "Work" and "Work · list".
    workTitle: 'Work',
    workIntro: 'Two platform products that I built from the first version, and earlier work in data platforms. Each case is a two-minute read: where it started, what I did, and where it stands today.',
    whereItStands: 'Where it stands:',
    earlierHeading: 'Earlier work, short',
    earlierLine: 'No case page for these.',
    alsoHeading: 'Also built',
    alsoLine: 'My own labs, outside client work. Only repositories that are public on GitHub are listed.',
    backToIndex: { work: 'All selected work' },
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

// Dutch shows the English copy under the fallback notice until the owner approves the Dutch (maestro story art-bf5tq4788n).
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
