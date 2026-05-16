import AppKit
import SwiftUI

// MARK: - Reminder Center

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
        let count = activeTasks.count
        DispatchQueue.main.async {
            ReminderWindowController.showIfNeeded(taskCount: count)
        }
    }

    func clearAndDismiss(taskID: UUID) {
        if let task = activeTasks.first(where: { $0.id == taskID }),
           let store {
            var updated = task
            updated.reminderDate = nil
            store.updateTask(updated)
        }
        dismiss(taskID: taskID)
    }

    func dismiss(taskID: UUID) {
        activeTasks.removeAll { $0.id == taskID }
        let count = activeTasks.count
        DispatchQueue.main.async {
            if count == 0 {
                ReminderWindowController.close()
            } else {
                ReminderWindowController.resize(for: count)
            }
        }
    }

    func dismissAll() {
        activeTasks.removeAll()
        DispatchQueue.main.async {
            ReminderWindowController.close()
        }
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

    static func showIfNeeded(taskCount: Int) {
        if panel == nil {
            create(taskCount: taskCount)
        } else {
            resize(for: taskCount)
            panel?.orderFrontRegardless()
        }
    }

    static func close() {
        panel?.close()
        panel = nil
    }

    static func resize(for taskCount: Int) {
        guard let panel else { return }
        let newSize = CGSize(width: 360, height: panelHeight(for: taskCount))
        panel.setContentSize(newSize)
        if let screen = NSScreen.main {
            let origin = NSPoint(
                x: screen.visibleFrame.maxX - newSize.width - 20,
                y: screen.visibleFrame.maxY - newSize.height - 20
            )
            panel.setFrameOrigin(origin)
        }
    }

    private static func panelHeight(for taskCount: Int) -> CGFloat {
        switch taskCount {
        case 1:  return 200
        default: return 248
        }
    }

    private static func create(taskCount: Int) {
        let view = ReminderPanelView()
            .environmentObject(ReminderCenter.shared)
        let hosting = NSHostingController(rootView: view)
        let size = CGSize(width: 360, height: panelHeight(for: taskCount))

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
            let origin = NSPoint(
                x: screen.visibleFrame.maxX - size.width - 20,
                y: screen.visibleFrame.maxY - size.height - 20
            )
            p.setFrameOrigin(origin)
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
            if let task = selectedTask {
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
        .onChange(of: center.activeTasks) { _, new in
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
        .padding(.vertical, 10)
    }

    // MARK: Task List

    @ViewBuilder
    private var taskList: some View {
        if center.activeTasks.count <= 2 {
            // Exact fit – kein überschüssiger Leerraum
            VStack(spacing: 0) {
                ForEach(center.activeTasks) { task in
                    ReminderTaskRow(task: task, isSelected: task.id == selectedTask?.id)
                        .contentShape(Rectangle())
                        .onTapGesture { selectedID = task.id }
                    if task.id != center.activeTasks.last?.id {
                        Divider().padding(.leading, 36).opacity(0.4)
                    }
                }
            }
        } else {
            // Ab 3 Tasks: feste Höhe für 2 sichtbare Rows, Rest scrollbar
            ScrollView {
                LazyVStack(spacing: 0) {
                    ForEach(center.activeTasks) { task in
                        ReminderTaskRow(task: task, isSelected: task.id == selectedTask?.id)
                            .contentShape(Rectangle())
                            .onTapGesture { selectedID = task.id }
                        if task.id != center.activeTasks.last?.id {
                            Divider().padding(.leading, 36).opacity(0.4)
                        }
                    }
                }
            }
            .frame(height: 97)
        }
    }

    // MARK: Action Bar

    private func actionBar(for task: FocusTask) -> some View {
        VStack(spacing: 8) {
            // Split-Snooze: Klick = 15 Min, Pfeil = Dropdown
            HStack(spacing: 0) {
                Button("Snooze") {
                    center.snooze(taskID: task.id, minutes: 15)
                }
                .buttonStyle(.plain)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 6)

                Divider().frame(height: 18)

                Menu {
                    Button("15 Minuten") { center.snooze(taskID: task.id, minutes: 15) }
                    Button("30 Minuten") { center.snooze(taskID: task.id, minutes: 30) }
                    Button("1 Stunde")   { center.snooze(taskID: task.id, minutes: 60) }
                    Button("2 Stunden")  { center.snooze(taskID: task.id, minutes: 120) }
                    Button("4 Stunden")  { center.snooze(taskID: task.id, minutes: 240) }
                    Divider()
                    Button("1 Tag")      { center.snooze(taskID: task.id, minutes: 1440) }
                    Button("2 Tage")     { center.snooze(taskID: task.id, minutes: 2880) }
                    Button("1 Woche")    { center.snooze(taskID: task.id, minutes: 10080) }
                } label: {
                    Image(systemName: "chevron.down")
                        .font(.caption.weight(.medium))
                        .frame(width: 28)
                        .padding(.vertical, 6)
                }
                .menuStyle(.borderlessButton)
                .menuIndicator(.hidden)
            }
            .background(.quaternary.opacity(0.6))
            .clipShape(RoundedRectangle(cornerRadius: 6))
            .overlay(RoundedRectangle(cornerRadius: 6).stroke(Color.secondary.opacity(0.2), lineWidth: 0.5))

            HStack(spacing: 8) {
                Button("Schliessen") { center.clearAndDismiss(taskID: task.id) }
                    .buttonStyle(.bordered)
                    .frame(maxWidth: .infinity)

                Button { center.complete(taskID: task.id) } label: {
                    Label("Erledigt", systemImage: "checkmark")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(.green)
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 11)
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
                        Text(deadline, format: .dateTime.day(.twoDigits).month())
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
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .background(isSelected ? Color.accentColor.opacity(0.07) : .clear)
        .overlay(alignment: .leading) {
            if isSelected {
                Rectangle()
                    .fill(Color.accentColor)
                    .frame(width: 3)
            }
        }
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
