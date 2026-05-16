# UI/UX-Prinzipien — To Do App

**Stand:** Mai 2026
**Basis:** `hifi.jsx` (Today, Inbox, Notification)
**Ziel:** Langfristige Grundlage für die SwiftUI-Implementierung. Beschreibt **Designentscheidungen**, nicht einzelne Screens.

---

## 1. Design Vision

> *„Ein ruhiger Assistent für deinen Tag — kein Werkzeug zum Verwalten von Aufgaben, sondern ein Ort, an dem dein Kopf leichter wird."*

Die App ist kein Produktivitäts-Werkzeug im klassischen Sinn. Sie ist ein **mentaler Entlastungsraum**, der drei Versprechen einhält:

1. **Erfassen in Sekunden.** Was im Kopf ist, ist sofort raus. Keine Pflichtfelder, keine Modal-Dialoge beim Capture.
2. **Einmal sortieren — abends.** Die App sammelt tagsüber, der Mensch sortiert in einem fokussierten Abendritual. Nicht zwischendurch.
3. **Der Tag plant sich selbst.** Apple Intelligence verbindet Outlook-Kalender und To-Dos zu *einer* Timeline. Der User stimmt zu oder passt an — er plant nicht von Hand.

**Tonalität:** Ruhig, erwachsen, sachlich. Nie verspielt, nie gamifiziert. Keine Streaks, keine Konfetti, keine „Du schaffst das!"-Sprache. Der User ist kompetent — die App tritt einen Schritt zurück.

**Was die App *nicht* ist:**
- Kein Projekt-Management (keine Boards, Gantt, Dependencies, Tickets).
- Keine Team-Plattform (Single-User, keine Mentions, keine Shared Spaces in V1).
- Keine Wissensdatenbank (keine verschachtelten Dokumente, keine Wiki-Pages).
- Kein Dashboard mit Stats (keine Completion-Rate, keine Wochen-Charts).

---

## 2. Visuelle Prinzipien

### Schichten statt Ornament
Das Interface besteht aus **drei Tiefenebenen**: Wallpaper (Aurora-Glow) → Fenster (`#1c1e1d`) → schwebende Glas-Elemente (Toolbar, Popover, Notifications). Tiefe entsteht durch Translucency und feine Innenkanten, nicht durch Schatten oder Borders.

### Liquid Glass nur dort, wo etwas schwebt
Glas-Material (`backdrop-filter: blur(40px) saturate(180%)`) ist reserviert für:
- Toolbars
- Popover/Menüs (Snooze, Quick-Add)
- System-Benachrichtigungen
- Dock

Listen, Cards und Inhaltsflächen sind **nicht** translucent — sie sind solide Surfaces mit niedrigem Alpha-Tint. Glas markiert „temporär" und „schwebend".

### Ruhe durch Reduktion der Farbenergie
Auf jedem Screen sind **maximal zwei farbige Akzente gleichzeitig sichtbar** (Accent + Kalender-Blau). Alles andere ist neutral. Farbe ist Information, nicht Dekoration.

### Hierarchie über Gewicht, nicht über Größe
Titel sind selten >16 pt. Stattdessen unterscheidet die App über Font-Weight (400 → 500 → 600), Opazität (0.94 → 0.62 → 0.40 → 0.22) und Letter-Spacing. Das Ergebnis ist dichter, aber lesbarer als typische „Hero-Titel"-Layouts.

### Innenkanten statt Außenkanten
Buttons und Cards bekommen `inset 0 1px 0 rgba(255,255,255,0.08)` — eine 1px-Highlight-Linie *innen oben*. Das ist die wichtigste Detail-Regel: sie gibt jedem Element den „aus dem Material gegossen"-Look statt „auf das Material geklebt".

### Keine harten Borders
Trenner sind `0.5px solid rgba(255,255,255,0.07–0.12)`. Niemals 1 px, niemals voll opake Linien.

---

## 3. Typografie

### Font-Stack
```
-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif
```
**SwiftUI:** `Font.system(...)` — kein Custom-Font. SF passt die Optical-Size automatisch an (Text < 20 pt = SF Pro Text, ≥ 20 pt = SF Pro Display).

### Skala (sehr eng — bewusst!)

| Rolle | Größe | Weight | Letter-Spacing | SwiftUI |
|---|---|---|---|---|
| Display (Cover, Onboarding) | 30 | 700 | -0.8 | `.system(size: 30, weight: .bold)` |
| Screen-Title (Toolbar) | 14 | 600 | -0.2 | `.headline` |
| Card-Title (Inbox-Item expanded) | 16 | 600 | -0.2 | `.system(size: 16, weight: .semibold)` |
| Row-Title (Tasks, Events) | 13.5 | 500 | -0.1 | `.system(size: 13.5, weight: .medium)` |
| Body / Sidebar | 13 | 400 | -0.1 | `.system(size: 13)` |
| Meta / Subtitle | 11 – 12 | 400 | 0 | `.caption` |
| Section-Label (UPPERCASE) | 10.5 – 11 | 600 | +0.4 / +0.6 | `.system(size: 11, weight: .semibold).tracking(0.4)` |
| Badge / Tag | 9.5 – 10 | 700 | +0.6 (UPPERCASE) | `.system(size: 10, weight: .bold).tracking(0.6)` |
| Tabular Numbers (Zeiten) | — | — | `font-variant-numeric: tabular-nums` | `.monospacedDigit()` |

