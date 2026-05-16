import SwiftUI

struct InboxView: View {
    @EnvironmentObject var taskStore: TaskStore
    @Binding var taskToEdit: FocusTask?
    @Binding var showingTaskForm: Bool

    var body: some View {
        VStack(spacing: 0) {
            ViewHeader(
                title: "Inbox",
                subtitle: taskStore.inboxTasks.isEmpty ? "Inbox Zero 🎉" : "\(taskStore.inboxTasks.count) Aufgaben zu verarbeiten",
                onAdd: { taskToEdit = nil; showingTaskForm = true }
            )

            if taskStore.inboxTasks.isEmpty {
                EmptyStateView(
                    icon: "tray",
                    title: "Inbox ist leer",
                    message: "Alle Aufgaben wurden verarbeitet."
                )
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(taskStore.inboxTasks) { task in
                            InboxTaskRow(task: task) {
                                taskToEdit = task
                                showingTaskForm = true
                            }
                            Divider().padding(.leading, 56)
                        }
                    }
                    .padding(.bottom, 24)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    }
}

private struct InboxTaskRow: View {
    @EnvironmentObject var taskStore: TaskStore
    let task: FocusTask
    let onEdit: () -> Void

    var body: some View {
        HStack(spacing: 0) {
            Image(systemName: "circle")
                .foregroundStyle(.tertiary)
                .frame(width: 36, height: 36)
                .padding(.leading, 12)

            VStack(alignment: .leading, spacing: 3) {
                Text(task.title)
                    .font(.body)
                if !task.notes.isEmpty {
                    Text(task.notes)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
                if let project = taskStore.project(for: task) {
                    HStack(spacing: 3) {
                        Circle().fill(project.colorName.color).frame(width: 6, height: 6)
                        Text(project.name).font(.caption).foregroundStyle(.secondary)
                    }
                }
            }
            .padding(.vertical, 10)
            .padding(.leading, 8)
            .contentShape(Rectangle())
            .onTapGesture { onEdit() }

            Spacer()

            Button("Heute") { taskStore.moveToToday(task) }
                .buttonStyle(.borderedProminent)
                .controlSize(.small)
                .padding(.trailing, 16)
        }
    }
}
