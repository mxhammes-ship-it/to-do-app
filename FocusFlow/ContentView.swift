import SwiftUI

enum SidebarSection: String, Hashable, CaseIterable {
    case today     = "Heute"
    case inbox     = "Inbox"
    case upcoming  = "Demnächst"
    case projects  = "Projekte"
    case review    = "Review"
    case completed = "Erledigt"
}

struct ContentView: View {
    @EnvironmentObject var taskStore: TaskStore
    @State private var selectedSection: SidebarSection? = .today
    @State private var showingTaskForm = false
    @State private var taskToEdit: FocusTask? = nil

    var body: some View {
        NavigationSplitView {
            SidebarView(selectedSection: $selectedSection)
        } detail: {
            detailView
        }
        .navigationSplitViewStyle(.balanced)
        .sheet(isPresented: $showingTaskForm, onDismiss: { taskToEdit = nil }) {
            TaskFormView(task: taskToEdit)
                .environmentObject(taskStore)
        }
        .sheet(item: $taskStore.activeReminderTask) { task in
            ReminderSheetView(task: task)
                .environmentObject(taskStore)
        }
        .onReceive(NotificationCenter.default.publisher(for: .newTaskRequested)) { _ in
            taskToEdit = nil
            showingTaskForm = true
        }
    }

    @ViewBuilder
    private var detailView: some View {
        switch selectedSection ?? .today {
        case .today:
            TodayView(taskToEdit: $taskToEdit, showingTaskForm: $showingTaskForm)
        case .inbox:
            InboxView(taskToEdit: $taskToEdit, showingTaskForm: $showingTaskForm)
        case .upcoming:
            UpcomingView(taskToEdit: $taskToEdit, showingTaskForm: $showingTaskForm)
        case .projects:
            ProjectsView(taskToEdit: $taskToEdit, showingTaskForm: $showingTaskForm)
        case .review:
            ReviewView(taskToEdit: $taskToEdit, showingTaskForm: $showingTaskForm)
        case .completed:
            CompletedView()
        }
    }
}
