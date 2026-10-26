# PerformanceStream — Secure Real-Time Sports Analytics Pipeline

> **BreachX · Team Among Us · Problem ID `BRCX-SPT-03`**  
> *Every reading verified. Every number traceable.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Try%20Me-034F46?style=for-the-badge&logo=vercel)](https://performancestream.vercel.app)
[![Video Walkthrough](https://img.shields.io/badge/Demo%20Video-Watch%20with%20Voiceover-E4F1C6?style=for-the-badge&logo=youtube&logoColor=034F46)](https://performancestream.vercel.app/video)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🚀 Live Demo & Video

- **👉 Try Me (Live Website)**: [https://performancestream.vercel.app](https://performancestream.vercel.app)
- **🎥 Video Walkthrough (with Voiceover)**: [https://performancestream.vercel.app/video](https://performancestream.vercel.app/video)
- **⚡ Interactive Attack Simulator**: [https://performancestream.vercel.app/simulator](https://performancestream.vercel.app/simulator)
- **📐 Security Architecture Explorer**: [https://performancestream.vercel.app/architecture](https://performancestream.vercel.app/architecture)

---

## 📌 Problem Overview

In modern elite sports, high-stakes tactical decisions—such as athlete substitutions, cardiac load balancing, pacing, and fatigue thresholds—rely heavily on real-time biometric streams from wearable edge devices.

However, standard athletic stadium environments operate over noisy, untrusted wireless frequencies (Bluetooth Low Energy, Wi-Fi, cellular edge gateways). Traditional pipelines accept incoming telemetry implicitly without verification, leaving systems vulnerable to:
1. **Rogue Hardware**: Unauthorized sensors spoofing legitimate athlete hardware IDs.
2. **In-Flight Data Poisoning**: Man-in-the-middle attacks altering telemetry values to induce tactical miscalculations.
3. **Replay Attacks**: Transmitting intercepted historical readings from earlier match periods.
4. **Sequence Disruption**: Undetected dropped packets or out-of-order streams.
5. **Compromised Keys**: An attacker holding valid credentials injecting biologically impossible biometric spikes.
6. **Denial-of-Service / Volumetric Floods**: Overwhelming stadium ingestion gateways to blackout real-time coaching metrics.

---

## 🛡️ The PerformanceStream Solution

**PerformanceStream** is a zero-trust cryptographic verification gate positioned directly between athlete wearable hardware and sideline coaching analytics. Every single packet is evaluated through a strict sequential 5-stage defensive gate before reaching downstream models.

```
[Wearable Sensors]
        │
        ▼
[Edge Ingestion Gateway] (Perimeter Token-Bucket Rate Limiter)
        │
        ▼
[Sequential 5-Check Gate]
  ├── Check 1: Identity Verification (Pre-shared Device Registry)
  ├── Check 2: Cryptographic Integrity (Keyed HMAC-SHA-256)
  ├── Check 3: Freshness & Replay Defense (Unix Timestamp ±30s + Monotonic Nonce Cache)
  ├── Check 4: Sequence Continuity (Monotonic Strict Counter)
  └── Check 5: Physiological Bounds & Statistical Anomaly (Sliding Window Z-Score k=3.0)
        │
   ┌────┴──────────────────────────┐
   ▼                               ▼
[Trusted Path]             [Quarantine Engine]
Chained into Immutable     Isolated with Alert Flag,
SHA-256 Hash Ledger        Dropped from Coach Decision Stream
   │
   ▼
[Coach Dashboard & Analytics]
Full Cryptographic Lineage Traceability
```

---

## 🔬 The 5 Sequential Verification Checks

| Check | Name | Defense Mechanism | Attacked Stopped |
|:---:|:---|:---|:---|
| **01** | **Identity** | Authenticates `device_id` against the pre-shared authorized registry. | Spoofed hardware, rogue beacon injection. |
| **02** | **Integrity** | Keyed **HMAC-SHA-256** signature over canonical payload `(device_id \| metric \| value \| seq \| ts \| nonce)`. | In-flight telemetry tampering, MITM alterations. |
| **03** | **Freshness** | Validates timestamp within a $\pm 30$-second window and rejects nonces already recorded in the deduplication cache. | Replay attacks of past sessions or delayed packets. |
| **04** | **Sequence** | Checks monotonic sequence continuity ($\Delta \text{seq} = 1$). | Packet drop injection, replay of re-ordered fragments. |
| **05** | **Physiological Sense** | Dynamic sliding-window statistical $z$-score ($k=3.0$) and hard biological boundaries (35–220 BPM). | Stolen-key sensor poisoning with impossible heart rate spikes. |

---

## ⛓️ Immutable SHA-256 Hash Ledger & Lineage Tracing

- Every verified reading is chained into an append-only ledger block:
  $$\text{Block Hash} = \text{SHA-256}(\text{Index} \parallel \text{PrevHash} \parallel \text{Timestamp} \parallel \text{Payload})$$
- **Lineage Drawer**: Coaches can click any dot on the biometric chart to trace its exact cryptographic signature, nonce, timestamp, and linked ledger block hash.
- **Tamper Detection**: One-click verification scans the entire chain. If an attacker modifies historical records in the database, the cryptographic seal breaks immediately, pinpointing the exact compromised block.

---

## 💻 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling**: Tailwind CSS & CSS Custom Design System (Curated Bento Architecture)
- **Motion & Visuals**: Framer Motion
- **Cryptography Engine**: Web Crypto API (HMAC-SHA-256, SHA-256 hashing)
- **Icons**: Lucide React
- **Hosting**: Vercel

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or bun

### Commands

```bash
# 1. Clone the repository
git clone https://github.com/SRIRAMWEB/PerformanceStream.git
cd PerformanceStream

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

---

## 👥 Team Among Us

- **Challenge**: BreachX Hackathon
- **Problem Track**: Sports / Cybersecurity (`BRCX-SPT-03`)
- **Repository**: [https://github.com/bavzon2008-eng/PerformanceStream_Prototype](https://github.com/bavzon2008-eng/PerformanceStream_Prototype)
- **Live Demo**: [https://performancestream.vercel.app](https://performancestream.vercel.app)
