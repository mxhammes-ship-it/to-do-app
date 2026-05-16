import SwiftUI

extension Color {
    // MARK: - Wallpaper / Window
    static let wallTop    = Color(red: 0.051, green: 0.086, blue: 0.071) // #0d1612
    static let wallBottom = Color(red: 0.039, green: 0.055, blue: 0.051) // #0a0e0d
    static let windowBg   = Color(red: 0.110, green: 0.118, blue: 0.114) // #1c1e1d

    // MARK: - Surfaces
    static let surface1 = Color.white.opacity(0.04)
    static let surface2 = Color.white.opacity(0.07)
    static let surface3 = Color.white.opacity(0.10)

    // MARK: - Dividers
    static let divider1 = Color.white.opacity(0.07)
    static let divider2 = Color.white.opacity(0.12)

    // MARK: - Text
    static let textPrimary    = Color.white.opacity(0.94)
    static let textSecondary  = Color.white.opacity(0.62)
    static let textTertiary   = Color.white.opacity(0.40)
    static let textQuaternary = Color.white.opacity(0.22)

    // MARK: - Accent (Forest Green)
    static let appAccent   = Color(red: 0.188, green: 0.780, blue: 0.475) // #30c779
    static let appAccent2  = Color(red: 0.110, green: 0.541, blue: 0.322) // #1c8a52
    static let appAccentBg = Color(red: 0.188, green: 0.780, blue: 0.475).opacity(0.14)

    // MARK: - Calendar / Outlook Blue
    static let calBlue = Color(red: 0.369, green: 0.624, blue: 1.000) // #5e9fff
    static let calBg   = Color(red: 0.369, green: 0.624, blue: 1.000).opacity(0.14)

    // MARK: - Warning
    static let warnOrange = Color(red: 1.000, green: 0.624, blue: 0.310) // #ff9f4f
    static let warnBg     = Color(red: 1.000, green: 0.624, blue: 0.310).opacity(0.12)

    // MARK: - Danger
    static let danger = Color(red: 1.000, green: 0.369, blue: 0.369) // #ff5e5e

    // MARK: - Priority
    static let priorityHigh   = Color.danger
    static let priorityMedium = Color.warnOrange
    static let priorityLow    = Color.calBlue
    static let priorityNone   = Color.white.opacity(0.22)
}
