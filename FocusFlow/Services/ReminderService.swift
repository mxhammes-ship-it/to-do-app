import Foundation

class ReminderService {
    static let shared = ReminderService()

    var onReminderFired: ((UUID) -> Void)?

    private var timers: [UUID: Timer] = [:]

    private init() {}

    func schedule(task: FocusTask, at date: Date) {
        cancel(taskID: task.id)
        let delay = date.timeIntervalSinceNow
        guard delay > 0 else { return }

        let taskID = task.id
        let timer = Timer(timeInterval: delay, repeats: false) { [weak self] _ in
            DispatchQueue.main.async {
                self?.onReminderFired?(taskID)
            }
        }
        RunLoop.main.add(timer, forMode: .common)
        timers[taskID] = timer
    }

    func cancel(taskID: UUID) {
        timers[taskID]?.invalidate()
        timers[taskID] = nil
    }
}
