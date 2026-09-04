# Contributing

## New story
1. Copy `templates/story/`.
2. Assign a unique ID.
3. Write the canonical source in `content/en.md`.
4. Declare at least one connection in `meta.json`.
5. Add translations only as additional language files.
6. Open a pull request.

## Translation contribution
Add `content/<lang>.md` and declare that language in the story's `translations` object.

## Cultural adaptation
Do not overwrite a story because another culture tells a similar story. Create a new story ID and connect the two.

## Branch naming
- `story/light/<slug>`
- `story/dark/<slug>`
- `story/common/<slug>`
- `bridge/<slug>`
- `translation/<language>/<story-id>`
- `experiment/<slug>`
