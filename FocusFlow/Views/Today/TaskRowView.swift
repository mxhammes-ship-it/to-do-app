import SwiftUI

struct TaskRowView: View {
    @EnvironmentObject var taskStore: TaskStore
    let task: FocusTask
    let onEdit: () -> Void

    @State private var completed = false
    @State private var isHovered = false

    var body: some View {
        HStack(spacing: 0) {
            CheckCircle(isCompleted: completed, action: triggerCompletion)
                .padding(.leading, Spacing.rowLeading)

            // Content
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    if let priority = task.priority {
                        Circle()
                            .fill(priorityDotColor(priority))
                            .frame(width: 6, height: 6)
                    }

                    Text(task.title)
                        .font(.body)
                        .strikethrough(completed)
                        .foregroundStyle(completed ? Color.textSecondary : Color.textPrimary)
                        .animation(.easeInOut(duration: 0.2), value: completed)
                }

                HStack(spacing: 10) {
                    if let deadline = task.deadline {
                        Text(deadline, format: .dateTime.day().month())
                            .font(.caption)
                            .foregroundStyle(isOverdue(deadline) ? Color.danger : Color.calBlue)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(isOverdue(deadline) ? Color.warnBg : Color.calBg, in: Capsule())
                    }

                    if let project = taskStore.project(for: task) {
                        HStack(spacing: 3) {
                            Circle()
                                .fill(project.colorName.color)
                                .frame(width: 6, height: 6)
                            Text(project.name)
                                .font(.caption)
                                .foregroundStyle(Color.textSecondary)
                        }
                    }

                    if let mins = task.estimatedMinutes {
                        Label("\(mins) Min", systemImage: "clock")
                            .font(.caption)
                            .foregroundStyle(Color.textSecondary)
                    }

                    ForEach(task.tags.prefix(2), id: \.self) { tag in
                        Text(tag)
                            .font(.caption2)
                            .padding(.horizontal, 5)
                            .padding(.vertical, 2)
                            .background(Color.surface2, in: Capsule())
                            .foregroundStyle(Color.textSecondary)
                    }
                }
            }
            .padding(.vertical, 10)
            .padding(.leading, 8)
            .contentShape(Rectangle())
            .onTapGesture { onEdit() }

            Spacer()
        }
        .background(isHovered ? Color.surface1 : .clear, in: RoundedRectangle(cornerRadius: 6))
        .contentShape(Rectangle())
        .onHover { isHovered = $0 }
    }

    private func isOverdue(_ date: Date) -> Bool {
        date < Calendar.current.startOfDay(for: Date())
    }

    private func priorityDotColor(_ priority: TaskPriority) -> Color {
        switch priority {
        case .high:   return Color.priorityHigh
        case .medium: return Color.priorityMedium
        case .low:    return Color.priorityLow
        }
    }

    private func triggerCompletion() {
        completed = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
            taskStore.completeTask(task)
        }
    }
}
