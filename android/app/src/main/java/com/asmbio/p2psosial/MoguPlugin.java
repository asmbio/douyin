package com.asmbio.p2psosial;


import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import mogu.Mogu;
@CapacitorPlugin(name = "Mogu")
public class MoguPlugin extends Plugin {
    @PluginMethod()
    public void start(PluginCall call){
        try{
            String pwd = call.getString("pwd");
            Mogu.startGrpcAndWeb(pwd);
            JSObject ret = new JSObject();
            ret.put("value", 1);
            call.resolve(ret);
        }catch (Exception e){
            call.reject( e.getMessage());
        }
    }
}
