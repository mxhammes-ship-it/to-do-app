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
- Projekte (Abschnittstitel; darunter alle Projekte direkt verlinkt)
  - [Projektname 1]
  - [Projektname 2]
  - + Neues Projekt (Button im Abschnittsheader)
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
Tasks lassen sich mit einem Klick nach „Heute" verschieben.
Klick auf die Task-Row öffnet den Edit-Dialog (kein separates Icon).
Quick Entry Bar: Permanentes Eingabefeld am unteren Rand aller Views.
Text eingeben + Enter → Task landet sofort in Inbox. Sichtbar in jeder Ansicht.

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
Snooze: Split-Button (Klick = 15 Min, Pfeil = Dropdown)
Dropdown-Optionen:
- 15 Min / 30 Min / 1 Std / 2 Std / 4 Std
- Trennlinie
- 1 Tag / 2 Tage / 1 Woche

Schliessen-Verhalten: reminderDate = nil (permanent), Task bleibt in Listen.

### Gamification
Beim Abschliessen einer Task:
- Kreis füllt sich farbig (Prioritätsfarbe)
- Spring-Bounce: circleScale 1.0 → 1.25 → 1.0
- Ripple-Ring: expandiert auf 1.9× und verblasst (easeOut, 0.45s)
- NSSound „Tink" (klar, leicht)
- Task verschwindet nach 0.7s aus der Liste
- Doppelklick durch guard !completed abgesichert

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

### ReminderCenter.clearAndDismiss()
Neues Verhalten seit UX-Iteration: „Schliessen" im Overlay entfernt den
Reminder permanent (reminderDate = nil via store.updateTask). Der Task
bleibt erhalten und erscheint weiterhin in allen Listen. Snooze hingegen
setzt reminderDate auf einen neuen Zeitpunkt.

### ReminderWindowController
Verwaltet ein einzelnes statisches NSPanel.

### ReminderService
Timer-basiertes Reminder-Scheduling.

### PersistenceService
JSON Load/Save.

### SidebarItem
Navigations-Typ in ContentView. Ersetzt SidebarSection? als Selection-Binding.
enum SidebarItem { case section(SidebarSection); case project(UUID) }
SidebarSection hat keinen .projects-Case mehr.

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
- Quick Entry Bar (permanentes Eingabefeld am unteren Rand aller Views)
- Projekte direkt in Sidebar verlinkt (SidebarItem-Enum)
- Reminder „Schliessen" entfernt Reminder permanent (Task bleibt erhalten)
- Completion: Ripple-Ring-Animation + Spring-Bounce + Sound „Tink"
- macOS click-through Fix für Completion-Kreis (.contentShape)

---

## Aktueller Fokus

Der MVP ist funktional abgeschlossen.

Aktueller Fokus:
- Stabilisierung
- UX-Polish
- kleine Produktivitätsverbesserungen
- Reduktion visueller Unruhe
- Vorbereitung für tägliche echte Nutzung

Aktuell keine Priorität:
- Cloud
- Teamfeatures
- Enterprise-Features
- komplexe Integrationen

---

## Aktuelle offene Punkte

Mögliche nächste Erweiterungen:
- Drag & Drop zwischen Sidebar-Sektionen
- globale Suche
- Kontextmenüs auf Task-Rows
- App-Icon
- Login-Item für Auto-Start
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
- Divider
- keine Borders
- klare Einrückungen

### Empty States
Eigene EmptyStateView:
- graues SF Symbol
- Titel
- Sub-Message

### Farben
Sehr zurückhaltend:
- Akzent nur bei Prioritäten
- Projekt-Farbpunkte
- keine bunten Hintergründe

### Interaction Pattern
- Klick auf Task-Row (Content-Bereich) → Edit-Dialog
- Klick auf Completion-Kreis → Task abschliessen
- Kein zusätzliches Stift-Icon oder Edit-Button in Rows
- Quick Entry Bar immer sichtbar (unterer Rand, Enter zum Speichern)
- Sidebar-Projekte: direkte Navigation, kein Zwischen-Sheet

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

## macOS-spezifische Coding-Regeln

### macOS Hit-Testing
Transparente View-Bereiche leiten Klicks durch ("click-through"). ZStack-
Elemente mit strokeBorder-Kreisen o.Ä. müssen `.contentShape(Rectangle())`
erhalten, damit der volle Frame anklickbar ist — auch der transparente
Innenbereich. Ohne contentShape reagiert nur der sichtbare Strich auf Klicks.

Pflichtregel für alle interaktiven Custom-Views auf macOS:
- `.contentShape(Rectangle())` (oder `.contentShape(Circle())`) setzen
- Gilt besonders für Completion-Circles, Icons und Custom-Buttons

### Datums-/Zeitformatierung
- `.datePickerStyle(.field)` für Datumseingabe nutzen (nicht .compact — ignoriert Locale)
- `DateFormatter` mit explizitem `dateFormat` statt `Date.FormatStyle` für numerische
  Datumsdarstellung in German Locale (FormatStyle produziert "16. 5.2026" statt "16.05.2026")
- Reminder-Default: `Date()` (aktuelle Systemzeit)

---

## Git / Workflow

- Branch: claude/review-project-context-9FRzL

- Remote:
  mxhammes-ship-it/to-do-app

- Letzter Commit:
  ed42dcc

Projekt öffnen:
open FocusFlow.xcodeproj

Build:
⌘R in Xcode

Commits enthalten:
https://claude.ai/code/session_* als Trailer
