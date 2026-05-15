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
                .foregroundStyle(.orange)
                .font(.title3)
                .frame(width: 36, height: 36)
                .padding(.leading, 12)

            VStack(alignment: .leading, spacing: 3) {
                Text(task.title).font(.body)
                if let deadline = task.deadline {
                    Text(deadline, format: .dateTime.day().month().year())
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .padding(.vertical, 10)
            .padding(.leading, 8)

            Spacer()

            HStack(spacing: 6) {
                Button("Heute") { taskStore.moveToToday(task) }
                    .buttonStyle(.borderedProminent)
                    .controlSize(.small)

                Button("Fertig") { taskStore.completeTask(task) }
                    .buttonStyle(.bordered)
                    .controlSize(.small)
                    .tint(.green)

                Button { onEdit() } label: {
                    Image(systemName: "pencil.circle").foregroundStyle(.secondary)
                }
                .buttonStyle(.plain)
            }
            .padding(.trailing, 16)
        }
    }
}
