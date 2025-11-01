---
title: Télémétrie Comportementale Unifiée
subtitle: Collecte, curation et analyse centralisées des événements en streaming sur le web, mobile et appareils.
---

Statut : Développement actif (MVP en cours). Cette page reflète le plan actuel, la portée du MVP et les objectifs ; certains éléments sont en cours.

### Aperçu du Projet
La Télémétrie Comportementale Unifiée (UBT) est un plan directeur ouvert et structuré pour les pipelines de données comportementales. Elle unifie l'ingestion, l'enrichissement, le stockage et la visualisation sur le web, mobile et IoT—conçue pour être prête pour l'IA et rentable dès le premier jour. Un déploiement prend en charge plusieurs "espaces" indépendants (par exemple, flux de clics, IoT, retour d'information ML) avec une infrastructure partagée mais des schémas, accès et tableaux de bord isolés. Pile de base : collecteurs et services Node.js, Kafka + Registre de Schéma (+ DLQ), ClickHouse pour les agrégats en temps réel, et Grafana pour la visualisation. Le coût cible de l'infrastructure est de moins de 4 $ par million d'événements avec une latence d'ingestion au tableau de bord inférieure à 2 minutes.

### Contexte du Problème
Les équipes reconstruisent à plusieurs reprises la télémétrie pour les applications et appareils, se retrouvant avec des outils fragmentés, des contrats d'événements incohérents, une dépendance aux fournisseurs et des coûts croissants. Pire encore, les données ne sont souvent pas prêtes pour l'IA—enfermées dans des produits, sous-modélisées, ou trop lentes/coûteuses à utiliser pour la synthèse et les notes d'anomalie. L'UBT aborde cela avec des composants ouverts, des contrats cohérents, une isolation des espaces et des modèles organisés qui rendent les données comportementales prêtes pour les tableaux de bord et les cas d'utilisation de l'IA.

### Défis Techniques Clés
- Instrumentation cohérente (JS/mobile/firmware) avec des schémas versionnés, validés et des vérifications CI.
- Isolation et gouvernance des espaces : espaces de noms, ACLs, rétention, quotas et périmètre des tableaux de bord.
- Authentification de courte durée (ES256/RS256 JWT) avec des clés par espace et des protections simples en périphérie.
- Agrégats en moins de 2 minutes à coût prévisible ; workflows de relecture et DLQ sûrs à exploiter.
- Minimisation/masquage des PII, traçabilité et auditabilité sans lourde charge opérationnelle.
- Pistes interopérables : Docker DIY et une option native AWS tout en gardant les schémas et tableaux de bord partagés.

### Architecture de la Solution
Pipeline piloté par les événements avec des paramètres par défaut structurés (schémas, nommage des topics, vues matérialisées, tableaux de bord) et fichiers de configuration au niveau des espaces (`/config/<space>.space.json`). Les collecteurs regroupent les événements vers une API derrière un edge ; l'API valide les jetons de courte durée et publie sur les topics Kafka par espace avec application du Registre de Schéma et DLQs. Un service Runner exécute l'enrichissement (masquage des PII, jonctions géo/appareil), l'écriture de stockage (insertions ClickHouse avec partitionnement/TTL) et le Narrateur IA (résumés hebdomadaires/briefs vocaux). Les tableaux de bord Grafana reposent sur des vues ClickHouse organisées ; les points de terminaison de relecture/exportation prennent en charge l'analyse ad hoc et les remplissages.

![Diagramme de Contexte du Système](/structurizr/structurizr-3-SystemContext-001.png)

### Points Forts de la Technologie (Prévu/Alpha)
- Kit d'instrumentation : directives JS/mobile + modèle d'événement firmware ; contrats de schéma + validation.
- Service API + collecteurs avec regroupement, contre-pression et authentification JWT de courte durée (par espace).
- Infrastructure Kafka avec Registre de Schéma, conventions de topics, DLQ et outils de relecture.
- Jobs Runner : enrichissement (masquage des PII, jonctions géo/appareil), écriture de stockage (ClickHouse), Narrateur IA.
- Vues matérialisées ClickHouse pour les sessions, entonnoirs, cohortes de rétention et santé des appareils.
- Packs de tableaux de bord Grafana avec alertes ; vues organisées ciblant une latence de panneau <5s.
- Modules IaC pour DIY (Docker/Terraform) et pistes natives AWS ; schémas/tableaux de bord partagés entre les deux.
- Gouvernance : isolation des espaces, ACLs, rétention, journaux d'audit et portes de compatibilité des schémas dans CI.

### Résultats Cibles
- Premiers tableaux de bord utiles dans les deux semaines suivant le lancement (espaces flux de clics et IoT).
- Ingestion-au-tableau de bord p50 < 2 minutes pour les principaux agrégats.
- Coût de l'infrastructure de base inférieur à 4 $ par million d'événements (stockage + calcul), avec des conseils de réglage.
- >95% d'événements validés par schéma ; playbooks clairs pour DLQ/relecture et vérifications de compatibilité CI.
- Isolation des espaces par défaut : espaces de noms, ACLs, rétention et tableaux de bord par espace.
- Narrateur IA "Brief Exécutif" disponible chaque semaine (texte + note vocale optionnelle) par partie prenante.

### Portée du MVP (Phase‑1)
- Un déploiement desservant plusieurs espaces (flux de clics, IoT, retour d'information ML).
- Authentification JWT de courte durée par espace (ES256/RS256) + JWKS ; protections en périphérie.
- Kafka + Registre de Schéma + DLQ ; stockage ClickHouse avec partitionnement/TTL ; tableaux de bord Grafana.
- Paramètres par défaut structurés : nommage des topics, schémas, vues matérialisées, tableaux de bord et modèles d'alerte.
- Points de terminaison d'exportation/relecture ; runbooks de remplissage ; vérifications CI pour la compatibilité des schémas.

### Indicateurs Clés de Performance & Mesure
- Latence (ingestion → tableau de bord) : p50/p95.
- Coût par million d'événements (proxy infra) ; part de dépense fournisseur en baisse.
- Taux de réussite de la validation des schémas ; taux de DLQ ; succès de la relecture.
- Disponibilité du pipeline (ingestion + stockage) et performance des requêtes.
- Prêt pour l'IA et utilisation : adoption du Narrateur et précision des résumés.