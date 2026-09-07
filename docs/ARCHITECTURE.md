# HCU Architecture

## Origin

`BRG-0002 — First Vibration` is the origin observation node.

## Narrative source of truth

The committed story folders are the primary source of narrative reality:

```text
stories/**/<STORY-ID>/
├── meta.json
├── analysis.json
└── content/
```

A committed story node must not require a second manual database entry merely to exist.

`universe/universe-map.json` is retained as an **overlay** for:

- origin node,
- current center names,
- temporal/routing model,
- curated observation order for nodes that have one.

Reader, graph and narration builders discover live stories from `stories/**/meta.json`.

## Story registry

`build_reader.py` generates:

```text
site/data/story-registry.json
```

from **all committed story nodes**, including:

- canon
- core
- experimental
- fork

The authoring tool uses the registry to prevent duplicate IDs and validate related-node references.

## State space

Every live story occupies a point in a triangular state space:

```text
HUMAN + LIGHT + DARK = 100
```

HUMAN is the top vertex, LIGHT the lower-left vertex, and DARK the lower-right vertex.

These are not good/evil categories.

## Idea maturation

New authoring follows:

```text
IDEA
→ INITIAL VIBRATION
→ LIGHT
→ DARK
→ HUMAN
→ INTERACTION
→ IDEA MATURATION
→ STORY
→ 30-CRITERION ANALYSIS
→ STORY NODE
```

The three centers expose different consequences and possibilities. They do not mechanically declare the idea correct or incorrect.

## Routing

An observer's choices accumulate into an Observer State. The dominant center is determined from that state. The next recommendation is the unread story with the highest weight in that center; ties are resolved by whole-profile distance and then observation order.

The observer can always ignore the recommendation and choose another node in Explore.

## Quantum Time

The graph has no single absolute narrative clock.

> Nodes create space. Choices create movement. Observation creates time.

Technical timestamps remain normal chronological timestamps.

## Graph generation

`build_graph.py` discovers every live (`canon` or `core`) story directly from story metadata and analysis. `universe-map.json` may provide observation order, but it is not the only list of live stories.

This prevents a committed canon story from appearing in the reader while being absent from the graph.

## Narration generation

`generate_multilingual_narration.py` discovers live stories from story metadata.

It no longer reads the deprecated `canon-map.v0.2.json["chapters"]` structure.

## Stable IDs

Historical prefixes such as `BRG-*` and `COM-*` remain stable for URLs and Git history.

Center classification is defined by:

```text
primary_center
center_weights
```

not by the historical ID prefix.

New center-native story IDs may use:

```text
HUM-*
LGT-*
DRK-*
```
