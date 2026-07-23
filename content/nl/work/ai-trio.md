---
title: De AI-trio — govern, build, deliver
summary: Drie verwante repositories verteld als één verhaal — govern de modellen, bouw een betrouwbaar agentic product, lever software met agents. Het bewijs dat ik AI bouw en er niet alleen over adviseer.
hook: Eén govern→build→deliver-verhaal over drie repositories.
metric: govern → build → deliver
order: 4
---

# De AI-trio — govern, build, deliver

Dit is het bewijs achter de [AI & automatisering](/nl/expertise/ai-and-automation)-positionering: geen slideware, maar werkende code en referentiearchitecturen die je kunt lezen. Drie verwante repositories vormen één samenhangende stack.

## Het verhaal

- **Govern & route — `sovereign-llm-gateway`.** Een LLM-gateway met kosten- en budgethandhaving per agent, vendor abstraction, een local-model fallback voor soevereiniteit, en Prometheus-observability. **Deze draait end-to-end** (`docker compose up`).
- **Build — `sovereign-copilot`.** Een referentiearchitectuur voor een betrouwbaar agentic product: deterministische tool-contracten (MCP), retrieval gegrond in jouw data, L1–L4 evaluatiegates met goldens, en antwoorden die te herleiden zijn naar een vastgelegde call chain.
- **Deliver — `maestro` (MIT).** Een referentiearchitectuur voor spec-driven delivery: agents stellen voor, mensen beslissen, met functionele en technische gates afgedwongen via GitHub branch protection.

## Het eerlijke deel

Eén hiervan draait vandaag end-to-end; de andere twee zijn **referentiearchitecturen**. Het zijn **geen** drie productiesystemen, en ik zal ze niet als zodanig presenteren. Die eerlijkheid is juist het punt — het is dezelfde discipline die ik meebreng naar het AI-programma van een klant.

## Het patroon erachter

![Diagram: drie stappen — govern (sovereign-llm-gateway: budgetten, vendor abstraction, soevereine fallback), build (sovereign-copilot: tool-contracten, retrieval, evaluatiegates L1–L4), deliver (maestro: agents stellen voor, mensen beslissen). Vertrouwen leeft in het platform, niet in vergaderingen.](/diagrams/ai-trio-pattern.svg)

**Scheiding der machten, toegepast op AI.** De standaardvorm van een "AI-platform"-initiatief is één project dat modeltoegang, productlogica en delivery-automatisering vermengt — waardoor niets onafhankelijk te governen, te evalueren of te vervangen is. De trio splitst het langs de lijnen die daadwerkelijk in verschillend tempo bewegen: modellen wisselen maandelijks, producten per kwartaal, delivery-praktijk per jaar.

Twee beslissingen dragen het patroon:

- **Govern op het knooppunt, niet in een beleidsdocument.** Budgetten, vendor abstraction en de soevereiniteitsfallback leven in de gateway — de ene plek waar elke modelcall doorheen gaat. Governance die je kunt `docker compose up`-en verslaat governance die je rondstuurt als PDF.
- **Evaluatiegates zijn de schema registry van AI.** L1–L4-gates met goldens doen voor agentgedrag wat schema-compatibiliteitsregels deden voor Kafka-producers [in de Cloudera-casestudy](/nl/work/cloudera-kafka): ze verplaatsen vertrouwen van reviewvergaderingen naar het platform, zodat verandering snel én veilig kan zijn.

Het eerlijke deel hierboven blijft gelden — één van de drie draait end-to-end, twee zijn referentiearchitecturen. Het patroon is de claim; de labels zeggen hoeveel ervan bewezen is.

## Waarom het ertoe doet

Samen brengen ze in kaart hoe ik AI-delivery echt aanpak: govern de modellen, bouw daarbovenop een product dat je kunt vertrouwen, en lever software met agents onder menselijke controle.

→ Zie de repositories op de [portfolio](/nl/portfolio) (links openen zodra de public-surface-randvoorwaarden zijn afgerond).
