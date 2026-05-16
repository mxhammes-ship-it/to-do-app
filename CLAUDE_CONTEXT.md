# CLAUDE_CONTEXT.md

## Arbeitsmodus für Claude Code

Wichtige Regeln:
- Bestehende Architektur respektieren
- Keine unnötigen Refactors
- Minimalistische Apple-like UX priorisieren
- Bestehende Patterns wiederverwenden
- Kleine, fokussierte Änderungen bevorzugen
- Vor grösseren Architekturänderungen zuerst begründen
- Bestehenden Code zuerst analysieren bevor neue Strukturen eingeführt werden
- Keine unnötige Komplexität
- Fokus auf ruhige UX statt Feature-Menge

Bei Unsicherheiten:
- bestehende Implementierungen prüfen
- konsistente Lösung zur bestehenden Codebasis wählen

---

## Wichtige Produktprinzipien

FocusFlow soll sich NICHT wie Jira, Notion oder Todoist anfühlen.

Das Produkt soll:
- ruhig wirken
- mental entlasten
- Entscheidungen vereinfachen
- wichtige Aufgaben präsent halten
- tägliche Nutzung angenehm machen

Weniger Features sind besser als komplexe Features.

Jede neue Funktion muss:
- die mentale Last reduzieren
- schnell verständlich sein
- visuell ruhig bleiben
- zum bestehenden UX-Stil passen

---

## Produktvision

Native macOS-App für ruhige, fokussierte Tagesplanung. Kombiniert Task-Erfassung, Tagesplanung und ein starkes Reminder-System in einer minimalistischen, Apple-like Oberfläche.

Kernproblem:
Aufgaben werden in Microsoft To Do erfasst, aber zu wenig konsequent geprüft. Wichtige Tasks landen deshalb zusätzlich auf Post-its oder in Outlook-Kalender-Remindern. FocusFlow ersetzt diese verteilte Lösung durch ein einziges System mit präsenter Reminder-Funktion.

---

## Zielgruppe

Ein einzelner Nutzer:
Digital Product Manager mit vielen Meetings, parallelen Themen und ständig neuen eingehenden Aufgaben.

Reine Single-User-App für persönlichen Gebrauch.

---

## MVP Scope

Sidebar-Navigation:
- Heute
- Inbox
- Demnächst
- Projekte
- Review
- Erledigt

Task-Felder (Pflicht):
- Titel
- Deadline
- Reminder-Datum/Uhrzeit

Task-Felder (optional):
- Beschreibung
- Projekt
- Priorität (hoch/mittel/niedrig)
- geschätzte Dauer
- Tags
- Status

Status-Werte:
- inbox
- planned
- today
- review
- completed
- archived

### Today View
Zentrale Hauptansicht mit heutigen Aufgaben, Prioritäten, fälligen Remindern und ruhigem Tagesüberblick mit Begrüssung.

### Inbox
Schnellerfassung neuer Aufgaben. Ziel: Inbox Zero.
Tasks lassen sich mit einem Klick nach „Heute" verschieben oder editieren.

### Review-Logik
Tasks mit Status `today`, die nicht erledigt wurden, werden beim nächsten Tageswechsel automatisch auf Status `review` verschoben.

Im Review-Bereich:
- neu planen
- Deadline anpassen
- Reminder setzen
- abschliessen
- archivieren/löschen

### Reminder-System
Floating NSPanel oben rechts auf dem Bildschirm, erscheint über allen anderen Apps.

Outlook-Style:
- Liste aller aktiven Reminders
- Klick zur Auswahl
- Snooze-Buttons wirken auf den ausgewählten Reminder

Snooze-Optionen:
- 15 Min
- 30 Min
- 1 Std
- 2 Std
- 4 Std
- Morgen früh (8:00 Uhr)

### Gamification
Beim Abschliessen einer Task:
- dezente Animation
- Kreis füllt sich
- Checkmark mit Spring-Animation
- NSSound „Hero"

Keine kindliche Gamification.

---

## Architektur / Tech Stack

- Sprache: Swift 5.0
- UI: SwiftUI
- Architektur: MVVM
- Deployment Target: macOS 14.0
- Bundle ID: com.focusflow.app
- Sandbox aktiviert

### State Management
- @MainActor-isolierte ObservableObject-Klassen
- @EnvironmentObject für Store-Injection

### Persistenz
Lokale JSON-Datei:

~/Library/Application Support/FocusFlow/data.json

### Reminder-Scheduling
- Timer auf RunLoop.main mit .common mode
- Kein UNUserNotificationCenter

