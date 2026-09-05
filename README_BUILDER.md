# HCU Story Node Builder

The **HCU Story Node Builder** prepares new story nodes for Human-Centered Universe.

## Language policy

- The builder interface is English.
- English (`en`) is the canonical and default language.
- The source story may be submitted in any language available in the selector.
- `Other / custom language code` supports languages not listed.
- If the source is not English, the AI creates a faithful canonical English text while the source language can be preserved as a translation layer.
- Every translation keeps the same story ID.

## How to use

1. Select the **Source language**.
2. Paste the story into **Story Content**.
3. Optionally add title, culture tags, belief context, status, and a related node.
4. Click **Create AI Prompt**.
5. Send the prompt to an AI system that can return JSON.
6. Paste the returned JSON into **AI JSON Result**.
7. Click **Process and Validate**.
8. Review the 30 criteria, HUMAN / LIGHT / DARK distribution, triangular position, coverage audit, and observer choices.
9. Click **Create GitHub ZIP**.

## Three-center classification

Each center has 10 criteria scored from 0 to 10. Each center therefore receives a raw score from 0 to 100.

The raw scores are normalized so:

```text
HUMAN + LIGHT + DARK = 100
```

### HUMAN CENTER

Dignity and personhood · Agency and choice · Consent, privacy, and boundaries · Relationship, love, and care · Justice, rights, and fairness · Responsibility and repair · Identity, belonging, and culture · Emotion and lived experience · Meaning, memory, and mortality · Wellbeing and vulnerability

### LIGHT CENTER

Order and structure · Knowledge, truth, and evidence · Visibility and explainability · Measurement and standards · Safety and protection · Predictability and planning · Rules and institutions · Coordination and efficiency · Continuity and preservation · Verification and auditability

### DARK CENTER

Uncertainty and the unknown · Freedom and alternatives · Creativity and invention · Exploration and experiment · Dissent and resistance · Rupture and disruption · Transformation and change · Risk and volatility · Plurality and forking · Emergence and surprise

## Coverage audit

If a meaningful narrative force cannot be represented by the 30 criteria, the AI must flag it for human review. It must not invent a fourth center automatically.

## Observer choices

The builder generates meaningful end-of-chapter choices. Each choice produces HUMAN / LIGHT / DARK effects. These effects later update the reader's Observer State and help recommend the next unread story.

The recommendation is never a restriction. The observer can always open another node through Explore.

> **Commit creates reality. Connection transforms meaning.**
