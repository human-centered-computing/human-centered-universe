# Observer Model

The reader is an Observer inside the HCU story graph.

## Observer State

An observer's choices contribute HUMAN, LIGHT and DARK effects. The accumulated values are normalized to a 100-point state.

Example:

```json
{"HUMAN": 28, "LIGHT": 51, "DARK": 21}
```

## Next-node recommendation

After a choice:

1. determine the observer's dominant center,
2. exclude already-read nodes,
3. find the unread node with the highest weight in the dominant center,
4. use overall profile distance and observation order only as tie-breakers,
5. recommend/open that node.

The observer may always ignore the recommendation and select another story through Explore.

## Personal path

The observed sequence of nodes is stored browser-locally. This sequence is the observer's Quantum Path and becomes their narrative time through the universe.