### Reminder-Overlay
NSPanel mit:
- .nonactivatingPanel
- .borderless
- level = .floating
- orderFrontRegardless()

### Zukunftssicherheit
Architektur ist cloud-ready vorbereitet.

Datenmodelle:
- Codable
- UUID-basierte IDs

Vorbereitet für:
- Outlook-Kalender-Sync
- Apple Intelligence

Nicht Teil des MVP.

---

## Projektstruktur

FocusFlow.xcodeproj/

FocusFlow/
├── FocusFlowApp.swift
├── ContentView.swift
├── DesignSystem/
│   ├── AuroraWallpaper.swift
│   ├── CheckCircle.swift
│   ├── Color+Tokens.swift
│   ├── DividerLine.swift
│   ├── GlassButton.swift
│   ├── SectionLabel.swift
│   └── Spacing.swift
├── Models/
│   ├── Task.swift
│   └── Project.swift
├── ViewModels/
│   └── TaskStore.swift
├── Views/
│   ├── Sidebar/
│   ├── Today/
│   ├── Inbox/
│   ├── Upcoming/
│   ├── Projects/
│   ├── Review/
│   ├── Completed/
│   ├── TaskForm/
│   ├── Reminder/
│   └── Shared/
├── Services/
│   ├── PersistenceService.swift
│   └── ReminderService.swift
├── Assets.xcassets/
└── FocusFlow.entitlements

---

## Wichtige Komponenten

### DesignSystem — Atoms (nicht ändern ohne Designsystem-Kontext)
- Color+Tokens.swift — Single Source of Truth für alle Farben
- Spacing.swift — alle Abstands-Tokens
- CheckCircle — Checkbox mit Completion-Animation (triggerCompletion-safe)
- GlassButton — Button variant: .primary / .secondary
- SectionLabel — Abschnitts-Header, smallcaps, textTertiary
- DividerLine — 0.5px Trennlinie, divider1, rowIndent
- AuroraWallpaper — Hintergrundgradient (windowBg → wallBottom)

### TaskStore
Single Source of Truth.

Verantwortlich für:
- tasks
- projects
- computed task groups
- CRUD-Operationen
- Reminder-Rescheduling
- Tageswechsel-Logik

### ReminderCenter
Verwaltet aktive Reminder im Overlay.

### ReminderWindowController
Verwaltet ein einzelnes statisches NSPanel.

### ReminderService
Timer-basiertes Reminder-Scheduling.

### PersistenceService
JSON Load/Save.

---

## Guardrails — Geschützte Dateien

Diese Dateien nur mit expliziter Begründung ändern:
- `DesignSystem/Color+Tokens.swift` — Single Source of Truth für Farben
- `DesignSystem/Spacing.swift` — alle Abstands-Tokens
- `DesignSystem/CheckCircle.swift` — Completion-Animation
- `DesignSystem/GlassButton.swift` — Button-Primitive
- `DesignSystem/DividerLine.swift` — Trennlinien-Primitive
- `DesignSystem/SectionLabel.swift` — Section-Header-Primitive
- `DesignSystem/AuroraWallpaper.swift` — Hintergrund-Primitive
- `ViewModels/TaskStore.swift` — State-Management-Zentrale
- `FocusFlow.xcodeproj/project.pbxproj` — nur bei neuen Dateien nötig

---

## Bereits umgesetzt

- vollständige Sidebar-Navigation
- Today View
- Inbox
- Upcoming View
- Projects View
- Review View
- Completed View
- TaskFormView
- lokale Persistenz
- Reminder-System
- Floating Reminder Overlay
- automatische Tageswechsel-Logik
- Completion Animation + Sound
- ⌘N Shortcut für neue Aufgabe
- Sample-Daten beim Erststart
- Aurora DesignSystem (Color+Tokens, Spacing, Atoms)
- Dark-Mode-only (preferredColorScheme(.dark))
- Aurora-Wallpaper-Hintergrund
- CheckCircle, GlassButton, SectionLabel, DividerLine als wiederverwendbare Atoms
- Design-Token-Migration aller Views (Schritte 4–6C)
- TaskRow: Priority-Dot, Deadline-Chip, Hover-State
- Sidebar: Hover-State, Token-alignte Badges
- Alle Listen: DividerLine + Spacing.scrollBottom

---

## Aktueller Fokus

Der MVP ist funktional abgeschlossen.

Aktueller Fokus:
Design-Migration abgeschlossen bis Schritt 6C.

