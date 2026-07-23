---
title: Retail dynamic pricing — één lakehouse, twee prijsstrategieën
summary: Een draaibare demo van een dynamic-pricing-platform voor retail op een Databricks-lakehouse — één elasticiteit-naar-optimalisatie-engine die twee verticals bedient, grocery en consumentenelektronica, die verschillen in hun prijswetenschap maar de pipeline delen. End-to-end notebooks, synthetische data, +6,4% omzet bij gelijke marge.
hook: Eén prijs-engine, twee retail-verticals — grocery en elektronica — op een Databricks-lakehouse.
metric: 2 verticals · 1 lakehouse
order: 6
---

# Retail dynamic pricing — één lakehouse, twee prijsstrategieën

Dit is toegepaste prijswetenschap voor retail: een **dynamic-pricing-platform**
dat verkoophistorie omzet in vraagelasticiteiten, schapprijzen optimaliseert
onder echte bedrijfsbeperkingen, en elke prijswijziging uitlegt. Eén engine,
twee verticals die verschillen in *wat* ze optimaliseren, niet in *hoe* het is
opgebouwd — alles draaibaar op een laptop en gebouwd om ongewijzigd op te schalen
naar een **Databricks-lakehouse**.

## De twee verticals

Het interessante aan retail-pricing is dat de wetenschap echt verschilt per
categorie — dus bouwde ik één kern en richtte die op twee sets beperkingen:

- **Grocery — *elasticiteit & afprijzing*.** Veel SKU's, dunne marges,
  bederfelijkheid. De hefbomen zijn vraag-**elasticiteit**, **KVI-prijsimago**
  (de known-value items waarop klanten je afrekenen), de categorie-**prijsladder**
  (private label < A-merk < premium), en **houdbaarheidsgedreven afprijzing** om
  waarde terug te winnen vóór afschrijving.
- **Elektronica — *competitieve & lifecycle-pricing*.** Minder SKU's, hoge
  ticketwaarde, meedogenloze online prijstransparantie. De hefbomen zijn
  **prijsmatching met concurrenten**, **MAP-compliance** (de Minimum Advertised
  Price van de fabrikant is een harde ondergrens), **lifecycle-afprijzing**
  (vasthouden bij lancering, uitverkopen aan het einde van de levensduur), en
  **attach-economie** (de marge op accessoires/garantie die de unit-marge
  misleidend maakt).

## Wat ik bouwde

Een gedeelde, solver-agnostische engine — **genereer → schat elasticiteit →
optimaliseer → prijs af → leg uit** — met twee end-to-end notebooks, één per
vertical:

- Een **vraagmodel** dat eigen-prijselasticiteiten per SKU schat (log-log met
  store-cluster / kanaal fixed effects in de demo; LightGBM/GPBoost met
  monotoniciteitsbeperkingen in productie). De notebooks toetsen de geschatte
  elasticiteiten aan een *bekende grondwaarheid* die in de synthetische data is
  ingebouwd.
- Een **omzetoptimalisator** over een niet-lineaire doelfunctie (prijs × vraag)
  met de beperkingen die een categorymanager daadwerkelijk afdwingt —
  kostprijsondergrens, prijsplafond, margevloer, prijsladder, MAP-vloer,
  max-wijziging. Hij is **solver-agnostisch**: standaard SciPy/SLSQP zodat
  iedereen het kan draaien, met een **Gurobi**-MIQP-backend voor de volledige
  max-N-wijzigingen-cardinaliteitsbeperking, met een nette terugval.
- Een **Databricks-lakehouse**-mapping: Delta Live Tables voor
  bronze→silver→gold, MLflow voor het elasticiteitsmodel, een Workflow die
  ingest → train → optimaliseer → publiceer aan elkaar knoopt, en een
  Mosaic-AI-agentlaag die natuurlijke-taal-prijsbeleid omzet in beperkingen en
  per rol een onderbouwing rendert voor elke prijs.

## Het eerlijke deel

Het draait allemaal in seconden op een laptop omdat het traint en optimaliseert
op **synthetische maar plausibele** data — een geseed datageneratieproces met een
bekende elasticiteit per SKU, zodat herstel toetsbaar is en het geheel
reproduceerbaar. Dat is een bewuste keuze, en de repo is daar overal expliciet
over. De economie klopt in *richting en vorm*: grocery levert **+6,4% omzet bij
gelijke marge** met de melk-prijsladder intact; elektronica beweegt slechts
**~+1%** omdat MAP-vloeren en krappe plafonds echt weinig ruimte laten —
meerdere SKU's willen omlaag maar zitten vast op de MAP-vloer, wat zelf het
realistische compliance-signaal is. De Databricks-pipelines zijn
referentie-implementaties; het laptop-pad zijn de notebooks. Elk bestand trekt de
grens tussen demo en productie.

## Het patroon erachter

![Diagram: twee sets beperkingen — grocery (KVI, prijsladder, houdbaarheidsafprijzing) en elektronica (MAP-vloer, lifecycle, prijsmatching) — configureren één gedeelde engine (schat elasticiteit, optimaliseer, leg uit) die prijzen plus onderbouwing oplevert. Beperkingen als data, geen forks.](/diagrams/dynamic-pricing-pattern.svg)

**Eén engine, beperkingen als data.** Het standaardlot van een pricingplatform dat twee verticals bedient is een fork — grocery en elektronica krijgen elk "hun" engine, en binnen een jaar zijn het twee producten die een logo delen. Hier is het verschil tussen de verticals volledig uitgedrukt als sets beperkingen over één solver-agnostische kern: KVI-prijsimago en houdbaarheidsafprijzing voor grocery, MAP-vloeren en lifecyclecurves voor elektronica. De engine weet niet welke retail hij prijst.

Twee beslissingen dragen het patroon:

- **De set beperkingen is het productoppervlak.** De regels van een categorymanager — kostprijsondergrens, ladder, MAP, max-wijziging — komen binnen als gedeclareerde beperkingen, niet als code-vertakkingen. Daar bouwt ook de Mosaic-AI-agentlaag op: natuurlijke-taal-beleid compileert naar beperkingen, juist omdat beperkingen data zijn.
- **Toets de wetenschap, niet alleen de code.** In de synthetische data is een bekende elasticiteit per SKU ingebouwd, zodat de notebooks kunnen controleren dat het model *de waarheid terugvindt* — een ground-truth-harnas dat de meeste pricingstacks nooit hebben.

De trade-off om vooraf te kennen: generiek blijven is een discipline waarvoor je moet blijven betalen. De derde vertical komt met "slechts één uitzondering" die in de engine wil wonen — zodra dat gebeurt, ben je terug bij een fork met extra stappen. Nee zeggen is deel van de architectuur.

## Waarom het ertoe doet

Het toont de volledige boog op één plek: de **datawetenschap** die prijshistorie
omzet in een verdedigbare elasticiteit, de **operations research** die
elasticiteiten en bedrijfsregels omzet in prijzen, en de **lakehouse- +
agentarchitectuur** die het daadwerkelijk bij een retailer zou draaien — niet
slechts één stukje.

→ Bekijk de [repository](https://github.com/fps4/retail-dynamic-pricing) —
draaibare notebooks voor beide verticals.

→ Zie ook [Data & lakehouse](/nl/expertise/data-and-lakehouse) en
[AI & automatisering](/nl/expertise/ai-and-automation).
