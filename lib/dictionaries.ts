import type { Locale } from '@/lib/i18n';

// Localized UI copy for the bespoke (non-markdown) surfaces — shell chrome, home, contact,
// privacy, references, and the index/fallback strings. Content-body pages
// (work, practice) live as markdown under content/{en,nl}/; this file is the chrome and
// the conversion pages. The Dutch is verbatim from the approved Dutch copy (maestro story
// art-j9e7z77xy0); the privacy page has no Dutch yet and stays English under /nl (`nl` below).

export interface Dictionary {
  shell: {
    skipToContent: string;
    nav: { home: string };
    themeToggle: string;
    footerAiStatement: string;
    privacy: string;
    privacyLine: string;
    /** The labels of the landmarks, read by a screen reader. */
    aria: { primary: string; footer: string; language: string; articles: string; aboutArticle: string };
  };
  fallback: { notice: string };
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroIntro: string[];
    primaryContact: string;
    primaryWork: string;
    trackHeading: string;
    trackLine: string;
    /** `large` is absent for the two cards whose large text is the case study's own (lib/home.ts). */
    trackCards: { large?: string; text: string }[];
    whatHeading: string;
    whatLine: string;
    /** `name` is the bold start, `detail` the muted rest, `link` the label of the link. */
    whatLines: { name: string; detail: string; link: string }[];
    howHeading: string;
    howLine: string;
    howBody: string[];
    howCta: string;
    /** The photo in the place of the intro video (art-cxvf6s5t94): alternative text and the line under it. */
    photoAlt: string;
    photoPlace: string;
    photoUnesco: string;
    photoWikipedia: string;
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
    /** The heading of the references band on the home page. */
    heading: string;
    readOnLinkedIn: string;
    /** The heading of the block on a case study. */
    inTheirWords: string;
    linkedin: string;
    alsoOnLinkedIn: string;
    /** `{language}` is replaced with the language name in the reader's locale. */
    inLanguage: string;
    translatedFrom: string;
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
  /**
   * The Practice section (art-gdp0zjj9fd): the page introduction and the labels of the list and of an
   * article page. Every text is verbatim from the approved site copy, "Practice" and "Texts shown in
   * the design that were missing above" (Practice · list and article page).
   */
  practice: {
    title: string;
    lede: string;
    comesFrom: string;
    writtenHowLabel: string;
    writtenHow: string;
    back: string;
    barQuestion: string;
    barAction: string;
    barAll: string;
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
    aria: {
      primary: 'Primary',
      footer: 'Footer',
      language: 'Language',
      articles: 'Articles',
      aboutArticle: 'About this article',
    },
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
      'Since October 2024 I am in the integration platform team of a large Dutch grocery retailer. I was in charge of building two new platform products that are now rolled out across the company and replace IBM products. They are based on AWS and Azure native services, with the governance and self-service that I initially built and that we now expand with the team.',
    ],
    primaryContact: 'Start a conversation',
    primaryWork: 'See the work',
    // art-spqwxpsqc3: "Home · track record" and "Home · What I do", verbatim from the approved site copy.
    trackHeading: 'Track record',
    trackLine: 'Four numbers from my work. Each links to the work behind it.',
    trackCards: [
      { text: 'One API platform on AWS and Azure. Around 10 teams use it, and they publish an API in minutes instead of days.' },
      { large: 'Over a billion requests a month', text: 'What the API platform handles today.' },
      { text: 'A new interface on the integration adapter is configuration. The first adapters run in production.' },
      {
        large: '5–10 TB a day',
        text: 'A security data lake for a UK telecom operator. I designed it from the concept and proved it with a demo.',
      },
    ],
    whatHeading: 'What I do',
    whatLine: 'Each line leads to the work that shows it.',
    whatLines: [
      { name: 'API platforms', detail: '· one way in for every system that calls another', link: 'Cloud gateway' },
      { name: 'Integration platforms', detail: '· an interface via configuration', link: 'Integration adapter' },
      { name: 'Moving off legacy middleware', detail: '· from vendor specific products to cloud native ones', link: 'Both products' },
      { name: 'Security of APIs', detail: '· OAuth 2 as the standard, and not API keys', link: 'Cloud gateway' },
      { name: 'Getting teams to rely on a platform', detail: '· when there is no direct mandate', link: 'Simple first' },
      { name: 'Data platforms, earlier', detail: '· Kafka, Cloudera, Snowflake', link: 'Earlier work' },
    ],
    howHeading: 'How I work',
    howLine: 'In my own words.',
    howBody: [
      'I break and structure a complex problem, and then guide or drive its implementation.',
      'I work in the middle of design, delivery and engineering. I love engineering, and I keep one hand in the low level of engineering on the solutions I work with.',
      'Usually the successful solution is not based on technical brilliance. It is based on the combination of what the technology can do, what the organization is currently running, where it is ultimately trying to be, and the organizational capacity in terms of people and processes that are in place.',
    ],
    howCta: 'Read more in Practice',
    // art-cxvf6s5t94: verbatim from the approved site copy, "Home · other labels" (the photo line).
    photoAlt: 'Farid Gurbanov',
    photoPlace: 'Khinalug, Azerbaijan',
    photoUnesco: 'UNESCO World Heritage site',
    photoWikipedia: 'Wikipedia',
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
    lastUpdated: 'Last updated: 23 November 2026',
    body: `This is a static website. It has no backend, no database, no contact form, and no analytics.

**What this site collects:** nothing. There is no form that submits data to me, and no tracking or advertising scripts run on these pages.

**Cookies:** this site sets no non-essential cookies. The only client-side state is your light/dark theme preference, stored locally in your own browser; it is never sent anywhere.

**If you use the WhatsApp link:** the site has no chat widget and runs no code from Meta. The WhatsApp button is an ordinary link to WhatsApp's official click-to-chat address. If you do choose that channel, **Meta processes your WhatsApp number and your message as a third party**, under their terms and not mine, and I receive your number so I can reply. If you would rather not involve Meta, use email; that path stays between the two of us.

**When you email me:** if you choose to email me, your message and email address reach my personal mailbox. I use that information only to reply to and follow up on your enquiry. The lawful basis is my legitimate interest in responding to people who contact me. I keep correspondence only as long as needed for the conversation and any resulting work, and I do not sell or share it.

**Hosting:** the site is served as static files from my own server. The hosting layer may process technical request data (such as your IP address) in server logs for security and to keep the site running, which is standard for any website.

**References:** the home page quotes people I have worked with, with their name, their role and a link to LinkedIn. The same words are recommendations on my LinkedIn profile. Each of them agreed to that before it went live, and any of them can have it taken down by emailing me.

**Your rights:** you can ask me what correspondence I hold about you, to correct it, or to delete it. Email me and I will action it.`,
  },
  // art-2ya5at7k1q: the heading of the references band is verbatim from the approved site copy,
  // "References on Home"; the line under each quote is the person's `role · context` in their file.
  references: {
    heading: 'What people I worked with say',
    readOnLinkedIn: 'Read it on LinkedIn',
    inTheirWords: 'In their words',
    linkedin: 'LinkedIn',
    alsoOnLinkedIn: 'Also on my LinkedIn',
    inLanguage: 'In {language}.',
    translatedFrom: 'Translated from {language}, with their approval.',
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
    lede: 'How I work and what I think about it. Written from my own projects, in my own words.',
    comesFrom: 'Where it comes from',
    writtenHowLabel: 'Written how',
    writtenHow: 'From my own answers in an interview. Edited, not generated.',
    back: '← Practice',
    barQuestion: 'Do you see it differently, or do you have the same problem?',
    barAction: 'Start a conversation',
    barAll: 'All of Practice',
  },
};

