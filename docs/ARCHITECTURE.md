# HCU Architecture

## Origin

`BRG-0002 — First Vibration` is the origin observation node.

## State space

Every live story occupies a point in a triangular state space:

```text
HUMAN + LIGHT + DARK = 100
```

HUMAN is the top vertex, LIGHT the lower-left vertex, and DARK the lower-right vertex.

## Routing

An observer's choices accumulate into an Observer State. The dominant center is determined from that state. The next recommendation is the unread story with the highest weight in that center; ties are resolved by whole-profile distance and then observation order.

The observer can always ignore the recommendation and choose another node in Explore.

## Quantum Time

The graph has no single absolute narrative clock.

> Nodes create space. Choices create movement. Observation creates time.

Technical timestamps remain normal chronological timestamps.

## Stable IDs

Historical prefixes such as `BRG-*` and `COM-*` remain stable for URLs and history. Center classification is defined by `primary_center` and `center_weights`, not by the ID prefix.
