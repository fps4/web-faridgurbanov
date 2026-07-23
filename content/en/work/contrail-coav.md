---
title: Contrail avoidance — detect the pixels, decide the reroute
summary: Two purpose-built, runnable demos for EUROCONTROL's Contrail Avoidance (COAV) work — a neural-network segmentation app that finds contrails in sky-camera images, and a data-science pipeline that decides which flights to reroute and at what climate-versus-fuel cost.
hook: Two runnable demos — segment the contrails, then decide the reroute.
metric: detect → decide
order: 5
---

# Contrail avoidance — detect the pixels, decide the reroute

This is applied ML for a real domain: aviation's contrail climate problem, as EUROCONTROL frames it in its **Contrail Avoidance (COAV)** work out of Maastricht. Two repositories, built to mirror the two halves of that problem — both runnable, both honestly scoped.

## The two halves

- **Detect — `contrail-segmentation-demo`.** A neural-network **image-segmentation** app: React + TypeScript front end → Node.js (Express) BFF → Python FastAPI service → a hand-written **PyTorch U-Net**. Pick or upload a sky image; it returns the contrail mask, the coverage %, and the count of distinct contrails. Three services that come up with `docker compose up`, with CI on GitHub Actions. This mirrors COAV's Sky Cam Vision™ / Sky InSight™ → ML-detection pipeline.
- **Decide — `contrail-avoidance-pipeline`.** A **Polars/Pandas** pipeline plus a **Databricks-style notebook** that flag which flights form persistent, climate-warming contrails — using the **Schmidt–Appleman Criterion** and **ice-supersaturated regions (ISSR)** — and propose altitude changes, weighing avoided climate forcing (CO₂e) against extra fuel burn. This mirrors COAV's per-flight avoidance trials.

## The honest part

Both run end-to-end on a laptop, because both train and run on **synthetic-but-physically-plausible** data — a synthetic sky generator for the segmentation model, a seeded weather grid and flight tracks for the pipeline. That is a deliberate choice so the whole thing is reproducible in minutes, and each README is explicit about it. The physics (SAC ∩ ISSR) is real and correct in direction; the architecture is the one you'd actually run. Each repo writes down the line between the demo and production — real GVCCS / Sky-Cam imagery and instance tracking on one side, ERA5 reanalysis + OpenSky flight data on the other.

## The pattern behind it

![Diagram: two halves separated by an explicit dashed seam — detect (U-Net segmentation: sky pixels to mask and coverage percentage) and decide (SAC ∩ ISSR physics: weather and tracks to reroute) — each half checkable on its own.](/diagrams/contrail-coav-pattern.svg)

**Perception and decision split at an explicit seam.** The tempting shape is one end-to-end model from camera pixels to reroute advice — impressive in a demo, impossible to validate: when the answer is wrong you can't say whether it saw wrong or reasoned wrong. Here the problem is cut where the domain cuts it: a perception half that turns pixels into a mask and a coverage number, and a decision half that turns weather and trajectories into a reroute — joined by a small, inspectable interface.

Two decisions carry the pattern:

- **The seam is a checkable artifact.** A mask and a coverage % can be scored against ground truth on their own; a reroute can be replayed against the physics (SAC ∩ ISSR) on its own. Each half earns trust separately — which is the only way a safety-adjacent domain will ever accept either.
- **Synthetic data as an architecture decision, not a shortcut.** Training and running on synthetic-but-physically-plausible data is what makes the whole arc reproducible on a laptop in minutes — and each README draws the exact line where real GVCCS imagery and ERA5/OpenSky data would replace it.

The trade-off is stated in the honest part above: reproducibility was bought at the cost of real-world validity claims — deliberately, and in writing.

## Why it matters

The two demos prove the full arc of the job in one place: I can build the **full-stack ML product** that turns camera pixels into a contrail reading, *and* the **data-science decision** that turns weather and trajectories into a reroute with a defensible climate-versus-fuel tradeoff — not just one or the other.

→ See both repositories on the [portfolio](/en/portfolio) under **Applied ML & data science** — these two link out.