### Regeln
- **Letter-Spacing wird negativer, je größer der Text.** Negativ ab 13 pt aufwärts, positiv bei Uppercase-Labels.
- **Uppercase nur für Sektion-Labels und Status-Badges** (z. B. „DUE TODAY", „NEEDS SORT"). Nie für Fließtext oder Buttons.
- **Tabular-Numerals** für Uhrzeiten, Counts und alle Zahlen, die in vertikaler Liste übereinanderstehen.
- **`text-wrap: pretty`** als Default für mehrzeilige Texte.
- **Keine Italic, keine Underline** im Standard-Inventar. Italic ist reserviert für Zitate/Generated-Content-Hinweise.

---

## 4. Farbwelt

### Wallpaper / Hintergrund
```
wall1:    #0d1612   (dunkles Wald-Grün-Schwarz, oben links)
wall2:    #0a0e0d   (fast Schwarz, unten rechts)
windowBg: #1c1e1d   (Fenster-Innenflache)
```
Linearer Verlauf 160°. Darüber drei radiale Aurora-Glows mit 40–60 px Blur — diese liefern subtile Farbatmosphäre, ohne dass eine einzelne Fläche dominiert.

### Surface-Tints (auf `windowBg`)
| Token | Wert | Verwendung |
|---|---|---|
| `surface1` | `rgba(255,255,255,0.04)` | Hover-Hintergründe (Task-Row, Sidebar-Row) |
| `surface2` | `rgba(255,255,255,0.07)` | Badge-Hintergründe, Sekundär-Flächen |
| `surface3` | `rgba(255,255,255,0.10)` | Sidebar-Badges, aktive Sidebar-Rows |
| `divider1` | `rgba(255,255,255,0.07)` | DividerLine in Listen |
| `divider2` | `rgba(255,255,255,0.12)` | Card-Borders |

### Text (alle weiß mit Alpha)
| Token | Alpha | Verwendung |
|---|---|---|
| `textPrimary` | 0.94 | Primär (Titel, Body) |
| `textSecondary` | 0.62 | Sekundär (Meta) |
| `textTertiary` | 0.40 | Tertiär (Hints, Labels) |
| `textQuaternary` | 0.22 | Quartär (Disabled, Microcopy) |

### Akzente (Forest-Set, dark-friendly)

| Token | Wert | Bedeutung |
|---|---|---|
| priorityHigh | = danger | Roter Priority-Dot |
| priorityMedium | = warnOrange | Oranger Priority-Dot |
| priorityLow | = calBlue | Blauer Priority-Dot |

| Rolle | Hex | Bedeutung |
|---|---|---|
| `accent` | `#30c779` | Primary — Erledigt, Due, Apple-Intelligence-Aktionen |
| `accent2` | `#1c8a52` | Border auf Accent-Backgrounds |
| `accentBg` | `rgba(48,199,121,0.14)` | Due-/AI-Card-Background |
| `cal` | `#5e9fff` | **Outlook-Events** (konsequent, nie für Tasks) |
| `calBg` | `rgba(94,159,255,0.14)` | Event-Card-Background |
| `warn` | `#ff9f4f` | „Needs sort", Overdue |
| `warnBg` | `rgba(255,159,79,0.12)` | Warn-Background |
| `danger` | `#ff5e5e` | Destruktive Aktionen (selten) |

### Tweakable Akzent-Paletten
Der User kann zwischen sechs Akzenten wählen: Forest `#30c779`, Ocean `#5e9fff`, Terracotta `#d97757`, Lavender `#a98bff`, Amber `#f5b400`, Crimson `#ff5e5e`. Alle haben vergleichbares Chroma und Lightness — ein Akzentwechsel verändert nie die Hierarchie.

### Regel: Farbe = Bedeutung
- **Grün (`accent`):** „erledigt / fällig / vom Assistenten vorgeschlagen"
- **Blau (`cal`):** „aus Outlook, nicht editierbar"
- **Orange (`warn`):** „braucht Aufmerksamkeit"
- **Rot (`danger`):** „endgültig löschen"

Keine dekorative Farbe. Wenn etwas grau ist, hat es keine Status-Bedeutung — und das ist gut so.

---

## 5. Spacing-System

