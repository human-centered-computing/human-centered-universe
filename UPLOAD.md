# HCU Runtime Hotfix v0.5.2

The previous Turkish-localization deployment validated and deployed successfully,
but the browser application crashed at runtime because `app.js` calls localization
helpers that were not actually included in the deployed JavaScript bundle.

This hotfix defines the missing helpers before `app.js` executes.

Copy all files/folders from this package into the root of the existing
`human-centered-universe` repository and choose **Replace**.

Commit message:

`Fix reader runtime localization crash`

Then push to `main`.

Expected test URLs:

https://human-centered-computing.github.io/human-centered-universe/

https://human-centered-computing.github.io/human-centered-universe/?mode=explore&story=COM-0001&lang=tr

The Turkish Explore page should display:
- İnsan Merkezli Evren
- Keşfet
- Savaş Alanını Eve Çevirin
- Turkish story summaries
- Aydınlık Merkez / Karanlık Merkez / Ortak Merkez
