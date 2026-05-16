import SwiftUI

struct AuroraWallpaper: View {
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [.wallTop, .wallBottom],
                startPoint: UnitPoint(x: 0.15, y: 0.0),
                endPoint: UnitPoint(x: 0.85, y: 1.0)
            )

            VStack {
                HStack {
                    Ellipse()
                        .fill(Color.appAccent.opacity(0.20))
                        .frame(width: 420, height: 380)
                        .blur(radius: 40)
                        .offset(x: -60, y: -40)
                    Spacer()
                }
                Spacer()
                HStack {
                    Spacer()
                    Ellipse()
                        .fill(Color(red: 0.102, green: 0.302, blue: 0.439).opacity(0.67))
                        .frame(width: 460, height: 420)
                        .blur(radius: 50)
                        .offset(x: 40, y: 40)
                }
            }

            Circle()
                .fill(Color.appAccent.opacity(0.10))
                .frame(width: 240, height: 240)
                .blur(radius: 60)
        }
        .ignoresSafeArea()
        .drawingGroup()
    }
}
