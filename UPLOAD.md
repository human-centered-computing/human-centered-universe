# HCU Reader Recovery v0.5.3

The latest deployment succeeded, but the deployed web folder lost two essential files:

- `web/assets/app.js`
- `web/assets/styles.css`

GitHub Actions confirmed this with:

`Asset versions: app=missing, css=missing`

This recovery package restores both files and places the Turkish-localization
helpers directly inside `app.js`, so the reader no longer depends on a separate
runtime patch file.

## Upload

Copy the contents of this package into the root of the existing
`human-centered-universe` repository and choose **Replace**.

Commit message:

`Restore reader assets and Turkish localization`

Push to `main`.

After deployment, the build log should say:

`Asset versions: app=<hash>, css=<hash>`

—not `missing`.

Test:

https://human-centered-computing.github.io/human-centered-universe/

Turkish:

https://human-centered-computing.github.io/human-centered-universe/?mode=explore&story=COM-0001&lang=tr