Unmittelbar offen (Design):
- Token-Finish: 5x .foregroundStyle(.secondary) → Color.textSecondary
  (TodayView:34, ViewHeader:24, InboxView:59+65, ProjectsView:139)
- TaskFormView Visual-Polish (bewusst aus 6A–6C ausgeschlossen)
- EmptyStateView Token-Konsistenz prüfen

Danach (Produkt):
- Drag & Drop zwischen Sidebar-Sektionen
- Kontextmenüs auf Task-Rows
- App-Icon
- Login-Item für Auto-Start

Aktuell keine Priorität:
- Cloud
- Teamfeatures
- Enterprise-Features
- komplexe Integrationen

---

## Backlog / V2

Mögliche spätere Erweiterungen (nicht im aktuellen Fokus):
- globale Suche
- Outlook-Kalender-Sync
- Apple Intelligence Integration
- Statistiken / Wochenrückblick
- wiederkehrende Aufgaben
- zusätzliche Tastatur-Shortcuts

---

## Bekannte Einschränkungen

Wenn die App komplett beendet wird, feuern keine Timer mehr.

Mögliche spätere Lösung:
- Login-Item
- Background-Agent

---

## UI-/UX-Prinzipien

Design:
- ruhig
- clean
- minimalistisch
- Apple-like
- hochwertig
- leicht motivierend

Sprache:
- vollständig deutsch
- deutsche Datumsformate

### Header-Pattern
- grosse Überschrift
- sekundärer Subtitle
- plus.circle.fill-Button oben rechts

### Listen-Pattern
- LazyVStack
- DividerLine (DesignSystem-Atom, 0.5px, Color.divider1, rowIndent 56px)
- keine Borders
- Scroll-Listen haben .padding(.bottom, Spacing.scrollBottom) = 80px

### Empty States
Eigene EmptyStateView:
- graues SF Symbol
- Titel
- Sub-Message

### Farben
Aurora Dark-Mode-only. Token-System in Color+Tokens.swift.
Alle Farbwerte als statische Color-Extensions. Keine Literalfarben in Views.
Zentrale Tokens:
- surface1/2/3 — Hover, Badge, Overlay-Hintergründe
- divider1/2 — Trennlinien
- textPrimary / textSecondary / textTertiary / textQuaternary — Text-Hierarchie
- appAccent / appAccentBg — Primär-Akzent (Forest Green)
- calBlue / calBg — Deadline-Chips
- warnOrange / warnBg — Fällige Erinnerungen, Review-Icon
- danger — Overdue, high priority
- priorityHigh / priorityMedium / priorityLow — Priority-Dots
- windowBg / wallTop / wallBottom — Hintergrund-Ebenen

### Interaction Pattern
- ganze Task-Row klickbar
- Completion-Kreis separater Button

### Reminder Overlay
- präsent aber dezent
- Material Background
- Floating Shadow
- dünner Border
- 14px Corner Radius

Vermeiden:
- überladene Interfaces
- Corporate Dashboard Look
- Jira-Komplexität
- visuelles Chaos

---

## Coding Standards

- Keine Kommentare ausser MARK-Sections
- Models sind Codable + Equatable
- UUID-basierte IDs
- ISO8601-Dates
- Views konsumieren TaskStore via @EnvironmentObject
- keine direkten Persistence-Calls aus Views
- TaskStore ist @MainActor
- Reusable Components in Views/Shared
- DesignSystem-Atoms in FocusFlow/DesignSystem/
- Keine Literal-Farbwerte in Views — immer Color-Token verwenden
- Keine Literal-Abstände ausser in DesignSystem selbst — Spacing-Enum verwenden
- Kein System-Divider() in Listen — DividerLine() verwenden

### Naming
- deutsche User-Facing-Strings
- englische Code-Identifier
- Views enden auf View
- ObservableObjects auf Store / Center / Service

### Safety
- keine Force-Unwraps
- Optional-Chaining bevorzugt

### Reminder-Regeln
- Reminder automatisch bei add/update reschedulen
- Reminder bei complete/delete canceln
- ReminderService nie direkt aus Views aufrufen

### NSPanel-Regel
contentViewController immer vor setContentSize setzen.

---

## Git / Workflow

- Branch:
  claude/review-context-codebase-XZQfG

- Remote:
  mxhammes-ship-it/to-do-app

- Letzter Commit:
  a0013a0 (Schritt 6C: Sidebar Item Polish)

Projekt öffnen:

open FocusFlow.xcodeproj

Build:
⌘R in Xcode

Commits enthalten:
https://claude.ai/code/session_* als Trailer
