import SwiftUI

struct TaskFormView: View {
    @EnvironmentObject var taskStore: TaskStore
    @Environment(\.dismiss) var dismiss

    let task: FocusTask?

    @State private var title = ""
    @State private var notes = ""
    @State private var status: TaskStatus = .inbox
    @State private var priority: TaskPriority? = nil
    @State private var projectID: UUID? = nil
    @State private var deadline: Date = Date().addingTimeInterval(86400)
    @State private var hasDeadline = false
    @State private var reminder: Date = Date()
    @State private var hasReminder = false
    @State private var estimatedMinutes = 30
    @State private var hasEstimate = false
    @State private var tagsText = ""
    @State private var showingDeadlinePicker = false
    @State private var showingReminderPicker = false

    private static let deadlineFormatter: DateFormatter = {
        let f = DateFormatter()
        f.locale = Locale(identifier: "de_DE")
        f.dateFormat = "dd.MM.yyyy"
        return f
    }()

    private static let reminderFormatter: DateFormatter = {
        let f = DateFormatter()
        f.locale = Locale(identifier: "de_DE")
        f.dateFormat = "dd.MM.yyyy, HH:mm"
        return f
    }()

    private var isEditing: Bool { task != nil }

    init(task: FocusTask? = nil) { self.task = task }

