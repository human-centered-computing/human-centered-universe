# Observer Model

The reader is an Observer inside the HCU story graph.

## Observer State

An observer begins from a near-balanced baseline of `HUMAN 34 / LIGHT 33 / DARK 33`. Choices contribute HUMAN, LIGHT and DARK effects. The accumulated values are normalized to a 100-point state.

The baseline prevents the first choice from erasing the other two centers. A choice creates a tendency, not a permanent identity.

Example:

```json
{"HUMAN": 28, "LIGHT": 51, "DARK": 21}
```

Each story-level choice is committed at most once. Before committing, the reader sees the projected normalized state. The FIRST VIBRATION threshold trace and the story's later Observer choice are separate events.

Older browser records are migrated conservatively. A missing score is reconstructed from the choice log; a missing baseline is added only when the stored raw score exactly matches the recorded choice effects. Unknown or manually altered states are preserved.

## Next-node recommendation

After a choice:

1. exclude the current and already-read nodes,
2. compare every unread node with the observer's complete normalized HUMAN/LIGHT/DARK profile,
3. favor explicit links from the current story,
4. apply a small penalty to centers repeated in the last three path entries,
5. use observation order only as a final tie-breaker,
6. explain the main recommendation signals and wait for the reader to accept it.

The observer may always ignore the recommendation and select another story through Explore.

## Personal path

The observed sequence of nodes is stored browser-locally. This sequence is the observer's Quantum Path and becomes their narrative time through the universe. The reader can export the local state as a portable `hcu-observer-journey` JSON document.
