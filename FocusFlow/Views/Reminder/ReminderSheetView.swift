import AppKit
import SwiftUI

// MARK: - Reminder Center (zentrale Verwaltung aller aktiven Reminders)

@MainActor
final class ReminderCenter: ObservableObject {
    static let shared = ReminderCenter()

    @Published var activeTasks: [FocusTask] = []
    weak var store: TaskStore?

    private init() {}

    func present(task: FocusTask) {
        if let idx = activeTasks.firstIndex(where: { $0.id == task.id }) {
            activeTasks[idx] = task
        } else {
            activeTasks.append(task)
        }
        ReminderWindowController.showIfNeeded()
    }

    func dismiss(taskID: UUID) {
        activeTasks.removeAll { $0.id == taskID }
        if activeTasks.isEmpty { ReminderWindowController.close() }
    }

    func dismissAll() {
        activeTasks.removeAll()
        ReminderWindowController.close()
    }

    func snooze(taskID: UUID, minutes: Int) {
        guard let task = activeTasks.first(where: { $0.id == taskID }),
              let store else { return }
        var updated = task
        updated.reminderDate = Date().addingTimeInterval(Double(minutes) * 60)
        store.updateTask(updated)
        if let date = updated.reminderDate {
            ReminderService.shared.schedule(task: updated, at: date)
        }
        dismiss(taskID: taskID)
    }

    func snoozeTomorrow(taskID: UUID) {
        guard let task = activeTasks.first(where: { $0.id == taskID }),
              let store else { return }
        var updated = task
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date()
        updated.reminderDate = Calendar.current.date(bySettingHour: 8, minute: 0, second: 0, of: tomorrow)
        store.updateTask(updated)
        if let date = updated.reminderDate {
            ReminderService.shared.schedule(task: updated, at: date)
        }
        dismiss(taskID: taskID)
    }

    func complete(taskID: UUID) {
        guard let task = activeTasks.first(where: { $0.id == taskID }),
              let store else { return }
        store.completeTask(task)
        dismiss(taskID: taskID)
    }
}

// MARK: - Window Controller

@MainActor
final class ReminderWindowController {
    private static var panel: NSPanel?

    static func showIfNeeded() {
        if panel == nil {
            create()
        } else {
            panel?.orderFrontRegardless()
        }
    }

    static func close() {
        panel?.close()
        panel = nil
    }

    private static func create() {
        let view = ReminderPanelView()
            .environmentObject(ReminderCenter.shared)
        let hosting = NSHostingController(rootView: view)
        let size = CGSize(width: 360, height: 480)

        let p = NSPanel(
            contentRect: NSRect(origin: .zero, size: size),
            styleMask: [.nonactivatingPanel, .borderless],
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
        p.setContentSize(size)

        if let screen = NSScreen.main {
            let x = screen.visibleFrame.maxX - size.width - 20
            let y = screen.visibleFrame.maxY - size.height - 20
            p.setFrameOrigin(NSPoint(x: x, y: y))
        }
        p.orderFrontRegardless()
        panel = p
    }
}

// MARK: - Panel View

struct ReminderPanelView: View {
    @EnvironmentObject var center: ReminderCenter
    @State private var selectedID: UUID?

    private var selectedTask: FocusTask? {
        if let id = selectedID, let t = center.activeTasks.first(where: { $0.id == id }) {
            return t
        }
        return center.activeTasks.first
    }