### Basis-Raster: 4
Alle Abstände sind Vielfache von 4 px. **Niemals** 3, 5, 7, 13.

| Stufe | px | SwiftUI | Verwendung |
|---|---|---|---|
| xxs | 2 | 2 | Inline-Gap in Pills |
| xs | 4 | 4 | Icon ↔ Label |
| sm | 6 – 8 | 8 | Toolbar-Button-Gap, Tag-Gap |
| md | 10 – 12 | 12 | Card-Padding-Y, Row-Gap |
| lg | 14 – 18 | 16 | Card-Padding-X, Section-Gap |
| xl | 22 – 28 | 24 | Content-Padding, Section-Margin |
| xxl | 40 + | 40 | Bottom-Spacer für Scroll-Ende |

App-spezifische Spacing-Konstanten
| Token | px | Verwendung |
|---|---|---|
| rowLeading | 12 | Icon-Container-Padding leading in Task-Rows |
| iconFrame | 36 | frame(width/height) für Icon-Wrapper |
| rowIndent | 56 | DividerLine-Einrückung (rowLeading + iconFrame + 8) |
| contentH | 24 | Horizontales Content-Padding |
| headerTop | 24 | Padding-Top in Header-Bereichen |
| headerBottom | 16 | Padding-Bottom unter Header-Divider |
| scrollBottom | 80 | Bottom-Padding in allen Scroll-Listen |

### Density-Modi (App-Setting)
Die `density`-Tweak skaliert **nur** den vertikalen Row-Gap der Timeline:
- `spacious` → 16 px
- `balanced` → 11 px (Default)
- `dense` → 8 px

Horizontale Abstände und Padding bleiben **unverändert**. Density verändert Rhythmus, nicht Layout.

### Radius-Skala
| Element | Radius |
|---|---|
| Window | 12 |
| Card / Item-Row | 10 – 14 |
| Toolbar-Button (pill) | `height/2` (= 15 für 30 hoch) |
| Sidebar-Item | 7 |
| Badge / Kbd | 4 |
| Check-Circle | 50 % |
| Glas-Popover | 14 – 18 |
| Notification | 18 |

**Regel:** Je temporärer/schwebender ein Element, desto runder. Statische Listen sind eckiger.

---

## 6. Layout-Prinzipien

### Fenster-Architektur (drei Spalten konzeptuell)
```
┌───────────┬──────────────────────────────────┐
│           │  Toolbar (sticky, glass)         │
│ Sidebar   ├──────────────────────────────────┤
│ (232 px)  │                                  │
│ translu-  │  Content                         │
│ cent      │  Padding 28 px horizontal        │
│           │  20 px top, 80 px bottom (!)     │
│           │                                  │
└───────────┴──────────────────────────────────┘
```
- **Sidebar-Breite ist fix** (232 px). Sie ist primär Navigation, sekundär Counts.
- **Content-Spalte hat üppigen Bottom-Padding** (80 px), damit das letzte Item nicht am Fensterrand klebt — der Scroll endet ruhig.

### Vertikaler Rhythmus
- Toolbar (38 – 48 px) — sticky, glass
- AI-Summary-Card oder Progress-Card (~ 60 – 80 px) — 1 pro Screen, 22 px Margin nach unten
- Content-Liste oder Timeline
- Bottom-Spacer (80 px)

