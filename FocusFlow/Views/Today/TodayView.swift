import SwiftUI

struct TodayView: View {
    @EnvironmentObject var taskStore: TaskStore
    @Binding var taskToEdit: FocusTask?
    @Binding var showingTaskForm: Bool

    private var greeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 5..<12:  return "Guten Morgen"
        case 12..<17: return "Guten Tag"
        case 17..<21: return "Guten Abend"
        default:      return "Hallo"
        }
    }

    private var dateString: String {
        let f = DateFormatter()
        f.locale = Locale(identifier: "de_DE")
        f.dateFormat = "EEEE, d. MMMM"
        return f.string(from: Date())
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack(alignment: .bottom) {
                VStack(alignment: .leading, spacing: 3) {
                    Text(greeting)
                        .font(.largeTitle)
                        .fontWeight(.semibold)
                    Text(dateString)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                Button {
                    taskToEdit = nil
                    showingTaskForm = true
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .font(.title2)
                        .foregroundStyle(.blue)
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 24)
            .padding(.top, 24)
            .padding(.bottom, 16)

            Divider()

            if taskStore.todayTasks.isEmpty {
                EmptyStateView(
                    icon: "sun.max",
                    title: "Keine Aufgaben für heute",
                    message: "Verschiebe Aufgaben aus der Inbox hierher oder erstelle eine neue."
                )
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(taskStore.todayTasks) { task in
                            TaskRowView(task: task) {
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
