import SwiftUI

struct SidebarView: View {
    @EnvironmentObject var taskStore: TaskStore
    @Binding var selectedItem: SidebarItem?
    @State private var showingNewProject = false

    var body: some View {
        List(selection: $selectedItem) {
            Section {
                SidebarRow(icon: "sun.max.fill",       title: "Heute",     color: .orange, badge: taskStore.todayTasks.count,   item: .section(.today))
                SidebarRow(icon: "tray.fill",           title: "Inbox",     color: .blue,   badge: taskStore.inboxTasks.count,   item: .section(.inbox))
                SidebarRow(icon: "calendar",            title: "Demnächst", color: .green,  badge: nil,                          item: .section(.upcoming))
            }

            Section {
                ForEach(taskStore.projects) { project in
                    SidebarRow(
                        icon: "folder.fill",
                        title: project.name,
                        color: project.colorName.color,
                        badge: nil,
                        item: .project(project.id)
                    )
                }
            } header: {
                HStack {
                    Text("Projekte")
                    Spacer()
                    Button { showingNewProject = true } label: {
                        Image(systemName: "plus")
                            .font(.caption.weight(.semibold))
                    }
                    .buttonStyle(.plain)
                }
            }

            Section("System") {
                SidebarRow(icon: "arrow.clockwise",       title: "Review",   color: .red,
                           badge: taskStore.reviewTasks.count > 0 ? taskStore.reviewTasks.count : nil,
                           item: .section(.review))
                SidebarRow(icon: "checkmark.circle.fill", title: "Erledigt", color: .gray, badge: nil, item: .section(.completed))
            }
        }
        .listStyle(.sidebar)
        .navigationTitle("FocusFlow")
        .frame(minWidth: 200)
        .sheet(isPresented: $showingNewProject) {
            NewProjectSheet(isPresented: $showingNewProject)
                .environmentObject(taskStore)
        }
    }
}

private struct SidebarRow: View {
    let icon: String
    let title: String
    let color: Color
    let badge: Int?
    let item: SidebarItem

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
                        .background(.quaternary, in: Capsule())
                }
            }
        } icon: {
            Image(systemName: icon)
                .foregroundStyle(color)
        }
        .tag(item)
    }
}