### Sidebar-Innenstruktur
1. **Quick-Capture/Search-Pill** ganz oben (`⌘K`)
2. **Inbox** (immer alleinstehend, mit Badge wenn > 0)
3. **Smart** (Today, Upcoming, Someday)
4. **Projects** (4–6 Stück, max.)
5. **Spacer** (flexibel)
6. **Account-Card** unten (Avatar, Name, „Outlook · synced 2m ago")

> ⚠️ Aspiration (V2): QuickCapturePill (1.) und Account-Card (6.) sind noch nicht implementiert.
> Aktuelle Sidebar: Section-basierte `List(.sidebar)` ohne Capture-Pill und ohne Footer.

### Goldene Regeln
- **Eine primäre Aktion pro Screen.** In der Toolbar rechts. Alle anderen Buttons sind sekundär (Glass-Pill).
- **Eine AI-/Status-Karte oben** — nie zwei nebeneinander, nie verschachtelt.
- **Keine horizontalen Tabs.** Filter sind Sidebar-Items, nicht Tabs.
- **Kein Footer.** Wenn Statusinfo nötig ist, lebt sie in der Toolbar als Subtitle.

---

## 7. Komponenten-Patterns

### Check-Circle

Task-Rows mit CheckCircle bekommen einen Hover-State auf dem äusseren HStack:
.background(isHovered ? Color.surface1 : .clear, in: RoundedRectangle(cornerRadius: 6))
.onHover { isHovered = $0 }
Hover umrahmt die ganze Row, nicht nur den Check-Kreis.

Hohle Kreise (1.5 px Stroke) → bei Erledigung volle Fläche mit `IconCheck` (Stroke 2.4) in Weiß. **Drei Größen:** 16 (List), 18 (Row), 20 (Expanded). Faint-State für „noch nicht erfassbar" (z. B. inbox-leer): Border auf `textQuaternary`.

### DividerLine

Trennlinie zwischen Listen-Rows. Ersetzt System `Divider()` in allen Scroll-Listen.
```swift
DividerLine()
    .padding(.leading, Spacing.rowIndent) // 56 px — bündig mit Task-Text
```
Nie `Divider()` in Listen verwenden — Höhe und Farbe sind nicht token-kontrollierbar.

### Sidebar-Item (`SBItem`)
- Höhe ~ 30 px, Radius 7, Margin 1 px vertikal, 10 px horizontal
- Icon 15 px, Label 13.5 pt, Count rechtsbündig (tabular)
- Aktiv: `surface3`-Background, Weight 500, Icon färbt sich Accent
- Counter rechts als Capsule-Badge wenn count > 0.
Aktueller Implementierungsstand (abweichend von Spec):
Badge-Stil: Capsule mit Color.surface3 Hintergrund + Color.textSecondary Text
(NICHT Accent-gefüllt)
Badge zeigt für: Heute (todayTasks.count), Inbox (inboxTasks.count),
Review (reviewTasks.count, nur wenn > 0)
Kein Badge für: Demnächst, Projekte, Erledigt
Design-Ziel (Spec): Accent-gefüllter Pill nur für Inbox, Grau-Counts für Rest.
→ Offener Punkt: Entscheiden ob Badge-Stil angeglichen wird.


### Toolbar-Button (`GlassButton`)
- Höhe 30 px, Pill-Radius
- Primary: vollflächig Accent, weißes Icon/Label, `inset 0 1px 0 rgba(255,255,255,0.18)`
- Sekundär: `surface2`, `inset 0 1px 0 rgba(255,255,255,0.08)`, mit feinem 0.5px-Border
- Icon-only: 30 × 30. Mit Label: Padding 12 px, Icon + Text mit 6 px Gap.

### Card-Row (Timeline-Item)
Drei Spalten: **Time (56 px, tabular) | Rail (22 px, mit Dot) | Card (flex)**.
- Time-Spalte zeigt Uhrzeit nur, wenn sich die Stunde gegenüber dem Vorgänger ändert (sonst dezent leer).
- Rail-Dot ist 10 × 10 mit 1.5 px Border + 3 px farbigem Halo (`accentBg`/`calBg`).
- Card-Background tönt sich nach Status: Event = `calBg`, Due = `accentBg`, normal = `surface`.

### Inbox-Item — Expanded vs. Collapsed
- **Collapsed:** 12 px Padding, Check + Icon + Title + Meta + Status-Badge + Chevron.
- **Expanded (im Edit-Modus):** Border auf Accent, 3 px Accent-Halo (`box-shadow`), aufgeklappte Field-Rows. Nur **ein** Item gleichzeitig kann expanded sein.

### Field-Row
Im Editor: links 92 px breites Uppercase-Label (`text3`), rechts der Wert als **Chip**. Ein AI-Hint (`✨ suggested by AI`) sitzt inline rechts daneben in Accent-Farbe.

### Chip / Pill
Höhe 26 px, Radius 13 (= height/2), Icon 12 + Text 12.5 + optionaler Chevron 9. Drei Varianten:
- **Filled** (Accent-Bg + Accent2-Border): aktiver Wert
- **Ghost** (`surface2` + `divider2`): existierender Tag
- **Muted** (`text4` dashed Border): „+ Hinzufügen"

### Badge
Uppercase, 9.5 – 10.5 pt, Weight 700, Letter-Spacing 0.6, 2 × 7 Padding, Radius 4. **Drei Bedeutungen:** Status (`Due today`), Mode (`Editing`), Warning (`Needs sort`).

### Kbd
Monospace 10 pt, Tint-Background `surface2`, Radius 4, `inset 0 -1px 0 rgba(0,0,0,0.3)` für „eingedrückten" Look. Immer paarweise mit Label: `⌘↵ save`.

### AI-Summary-Card
Padding 14/18, Radius 12, `surface` mit `divider2`-Border. Links: 28 × 28-Sparkle-Tile in `accentBg2` mit `accent2`-Border. Rechts: Titel + UPPERCASE-Tag „APPLE INTELLIGENCE" in 10 pt, dann Body in `text2` mit max-width 640. Rechts neben dem Body: zwei Mini-Glass-Buttons („Replan", „Tweak").

### Notification-Stack
Eine aktive (vorn), zwei dahinter mit `rotate(-1.5deg)` / `rotate(2.5deg)`, leicht versetzt (`right: +14 / +26`) und reduzierter Opacity (0.92 / 0.78). **Niemals mehr als drei sichtbar.** Counter-Pill oben: „3 reminders ⌄".

---

## 8. Interaction Patterns

### Capture-First
- `⌘K` öffnet überall die Capture-Bar. Eine Zeile, kein Modal. Enter speichert in Inbox.
- Quick-Capture-Pill ist permanent oben in der Sidebar sichtbar — sie *ist* der Search-Input.
- Captures landen **immer in Inbox**, niemals direkt in einem Projekt. Sortierung passiert später.

### Sort-Once-Ritual
- Inbox hat einen eigenen „Process with AI"-Primary-Action.
- Während des Processings: **ein** Item expanded, mit AI-vorgeschlagenen Feldern.
- Primärer Flow: `Save & next ⌘↵` — wischt zum nächsten Item ohne Rückkehr in die Liste.
- Eskalations-Reihenfolge der Buttons: **Save & next** (primär) → **Skip** → **Delete**.

### AI-Assist (nicht AI-Automatik)
- Jeder AI-Vorschlag ist als solcher gekennzeichnet (Sparkle-Icon + Accent-Farbe).
- AI füllt Felder vor — der User akzeptiert, ändert oder verwirft. **AI committet nie eigenständig.**
- Replan-Button (Sparkle + Refresh) ist immer sichtbar, nie aufdringlich.

### Snooze-Hierarchie
Snooze ist genauso prominent wie „Done". Beide sind erste-Klasse-Aktionen. Die Snooze-Optionen sind nummeriert (`1 – 7`), damit die Tastatur den Mausweg ersetzt. Default-Markierung („1 hour") ist Accent-gefüllt.