    var body: some View {
        VStack(spacing: 0) {
            // Toolbar
            HStack {
                Button("Abbrechen") { dismiss() }
                    .keyboardShortcut(.escape, modifiers: [])
                Spacer()
                Text(isEditing ? "Aufgabe bearbeiten" : "Neue Aufgabe")
                    .font(.headline)
                Spacer()
                Button(isEditing ? "Speichern" : "Hinzufügen") { save() }
                    .fontWeight(.semibold)
                    .keyboardShortcut(.return, modifiers: .command)
                    .disabled(title.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            .padding()
            Divider()

            ScrollView {
                VStack(spacing: 14) {
                    // Title + Notes
                    FormSection {
                        TextField("Was muss erledigt werden?", text: $title)
                            .font(.body)
                            .textFieldStyle(.plain)
                        Divider()
                        TextField("Notizen (optional)", text: $notes, axis: .vertical)
                            .font(.callout)
                            .foregroundStyle(.secondary)
                            .textFieldStyle(.plain)
                            .lineLimit(2...6)
                    }

                    // Status, Priority, Project
                    FormSection {
                        FormRow(label: "Status") {
                            Picker("", selection: $status) {
                                ForEach(TaskStatus.allCases.filter { $0 != .archived }, id: \.self) {
                                    Text($0.displayName).tag($0)
                                }
                            }
                            .labelsHidden().pickerStyle(.menu)
                        }
                        Divider()
                        FormRow(label: "Priorität") {
                            Picker("", selection: $priority) {
                                Text("Keine").tag(Optional<TaskPriority>.none)
                                ForEach(TaskPriority.allCases, id: \.self) {
                                    Text($0.displayName).tag(Optional($0))
                                }
                            }
                            .labelsHidden().pickerStyle(.menu)
                        }
                        Divider()
                        FormRow(label: "Projekt") {
                            Picker("", selection: $projectID) {
                                Text("Kein Projekt").tag(Optional<UUID>.none)
                                ForEach(taskStore.projects) {
                                    Text($0.name).tag(Optional($0.id))
                                }
                            }
                            .labelsHidden().pickerStyle(.menu)
                        }
                    }

                    // Deadline, Reminder, Estimate
                    FormSection {
                        Toggle("Deadline", isOn: $hasDeadline)
                        if hasDeadline {
                            HStack {
                                Spacer()
                                Button {
                                    showingDeadlinePicker = true
                                } label: {
                                    HStack(spacing: 6) {
                                        Image(systemName: "calendar")
                                            .font(.caption)
                                            .foregroundStyle(.secondary)
                                        Text(Self.deadlineFormatter.string(from: deadline))
                                            .foregroundStyle(.primary)
                                    }
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 4)
                                    .background(.quaternary.opacity(0.6), in: RoundedRectangle(cornerRadius: 5))
                                }
                                .buttonStyle(.plain)
                                .popover(isPresented: $showingDeadlinePicker, arrowEdge: .top) {
                                    DatePicker("", selection: $deadline, displayedComponents: .date)
                                        .datePickerStyle(.graphical)
                                        .labelsHidden()
                                        .padding()
                                        .frame(width: 280)
                                }
                            }
                        }
                        Divider()
                        Toggle("Reminder", isOn: $hasReminder)
                        if hasReminder {
                            HStack {
                                Spacer()
                                Button {
                                    showingReminderPicker = true
                                } label: {
                                    HStack(spacing: 6) {
                                        Image(systemName: "bell")
                                            .font(.caption)
                                            .foregroundStyle(.secondary)
                                        Text(Self.reminderFormatter.string(from: reminder))
                                            .foregroundStyle(.primary)
                                    }
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 4)
                                    .background(.quaternary.opacity(0.6), in: RoundedRectangle(cornerRadius: 5))
                                }
                                .buttonStyle(.plain)
                                .popover(isPresented: $showingReminderPicker, arrowEdge: .top) {
                                    DatePicker("", selection: $reminder, displayedComponents: [.date, .hourAndMinute])
                                        .datePickerStyle(.graphical)
                                        .labelsHidden()
                                        .padding()
                                        .frame(width: 280)
                                }
                            }
                        }
                        Divider()
                        Toggle("Zeitschätzung", isOn: $hasEstimate)
                        if hasEstimate {
                            Picker("", selection: $estimatedMinutes) {
                                Text("15 Min").tag(15)
                                Text("30 Min").tag(30)
                                Text("45 Min").tag(45)
                                Text("1 Std").tag(60)
                                Text("1,5 Std").tag(90)
                                Text("2 Std").tag(120)
                                Text("3 Std").tag(180)
                                Text("4 Std").tag(240)
                            }
                            .labelsHidden().pickerStyle(.menu)
                        }
                    }

                    // Tags
                    FormSection {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Tags")
                                .font(.caption).foregroundStyle(.secondary).textCase(.uppercase)
                            TextField("z.B. Research, Meeting (kommagetrennt)", text: $tagsText)
                                .textFieldStyle(.plain).font(.callout)
                        }
                    }
                }
                .padding()
            }
        }
        .frame(width: 420)
        .frame(minHeight: 500)
        .onAppear { populate() }
    }

    private func populate() {
        guard let t = task else { return }
        title           = t.title
        notes           = t.notes
        status          = t.status
        priority        = t.priority
        projectID       = t.projectID
        hasDeadline     = t.deadline != nil
        deadline        = t.deadline ?? Date().addingTimeInterval(86400)
        hasReminder     = t.reminderDate != nil
        reminder        = t.reminderDate ?? Date()
        hasEstimate     = t.estimatedMinutes != nil
        estimatedMinutes = t.estimatedMinutes ?? 30
        tagsText        = t.tags.joined(separator: ", ")
    }

    private func save() {
        let trimmed = title.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        let tags = tagsText.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }.filter { !$0.isEmpty }

        if var existing = task {
            existing.title            = trimmed
            existing.notes            = notes
            existing.status           = status
            existing.priority         = priority
            existing.projectID        = projectID
            existing.deadline         = hasDeadline ? deadline : nil
            existing.reminderDate     = hasReminder ? reminder : nil
            existing.estimatedMinutes = hasEstimate ? estimatedMinutes : nil
            existing.tags             = tags
            if status == .today && existing.plannedDate == nil { existing.plannedDate = Date() }
            taskStore.updateTask(existing)
        } else {
            taskStore.addTask(FocusTask(
                title: trimmed, notes: notes, status: status,
                priority: priority, projectID: projectID, tags: tags,
                deadline: hasDeadline ? deadline : nil,
                reminderDate: hasReminder ? reminder : nil,
                estimatedMinutes: hasEstimate ? estimatedMinutes : nil,
                plannedDate: status == .today ? Date() : nil
            ))
        }
        dismiss()
    }
}

// MARK: - Helpers

private struct FormSection<Content: View>: View {
    @ViewBuilder let content: Content
    var body: some View {
        VStack(alignment: .leading, spacing: 10) { content }
            .padding()
            .background(.quaternary.opacity(0.4), in: RoundedRectangle(cornerRadius: 10))
    }
}

private struct FormRow<Trailing: View>: View {
    let label: String
    @ViewBuilder let trailing: Trailing
    var body: some View {
        HStack {
            Text(label).font(.callout)
            Spacer()
            trailing
        }
    }
}
