import SwiftUI

struct ReviewView: View {
    @EnvironmentObject var taskStore: TaskStore
    @Binding var taskToEdit: FocusTask?
    @Binding var showingTaskForm: Bool

    var body: some View {
        VStack(spacing: 0) {
            ViewHeader(
                title: "Review",
                subtitle: taskStore.reviewTasks.isEmpty
                    ? "Alles erledigt"
                    : "\(taskStore.reviewTasks.count) Aufgaben aus dem Vortag",
                onAdd: { taskToEdit = nil; showingTaskForm = true }
            )

            if taskStore.reviewTasks.isEmpty {
                EmptyStateView(
                    icon: "checkmark.seal",
                    title: "Alles erledigt!",
                    message: "Keine ausstehenden Aufgaben aus dem Vortag."
                )
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(taskStore.reviewTasks) { task in
                            ReviewTaskRow(task: task) {
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

private struct ReviewTaskRow: View {
    @EnvironmentObject var taskStore: TaskStore
    let task: FocusTask
    let onEdit: () -> Void

    var body: some View {
        HStack(spacing: 0) {
            Image(systemName: "arrow.clockwise.circle.fill")
                .foregroundStyle(Color.warnOrange)
                .font(.title3)
                .frame(width: 36, height: 36)
                .padding(.leading, 12)

            VStack(alignment: .leading, spacing: 3) {
                Text(task.title).font(.body)
                if let deadline = task.deadline {
                    Text(deadline, format: .dateTime.day().month().year())
                        .font(.caption)
                        .foregroundStyle(Color.textSecondary)
                }
            }
            .padding(.vertical, 10)
            .padding(.leading, 8)

            Spacer()

            HStack(spacing: 6) {
                GlassButton(systemImage: "sun.max", label: "Heute", variant: .secondary) {
                    taskStore.moveToToday(task)
                }

                GlassButton(systemImage: "checkmark", label: "Fertig", variant: .primary) {
                    taskStore.completeTask(task)
                }

                Button { onEdit() } label: {
                    Image(systemName: "pencil.circle").foregroundStyle(Color.textTertiary)
                }
                .buttonStyle(.plain)
            }
            .padding(.trailing, 16)
        }
    }
}
