---
id: P-02
order: 2
title: "Beleidscompiler"
summary: "Schrijf het toegangsbeleid één keer als data; genereer per platform de controles, plus een lijst van wat het niet kan afdwingen."
status: current
revised: 2026-11-08
related: [practice/articles/one-policy-two-compilers, practice/articles/export-control-who-sees-what, P-03]
topics: [governance, data-platforms]
tech: [databricks, fabric]
---

<!-- NEEDS HUMAN REVIEW: machine-drafted Dutch of the EN entry (FS-0013). Remove this line once Farid has read it. -->

## Probleem

Hetzelfde toegangsbeleid moet op twee of meer platforms gelden, identiek en jarenlang, terwijl elk
platform elke maand wijzigingen uitbrengt. Wie het met de hand in twee beheerconsoles bijhoudt,
krijgt twee beleidsregels die ongemerkt uit elkaar groeien.

## Krachten

- Platforms dwingen in verschillende vormen af: het ene evalueert bij elke query een beleid op basis
  van tags, het andere kent rollen toe met statische rijfilters.
- Sommige controles kan een platform helemaal niet uitdrukken, en dat gat blijft onzichtbaar zolang
  elke console los wordt ingericht.
- Een auditor vraagt waarom iemand werd geweigerd, en verwacht een zin als antwoord.
- De eigenaars van het beleid kennen de grammatica van elk platform zelden.

## Oplossing

Leg het beleid als data vast in een repository: de taxonomie van controles, de regio's, de
principals en hun groepen, en een register van de beslissingen die een controle weghalen. Een engine
evalueert het eerst, los van welk platform ook. Hij propageert controles, valideert het register en
beantwoordt "mag deze persoon, vanaf hier, dit met dit asset doen", met de uitleg erbij.

Daarna leest per platform één compiler de geëvalueerde toestand en maakt de eigen artefacten van dat
platform: SQL-policies en tags voor het ene, roldefinities en labels voor het andere. Elke compiler
schrijft in dezelfde output ook op wat zijn platform niet kan afdwingen, in gewone tekst waar iemand
mee aan de slag kan. Een compiler weigert alles te genereren wat een overtreding permanent zou
maken, zoals een plek voor data die daar niet mag staan.

CI genereert de artefacten opnieuw en laat de commit falen als de gecommitte versies niet meer
overeenkomen.

## Gevolgen

- Een meningsverschil over beleid wordt een pull request op de config, en de output van elk platform
  wordt opnieuw gegenereerd, met het gevolg erbij.
- De verschillen tussen platforms komen terecht in een bestand dat ook iemand anders dan de auteur
  kan lezen. In het lab voor exportcontrole werden dezelfde zes beslissingen 22 tag-gestuurde
  policies in Unity Catalog en 20 statische rollen in Fabric.
- Een controle kan haar herkomst meenemen naar het platform, als een tag die de bron noemt waar ze
  vandaan komt.
- De compilers zijn code die onderhoud vraagt, en ze lopen achter op nieuwe platformfeatures.
- Gegenereerde output bewijst vormen die het platform accepteert. Toepassen op een echte tenant is
  een aparte test, en die is nodig.

## Wanneer niet

- Eén platform, en een beleid dat kort genoeg is om op één scherm te lezen: richt het direct in en
  exporteer het voor review.
- Toegang die elk uur verandert via een aanvraagproces, waar de eigen policy-service van het
  platform het leidende systeem is.
