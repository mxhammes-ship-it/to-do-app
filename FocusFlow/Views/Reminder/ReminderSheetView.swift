import SwiftUI

// Shown as a sheet when a reminder fires while the app is open.
// For background reminders the system notification handles delivery.
struct ReminderSheetView: View {
    @EnvironmentObject var taskStore: TaskStore
    @Environment(\.dismiss) var dismiss
    let task: FocusTask

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            HStack {
                Label("Reminder", systemImage: "bell.fill")
                    .font(.headline)
                    .foregroundStyle(.orange)
                Spacer()
                Button {
                    taskStore.completeTask(task)
                    dismiss()
                } label: {
                    Label("Erledigt", systemImage: "checkmark.circle.fill")
                        .foregroundStyle(.green)
                }
                .buttonStyle(.plain)
            }

            Text(task.title)
                .font(.title3)
                .fontWeight(.medium)

            if !task.notes.isEmpty {
                Text(task.notes)
                    .font(.callout)
                    .foregroundStyle(.secondary)
            }

            Divider()

            Text("Erinnere mich in …")
                .font(.caption)
                .foregroundStyle(.secondary)
                .textCase(.uppercase)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
                SnoozeButton("15 Minuten") { snooze(minutes: 15) }
                SnoozeButton("30 Minuten") { snooze(minutes: 30) }
                SnoozeButton("1 Stunde")   { snooze(minutes: 60) }
                SnoozeButton("2 Stunden")  { snooze(minutes: 120) }
                SnoozeButton("Morgen früh (8:00)", fullWidth: true) { snoozeTomorrow() }
            }

            Button("Schliessen") { dismiss() }
                .frame(maxWidth: .infinity)
                .padding(.top, 4)
        }
        .padding(24)
        .frame(width: 340)
    }

    private func snooze(minutes: Int) {
        var updated = task
        updated.reminderDate = Date().addingTimeInterval(Double(minutes) * 60)
        taskStore.updateTask(updated)
        if let date = updated.reminderDate {
            ReminderService.shared.schedule(task: updated, at: date)
        }
        dismiss()
    }

    private func snoozeTomorrow() {
        var updated = task
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date()
        updated.reminderDate = Calendar.current.date(bySettingHour: 8, minute: 0, second: 0, of: tomorrow)
        taskStore.updateTask(updated)
        if let date = updated.reminderDate {
            ReminderService.shared.schedule(task: updated, at: date)
        }
        dismiss()
    }
}

private struct SnoozeButton: View {
    let label: String
    let fullWidth: Bool
    let action: () -> Void

    init(_ label: String, fullWidth: Bool = false, action: @escaping () -> Void) {
        self.label = label
        self.fullWidth = fullWidth
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            Text(label)
                .frame(maxWidth: fullWidth ? .infinity : nil)
        }
        .buttonStyle(.bordered)
        .controlSize(.regular)
        .gridCellColumns(fullWidth ? 2 : 1)
    }
}
