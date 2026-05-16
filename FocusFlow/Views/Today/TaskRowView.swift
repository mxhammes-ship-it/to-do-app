import SwiftUI

struct TaskRowView: View {
    @EnvironmentObject var taskStore: TaskStore
    let task: FocusTask
    let onEdit: () -> Void

    @State private var completed = false

    var body: some View {
        HStack(spacing: 0) {
            CheckCircle(isCompleted: completed, action: triggerCompletion)
                .padding(.leading, Spacing.rowLeading)

            // Content
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(task.title)
                        .font(.body)
                        .strikethrough(completed)
                        .foregroundStyle(completed ? .secondary : .primary)
                        .animation(.easeInOut(duration: 0.2), value: completed)

                    if task.priority == .high {
                        Image(systemName: "exclamationmark")
                            .font(.caption)
                            .foregroundStyle(.red)
                    }
                }

                HStack(spacing: 10) {
                    if let deadline = task.deadline {
                        Label {
                            Text(deadline, format: .dateTime.day().month())
                        } icon: {
                            Image(systemName: "calendar")
                        }
                        .font(.caption)
                        .foregroundStyle(isOverdue(deadline) ? .red : .secondary)
                    }

                    if let project = taskStore.project(for: task) {
                        HStack(spacing: 3) {
                            Circle()
                                .fill(project.colorName.color)
                                .frame(width: 6, height: 6)
                            Text(project.name)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }

                    if let mins = task.estimatedMinutes {
                        Label("\(mins) Min", systemImage: "clock")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }

                    ForEach(task.tags.prefix(2), id: \.self) { tag in
                        Text(tag)
                            .font(.caption2)
                            .padding(.horizontal, 5)
                            .padding(.vertical, 2)
                            .background(.quaternary, in: Capsule())
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .padding(.vertical, 10)
            .padding(.leading, 8)
            .contentShape(Rectangle())
            .onTapGesture { onEdit() }

            Spacer()
        }
        .contentShape(Rectangle())
    }

    private func isOverdue(_ date: Date) -> Bool {
        date < Calendar.current.startOfDay(for: Date())
    }

    private func triggerCompletion() {
        completed = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
            taskStore.completeTask(task)
        }
    }
}
