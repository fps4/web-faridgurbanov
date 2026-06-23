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

## Why it matters

The two demos prove the full arc of the job in one place: I can build the **full-stack ML product** that turns camera pixels into a contrail reading, *and* the **data-science decision** that turns weather and trajectories into a reroute with a defensible climate-versus-fuel tradeoff — not just one or the other.

→ See both repositories on the [portfolio](/en/portfolio) under **Applied ML & data science** — these two link out.
