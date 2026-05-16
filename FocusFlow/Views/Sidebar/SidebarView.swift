import SwiftUI

struct SidebarView: View {
    @EnvironmentObject var taskStore: TaskStore
    @Binding var selectedSection: SidebarSection?

    var body: some View {
        List(selection: $selectedSection) {
            Section {
                SidebarRow(icon: "sun.max.fill",       title: "Heute",      color: Color.warnOrange, badge: taskStore.todayTasks.count,   section: .today)
                SidebarRow(icon: "tray.fill",           title: "Inbox",      color: Color.calBlue,    badge: taskStore.inboxTasks.count,   section: .inbox)
                SidebarRow(icon: "calendar",            title: "Demnächst",  color: Color.appAccent,  badge: nil,                          section: .upcoming)
            }

            Section("Projekte") {
                SidebarRow(icon: "folder.fill",         title: "Projekte",   color: .purple, badge: nil,                          section: .projects)
            }

            Section("System") {
                SidebarRow(icon: "arrow.clockwise",     title: "Review",     color: Color.danger,
                           badge: taskStore.reviewTasks.count > 0 ? taskStore.reviewTasks.count : nil,
                           section: .review)
                SidebarRow(icon: "checkmark.circle.fill", title: "Erledigt", color: Color.textTertiary, badge: nil, section: .completed)
            }
        }
        .listStyle(.sidebar)
        .navigationTitle("FocusFlow")
        .frame(minWidth: 200)
    }
}

private struct SidebarRow: View {
    let icon: String
    let title: String
    let color: Color
    let badge: Int?
    let section: SidebarSection

    var body: some View {
        Label {
            HStack {
                Text(title)
                Spacer()
                if let badge, badge > 0 {
                    Text("\(badge)")
                        .font(.caption2)
                        .fontWeight(.semibold)
                        .foregroundStyle(.secondary)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.surface2, in: Capsule())
                }
            }
        } icon: {
            Image(systemName: icon)
                .foregroundStyle(color)
        }
        .tag(section)
    }
}
