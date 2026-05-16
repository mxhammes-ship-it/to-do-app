import SwiftUI

struct UpcomingView: View {
    @EnvironmentObject var taskStore: TaskStore
    @Binding var taskToEdit: FocusTask?
    @Binding var showingTaskForm: Bool

    private var grouped: [(String, [FocusTask])] {
        let tasks = taskStore.upcomingTasks
        var result: [(String, [FocusTask])] = []
        var seen: [String: [FocusTask]] = [:]
        var order: [String] = []

        for task in tasks {
            let key = sectionKey(for: task)
            if seen[key] == nil {
                seen[key] = []
                order.append(key)
            }
            seen[key]!.append(task)
        }
        for key in order { result.append((key, seen[key]!)) }
        return result
    }

    private func sectionKey(for task: FocusTask) -> String {
        let date = task.plannedDate ?? task.deadline ?? Date()
        let f = DateFormatter()
        f.locale = Locale(identifier: "de_DE")
        f.dateFormat = "EEEE, d. MMMM"
        return f.string(from: date)
    }

    var body: some View {
        VStack(spacing: 0) {
            ViewHeader(title: "Demnächst", onAdd: { taskToEdit = nil; showingTaskForm = true })

            if taskStore.upcomingTasks.isEmpty {
                EmptyStateView(icon: "calendar", title: "Keine geplanten Aufgaben", message: "Plane Aufgaben aus Inbox oder erstelle neue.")
            } else {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 0, pinnedViews: .sectionHeaders) {
                        ForEach(grouped, id: \.0) { section, tasks in
                            Section {
                                ForEach(tasks) { task in
                                    TaskRowView(task: task) { taskToEdit = task; showingTaskForm = true }
                                    Divider().padding(.leading, 56)
                                }
                            } header: {
                                Text(section)
                                    .font(.caption)
                                    .fontWeight(.semibold)
                                    .foregroundStyle(.secondary)
                                    .textCase(.uppercase)
                                    .padding(.horizontal, 24)
                                    .padding(.vertical, 8)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .background(Color.windowBg)
                            }
                        }
                    }
                    .padding(.bottom, 24)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    }
}
