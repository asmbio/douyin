package com.asmbio.p2psosial;

import android.content.res.Resources;
import android.util.DisplayMetrics;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "StatusBarHeight")
public class StatusBarHeightPlugin extends Plugin {
    @PluginMethod
    public void getHeight(PluginCall call) {
        Resources resources = getContext().getResources();
        int resourceId = resources.getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            int height = resources.getDimensionPixelSize(resourceId);
            JSObject ret = new JSObject();
            ret.put("height", height);
            call.resolve(ret);
        } else {
            call.reject("Status bar height not found");
        }
    }
    
    @PluginMethod
    public void getHeightWithInfo(PluginCall call) {
        Resources resources = getContext().getResources();
        DisplayMetrics displayMetrics = resources.getDisplayMetrics();
        float density = displayMetrics.density;
        
        int resourceId = resources.getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            int heightPx = resources.getDimensionPixelSize(resourceId);
            float heightDp = heightPx / density;
            
            JSObject ret = new JSObject();
            ret.put("heightPx", heightPx);
            ret.put("heightDp", heightDp);
            ret.put("density", density);
            ret.put("unit", "px");
            call.resolve(ret);
        } else {
            call.reject("Status bar height not found");
        }
    }
} 