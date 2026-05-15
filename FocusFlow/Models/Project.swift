import SwiftUI

struct Project: Identifiable, Codable, Equatable {
    var id: UUID
    var name: String
    var colorName: ProjectColor
    var createdAt: Date

    init(id: UUID = UUID(), name: String, colorName: ProjectColor = .blue, createdAt: Date = Date()) {
        self.id = id
        self.name = name
        self.colorName = colorName
        self.createdAt = createdAt
    }
}

enum ProjectColor: String, Codable, CaseIterable {
    case blue, green, orange, purple, red, teal, yellow, pink

    var displayName: String { rawValue.capitalized }

    var color: Color {
        switch self {
        case .blue:   return .blue
        case .green:  return .green
        case .orange: return .orange
        case .purple: return .purple
        case .red:    return .red
        case .teal:   return .teal
        case .yellow: return .yellow
        case .pink:   return .pink
        }
    }
}
