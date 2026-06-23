import type { Locale } from '@/lib/i18n';

// Localized UI copy for the bespoke (non-markdown) surfaces — shell chrome, home, portfolio,
// contact, privacy, training stub, and the index/fallback strings. Content-body pages
// (expertise, work, writing) live as markdown under content/{en,nl}/; this file is the chrome and
// the conversion pages, authored fully in both languages (ADR-0002).

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
    proofHeading: string;
    proofPoints: { metric: string; label: string; href: string }[];
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
    workTitle: string;
    workLede: string;
    writingTitle: string;
    writingLede: string;
    readMore: string;
    backToIndex: { expertise: string; work: string; writing: string };
  };
}

const en: Dictionary = {
  shell: {
    skipToContent: 'Skip to content',
    nav: { home: 'Home' },
    tasterCta: 'Book a taster',
    themeToggle: 'Toggle theme',
    footerTagline: 'Integration architect — I design the backbone and build the AI that runs on it.',
    footerNavHeading: 'Site',
    footerConnectHeading: 'Connect',
    privacy: 'Privacy',
    rights: 'All rights reserved.',
    builtWith: 'Built as a static site — Next.js, exported and served by nginx.',
  },
  fallback: {
    notice: 'This page is not yet translated — showing the English version.',
  },
  home: {
    heroEyebrow: 'Integration architect who builds AI',
    heroTitle: 'I design the integration backbone — and build the AI that runs on it.',
    heroLede:
      '20+ years architecting the integration, streaming and data platforms that enterprises run on — and now the agentic systems on top of them. Not slideware: systems in production and reference architectures you can read.',
    primaryWork: 'See selected work',
    primaryContact: 'Start a conversation',
    proofHeading: 'Proof, not adjectives',
    proofPoints: [
      { metric: '~500M+ req/month', label: 'Federated cross-cloud API platform (Cloud Gateway)', href: '/work/cloud-gateway' },
      { metric: '~€250–300k/yr saved', label: '20+ gateways consolidated into one self-service platform', href: '/work/cloud-gateway' },
      { metric: 'govern → build → deliver', label: 'Three sibling repos behind the AI work', href: '/portfolio' },
    ],
    tasterHeading: 'Training',
    tasterBody:
      'I also teach architecture and product teams to direct AI agents — taught by someone who ships, not just advises. The full programme is coming; for now, book a taster.',
    tasterCta: 'Book a taster',
  },
  portfolio: {
    title: 'Portfolio',
    lede: 'Working code behind the positioning, across three areas: AI & automation; integration, streaming & data; and applied ML & data science. Every card carries an honest maturity label — nothing is dressed up as more than it is.',
    narrative: 'Build proof, honestly labelled',
    maturityWorking: 'Working — runs end-to-end',
    maturityReference: 'Reference architecture',
    provesHeading: 'What it proves',
    viewRepo: 'View repository',
    linksGatedNotice:
      'The two contrail demos are public and link out. The remaining repos are being aligned under one name, neutralized and licensed before they carry my name on a public surface — their descriptions are honest now; links follow.',
    honesty:
      'Four of these run end-to-end today — the LLM gateway, the event-integration platform, and the two contrail demos. The other two are reference architectures, and each card says which it is. No production-system claim I can’t back.',
  },
  contact: {
    title: 'Contact',
    lede: 'The fastest way to start a conversation.',
    emailHeading: 'Email',
    emailHint: 'The best first step. I reply to specifics faster than to “let’s connect”.',
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
    lastUpdated: 'Last updated: 9 June 2026',
    body: `This is a static website. It has no backend, no database, no contact form, and no analytics.

**What this site collects:** nothing. There is no form that submits data to me, and no tracking or advertising scripts run on these pages.

**Cookies:** this site sets no non-essential cookies. The only client-side state is your light/dark theme preference, stored locally in your own browser; it is never sent anywhere.

**When you email me:** if you choose to email the address on the contact page, your message and email address reach my personal mailbox. I use that information only to reply to and follow up on your enquiry. The lawful basis is my legitimate interest in responding to people who contact me. I keep correspondence only as long as needed for the conversation and any resulting work, and I do not sell or share it.

**Hosting:** the site is served as static files from my own server. The hosting layer may process technical request data (such as your IP address) in server logs for security and to keep the site running — standard for any website.

**Your rights:** you can ask me what correspondence I hold about you, to correct it, or to delete it. Email the address on the contact page and I will action it.`,
  },
  training: {
    title: 'Training',
    lede: 'AI training for architecture and product teams — taught by someone who ships.',
    body: `Most AI training is delivered by people who have never put an agentic system into production. I have — and I teach teams to direct AI the way a senior engineer would: writing specs an agent can execute, evaluating what comes back, and telling real capability from hype.

The full programme — two tiers, an offer ladder, and a plain-language EU AI Act explainer — is being built and validated with real teams now. I would rather get it right with a few pilots than publish a brochure.

If that is useful to your team, the best move today is to book a short taster.`,
    ctaHeading: 'Book a taster',
    ctaBody: 'A short session for your team — no commitment. Tell me your context and I’ll tailor it.',
    cta: 'Book a taster',
  },
  indexes: {
    expertiseTitle: 'Expertise',
    expertiseLede: 'The depth behind the positioning — six areas I work in, with the AI and applied-ML work leading, not bolted on.',
    workTitle: 'Selected work',
    workLede: 'A few concrete, quantified things I have built. Clients are named where I may; abstracted where confidentiality requires, with the metrics kept.',
    writingTitle: 'Writing',
    writingLede: 'A low cadence of evergreen pieces — no treadmill, no newsletter. Mostly on directing AI agents in real delivery.',
    readMore: 'Read more',
    backToIndex: { expertise: 'All expertise', work: 'All selected work', writing: 'All writing' },
  },
};

