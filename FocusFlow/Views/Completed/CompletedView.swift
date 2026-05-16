import SwiftUI

struct CompletedView: View {
    @EnvironmentObject var taskStore: TaskStore

    private var groupedByDay: [(String, [FocusTask])] {
        var seen: [String: [FocusTask]] = [:]
        var order: [String] = []
        for task in taskStore.completedTasks {
            let key = dayKey(for: task.completedAt ?? task.createdAt)
            if seen[key] == nil { seen[key] = []; order.append(key) }
            seen[key]!.append(task)
        }
        return order.map { ($0, seen[$0]!) }
    }

    private func dayKey(for date: Date) -> String {
        let cal = Calendar.current
        if cal.isDateInToday(date) { return "Heute" }
        if cal.isDateInYesterday(date) { return "Gestern" }
        let f = DateFormatter()
        f.locale = Locale(identifier: "de_DE")
        f.dateFormat = "EEEE, d. MMMM"
        return f.string(from: date)
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                VStack(alignment: .leading, spacing: 3) {
                    Text("Erledigt")
                        .font(.largeTitle).fontWeight(.semibold)
                    Text("\(taskStore.completedTasks.count) erledigte Aufgaben")
                        .font(.subheadline).foregroundStyle(.secondary)
                }
                Spacer()
            }
            .padding(.horizontal, 24)
            .padding(.top, 24)
            .padding(.bottom, 16)
            Divider()

            if taskStore.completedTasks.isEmpty {
                EmptyStateView(icon: "checkmark.circle", title: "Noch nichts erledigt", message: "Erledigte Aufgaben erscheinen hier.")
            } else {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 0, pinnedViews: .sectionHeaders) {
                        ForEach(groupedByDay, id: \.0) { day, tasks in
                            Section {
                                ForEach(tasks) { task in
                                    CompletedTaskRow(task: task)
                                    Divider().padding(.leading, 56)
                                }
                            } header: {
                                Text(day)
                                    .font(.caption).fontWeight(.semibold)
                                    .foregroundStyle(.secondary).textCase(.uppercase)
                                    .padding(.horizontal, 24).padding(.vertical, 8)
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

private struct CompletedTaskRow: View {
    @EnvironmentObject var taskStore: TaskStore
    let task: FocusTask

    var body: some View {
        HStack(spacing: 0) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundStyle(.green)
                .font(.title3)
                .frame(width: 36, height: 36)
                .padding(.leading, 12)

            VStack(alignment: .leading, spacing: 2) {
                Text(task.title)
                    .font(.body)
                    .foregroundStyle(.secondary)
                    .strikethrough()
                if let project = taskStore.project(for: task) {
                    HStack(spacing: 3) {
                        Circle().fill(project.colorName.color).frame(width: 5, height: 5)
                        Text(project.name).font(.caption).foregroundStyle(.tertiary)
                    }
                }
            }
            .padding(.vertical, 8)
            .padding(.leading, 8)

            Spacer()
        }
    }
}
