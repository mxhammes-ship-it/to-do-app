import SwiftUI
import AppKit

struct TaskRowView: View {
    @EnvironmentObject var taskStore: TaskStore
    let task: FocusTask
    let onEdit: () -> Void

    @State private var completed = false
    @State private var circleScale: CGFloat = 1.0
    @State private var ringScale: CGFloat = 1.0
    @State private var ringOpacity: Double = 0.0

    var body: some View {
        HStack(spacing: 0) {
            ZStack {
                Circle()
                    .strokeBorder(priorityColor, lineWidth: 2)
                    .frame(width: 20, height: 20)
                    .scaleEffect(ringScale)
                    .opacity(ringOpacity)

                if completed {
                    Circle()
                        .fill(priorityColor)
                        .frame(width: 20, height: 20)
                    Image(systemName: "checkmark")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundStyle(.white)
                } else {
                    Circle()
                        .strokeBorder(priorityColor.opacity(0.7), lineWidth: 1.5)
                        .frame(width: 20, height: 20)
                }
            }
            .scaleEffect(circleScale)
            .frame(width: 36, height: 36)
            .padding(.leading, 12)
            .contentShape(Rectangle())
            .onTapGesture { triggerCompletion() }

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
                            Text(deadline, format: .dateTime.day(.twoDigits).month())
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

    private var priorityColor: Color {
        switch task.priority {
        case .high:   return .red
        case .medium: return .orange
        case .low:    return .blue
        case nil:     return Color(nsColor: .tertiaryLabelColor)
        }
    }

    private func isOverdue(_ date: Date) -> Bool {
        date < Calendar.current.startOfDay(for: Date())
    }

    private func triggerCompletion() {
        guard !completed else { return }
        NSSound(named: "Tink")?.play()

        ringScale = 1.0
        ringOpacity = 0.7

        withAnimation(.spring(response: 0.3, dampingFraction: 0.5)) {
            completed = true
            circleScale = 1.25
        }
        withAnimation(.spring(response: 0.25, dampingFraction: 0.8).delay(0.1)) {
            circleScale = 1.0
        }
        withAnimation(.easeOut(duration: 0.45)) {
            ringScale = 1.9
            ringOpacity = 0.0
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.7) {
            taskStore.completeTask(task)
        }
    }
}