    var body: some View {
        VStack(spacing: 0) {
            header
            Divider().opacity(0.5)
            taskList
            Divider().opacity(0.5)
            if let task = selectedTask {
                snoozeSection(for: task)
                Divider().opacity(0.5)
                actionBar(for: task)
            }
        }
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 14))
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .strokeBorder(Color.primary.opacity(0.08), lineWidth: 0.5)
        )
        .frame(width: 360)
        .onAppear {
            if selectedID == nil { selectedID = center.activeTasks.first?.id }
        }
        .onChange(of: center.activeTasks) { new in
            if let id = selectedID, !new.contains(where: { $0.id == id }) {
                selectedID = new.first?.id
            }
        }
    }

    // MARK: Header

    private var header: some View {
        HStack(spacing: 8) {
            Image(systemName: "bell.fill")
                .foregroundStyle(.orange)
                .font(.subheadline)
            Text(center.activeTasks.count == 1
                 ? "1 Reminder"
                 : "\(center.activeTasks.count) Reminder")
                .font(.subheadline)
                .fontWeight(.semibold)
            Spacer()
            if center.activeTasks.count > 1 {
                Button("Alle schliessen") { center.dismissAll() }
                    .buttonStyle(.plain)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Button {
                if let id = selectedTask?.id {
                    center.dismiss(taskID: id)
                } else {
                    center.dismissAll()
                }
            } label: {
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
    }

    // MARK: Task List

    private var taskList: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(center.activeTasks) { task in
                    ReminderTaskRow(
                        task: task,
                        isSelected: task.id == selectedTask?.id
                    )
                    .contentShape(Rectangle())
                    .onTapGesture { selectedID = task.id }
                    if task.id != center.activeTasks.last?.id {
                        Divider().padding(.leading, 36).opacity(0.4)
                    }
                }
            }
        }
        .frame(maxHeight: min(CGFloat(center.activeTasks.count) * 56 + 8, 200))
    }

    // MARK: Snooze Section

    private func snoozeSection(for task: FocusTask) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Erinnere mich in …")
                .font(.caption)
                .foregroundStyle(.secondary)

            HStack(spacing: 6) {
                SnoozeChip("15 Min") { center.snooze(taskID: task.id, minutes: 15) }
                SnoozeChip("30 Min") { center.snooze(taskID: task.id, minutes: 30) }
                SnoozeChip("1 Std")  { center.snooze(taskID: task.id, minutes: 60) }
            }
            HStack(spacing: 6) {
                SnoozeChip("2 Std") { center.snooze(taskID: task.id, minutes: 120) }
                SnoozeChip("4 Std") { center.snooze(taskID: task.id, minutes: 240) }
                Color.clear.frame(maxWidth: .infinity) // Platzhalter für Spaltenbreite
            }
            Button { center.snoozeTomorrow(taskID: task.id) } label: {
                Label("Morgen früh, 8:00 Uhr", systemImage: "sunrise")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.bordered)
            .controlSize(.regular)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
    }

    // MARK: Action Bar

    private func actionBar(for task: FocusTask) -> some View {
        HStack(spacing: 8) {
            Button("Schliessen") { center.dismiss(taskID: task.id) }
                .buttonStyle(.bordered)
                .frame(maxWidth: .infinity)
            Button { center.complete(taskID: task.id) } label: {
                Label("Erledigt", systemImage: "checkmark")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(.green)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
    }
}

// MARK: - Task Row

private struct ReminderTaskRow: View {
    let task: FocusTask
    let isSelected: Bool

    var body: some View {
        HStack(spacing: 10) {
            Circle()
                .fill(priorityColor.opacity(isSelected ? 1.0 : 0.4))
                .frame(width: 8, height: 8)

            VStack(alignment: .leading, spacing: 2) {
                Text(task.title)
                    .font(.subheadline)
                    .fontWeight(isSelected ? .semibold : .regular)
                    .lineLimit(1)
                HStack(spacing: 6) {
                    if let deadline = task.deadline {
                        Text(deadline, format: .dateTime.day().month())
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                    if let priority = task.priority {
                        Text(priority.displayName)
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            Spacer()
            if isSelected {
                Image(systemName: "chevron.right")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .background(isSelected ? Color.accentColor.opacity(0.12) : .clear)
    }

    private var priorityColor: Color {
        switch task.priority {
        case .high:   return .red
        case .medium: return .orange
        case .low:    return .blue
        case nil:     return .gray
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
