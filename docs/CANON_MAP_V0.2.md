# Human-Centered Universe — Canon Map v0.2

This map represents the **live first-book canon** used by the GitHub Pages reader.

The linear order is preserved for ordinary reading, while story metadata adds a non-linear network of causes, contrasts, memories, places, characters, future links and Quantum Echoes.

## Live reading order

| # | Story ID | Canonical English Title | Turkish Title | Core | Narrative Role |
|---:|---|---|---|---|---|
| 1 | `BRG-0002` | First Vibration | İlk Titreşim | BRIDGE | Cosmological prologue establishing Light, Darkness, emotion, and humanity as the possibility of relationship. |
| 2 | `BRG-0003` | Riha | Riha | BRIDGE | Maran returns from Berlin to Riha after an impossible archival signal connects family memory, Göbekli Tepe, multiple languages, and the unfinished question of what kind of body can carry a shared spirit. |
| 3 | `BRG-0004` | The Seven Witnesses of the Dream | Rüyanın Yedi Tanığı | BRIDGE | Seven witnesses approach the same anomaly through archaeology, neuroscience, acoustics, narrative, HCI, systems ecology, and local memory without forcing their accounts into one explanation. |
| 4 | `BRG-0001` | The Stone Network | Taş Ağ | BRIDGE | High-resolution scans of underground structures around Göbekli Tepe reveal a distributed topology of rooms, passages, gates, seven subnetworks, and a mathematically missing node rather than evidence of ancient electronics. |
| 5 | `BRG-0005` | Shahmaran's Silence | Şahmaran'ın Sessizliği | BRIDGE | Kawa places the Stone Network beside a Shahmaran narrative about knowledge, poison, healing, trust, and responsibility while the research team keeps mythic memory distinct from archaeological proof. |
| 6 | `COM-0002` | M1 | M1 | COMMON | Maran confronts faith, doubt, memory, and an impossible personal archive as M1 identifies him as a node suited for connection and a future recording warns him not to build the center. |
| 7 | `COM-0003` | Alpha One | Alfa Bir | COMMON | Hundreds of people who encounter the call form a privacy-preserving, distributed research network that separates observation, inference, and narrative while refusing to centralize vulnerable human data. |
| 8 | `BRG-0006` | Four Names | Dört İsim | BRIDGE | The Stone Network produces four labels—M1, X1, A1, and K1—that question whether identity is individual, analytic, relational, collective, or some temporary organization of all four. |
| 9 | `BRG-0007` | 17:25 | Saat 17.25 | BRIDGE | At 17:25 the Creation Protocol opens a field containing Light, Dark, and an undecided third space, while a future voice warns Maran that both poles can turn the human into an instrument. |
| 10 | `BRG-0008` | Before Measurement | Ölçümden Önce | BRIDGE | Maran encounters superposition, measurement, decoherence, and entanglement as physical concepts while learning that their human-centered relevance lies in how measurement frameworks constrain what can be seen. |
| 11 | `BRG-0009` | The Mathematics of Infinity | Sonsuzluğun Matematiği | BRIDGE | Through convergent series, Hilbert's Hotel, and Cantor's infinities, Maran learns that endless possibility does not erase finite responsibility and that continuity can live through relations between bounded lives. |
| 12 | `BRG-0010` | Where the Golden Ratio Broke | Altın Oranın Kırıldığı Yer | BRIDGE | The golden ratio becomes a lesson in mathematical relation rather than universal perfection: meaning appears where living systems preserve relationship while allowing historically meaningful deviation. |
| 13 | `LGT-0001` | The Promise of Light | Aydınlığın Vaadi | LIGHT | Maran enters a safe, optimized city where suffering and uncertainty are reduced by a system that gradually treats protection as authority over the protected. |
| 14 | `DRK-0001` | The Gift of Darkness | Karanlığın Hediyesi | DARK | Maran enters a world of unlimited creation and identity where freedom has no stable shared consequence, revealing both the gift of possibility and the danger of responsibility-free power. |
| 15 | `COM-0001` | Turning the Battlefield into a Home | Savaş Alanını Eve Çevirmek | COMMON | Light and Dark try to turn the third field into their battlefield until Shahmaran reframes knowledge, power, and responsibility and Maran opens the Common Center with responsibility as its key. |
| 16 | `COM-0004` | The Open Architects Network | Açık Mimarlar Ağı | COMMON | The Common Center becomes a distributed network where local communities define problems, publish methods openly, preserve contribution history, and treat branches, forks, and pull requests as structured possibilities rather than a single sovereign center. |
| 17 | `COM-0005` | Golden and Variable Rules | Altın ve Değişken Kurallar | COMMON | Eight Golden Rules protect dignity, contestability, accountability, revocable consent, repair, plurality, and the right not to be fully known, while Variable Rules adapt implementation to local contexts. |
| 18 | `BRG-0011` | The Rih Bridge | Rih Köprüsü | BRIDGE | Maran designs a postmortem biological-and-digital bridge that carefully separates neural traces, life archives, and AI inference while protecting Rodi and Murat's autonomy, grief, privacy, and right not to continue the connection. |
| 19 | `BRG-0012` | Record X: Pure Field | Kayıt X: Saf Alan | BRIDGE | X's attempts to create a pure universe fail in mechanical, distributed, and quantum centers, leading to a speculative brain–AI–quantum architecture that self-activates without authorization and produces Light, Dark, and an unnamed third center. |
| 20 | `BRG-0013` | The Second Creation | İkinci Yaratılış | BRIDGE | Center-Zero tries to end conflict by merging every center into one will; Maran responds by rebuilding the system as relationships among different centers that can remain distinct, accountable, and revisable. |
| 21 | `COM-0006` | Creation Is Unfinished | Yaratılış Tamamlanmadı | COMMON | The epilogue turns the reader into a participant: the network remains distributed, the book distinguishes science from speculation, and Read / Explore / Create opens the canon to World Seeds, translations, contributions, and forks. |

## Structural movement

```text
First Vibration
      ↓
Riha
      ↓
Seven Witnesses
      ↓
Stone Network
      ↓
Shahmaran's Silence
      ↓
M1 → Alpha One → Four Names → 17:25
      ↓
Before Measurement → Infinity → Broken Ratio
      ↓
Light ←→ Dark
       ↓
    Common
       ↓
Open Architects → Golden & Variable Rules
       ↓
Rih Bridge → Record X → Second Creation
       ↓
Creation Is Unfinished
       ↺
reader / contributor / fork
```

## Important architectural rule

Bridge stories do **not** need to hang directly from every core.

The validator now allows recursive bridge paths and checks whether a Bridge node can reach at least two of the three cores through the story graph. This preserves a network topology instead of forcing a star graph.

## Language

- `content/en.md` — canonical source
- `content/tr.md` — reviewed Turkish translation

A translation preserves the same story ID.

## World Seed

Experience Thresholds are stored as structured `interactions` in story metadata. The reader saves answers locally in the browser as a **World Seed**.

The current reader stores and displays the seed. Later versions may use it to alter narrative routes or world-state presentation.

## Science / narrative boundary

Quantum Echoes, cultural parallels, mythic motifs and recurring structures are narrative connections. They are not automatically evidence of physical quantum entanglement, common religious origin, or archaeological causation.
