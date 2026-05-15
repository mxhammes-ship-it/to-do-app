import Foundation

struct FocusTask: Identifiable, Codable, Equatable {
    var id: UUID
    var title: String
    var notes: String
    var status: TaskStatus
    var priority: TaskPriority?
    var projectID: UUID?
    var tags: [String]
    var deadline: Date?
    var reminderDate: Date?
    var estimatedMinutes: Int?
    var createdAt: Date
    var completedAt: Date?
    var plannedDate: Date?

    init(
        id: UUID = UUID(),
        title: String,
        notes: String = "",
        status: TaskStatus = .inbox,
        priority: TaskPriority? = nil,
        projectID: UUID? = nil,
        tags: [String] = [],
        deadline: Date? = nil,
        reminderDate: Date? = nil,
        estimatedMinutes: Int? = nil,
        createdAt: Date = Date(),
        completedAt: Date? = nil,
        plannedDate: Date? = nil
    ) {
        self.id = id
        self.title = title
        self.notes = notes
        self.status = status
        self.priority = priority
        self.projectID = projectID
        self.tags = tags
        self.deadline = deadline
        self.reminderDate = reminderDate
        self.estimatedMinutes = estimatedMinutes
        self.createdAt = createdAt
        self.completedAt = completedAt
        self.plannedDate = plannedDate
    }
}

enum TaskStatus: String, Codable, CaseIterable {
    case inbox
    case planned
    case today
    case review
    case completed
    case archived

    var displayName: String {
        switch self {
        case .inbox: return "Inbox"
        case .planned: return "Geplant"
        case .today: return "Heute"
        case .review: return "Review"
        case .completed: return "Erledigt"
        case .archived: return "Archiviert"
        }
    }
}

enum TaskPriority: String, Codable, CaseIterable, Comparable {
    case high
    case medium
    case low

    var displayName: String {
        switch self {
        case .high: return "Hoch"
        case .medium: return "Mittel"
        case .low: return "Niedrig"
        }
    }

    var sortOrder: Int {
        switch self {
        case .high: return 0
        case .medium: return 1
        case .low: return 2
        }
    }

    static func < (lhs: TaskPriority, rhs: TaskPriority) -> Bool {
        lhs.sortOrder < rhs.sortOrder
    }
}
