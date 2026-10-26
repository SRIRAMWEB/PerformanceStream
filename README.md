# PerformanceStream

**Securing Real-Time Sports Analytics Pipelines — Trust Every Reading Before It Reaches the Coach.**

An interactive security demonstration showing how to protect real-time sports analytics from data tampering, replay attacks, fake sensors, and malicious traffic.

**BreachX 2026 | Track 2: Sports — Secure Sports Intelligence | Problem Statement: BRCX-SPT-03**

🌐 **Live Demo:** https://bavzon2008-eng.github.io/PerformanceStream_Prototype/

---

## 📌 The Problem

Sports teams rely on real-time sensor data, including heart rate, speed, and fatigue measurements, to make training and match-day decisions.

If an attacker injects fake readings, replays old messages, manipulates timestamps, floods an ingestion API, or compromises an analytics component, dashboards can display misleading information and influence coaching decisions.

The primary threat is not necessarily stolen data. It is **believable but untrustworthy data influencing critical decisions.**

## 💡 Our Solution

PerformanceStream demonstrates a secure data pipeline that verifies incoming sensor readings, rejects invalid messages, quarantines suspicious data, and enables coaches to trace trusted readings back to their original source events.

### Five Security Checks

| # | Security Check      | How It Works                                                           | Threat Mitigated                           |
| - | ------------------- | ---------------------------------------------------------------------- | ------------------------------------------ |
| 1 | Device Identity     | Verifies that the sensor is registered                                 | Fake sensor injection                      |
| 2 | Message Integrity   | Validates message authenticity using HMAC-SHA256                       | Data tampering                             |
| 3 | Freshness           | Checks timestamps and prevents reuse of message IDs                    | Replay attacks                             |
| 4 | Sequence Validation | Checks sequence numbers for gaps, duplicates, and ordering issues      | Missing, duplicated, or reordered readings |
| 5 | Anomaly Detection   | Checks value ranges and detects implausible readings or sudden changes | Impossible values and suspicious activity  |

### Security Outcomes

* **Rejected:** Messages failing identity, integrity, or freshness checks are rejected.
* **Quarantined:** Messages with sequence anomalies or suspicious values are isolated for further investigation.
* **Trusted:** Messages passing all five checks are marked as trusted.
* **Rate Limited:** Excessive incoming requests are restricted before they overwhelm the pipeline.

Rejected and quarantined messages do not proceed to trusted reporting. Suspicious events can be retained for investigation.

## 🏗️ Architecture

PerformanceStream uses six logical security zones, with trust increasing from data ingestion to reporting.

| Zone | Component  | Responsibility                                                                          |
| ---- | ---------- | --------------------------------------------------------------------------------------- |
| 1    | Sources    | Wearables, cameras, training systems, and match systems                                 |
| 2    | Gateway    | Device identity, signature verification, rate limiting, and input validation            |
| 3    | Validation | Freshness, message uniqueness, sequence validation, range checks, and anomaly detection |
| 4    | Raw Zone   | Append-only storage for original messages and evidence                                  |
| 5    | Processing | Stream processing with least-privilege access                                           |
| 6    | Reporting  | Dashboards displaying trusted and suspicious readings, with data lineage                |

The proposed architecture separates raw, processed, and reporting data to reduce the risk of a compromised component altering the entire pipeline.

**Data lineage** connects dashboard readings to their corresponding signed source events, supporting traceability and investigation.

## 🎮 Interactive Demo

The project includes a browser-based attack simulation demonstrating how different security checks respond to normal readings and malicious activity.

### Scenarios

| Demo Control     | Scenario                                                                 | Detection Point        | Expected Outcome              |
| ---------------- | ------------------------------------------------------------------------ | ---------------------- | ----------------------------- |
| Play All         | Runs all scenarios in sequence                                           | Multiple checks        | Complete security walkthrough |
| Normal Reading   | Valid sensor message                                                     | Passes all five checks | Trusted                       |
| Fake Sensor      | Unregistered sensor `S-99`                                               | Check 1                | Rejected                      |
| Changed Value    | A 150 bpm reading is altered to 60 bpm in transit                        | Check 2                | Rejected                      |
| Replay Old Data  | A previously valid message is resent                                     | Check 3                | Rejected                      |
| Missing Readings | Sequence numbers skip ahead                                              | Check 4                | Quarantined                   |
| Stolen Key       | A suspicious 400 bpm reading is correctly signed using a compromised key | Check 5                | Quarantined                   |
| Flood            | Simulates 500 requests in one second                                     | Rate limiter           | Excess traffic restricted     |
| Reset            | Clears simulation counters, entries, and logs                            | —                      | Fresh simulation              |