### Keyboard-First
Jede primäre Aktion hat ein Shortcut, und der Shortcut ist **sichtbar** (Kbd-Pille rechts unten in Editoren, neben Menü-Items in Popovern). SwiftUI: `.keyboardShortcut(...)` mit `.menuCommands` und sichtbarer Hint-Zeile.

### Hover ist Information, nicht Animation
Hover auf einer Row setzt den Background von transparent auf surface1:
- Task-Rows: .background(Color.surface1, in: RoundedRectangle(cornerRadius: 6))
- Sidebar-Rows: .listRowBackground(Color.surface1)
- Kein weiterer Stufen-Hop (kein surface1 → surface2 bei doppeltem Hover-Level).

 Kein Bouncen, kein Schwellen, kein Lift. Wenn der User auf eine Reihe zeigt, soll er nur lesen.

### Drag & Drop
- Tasks lassen sich zwischen Time-Slots ziehen (Today) und zwischen Projects (Sidebar).
- Outlook-Events sind **explizit nicht draggbar** (Schlosssymbol `IconLock` markiert sie).

---

## 9. Animation Principles

### Duration & Easing
- **150 ms** (`0.15s`) für Mikro-States: Check-Toggle, Hover-Background, Chip-Selection.
- **240 ms** für Layout-Shifts: Sidebar collapse, Item-Expand.
- **320 ms** für AI-„Replan"-Reflow der Timeline.
- **Easing:** `cubic-bezier(0.4, 0.0, 0.2, 1)` (Material-ähnlich) oder SwiftUI `.spring(response: 0.4, dampingFraction: 0.85)`.

### Erlaubte Bewegungen
- **Opacity** + **2-Achsen-Translate** + **Skalierung im Bereich 0.96 – 1.04**.
- Listenwechsel: Item fadet ein **und** rutscht 6 px nach oben.
- Check-Toggle: Border-Color + Fill-Color crossfaden, Häkchen erscheint mit Scale 0.6 → 1.0 (180 ms).

### Verbotene Bewegungen
- Kein Bounce > 1.05.
- Kein Wackeln, kein Shake (auch nicht für Errors — Errors sind Inline-Text).
- Keine kontinuierlichen Loops (kein pulsierender Glow, kein Atem-Effekt) außer beim Loading-Spinner.
- Kein Parallax-Scrolling.

### Respekt für `Reduce Motion`
Bei aktiviertem System-Setting: alle Translates entfallen, nur Opacity bleibt. AI-Replan-Animation wird zu Crossfade. SwiftUI: `@Environment(\.accessibilityReduceMotion)`.

---

## 10. macOS-spezifische UX-Prinzipien

### Window
- **Traffic Lights** sitzen in der Sidebar-Top-Zone (11 px Top, 14 px Left). Nicht in der Toolbar.
- **Sidebar ist Drag-Region** (außer auf Items selbst).
- **Window-Radius 12**, doppelter Shadow (`0 0 0 0.5px white, 0 24px 60px black/0.45`).
- **Vibrancy:** Sidebar nutzt `.sidebar`-Material in SwiftUI, Toolbar nutzt `.menuBar`/`.regular`.

