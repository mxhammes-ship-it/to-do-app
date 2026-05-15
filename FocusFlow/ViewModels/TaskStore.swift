import Foundation
import Combine

@MainActor
class TaskStore: ObservableObject {
    @Published var tasks: [FocusTask] = []
    @Published var projects: [Project] = []

    private let persistence = PersistenceService()

    init() {
        load()
        checkForReviewTasks()
        scheduleEndOfDayCheck()
        setupReminderCallback()
    }

    // MARK: - Computed Lists

    var inboxTasks: [FocusTask] {
        tasks.filter { $0.status == .inbox }
            .sorted { $0.createdAt > $1.createdAt }
    }

    var todayTasks: [FocusTask] {
        tasks.filter { $0.status == .today }
            .sorted {
                let p0 = $0.priority?.sortOrder ?? 99
                let p1 = $1.priority?.sortOrder ?? 99
                if p0 != p1 { return p0 < p1 }
                return ($0.deadline ?? .distantFuture) < ($1.deadline ?? .distantFuture)
            }
    }

    var upcomingTasks: [FocusTask] {
        let tomorrow = Calendar.current.startOfDay(for: Date().addingTimeInterval(86400))
        return tasks.filter { task in
            (task.status == .planned || task.status == .today) &&
            (task.plannedDate ?? task.deadline ?? .distantFuture) >= tomorrow
        }
        .sorted {
            ($0.plannedDate ?? $0.deadline ?? .distantFuture) <
            ($1.plannedDate ?? $1.deadline ?? .distantFuture)
        }
    }

    var reviewTasks: [FocusTask] {
        tasks.filter { $0.status == .review }
            .sorted { $0.createdAt < $1.createdAt }
    }

    var completedTasks: [FocusTask] {
        tasks.filter { $0.status == .completed }
            .sorted { ($0.completedAt ?? $0.createdAt) > ($1.completedAt ?? $1.createdAt) }
    }

    // MARK: - Task Operations

    func addTask(_ task: FocusTask) {
        tasks.append(task)
        save()
        if let date = task.reminderDate { ReminderService.shared.schedule(task: task, at: date) }
    }

    func updateTask(_ task: FocusTask) {
        guard let idx = tasks.firstIndex(where: { $0.id == task.id }) else { return }
        tasks[idx] = task
        save()
        ReminderService.shared.cancel(taskID: task.id)
        if let date = task.reminderDate, task.status != .completed {
            ReminderService.shared.schedule(task: task, at: date)
        }
    }

    func completeTask(_ task: FocusTask) {
        var updated = task
        updated.status = .completed
        updated.completedAt = Date()
        updateTask(updated)
    }

    func deleteTask(_ task: FocusTask) {
        tasks.removeAll { $0.id == task.id }
        ReminderService.shared.cancel(taskID: task.id)
        save()
    }

    func moveToToday(_ task: FocusTask) {
        var updated = task
        updated.status = .today
        updated.plannedDate = Date()
        updateTask(updated)
    }

    func moveToPlanned(_ task: FocusTask, on date: Date) {
        var updated = task
        updated.status = .planned
        updated.plannedDate = date
        updateTask(updated)
    }

    // MARK: - Projects

    func addProject(_ project: Project) {
        projects.append(project)
        save()
    }

    func updateProject(_ project: Project) {
        guard let idx = projects.firstIndex(where: { $0.id == project.id }) else { return }
        projects[idx] = project
        save()
    }

    func deleteProject(_ project: Project) {
        projects.removeAll { $0.id == project.id }
        save()
    }

    func tasksForProject(_ project: Project) -> [FocusTask] {
        tasks.filter { $0.projectID == project.id && $0.status != .archived }
            .filter { $0.status != .completed }
    }

    func project(for task: FocusTask) -> Project? {
        guard let pid = task.projectID else { return nil }
        return projects.first { $0.id == pid }
    }

    // MARK: - Review Logic

    func checkForReviewTasks() {
        let startOfToday = Calendar.current.startOfDay(for: Date())
        var changed = false
        for i in tasks.indices {
            guard tasks[i].status == .today else { continue }
            if let planned = tasks[i].plannedDate, planned < startOfToday {
                tasks[i].status = .review
                changed = true
            }
        }
        if changed { save() }
    }

    private func scheduleEndOfDayCheck() {
        let now = Date()
        let tomorrow = Calendar.current.startOfDay(for: now.addingTimeInterval(86400))
        let delay = tomorrow.timeIntervalSince(now)
        DispatchQueue.main.asyncAfter(deadline: .now() + delay) { [weak self] in
            self?.checkForReviewTasks()
            self?.scheduleEndOfDayCheck()
        }
    }

    // MARK: - Reminder Callback

    private func setupReminderCallback() {
        ReminderCenter.shared.store = self
        ReminderService.shared.onReminderFired = { [weak self] taskID in
            guard let self else { return }
            if let task = self.tasks.first(where: { $0.id == taskID }) {
                ReminderCenter.shared.present(task: task)
            }
        }
    }

    // MARK: - Persistence

    func save() {
        persistence.save(tasks: tasks, projects: projects)
    }

    private func load() {
        let data = persistence.load()
        tasks = data.tasks
        projects = data.projects
        if tasks.isEmpty { loadSampleData() }
    }

    // MARK: - Sample Data

    private func loadSampleData() {
        let work = Project(name: "Arbeit", colorName: .blue)
        let personal = Project(name: "Privat", colorName: .green)
        projects = [work, personal]

        let cal = Calendar.current
        let now = Date()

        tasks = [
            FocusTask(
                title: "Q3 Roadmap Review vorbereiten",
                notes: "Slides aktualisieren und KPIs prüfen",
                status: .today,
                priority: .high,
                projectID: work.id,
                deadline: cal.date(byAdding: .day, value: 1, to: now),
                reminderDate: cal.date(bySettingHour: 9, minute: 0, second: 0, of: now),
                estimatedMinutes: 60,
                plannedDate: now
            ),
            FocusTask(
                title: "Stakeholder Meeting Agenda erstellen",
                notes: "Für Weekly am Donnerstag",
                status: .today,
                priority: .medium,
                projectID: work.id,
                deadline: now,
                estimatedMinutes: 30,
                plannedDate: now
            ),
            FocusTask(
                title: "User Research Findings dokumentieren",
                status: .inbox,
                priority: .high,
                projectID: work.id,
                tags: ["Research", "Docs"]
            ),
            FocusTask(
                title: "Sprint Planning vorbereiten",
                status: .planned,
                priority: .medium,
                projectID: work.id,
                deadline: cal.date(byAdding: .day, value: 3, to: now),
                plannedDate: cal.date(byAdding: .day, value: 2, to: now)
            ),
            FocusTask(
                title: "Arzttermin buchen",
                status: .inbox,
                priority: .low,
                projectID: personal.id
            ),
            FocusTask(
                title: "Weekly Review durchführen",
                status: .inbox,
                tags: ["Review"]
            ),
        ]

        save()
    }
}
