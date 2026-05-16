import CoreGraphics

enum Spacing {
    // MARK: - Basis-Raster (4px-Vielfache)
    static let xxs: CGFloat = 2
    static let xs:  CGFloat = 4
    static let sm:  CGFloat = 8
    static let md:  CGFloat = 12
    static let lg:  CGFloat = 16
    static let xl:  CGFloat = 24
    static let xxl: CGFloat = 40

    // MARK: - App-spezifische Konstanten
    static let rowLeading:   CGFloat = 12  // Icon-Container padding leading
    static let iconFrame:    CGFloat = 36  // frame(width:36, height:36) Icon-Wrapper
    static let rowIndent:    CGFloat = 56  // Divider-Einrückung (rowLeading + iconFrame + 8)
    static let contentH:     CGFloat = 24  // horizontales Content-Padding
    static let headerTop:    CGFloat = 24  // padding top in Header-Bereichen
    static let headerBottom: CGFloat = 16  // padding bottom unter Header-Divider
    static let scrollBottom: CGFloat = 80  // Bottom-Padding Scroll-Listen (Spec: 80px)
}
