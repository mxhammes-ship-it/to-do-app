import SwiftUI

struct ViewHeader: View {
    let title: String
    let subtitle: String?
    let onAdd: () -> Void

    init(title: String, subtitle: String? = nil, onAdd: @escaping () -> Void) {
        self.title = title
        self.subtitle = subtitle
        self.onAdd = onAdd
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack(alignment: .bottom) {
                VStack(alignment: .leading, spacing: 3) {
                    Text(title)
                        .font(.largeTitle)
                        .fontWeight(.semibold)
                    if let subtitle {
                        Text(subtitle)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                }
                Spacer()
                GlassButton(systemImage: "plus", variant: .primary, action: onAdd)
            }
            .padding(.horizontal, 24)
            .padding(.top, 24)
            .padding(.bottom, 16)
            Divider()
        }
    }
}