const nl: Dictionary = {
  shell: {
    skipToContent: 'Naar inhoud',
    nav: { home: 'Home' },
    tasterCta: 'Boek een proefsessie',
    themeToggle: 'Thema wisselen',
    footerTagline: 'Integratiearchitect — ik ontwerp de ruggengraat en bouw de AI die erop draait.',
    footerNavHeading: 'Site',
    footerConnectHeading: 'Contact',
    privacy: 'Privacy',
    rights: 'Alle rechten voorbehouden.',
    builtWith: 'Gebouwd als statische site — Next.js, geëxporteerd en geserveerd door nginx.',
  },
  fallback: {
    notice: 'Deze pagina is nog niet vertaald — de Engelse versie wordt getoond.',
  },
  home: {
    heroEyebrow: 'Integratiearchitect die AI bouwt',
    heroTitle: 'Ik ontwerp de integratieruggengraat — en bouw de AI die erop draait.',
    heroLede:
      '20+ jaar het ontwerpen van de integratie-, streaming- en dataplatformen waar ondernemingen op draaien — en nu de agentische systemen daarbovenop. Geen slideware: systemen in productie en referentiearchitecturen die je kunt nalezen.',
    primaryWork: 'Bekijk geselecteerd werk',
    primaryContact: 'Begin een gesprek',
    proofHeading: 'Bewijs, geen bijvoeglijke naamwoorden',
    proofPoints: [
      { metric: '~500M+ req/maand', label: 'Federatief cross-cloud API-platform (Cloud Gateway)', href: '/work/cloud-gateway' },
      { metric: '~€250–300k/jaar bespaard', label: '20+ gateways samengevoegd tot één selfservice-platform', href: '/work/cloud-gateway' },
      { metric: 'govern → build → deliver', label: 'Drie verwante repos achter het AI-werk', href: '/portfolio' },
    ],
    tasterHeading: 'Training',
    tasterBody:
      'Ik leer architectuur- en productteams ook om AI-agents aan te sturen — gegeven door iemand die bouwt, niet alleen adviseert. Het volledige programma komt eraan; boek voor nu een proefsessie.',
    tasterCta: 'Boek een proefsessie',
  },
  portfolio: {
    title: 'Portfolio',
    lede: 'Werkende code achter de positionering, verdeeld over drie gebieden: AI & automatisering; integratie, streaming & data; en toegepaste ML & datawetenschap. Elke kaart draagt een eerlijk volwassenheidslabel — niets wordt mooier voorgesteld dan het is.',
    narrative: 'Bouwbewijs, eerlijk gelabeld',
    maturityWorking: 'Werkend — draait end-to-end',
    maturityReference: 'Referentiearchitectuur',
    provesHeading: 'Wat het bewijst',
    viewRepo: 'Bekijk repository',
    linksGatedNotice:
      'De twee contrail-demo\'s zijn openbaar en linken door. De overige repos worden onder één naam uitgelijnd, geneutraliseerd en gelicentieerd voordat ze mijn naam dragen op een openbaar oppervlak — hun beschrijvingen zijn nu al eerlijk; de links volgen.',
    honesty:
      'Vier hiervan draaien vandaag end-to-end — de LLM-gateway, het event-integration-platform en de twee contrail-demo\'s. De andere twee zijn referentiearchitecturen, en elke kaart zegt welke. Geen productieclaim die ik niet kan onderbouwen.',
  },
  contact: {
    title: 'Contact',
    lede: 'De snelste manier om een gesprek te beginnen.',
    emailHeading: 'E-mail',
    emailHint: 'De beste eerste stap. Op concrete vragen reageer ik sneller dan op “laten we connecten”.',
    tasterHeading: 'Boek een trainingsproefsessie',
    tasterBody: 'Nieuwsgierig naar de training? Mail me met “proefsessie” en de context van je team, dan stel ik een korte sessie voor.',
    tasterCta: 'Mail over een proefsessie',
    elsewhereHeading: 'Elders',
    locationHeading: 'Gevestigd in',
    linkedin: 'LinkedIn',
    github: 'GitHub',
  },
  privacy: {
    title: 'Privacy',
    lastUpdated: 'Laatst bijgewerkt: 9 juni 2026',
    body: `Dit is een statische website. Er is geen backend, geen database, geen contactformulier en geen analytics.

**Wat deze site verzamelt:** niets. Er is geen formulier dat gegevens naar mij verstuurt, en er draaien geen tracking- of advertentiescripts op deze pagina's.

**Cookies:** deze site plaatst geen niet-essentiële cookies. De enige client-side status is je licht/donker-themavoorkeur, lokaal opgeslagen in je eigen browser; die wordt nergens naartoe gestuurd.

**Als je me mailt:** als je het adres op de contactpagina gebruikt, komen je bericht en e-mailadres in mijn persoonlijke mailbox terecht. Ik gebruik die informatie alleen om te antwoorden en op te volgen. De grondslag is mijn gerechtvaardigd belang om te reageren op mensen die contact opnemen. Ik bewaar correspondentie niet langer dan nodig voor het gesprek en eventueel werk daaruit, en ik verkoop of deel die niet.

**Hosting:** de site wordt als statische bestanden geserveerd vanaf mijn eigen server. De hostinglaag kan technische verzoekgegevens (zoals je IP-adres) verwerken in serverlogs voor beveiliging en werking — standaard voor elke website.

**Je rechten:** je kunt vragen welke correspondentie ik over je heb, die laten corrigeren of verwijderen. Mail het adres op de contactpagina en ik handel het af.`,
  },
  training: {
    title: 'Training',
    lede: 'AI-training voor architectuur- en productteams — gegeven door iemand die bouwt.',
    body: `De meeste AI-training wordt gegeven door mensen die nooit een agentisch systeem in productie hebben gebracht. Ik wel — en ik leer teams AI aan te sturen zoals een senior engineer dat doet: specs schrijven die een agent kan uitvoeren, evalueren wat eruit komt, en echte capaciteit van hype onderscheiden.

Het volledige programma — twee niveaus, een aanbodladder en een EU AI Act-uitleg in gewone taal — wordt nu gebouwd en gevalideerd met echte teams. Ik krijg het liever goed met een paar pilots dan dat ik een brochure publiceer.

Is dat nuttig voor je team? De beste stap vandaag is een korte proefsessie boeken.`,
    ctaHeading: 'Boek een proefsessie',
    ctaBody: 'Een korte sessie voor je team — vrijblijvend. Vertel je context, dan stem ik het af.',
    cta: 'Boek een proefsessie',
  },
  indexes: {
    expertiseTitle: 'Expertise',
    expertiseLede: 'De diepgang achter de positionering — zes gebieden waarin ik werk, met het AI- en toegepaste-ML-werk voorop, niet als bijzaak.',
    workTitle: 'Geselecteerd werk',
    workLede: 'Een paar concrete, gekwantificeerde dingen die ik heb gebouwd. Klanten worden genoemd waar het mag; geabstraheerd waar vertrouwelijkheid dat vereist, met behoud van de cijfers.',
    writingTitle: 'Blog',
    writingLede: 'Een laag tempo van blijvende stukken — geen tredmolen, geen nieuwsbrief. Vooral over het aansturen van AI-agents in echte levering.',
    readMore: 'Lees meer',
    backToIndex: { expertise: 'Alle expertise', work: 'Al het werk', writing: 'Alle blogs' },
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, nl };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
