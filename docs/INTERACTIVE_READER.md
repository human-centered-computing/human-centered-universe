# Interactive Reader

The Human-Centered Universe reader is generated from the live story files and deployed through GitHub Pages.

## READ

- Starts from `BRG-0002 — First Vibration` unless the observer resumes a previous valid node.
- Displays the story's HUMAN / LIGHT / DARK profile.
- Stores read state, Observer State, choices, and Quantum Path locally in the browser.
- End-of-story choices modify the Observer State.
- The strongest observer center determines the recommended unread story.
- The observer can always choose another story.

## EXPLORE

- Shows the HUMAN / LIGHT / DARK triangular state space.
- Places every live story in the triangle using its center weights.
- Allows free search and direct access to any live node.

## CREATE

- Opens the Story Node Builder.
- Links to the repository, contribution guide, issues, and fork flow.

## Languages

English is the canonical and default language. The reader lists every language found in live story content. If a UI translation file does not exist for a selected content language, interface labels fall back to English. If a story translation is missing, the story itself falls back to English.

## Publishing

`.github/workflows/deploy-pages.yml` validates the universe, builds `site/data/universe.json`, copies the `web/` application, and deploys the static site to GitHub Pages.