### Menüleiste
Hat einen eigenen App-Eintrag „To Do" (fett, nach Apple-Logo) mit Standard-macOS-Menüs: File, Edit, View, Window, Help.

### Notification Center
- Native System-Notifications, nicht In-App-Toasts.
- Actions im Notification: **Mark done**, **Open**, **Snooze ▼** — entsprechen `UNNotificationAction`.
- Stack-Verhalten respektiert macOS Notification Center: gestapelte Reminders mit Counter-Pill.

### Dock-Badge
Anzahl der **überfälligen** Tasks (nicht aller offenen). Rote `unreadCount`-Badge. SwiftUI: `NSApp.dockTile.badgeLabel`.

### Spotlight / Quick-Capture-Global-Hotkey
`⌃⌥⌘Space` öffnet ein systemweites Capture-Fenster (wie Spotlight) — auch wenn die App im Hintergrund ist. Schließt sich automatisch nach Enter.

### Continuity
- **Handoff** mit iOS-Capture-App.
- **iCloud-Sync** als Default. Outlook-Account nur für Kalender-Read-Only.
- **Universal Clipboard** wird respektiert (eingefügte Notizen werden zu Inbox-Items).

### Fenster-States
- App ist **single-window**. „New Window" öffnet keine zweite Liste, sondern ein Capture-Sheet.
- Sidebar lässt sich collapsen (`⌥⌘S`), nicht resizen — die Breite ist Designentscheidung.

### Print / Export
Nicht prominent. Verfügbar über `File → Export Today as PDF`, formatiert für eine A4-Seite, ohne Glas-Effekte, schwarze Schrift auf Weiß.

---

## 11. Was bewusst vermieden wird

### Dashboard-Anti-Patterns
- **Keine Stats-Tiles** („7 erledigt diese Woche", „3-Tage-Streak").
- **Keine Charts**. Auch keine Mini-Sparklines.
- **Keine Wochen-/Monats-Übersicht** als Default-View. Default ist immer Heute.
- **Keine Heatmap**, kein „Activity Graph".

### Jira-/Notion-Anti-Patterns
- **Keine Custom-Properties / Datenbank-Views**. Felder sind fix: Project, Due, Remind, Est. Time, Tags.
- **Keine Templates** für Tasks.
- **Keine Linked-References, keine Backlinks.**
- **Keine Status-Workflows** (To do / In progress / Review). Eine Task ist offen oder erledigt.
- **Keine Kommentare an Tasks.**
- **Kein Inline-Markdown-Editor.** Notiz-Feld ist Plain-Text + Optional 1 Anhang.

### Verspielte Anti-Patterns
- **Keine Emoji als Projekt-Icons** (nur SF-Symbols-Style-Line-Icons).
- **Keine Konfetti-Animationen**, keine Punkte, keine Streaks bei Erledigung.
- Erlaubt: dezente CheckCircle-Animation (Kreis füllt sich, Häkchen mit Spring) einmaliger NSSound „Hero" — als hochwertiges, nicht verspieltes Feedback.
- Nicht erlaubt: Konfetti, Score-Counter, „+10 XP"-Einblendungen, Streak-Anzeige.

- **Keine Maskottchen, keine Onboarding-Wizards mit „Hi, ich bin Ada!"**.

### Visuelle Anti-Patterns
- **Keine Gradients als Card-Background** (Gradient nur auf Wallpaper und Avatar).
- **Keine vollfarbigen Buttons außer Primary**.
- **Keine Drop-Shadows auf Cards** (nur auf schwebenden Glass-Layern).
- **Keine ausgegrauten Disabled-States für aktive Felder** — fehlende Aktionen werden weggelassen, nicht ausgegraut.
- **Keine Tooltips für offensichtliche Icons** (Toolbar-Refresh, -Search, -Sidebar).

### Sprache, die nicht verwendet wird
- „Awesome!", „Great job!", „Let's go!"
- „You have X tasks left" (stattdessen sachlich: „6 tasks · 3h 10m free")
- „Don't forget…"
- Ausrufezeichen — generell sehr selten.

---

## 12. Wiederverwendbare UI-Regeln

Als kompakter Cheat-Sheet beim Bauen neuer Screens:

