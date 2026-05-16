# Komponenten-Inventar — To Do App

**Stand:** Mai 2026
**Basis:** `hifi.jsx` (Design-Spec) + SwiftUI-Implementierung bis Schritt 6C
**Hinweis:** Dieses Dokument beschreibt den angestrebten Zielstand.
Abschnitte mit ⚠️ weichen in der aktuellen Implementierung ab.
**Zweck:** Vollständiges Inventar aller wiederverwendbaren UI-Bausteine als Grundlage für ein konsistentes SwiftUI-Komponenten-System.

---

## Struktur

Komponenten sind nach **Atomic-Design-Schichten** organisiert:

- **Foundation** — Materialien, Hintergründe (kein eigenständiges UI)
- **Atoms** — kleinste eigenständige Bausteine
- **Molecules** — kombinierte Atome mit klarer Rolle
- **Organisms** — komplette UI-Bereiche, screen-fähig
- **Layout-Shells** — Fenster- und Wallpaper-Strukturen

Jeder Eintrag folgt demselben Schema:

| Feld | Bedeutung |
|---|---|
| **Zweck** | Wann verwende ich diese Komponente? |
| **Visuell** | Größen, Farben, Typografie, Radien |
| **States** | Alle möglichen Zustände |
| **Interaktion** | Hover, Tap, Keyboard, Drag |
| **SwiftUI** | API-Signatur und Implementations-Skizze |
| **Wiederverwendbarkeit** | Wo überall einsetzbar? |
| **Varianten** | Vorhandene + denkbare Ausprägungen |

---

# Foundation

## F1 · Wallpaper

**Zweck**
Globaler Hintergrund des App-Fensters und Notification-Screens. Liefert „Aurora"-Stimmung ohne dominante Flächen.

**Visuell**
- Linearer Gradient `160°` von `#0d1612` → `#0a0e0d`
- Drei radiale Glow-Blobs:
  - Oben links: 420×380, `accent` mit 0.2 Alpha, 40 px Blur
  - Unten rechts: 460×420, `#1a4d70` mit 0.67 Alpha, 50 px Blur
  - Mitte: 240×240, `accent` mit 0.1 Alpha, 60 px Blur
- Vibe-Variante steuerbar (`aurora` ist Default)

**States**
Statisch. Reagiert nur auf Accent-Wechsel.

**Interaktion**
Keine.

**SwiftUI**
⚠️ Implementiert: Einfacher LinearGradient (wallTop → wallBottom), keine Glow-Blobs.
Blob-Overlays sind Spec, noch nicht umgesetzt.
```swift
struct AuroraWallpaper: View {
    @Environment(\.accentColor) var accent: Color
    var body: some View {
        LinearGradient(colors: [Color(hex: 0x0d1612), Color(hex: 0x0a0e0d)],
                       startPoint: .topLeading, endPoint: .bottomTrailing)
            .overlay(GlowBlob(color: accent.opacity(0.2), size: 420)
                .offset(x: -60, y: -40), alignment: .topLeading)
            .overlay(GlowBlob(color: Color(hex: 0x1a4d70).opacity(0.67), size: 460)
                .offset(x: 60, y: 80), alignment: .bottomTrailing)
            .ignoresSafeArea()
    }
}
```

**Wiederverwendbarkeit**
- Hauptfenster
- Notification-Center-Hintergrund
- Onboarding-/Settings-Sheet-Background
- Lock-Screen-Widget-Vorschau

