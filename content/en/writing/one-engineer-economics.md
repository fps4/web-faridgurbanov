---
title: The case for one-engineer economics
summary: Five numbers changed what a small team can build — AI adoption, the 280-fold collapse in inference cost, the rise of the solo founder, and a sharp fall in programmer employment. Here is what they add up to, and the part they leave out.
date: 2026-03-07
order: 1
---

# The case for one-engineer economics

There's a thesis going round that one engineer with AI now covers what a team of five covered three years ago. It's easy to file under vendor noise. The numbers underneath it are not noise — they are the most interesting thing to happen to delivery economics in the twenty years I've been doing this work.

## The numbers

**Adoption went from unusual to universal.** 90% of engineering teams now use AI coding tools, up from 61% a year earlier, and 62% of respondents report at least a 25% increase in productivity ([Jellyfish](https://jellyfish.co/blog/2025-software-engineering-management-trends/)).

**An independent estimate lands in the same range.** McKinsey research puts the improvement available from AI and low-code at as much as 45% ([Stack Overflow](https://stackoverflow.blog/2025/01/28/how-engineering-teams-can-thrive-in-2025/)).

**The cost of the capability collapsed.** Querying a model went from $20 per million tokens in November 2022 to $0.07 per million tokens by October 2024 — an over 280-fold reduction in roughly eighteen months ([Baytech Consulting](https://www.baytechconsulting.com/blog/the-state-of-artificial-intelligence-in-2025)).

**Founders are already running on the thesis.** The share of startups launched by solo founders without venture capital rose from 22.2% in 2015 to 38% in 2024 — on the argument that "AI-powered tools mean one founder can do the work of an entire early-stage team" ([Nucamp](https://www.nucamp.co/blog/solo-ai-tech-entrepreneur-2025-how-to-launch-a-global-ai-startup-as-a-solo-tech-founder-and-earn-millions-in-2025)).

**And the labour market moved.** Programmer employment in the United States fell 27.5% between 2023 and 2025 — the sharpest impact of any affected role, attributed to the relatively solitary and highly structured nature of the work ([IEEE Spectrum](https://spectrum.ieee.org/ai-effect-entry-level-jobs)).

## What they add up to

The cost line is the one that actually matters. A 25% productivity gain is an improvement you can argue about; a 280-fold price drop is a change of category. Work that was too expensive to bother automating — generating the fixture data, writing the migration script, reading the whole legacy module before touching it — stopped being a budget line and became something you just do. "AI as co-engineer" is economically viable at essentially any scale, which is a sentence that was false eighteen months earlier.

That is what the solo-founder number is really measuring. Not that individuals got better, but that the floor under a functioning product team dropped.

## What the numbers leave out

Every one of those productivity figures is measured on the part of the job that was already the fastest part. In an enterprise, delivery is not limited by how quickly code appears. It's limited by the twenty teams with an opinion, the decision nobody will own, the data contract that has no upstream owner, and the four-year-old vendor agreement nobody wants to reopen. Doubling typing speed against that constraint changes very little — which is why organisations reporting large individual gains often can't find them in their lead time.

The employment figure is worth reading closely for the same reason. The impact landed hardest on the most *solitary* and most *structured* work. That is precisely the shape of work that automates first, and it is the opposite of the shape of architecture, which is neither.

So the honest version of the thesis is narrower than the headline, and more useful. One-engineer economics is real, and it arrives at the edges first: a solo founder, an internal tool, a spike, a migration nobody had budget for. It arrives inside a large organisation on the day the paved road is good enough that one person can get from idea to production without asking six teams for permission.

That's a platform problem, not a model problem. The cost of the intelligence already fell by 280 times. The cost of getting a change through the organisation didn't move at all.

→ Related: [Stakeholder alignment](/en/expertise/stakeholder-alignment) and [AI & automation](/en/expertise/ai-and-automation).
