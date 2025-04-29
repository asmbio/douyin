#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN macro.
CAP_PLUGIN(StatusBarHeightPlugin, "StatusBarHeight",
           CAP_PLUGIN_METHOD(getHeight, CAPPluginReturnPromise);
) 