1. **Eine primäre Aktion pro Screen** — sie sitzt rechts oben in der Toolbar, gefüllt mit Accent.
2. **Maximal zwei Akzentfarben gleichzeitig** sichtbar.
3. **Glass nur für Schwebendes** (Toolbar, Popover, Notification, Dock).
4. **Surfaces sind getintetes Weiß**, nie ein anderer Farbton.
5. **Borders sind 0.5 px** mit Alpha 0.07 – 0.30.
6. **Innenkanten** (`inset 0 1px 0 rgba(255,255,255,0.08)`) auf allen interaktiven Materialien.
7. **Spacing in Vielfachen von 4.**
8. **Negative Letter-Spacing** ab 13 pt aufwärts.
9. **Tabular-Numerals** für jede vertikal alignierte Zahl.
10. **Status = Farbe** (grün/blau/orange/rot), Dekoration = grau.
11. **Outlook-Items sind blau, nie editierbar, mit Schloss-Icon.**
12. **Uppercase nur für Section-Labels und Status-Badges**, immer mit +0.4 bis +0.6 Letter-Spacing.
13. **Counts in Sidebar:** Badge (Capsule) für Heute, Inbox, Review (wenn > 0).
- Kein Badge für Demnächst, Projekte, Erledigt.
- Badge-Stil aktuell: surface3/textSecondary — kein Accent-Fill.
- (Design-Ziel-Diskussion offen: ob Inbox-Badge Accent erhält.)
14. **80 px Bottom-Padding** auf jeder Scroll-Liste.
15. **Mindestens ein Keyboard-Shortcut sichtbar pro Editor.**
16. **Eine AI-Card oben pro Screen**, nie zwei.
17. **Notification-Stack zeigt max. 3 Karten.**
18. **Bei jeder neuen Komponente:** Prüfe, ob ein bestehender Component-Pattern (Card-Row, Chip, Field-Row, GlassButton) ausreicht, bevor du Neues baust.

---

## 13. Empfehlungen für SwiftUI-Komponentenstruktur

> ⚠️ Section 13 beschreibt den angestrebten Architektur-Zielstand (V2+), nicht den aktuellen MVP-Stand.
>
> Aktueller Stand (nach Schritt 6C):
> - ObservableObject statt @Observable
> - JSON + PersistenceService statt SwiftData
> - Kein CloudKit, kein EventKit, kein AppIntents
> - Datei-Layout: `FocusFlow/` (nicht `TodoApp/`) — siehe CLAUDE_CONTEXT.md
>
> Diese Prinzipien gelten dennoch als Leitlinie für alle Architektur-Entscheidungen.

### Architektur-Ansatz
- **MV(VM)** mit `@Observable` (Swift 5.9+) statt MVVM-Boilerplate.
- **SwiftData** für lokale Persistenz, **CloudKit-Sync** für Geräteübergreifend.
- **EventKit** für Outlook-Read-Only (über `EKEventStore`, Source-Filter auf Outlook-Account).
- **AppIntents** für „Add To Do"-Shortcut + Spotlight-Capture.

### Datei-/Modul-Layout
```
TodoApp/
├── App/
│   ├── TodoApp.swift                  // @main
│   └── AppEnvironment.swift           // shared singletons
├── DesignSystem/
│   ├── Tokens/
│   │   ├── Color+Tokens.swift         // accent, surface, text levels
│   │   ├── Typography.swift           // Font + LetterSpacing helpers
│   │   ├── Spacing.swift              // .xs/.sm/.md/.lg/.xl
│   │   └── Radius.swift
│   ├── Materials/
│   │   ├── GlassBackground.swift      // ViewModifier
│   │   ├── SurfaceCard.swift
│   │   └── InsetHighlight.swift       // 1px inner highlight modifier
│   ├── Atoms/
│   │   ├── CheckCircle.swift
│   │   ├── Chip.swift                 // Filled / Ghost / Muted
│   │   ├── Badge.swift                // UPPERCASE-Status
│   │   ├── Kbd.swift
│   │   ├── GlassButton.swift          // Primary / Secondary
│   │   └── SectionLabel.swift         // UPPERCASE-Header
│   ├── Molecules/
│   │   ├── FieldRow.swift             // Label + Chip-Value
│   │   ├── SidebarItem.swift
│   │   ├── SidebarSection.swift
│   │   ├── ToolbarHeader.swift        // Title + Subtitle + Actions
│   │   ├── TimelineRow.swift          // Time | Rail | Card
│   │   ├── AISummaryCard.swift
│   │   └── ProgressCard.swift
│   └── Organisms/
│       ├── AppSidebar.swift           // StandardSidebar-Equivalent
│       └── NotificationStack.swift    // 3-card-Layout
├── Features/
│   ├── Today/
│   │   ├── TodayView.swift
│   │   ├── TodayModel.swift           // @Observable
│   │   └── TodayPlanner.swift         // AI-Replan
│   ├── Inbox/
│   │   ├── InboxView.swift
│   │   ├── InboxProcessingView.swift  // expanded item
│   │   └── InboxModel.swift
│   ├── Capture/
│   │   ├── CaptureBar.swift           // ⌘K + global hotkey
│   │   └── CaptureService.swift
│   ├── Notification/
│   │   └── ReminderService.swift      // UNUserNotificationCenter
│   └── Settings/
│       ├── SettingsView.swift
│       ├── AccentPicker.swift         // 6 swatches
│       └── DensityPicker.swift
├── Models/
│   ├── Task.swift                     // SwiftData @Model
│   ├── Project.swift
│   ├── Tag.swift
│   └── CalendarEvent.swift            // Outlook (transient)
├── Services/
│   ├── OutlookCalendarService.swift   // EventKit wrapper
│   ├── AIPlannerService.swift         // Apple Intelligence
│   └── SyncCoordinator.swift          // CloudKit
└── Resources/
    └── Assets.xcassets                // Accent colors only
```

