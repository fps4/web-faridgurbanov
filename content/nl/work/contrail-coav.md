---
title: Contrail-avoidance — segmenteer de pixels, beslis de omleiding
summary: Twee doelbouwde, draaiende demo's voor het Contrail Avoidance (COAV)-werk van EUROCONTROL — een neuraal-netwerk-segmentatie-app die contrails in sky-camera-beelden vindt, en een data-science-pipeline die bepaalt welke vluchten worden omgeleid en tegen welke afweging van klimaat versus brandstof.
hook: Twee draaiende demo's — segmenteer de contrails, beslis dan de omleiding.
metric: detecteren → beslissen
order: 5
---

# Contrail-avoidance — segmenteer de pixels, beslis de omleiding

Dit is toegepaste ML voor een echt domein: het contrail-klimaatprobleem in de luchtvaart, zoals EUROCONTROL het kadert in zijn **Contrail Avoidance (COAV)**-werk vanuit Maastricht. Twee repositories, gebouwd om de twee helften van dat probleem te spiegelen — beide draaibaar, beide eerlijk afgebakend.

## De twee helften

- **Detecteren — `contrail-segmentation-demo`.** Een neuraal-netwerk-**beeldsegmentatie**-app: React + TypeScript-frontend → Node.js (Express) BFF → Python FastAPI-service → een zelfgeschreven **PyTorch U-Net**. Kies of upload een luchtbeeld; het geeft het contrail-masker terug, de dekking in %, en het aantal afzonderlijke contrails. Drie services die opkomen met `docker compose up`, met CI op GitHub Actions. Dit spiegelt COAV's Sky Cam Vision™ / Sky InSight™ → ML-detectie-pipeline.
- **Beslissen — `contrail-avoidance-pipeline`.** Een **Polars/Pandas**-pipeline plus een **Databricks-achtige notebook** die bepalen welke vluchten persistente, klimaatopwarmende contrails vormen — via het **Schmidt–Appleman-criterium** en **ijs-oververzadigde regio's (ISSR)** — en hoogtewijzigingen voorstellen, waarbij vermeden klimaatforcering (CO₂e) wordt afgewogen tegen extra brandstofverbruik. Dit spiegelt COAV's per-vlucht-avoidance-trials.

## Het eerlijke deel

Beide draaien end-to-end op een laptop, omdat beide trainen en draaien op **synthetische maar fysisch plausibele** data — een synthetische lucht-generator voor het segmentatiemodel, een geseede weather grid en vluchttracks voor de pipeline. Dat is een bewuste keuze zodat het geheel in minuten reproduceerbaar is, en elke README is daar expliciet over. De fysica (SAC ∩ ISSR) is echt en klopt in richting; de architectuur is degene die je daadwerkelijk zou draaien. Elke repo schrijft de grens tussen demo en productie op — echte GVCCS / Sky-Cam-beelden en instance-tracking aan de ene kant, ERA5-reanalyse + OpenSky-vluchtdata aan de andere.

## Het patroon erachter

![Diagram: twee helften gescheiden door een expliciete gestippelde naad — detecteren (U-Net-segmentatie: luchtpixels naar masker en dekkingspercentage) en beslissen (SAC ∩ ISSR-fysica: weer en tracks naar omleiding) — elke helft op zichzelf toetsbaar.](/diagrams/contrail-coav-pattern.svg)

**Perceptie en beslissing gesplitst op een expliciete naad.** De verleidelijke vorm is één end-to-end-model van camerapixels naar omleidingsadvies — indrukwekkend in een demo, onmogelijk te valideren: als het antwoord fout is, kun je niet zeggen of het fout zág of fout redeneerde. Hier is het probleem gesneden waar het domein het snijdt: een perceptiehelft die pixels omzet in een masker en een dekkingsgetal, en een beslissingshelft die weer en trajecten omzet in een omleiding — verbonden door een kleine, inspecteerbare interface.

Twee beslissingen dragen het patroon:

- **De naad is een toetsbaar artefact.** Een masker en een dekking in % zijn op zichzelf te scoren tegen ground truth; een omleiding is op zichzelf na te rekenen tegen de fysica (SAC ∩ ISSR). Elke helft verdient vertrouwen afzonderlijk — de enige manier waarop een veiligheidsnabij domein een van beide ooit accepteert.
- **Synthetische data als architectuurbeslissing, niet als sluiproute.** Trainen en draaien op synthetische maar fysisch plausibele data is wat de hele boog in minuten reproduceerbaar maakt op een laptop — en elke README trekt de exacte lijn waar echte GVCCS-beelden en ERA5/OpenSky-data die zouden vervangen.

De trade-off staat in het eerlijke deel hierboven: reproduceerbaarheid is gekocht ten koste van claims over real-world-validiteit — bewust, en op schrift.

## Waarom het ertoe doet

De twee demo's tonen de volledige boog van de functie op één plek: ik kan het **full-stack ML-product** bouwen dat camerapixels omzet in een contrail-meting, *én* de **data-science-beslissing** die weer en trajecten omzet in een omleiding met een verdedigbare afweging van klimaat versus brandstof — niet slechts het een of het ander.

→ Bekijk beide repositories in de [portfolio](/nl/portfolio) onder **Toegepaste ML & datawetenschap** — deze twee linken door.
