import SwiftUI

struct ProjectsView: View {
    @EnvironmentObject var taskStore: TaskStore
    @Binding var taskToEdit: FocusTask?
    @Binding var showingTaskForm: Bool

    @State private var selectedProject: Project? = nil
    @State private var showingNewProject = false
    @State private var newProjectName = ""
    @State private var newProjectColor: ProjectColor = .blue

    var body: some View {
        VStack(spacing: 0) {
            ViewHeader(title: "Projekte", onAdd: { showingNewProject = true })

            if taskStore.projects.isEmpty {
                EmptyStateView(icon: "folder", title: "Keine Projekte", message: "Erstelle dein erstes Projekt.")
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(taskStore.projects) { project in
                            ProjectRow(project: project, taskCount: taskStore.tasksForProject(project).count)
                                .onTapGesture { selectedProject = project }
                            Divider().padding(.leading, 56)
                        }
                    }
                    .padding(.bottom, 24)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        .sheet(item: $selectedProject) { project in
            ProjectDetailView(project: project, taskToEdit: $taskToEdit, showingTaskForm: $showingTaskForm)
                .environmentObject(taskStore)
        }
        .sheet(isPresented: $showingNewProject) {
            NewProjectSheet(isPresented: $showingNewProject)
                .environmentObject(taskStore)
        }
    }
}

private struct ProjectRow: View {
    let project: Project
    let taskCount: Int

    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(project.colorName.color.opacity(0.15))
                    .frame(width: 36, height: 36)
                Image(systemName: "folder.fill")
                    .foregroundStyle(project.colorName.color)
                    .font(.body)
            }
            .padding(.leading, 12)

            VStack(alignment: .leading, spacing: 2) {
                Text(project.name).font(.body)
                Text("\(taskCount) offene Aufgaben")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundStyle(.tertiary)
                .padding(.trailing, 16)
        }
        .padding(.vertical, 10)
        .contentShape(Rectangle())
    }
}

struct ProjectDetailView: View {
    @EnvironmentObject var taskStore: TaskStore
    @Environment(\.dismiss) var dismiss
    let project: Project
    @Binding var taskToEdit: FocusTask?
    @Binding var showingTaskForm: Bool

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button("Schliessen") { dismiss() }
                Spacer()
                Label(project.name, systemImage: "folder.fill")
                    .foregroundStyle(project.colorName.color)
                    .font(.headline)
                Spacer()
                Button {
                    taskToEdit = nil
                    showingTaskForm = true
                    dismiss()
                } label: {
                    Image(systemName: "plus")
                }
            }
            .padding()
            Divider()

            let tasks = taskStore.tasksForProject(project)
            if tasks.isEmpty {
                EmptyStateView(icon: "checkmark.circle", title: "Keine offenen Aufgaben", message: "Alle Aufgaben in diesem Projekt sind erledigt.")
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(tasks) { task in
                            TaskRowView(task: task) {
                                taskToEdit = task
                                showingTaskForm = true
                                dismiss()
                            }
                            Divider().padding(.leading, 56)
                        }
                    }
                }
            }
        }
        .frame(width: 520, height: 480)
    }
}

struct NewProjectSheet: View {
    @EnvironmentObject var taskStore: TaskStore
    @Binding var isPresented: Bool
    @State private var name = ""
    @State private var color: ProjectColor = .blue

    var body: some View {
        VStack(spacing: 20) {
            Text("Neues Projekt").font(.headline)
            TextField("Projektname", text: $name)
                .textFieldStyle(.roundedBorder)

            HStack {
                Text("Farbe").foregroundStyle(.secondary)
                Spacer()
                HStack(spacing: 8) {
                    ForEach(ProjectColor.allCases, id: \.self) { c in
                        Circle()
                            .fill(c.color)
                            .frame(width: 20, height: 20)
                            .overlay(Circle().stroke(color == c ? Color.primary : .clear, lineWidth: 2))
                            .onTapGesture { color = c }
                    }
                }
            }

            HStack {
                Button("Abbrechen") { isPresented = false }
                Spacer()
                Button("Erstellen") {
                    guard !name.trimmingCharacters(in: .whitespaces).isEmpty else { return }
                    taskStore.addProject(Project(name: name, colorName: color))
                    isPresented = false
                }
                .buttonStyle(.borderedProminent)
                .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
            }
        }
        .padding(24)
        .frame(width: 340)
    }
}

// MARK: - Inline Project Detail

struct ProjectInlineView: View {
    @EnvironmentObject var taskStore: TaskStore
    let project: Project
    @Binding var taskToEdit: FocusTask?
    @Binding var showingTaskForm: Bool

    private var tasks: [FocusTask] { taskStore.tasksForProject(project) }

    var body: some View {
        VStack(spacing: 0) {
            ViewHeader(
                title: project.name,
                subtitle: tasks.isEmpty ? "Keine offenen Aufgaben" : "\(tasks.count) offene Aufgaben",
                onAdd: { taskToEdit = nil; showingTaskForm = true }
            )

            if tasks.isEmpty {
                EmptyStateView(
                    icon: "checkmark.circle",
                    title: "Keine offenen Aufgaben",
                    message: "Alle Aufgaben in diesem Projekt sind erledigt."
                )
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(tasks) { task in
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
