import SwiftUI

struct GlassButton: View {
    enum Variant { case primary, secondary }

    let systemImage: String
    var label: String? = nil
    var variant: Variant = .secondary
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Image(systemName: systemImage)
                if let label { Text(label) }
            }
            .font(.system(size: 13, weight: .medium))
            .foregroundStyle(variant == .primary ? .white : Color.textPrimary)
            .padding(.horizontal, label != nil ? 12 : 0)
            .frame(width: label == nil ? 30 : nil, height: 30)
            .background(Capsule().fill(variant == .primary ? Color.appAccent : Color.surface2))
            .overlay(Capsule().strokeBorder(
                variant == .primary ? Color.appAccent2 : Color.divider2,
                lineWidth: 0.5
            ))
            .overlay(alignment: .top) {
                Capsule()
                    .fill(Color.white.opacity(0.08))
                    .frame(height: 1)
                    .padding(.horizontal, 1)
            }
        }
        .buttonStyle(.plain)
    }
}