**Varianten**
- `aurora` (Default, Grün/Blau)
- `dusk` (Lila/Orange, denkbar)
- `noir` (Reine Schwarz-Schattierung ohne Blobs — für „Focus Mode")

---

## F2 · Glass-Material

**Zweck**
Material für schwebende, temporäre UI-Elemente. Markiert *„nicht permanent, gleich wieder weg"*.

**Visuell**
- Background: `rgba(255,255,255,0.05)` (light) oder `rgba(28,30,29,0.72)` (strong)
- `backdrop-filter: blur(40px) saturate(180%)`
- Border: `0.5px solid rgba(255,255,255,0.10)`
- Innenkante: `inset 0 1px 0 rgba(255,255,255,0.08)`
- Radius: 14 (Standard), 18 (Notification), 22 (Pill)

**States**
- `light` — minimaler Tint (z. B. Toolbar über Wallpaper)
- `strong` — opaker Tint (z. B. Popover, Notification)

**Interaktion**
Keine direkt — Container für andere Komponenten.

**SwiftUI**
```swift
struct GlassBackground: ViewModifier {
    var radius: CGFloat = 14
    var strong: Bool = false
    func body(content: Content) -> some View {
        content.background(
            RoundedRectangle(cornerRadius: radius, style: .continuous)
                .fill(strong ? .ultraThinMaterial : .thinMaterial)
                .environment(\.colorScheme, .dark)
                .overlay(
                    RoundedRectangle(cornerRadius: radius, style: .continuous)
                        .strokeBorder(.white.opacity(0.10), lineWidth: 0.5)
                )
                .overlay(alignment: .top) {
                    Rectangle().fill(.white.opacity(0.08))
                        .frame(height: 1)
                        .mask(RoundedRectangle(cornerRadius: radius))
                }
        )
    }
}
extension View {
    func glass(radius: CGFloat = 14, strong: Bool = false) -> some View {
        modifier(GlassBackground(radius: radius, strong: strong))
    }
}
```

**Wiederverwendbarkeit**
Toolbar, Popover, Notification, Dock, Spotlight-Capture-Bar, Tooltip (falls je nötig).

**Varianten**
- Light vs. Strong
- Verschiedene Radien

---

## F3 · Surface-Card

**Zweck**
Statische Inhaltsfläche innerhalb des Fensters. Anti-Pattern zu Glass: Surface = „bleibt liegen".

**Visuell**
- Background: `rgba(255,255,255,0.04)` (`surface`) bis `0.10` (`surface3`)
- Border: `0.5px solid rgba(255,255,255,0.07–0.12)`
- Radius: 10 – 14 je nach Größe
- Optional Innenkante `inset 0 1px 0 rgba(255,255,255,0.05)`

**States**
- `idle` — `surface`
- `hover` — `surface2`
- `active` / `selected` — `surface3`
- `emphasized` — Border auf Accent, plus 3 px Accent-Halo via Shadow

**Interaktion**
Hover-Transition 150 ms zwischen Tint-Stufen.

**SwiftUI**
```swift
struct SurfaceCard<Content: View>: View {
    var emphasized: Bool = false
    var radius: CGFloat = 12
    @ViewBuilder var content: Content
    @State private var hovered = false
    var body: some View {
        content.background(
            RoundedRectangle(cornerRadius: radius, style: .continuous)
                .fill(Color.surface(level: hovered ? 2 : 1))
                .overlay(
                    RoundedRectangle(cornerRadius: radius)
                        .strokeBorder(emphasized ? Color.accent : .white.opacity(0.12),
                                      lineWidth: 0.5)
                )
                .shadow(color: emphasized ? Color.accent.opacity(0.25) : .clear,
                        radius: 3, x: 0, y: 0)
        )
        .onHover { hovered = $0 }
        .animation(.microState, value: hovered)
    }
}
```

**Wiederverwendbarkeit**
Inbox-Row, Timeline-Card, AI-Summary, Progress-Card, Account-Card, jede Listen-Zelle.

**Varianten**
- Status-getöntes Background (Due → `accentBg`, Event → `calBg`, Warn → `warnBg`) — implementiert als optionaler Tint-Color-Override.

---

# Atoms

## A1 · Icon

**Zweck**
Stroke-Linie-Icon-Set im SF-Symbols-Stil für die gesamte App.

**Visuell**
- 24 × 24 Viewbox
- Standard-Render-Size: 11 – 17 px
- Stroke-Width: 1.6 – 2.4 (Default 1.6; im Check-Mark 2.4)
- `currentColor` — übernimmt Parent-Farbe
- `strokeLinecap: round`, `strokeLinejoin: round`
- Niemals Fill, außer bei „solid"-Glyphen (Dots, Sparkle, Flag-Inhalt)

**States**
- Implizit: erbt von Parent (Color, Opacity)
- Inaktiv: `text3` (40 % weiß)
- Aktiv: `text` (94 %) oder Accent
- Disabled: `text4` (22 %)

**Interaktion**
Keine eigenständig — immer Teil eines Containers (Button, Row, Chip).

**SwiftUI**
Auf macOS direkt **SF Symbols** verwenden — kein Custom-Set nötig. Mapping:

| App-Icon | SF Symbol |
|---|---|
| `IconTray` | `tray` |
| `IconSun` | `sun.max` |
| `IconCalendar` | `calendar` |
| `IconCalendarStack` | `calendar.badge.clock` |
| `IconCloud` | `cloud` |
| `IconFolder` | `folder` |
| `IconBell` | `bell` |
| `IconSparkle` | `sparkles` |
| `IconLock` | `lock` |
| `IconPlus` | `plus` |
| `IconSearch` | `magnifyingglass` |
| `IconSidebar` | `sidebar.left` |
| `IconChevronDown` | `chevron.down` |
| `IconCheck` | `checkmark` |
| `IconClock` | `clock` |
| `IconFlag` | `flag` |
| `IconRepeat` | `arrow.triangle.2.circlepath` |
| `IconTag` | `tag` |
| `IconHashtag` | `number` |
| `IconArrowRight` | `arrow.right` |
| `IconMore` | `ellipsis` |
| `IconX` | `xmark` |
| `IconRefresh` | `arrow.clockwise` |
| `IconPhone` | `phone` |
| `IconMail` | `envelope` |
| `IconBriefcase` | `briefcase` |
| `IconHome` | `house` |
| `IconBook` | `book` |

```swift
struct AppIcon: View {
    let name: String          // SF Symbol name
    var size: CGFloat = 15
    var weight: Font.Weight = .medium
    var body: some View {
        Image(systemName: name)
            .font(.system(size: size, weight: weight))
            .imageScale(.medium)
    }
}
```

**Wiederverwendbarkeit**
Überall, wo bildhafte Information nötig ist.

**Varianten**
- Linear (Default)
- Filled (für Sparkle, Dots in `IconMore`)

---

## A2 · CheckCircle

**Zweck**
Erledigt-/Offen-Zustand einer Aufgabe.

**Visuell**
- Drei Größen: 16 (List), 18 (Row), 20 (Expanded Editor)
- Idle: hohler Kreis, 1.5 px Border
  - Default-Border: `text3`
  - Faint-Variante: `text4`
- Checked: voll Accent, weißes Häkchen, Häkchen-Stroke 2.4
- Border-Color wechselt synchron mit Fill

**States**
- `unchecked` (default)
- `unchecked-faint` (für inaktive/disabled Listen-Items)
- `checked` (Accent-Fill, weißes ✓)
- `indeterminate` (denkbar für Section-Headers — halbes Häkchen oder Minus)

**Interaktion**
- Tap toggelt — sofortige optische Reaktion, async-Persistenz
- 150 ms Crossfade Border-Color + 180 ms Scale 0.6 → 1.0 für ✓
- Optional: Bei Erledigung leichter Strikethrough auf Row-Title (350 ms verzögert)

**SwiftUI**
```swift
⚠️ Implementierte API weicht von Spec ab:
// Aktuelle Implementierung (CheckCircle.swift):
struct CheckCircle: View {
    let isCompleted: Bool
    let action: () -> Void
    // Kein @Binding — State liegt in TaskRowView
}
// Spec-Signatur (noch nicht implementiert):
// @Binding var checked: Bool + withAnimation { checked.toggle() }
```

**Wiederverwendbarkeit**
Timeline-Row, Inbox-Row, Expanded-Editor, Subtask-Liste (V2).

**Varianten**
- Priorität-Modifier (kleine Flagge oben rechts, denkbar für V2)
- Recurring-Indicator (Mini-Repeat-Glyph statt Check-Border)

---

## A3 · Badge

**Zweck**
Status-Marker in Großbuchstaben. Kurz, hochfrequent erkennbar.

**Visuell**
- Schrift: 9.5 – 10.5 pt, Weight 700, Letter-Spacing 0.6, UPPERCASE
- Padding: 2 – 3 vertikal, 7 – 8 horizontal
- Radius: 4
- Background: tint passend zur Bedeutung
- Border: `0.5px` in derselben Farbe

**Bekannte Instanzen**
- `Due today` — Accent-Bg, Accent-Border, Accent-Text
- `Editing` — selbe Farbgebung
- `Needs sort` — Warn-Bg, Warn-Border, Warn-Text
- `Apple Intelligence` — *kein* Background, nur Letter-Spacing-Text

**States**
- `info` (Accent)
- `warn` (Orange)
- `danger` (Rot, für „Overdue")
- `neutral` (Grau, denkbar für „Draft")

**Interaktion**
Keine — rein semantisch.

**SwiftUI**

⚠️ Noch nicht als eigenständiges Atom implementiert.
Aktuelle Umsetzung: Inline-Pattern in SidebarView (Sidebar-Badge) und
TaskRowView (Deadline-Chip). Kein Badge.swift vorhanden.
Sidebar-Badge (aktuell):
Text("\(badge)")
    .font(.caption2).fontWeight(.semibold)
    .foregroundStyle(Color.textSecondary)
    .padding(.horizontal, 6).padding(.vertical, 2)
    .background(Color.surface3, in: Capsule())
Deadline-Chip (aktuell):
Text(deadline, format: .dateTime.day().month())
    .foregroundStyle(isOverdue ? Color.danger : Color.calBlue)
    .padding(.horizontal, 6).padding(.vertical, 2)
    .background(isOverdue ? Color.warnBg : Color.calBg, in: Capsule())

```swift
enum BadgeTone { case info, warn, danger, neutral }

struct Badge: View {
    let text: String
    var tone: BadgeTone = .info
    @Environment(\.accentColor) var accent
    private var color: Color {
        switch tone {
        case .info: return accent
        case .warn: return .warnOrange
        case .danger: return Color(hex: 0xff5e5e)
        case .neutral: return .textSecondary
        }
    }
    var body: some View {
        Text(text.uppercased())
            .font(.system(size: 10, weight: .bold))
            .tracking(0.6)
            .foregroundStyle(color)
            .padding(.horizontal, 7).padding(.vertical, 2.5)
            .background(
                RoundedRectangle(cornerRadius: 4)
                    .fill(color.opacity(0.14))
                    .overlay(RoundedRectangle(cornerRadius: 4)
                        .strokeBorder(color.opacity(0.4), lineWidth: 0.5))
            )
    }
}
```

**Wiederverwendbarkeit**
Liste-Items, Editor-Header, Notification-Card, Settings-Status („Synced").

**Varianten**
- Mit kleinem Icon links (z. B. `lock` für Calendar-Events)
- Pill-Form mit Höhe height/2 statt 4er-Radius (nicht in V1)

---

## A4 · Chip

**Zweck**
Editierbarer Wert in einem Formular oder Filter. Größer und „klickbarer" als ein Badge.

**Visuell**
- Höhe 26 px, Padding 10 horizontal, Radius 13 (= height/2)
- Icon 12 + Label 12.5 pt + optionaler Chevron 9 pt
- Gap: 6 px

**Varianten**
| Variante | Background | Border | Bedeutung |
|---|---|---|---|
| `filled` | `accentBg` | `0.5px accent2` | aktiver, gesetzter Wert |
| `ghost` | `surface2` | `0.5px divider2` | existierender Tag |
| `muted` | transparent | `0.5px dashed text4` | Add-Action („+ Add tag") |
| `outlook` | `calBg` | `0.5px rgba(94,159,255,0.30)` | Outlook-Verknüpfung (nicht editierbar) |

**States**
- `idle`, `hover` (surface +1), `active` (Popover offen → Border voller Accent)
- `disabled` (für Outlook): nur Cursor-Default, keine Hover-Reaktion

**Interaktion**
Klick öffnet kontextbezogenen Popover (Project-Picker, Date-Picker, Tag-Suche).

**SwiftUI**
```swift
struct Chip<Content: View>: View {
    var icon: String
    var label: String
    var variant: ChipVariant = .filled
    var showChevron: Bool = true
    var action: () -> Void = {}
    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Image(systemName: icon).font(.system(size: 11, weight: .medium))
                Text(label).font(.system(size: 12.5, weight: .medium)).tracking(-0.1)
                if showChevron {
                    Image(systemName: "chevron.down").font(.system(size: 9, weight: .bold))
                        .foregroundStyle(.textTertiary)
                }
            }
            .padding(.horizontal, 10).frame(height: 26)
            .background(variant.background)
            .clipShape(Capsule())
            .overlay(Capsule().strokeBorder(variant.border, style: variant.stroke))
        }.buttonStyle(.plain)
    }
}
```

**Wiederverwendbarkeit**
Inbox-Editor-FieldRow, Filter-Bar (V2), Tag-Cloud, Suggestion-Strip.

**Mögliche Varianten**
- `image`-Chip mit Avatar-Glyph (für „Assigned" — falls Multi-User je kommt)
- Größen `sm` (22) / `lg` (32) für Touch / Dense

---

## A5 · GlassButton

**Zweck**
Toolbar-Button und CTA-Pill. Pill-shape, Glass-Material oder Solid-Accent.

**Visuell**
- Höhe 30 px (`sm` 26, `lg` 36 möglich)
- Padding: 0 bei Icon-only, 12 mit Label
- Radius: `height/2` → 15 / 13 / 18
- Icon 13 – 14 px + Label 12.5 pt, Gap 6
- Primary: Vollflächig Accent, weiß, Innenkante `rgba(255,255,255,0.18)`
- Secondary: `surface2`, Innenkante `rgba(255,255,255,0.08)`, Border `0.5px rgba(255,255,255,0.06)`

**States**
- `idle`, `hover` (Background heller +5 %), `pressed` (Scale 0.97, 80 ms)
- `disabled` (Opacity 0.4, kein Hover)
- `loading` (Spinner statt Icon, Label bleibt)

**Interaktion**
- Tap auslöst Action
- Keyboard-Shortcut wird inline rechts angezeigt (optional Prop)
- Tooltip bei Icon-only nach 500 ms (nur dann — sonst nicht)

**SwiftUI**
```swift
// Aktuelle Implementierung (GlassButton.swift):
struct GlassButton: View {
    let systemImage: String
    var label: String? = nil
    var variant: GlassButtonVariant  // .primary / .secondary
    let action: () -> Void
}
// Spec-Signatur (icon: String?, label: String?, primary: Bool) — noch nicht angeglichen.
```

**Wiederverwendbarkeit**
Toolbar-Actions, Notification-Actions, Editor-Footer („Save & next"), Empty-State-CTA.

**Varianten**
- Icon-only / Label-only / Icon + Label
- Primary / Secondary / Ghost (3. Variante denkbar: ohne Background, nur Text)
- Mini (24px) für In-Card-Actions (Replan/Tweak in AI-Card)

---

## A6 · Kbd

**Zweck**
Visualisierung eines Tastatur-Kürzels neben einer Aktion.

**Visuell**
- Schrift: 10 pt, Monospace (`SF Mono`)
- Padding: 1 – 2 vertikal, 6 horizontal
- Radius: 4
- Background: `surface2`
- Text-Color: `text2`
- Innenschatten unten: `inset 0 -1px 0 rgba(0,0,0,0.3)` für „eingedrückten" Look
- Outline: `0 0 0 0.5px rgba(255,255,255,0.06)`

**States**
Statisch.

**Interaktion**
Keine — rein Information.

**SwiftUI**
```swift
struct Kbd: View {
    let label: String
    var body: some View {
        Text(label)
            .font(.system(size: 10, design: .monospaced))
            .foregroundStyle(.textSecondary)
            .padding(.horizontal, 6).padding(.vertical, 1.5)
            .background(
                RoundedRectangle(cornerRadius: 4)
                    .fill(Color.surface(level: 2)) // ⚠️ Spec: Color.surface(level:) — nicht implementiert. Verwende Color.surface2
                    .overlay(RoundedRectangle(cornerRadius: 4)
                        .strokeBorder(.white.opacity(0.06), lineWidth: 0.5))
                    .overlay(alignment: .bottom) {
                        Rectangle().fill(.black.opacity(0.3))
                            .frame(height: 1)
                            .mask(RoundedRectangle(cornerRadius: 4))
                    }
            )
    }
}
```

**Wiederverwendbarkeit**
Editor-Footer (⌘↵, Esc), Snooze-Popover (1–7), Menu-Items in Popover, Onboarding-Hints.

**Varianten**
- Multi-Kbd-Group (mehrere `Kbd` mit `+`-Trennung)
- Inverse (auf farbigem Background)

---

## A7 · SectionLabel

**Zweck**
Visuelle Trennung von Listen-Sektionen ohne Linie.

**Visuell**
- Schrift: 10.5 – 11 pt, Weight 600, Letter-Spacing 0.4
- Color: `text3`
- Padding: meist Top 22 – 24 + Bottom 10 px
- Niemals UPPERCASE im Sidebar (dort Sentence-Case), aber UPPERCASE in Content-Area (z. B. „UP NEXT", „SORTED TODAY")

**States**
Statisch.

**Interaktion**
Optional: collapsable mit kleinem Chevron rechts (nicht in V1).

**SwiftUI**

✅ Implementiert in SectionLabel.swift.
Abweichung: Kein `uppercased`-Parameter — Text wird immer unverändert gerendert.
Verwendet .textCase(.uppercase) nicht; aktuelle Implementierung lässt die Formatierung dem Aufrufer. Überprüfen ob smallcaps statt uppercase verwendet wird.

```swift
struct SectionLabel: View {
    let text: String
    var uppercased: Bool = true
    var body: some View {
        Text(uppercased ? text.uppercased() : text)
            .font(.system(size: 11, weight: .semibold))
            .tracking(uppercased ? 0.4 : 0.2)
            .foregroundStyle(.textTertiary)
    }
}
```

**Wiederverwendbarkeit**
Sidebar-Sektionen („Smart", „Projects"), Content-Lists („Up next", „Sorted today"), Settings-Gruppen.

**Varianten**
- Mit rechter Action (kleiner „+"-Button, denkbar)
- Mit Counter rechts

---

## A8 · TrafficLights

**Zweck**
macOS-Window-Controls (Close, Minimize, Zoom).

**Visuell**
- Drei Dots 12 × 12, 8 px Gap
- Farben: `#ff5f57` / `#febc2e` / `#28c840`
- Innenschatten `inset 0 0 0 0.5px rgba(0,0,0,0.25)`

**States**
- `idle` (Dots ohne Glyph)
- `hover` über Window (Glyphen erscheinen: ✕ / − / ＋)
- `inactive` (Window nicht fokussiert): Dots werden grau

**Interaktion**
Klick: Standard-Window-Aktionen. Doppelklick auf Title-Region: zoom.

**SwiftUI**
**Nicht selbst bauen.** Native NSWindow-Buttons über `NSWindow.standardWindowButton`. Lediglich Layout-Reservierung (78 × 30 px im Sidebar-Top).

**Wiederverwendbarkeit**
Nur im Hauptfenster. In Sheets/Popover gibt's eigene Close-Buttons.

---

## A8b · DividerLine ✅ implementiert

**Zweck**
Trennlinie zwischen Listen-Rows. Ersetzt System-Divider() in allen Haupt-Listen.

**Visuell**
- Höhe: 0.5px
- Farbe: Color.divider1 (white 7%)
- Breite: maxWidth .infinity

**States**
Statisch.

**Interaktion**
Keine.

**SwiftUI**
```swift
// DividerLine.swift — implementiert seit Schritt 6B
struct DividerLine: View {
    var body: some View {
        Rectangle()
            .fill(Color.divider1)
            .frame(maxWidth: .infinity)
            .frame(height: 0.5)
    }
}
```

---

# Molecules

## M1 · SidebarItem

⚠️ Nicht als custom Struct implementiert. Aktuelle Implementierung nutzt:

List(selection: $selectedSection) mit .listStyle(.sidebar)
Private SidebarRow-Struct mit .tag(section) für Navigation
Hover via .listRowBackground(isHovered ? Color.surface1 : Color.clear)
Badge: surface3/textSecondary Capsule (nicht accent-gefüllt wie in Spec)
Kein isActive-Parameter — Selection über macOS-Native-Highlighting

**Zweck**
Einzelne Navigations-Zeile in der Sidebar.

**Visuell**
- Höhe ~ 30 px, Margin 1 px vertikal / 10 px horizontal
- Padding: 7 vertikal / 12 horizontal
- Icon 15 px, Label 13.5 pt, Gap 9
- Counter rechts (tabular, `text3`) — ODER Badge (Accent-Pill, 10.5 pt, Weight 600)
- Aktiv: Background `surface3`, Label Weight 500, Icon färbt Accent
- Idle: Background transparent, Label `text2`, Icon `text2`

**States**
- `idle`
- `hover` (`surface2`)
- `active` / `selected` (`surface3`, Accent-Icon)
- `drop-target` (gestrichelter Accent-Border, beim Drag eines Tasks)

**Interaktion**
⚠️ Rechtsklick-Kontextmenüs und Drag-Drop noch nicht implementiert.
- Klick: navigiert
- Rechtsklick: Context-Menu (Rename, Delete, New project in folder)
- Drag-Drop: Task aus Liste hineinziehen → wird verschoben

**SwiftUI**
```swift
struct SidebarItem: View {
    var icon: String
    var label: String
    var count: Int? = nil
    var badge: Int? = nil
    var isActive: Bool = false
    @Environment(\.accentColor) var accent
    var body: some View {
        HStack(spacing: 9) {
            Image(systemName: icon).font(.system(size: 15, weight: .regular))
                .foregroundStyle(isActive ? accent : .textSecondary)
            Text(label).font(.system(size: 13.5, weight: isActive ? .medium : .regular))
                .tracking(-0.1)
                .foregroundStyle(isActive ? .textPrimary : .textSecondary)
            Spacer()
            if let badge {
                Text("\(badge)")
                    .font(.system(size: 10.5, weight: .semibold))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 6).padding(.vertical, 1)
                    .background(Capsule().fill(accent))
            } else if let count {
                Text("\(count)")
                    .font(.system(size: 12).monospacedDigit())
                    .foregroundStyle(.textTertiary)
            }
        }
        .padding(.horizontal, 12).padding(.vertical, 7)
        .background(isActive ? Color.surface(level: 3) : .clear,
                    in: RoundedRectangle(cornerRadius: 7))
    }
}
```

**Wiederverwendbarkeit**
Smart-Section, Projects-Section, Tags-Section (V2), Filter-Section (V2).

**Varianten**
- Mit Farb-Dot statt Icon (für Projekte mit Custom-Color)
- Eingerückt (Sub-Project, ein Level)
- Mit Sync-Indicator-Dot rechts (für Outlook-Listen)

---

## M2 · SidebarSection

**Zweck**
Gruppierung mehrerer `SidebarItem` mit optionalem Sektion-Titel.

**Visuell**
- Top-Margin: 14 px Default, 2 px für die Inbox-Section
- Title: `SectionLabel` mit Padding `6px 22px 6px`
- Items: vertikal gestapelt, kein eigener Gap

**States**
- Statisch (V1)
- Collapsable (V2: Chevron rechts neben Title)

**Interaktion**
Klick auf Title (V2): toggle collapse — 240 ms Animation.

**SwiftUI**
```swift
struct SidebarSection<Content: View>: View {
    var title: String? = nil
    var topPadding: CGFloat = 14
    @ViewBuilder var content: Content
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            if let title {
                Text(title).font(.system(size: 11, weight: .semibold))
                    .tracking(0.2).foregroundStyle(.textTertiary)
                    .padding(EdgeInsets(top: 6, leading: 22, bottom: 6, trailing: 22))
            }
            content
        }.padding(.top, topPadding)
    }
}
```

**Wiederverwendbarkeit**
Sidebar-internal, auch in Settings-Listen, Onboarding-Listen.

---

## M3 · TimelineRow

**Zweck**
Eine Zeile im Tages-Plan: Uhrzeit + Rail + Card.

**Visuell**
Drei Spalten:
1. **Time-Spalte** (56 px, tabular, 11.5 pt, `text3`) — Uhrzeit nur wenn Stunde wechselt
2. **Rail-Spalte** (22 px) — vertikale Linie 1 px `divider`, Dot 10 × 10 mit Farb-Halo (3 px) je nach Typ
3. **Card** (flex, Radius 10, Padding 11/14)
   - Icon-/Check-Area links (18 px)
   - Title (13.5 pt, Weight 500 oder 600 bei Due)
   - Meta-Line (11 pt, `text3` — Format: `dur · meta`)
   - Optional Badge rechts

**Typen**
| Typ | Card-Bg | Rail-Dot |
|---|---|---|
| `event` (Outlook) | `calBg` | `cal`-Fill, 3px `calBg`-Halo |
| `task` | `surface` | `windowBg`-Fill mit `text3`-Border |
| `task-due` | `accentBg` | `accent`-Fill, 3px `accentBg`-Halo |

**States**
- `past` (Opacity 0.4, Strikethrough — denkbar)
- `current` (Animierter Glow um Rail-Dot, denkbar)
- `future` (Default)
- `drag` (Card schwebt mit Schatten, Rail-Dot pulsiert)

**Interaktion**
- Klick auf Card: öffnet Edit-Popover
- Drag: vertikal verschieben (Zeit-Snap auf 15 min)
- Outlook-Events sind drag-locked (`lock`-Icon sichtbar)
- Right-Click: Context-Menu (Reschedule, Move to project, Delete)

**SwiftUI**
```swift
struct TimelineRow: View {
    let time: Date
    let kind: ItemKind
    let title: String
    let duration: String
    let meta: String
    var isDue: Bool = false
    var isLocked: Bool = false
    var showHourLabel: Bool = true
    var body: some View {
        HStack(alignment: .top, spacing: 0) {
            timeColumn.frame(width: 56)
            railColumn.frame(width: 22)
            cardColumn
        }
    }
    // ... subviews
}
```

**Wiederverwendbarkeit**
Today-Screen, Upcoming-Screen (mit Datum statt Zeit), Time-Block-Modus für Pomodoros (V2).

**Varianten**
- All-day-Event (keine Rail-Linie, eigene Section oben)
- Multi-Stunden-Block (Card erstreckt sich über mehrere Time-Slots)
- Compact (kein Meta-Line, nur Title)

---

## M4 · InboxRow

**Zweck**
Collapsed Listen-Zeile im Inbox-View.

**Visuell**
- Padding 12/14, Radius 10, Margin-Bottom 6
- Background `surface` (sorted: transparent + Opacity 0.55)
- Border `0.5px divider2`
- Layout: `Check (18) · ContextIcon (26 in surface2) · Title (13.5, W500) + Meta (11) · Badge · Chevron`
- Sorted-State: Title mit Strikethrough, Check abgehakt

**States**
- `unsorted` (mit „Needs sort"-Badge)
- `sorted` (gedimmt, abgehakt)
- `processing` (siehe `ExpandedInboxItem`)
- `deleted` (Slide-out-Animation, dann remove)

**Interaktion**
- Klick: expand zu `ExpandedInboxItem`
- Swipe-Left: Delete (nicht erste Wahl auf macOS, eher Right-Click oder Trash-Button)
- Tap auf Check: sofort als „done" markieren ohne Sort (für triviale Items)

**SwiftUI**
```swift
struct InboxRow: View {
    var icon: String
    var title: String
    var meta: String
    var isSorted: Bool
    var onExpand: () -> Void
    // ...
}
```

**Wiederverwendbarkeit**
Inbox-Liste, Trash-Liste, Suchergebnisse, Quick-Add-Confirm-Toast (kompakte Variante).

**Varianten**
- Mit Snippet-Preview (zweite Zeile, denkbar)
- Mit Attachment-Indicator (Paperclip-Icon)

---

## M5 · FieldRow (Editor)

**Zweck**
Label-Wert-Paar im Inbox-Editor.

**Visuell**
- Layout: `Label (92px Uppercase 11pt text3) · Chip(s) · AI-Hint?`
- Vertikal-Gap zwischen FieldRows: 9 px
- AI-Hint rechts: Sparkle-Icon + 11 pt Accent-Text („suggested by AI")

**States**
- `idle` — Chip filled
- `editing` — Chip mit Active-Border, Popover offen
- `ai-suggested` — Hint sichtbar
- `empty` — Chip-Variante `muted`

**Interaktion**
Klick auf Chip öffnet Picker. Klick auf Label fokussiert ersten Chip in der Row.

**SwiftUI**
```swift
struct FieldRow<Value: View>: View {
    let label: String
    @ViewBuilder var value: Value
    var aiHint: String? = nil
    @Environment(\.accentColor) var accent
    var body: some View {
        HStack(spacing: 12) {
            Text(label.uppercased())
                .font(.system(size: 11, weight: .semibold))
                .tracking(0.4)
                .foregroundStyle(.textTertiary)
                .frame(width: 92, alignment: .leading)
            HStack(spacing: 8) {
                value
                if let aiHint {
                    HStack(spacing: 4) {
                        Image(systemName: "sparkles").font(.system(size: 10))
                        Text(aiHint).font(.system(size: 11))
                    }.foregroundStyle(accent)
                }
                Spacer()
            }
        }
    }
}
```

**Wiederverwendbarkeit**
Inbox-Editor, Task-Detail-Popover (V2), Settings-Form, New-Project-Sheet.

**Varianten**
- Mit Help-Text unter dem Wert (zweite Zeile, denkbar für komplexere Settings)
- Vertikales Layout für sehr lange Werte

---

## M6 · AISummaryCard

**Zweck**
„Hero"-Karte oben auf Today: zeigt AI-Plan-Zusammenfassung mit Re-Plan/Tweak-Actions.

**Visuell**
- Padding 14/18, Radius 12, Background `surface`, Border `0.5px divider2`
- Linker Slot: 28 × 28 Sparkle-Tile in `accentBg2` mit `accent2`-Border, Radius 8
- Body:
  - Headline: 13.5 pt W600 + UPPERCASE-Tag „APPLE INTELLIGENCE" (10 pt W600 0.6-Letter-Spacing)
  - Subtitle: 13 pt `text2`, line-height 1.5, max-width 640
  - Inline Accent-Highlights für Schlüsselwörter (z. B. „Pay rent")
- Rechter Slot: zwei `GlassButton` Mini (26 px) untereinander: „Replan" + „Tweak"

**States**
- `idle`
- `replanning` — Sparkle-Tile rotiert sanft (1.5 s pro Umdrehung), Body fadet zu „I'm replanning…" + Skeleton
- `error` — Tile wird `warn`-getintet, Body zeigt Retry-Button
- `dismissed` — User hat ausgeblendet (per Tweak); kehrt nicht von selbst zurück

**Interaktion**
- Klick auf „Replan": triggert AI-Replan-Service
- Klick auf „Tweak": öffnet Popover mit Plan-Parametern (Work-Hours, Focus-Mode)
- Klick auf farbigen Schlüsselwort-Link: navigiert zum Task

**SwiftUI**
```swift
struct AISummaryCard: View {
    let greeting: String
    let body: AttributedString    // mit accent-Highlights
    var onReplan: () -> Void
    var onTweak: () -> Void
    // ...
}
```

**Wiederverwendbarkeit**
Today, Upcoming (Wochen-Zusammenfassung), Sunday-Review (Wochen-Recap), Empty-State-Hilfe.

**Varianten**
- Ohne Actions (rein informativ — für „Daily Summary at end of day")
- Mit Bild/Chart-Slot (V2 für Statistik-Card)

---

## M7 · ProgressCard

**Zweck**
Fortschritts-Indikator oben in einem Listen-View (z. B. Inbox-Processing).

**Visuell**
- Padding 12/16, Radius 12, Background `surface`, Border `0.5px divider2`
- Header-Row: Title (W600 12.5) + Sub („2 of 7 sorted", `text3` 11) + Spacer + Estimate („~ 3 min left", `text3` 11)
- Progress-Bar: 4 px hoch, Radius 2, Background `rgba(255,255,255,0.06)`, Fill `accent`
- Margin-Bottom: 20 px zum nächsten Block

**States**
- `idle` (0 %)
- `in-progress` (Animierter Fill, 240 ms Spring)
- `done` (100 %, dann Card slidet hoch und verschwindet nach 600 ms)

**Interaktion**
Statisch — keine direkten Klick-Aktionen.

**SwiftUI**
```swift
struct ProgressCard: View {
    let title: String
    let progress: Double      // 0...1
    let subtitle: String
    let estimate: String
    @Environment(\.accentColor) var accent
    var body: some View {
        VStack(spacing: 6) {
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                Text(title).font(.system(size: 12.5, weight: .semibold))
                Text(subtitle).font(.system(size: 11)).foregroundStyle(.textTertiary)
                Spacer()
                Text(estimate).font(.system(size: 11)).foregroundStyle(.textTertiary)
            }
            ProgressView(value: progress).progressViewStyle(.linear)
                .tint(accent)
                .frame(height: 4)
        }
        .padding(.horizontal, 16).padding(.vertical, 12)
        .glass(radius: 12)  // oder SurfaceCard
    }
}
```

**Wiederverwendbarkeit**
Inbox-Review, Sync-Status (App-Header), Onboarding-Steps, Pomodoro-Timer (V2).

**Varianten**
- Mit Cancel-Button rechts
- Indeterminate (für unbekannte Restzeit)

---

## M8 · AccountCard (Sidebar-Footer)

**Zweck**
Verbundenes Konto + Sync-Status am unteren Sidebar-Rand.

**Visuell**
- Margin 10/12, Padding 8/10, Radius 8
- Background `surface`, Innenkante 0.05 weiß
- Avatar: 22 × 22, Gradient `linear(135deg, accent → cal)`, Initialen in 10 pt W700 weiß
- Name (12 pt W500 `text`) + Status („Outlook · synced 2m ago", 10.5 pt `text3`)

**States**
- `synced` — Default
- `syncing` — Mini-Spinner rechts statt Sync-Text
- `error` — Warn-Border, Status zeigt „Sync failed"
- `signed-out` — Card wird zu „Connect Outlook" CTA

**Interaktion**
Klick: öffnet Account-Settings-Sheet.

**SwiftUI**
```swift
struct AccountCard: View {
    let name: String
    let initials: String
    let status: String
    let isSyncing: Bool
    // ...
}
```

**Wiederverwendbarkeit**
Hauptsidebar. Reduzierte Variante (nur Avatar) in kompakten Sidebars (Sheet-internal Navigations).

---

## M9 · NotificationCard

**Zweck**
Native macOS-System-Notification-Look für Reminder.

**Visuell**
- Width 360, Radius 18, Glass `strong`
- Padding 14/16
- Header-Row: App-Icon-Tile (22 × 22, Accent, weißer Check) + „To Do" (12.5 W600) + „Reminder" (11 `text3`) + Spacer + Time-stamp + ✕
- Body: Big-Icon-Tile (36 × 36, `accentBg`, Accent-Glyph) + Title (15 W600) + Subtitle („Due in X · 14:00 · Personal")
- Actions-Row: Primary („Mark done"), Ghost („Open"), Spacer, Snooze-Pill (Highlight-Variante)

**States**
- `active` (vorderste, voll opak)
- `back-1` (rotate ±1.5°, opacity 0.92, dx 14)
- `back-2` (rotate ±2.5°, opacity 0.78, dx 26)
- `expired` (Removal-Animation: slide right + fade)

**Interaktion**
- Klick auf Card-Body: öffnet App auf entsprechendem Task
- Klick auf Action-Button: führt aus, Card fadet aus
- Snooze-Pill öffnet `SnoozeMenu`
- Stack mit > 3: Counter-Pill „3 reminders ⌄" oben

**SwiftUI**
**macOS-Empfehlung:** Verwende native `UNUserNotificationCenter` mit `UNNotificationAction`s. Nur in dedizierten App-Bereichen (z. B. „Reminders inbox") eine eigene `NotificationCard`-View für Visualisierung historischer Reminder.

```swift
struct ReminderCard: View {
    let task: Task
    var primary: () -> Void
    var open: () -> Void
    var snooze: (SnoozeOption) -> Void
    // ...
}
```

**Wiederverwendbarkeit**
- System-Notification (über `UNNotificationContent`)
- In-App-Toast-Banner für „Snoozed task"
- Lock-Screen-Widget

**Varianten**
- Mit Reply-Field (denkbar für „Add note" inline)
- Ohne Snooze (für non-time-based Reminders)
- Mit Cover-Image (für Tasks mit Attachment)

---

## M10 · SnoozeMenu

**Zweck**
Popover mit nummerierten Snooze-Optionen.

**Visuell**
- Width 218, Radius 14, Glass `strong`, Padding 6
- Header: UPPERCASE „REMIND AGAIN IN" (10.5 pt W600 `text3`)
- Items: Padding 7/12, Radius 7, Hover `surface2`
  - Active: Accent-Background, weißer Text, weiße Kbd-Pille
- Items-Liste: 15min, 30min, 1h (Default), 2h, 4h, 1d, 2d
- Trenner (`divider`) + finale Action: „Pick a time…" mit Clock-Icon

**States**
- Items: idle, hover, active, keyboard-focus (Outline 0.5px accent)

**Interaktion**
- Maus-Klick: wählt
- Keyboard: `1 – 7` direkt, `↑↓` Navigation, `↵` bestätigt, `Esc` schließt
- Popover schließt nach Wahl mit 100 ms Fade

**SwiftUI**
```swift
struct SnoozeMenu: View {
    @Binding var selection: SnoozeOption
    var options: [SnoozeOption] = .default
    var onCustom: () -> Void
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            SectionLabel(text: "Remind again in")
                .padding(EdgeInsets(top: 8, leading: 12, bottom: 4, trailing: 12))
            ForEach(options.indexed) { (i, opt) in
                SnoozeRow(option: opt, kbd: "\(i+1)", isSelected: opt == selection)
                    .onTapGesture { selection = opt }
            }
            Divider().background(.divider1).padding(.horizontal, 8)
            SnoozeRow(option: .custom, kbd: nil, isSelected: false)
                .onTapGesture { onCustom() }
        }
        .padding(6)
        .frame(width: 218)
        .glass(radius: 14, strong: true)
    }
}
```

**Wiederverwendbarkeit**
Notification, Inbox-Row-Context-Menu, Today-Row-Right-Click, generischer „Remind"-Picker.

**Varianten**
- Compact (nur 3 Optionen — 15min/1h/Tomorrow) für Toast-Snooze
- Custom-Datepicker (V2)

---

## M11 · Dock (macOS Mock)

**Zweck**
Visualisierung des macOS-Docks im Notification-Screen.

**Visuell**
- Centered unten, 8/10 Padding, Radius 22, Glass-Container
- App-Icons: 44 × 44, Radius 11, Linear-Gradient-Background
- Badge: rotes 16 × 16-Oval mit weißem Count und weißem Outer-Outline 1.5px

**States**
- Idle, hover (Lift +6 px denkbar, nicht in V1), badge-pulse bei neuem Reminder

**Interaktion**
Decorative im Design — in der echten App nicht eigenständig (das ist das System-Dock).

**SwiftUI**
**Native:** `NSApp.dockTile.badgeLabel = "3"` für die Badge. App-Icon kommt aus Assets.

---

# Organisms

## O1 · TahoeSidebar (App-Sidebar)

⚠️ Nicht als custom AppSidebar implementiert. Aktuelle Implementierung nutzt:

NavigationSplitView (nativ, in ContentView.swift)
.listStyle(.sidebar) auf List
Kein QuickCapturePill
Kein AccountCard-Footer
Kein Traffic-Lights-Reserve (38px)
minWidth: 200 statt fixe 232px
Hintergrund: macOS-Systemfarbe (.sidebar-Material)
TahoeSidebar bleibt als Design-Zielzustand dokumentiert.

**Zweck**
Translucente, dunkle Sidebar mit Traffic-Lights, Quick-Capture, Sektionen und Account-Footer.

**Visuell**
- Width 232 (fix), Border-Right `0.5px divider`
- Background: linearer Gradient von 4 % zu 2 % weiß
- Top-Reserve: 38 px für Traffic-Lights
- Content padded 6 px vertikal
- Quick-Capture-Pill bündig oben (Search-look mit „⌘K" Kbd rechts)
- Sektionen in fester Reihenfolge: Inbox · Smart · Projects · (Tags) · Spacer · AccountCard

**States**
- `expanded` (Default 232 px)
- `collapsed` (V2: Icons only, 56 px breit, Toggle via ⌥⌘S)

**Interaktion**
- Drag-Region (außerhalb der Items)
- Klick auf Item: navigiert
- Right-Click auf Section-Header: New Project / Rename / Reorder
- Drag-and-Drop: Tasks zwischen Projects, Projects untereinander reordern

**SwiftUI**
```swift
struct AppSidebar: View {
    @Environment(\.accentColor) var accent
    @Binding var activeRoute: Route
    let counts: SidebarCounts
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Spacer().frame(height: 38)    // Traffic-Lights Reserve
            QuickCapturePill()
                .padding(.horizontal, 12).padding(.bottom, 8)
            SidebarSection(topPadding: 2) {
                SidebarItem(icon: "tray", label: "Inbox", badge: counts.inbox > 0 ? counts.inbox : nil,
                            isActive: activeRoute == .inbox)
            }
            SidebarSection(title: "Smart") { /* Today, Upcoming, Someday */ }
            SidebarSection(title: "Projects") { /* iterate */ }
            Spacer()
            AccountCard(...).padding(.horizontal, 12).padding(.bottom, 10)
        }
        .frame(width: 232)
        .background(.regularMaterial)
        .overlay(Rectangle().fill(.divider1).frame(width: 0.5), alignment: .trailing)
    }
}
```

**Wiederverwendbarkeit**
Hauptfenster. Reduzierte Mini-Sidebar für Picker-Sheets (z. B. Project-Picker im Inbox-Editor).

**Varianten**
- Default (full)
- Collapsed (icons only)
- Picker-Mode (für „Move to project…" — nur Projects + Smart)

---

## O2 · Toolbar

**Zweck**
Sticky-Header oberhalb des Content-Bereichs mit Titel + Subtitle + Actions.

**Visuell**
- Padding 10/14, Background Glass-Light, Border-Bottom `0.5px divider`
- Position: `sticky top: 0`, zIndex 3
- Layout: `Title-Block (flex) | Actions-Group (rechts, Gap 6)`
- Title 14 W600 -0.2, Subtitle 11 `text3` (mit tabular-nums für Counts/Times)

**States**
- `idle`
- `scrolled` (Border-Bottom wird sichtbarer durch leichten Drop-Shadow — 240 ms)
- `loading` (Mini-Spinner statt eines Action-Buttons)

**Interaktion**
Actions sind `GlassButton`-Instanzen. Primary-Action rechts außen.

**SwiftUI**
```swift
struct AppToolbar<Right: View>: View {
    let title: String
    let subtitle: AttributedString?
    @ViewBuilder var right: Right
    var body: some View {
        HStack(spacing: 8) {
            VStack(alignment: .leading, spacing: 1) {
                Text(title).font(.system(size: 14, weight: .semibold)).tracking(-0.2)
                if let subtitle {
                    Text(subtitle).font(.system(size: 11).monospacedDigit())
                        .foregroundStyle(.textTertiary)
                }
            }
            Spacer()
            right
        }
        .padding(.horizontal, 14).padding(.vertical, 10)
        .background(.thinMaterial)
        .overlay(Rectangle().fill(.divider1).frame(height: 0.5), alignment: .bottom)
    }
}
```

**Wiederverwendbarkeit**
Jeder Content-Screen, Sheet-Header, Detail-Pane.

**Varianten**
- Mit Breadcrumb statt Title (denkbar für tiefe Navigation)
- Compact (32 px hoch ohne Subtitle)
- Mit Search-Field statt Title (Search-Mode)

---

## O3 · ExpandedInboxItem (Editor)

**Zweck**
Inline-Editor für ein einzelnes Inbox-Item beim Sortieren.

**Visuell**
- Container: Radius 14, Background `surface2`, Border `0.5px accent`, Halo `0 0 0 3px accentBg2` + `0 10px 30px black/0.3`
- Head: Padding 14/18 — Check (20 px) + Title (16 W600) + Meta (capture-source-Hinweise) + „EDITING"-Badge
- Body: 4 – 5 `FieldRow` mit Project / Due / Remind / Est. Time / Tags — Gap 9 px
- Footer: Top-Border `divider`, Background `surface`, Padding 11/18 — Primary (`Save & next`) + Skip + Delete + Spacer + Kbd-Group (⌘↵ save, esc close)

**States**
- `editing` (Default)
- `saving` (Footer-Button zeigt Mini-Spinner)
- `error` (Border wird `danger`-getintet, Inline-Error in Footer)

**Interaktion**
- Tab cycelt durch Felder
- ⌘↵: Save & next
- Esc: Close (zurück zur Liste)
- Klick auf jeden Chip: kontextueller Popover
- AI-Hints sind klickbar — akzeptiert den Vorschlag mit Crossfade

**SwiftUI**
Eigenständige View mit `@Bindable var draft: TaskDraft`. Nutzt `FieldRow` + `Chip` + `Badge` + `GlassButton` + `Kbd`.

**Wiederverwendbarkeit**
Inbox-Processing, Task-Detail-Sheet (mit reduzierten Footer-Actions), Quick-Edit-Popover (compact-Variante).

**Varianten**
- `processing` (mit Save&next)
- `editing` (mit Save + Cancel)
- `creating` (Title-Feld leer, fokussiert)

---

## O4 · NotificationStack

**Zweck**
Stapel mehrerer Reminder-Karten als visuelles Schichten-Pattern.

**Visuell**
- Aktive Karte vorn (Position-Top 60, Right 22)
- Karte −1: Top 124, Right 36, rotate -1.5°, opacity 0.92
- Karte −2: Top 158, Right 48, rotate 2.5°, opacity 0.78
- Stack-Counter-Pill oben rechts: „3 reminders ⌄" (10.5 pt W500 Glass-Pill)

**States**
- `single` (1 Reminder → kein Stack, kein Counter)
- `stack` (2+ → max. 3 visualisiert)
- `expanded` (Counter-Pill geklickt → alle Karten fächern sich vertikal auf, alle aufrecht)

**Interaktion**
- Counter-Klick → expand
- Klick auf hintere Karte → bringt sie nach vorn (240 ms Spring)

**SwiftUI**
ZStack mit dynamischem `offset` + `rotationEffect` + `opacity` pro Layer.

**Wiederverwendbarkeit**
Notification-Center, Tutorial-Stack (Onboarding-Cards), Photo-Stack-Vorschau (V2).

---

## O5 · QuickCapturePill (Sidebar-Top)

**Zweck**
Schnellzugriff für Capture/Search — der wichtigste Einstieg.

**Visuell**
- Height 30, Padding 0/10, Radius 8, Background `surface2`, Innenkante + 0.5px-Border
- Layout: Search-Icon (13, `text3`) + Placeholder („Search or capture…", 12.5, `text3`) + Spacer + Kbd („⌘K")

**States**
- `idle`
- `focused` — Border voll Accent, Placeholder wird zu echtem Input
- `with-results` — expandiert zu Mini-Result-List unter dem Pill

**Interaktion**
- Klick / ⌘K: aktiviert
- Tippen: Suche live
- ↵ ohne Selection: erstellt neuen Inbox-Task aus dem Suchstring
- ↵ mit Selection: navigiert
- Esc: schließt

**SwiftUI**
```swift
struct QuickCapturePill: View {
    @FocusState var focused: Bool
    @State var query: String = ""
    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass").font(.system(size: 13))
                .foregroundStyle(.textTertiary)
            TextField("Search or capture…", text: $query)
                .textFieldStyle(.plain)
                .font(.system(size: 12.5))
                .focused($focused)
            Kbd(label: "⌘K")
        }
        .padding(.horizontal, 10).frame(height: 30)
        .background(Color.surface(level: 2), in: RoundedRectangle(cornerRadius: 8))
        .keyboardShortcut("k", modifiers: .command)
    }
}
```

**Wiederverwendbarkeit**
Sidebar-Top, Spotlight-Sheet (vergrößert), Tag-Picker, Project-Picker.

**Varianten**
- Standard (Search + Capture)
- Search-only
- Capture-only (mit „+"-Glyph)

---

# Layout-Shells

## L1 · TahoeWindow

**Zweck**
Komplette Fenster-Komposition: Wallpaper + Window + Sidebar + Content.

**Visuell**
- Wallpaper umrandet, 24 px Window-Inset
- Window: Radius 12, Background `windowBg`, Shadows `0 0 0 0.5px white/0.1, 0 1px 1px black/0.4, 0 24px 60px black/0.45`
- Inner: HStack — Sidebar | Content

**Interaktion**
Standard-Window-Verhalten (siehe `TrafficLights`).

**SwiftUI**
In SwiftUI auf macOS: nicht selbst nachbauen — `Window` / `WindowGroup` mit `.windowStyle(.hiddenTitleBar)` und `NavigationSplitView`. Die App-Sidebar als `sidebar`-Spalte.

```swift
WindowGroup {
    NavigationSplitView {
        AppSidebar(...)
    } detail: {
        TodayView()    // mit eigener .toolbar { … }
    }
    .navigationSplitViewStyle(.balanced)
}
.windowStyle(.hiddenTitleBar)
.windowToolbarStyle(.unified)
.containerBackground(AuroraWallpaper(), for: .window)
```

**Wiederverwendbarkeit**
Hauptfenster. Settings ist ein eigenes Fenster mit Standard-Style.

---

# Übersichtstabelle — Status

| ID | Name | Schicht | SwiftUI-Datei (Vorschlag) | Schicht |
|---|---|---|---|---|
| F1 | AuroraWallpaper | Foundation | `DesignSystem/Materials/AuroraWallpaper.swift` | ✅ vereinfacht |
| F2 | GlassBackground | Foundation | `DesignSystem/Materials/GlassBackground.swift` | ❌ nicht implementiert |
| F3 | SurfaceCard | Foundation | `DesignSystem/Materials/SurfaceCard.swift` | ❌ nicht implementiert |
| A1 | AppIcon | Atom | `DesignSystem/Atoms/AppIcon.swift` | ✅ inline |
| A2 | CheckCircle | Atom | `DesignSystem/Atoms/CheckCircle.swift` | ✅ abweichende API |
| A3 | Badge | Atom | `DesignSystem/Atoms/Badge.swift` | ⚠️ inline, kein Atom |
| A4 | Chip | Atom | `DesignSystem/Atoms/Chip.swift` | ❌ nicht implementiert | 
| A5 | GlassButton | Atom | `DesignSystem/Atoms/GlassButton.swift` | ✅ abweichende API |
| A6 | Kbd | Atom | `DesignSystem/Atoms/Kbd.swift` | ❌ nicht implementiert |
| A7 | SectionLabel | Atom | `DesignSystem/Atoms/SectionLabel.swift` | ✅ vereinfacht |
| A8 | TrafficLights | Atom (native) | — (NSWindow standard) | ✅ nativ |
| A8b | DividerLine | Atom | DesignSystem/DividerLine.swift | ✅ implementiert 6b |
| M1 | SidebarItem | Molecule | `DesignSystem/Molecules/SidebarItem.swift` | ⚠️ abweichend (6C) |
| M2 | SidebarSection | Molecule | `DesignSystem/Molecules/SidebarSection.swift` | ⚠️ abweichend |
| M3 | TimelineRow | Molecule | `DesignSystem/Molecules/TimelineRow.swift` | ❌ nicht implementiert |
| M4 | InboxRow | Molecule | `DesignSystem/Molecules/InboxRow.swift` | ⚠️ abweichend |
| M5 | FieldRow | Molecule | `DesignSystem/Molecules/FieldRow.swift` | ❌ nicht implementiert |
| M6 | AISummaryCard | Molecule | `DesignSystem/Molecules/AISummaryCard.swift` | ❌ nicht implementiert |
| M7 | ProgressCard | Molecule | `DesignSystem/Molecules/ProgressCard.swift` | ❌ nicht implementiert |
| M8 | AccountCard | Molecule | `DesignSystem/Molecules/AccountCard.swift` | ❌ nicht implementiert |
| M9 | NotificationCard | Molecule | `Features/Notification/NotificationCard.swift` | ⚠️ abweichend |
| M10 | SnoozeMenu | Molecule | `Features/Notification/SnoozeMenu.swift` | ❌ nicht implementiert |
| M11 | Dock (mock) | — | — (nicht produktiv) | ❌ nicht implementiert |
| O1 | AppSidebar | Organism | `DesignSystem/Organisms/AppSidebar.swift` | ⚠️ abweichend |
| O2 | AppToolbar | Organism | `DesignSystem/Organisms/AppToolbar.swift` | ⚠️ vereinfacht |
| O3 | ExpandedInboxItem | Organism | `Features/Inbox/ExpandedInboxItem.swift` | ❌ nicht implementiert |
| O4 | NotificationStack | Organism | `Features/Notification/NotificationStack.swift` | ❌ nicht implementiert |
| O5 | QuickCapturePill | Organism | `Features/Capture/QuickCapturePill.swift` | ❌ nicht implementiert |
| L1 | TahoeWindow | Shell | — (via NavigationSplitView) | ✅ via NavigationSplitView |

---

# Abhängigkeits-Graph

```
                       AuroraWallpaper (F1)
                              │
                       TahoeWindow (L1)
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
        AppSidebar (O1)                AppToolbar (O2)
              │                               │
   ┌──────────┼──────────┐                  uses A5
   ▼          ▼          ▼
QuickCapture SidebarSection  AccountCard
   (O5)         (M2)            (M8)
                 │
                 ▼
            SidebarItem (M1) ──── uses A1
                                  uses A3

Content-Bereich:
   AISummaryCard (M6) ──── A1, A5
   ProgressCard (M7)
   TimelineRow (M3)   ──── A1, A2, SurfaceCard
   InboxRow (M4)      ──── A1, A2, A3, SurfaceCard
   ExpandedInboxItem (O3) ──── FieldRow (M5) ──── A4 (Chip)
                              A2, A3, A5, A6

Notification:
   NotificationStack (O4)
        ├── NotificationCard (M9) ──── A1, A5, GlassBackground
        └── SnoozeMenu (M10)        ──── A6 (Kbd), A7
```

---

# Bau-Reihenfolge (Empfehlung)

1. **Foundation:** Color-Tokens, Spacing, Typography-Helpers, AuroraWallpaper, GlassBackground, SurfaceCard.
2. **Atoms:** AppIcon, Badge, Kbd, SectionLabel, CheckCircle, Chip, GlassButton.
3. **Sidebar-Stack:** SidebarItem → SidebarSection → AppSidebar (mit Mock-Daten).
4. **Toolbar:** AppToolbar (mit Mock-Title + Glass-Buttons).
5. **Today-Screen:** TimelineRow → AISummaryCard → TodayView.
6. **Inbox-Screen:** InboxRow → FieldRow → ProgressCard → ExpandedInboxItem → InboxView.
7. **Capture-Layer:** QuickCapturePill + globaler Hotkey + Capture-Service.
8. **Notifications:** SnoozeMenu → NotificationCard → NotificationStack → UNUserNotification-Wiring.
9. **Settings + Tweaks:** Accent-Picker, Density-Picker.
10. **Sync:** OutlookCalendarService + CloudKit-Sync.

---

# Test-Strategie für Komponenten

Jede Komponente wird in einer **Preview-Catalog**-View gegen alle States gerendert, um visuelle Regression zu erkennen:

```swift
#Preview("Badge · alle Tones") {
    HStack {
        Badge(text: "Due today", tone: .info)
        Badge(text: "Needs sort", tone: .warn)
        Badge(text: "Overdue", tone: .danger)
        Badge(text: "Draft", tone: .neutral)
    }.padding().background(.windowBg)
}
```

Optional: **Snapshot-Tests** mit `swift-snapshot-testing` für CI.

---

# Guardrails — Geschützte Dateien

Diese DesignSystem-Atome nur mit expliziter Begründung ändern:
- `DesignSystem/Color+Tokens.swift` — Single Source of Truth für alle Farben
- `DesignSystem/Spacing.swift` — alle Abstands-Tokens
- `DesignSystem/CheckCircle.swift` — Completion-Animation
- `DesignSystem/GlassButton.swift` — Button-Primitive
- `DesignSystem/DividerLine.swift` — Trennlinien-Primitive
- `DesignSystem/SectionLabel.swift` — Section-Header-Primitive
- `DesignSystem/AuroraWallpaper.swift` — Hintergrund-Primitive

---

# Offene Design-Punkte (nach 6C)

## Sofort (Token-Finish)
- [ ] 5× `.foregroundStyle(.secondary)` → `Color.textSecondary`
  - TodayView:34, ViewHeader:24, InboxView:59+65, ProjectsView:139

## Nächste Sprint
- [ ] TaskFormView Visual-Polish
- [ ] ReminderSheetView Token-Konsistenz
- [ ] EmptyStateView Token-Konsistenz prüfen

## Produkt (Backlog)
- [ ] Drag & Drop zwischen Sidebar-Sektionen
- [ ] Kontextmenüs auf Task-Rows
- [ ] App-Icon
- [ ] Login-Item für Auto-Start
