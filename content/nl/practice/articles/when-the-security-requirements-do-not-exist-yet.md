---
title: Als de beveiligingseisen nog niet bestaan
summary: Bij een Britse telecomoperator was het interessant, omdat de beveiligingseisen voor zo'n platform op dat moment niet waren vastgelegd.
date: 2026-11-22
order: 2
read: Drie minuten lezen
from: [Een security data lake voor een Britse telecomoperator | /en/work#earlier-security-data-lake]
---

Bij een Britse telecomoperator was het interessant, omdat de beveiligingseisen voor zo'n platform op dat moment niet waren vastgelegd.

Het vorige platform draaide op Cisco-hardware die aan het einde van zijn levensduur was en vervangen moest worden. Ik ontwierp een oplossing op basis van Kafka als vervanging van hun stroom van beveiligingslogs, en we deden een proof of concept. Voor hen was het een nieuw initiatief. Ze waren gewend te werken met apparatuur van leveranciers, en te vertrouwen op wat andere grote organisaties gebruiken. Ze zagen ook dat de trend naar oplossingen op basis van Kafka gaat, en dat het hun SOC beter zou maken. Maar dit platform zit in de kern van hun beveiliging, dus ze hadden geen haast. Het moet goed doordacht zijn.

Kort nadat ik met het hoofd beveiliging had gesproken, kwam het besef: de beveiligingseisen van hun kant moeten eerst worden vastgelegd, zodat wij er vanuit Accenture op kunnen antwoorden. Dat duurde een paar weken.

Tegelijk liep er een spoor met servicemanagement, om te begrijpen hoe de bestaande processen zouden veranderen voor het SOC en het NOC. Dat zijn interne teams van de operator. Het operationele beheer van het platform zou bij ons offshore team komen, en het was ook belangrijk om hen vroeg te betrekken, omdat de totale kosten van de oplossing zo laag mogelijk moesten blijven. Het team ter plaatse, waar ik bij hoorde, was er voor sturen, ontwerpen, prototypen, communiceren en afstemmen. Het eigenlijke bouwen en beheren bleef offshore.

Nadat we de beveiligingseisen hadden ontvangen, gingen we terug naar de oplossing en keken we naar elk onderdeel ervan, om te zien hoe we de operator zekerheid konden geven. Eén uitdaging was dat Apache Kafka gebouwd is op een aantal open-sourcebibliotheken, en die worden door een community onderhouden. Dat vergroot het risico op een aanval via de toeleveringsketen, en het beveiligingsteam maakte zich daar behoorlijk zorgen over. Er was geen andere oplossing dan een echte leverancier achter de oplossing. Daar kwam Cloudera in beeld, met hun contract voor ondersteuning.

Het liep goed af. Beveiliging gaf akkoord. Daarna volgde het in beheer nemen, waar ik niet nauw bij betrokken was, maar waarover ik wel werd geraadpleegd. Dat duurde nog een jaar.

Als ik dit project opnieuw zou beginnen, zou ik als eerste vragen om de formele eisen van alle belanghebbenden, vanaf het allereerste begin: beveiliging, servicemanagement, en misschien compliance en risico. Als die eenmaal op papier staan, is het heel eenvoudig om ze te koppelen aan de oplossingen en ontwerpen die je in gedachten hebt.
