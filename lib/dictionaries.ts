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
    writingTitle: 'Writing',
    writingLede: 'Occasional pieces on architecture decisions, delivery economics, and directing AI in real work. No newsletter.',
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
    footerTagline: 'Senior Solution Architect — Data & Integratie. Ik ontwerp het fundament, bouw wat erop draait, en zorg dat de organisatie het ook gaat gebruiken.',
    footerNavHeading: 'Site',
    footerConnectHeading: 'Contact',
    privacy: 'Privacy',
    rights: 'Alle rechten voorbehouden.',
    builtWith: 'Gebouwd als statische site: Next.js, geëxporteerd en geserveerd door nginx.',
  },
  fallback: {
    notice: 'Deze pagina is nog niet vertaald. Je ziet de Engelse versie.',
  },
  home: {
    heroEyebrow: 'Senior Solution Architect — Data & Integratie',
    heroTitle: 'Ik ontwerp het fundament voor data en integratie, bouw wat erop draait, en zorg dat de organisatie het ook gaat gebruiken.',
    heroLede:
      'Ruim twintig jaar ontwerp ik de data-, integratie- en streamingplatformen waar bedrijven op draaien, vrijwel nooit met een mandaat in de hand: 18–20 productteams naar één platform, drie landschappen naar één event-contract, een finance-afdeling die een getal eerst moest vertrouwen voordat ze het gebruikte. Systemen in productie, met de beslissingen vastgelegd op een plek waar mensen ze konden aanvechten.',
    primaryWork: 'Bekijk geselecteerd werk',
    primaryContact: 'Begin een gesprek',
    introHeading: 'Begin hier',
    introBody:
      'Een korte introductie: wie ik ben, in wat voor landschap ik werk, en hoe ik een architectuur stuur over teams die niet aan mij rapporteren.',
    introDuration: 'Speelduur',
    proofHeading: 'Staat van dienst',
    proofLede:
      'Vier cijfers uit werk dat live is gegaan. Elk cijfer linkt naar de casus erachter, inclusief de discussie.',
    proofPoints: [
      { metric: '18–20 teams, zonder mandaat', label: 'Productteams samengebracht op één API-platform, door het platform goedkoper te maken dan blijven zitten. Zo’n €250–300k per jaar bespaard.', href: '/work/cloud-gateway' },
      { metric: '20+ dataproducten, 30+ bronnen', label: 'Streamingdata uit 30+ bronsystemen omgezet in 20+ dataproducten op Kafka, elk in eigendom van een domein. Schemaregels laten producenten uitrollen zonder change board.', href: '/work/cloudera-kafka' },
      { metric: '~30+ company codes', label: 'SAP Finance-grootboeken naar Snowflake, in gebruik genomen omdat Finance de cijfers zelf kon aansluiten.', href: '/work/sap-snowflake' },
      { metric: '~1,5 mld+ req/maand', label: 'Federatief cross-cloud API-platform over AWS en Azure (Cloud Gateway), server-side fouten onder 0,03%', href: '/work/cloud-gateway' },
    ],
    practiceHeading: 'Hoe ik het in gebruik krijg',
    practiceLede:
      'Het ontwerp is meestal de makkelijkste helft. Of er iets komt, hangt af van de teams die elk al iets hebben dat werkt, de afdeling die een getal moet vertrouwen, en het contract dat iemand vier jaar geleden tekende. Drie situaties.',
    practicePoints: [
      {
        title: 'Twintig teams, en geen bevoegdheid om er één te verplaatsen',
        body: 'Om een mandaat vragen had twintig uitzonderingen opgeleverd. Dus moest het platform voor een team goedkoper zijn dan blijven zitten, en de eerste teams die overgingen waren die met de slechtste bestaande situatie.',
        href: '/work/cloud-gateway',
      },
      {
        title: 'Drie teams, drie definities van “klaar”',
        body: 'Voor SAP hield het werk op bij “de events staan op de broker”; voor het cloudteam begon het bij “wij verwerken wat er staat”. Alles wat ertoe deed zat in het gat daartussen. Ik heb de grens op papier gezet en het ondankbare deel zelf gedaan.',
        href: '/work/sap-event-backbone',
      },
      {
        title: 'Een finance-organisatie die geen reden had mij te geloven',
        body: 'De pipeline uitleggen veranderde niets. Een aansluitingscontrole die Finance zelf tegen het eigen grootboek kon draaien wél. De adoptie volgde op de controle.',
        href: '/work/sap-snowflake',
      },
    ],
    practiceCta: 'Hoe ik door de organisatie heen werk',
    buildHeading: 'Wat ik bouw',
    buildLede:
      'Vijf gebieden, in de volgorde waarin ik er meestal voor gevraagd word.',
    buildPoints: [
      {
        title: 'Data & lakehouse',
        body: 'Medallion-lakehouses, contracten op het koppelvlak met de bron, en CDC-pipelines die betrouwbaar blijven, zo gebouwd dat de cijfers aansluiten op het systeem dat mensen al geloven.',
        href: '/expertise/data-and-lakehouse',
      },
      {
        title: 'Integratiearchitectuur',
        body: 'De laag waarmee bedrijfssystemen met elkaar praten: legacy-ESB-landschappen in golven uitgefaseerd naar event-driven, API-led platformen in eigendom van de domeinen.',
        href: '/expertise/integration-architecture',
      },
      {
        title: 'Event-driven & streaming',
        body: 'Kafka en broker-gebaseerde integratie als basis van het landschap, met schema-evolutie geregeld in de registry zodat producenten kunnen uitrollen zonder change board.',
        href: '/expertise/event-driven-streaming',
      },
      {
        title: "API's & gateways",
        body: "API-platformen die schalen over tientallen teams: gatewaystrategie, één beveiligingsmodel, en de developer experience die maakt dat teams ze gaan gebruiken.",
        href: '/expertise/apis-and-gateways',
      },
      {
        title: 'AI & automatisering',
        body: 'AI geïntegreerd zoals elk ander leverancierssysteem: achter een contract, met een evaluatiepoort vóór release, en het model buiten de runtime zodat het vervangbaar blijft.',
        href: '/expertise/ai-and-automation',
      },
    ],
    buildCta: 'Bekijk de code erachter',
    buildCtaBody:
      'Openbare repositories die je kunt klonen en draaien: de “actieve klant”-vraag, de SAP↔Snowflake-beslissing, de Fabric-of-Databricks-beslissing, het moderniseringslab, het streamingplatform en de identity-service.',
    tasterHeading: 'Training',
    tasterBody:
      'Ik leer architectuur- en productteams ook om AI-agents aan te sturen. Het volledige programma komt eraan; boek voor nu een proefsessie.',
    tasterCta: 'Boek een proefsessie',
  },
  portfolio: {
    title: 'Portfolio',
    lede: 'Werkende code achter de positionering, in drie gebieden: het doelmodel bepalen en modelleren, een landschap ernaartoe verhuizen, en het platform eronder draaien. Elke repository hier is openbaar, draait end-to-end, en zegt in de eigen README waar de demo stopt en productie zou beginnen.',
    narrative: 'Werkende code, en wat die aantoont',
    maturityWorking: 'Werkend — draait end-to-end',
    maturityReference: 'Referentiearchitectuur',
    provesHeading: 'Wat het aantoont',
    viewRepo: 'Bekijk repository',
    linksGatedNotice:
      'Een repository staat hier zodra die openbaar is en een licentie heeft. Wat nog in aanbouw is, staat niet op deze pagina.',
    honesty:
      'Deze draaien allemaal end-to-end; kloon er een en start hem op. Twee kanttekeningen. Ze draaien op synthetische data, dus de claim zit in de architectuur en de werking, en elke README zegt waar echte data in de plaats zou komen. En de drie blueprint-achtige repositories zijn in de eerste plaats documenten: wat draait is de beslissingsengine, het kostenmodel en de simulatie achter het document. Geen van deze repositories is een productiesysteem.',
  },
  contact: {
    title: 'Contact',
    lede: 'De snelste manier om een gesprek te beginnen.',
    emailHeading: 'E-mail',
    emailHint: 'De beste eerste stap. Op concrete vragen reageer ik sneller dan op “laten we connecten”.',
    whatsappHeading: 'WhatsApp',
    whatsappHint:
      'Sneller dan e-mail als je gewoon iets wilt vragen. Je eigen WhatsApp opent met de tekst hieronder al ingevuld. Jij drukt op verzenden, dus ik krijg je nummer en kan in dezelfde chat antwoorden. Vanaf deze pagina wordt niets verstuurd.',
    whatsappPlaceholder: 'Wat wil je vragen?',
    whatsappCta: 'Open WhatsApp',
    whatsappDefault: 'Hoi Farid, ik kom via faridgurbanov.com. Ik wil graag iets vragen over ',
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
    lastUpdated: 'Laatst bijgewerkt: 17 september 2026',
    body: `Dit is een statische website. Er is geen backend, geen database, geen contactformulier en geen analytics.

**Wat deze site verzamelt:** niets. Er is geen formulier dat gegevens naar mij verstuurt, en er draaien geen tracking- of advertentiescripts op deze pagina's. Het berichtvak op de contactpagina is geen formulier; het bouwt alleen een WhatsApp-link in je eigen browser, en verstuurt zelf nooit iets.

**Cookies:** deze site plaatst geen niet-essentiële cookies. Het enige wat lokaal wordt bewaard is je licht/donker-themavoorkeur, in je eigen browser; die wordt nergens naartoe gestuurd.

**Als je de WhatsApp-link gebruikt:** deze site heeft geen chatwidget en draait geen code van Meta. De WhatsApp-knop is een gewone link naar het officiële click-to-chat-adres van WhatsApp. Er wordt niets verstuurd als je in het berichtvak typt. Die tekst vult alleen de chat alvast in, en je eigen WhatsApp-app verstuurt hem pas als jij op verzenden drukt. Kies je voor dat kanaal, dan **verwerkt Meta je WhatsApp-nummer en je bericht als derde partij**, onder hun voorwaarden en niet de mijne, en krijg ik je nummer zodat ik kan antwoorden. Wil je Meta er liever buiten houden, gebruik dan e-mail; dat pad blijft tussen ons tweeën.

**Als je me mailt:** als je het adres op de contactpagina gebruikt, komen je bericht en e-mailadres in mijn persoonlijke mailbox terecht. Ik gebruik die informatie alleen om te antwoorden en op te volgen. De grondslag is mijn gerechtvaardigd belang om te reageren op mensen die contact opnemen. Ik bewaar correspondentie niet langer dan nodig voor het gesprek en eventueel werk dat eruit volgt, en ik verkoop of deel die niet.

**Hosting:** de site wordt als statische bestanden geserveerd vanaf mijn eigen server. De hostinglaag kan technische verzoekgegevens (zoals je IP-adres) verwerken in serverlogs voor beveiliging en werking, zoals bij elke website.

**Referenties:** de referentiepagina en de casussen citeren mensen met wie ik heb gewerkt, met hun naam, foto, rol van destijds en een link naar hun openbare LinkedIn-profiel. Ieder van hen heeft daar vooraf mee ingestemd, en wie dat wil kan het met een e-mail laten verwijderen.

**Je rechten:** je kunt vragen welke correspondentie ik over je heb, die laten corrigeren of verwijderen. Mail het adres op de contactpagina en ik handel het af.`,
  },
  references: {
    title: 'Referenties',
    lede: 'Mensen met wie ik heb gewerkt, over het werk uit de casussen. Hun woorden, onbewerkt, met een link naar ieder van hen zodat je het kunt nagaan.',
    heading: 'In hun woorden',
    homeLede: 'Mensen met wie ik heb gewerkt, in hun eigen woorden. Elk linkt naar hun LinkedIn-profiel; de volledige set staat op de referentiepagina.',
    allCta: 'Alle referenties',
    readCaseStudy: 'Lees de casus',
    linkedin: 'LinkedIn',
    alsoOnLinkedIn: 'Ook op mijn LinkedIn',
    workedTogether: 'samengewerkt',
    inLanguage: 'In het {language}.',
    translatedFrom: 'Vertaald uit het {language}, met hun goedkeuring.',
    collectedHeading: 'Hoe deze zijn verzameld',
    collectedBody: 'Iedereen hier heeft deze pagina gezien voordat hij live ging en heeft ingestemd met naam, foto, rol en woorden erop, met de link naar hun profiel. Citaten zijn letterlijk; waar ik er een heb ingekort, is dat aangegeven. Wie hier staat kan het met één e-mail laten verwijderen.',
    collectedLinkedin: 'Een aantal staat ook als aanbeveling op mijn LinkedIn-profiel, waar je ze bij de bron kunt lezen.',
    contactHeading: 'Vraag het iemand met wie ik heb gewerkt',
    contactBody: 'Hoor je het liever eerst van iemand anders: de mensen op de referentiepagina zaten op deze opdrachten, en elk linkt naar hun profiel. Wil je iemand spreken, vraag het me en ik breng jullie in contact.',
    contactCta: 'Referenties',
  },
  training: {
    title: 'Training',
    lede: 'AI-training voor architectuur- en productteams, gegeven door iemand die zelf bouwt.',
    body: `De meeste AI-training wordt gegeven door mensen die nooit een agentisch systeem in productie hebben gebracht. Ik wel, en ik leer teams AI aan te sturen zoals een senior engineer dat doet: specs schrijven die een agent kan uitvoeren, beoordelen wat eruit komt, en echte capaciteit van hype onderscheiden.

Het volledige programma (twee niveaus, een aanbodladder en een uitleg van de EU AI Act in gewone taal) wordt nu gebouwd en gevalideerd met echte teams. Ik krijg het liever goed met een paar pilots dan dat ik een brochure publiceer.

Klinkt dat nuttig voor je team? Boek dan een korte proefsessie.`,
    ctaHeading: 'Boek een proefsessie',
    ctaBody: 'Een korte sessie voor je team, vrijblijvend. Vertel je context, dan stem ik het af.',
    cta: 'Boek een proefsessie',
  },
  indexes: {
    expertiseTitle: 'Expertise',
    expertiseLede: 'Hoe ik een architectuur besloten en gedragen krijg, en wat ik bouw zodra dat rond is.',
    expertiseGroups: {
      domain: {
        heading: 'Wat ik bouw',
        lede: 'De vijf gebieden waarin ik werk, in de volgorde waarin ik er meestal voor gevraagd word.',
      },
      practice: {
        heading: 'Hoe ik werk',
        lede: 'Het deel van het architectenvak dat niet het diagram is: beslissen, vastleggen, en mensen die elders rapporteren meekrijgen.',
      },
    },
    workTitle: 'Geselecteerd werk',
    workLede: 'Vijf klantopdrachten, met cijfers. Klanten zijn geabstraheerd waar vertrouwelijkheid dat vereist; de cijfers zijn zoals geleverd. Bij elke opdracht staat de onenigheid die hij moest overleven, want die bepaalde meestal of hij er kwam.',
    workHonesty: 'Dit zijn de opdrachten die ik nauwkeurig kan beschrijven en onder doorvragen kan verdedigen, inclusief wat elke opdracht kostte voor de teams waar hij landde. Zelfgebouwde demo\'s staan op de portfolio, gelabeld als demo.',
    disagreementLabel: 'De onenigheid',
    evidenceLabel: 'Aangetoond door',
    portfolioLabel: 'Portfolio',
    writingTitle: 'Blog',
    writingLede: 'Af en toe een stuk over architectuurbeslissingen, de economie van software bouwen, en het aansturen van AI in echt werk. Geen nieuwsbrief.',
    readMore: 'Lees meer',
    backToIndex: { expertise: 'Alle expertise', work: 'Al het werk', writing: 'Alle blogs' },
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, nl };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
