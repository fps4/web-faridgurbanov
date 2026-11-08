---
id: P-05
order: 5
title: "Benoemde uitgangen"
summary: "Som elke uitgang voor data op, ook modellen, assistenten en agents, elk met een controle en een eigenaar."
status: current
revised: 2026-11-08
related: [practice/articles/export-control-who-sees-what, P-03]
topics: [governance, ai]
tech: [fabric]
---

## Probleem

Toegangsbeheer beschrijft de voordeur: wie een tabel mag lezen. Data verlaat het landschap ook via
deuren die niemand heeft opgeschreven, zoals een bestandsexport, notebook-uitvoer, een share, een
back-up, ondersteuning door de leverancier of de logs. Met AI in het landschap komen er nieuwe
deuren bij, en die zie je makkelijk over het hoofd.

## Krachten

- Platforms voegen uitgangen toe met nieuwe features, vaak aangezet via tenant-instellingen ver weg
  van het datateam.
- Een model dat op gecontroleerde data is getraind, bevat die data, en zijn serving endpoint is een
  uitgang.
- Een assistent stuurt data als promptcontext naar een model, dat die mogelijk in een andere regio
  verwerkt.
- Een agent die als tool of als MCP-server is gepubliceerd, beantwoordt vragen van mensen buiten de
  grens.
- Sommige uitgangen zijn helemaal niet te controleren, en iemand moet ze accepteren.

## Oplossing

Som de uitgangen per platform op, en geef elk een naam, een controle en een eigenaar:

- bestandsexports en notebook-uitvoer;
- shares, shortcuts en replica's;
- back-ups en kopieën voor disaster recovery;
- toegang voor leveranciersondersteuning, en logs;
- modellen, vastgelegd als assets met hun trainingsdata als ouders, en hun endpoints;
- assistenten, met de tenant-instellingen die bepalen waar prompts worden verwerkt;
- agents, behandeld als shares, die alleen gedeclassificeerde producten bevatten.

De uitgangen die niemand kan controleren, gaan in het register, elk met een persoon met naam die
haar accepteert. Elk verzoek wordt getoetst aan de uitgang en aan het asset. Zo mag dezelfde
persoon, met dezelfde data en hetzelfde doel, wel lezen en toch een export geweigerd krijgen.

## Gevolgen

- Eén beleid kan per platform een ander antwoord geven, en beide kloppen. Waar een bestand bij
  export zijn label houdt, mag de export. Waar het zonder label zou vertrekken, weigert het beleid
  de export en wijst het naar een share.
- In het lab voor exportcontrole zou het aanzetten van de assistentinstellingen voor andere regio's
  op één platform 36.000 rijen gecontroleerde telemetrie als promptcontext de regio uit hebben
  gestuurd. Het beleid weigert dat, en het platform had het toegestaan.
- De lijst moet opnieuw worden bekeken zodra een platform een feature uitbrengt die data verplaatst.
- Geaccepteerde uitgangen blijven zichtbaar, dus een audit vindt een beslissing met een naam erbij.

## Wanneer niet

- Openbare of synthetische data, zonder beperking op waar die heen gaat.
- Een vroeg prototype op niet-productiedata, mits de lijst er is voordat er echte data binnenkomt.