The simulation demonstrates that suspicious messages can be isolated while legitimate readings continue to be processed.

**Note:** The reported outcomes and counters depend on the simulation's implementation and execution. The demo illustrates the security workflow; it does not establish production-level security or performance.

### Run Locally

1. Clone or download this repository.
2. Open `index.html` in a modern web browser.
3. Use the interactive controls to explore the scenarios.

No installation is required for the standalone browser demo.

### Technical Note

This prototype runs entirely in the browser and uses the Web Crypto API to demonstrate HMAC-SHA256 message signing and verification.

It simulates gateway security logic and does not connect to physical sensors or a real network ingestion pipeline.

## 🛠️ Technology Stack

### Implemented in the Prototype

* **HTML** — Structure and content
* **CSS** — Layout and visual styling
* **JavaScript** — Interactive simulation and validation logic
* **Web Crypto API** — HMAC-SHA256 signing and verification

### Proposed Stack for the Full System

| Zone              | Proposed Technologies                                                            |
| ----------------- | -------------------------------------------------------------------------------- |
| Sources           | Python, NumPy, JSON, replay scripts                                              |
| Gateway           | FastAPI, HMAC-SHA256, Redis, Pydantic                                            |
| Validation        | Python validation rules, scikit-learn Isolation Forest, Pandas, Z-score analysis |
| Raw Zone          | PostgreSQL or SQLite, SHA-256 hash chains, Amazon S3 Object Lock                 |
| Processing        | Python workers, Pandas, database access controls, signed outputs                 |
| Reporting         | Streamlit, Plotly, SQL, role-based access                                        |
| Build and Testing | Docker, pytest, Locust, TLS/OpenSSL, Git                                         |

The proposed stack describes potential future implementation components; these technologies are not all implemented in the current prototype.

## 🌟 Impact and Benefits

* **More trustworthy decisions:** Helps prevent unverified readings from being presented as trusted data.
* **Attack detection:** Demonstrates responses to fake sensors, tampered messages, replay attempts, sequence anomalies, and implausible readings.
* **Availability protection:** Illustrates how rate limiting can help control excessive traffic.
* **Traceability:** Demonstrates how readings can be linked to their original source events.
* **Modular architecture:** Separates ingestion, validation, storage, processing, and reporting responsibilities.

## 🔮 Future Scope

1. **Scalable ingestion:** Integrate MQTT or Apache Kafka and deploy the pipeline in a cloud environment.
2. **Advanced anomaly detection:** Establish athlete-specific baselines and introduce cross-sensor correlation.
3. **Stronger device security:** Explore hardware-backed keys, automatic key rotation, and signed firmware verification.
4. **Production-grade storage:** Implement tamper-evident logs, access controls, and immutable evidence retention.
5. **Broader applicability:** Extend the design to additional sports, venues, and connected athlete-monitoring systems.
6. **Comprehensive testing:** Add automated security tests, load tests, and integration tests using simulated and real sensor data.

## 📁 Repository Structure

```text
PerformanceStream/
├── index.html       # Interactive browser-based security simulation
├── README.md        # Project documentation
└── demo/            # Optional demonstration video
    └── performancestream_demo_video.mp4
```

If architecture diagrams or other documentation assets are added to the repository, they can be organized in a `docs/` directory.

## 👥 Team

**Team Name:** Among Us

**College:** Easwari Engineering College, Ramapuram, Chennai

**Event:** BreachX 2026

## 📄 License

No license has been specified yet. Add an appropriate license, such as the MIT License, if you intend to permit others to reuse or modify the project under its terms.
