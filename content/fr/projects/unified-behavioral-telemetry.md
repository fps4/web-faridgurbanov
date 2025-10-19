---
title: Télémétrie Comportementale Unifiée
subtitle: Collecte, curation et analyse d'événements en streaming centralisée sur le web, mobile et appareils.
---

Statut : Développement actif (MVP en cours). Cette page reflète le plan actuel, le périmètre du MVP et les objectifs ; certains éléments sont en cours.

### Aperçu du Projet
La Télémétrie Comportementale Unifiée (UBT) est un plan ouvert et orienté pour les pipelines de données comportementales. Elle unifie l'ingestion, l'enrichissement, le stockage et la visualisation sur le web, le mobile et l'IoT—conçue pour être prête pour l'IA et rentable dès le premier jour. Un déploiement prend en charge plusieurs "espaces" indépendants (par exemple, flux de clics, IoT, retour d'information ML) avec une infrastructure partagée mais des schémas, accès et tableaux de bord isolés. Pile de base : collecteurs et services Node.js, Kafka + Registre de Schémas (+ DLQ), ClickHouse pour les agrégats en temps réel, et Grafana pour la visualisation. Le coût cible de l'infrastructure est de <4 $ par 1M d'événements avec une latence d'ingestion à tableau de bord inférieure à 2 minutes.

### Contexte du Problème
Les équipes reconstruisent à plusieurs reprises la télémétrie pour les applications et les appareils, se retrouvant avec des outils fragmentés, des contrats d'événements incohérents, un verrouillage des fournisseurs et des coûts croissants. Pire encore, les données ne sont souvent pas prêtes pour l'IA—enfermées dans des produits, sous-modélisées ou trop lentes/coûteuses à utiliser pour la synthèse et les notes d'anomalies. UBT aborde cela avec des composants ouverts, des contrats cohérents, une isolation des espaces et des modèles organisés qui rendent les données comportementales prêtes pour les tableaux de bord et les cas d'utilisation de l'IA.

### Défis Techniques Clés
- Instrumentation cohérente (JS/mobile/firmware) avec des schémas versionnés, validés et des vérifications CI.
- Isolation et gouvernance des espaces : espaces de noms, ACLs, rétention, quotas et ciblage des tableaux de bord.
- Authentification de courte durée (JWT ES256/RS256) avec des clés par espace et des protections simples en périphérie.
- Agrégats de moins de 2 minutes à coût prévisible ; workflows de relecture et DLQ sûrs à opérer.
- Minimisation/masquage des PII, traçabilité et auditabilité sans lourde charge opérationnelle.
- Pistes interopérables : Docker DIY et une option native AWS tout en gardant les schémas et tableaux de bord partagés.

### Architecture de la Solution
Pipeline événementiel avec des valeurs par défaut orientées (schémas, nommage des sujets, vues matérialisées, tableaux de bord) et fichiers de configuration au niveau de l'espace (`/config/<space>.space.json`). Les collecteurs regroupent les événements vers une API derrière une périphérie ; l'API valide les jetons de courte durée et publie sur des sujets Kafka par espace avec application du Registre de Schémas et DLQs. Un service Runner exécute l'enrichissement (masquage PII, jonctions géo/appareil), l'écrivain de stockage (insertions ClickHouse avec partitionnement/TTL), et le Narrateur IA (résumés hebdomadaires/briefs vocaux). Les tableaux de bord Grafana reposent sur des vues ClickHouse organisées ; les points de terminaison de relecture/exportation prennent en charge l'analyse ad hoc et les remplissages rétroactifs.

```mermaid
---
title: Diagramme de Contexte
config:
  theme: forest
  look: handDrawn
---
flowchart TB

  subgraph CL[Clients]
    Web[SDK Web]
    Mobile[SDK Mobile]
    Device[Événements Firmware/IoT]
  end

  subgraph UBT[Télémétrie Comportementale Unifiée]
    API[Service API (ingestion, exportation/relecture)]
    Broker[Kafka + Registre de Schémas + DLQ]
    Runner[Jobs Runner : Enrichir, Écrivain, Narrateur]
    Store[ClickHouse (vues + TTL)]
    Dash[Tableaux de Bord Grafana + Alertes]
    Config[Configuration & Gouvernance des Espaces]
  end

  Web --> API
  Mobile --> API
  Device --> API
  API --> Broker
  Broker --> Runner
  Runner --> Store
  Store --> Dash
  Config -. contrats .- API
  Config -. contrats .- Runner
  Config -. budgets/ops .- Broker
  Config -. budgets/ops .- Dash
```

### Points Forts de la Technologie (Prévu/Alpha)
- Kit d'instrumentation : conseils JS/mobile + modèle d'événement firmware ; contrats de schéma + validation.
- Service API + collecteurs avec regroupement, contre-pression et authentification JWT de courte durée (par espace).
- Épine dorsale Kafka avec Registre de Schémas, conventions de sujets, DLQ et outils de relecture.
- Jobs Runner : enrichissement (masquage PII, jonctions géo/appareil), écrivain de stockage (ClickHouse), Narrateur IA.
- Vues matérialisées ClickHouse pour les sessions, entonnoirs, cohortes de rétention et santé des appareils.
- Packs de tableaux de bord Grafana avec alertes ; vues organisées ciblant une latence de panneau <5s.
- Modules IaC pour les pistes DIY (Docker/Terraform) et natives AWS ; schémas/tableaux de bord partagés sur les deux.
- Gouvernance : isolation des espaces, ACLs, rétention, journaux d'audit et portes de compatibilité des schémas dans CI.

### Objectifs Cibles
- Premiers tableaux de bord utiles dans les deux semaines suivant le lancement (espaces flux de clics et IoT).
- Ingestion à tableau de bord p50 < 2 minutes pour les principaux agrégats.
- Coût de base de l'infrastructure inférieur à 4 $ par 1M d'événements (stockage + calcul), avec des conseils d'optimisation.
- >95% d'événements validés par schéma ; manuels de jeu DLQ/relecture clairs et vérifications de compatibilité CI.
- Isolation des espaces par défaut : espaces de noms, ACLs, rétention et tableaux de bord par espace.
- Narrateur IA "Brief Exécutif" disponible chaque semaine (texte + note vocale optionnelle) par intervenant.

### Périmètre du MVP (Phase‑1)
- Un déploiement desservant plusieurs espaces (flux de clics, IoT, retour d'information ML).
- Authentification JWT de courte durée par espace (ES256/RS256) + JWKS ; protections en périphérie.
- Kafka + Registre de Schémas + DLQ ; stockage ClickHouse avec partitionnement/TTL ; tableaux de bord Grafana.
- Valeurs par défaut orientées : nommage des sujets, schémas, vues matérialisées, tableaux de bord et modèles d'alerte.
- Points de terminaison d'exportation/relecture ; manuels de remplissage rétroactif ; vérifications CI pour la compatibilité des schémas.

### Indicateurs Clés de Performance & Mesure
- Latence (ingestion → tableau de bord) : p50/p95.
- Coût par 1M d'événements (proxy infra) ; tendance à la baisse des dépenses fournisseurs.
- Taux de réussite de la validation des schémas ; taux DLQ ; succès de la relecture.
- Disponibilité du pipeline (ingestion + stockage) et performance des requêtes.
- Prêt pour l'IA et utilisation : adoption du Narrateur et précision des résumés.