import AppKit
import SwiftUI

// MARK: - Window Controller

@MainActor
final class ReminderWindowController {
    private static var current: ReminderWindowController?
    private var panel: NSPanel?

    static func present(task: FocusTask, store: TaskStore) {
        current?.dismiss()
        let controller = ReminderWindowController()
        controller.show(task: task, store: store)
        current = controller
    }

    static func dismissCurrent() {
        current?.dismiss()
        current = nil
    }

    private func show(task: FocusTask, store: TaskStore) {
        let view = ReminderPanelView(
            task: task,
            onSnooze: { minutes in
                var updated = task
                updated.reminderDate = Date().addingTimeInterval(Double(minutes) * 60)
                store.updateTask(updated)
                if let date = updated.reminderDate {
                    ReminderService.shared.schedule(task: updated, at: date)
                }
                ReminderWindowController.dismissCurrent()
            },
            onSnoozeTomorrow: {
                var updated = task
                let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date()
                updated.reminderDate = Calendar.current.date(bySettingHour: 8, minute: 0, second: 0, of: tomorrow)
                store.updateTask(updated)
                if let date = updated.reminderDate {
                    ReminderService.shared.schedule(task: updated, at: date)
                }
                ReminderWindowController.dismissCurrent()
            },
            onComplete: {
                store.completeTask(task)
                ReminderWindowController.dismissCurrent()
            },
            onDismiss: {
                ReminderWindowController.dismissCurrent()
            }
        )

        let hosting = NSHostingController(rootView: view)

        // Measure required height
        hosting.view.frame = NSRect(origin: .zero, size: CGSize(width: 340, height: 600))
        hosting.view.layoutSubtreeIfNeeded()
        let height = max(hosting.view.fittingSize.height, 260)

        let p = NSPanel(
            contentRect: NSRect(x: 0, y: 0, width: 340, height: height),
            styleMask: [.nonactivatingPanel, .fullSizeContentView, .borderless],
            backing: .buffered,
            defer: false
        )
        p.isFloatingPanel = true
        p.level = .floating
        p.isOpaque = false
        p.backgroundColor = .clear
        p.hasShadow = true
        p.isMovableByWindowBackground = true
        p.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        p.contentViewController = hosting
        p.setContentSize(CGSize(width: 340, height: height))

        // Top-right corner, 20pt margin
        if let screen = NSScreen.main {
            let x = screen.visibleFrame.maxX - 340 - 20
            let y = screen.visibleFrame.maxY - height - 20
            p.setFrameOrigin(NSPoint(x: x, y: y))
        }

        p.orderFrontRegardless()
        self.panel = p
    }

    func dismiss() {
        panel?.close()
        panel = nil
    }
}

// MARK: - Panel View

struct ReminderPanelView: View {
    let task: FocusTask
    let onSnooze: (Int) -> Void
    let onSnoozeTomorrow: () -> Void
    let onComplete: () -> Void
    let onDismiss: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header bar
            HStack(spacing: 8) {
                Image(systemName: "bell.fill")
                    .foregroundStyle(.orange)
                    .font(.subheadline)
                Text("Reminder")
                    .font(.subheadline)
                    .fontWeight(.semibold)
                Spacer()
                Button(action: onDismiss) {
                    Image(systemName: "xmark")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .frame(width: 20, height: 20)
                        .background(.quaternary, in: Circle())
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 12)

            Divider().opacity(0.5)

            // Task info
            VStack(alignment: .leading, spacing: 6) {
                Text(task.title)
                    .font(.body)
                    .fontWeight(.medium)
                    .fixedSize(horizontal: false, vertical: true)
                    .lineLimit(3)

                HStack(spacing: 6) {
                    if let deadline = task.deadline {
                        Label {
                            Text(deadline, format: .dateTime.day().month().year())
                        } icon: {
                            Image(systemName: "calendar")
                        }
                        .font(.caption)
                        .foregroundStyle(deadline < Calendar.current.startOfDay(for: Date()) ? .red : .secondary)
                    }
                    if let priority = task.priority {
                        Text(priority.displayName)
                            .font(.caption2)
                            .padding(.horizontal, 5)
                            .padding(.vertical, 2)
                            .background(priorityColor(priority).opacity(0.12), in: Capsule())
                            .foregroundStyle(priorityColor(priority))
                    }
                }
            }
            .padding(.horizontal, 14)
            .padding(.top, 12)
            .padding(.bottom, 14)

            Divider().opacity(0.5)

            // Snooze section
            VStack(alignment: .leading, spacing: 8) {
                Text("Erinnere mich in …")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                HStack(spacing: 6) {
                    SnoozeChip("15 Min") { onSnooze(15) }
                    SnoozeChip("30 Min") { onSnooze(30) }
                    SnoozeChip("1 Std")  { onSnooze(60) }
                    SnoozeChip("2 Std")  { onSnooze(120) }
                }

                Button(action: onSnoozeTomorrow) {
                    Label("Morgen früh, 8:00 Uhr", systemImage: "sunrise")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                .controlSize(.regular)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 12)

            Divider().opacity(0.5)

            // Action buttons
            HStack(spacing: 8) {
                Button("Schliessen", action: onDismiss)
                    .buttonStyle(.bordered)
                    .frame(maxWidth: .infinity)

                Button(action: onComplete) {
                    Label("Erledigt", systemImage: "checkmark")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(.green)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 12)
        }
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 14))
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .strokeBorder(Color.primary.opacity(0.08), lineWidth: 0.5)
        )
        .frame(width: 340)
    }

    private func priorityColor(_ priority: TaskPriority) -> Color {
        switch priority {
        case .high:   return .red
        case .medium: return .orange
        case .low:    return .blue
        }
    }
}

// MARK: - Snooze Chip

private struct SnoozeChip: View {
    let label: String
    let action: () -> Void

    init(_ label: String, action: @escaping () -> Void) {
        self.label = label
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            Text(label).frame(maxWidth: .infinity)
        }
        .buttonStyle(.bordered)
        .controlSize(.regular)
    }
}
