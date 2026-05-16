import SwiftUI
import AppKit

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

    @State private var completed = false
    @State private var checkScale: CGFloat = 1.0

    var body: some View {
        HStack(spacing: 0) {
            Button { triggerCompletion() } label: {
                ZStack {
                    if completed {
                        Circle()
                            .fill(priorityColor)
                            .frame(width: 20, height: 20)
                        Image(systemName: "checkmark")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundStyle(.white)
                            .scaleEffect(checkScale)
                    } else {
                        Circle()
                            .strokeBorder(priorityColor.opacity(0.7), lineWidth: 1.5)
                            .frame(width: 20, height: 20)
                    }
                }
                .frame(width: 36, height: 36)
            }
            .buttonStyle(.plain)
            .padding(.leading, 12)

            VStack(alignment: .leading, spacing: 3) {
                Text(task.title)
                    .font(.body)
                    .strikethrough(completed)
                    .foregroundStyle(completed ? .secondary : .primary)
                    .animation(.easeInOut(duration: 0.2), value: completed)
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

    private var priorityColor: Color {
        switch task.priority {
        case .high:   return .red
        case .medium: return .orange
        case .low:    return .blue
        case nil:     return Color(nsColor: .tertiaryLabelColor)
        }
    }

    private func triggerCompletion() {
        withAnimation(.spring(response: 0.25, dampingFraction: 0.6)) {
            completed = true
            checkScale = 1.3
        }
        withAnimation(.spring(response: 0.2, dampingFraction: 0.8).delay(0.15)) {
            checkScale = 1.0
        }
        NSSound(named: "Hero")?.play()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.55) {
            taskStore.completeTask(task)
        }
    }
}
