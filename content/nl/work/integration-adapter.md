---
title: Integratie-adapter: een interface via configuratie
summary: Een platformproduct waarmee teams zelf twee applicaties verbinden. Het team schrijft configuratie, en het platform draait de integratie.
intro: Een platformproduct waarmee teams zelf twee applicaties verbinden. Het team schrijft configuratie, en het platform draait de integratie.
small: Een grote Nederlandse supermarktketen, sinds oktober 2024. Klant niet genoemd. Twee minuten lezen.
facts: [Binnen één werkdag | tot een nieuwe interface live is, De helft van de tijd | om een integratie uit te rollen, 2–3 keer lager | kosten van een integratie, 100+ per seconde | berichten in de belastingtest]
role: De eerste versie ontworpen en gebouwd. Tech lead van het team dat het nu uitbreidt.
client: Een grote Nederlandse supermarktketen
built_with: AWS Lambda, SNS/SQS, S3, DynamoDB, JSONata, Terraform, Datadog
order: 2
large: Binnen één werkdag
listed: Dezelfde supermarktketen. Teams maken via configuratie een integratie tussen applicaties aan, op een lichte serverless stack.
stands: de eerste adapters draaien in productie en meerdere teams gebruiken het. De migratie van een paar honderd interfaces van de IBM-middleware loopt.
next: cloud-gateway
next_label: Volgende: Cloud gateway
---

## Waar het begon

De IBM-middleware had een paar honderd interfaces. Het doel was om verouderde, leverancierspecifieke oplossingen te migreren naar cloud-native platformproducten.

## Wat ik deed

Ik heb de eerste versie van de adapter ontworpen en gebouwd. Teams maken er via configuratie integraties tussen applicaties mee aan. Het is dus een declaratief self-service platformproduct.

Het gebruikt een lichte stack: cloud-native, serverless, en vooral gebaseerd op transformatie van JSON-data. Het ondersteunt REST, S3, events en SOAP.

Bij beide producten was het doel hetzelfde. Ten eerste de complexiteit eronder eenvoudiger maken. Ten tweede zorgen voor goede beveiliging en standaardisatie over de hele linie.

## Wat het opleverde

Vergeleken met infrastructuur die teams zelf uitrolden, zonder platformproduct erachter, halveerde de tijd om een integratie uit te rollen en gingen de kosten 2 tot 3 keer omlaag.

De belastingtest hield meer dan 100 berichten per seconde vol.

## Waar het staat

De eerste adapters draaien in productie. De migratie van de interfaces loopt. Het moeilijkste is om teams op het platform te laten vertrouwen.

Waarom ik het eenvoudig hield: lees [‘Eerst eenvoudig’](/nl/practice/articles/simple-first)
