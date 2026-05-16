import SwiftUI

struct DividerLine: View {
    var body: some View {
        Rectangle()
            .fill(Color.divider1)
            .frame(maxWidth: .infinity)
            .frame(height: 0.5)
    }
}
