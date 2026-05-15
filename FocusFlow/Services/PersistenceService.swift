import Foundation

struct AppData: Codable {
    var tasks: [FocusTask]
    var projects: [Project]
}

class PersistenceService {
    private let fileURL: URL

    init() {
        let appSupport = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        let appFolder = appSupport.appendingPathComponent("FocusFlow", isDirectory: true)
        try? FileManager.default.createDirectory(at: appFolder, withIntermediateDirectories: true)
        fileURL = appFolder.appendingPathComponent("data.json")
    }

    func save(tasks: [FocusTask], projects: [Project]) {
        let data = AppData(tasks: tasks, projects: projects)
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        guard let encoded = try? encoder.encode(data) else { return }
        try? encoded.write(to: fileURL, options: .atomic)
    }

    func load() -> AppData {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        guard let data = try? Data(contentsOf: fileURL),
              let decoded = try? decoder.decode(AppData.self, from: data) else {
            return AppData(tasks: [], projects: [])
        }
        return decoded
    }
}
