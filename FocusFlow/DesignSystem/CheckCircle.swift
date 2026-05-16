import SwiftUI

struct CheckCircle: View {
    enum Size {
        case sm, md, lg
        var diameter: CGFloat {
            switch self { case .sm: return 16; case .md: return 18; case .lg: return 20 }
        }
    }

    let isCompleted: Bool
    var size: Size = .md
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            ZStack {
                Circle()
                    .fill(isCompleted ? Color.appAccent : .clear)
                    .frame(width: size.diameter, height: size.diameter)

                Circle()
                    .strokeBorder(
                        isCompleted ? Color.clear : Color.priorityNone,
                        lineWidth: 1.5
                    )
                    .frame(width: size.diameter, height: size.diameter)

                if isCompleted {
                    Image(systemName: "checkmark")
                        .font(.system(size: size.diameter * 0.5, weight: .bold))
                        .foregroundStyle(.white)
                        .transition(.scale(scale: 0.6).combined(with: .opacity))
                }
            }
            .animation(.spring(response: 0.15, dampingFraction: 0.85), value: isCompleted)
            .frame(width: 36, height: 36)
        }
        .buttonStyle(.plain)
    }
}
