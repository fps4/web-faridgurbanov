---
title: Frame the decision
summary: Fund one decision, not more seats. Find the decision where the prediction is the slow part, and price what today's process costs.
order: 1
---

*Everyone has a copilot. Nothing runs across the organization.* Two years in, AI spend is mostly
licences per person. There are many ideas and no owners, and the one ambitious team works on
something nobody outside it uses. Part 1 is the first step out of that: fund one decision, and leave
the seat count where it is.

## The idea

AI sells predictions, not decisions. That is the frame of *Prediction Machines* by Ajay Agrawal,
Joshua Gans and Avi Goldfarb. A decision needs three things: a **prediction** (the information you
are missing when you decide), **judgement** about what each outcome is worth, and an **action**
someone can take. AI makes the prediction cheaper. Judgement and the ability to act stay as expensive
as they were, so they become the scarce part.

Two things follow for a sponsor:

- **An opportunity is a decision where the prediction is the slow or expensive part.** "Use AI in
  claims" is a direction. "Decide on small claims the same day" is a decision.
- **The baseline is today's process, with its mistakes.** A model that is wrong 8% of the time is a
  good product if today's process is wrong 15% of the time and slower. It is a bad one if a simple rule
  is wrong 9% of the time and costs nothing.

## In the case

*Our running example: a mid-size non-life insurer. It is fictional, and its numbers are synthetic.*

A claims handler reads every small home-contents (inboedel) claim by hand. The insurer handles 80,000
property claims a year; 68,000 of them are small, up to €2,500, and each takes about 40 minutes at
the desk.

- **The decision:** pay, pay part, deny, or investigate.
- **The predictions it lacks:** *is it covered?* and *is it genuine?*
- **The action:** a payment, a letter, or a referral to the fraud desk or a loss adjuster.

Finding those two answers takes most of the forty minutes: the policy, the right version of its
conditions (polisvoorwaarden), the claim history. All of it is already in the systems. The prediction
is the slow part, and that makes this a candidate.

The desk makes mistakes too. In our example it pays about **€952,000 a year** in fraud and loses about
**€205,000** on valid claims it wrongly denies. On top of that come about **€2.5 million** in handling
and a median of **eight working days** to settle *(all synthetic)*. That is the bar the AI has to beat.

The head of claims finds one more thing: the claims platform the insurer already pays for has an AI
triage module, licensed and switched off, that nobody owns.

## The real world around the example

The insurer is fictional. The pressures on it are real.

- Dutch insurers established **9,070** cases of fraud in 2024 (Verbond van Verzekeraars and CBV), and
  Belgian insurers detected **7,169** (Assuralia). Those are *detected* cases. Insurance Europe
  *estimates* detected and undetected fraud together at about 10% of claims expenditure, without
  giving a method.
- Most claims are what they say they are, and the claimants notice the desk. Of **53,700** non-life complaints at Dutch
  insurers in 2025, **22,900** were about claims handling and payout (AFM). In Belgium, slow settlement
  is the second most common reason for complaints about fire insurance (Ombudsman van de
  Verzekeringen).
- *Almost 80%* of large and medium Dutch insurers had at least one AI application in use at the start
  of 2025 (De Nederlandsche Bank). Using AI is the easy part. Running one decision on it, with an
  owner, is the gap.

The baseline has a cost on both sides: fraud paid, and customers with valid claims kept waiting.

## The move

1. **Name the decision first:** the decision, the prediction it lacks, and the action that follows.
   If you cannot name all three, you have an idea, and it is not yet a use case.
2. **Price today's process**, errors included: handling time, the wrong yeses, the wrong noes, the
   wait.
3. **Pick one first use case.** Choose by what can go live: an owner with budget who wants the result,
   a process that spans a team, data that exists and that someone owns, a result you can measure
   against today, bounded risk, and one or two systems to integrate.
4. **Score value and feasibility separately.** A brilliant idea with no data is a research project. An
   easy idea nobody needs is a demo.
5. **Fund it as a case.** The budget covers the data work, the integration, the scorecard, the running
   cost per use and support after go-live. The model is usually the smallest line.
6. **Know what is already switched on.** Make an inventory of the AI inside software you already pay
   for, give each entry an owner, and ask the vendor questions before you switch on more.

Keep the personal copilots. They are the individual gain. The capability is the decision.

## Who, and how you will know

**Who.** A sponsor with budget, and a named owner of the *outcome*. In the case, that is the head of
claims: the person whose desk changes, and neither IT nor the innovation team.

**How you will know.** Within one quarter there is a go or no-go decision on the first use case, made
on its scorecard (Part 3) and its readiness gates (Part 4). The inventory of switched-on AI exists,
and every entry has an owner.

## In your organisation

| | |
|---|---|
| **The move** | Fund one decision: name the decision, the prediction it lacks and the action; price today's process; score value and feasibility separately |
| **Who** | The sponsor with the budget, and a named owner of the outcome |
| **How you'll know** | A go or no-go on one use case within a quarter, made on its scorecard and readiness gates |
| **On Monday** | Name three decisions in your area where waiting for information is the cost. Then score them on the canvas |

In a bank it is a disputed card payment; in a retailer, a refund for a damaged order. Same anatomy,
same question about the baseline.

## Sources

- Ajay Agrawal, Joshua Gans and Avi Goldfarb, *Prediction Machines: The Simple Economics of
  Artificial Intelligence*, Harvard Business Review Press, 2018. The frame of this part, paraphrased.
- Verbond van Verzekeraars and Centrum Bestrijding Verzekeringsfraude, *CBV Factsheet*, November 2025.
- Assuralia, press release on insurance fraud, 16 November 2025.
- AFM, *Klachtenuitvraag aanbieders van verzekeringen over 2025*, August 2026.
- Ombudsman van de Verzekeringen, *Jaarverslag 2025*.
- Insurance Europe, *Annual Report 2023–2024*, fraud chapter (an estimate; no method given).
- De Nederlandsche Bank, *Verzekeraars en AI: DNB deelt nieuwste inzichten*, 21 January 2026.
- The running case is fictional. Its numbers are synthetic, and the
  [runnable case](https://github.com/fps4/ai-product-design-kit/tree/main/case) recomputes every one of
  them.
