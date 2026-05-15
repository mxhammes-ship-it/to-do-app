import Foundation
import UserNotifications

class ReminderService: NSObject, UNUserNotificationCenterDelegate {
    static let shared = ReminderService()

    var onReminderFired: ((UUID) -> Void)?

    private override init() {
        super.init()
        UNUserNotificationCenter.current().delegate = self
        requestPermission()
    }

    func requestPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { _, _ in }
    }

    func schedule(task: FocusTask, at date: Date) {
        guard date > Date() else { return }

        let content = UNMutableNotificationContent()
        content.title = "FocusFlow"
        content.body = task.title
        content.sound = .default
        content.userInfo = ["taskID": task.id.uuidString]

        let components = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: date)
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
        let request = UNNotificationRequest(identifier: task.id.uuidString, content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(request)
    }

    func cancel(taskID: UUID) {
        let id = taskID.uuidString
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [id])
        UNUserNotificationCenter.current().removeDeliveredNotifications(withIdentifiers: [id])
    }

    // Show overlay when notification fires while app is in foreground
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        if let idString = notification.request.content.userInfo["taskID"] as? String,
           let uuid = UUID(uuidString: idString) {
            DispatchQueue.main.async { self.onReminderFired?(uuid) }
        }
        completionHandler([])
    }

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        if let idString = response.notification.request.content.userInfo["taskID"] as? String,
           let uuid = UUID(uuidString: idString) {
            DispatchQueue.main.async { self.onReminderFired?(uuid) }
        }
        completionHandler()
    }
}
