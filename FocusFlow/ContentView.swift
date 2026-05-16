import SwiftUI

enum SidebarItem: Hashable {
    case section(SidebarSection)
    case project(UUID)
}

enum SidebarSection: String, Hashable, CaseIterable {
    case today     = "Heute"
    case inbox     = "Inbox"
    case upcoming  = "Demnächst"
    case review    = "Review"
    case completed = "Erledigt"
}

struct ContentView: View {
    @EnvironmentObject var taskStore: TaskStore
    @State private var selectedItem: SidebarItem? = .section(.today)
    @State private var showingTaskForm = false
    @State private var taskToEdit: FocusTask? = nil

    var body: some View {
        NavigationSplitView {
            SidebarView(selectedItem: $selectedItem)
        } detail: {
            VStack(spacing: 0) {
                detailView
                Divider()
                QuickEntryBar()
            }
        }
        .navigationSplitViewStyle(.balanced)
        .sheet(isPresented: $showingTaskForm, onDismiss: { taskToEdit = nil }) {
            TaskFormView(task: taskToEdit)
                .environmentObject(taskStore)
        }
        .onReceive(NotificationCenter.default.publisher(for: .newTaskRequested)) { _ in
            taskToEdit = nil
            showingTaskForm = true
        }
    }

    @ViewBuilder
    private var detailView: some View {
        switch selectedItem ?? .section(.today) {
        case .section(.today):
            TodayView(taskToEdit: $taskToEdit, showingTaskForm: $showingTaskForm)
        case .section(.inbox):
            InboxView(taskToEdit: $taskToEdit, showingTaskForm: $showingTaskForm)
        case .section(.upcoming):
            UpcomingView(taskToEdit: $taskToEdit, showingTaskForm: $showingTaskForm)
        case .section(.review):
            ReviewView(taskToEdit: $taskToEdit, showingTaskForm: $showingTaskForm)
        case .section(.completed):
            CompletedView()
        case .project(let id):
            if let project = taskStore.projects.first(where: { $0.id == id }) {
                ProjectInlineView(project: project, taskToEdit: $taskToEdit, showingTaskForm: $showingTaskForm)
            }
        }
    }
}

private struct QuickEntryBar: View {
    @EnvironmentObject var taskStore: TaskStore
    @State private var text = ""

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: "plus.circle")
                .foregroundStyle(.secondary)
                .font(.body)
            TextField("Neue Aufgabe zur Inbox hinzufügen…", text: $text)
                .textFieldStyle(.plain)
                .onSubmit { submit() }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
    }

    private func submit() {
        let trimmed = text.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        taskStore.addTask(FocusTask(title: trimmed))
        text = ""
    }
}