### Design-Token-Beispiele

```swift
// Color+Tokens.swift
extension Color {
    static let surface1 = Color.white.opacity(0.04)
    static let surface2 = Color.white.opacity(0.07)
    static let surface3 = Color.white.opacity(0.10)
    static let divider1 = Color.white.opacity(0.07)
    static let divider2 = Color.white.opacity(0.12)
    static let textPrimary    = Color.white.opacity(0.94)
    static let textSecondary  = Color.white.opacity(0.62)
    static let textTertiary   = Color.white.opacity(0.40)
    static let textQuaternary = Color.white.opacity(0.22)

    static let accentForest = Color(red: 0.188, green: 0.78, blue: 0.475)
    static let calendarBlue = Color(red: 0.369, green: 0.624, blue: 1.0)
    static let warnOrange   = Color(red: 1.0, green: 0.624, blue: 0.31)
}

// Spacing.swift
enum Spacing {
    static let xxs: CGFloat = 2
    static let xs:  CGFloat = 4
    static let sm:  CGFloat = 8
    static let md:  CGFloat = 12
    static let lg:  CGFloat = 16
    static let xl:  CGFloat = 24
    static let xxl: CGFloat = 40
}
```

### Materialien als ViewModifier

```swift
struct InsetHighlight: ViewModifier {
    func body(content: Content) -> some View {
        content
            .overlay(alignment: .top) {
                Rectangle()
                    .fill(Color.white.opacity(0.08))
                    .frame(height: 1)
                    .blendMode(.overlay)
            }
    }
}

struct GlassBackground: ViewModifier {
    var radius: CGFloat = 14
    func body(content: Content) -> some View {
        content.background(
            RoundedRectangle(cornerRadius: radius, style: .continuous)
                .fill(.regularMaterial)
                .overlay(
                    RoundedRectangle(cornerRadius: radius, style: .continuous)
                        .strokeBorder(.white.opacity(0.10), lineWidth: 0.5)
                )
        )
    }
}
```

### Globale Tweak-Settings
- **AppStorage** für `accentColor` und `density` (`@AppStorage("accent") var accent: String`).
- Beide Werte fließen über die `Environment` in jede View ein (`@Environment(\.accentColor)`).

### State-Konventionen
- **Listen-State live im Model**, nicht in der View (`@Observable`).
- **Selection per ID**, nicht per Object-Reference.
- **Optimistic Updates** für Toggle/Snooze — UI ändert sich sofort, Sync läuft im Hintergrund.

### Accessibility-Pflicht
- Alle interaktiven Elemente bekommen `.accessibilityLabel` + `.accessibilityHint`.
- Status-Farben werden **zusätzlich** über Symbole kommuniziert (`exclamationmark`, `lock`).
- VoiceOver-Rotor: Custom-Group für „Today Timeline" mit chronologischer Navigation.
- Dynamic Type: Skala bleibt eng — App unterstützt bis `.large`, größere Werte mappen auf Layout-Reflow (Sidebar collapse).

### Animation-API
```swift
extension Animation {
    static let microState = Animation.spring(response: 0.15, dampingFraction: 1.0)
    static let layoutShift = Animation.spring(response: 0.24, dampingFraction: 0.9)
    static let aiReplan = Animation.spring(response: 0.32, dampingFraction: 0.85)
}
```

### Globale Hotkeys
- `⌘K` (in-app): Capture-Bar
- `⌃⌥⌘Space` (global): System-Capture-Sheet via `HotKey`-Package oder `NSEvent.addGlobalMonitorForEvents`
- `⌘⌥S`: Toggle Sidebar
- `⌘↵` (im Inbox-Editor): Save & next
- `⌘N`: New Task (in aktueller Liste)
- `1 – 7` (im Snooze-Popover): Auswahl

---

## Schlusssatz

Wenn ein neues Feature ansteht, frage in dieser Reihenfolge:

1. **Macht es den Kopf leichter?** Wenn nein, weglassen.
2. **Lässt es sich in eine bestehende Komponente einbauen?** Wenn ja, dort einbauen.
3. **Braucht es eine neue Farbe?** Wenn ja, neu denken — vermutlich reicht eine bestehende.
4. **Braucht es eine Animation, die länger als 320 ms dauert?** Wenn ja, neu denken.
5. **Erfordert es vom User eine Entscheidung, die er nicht selbst gestellt hat?** Wenn ja, weglassen oder an AI delegieren.

Das ist die Linie.
