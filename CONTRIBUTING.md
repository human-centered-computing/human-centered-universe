# Contributing

Human-Centered Universe is an open, living narrative graph. Contributions should preserve human dignity, visible authorship, cultural difference, and the distinction between established knowledge and speculation.

## Recommended workflow

Use the **Story Node Builder** at `web/story-node-builder.html` whenever possible.

1. Submit the story in any source language.
2. Produce the canonical English text.
3. Run the 30-criterion HUMAN / LIGHT / DARK analysis.
4. Review the coverage audit.
5. Add meaningful observer choices.
6. Export the GitHub-ready package.
7. Open a pull request.

## Story requirements

Every accepted main-universe story must:

- have a unique stable story ID,
- contain `content/en.md`,
- preserve translations under the same ID,
- have HUMAN / LIGHT / DARK center weights that sum to 100,
- identify a primary center,
- remain compatible with the three-center model,
- clearly separate real scientific claims from speculation when relevant.

Existing `BRG-*` and `COM-*` IDs are historical technical identifiers. They do not define a fourth center or a permanent conceptual category.

## Translation contribution

Add `content/<language-code>.md` and declare that language in the story metadata. A translation does not receive a new story ID.

## Cultural adaptation

A cultural adaptation is not a translation. Create a new story node and preserve explicit relationships to related stories without inventing a single historical or theological origin.

## Branch naming

Suggested patterns:

- `story/human/<slug>`
- `story/light/<slug>`
- `story/dark/<slug>`
- `translation/<language>/<story-id>`
- `experiment/<slug>`

## Git as narrative architecture

- branch = possible reality
- commit = recorded reality
- pull request = proposed reality
- merge = reality entering the shared main universe
- conflict = incompatible realities meeting
- fork = alternative universe
- history = memory

> **Commit creates reality. Connection transforms meaning.**


## Contribution licensing

Human-Centered Universe uses an **inbound = outbound** contribution model:

- source code and software contributions are accepted under **GNU AGPL-3.0**,
- original story, book, translation, artwork, audio, video, animation, narrative, and other creative contributions are accepted under **CC BY-SA 4.0**.

Contributors retain copyright in their original contributions. By submitting a contribution for inclusion, the contributor confirms that they have the necessary rights to license that contribution under the applicable project license.

Do not submit third-party or personal material unless its rights, consent, and license status are clear.

For mixed interactive works, separate code from creative assets where practical:

- application/game code → AGPL-3.0,
- story, dialogue, images, audio, video, worldbuilding and other expressive content → CC BY-SA 4.0.

Accepted adaptations of existing HCU creative content must preserve the attribution and ShareAlike requirements of CC BY-SA 4.0.
