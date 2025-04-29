import Foundation
import Capacitor
import UIKit

@objc(StatusBarHeightPlugin)
public class StatusBarHeightPlugin: CAPPlugin {
    @objc func getHeight(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let height = UIApplication.shared.statusBarFrame.size.height
            call.resolve(["height": height])
        }
    }
} 