// The Dutch, verbatim from the approved Dutch copy (maestro story art-j9e7z77xy0): the sections Home,
// Werk, Praktijk, Voettekst and "Labels en kleine teksten". Same keys, same order as the English.
// The privacy page has no Dutch (it is on `pathsWithoutDutch`, lib/i18n.ts), so its text is the
// English one. `references.inTheirWords` and `alsoOnLinkedIn`, and `indexes.backToIndex`, are
// English: no page shows them today (no reference names a case study; no case study is on the
// earlier shape) and the approved Dutch copy has no text for them.
const nl: Dictionary = {
  shell: {
    skipToContent: 'Naar de inhoud',
    nav: { home: 'Home' },
    themeToggle: 'Thema wisselen',
    footerAiStatement: 'Hoe AI hier is gebruikt. De code en een deel van de teksten op deze site zijn gemaakt met hulp van AI. De beslissingen en het werk voor klanten zijn van mij.',
    privacy: 'Privacy',
    privacyLine: 'Er wordt niets over je verzameld',
    aria: {
      primary: 'Hoofdmenu',
      footer: 'Voettekst',
      language: 'Taal',
      articles: 'Artikelen',
      aboutArticle: 'Over dit artikel',
    },
  },
  fallback: {
    notice: 'Deze pagina is nog niet vertaald. Je ziet de Engelse versie.',
  },
  home: {
    heroEyebrow: 'Hands-on · AWS en Azure · Eindhoven',
    heroTitle: 'Platform- en integratiearchitect',
    heroIntro: [
      'Ik heb gewerkt met veel soorten infrastructuur, cloud en on-premises, vooral AWS en Azure, in retail, telecom en de maakindustrie.',
      'Sinds oktober 2024 werk ik in het integratieplatformteam van een grote Nederlandse supermarktketen. Ik was verantwoordelijk voor het bouwen van twee nieuwe platformproducten. Ze worden nu in het hele bedrijf uitgerold en vervangen producten van IBM. Ze zijn gebouwd op de eigen diensten van AWS en Azure, met de governance en self-service die ik in het begin heb gebouwd en die we nu met het team uitbreiden.',
    ],
    primaryContact: 'Neem contact op',
    primaryWork: 'Bekijk het werk',
    trackHeading: 'Trackrecord',
    trackLine: 'Vier getallen uit mijn werk. Elk getal leidt naar het werk erachter.',
    trackCards: [
      { text: 'Eén API-platform op AWS en Azure. Ongeveer 10 teams gebruiken het, en ze publiceren een API in minuten in plaats van dagen.' },
      { large: 'Meer dan een miljard verzoeken per maand', text: 'Wat het API-platform nu verwerkt.' },
      { text: 'Een nieuwe interface op de integratie-adapter is configuratie. De eerste adapters draaien in productie.' },
      {
        large: '5–10 TB per dag',
        text: 'Een security data lake voor een Britse telecomoperator. Ik heb het ontworpen vanaf het concept en bewezen met een demo.',
      },
    ],
    whatHeading: 'Wat ik doe',
    whatLine: 'Elke regel leidt naar het werk dat het laat zien.',
    whatLines: [
      { name: 'API-platforms', detail: '· één ingang voor elk systeem dat een ander systeem aanroept', link: 'Cloud gateway' },
      { name: 'Integratieplatforms', detail: '· een interface via configuratie', link: 'Integratie-adapter' },
      { name: 'Weg van legacy middleware', detail: '· van leverancierspecifieke producten naar cloud-native producten', link: 'Beide producten' },
      { name: "Beveiliging van API's", detail: '· OAuth 2 als standaard, en geen API-sleutels', link: 'Cloud gateway' },
      { name: 'Teams laten vertrouwen op een platform', detail: '· als er geen direct mandaat is', link: 'Eerst eenvoudig' },
      { name: 'Dataplatforms, eerder', detail: '· Kafka, Cloudera, Snowflake', link: 'Eerder werk' },
    ],
    howHeading: 'Hoe ik werk',
    howLine: 'In mijn eigen woorden.',
    howBody: [
      'Ik breek een complex probleem op, breng er structuur in, en begeleid of leid daarna de uitvoering.',
      'Ik werk in het midden tussen ontwerp, oplevering en engineering. Ik houd van engineering, en ik houd één hand in het echte bouwwerk van de oplossingen waar ik aan werk.',
      'Een oplossing slaagt meestal niet door technische briljantheid. Ze slaagt door de combinatie van wat de technologie kan, wat de organisatie nu draait, waar ze uiteindelijk naartoe wil, en wat de organisatie aankan met de mensen en processen die er zijn.',
    ],
    howCta: 'Lees meer in Praktijk',
    photoAlt: 'Farid Gurbanov',
    photoPlace: 'Khinalug, Azerbeidzjan',
    photoUnesco: 'UNESCO-werelderfgoed',
    photoWikipedia: 'Wikipedia',
  },
  contact: {
    title: 'Contact',
    lede: 'Schrijf me over een integratieplatform, een API-platform of een overstap van legacy middleware. Een kort bericht over wat je wilt bereiken is genoeg. Ik antwoord zelf.',
    contractLabel: 'Contractvorm',
    contractValue: 'Freelance, via mijn eigen bedrijf',
    basedLabel: 'Standplaats',
    basedValue: 'Eindhoven, Nederland',
    languagesLabel: 'Talen',
    languagesValue: 'Engels, Nederlands (B1)',
    email: 'Stuur een e-mail',
    whatsapp: 'WhatsApp',
    linkedin: 'LinkedIn',
  },
  privacy: en.privacy,
  references: {
    heading: 'Wat mensen zeggen met wie ik heb gewerkt',
    readOnLinkedIn: 'Lees het op LinkedIn',
    inTheirWords: en.references.inTheirWords,
    linkedin: 'LinkedIn',
    alsoOnLinkedIn: en.references.alsoOnLinkedIn,
    inLanguage: 'In het {language}.',
    translatedFrom: 'Vertaald uit het {language}, met hun goedkeuring.',
  },
  indexes: {
    workTitle: 'Werk',
    workIntro: 'Twee platformproducten die ik vanaf de eerste versie heb gebouwd, en eerder werk aan dataplatforms. Elke case lees je in twee minuten: waar het begon, wat ik deed, en waar het nu staat.',
    whereItStands: 'Waar het staat:',
    earlierHeading: 'Eerder werk, kort',
    earlierLine: 'Hier is geen casepagina voor.',
    alsoHeading: 'Ook gebouwd',
    alsoLine: 'Mijn eigen labs, buiten het werk voor klanten. Alleen repositories die openbaar op GitHub staan.',
    backToIndex: en.indexes.backToIndex,
  },
  practice: {
    title: 'Praktijk',
    lede: 'Hoe ik werk en wat ik ervan vind. Geschreven vanuit mijn eigen projecten, in mijn eigen woorden.',
    comesFrom: 'Waar het vandaan komt',
    writtenHowLabel: 'Hoe het is geschreven',
    writtenHow: 'Uit mijn eigen antwoorden in een interview. Geredigeerd, niet gegenereerd.',
    back: '← Praktijk',
    barQuestion: 'Zie je het anders, of heb je hetzelfde probleem?',
    barAction: 'Neem contact op',
    barAll: 'Alles in Praktijk',
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, nl };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
